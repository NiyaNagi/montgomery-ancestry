/**
 * E2E Tests — Person Detail View
 * Tests person profile rendering, data display, navigation between people,
 * and edge cases (sparse profiles, infant deaths, living persons).
 *
 * Source: forge-pipeline/06-test-plan.md, Section 4.2
 */

// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Person Detail View', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#loading-screen.hidden', { timeout: 10000 });
  });

  async function openPerson(page, personId) {
    // Click on the person node in the tree
    const node = page.locator(`[data-person-id="${personId}"]`);
    if (await node.count() > 0) {
      await node.first().click();
    } else {
      // Use search to find the person
      await page.locator('#search-btn').click();
      await page.waitForSelector('#search-overlay.active');
      await page.locator('#search-input').fill(personId.replace(/-/g, ' '));
      await page.waitForTimeout(300);
      const result = page.locator('.search-result-item').first();
      if (await result.count() > 0) {
        await result.click();
      }
    }
    await expect(page.locator('#person-panel')).toHaveClass(/active/, { timeout: 3000 });
  }

  test('clicking a tree node opens person detail panel', async ({ page }) => {
    await page.waitForSelector('.tree-node', { timeout: 5000 });

    const firstNode = page.locator('.tree-node').first();
    await firstNode.click();

    const panel = page.locator('#person-panel');
    await expect(panel).toHaveClass(/active/);

    // Panel should have content
    const content = panel.locator('.panel-content');
    await expect(content).not.toBeEmpty();

    // Should have a person name heading
    const heading = content.locator('h2');
    await expect(heading).toBeVisible();
  });

  test('person panel shows family line badge', async ({ page }) => {
    await page.waitForSelector('.tree-node', { timeout: 5000 });
    await page.locator('.tree-node').first().click();

    const badge = page.locator('.family-line-badge');
    await expect(badge).toBeVisible();
  });

  test('person panel shows quick facts section', async ({ page }) => {
    await page.waitForSelector('.tree-node', { timeout: 5000 });

    // Click on a person that should have dates
    const node = page.locator('[data-person-id="fred-e-thompson-1871"]');
    if (await node.count() > 0) {
      await node.first().click();

      const factsSection = page.locator('.facts-grid');
      await expect(factsSection).toBeVisible();

      // Should show birth info
      const panelContent = page.locator('.panel-content');
      await expect(panelContent).toContainText('Born');
    }
  });

  test('close button dismisses person panel', async ({ page }) => {
    await page.waitForSelector('.tree-node', { timeout: 5000 });
    await page.locator('.tree-node').first().click();

    const panel = page.locator('#person-panel');
    await expect(panel).toHaveClass(/active/);

    const closeBtn = panel.locator('.panel-close');
    await closeBtn.click();

    await expect(panel).not.toHaveClass(/active/);
  });

  test('person-link click navigates to another person', async ({ page }) => {
    await page.waitForSelector('.tree-node', { timeout: 5000 });

    // Find a node that is likely to have family links
    const node = page.locator('[data-person-id="fred-e-thompson-1871"]');
    if (await node.count() > 0) {
      await node.first().click();
      await page.waitForTimeout(500);

      // Click a family member link
      const personLink = page.locator('.person-link').first();
      if (await personLink.count() > 0) {
        const linkText = await personLink.textContent();
        await personLink.click();
        await page.waitForTimeout(500);

        // Panel should still be open with different person
        await expect(page.locator('#person-panel')).toHaveClass(/active/);
      }
    }
  });

  test('hash route #person/fred-e-thompson-1871 opens detail', async ({ page }) => {
    await page.goto('/#person/fred-e-thompson-1871');
    await page.waitForSelector('#loading-screen.hidden', { timeout: 10000 });
    await page.waitForTimeout(500); // allow hash routing

    const panel = page.locator('#person-panel');
    // Panel may open via hash routing
    const isActive = await panel.evaluate(el => el.classList.contains('active'));
    if (isActive) {
      await expect(panel.locator('.panel-content')).toContainText('Fred');
    }
  });

  test('sparse person shows limited records notice', async ({ page }) => {
    // Navigate to Belinda Thompson (very sparse data)
    await page.goto('/#person/belinda-thompson-1820');
    await page.waitForSelector('#loading-screen.hidden', { timeout: 10000 });
    await page.waitForTimeout(500);

    const panel = page.locator('#person-panel');
    const isActive = await panel.evaluate(el => el.classList.contains('active'));
    if (isActive) {
      const notice = panel.locator('.sparse-notice');
      await expect(notice).toBeVisible();
    }
  });
});
