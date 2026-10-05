import { defineConfig, devices } from "@playwright/test";

// Tests run against YOUR local code by default. Set PLAYWRIGHT_BASE_URL to point elsewhere.
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

export default defineConfig({
  testDir: "./e2e",
  // Dev mode compiles each page on first visit, so give every test and expect room for that.
  timeout: 120_000,
  expect: { timeout: 20_000 },
  // Tests that create / edit / delete data are *.mutation.spec.ts and only run with E2E_ALLOW_MUTATIONS=1.
  testIgnore: process.env.E2E_ALLOW_MUTATIONS === "1" ? [] : ["**/*.mutation.spec.ts"],
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 2 : 0,
  forbidOnly: !!process.env.CI,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: BASE_URL,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  // Starts `npm run dev` for you if nothing is listening on :3000 yet.
  webServer: {
    command: "npm run dev",
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
