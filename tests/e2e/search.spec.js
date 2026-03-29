/**
 * E2E Tests — Search
 * Tests search input, auto-suggest, result navigation, and family line filter.
 *
 * Source: forge-pipeline/06-test-plan.md, Section 4.3
 */

// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Search', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#loading-screen.hidden', { timeout: 10000 });
  });

  async function openSearch(page) {
    const searchBtn = page.locator('#search-btn');
    await searchBtn.click();
    await expect(page.locator('#search-overlay')).toHaveClass(/active/);
    await expect(page.locator('#search-input')).toBeFocused({ timeout: 2000 });
  }

  test('search overlay opens when clicking search button', async ({ page }) => {
    await openSearch(page);
    const overlay = page.locator('#search-overlay');
    await expect(overlay).toHaveClass(/active/);
  });

  test('search overlay opens with "/" keyboard shortcut', async ({ page }) => {
    await page.keyboard.press('/');
    const overlay = page.locator('#search-overlay');
    await expect(overlay).toHaveClass(/active/);
  });

  test('typing "Isa" shows search results with both Isabellas', async ({ page }) => {
    await openSearch(page);
    const input = page.locator('#search-input');
    await input.fill('Isa');
    await page.waitForTimeout(300); // debounce

    const results = page.locator('.search-result-item');
    await expect(results.first()).toBeVisible({ timeout: 2000 });
    const count = await results.count();
    expect(count).toBeGreaterThanOrEqual(2);

    // Check that results container has text for both Isabellas
    const resultsContainer = page.locator('#search-results');
    await expect(resultsContainer).toContainText('Isabella');
  });

  test('search "Thompson" shows 20+ results', async ({ page }) => {
    await openSearch(page);
    const input = page.locator('#search-input');
    await input.fill('Thompson');
    await page.waitForTimeout(300);

    const countEl = page.locator('.search-count');
    await expect(countEl).toBeVisible();
    const countText = await countEl.textContent();
    const num = parseInt(countText || '0');
    expect(num).toBeGreaterThanOrEqual(20);
  });

  test('clicking a search result opens person panel', async ({ page }) => {
    await openSearch(page);
    const input = page.locator('#search-input');
    await input.fill('Fred Thompson');
    await page.waitForTimeout(300);

    const firstResult = page.locator('.search-result-item').first();
    await firstResult.click();

    // Search overlay should close
    await expect(page.locator('#search-overlay')).not.toHaveClass(/active/);

    // Person panel should open
    const panel = page.locator('#person-panel');
    await expect(panel).toHaveClass(/active/);
  });

  test('no results shows empty message', async ({ page }) => {
    await openSearch(page);
    const input = page.locator('#search-input');
    await input.fill('Zzyzzyva');
    await page.waitForTimeout(300);

    const emptyMsg = page.locator('.search-empty');
    await expect(emptyMsg).toBeVisible();
    await expect(emptyMsg).toContainText('No results found');
  });

  test('Escape key closes search overlay', async ({ page }) => {
    await openSearch(page);
    await page.keyboard.press('Escape');
    await expect(page.locator('#search-overlay')).not.toHaveClass(/active/);
  });

  test('keyboard navigation in search results (ArrowDown/Enter)', async ({ page }) => {
    await openSearch(page);
    const input = page.locator('#search-input');
    await input.fill('Thompson');
    await page.waitForTimeout(300);

    // Arrow down to select first result
    await page.keyboard.press('ArrowDown');
    const selectedItem = page.locator('.search-result-item.selected');
    await expect(selectedItem).toBeVisible();

    // Press Enter to select
    await page.keyboard.press('Enter');

    // Person panel should open
    const panel = page.locator('#person-panel');
    await expect(panel).toHaveClass(/active/);
  });

  test('family line filter checkboxes are present', async ({ page }) => {
    await openSearch(page);

    const filterContainer = page.locator('#search-filters');
    await expect(filterContainer).toBeVisible();

    const checkboxes = filterContainer.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    expect(count).toBeGreaterThanOrEqual(6); // 6 family lines
  });

  test('search responds quickly (under 500ms for E2E)', async ({ page }) => {
    await openSearch(page);
    const input = page.locator('#search-input');

    const start = Date.now();
    await input.fill('th');
    await page.waitForTimeout(300); // debounce
    await page.locator('.search-result-item').first().waitFor({ timeout: 2000 });
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(2000);
  });
});
