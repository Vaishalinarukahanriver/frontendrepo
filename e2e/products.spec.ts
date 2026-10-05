import { test, expect, Page } from "@playwright/test";
import { waitForHydration } from "./helpers";

/**
 * Products list - READ-ONLY checks. One file per feature.
 * Asserts visible text and headings, not just the URL.
 * Create / edit / delete live in products.mutation.spec.ts.
 */

const LIST_URL = "/products/list";

async function gotoList(page: Page) {
  await page.goto(LIST_URL, { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Products", exact: true })).toBeVisible({ timeout: 30_000 });
  await waitForHydration(page);
}

test.describe("Products list", () => {
  test.beforeEach(async ({ page }) => {
    await gotoList(page);
  });

  test("page opens with heading, breadcrumb and rows", async ({ page }) => {
    await expect(page.locator(".top-heading__breadcrumb")).toContainText("Products");
    await expect(page.locator(".products-table tbody tr").first()).toBeVisible({ timeout: 20_000 });
    const rows = await page.locator(".products-table tbody tr").count();
    expect(rows).toBeGreaterThan(0);
  });

  test("search narrows the list to matching names", async ({ page }) => {
    await page.getByPlaceholder("Search by name").fill("Grammar");
    await expect(page.locator(".products-table tbody tr").first()).toContainText("Grammar", { timeout: 20_000 });
    const names = await page.locator(".products-table__name").allTextContents();
    expect(names.length).toBeGreaterThan(0);
    names.forEach((name) => expect(name.toLowerCase()).toContain("grammar"));
  });

  test("no results shows the empty state", async ({ page }) => {
    await page.getByPlaceholder("Search by name").fill("zzzz-no-such-product");
    await expect(page.getByText("No products found")).toBeVisible({ timeout: 20_000 });
  });

  test("paging moves to the second page", async ({ page }) => {
    await expect(page.locator(".products-table tbody tr").first()).toBeVisible({ timeout: 20_000 });
    const firstRowPage1 = await page.locator(".products-table__name").first().textContent();
    await page.getByRole("button", { name: "Next Page" }).click();
    await expect(page.locator(".p-paginator-page.p-highlight")).toHaveText("2", { timeout: 20_000 });
    await expect(page.locator(".products-table__name").first()).not.toHaveText(firstRowPage1 ?? "", { timeout: 20_000 });
  });

  test("create form shows validation errors for empty required fields", async ({ page }) => {
    await page.getByRole("button", { name: "New product" }).click();
    await expect(page.getByRole("heading", { name: "New product", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Name is required.")).toBeVisible();
    await expect(page.getByText("Category is required.")).toBeVisible();
  });
});
