import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Portfolio interactions", () => {
  test.use({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("loads without browser errors and all original assets load", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (["warning", "error"].includes(message.type()))
        errors.push(message.text());
    });
    await page.reload();
    for (const id of [
      "about",
      "projects",
      "capabilities",
      "skills",
      "services",
      "faq",
    ])
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await page.locator(".project-card").last().scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        page
          .locator("img")
          .evaluateAll(
            (images) =>
              images.filter(
                (image) =>
                  image instanceof HTMLImageElement &&
                  image.complete &&
                  image.naturalWidth === 0,
              ).length,
          ),
      )
      .toBe(0);
    expect(errors).toEqual([]);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );
  });

  test("anchor navigation, sidebar active state, and back-to-top work", async ({
    page,
  }) => {
    await page
      .locator(".hero-buttons")
      .getByRole("link", { name: "About me" })
      .click();
    await expect(page).toHaveURL(/#about$/);
    await expect(page.locator(".sidebar")).toHaveClass(/is-visible/);
    await expect(page.locator('.sidebar-nav a[href="#about"]')).toHaveAttribute(
      "aria-current",
      "location",
    );
    await page.locator('.sidebar-nav a[href="#faq"]').click();
    await expect(page).toHaveURL(/#faq$/);
    await page.getByRole("link", { name: "Back to the beginning" }).click();
    await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(5);
  });

  test("journey dialogs navigate chapters, trap focus, and restore it on Escape", async ({
    page,
  }) => {
    const trigger = page.getByRole("button", {
      name: "Read more: A little curiosity. A lot of code.",
    });
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Next chapter" }).click();
    await expect(
      dialog.getByRole("heading", { name: "Finding the missing pieces." }),
    ).toBeVisible();
    await dialog.getByRole("button", { name: "Previous chapter" }).click();
    await expect(
      dialog.getByRole("heading", {
        name: "A little curiosity. A lot of code.",
      }),
    ).toBeVisible();
    for (let i = 0; i < 6; i++) await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() => !!document.activeElement?.closest("dialog")),
    ).toBe(true);
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });

  test("project cards open their details and advance", async ({ page }) => {
    await page
      .getByRole("button", {
        name: "Explore Personal Portfolio, Portfolio Website",
      })
      .click();
    const dialog = page.getByRole("dialog");
    await expect(
      dialog.getByRole("heading", { name: "Personal Portfolio", exact: true }),
    ).toBeVisible();
    await dialog.getByRole("button", { name: "Next project" }).click();
    await expect(
      dialog.getByRole("heading", {
        name: "AI Eternity Tourist Guide",
        exact: true,
      }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Next projects" }).click();
    await expect
      .poll(() =>
        page.locator(".project-viewport").evaluate((el) => el.scrollLeft),
      )
      .toBeGreaterThan(0);
  });

  test("capability panels close on another control, outside click, and Escape", async ({
    page,
  }) => {
    const first = page.getByRole("button", { name: "Full stack development" });
    await first.click();
    await expect(first).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#capability-0")).toBeVisible();
    const second = page.getByRole("button", {
      name: "Thoughtful integrations",
    });
    await second.click();
    await expect(first).toHaveAttribute("aria-expanded", "false");
    await page.keyboard.press("Escape");
    await expect(second).toBeFocused();
    await expect(second).toHaveAttribute("aria-expanded", "false");
    await first.click();
    await page.locator("#capabilities h2").click();
    await expect(first).toHaveAttribute("aria-expanded", "false");
  });

  test("service CTA selects the service and downloads an actual brief", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Plan a starter build" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("combobox")).toHaveValue("Start something");
    await dialog.getByLabel("Your name").fill("QA Example");
    await dialog.getByLabel("Your email").fill("qa@example.com");
    await dialog
      .getByLabel("A little about the idea")
      .fill("A clear and accessible portfolio for a small creative team.");
    const downloadPromise = page.waitForEvent("download");
    await dialog
      .getByRole("button", { name: "Download project brief" })
      .click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe("project-brief.txt");
    const stream = await download.createReadStream();
    const parts: Buffer[] = [];
    for await (const chunk of stream!) parts.push(chunk);
    const body = Buffer.concat(parts).toString();
    expect(body).toContain("QA Example");
    expect(body).toContain("Start something");
    expect(body).toContain("has not been sent");
    await expect(dialog.getByRole("status")).toContainText(
      "Saved to your downloads",
    );
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });

  test("FAQ opens one at a time, closes, and responds to keyboard", async ({
    page,
  }) => {
    const first = page.getByRole("button", {
      name: "Why build with React and Next.js?",
    });
    const second = page.getByRole("button", {
      name: "Can an existing website be improved?",
    });
    await first.click();
    await expect(first).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#faq-answer-0")).toHaveAttribute(
      "aria-hidden",
      "false",
    );
    await second.click();
    await expect(first).toHaveAttribute("aria-expanded", "false");
    await expect(second).toHaveAttribute("aria-expanded", "true");
    await second.press("Enter");
    await expect(second).toHaveAttribute("aria-expanded", "false");
  });

  test("reduced motion preserves content without pinning or cursor", async ({
    page,
  }) => {
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await expect(page.locator(".custom-cursor")).not.toBeVisible();
    await expect(page.locator(".hero-portrait")).toHaveCSS("opacity", "1");
    await expect(page.locator(".capability-word").first()).toHaveCSS(
      "opacity",
      "1",
    );
  });

  test("desktop accessibility scan", async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
    await page
      .locator(".hero-buttons")
      .getByRole("link", { name: "About me" })
      .click();
    const scrolled = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      scrolled.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
    await page
      .locator(".sidebar")
      .getByRole("button", { name: "Let’s talk" })
      .click();
    const modal = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      modal.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  });
});

test("mobile menu opens, follows links, closes on Escape and backdrop", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open navigation" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Navigation" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.mouse.click(3, 400);
  await expect(dialog).not.toBeVisible();
  await trigger.click();
  await dialog.getByRole("link", { name: "Projects", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page).toHaveURL(/#projects$/);
  await expect
    .poll(() =>
      page
        .locator("#projects")
        .evaluate((el) => Math.abs(el.getBoundingClientRect().top - 90)),
    )
    .toBeLessThan(5);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    results.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
});

for (const width of [
  320, 375, 390, 425, 768, 820, 1024, 1280, 1366, 1440, 1536, 1920, 2560,
]) {
  test(`responsive layout fits ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    const heading = (await page.locator("h1").boundingBox())!;
    expect(heading.x).toBeGreaterThanOrEqual(0);
    expect(heading.x + heading.width).toBeLessThanOrEqual(width);
    await page.locator("#faq").scrollIntoViewIfNeeded();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
  });
}

test("motion pinning, project travel, and cursor respond to scrolling and hover", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
  await page.locator('.hero-nav a[href="#projects"]').click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator(".sidebar")).toHaveClass(/is-visible/);
  await page.waitForTimeout(1600);
  const before = await page
    .locator(".project-track")
    .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41);
  await page.mouse.wheel(0, 650);
  await page.waitForTimeout(1500);
  const after = await page
    .locator(".project-track")
    .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41);
  expect(after).toBeLessThan(before - 100);
  await page.mouse.move(900, 550);
  await expect(page.locator(".custom-cursor")).toHaveAttribute(
    "data-visible",
    "true",
  );
  await page.screenshot({ path: "artifacts/motion-projects.png" });
});

test("mobile navigation scrolls after dismissing a menu with motion enabled", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("dialog", { name: "Navigation" })
    .getByRole("link", { name: "Services", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Navigation" }),
  ).not.toBeVisible();
  await expect
    .poll(() =>
      page
        .locator("#services")
        .evaluate((el) => Math.abs(el.getBoundingClientRect().top - 90)),
    )
    .toBeLessThan(6);
});

test.describe("Touch galleries", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  test("the project gallery responds to native touch swipes", async ({
    page,
  }) => {
    await page.goto("/");
    const client = await page.context().newCDPSession(page);
    for (const selector of [".project-viewport"]) {
      const gallery = page.locator(selector);
      await gallery.scrollIntoViewIfNeeded();
      const box = (await gallery.boundingBox())!;
      const y = Math.min(600, Math.max(160, box.y + 140));
      await client.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ x: 340, y }],
      });
      for (let x = 320; x >= 60; x -= 20)
        await client.send("Input.dispatchTouchEvent", {
          type: "touchMove",
          touchPoints: [{ x, y }],
        });
      await client.send("Input.dispatchTouchEvent", {
        type: "touchEnd",
        touchPoints: [],
      });
      await expect
        .poll(() => gallery.evaluate((el) => el.scrollLeft))
        .toBeGreaterThan(50);
    }
    await client.detach();
  });
});
