/**
 * E2E Tests — Accessibility
 * Tests WCAG 2.1 AA compliance: keyboard navigation, ARIA roles,
 * screen reader announcements, focus management, and skip links.
 *
 * Source: forge-pipeline/06-test-plan.md, Section 4.6
 */

// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Accessibility', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#loading-screen.hidden', { timeout: 10000 });
  });

  test('page has a valid lang attribute', async ({ page }) => {
    const lang = await page.getAttribute('html', 'lang');
    expect(lang).toBe('en');
  });

  test('page has a descriptive title', async ({ page }) => {
    await expect(page).toHaveTitle(/Montgomery/);
  });

  test('skip-to-content link exists and is first focusable element', async ({ page }) => {
    const skipLink = page.locator('#skip-to-content');
    await expect(skipLink).toBeAttached();

    // Tab to it (should be first focusable)
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.id);
    expect(focused).toBe('skip-to-content');
  });

  test('skip-to-content link moves focus to main content', async ({ page }) => {
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    const focusedId = await page.evaluate(() => document.activeElement?.id);
    expect(focusedId).toBe('main-content');
  });

  test('tree SVG has aria-label for screen readers', async ({ page }) => {
    await page.waitForSelector('svg.tree-svg', { timeout: 5000 });

    const ariaLabel = await page.locator('svg.tree-svg').getAttribute('aria-label');
    expect(ariaLabel).toContain('Family tree');
  });

  test('tree nodes have role="button" and aria-label', async ({ page }) => {
    await page.waitForSelector('.tree-node', { timeout: 5000 });

    const firstNode = page.locator('.tree-node').first();
    const role = await firstNode.getAttribute('role');
    expect(role).toBe('button');

    const ariaLabel = await firstNode.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel.length).toBeGreaterThan(0);
  });

  test('tree nodes are keyboard focusable (tabindex)', async ({ page }) => {
    await page.waitForSelector('.tree-node', { timeout: 5000 });

    const firstNode = page.locator('.tree-node').first();
    const tabindex = await firstNode.getAttribute('tabindex');
    expect(tabindex).toBe('0');
  });

  test('tree node activates on Enter key press', async ({ page }) => {
    await page.waitForSelector('.tree-node', { timeout: 5000 });

    const firstNode = page.locator('.tree-node').first();
    await firstNode.focus();
    await page.keyboard.press('Enter');

    const panel = page.locator('#person-panel');
    await expect(panel).toHaveClass(/active/);
  });

  test('person panel has aria-hidden toggle and role="dialog"', async ({ page }) => {
    const panel = page.locator('#person-panel');
    const role = await panel.getAttribute('role');
    expect(role).toBe('dialog');

    // Initially hidden
    const hiddenBefore = await panel.getAttribute('aria-hidden');
    expect(hiddenBefore).toBe('true');

    // Open panel
    await page.waitForSelector('.tree-node', { timeout: 5000 });
    await page.locator('.tree-node').first().click();
    await page.waitForTimeout(300);

    const hiddenAfter = await panel.getAttribute('aria-hidden');
    expect(hiddenAfter).toBe('false');
  });

  test('search overlay has role="dialog" and aria-label', async ({ page }) => {
    const overlay = page.locator('#search-overlay');
    const role = await overlay.getAttribute('role');
    expect(role).toBe('dialog');

    const ariaLabel = await overlay.getAttribute('aria-label');
    expect(ariaLabel).toContain('Search');
  });

  test('search input has aria-label', async ({ page }) => {
    const input = page.locator('#search-input');
    const ariaLabel = await input.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
  });

  test('search results have role="listbox" and items have role="option"', async ({ page }) => {
    // Open search and type
    await page.locator('#search-btn').click();
    await page.locator('#search-input').fill('Thompson');
    await page.waitForTimeout(300);

    const resultsList = page.locator('.search-results-list');
    const listRole = await resultsList.getAttribute('role');
    expect(listRole).toBe('listbox');

    const firstItem = page.locator('.search-result-item').first();
    const itemRole = await firstItem.getAttribute('role');
    expect(itemRole).toBe('option');
  });

  test('Escape closes search overlay', async ({ page }) => {
    await page.locator('#search-btn').click();
    await expect(page.locator('#search-overlay')).toHaveClass(/active/);

    await page.keyboard.press('Escape');
    await expect(page.locator('#search-overlay')).not.toHaveClass(/active/);
  });

  test('Escape closes person panel', async ({ page }) => {
    await page.waitForSelector('.tree-node', { timeout: 5000 });
    await page.locator('.tree-node').first().click();
    await expect(page.locator('#person-panel')).toHaveClass(/active/);

    await page.keyboard.press('Escape');
    await expect(page.locator('#person-panel')).not.toHaveClass(/active/);
  });

  test('family tabs have role="tab" and aria-selected', async ({ page }) => {
    const firstTab = page.locator('.family-tab').first();
    const role = await firstTab.getAttribute('role');
    expect(role).toBe('tab');

    const selected = await firstTab.getAttribute('aria-selected');
    expect(selected).toBe('true'); // first tab should be selected
  });

  test('family tab navigation has role="tablist"', async ({ page }) => {
    const tablist = page.locator('.family-nav');
    const role = await tablist.getAttribute('role');
    expect(role).toBe('tablist');
  });

  test('loading screen has role="status" and aria-live', async ({ page }) => {
    // Check on a fresh load before hidden
    await page.goto('/');
    const loadingScreen = page.locator('#loading-screen');
    const role = await loadingScreen.getAttribute('role');
    expect(role).toBe('status');

    const ariaLive = await loadingScreen.getAttribute('aria-live');
    expect(ariaLive).toBe('polite');
  });

  test('prefers-reduced-motion is respected', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.waitForSelector('#loading-screen.hidden', { timeout: 10000 });

    // Page should load without errors in reduced motion mode
    const treeContainer = page.locator('#tree-container');
    await expect(treeContainer).toBeVisible();
  });
});
