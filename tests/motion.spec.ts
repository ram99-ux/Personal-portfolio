import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.use({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "no-preference",
});

test("opening letters rise in sequence, dock into the hero, and reveal the portrait", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect
    .poll(() =>
      page.locator(".intro-name .wordmark-letter").evaluateAll((letters) => {
        const y = letters.map(
          (letter) => new DOMMatrix(getComputedStyle(letter).transform).m42,
        );
        return y[0] < 250 && y[0] > 0 && y.at(-1)! > y[0] + 20;
      }),
    )
    .toBe(true);
  const centre = (await page.locator(".intro-name").boundingBox())!;
  expect(centre.y).toBeGreaterThan(250);
  await page.screenshot({ path: "artifacts/motion-opening-letters.png" });
  await expect(page.locator("html")).toHaveAttribute("data-intro", "complete");
  await expect(page.locator(".intro-loader")).toBeHidden();
  await expect(page.locator(".hero-wordmark > svg")).toHaveCSS("opacity", "1");
  await expect(page.locator(".hero-portrait img")).toHaveCSS("opacity", "1");
  expect((await page.locator(".hero-wordmark").boundingBox())!.y).toBeLessThan(
    80,
  );
});

test("wheel scroll morphs the hero into the sidebar and reverses cleanly", async ({
  page,
}) => {
  await page.goto("/#home");
  await expect(page.locator("html")).toHaveAttribute(
    "data-desktop-motion",
    "true",
  );
  const fullWidth = (await page.locator(".hero-wordmark").boundingBox())!.width;
  await page.mouse.wheel(0, 650);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(620);
  await expect
    .poll(
      async () => (await page.locator(".hero-wordmark").boundingBox())!.width,
    )
    .toBeLessThan(fullWidth * 0.8);
  expect(
    (await page.locator(".hero-wordmark").boundingBox())!.width,
  ).toBeGreaterThan(fullWidth * 0.3);
  expect((await page.locator(".hero-stage").boundingBox())!.y).toBe(0);
  await page.screenshot({ path: "artifacts/motion-hero-midpoint.png" });
  await page.mouse.wheel(0, 900);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(1490);
  await expect(page.locator(".sidebar-intro")).toHaveCSS("opacity", "1");
  await expect(page.locator(".sidebar")).not.toHaveAttribute("inert");
  await expect(page.locator(".hero-wordmark")).toHaveCSS("opacity", "0");
  await page.mouse.wheel(0, -3000);
  await expect
    .poll(
      async () => (await page.locator(".hero-wordmark").boundingBox())!.width,
    )
    .toBeGreaterThan(fullWidth - 2);
  await expect(page.locator(".hero-portrait")).toHaveCSS(
    "filter",
    /^(none|blur\(0px\))$/,
  );
  await expect(page.locator(".hero-nav a").last()).toHaveCSS("opacity", "1");
  await expect(page.locator(".sidebar-intro")).toHaveCSS("opacity", "0");
  await expect(page.locator(".sidebar")).toHaveAttribute("inert");
});

test("journey cards roll their years, reveal content, and reset when scrolled back", async ({
  page,
}) => {
  await page.goto("/#home");
  const card = page.locator(".journey-card").first();
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveCSS("opacity", "1");
  await expect
    .poll(() =>
      card
        .locator(".journey-digit")
        .last()
        .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42),
    )
    .toBe(-450);
  await expect(card.locator(".small-button")).toHaveCSS("opacity", "1");
  const drawn = await page
    .locator(".journey-progress")
    .evaluate((el) => parseFloat(getComputedStyle(el).strokeDashoffset));
  await page.evaluate(() => scrollBy(0, 1000));
  await expect
    .poll(() =>
      page
        .locator(".journey-progress")
        .evaluate((el) => parseFloat(getComputedStyle(el).strokeDashoffset)),
    )
    .toBeLessThan(drawn - 100);
  await page.evaluate(() => scrollTo(0, 0));
  await expect(card).toHaveCSS("opacity", "0");
  await expect
    .poll(() =>
      card
        .locator(".journey-digit")
        .last()
        .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42),
    )
    .toBe(0);
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveCSS("opacity", "1");
});

test("capability characters fill progressively and dim again on reverse scroll", async ({
  page,
}) => {
  await page.goto("/#home");
  await expect(page.locator(".capability-char").first()).toBeAttached();
  await expect(page.locator("html")).toHaveAttribute(
    "data-motion-ready",
    "true",
  );
  const geometry = await page
    .locator(".capability-statement")
    .evaluate((el) => ({
      top: el.getBoundingClientRect().top + scrollY,
      height: el.getBoundingClientRect().height,
    }));
  const count = () =>
    page
      .locator(".capability-char")
      .evaluateAll(
        (chars) =>
          chars.filter((el) => Number(getComputedStyle(el).opacity) > 0.95)
            .length,
      );
  const total = await page.locator(".capability-char").count();
  await page.evaluate((y) => scrollTo(0, y), geometry.top - 1000);
  await expect.poll(count).toBe(0);
  await page.evaluate(
    (y) => scrollTo(0, y),
    geometry.top + geometry.height / 2 - 800,
  );
  await expect.poll(count).toBeGreaterThan(5);
  expect(await count()).toBeLessThan(total - 5);
  await page.evaluate(
    (y) => scrollTo(0, y),
    geometry.top + geometry.height - 600,
  );
  await expect.poll(count).toBe(total);
  await page.evaluate((y) => scrollTo(0, y), geometry.top - 1000);
  await expect.poll(count).toBe(0);
});

test("a direct section link skips the intro and retains its destination", async ({
  page,
}) => {
  await page.goto("/#services");
  await expect(page.locator(".intro-loader")).toBeHidden();
  await expect
    .poll(() =>
      page
        .locator("#services")
        .evaluate((el) => Math.abs(el.getBoundingClientRect().top - 24)),
    )
    .toBeLessThan(10);
  await page.reload();
  await expect(page.locator(".intro-loader")).toBeHidden();
  await expect
    .poll(() =>
      page
        .locator("#services")
        .evaluate((el) => Math.abs(el.getBoundingClientRect().top - 24)),
    )
    .toBeLessThan(10);
});

test("breakpoint and reduced-motion changes remove pinning and restore readable content", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/#home");
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
  await page.evaluate(() => scrollTo(0, 650));
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator("html")).not.toHaveAttribute("data-desktop-motion");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".reveal-line")).toHaveCount(0);
  await expect(page.locator(".capability-char")).toHaveCount(0);
  await expect(page.locator(".journey-card").first()).toHaveCSS("opacity", "1");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
  await expect(page.locator("html")).toHaveAttribute(
    "data-desktop-motion",
    "true",
  );
  await expect(page.locator(".intro-loader")).toBeHidden();
  expect(errors).toEqual([]);
});

test("keyboard input can dismiss the opening without trapping focus or scrolling", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("data-intro", "playing");
  await page.keyboard.press("Tab");
  await expect(page.locator(".intro-loader")).toBeHidden();
  await page.waitForTimeout(900);
  await expect(page.locator(".intro-loader")).toBeHidden();
  await page.mouse.wheel(0, 300);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(200);
});

test("split text and the completed sidebar remain accessible with motion enabled", async ({
  page,
}) => {
  await page.goto("/#services");
  await expect(page.locator("html")).toHaveAttribute(
    "data-motion-ready",
    "true",
  );
  await expect(page.locator(".sidebar-intro")).toHaveCSS("opacity", "1");
  // A direct deep link triggers the reveals above it too. Assess contrast
  // after those fades settle, rather than sampling a translucent animation frame.
  await expect(page.locator("#about .sample-note")).toHaveCSS("opacity", "1");
  await expect
    .poll(() =>
      page
        .locator(".journey-card .small-button")
        .evaluateAll((buttons) =>
          buttons.every((button) => getComputedStyle(button).opacity === "1"),
        ),
    )
    .toBe(true);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    results.violations.map((violation) => ({
      id: violation.id,
      targets: violation.nodes.map((node) => node.target),
    })),
  ).toEqual([]);
});
