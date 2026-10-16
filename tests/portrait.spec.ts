import { test, expect, type Page } from "@playwright/test";

async function portraitBox(page: Page) {
  return page.locator(".hero-portrait img").evaluate((image) => {
    const { x, y, width, height } = image.getBoundingClientRect();
    return { x, y, width, height };
  });
}

async function expectScreenshotPosition(page: Page) {
  const actual = await portraitBox(page);
  // Approved screenshot: 1905 × 945 content area (browser chrome excluded).
  const expected = { x: 549.705, y: -15.24, width: 1047.75, height: 1571.625 };
  for (const key of Object.keys(expected) as (keyof typeof expected)[]) {
    expect(Math.abs(actual[key] - expected[key]), key).toBeLessThan(1);
  }
  await expect(page.locator(".hero-portrait img")).toHaveCSS(
    "position",
    "absolute",
  );
  expect(
    await page.locator(".hero-portrait img").evaluate((image) => ({
      width: (image as HTMLImageElement).style.width,
      height: (image as HTMLImageElement).style.height,
    })),
  ).toEqual({ width: "100%", height: "100%" });
}

for (const deviceScaleFactor of [1, 2]) {
  test.describe(`portrait at pixel density ${deviceScaleFactor}`, () => {
    test.use({
      viewport: { width: 1905, height: 945 },
      deviceScaleFactor,
      reducedMotion: "no-preference",
    });
    test("keeps the approved position across intro completion, warm reload, uncached reload and skipped intro", async ({
      page,
    }) => {
      test.setTimeout(45000);
      await page.goto("/");
      await expect(page.locator("html")).toHaveAttribute(
        "data-motion-ready",
        "true",
      );
      await expect(page.locator(".hero-portrait-reveal")).toHaveCSS(
        "opacity",
        "1",
      );
      // Verify the settled entrance frame and the cleanup frame agree.
      await expectScreenshotPosition(page);
      await expect(page.locator("html")).toHaveAttribute(
        "data-intro",
        "complete",
      );
      await expectScreenshotPosition(page);

      await page.reload();
      await expect(page.locator("html")).toHaveAttribute(
        "data-intro",
        "complete",
      );
      await expectScreenshotPosition(page);
      const cdp = await page.context().newCDPSession(page);
      await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
      await page.reload();
      await expect(page.locator("html")).toHaveAttribute(
        "data-intro",
        "complete",
      );
      await expectScreenshotPosition(page);
      await cdp.detach();

      // Changing the query ensures this is a new document, not a hash-only jump.
      await page.goto("/?portrait-check=skip#home");
      await expect(page.locator("html")).toHaveAttribute(
        "data-motion-ready",
        "true",
      );
      await expect(page.locator(".intro-loader")).toBeHidden();
      await expectScreenshotPosition(page);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await expect(page.locator("html")).not.toHaveAttribute(
        "data-desktop-motion",
      );
      await expectScreenshotPosition(page);
    });
  });
}

test("resizing during the intro retains image sizing on mobile and after returning to desktop", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1905, height: 945 });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-intro", "playing");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".intro-loader")).toBeHidden();
  await expect(page.locator(".hero-portrait img")).toHaveCSS(
    "position",
    "absolute",
  );
  const mobile = await portraitBox(page);
  const frame = (await page.locator(".hero-portrait").boundingBox())!;
  expect(Math.abs(mobile.width - frame.width)).toBeLessThan(1);
  expect(Math.abs(mobile.height - frame.height)).toBeLessThan(1);
  await page.setViewportSize({ width: 1905, height: 945 });
  await expect(page.locator("html")).toHaveAttribute(
    "data-desktop-motion",
    "true",
  );
  await expectScreenshotPosition(page);
});
