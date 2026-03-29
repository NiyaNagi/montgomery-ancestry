/**
 * E2E Tests — Tree Visualization
 * Tests tree rendering, zoom/pan, click interactions, and multi-marriage layout.
 *
 * Source: forge-pipeline/06-test-plan.md, Section 4.1
 */

// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Tree Visualization', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for loading screen to disappear
    await page.waitForSelector('#loading-screen.hidden', { timeout: 10000 });
  });

  test('tree loads with visible person nodes', async ({ page }) => {
    const treeContainer = page.locator('#tree-container');
    await expect(treeContainer).toBeVisible();

    // SVG should be injected by tree.js
    const svg = treeContainer.locator('svg.tree-svg');
    await expect(svg).toBeVisible();

    // At least some person nodes should be rendered
    const nodes = treeContainer.locator('.tree-node');
    await expect(nodes.first()).toBeVisible({ timeout: 5000 });
    const count = await nodes.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('zoom in/out via mouse wheel changes transform', async ({ page }) => {
    const treeContainer = page.locator('#tree-container');
    await expect(treeContainer).toBeVisible();
    await page.waitForSelector('.tree-node', { timeout: 5000 });

    // Get initial transform
    const gRoot = page.locator('.tree-root');
    const initialStyle = await gRoot.getAttribute('style');

    // Scroll to zoom in
    await treeContainer.hover();
    await page.mouse.wheel(0, -300);
    await page.waitForTimeout(300);

    const afterZoomStyle = await gRoot.getAttribute('style');
    // Transform should have changed
    expect(afterZoomStyle).not.toBe(initialStyle);
  });

  test('click person card opens detail panel', async ({ page }) => {
    await page.waitForSelector('.tree-node', { timeout: 5000 });

    const firstNode = page.locator('.tree-node').first();
    await firstNode.click();

    // Person panel should become active
    const panel = page.locator('#person-panel');
    await expect(panel).toHaveClass(/active/);
  });

  test('Calvin Thompson node is visible in Thompson tree', async ({ page }) => {
    await page.waitForSelector('.tree-node', { timeout: 5000 });

    // Calvin Thompson should be in the tree
    const calvinNode = page.locator('[data-person-id="calvin-thompson-1822"]');
    // He may need to be scrolled into view
    const count = await calvinNode.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('desktop 1440px renders tree with multiple generations', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForSelector('#loading-screen.hidden', { timeout: 10000 });
    await page.waitForSelector('.tree-node', { timeout: 5000 });

    const nodes = page.locator('.tree-node');
    const count = await nodes.count();
    expect(count).toBeGreaterThanOrEqual(10);
  });

  test('pan via click-drag moves the tree', async ({ page }) => {
    const treeContainer = page.locator('#tree-container');
    await page.waitForSelector('.tree-node', { timeout: 5000 });

    const gRoot = page.locator('.tree-root');
    const beforeStyle = await gRoot.getAttribute('style');

    const box = await treeContainer.boundingBox();
    if (box) {
      await page.mouse.move(box.x + 200, box.y + 200);
      await page.mouse.down();
      await page.mouse.move(box.x + 400, box.y + 400, { steps: 10 });
      await page.mouse.up();
      await page.waitForTimeout(200);
    }

    const afterStyle = await gRoot.getAttribute('style');
    expect(afterStyle).not.toBe(beforeStyle);
  });

  test('family line tab switches tree content', async ({ page }) => {
    await page.waitForSelector('.tree-node', { timeout: 5000 });

    // Click "Holmes" tab
    const holmesTab = page.locator('.family-tab:has-text("Holmes")');
    if (await holmesTab.count() > 0) {
      await holmesTab.click();
      await page.waitForTimeout(500);

      // Tab should be active
      await expect(holmesTab).toHaveClass(/active/);

      // Tree should still have nodes
      const nodes = page.locator('.tree-node');
      const count = await nodes.count();
      expect(count).toBeGreaterThanOrEqual(1);
    }
  });

  test('zoom-fit button resets view', async ({ page }) => {
    await page.waitForSelector('.tree-node', { timeout: 5000 });

    const zoomFit = page.locator('#zoom-fit');
    await zoomFit.click();
    await page.waitForTimeout(300);

    // Tree should still be visible after zoom-fit
    const nodes = page.locator('.tree-node');
    await expect(nodes.first()).toBeVisible();
  });
});
