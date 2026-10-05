import { expect, Page } from "@playwright/test";

// The server-rendered HTML is visible before React attaches its event handlers ("hydration").
// Typing or clicking before that point is lost. AppTopbar sets data-hydrated="true" on <html>
// once React is running on the client, so every test waits for it before interacting.
export async function waitForHydration(page: Page) {
  await expect(page.locator("html")).toHaveAttribute("data-hydrated", "true", { timeout: 60_000 });
}

export async function gotoAndHydrate(page: Page, url: string) {
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await waitForHydration(page);
}
