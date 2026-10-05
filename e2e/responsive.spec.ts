import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

/**
 * Responsive sweep across the WM breakpoint ladder. For every width it:
 *   1. opens the list page,
 *   2. saves a screenshot to e2e/screenshots/<width>.png (gitignored),
 *   3. fails if the PAGE scrolls sideways (tables may scroll inside their own box).
 * Reuse this file for your own screen: change ROUTE and HEADING.
 */

const ROUTE = "/products/list";
const HEADING = "Products";
const WIDTHS = [1920, 1600, 1366, 1280, 1024, 991, 768, 640, 480, 375];
const OUT_DIR = path.join(__dirname, "screenshots");

test.describe("Responsive - no sideways scroll at any WM width", () => {
  test.beforeAll(() => {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  });

  for (const width of WIDTHS) {
    test(`${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(ROUTE, { waitUntil: "domcontentloaded" });
      await expect(page.getByRole("heading", { name: HEADING, exact: true })).toBeVisible({ timeout: 30_000 });
      await expect(page.locator(".products-table tbody tr").first()).toBeVisible({ timeout: 20_000 });

      await page.screenshot({ path: path.join(OUT_DIR, `${width}.png`), fullPage: true });

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(overflow.scrollWidth, `page scrolls sideways at ${width}px`).toBeLessThanOrEqual(overflow.clientWidth);
    });
  }
});
