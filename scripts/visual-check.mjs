import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
mkdirSync("artifacts", { recursive: true });
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || "chrome",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const issues = [];
page.on("pageerror", (error) => issues.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error" || message.type() === "warning")
    issues.push(`${message.type()}: ${message.text()}`);
});
await page.goto(process.env.TEST_URL || "http://127.0.0.1:4173", {
  waitUntil: "networkidle",
});
await page.waitForFunction(() =>
  !["pending", "playing"].includes(document.documentElement.dataset.intro),
);
await page.screenshot({ path: "artifacts/desktop-hero.png" });
for (const id of [
  "about",
  "projects",
  "capabilities",
  "skills",
  "services",
  "faq",
]) {
  await page.evaluate((id) => {
    const el = document.getElementById(id);
    window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 35);
  }, id);
  await page.waitForTimeout(1300);
  await page.screenshot({ path: `artifacts/desktop-${id}.png` });
}
const widths = [
  320, 375, 390, 425, 768, 820, 1024, 1280, 1366, 1440, 1536, 1920, 2560,
];
const layouts = [];
for (const width of widths) {
  await page.setViewportSize({ width, height: width < 600 ? 844 : 1000 });
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(550);
  layouts.push(
    await page.evaluate(() => ({
      viewport: innerWidth,
      document: document.documentElement.scrollWidth,
      overflow: document.documentElement.scrollWidth > innerWidth,
      h1: document.querySelector("h1").getBoundingClientRect().toJSON(),
    })),
  );
  if ([320, 390, 768, 1920].includes(width))
    await page.screenshot({ path: `artifacts/hero-${width}.png` });
}
console.log(JSON.stringify({ issues, layouts }, null, 2));
writeFileSync(
  "artifacts/visual-report.json",
  JSON.stringify({ issues, layouts }, null, 2),
);
await browser.close();
