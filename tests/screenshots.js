const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const viewports = [
    { name: 'mobile-se', width: 375, height: 667 },
    { name: 'mobile-plus', width: 414, height: 896 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'laptop', width: 1024, height: 768 },
    { name: 'desktop', width: 1440, height: 900 },
  ];

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height }
    });
    const page = await context.newPage();
    
    // Main page / tree view
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000); // Let tree render
    await page.screenshot({ 
      path: `tests/screenshots/${vp.name}-home.png`,
      fullPage: false 
    });

    // Click on a person node via JS dispatch (SVG nodes are in a pannable container)
    try {
      const clicked = await page.evaluate(() => {
        const node = document.querySelector('.tree-node');
        if (node) {
          node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          return true;
        }
        return false;
      });
      if (clicked) {
        await page.waitForTimeout(1000);
        await page.screenshot({ 
          path: `tests/screenshots/${vp.name}-person.png`,
          fullPage: false 
        });
      } else {
        console.log(`${vp.name}: no tree-node found`);
      }
    } catch (e) {
      console.log(`${vp.name}: Could not click person node - ${e.message}`);
    }

    // Close person panel, then open search
    try {
      const closeBtn = await page.locator('.panel-close');
      if (await closeBtn.isVisible({ timeout: 500 })) {
        await closeBtn.click();
        await page.waitForTimeout(300);
      }
    } catch (e) {}

    // Open search
    try {
      const searchBtn = await page.locator('#search-btn').first();
      if (await searchBtn.isVisible({ timeout: 1000 })) {
        await searchBtn.click();
        await page.waitForTimeout(500);
        await page.screenshot({ 
          path: `tests/screenshots/${vp.name}-search.png`,
          fullPage: false 
        });
      }
    } catch (e) {
      console.log(`${vp.name}: Could not open search`);
    }

    await context.close();
  }

  await browser.close();
  console.log('Screenshots complete!');
})();
