import { test, expect } from '@playwright/test';

/**
 * Visual Regression Baseline Tests
 * 
 * Simplified baseline that captures the main dashboard view.
 * As the first test run, this establishes the pixel-perfect baseline
 * for detecting any visual changes during DRY refactoring.
 * 
 * NOTE: More detailed view tests can be added as needed, but the
 * primary goal is to have a baseline for the main application state
 * to detect unintended UI changes during refactoring.
 */

test.describe('Visual Regression Baseline', () => {

    test('Application Main View', async ({ page }) => {
        await page.goto('/');

        // Wait for the page to be fully loaded
        await page.waitForLoadState('networkidle');

        // Capture full-page screenshot of the main dashboard
        await expect(page).toHaveScreenshot('app-main-baseline.png', {
            fullPage: true,
        });
    });

    test('Application Loaded State with Timeout', async ({ page }) => {
        await page.goto('/');

        // Wait for DOM content to be ready
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000); // Allow for any animations

        // Capture after animations settle
        await expect(page).toHaveScreenshot('app-loaded-baseline.png', {
            fullPage: true,
        });
    });
});
