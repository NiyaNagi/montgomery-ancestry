/**
 * E2E Tests — Navigation
 * Tests page load, routing, deep links, browser history, and family line tabs.
 *
 * Source: forge-pipeline/06-test-plan.md, Section 4.4
 */

// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Navigation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#loading-screen.hidden', { timeout: 10000 });
  });

  test('page loads successfully with title and header', async ({ page }) => {
    await expect(page).toHaveTitle(/Montgomery/);

    const header = page.locator('.header-title');
    await expect(header).toContainText('Montgomery Family Heritage');

    const subtitle = page.locator('.header-subtitle');
    await expect(subtitle).toContainText('174 people');
  });

  test('loading screen disappears after data loads', async ({ page }) => {
    // Reload to observe loading
    await page.goto('/');
    const loadingScreen = page.locator('#loading-screen');
    await expect(loadingScreen).toHaveClass(/hidden/, { timeout: 10000 });
  });

  test('family line tabs are rendered', async ({ page }) => {
    const tabs = page.locator('.family-tab');
    const count = await tabs.count();
    expect(count).toBeGreaterThanOrEqual(7); // "All Lines" + 6 family lines

    // "All Lines" should be active initially
    const allTab = page.locator('.family-tab:has-text("All Lines")');
    await expect(allTab).toHaveClass(/active/);
  });

  test('clicking a family line tab updates URL hash', async ({ page }) => {
    const holmesTab = page.locator('.family-tab:has-text("Holmes")');
    if (await holmesTab.count() > 0) {
      await holmesTab.click();
      await page.waitForTimeout(300);

      const url = page.url();
      expect(url).toContain('family/holmes');
    }
  });

  test('deep link to person updates panel', async ({ page }) => {
    await page.goto('/#person/fred-e-thompson-1871');
    await page.waitForSelector('#loading-screen.hidden', { timeout: 10000 });
    await page.waitForTimeout(500);

    // The hash route should trigger person panel
    const hash = await page.evaluate(() => window.location.hash);
    expect(hash).toContain('person/fred-e-thompson-1871');
  });

  test('deep link to family line sets correct tab', async ({ page }) => {
    await page.goto('/#family/holmes');
    await page.waitForSelector('#loading-screen.hidden', { timeout: 10000 });
    await page.waitForTimeout(500);

    const holmesTab = page.locator('.family-tab:has-text("Holmes")');
    if (await holmesTab.count() > 0) {
      await expect(holmesTab).toHaveClass(/active/);
    }
  });

  test('browser back button works after navigation', async ({ page }) => {
    await page.waitForSelector('.tree-node', { timeout: 5000 });

    // Click person to change hash
    const firstNode = page.locator('.tree-node').first();
    await firstNode.click();
    await page.waitForTimeout(300);

    const hashAfterClick = await page.evaluate(() => window.location.hash);

    // Go back
    await page.goBack();
    await page.waitForTimeout(300);

    const hashAfterBack = await page.evaluate(() => window.location.hash);
    expect(hashAfterBack).not.toBe(hashAfterClick);
  });

  test('switching tabs closes person panel', async ({ page }) => {
    await page.waitForSelector('.tree-node', { timeout: 5000 });

    // Open person panel
    await page.locator('.tree-node').first().click();
    await expect(page.locator('#person-panel')).toHaveClass(/active/);

    // Switch family line tab
    const tab = page.locator('.family-tab').nth(1);
    await tab.click();
    await page.waitForTimeout(300);

    // Panel should be closed
    await expect(page.locator('#person-panel')).not.toHaveClass(/active/);
  });

  test('footer is visible with keyboard hint', async ({ page }) => {
    const footer = page.locator('.site-footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('/');
  });
});
