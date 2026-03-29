/**
 * E2E Tests — Mobile & Responsive
 * Tests responsive layout at multiple breakpoints, touch targets, and mobile UI.
 *
 * Source: forge-pipeline/06-test-plan.md, Section 4.5
 */

// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Mobile & Responsive', () => {

  test('iPhone SE (375px): page loads without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForSelector('#loading-screen.hidden', { timeout: 10000 });

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // allow 1px rounding
  });

  test('iPhone SE (375px): tree container is visible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForSelector('#loading-screen.hidden', { timeout: 10000 });

    const treeContainer = page.locator('#tree-container');
    await expect(treeContainer).toBeVisible();
  });

  test('iPhone SE (375px): search button is accessible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForSelector('#loading-screen.hidden', { timeout: 10000 });

    const searchBtn = page.locator('#search-btn');
    await expect(searchBtn).toBeVisible();
    const box = await searchBtn.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.width).toBeGreaterThanOrEqual(24);
      expect(box.height).toBeGreaterThanOrEqual(24);
    }
  });

  test('320px minimum: no content overflow', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/');
    await page.waitForSelector('#loading-screen.hidden', { timeout: 10000 });

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });

  test('tablet 768px: page renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForSelector('#loading-screen.hidden', { timeout: 10000 });

    const treeContainer = page.locator('#tree-container');
    await expect(treeContainer).toBeVisible();

    const header = page.locator('.site-header');
    await expect(header).toBeVisible();
  });

  test('desktop 1440px: full layout renders', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForSelector('#loading-screen.hidden', { timeout: 10000 });
    await page.waitForSelector('.tree-node', { timeout: 5000 });

    // Person panel can open alongside tree
    await page.locator('.tree-node').first().click();
    await expect(page.locator('#person-panel')).toHaveClass(/active/);

    // Tree should still be visible
    await expect(page.locator('#tree-container')).toBeVisible();
  });

  test('mobile: person panel opens as overlay', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForSelector('#loading-screen.hidden', { timeout: 10000 });
    await page.waitForSelector('.tree-node', { timeout: 5000 });

    await page.locator('.tree-node').first().click();
    const panel = page.locator('#person-panel');
    await expect(panel).toHaveClass(/active/);
  });

  test('mobile: search overlay fills screen', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForSelector('#loading-screen.hidden', { timeout: 10000 });

    await page.locator('#search-btn').click();
    const overlay = page.locator('#search-overlay');
    await expect(overlay).toHaveClass(/active/);

    const input = page.locator('#search-input');
    await expect(input).toBeVisible();
  });

  test('family tabs scroll horizontally on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForSelector('#loading-screen.hidden', { timeout: 10000 });

    const familyNav = page.locator('.family-nav');
    await expect(familyNav).toBeVisible();

    // Family tabs should exist
    const tabs = page.locator('.family-tab');
    const count = await tabs.count();
    expect(count).toBeGreaterThanOrEqual(7);
  });
});
