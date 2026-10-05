import { test, expect } from "@playwright/test";
import { waitForHydration } from "./helpers";

/**
 * Products - WRITES DATA. Runs only with:  npm run test:e2e:mutations
 * Never run mutation tests against a shared server without telling the team.
 */

test.describe("Products create -> edit -> delete @mutation", () => {
  const unique = `E2E Product ${Date.now()}`;
  const renamed = `${unique} (edited)`;

  test("full flow", async ({ page }) => {
    // Create
    await page.goto("/products/create", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "New product", exact: true })).toBeVisible({ timeout: 30_000 });
    await waitForHydration(page);
    await page.getByLabel("Name").fill(unique);
    await page.locator("#category").click();
    await page.getByRole("option", { name: "Book" }).click();
    await page.locator("#price").fill("12345");
    await page.locator("#stock").fill("7");
    await page.getByRole("button", { name: "Save" }).click();

    // Shows in the list
    await expect(page.getByRole("heading", { name: "Products", exact: true })).toBeVisible({ timeout: 30_000 });
    await page.getByPlaceholder("Search by name").fill(unique);
    const row = page.locator(".products-table tbody tr", { hasText: unique });
    await expect(row).toBeVisible({ timeout: 20_000 });
    await expect(row).toContainText("12,345"); // three-digit comma rule

    // Edit
    await row.getByRole("button", { name: "Edit" }).click();
    await expect(page.getByRole("heading", { name: "Edit product", exact: true })).toBeVisible({ timeout: 30_000 });
    await expect(page.getByLabel("Name")).toHaveValue(unique, { timeout: 20_000 }); // edit mode fills existing values
    await page.getByLabel("Name").fill(renamed);
    await page.getByRole("button", { name: "Save" }).click();

    // Details shows the change
    await expect(page.getByRole("heading", { name: "Products", exact: true })).toBeVisible({ timeout: 30_000 });
    await page.getByPlaceholder("Search by name").fill(renamed);
    const editedRow = page.locator(".products-table tbody tr", { hasText: renamed });
    await expect(editedRow).toBeVisible({ timeout: 20_000 });
    await editedRow.getByRole("button", { name: "View" }).click();
    await expect(page.getByRole("heading", { name: renamed, exact: true })).toBeVisible({ timeout: 30_000 });

    // Delete
    await page.getByRole("button", { name: "Delete" }).click();
    await page.getByRole("button", { name: "Yes" }).click();
    await expect(page.getByRole("heading", { name: "Products", exact: true })).toBeVisible({ timeout: 30_000 });
    await page.getByPlaceholder("Search by name").fill(renamed);
    await expect(page.getByText("No products found")).toBeVisible({ timeout: 20_000 });
  });
});
