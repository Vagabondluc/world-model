import { expect, test } from "@playwright/test";

test.describe("dashboard endpoint", () => {
  test("D1 and D2: loads cleanly and is distinct from main entry", async ({ page }) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/dashboard.html");
    await expect(page.locator("#dashboard-root")).toBeVisible();
    await expect(page.locator("body.dashboard-entry")).toHaveCount(1);
    await expect(page.getByText("Sacred Sigil Operations")).toBeVisible();
    await expect.poll(async () => page.evaluate(() => window.__APP_ENTRY__)).toBe("dashboard");
    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);

    await page.goto("/");
    await expect(page.locator("#dashboard-root")).toHaveCount(0);
    await expect.poll(async () => page.evaluate(() => window.__APP_ENTRY__)).toBe("main");
  });

  test("D4: dashboard flow supports generate/select/export action", async ({ page }) => {
    await page.goto("/dashboard.html");
    const generateButton = page.getByRole("button", { name: /Generate (Icon|Frame)/i }).first();
    await generateButton.click();

    const variantGrid = page.locator('[data-onboard="variant-grid"]');
    await expect(variantGrid).toBeVisible();
    const variantButtons = variantGrid.locator('button[role="option"]');
    const count = await variantButtons.count();
    expect(count).toBeGreaterThan(1);
    await variantButtons.nth(1).click();

    await page.getByRole("button", { name: /Export/i }).click();
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("menuitem", { name: /Download SVG/i }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.svg$/i);
  });
});
