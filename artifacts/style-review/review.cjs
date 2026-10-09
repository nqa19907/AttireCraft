'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require(path.join(process.env.APPDATA, 'npm/node_modules/openclaw/node_modules/playwright-core'));
const { createServer } = require('../../server.cjs');
const output = __dirname;

(async () => {
  const server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    await page.route(/https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com)\//, route => route.fulfill({ status: 200, contentType: 'text/css', body: '' }));
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    const results = [];
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const style of ['minimal', 'genz', 'classic']) {
        await page.locator(`#style-options [data-value="${style}"]`).click();
        await page.waitForFunction(expected => {
          const photo = document.querySelector('#model-image');
          return photo.complete && photo.naturalWidth && photo.currentSrc.includes(expected) && document.querySelector('#model-stage').getAttribute('aria-busy') === 'false';
        }, style === 'minimal' ? '/optimized/ao-dai-ivory.webp' : `/styles/${style}/ao-dai-ivory.webp`);
        await page.locator('#preview-card').scrollIntoViewIfNeeded();
        await page.locator('#preview-card').screenshot({ path: path.join(output, `${style}-${width}.png`) });
        const sizes = await page.evaluate(() => ({ viewport: innerWidth, page: document.documentElement.scrollWidth }));
        assert.ok(sizes.page <= sizes.viewport + 1, `Overflow at ${width}px`);
        results.push({ width, style, source: await page.locator('#model-image').getAttribute('src'), alt: await page.locator('#model-image').getAttribute('alt') });
      }
      await page.locator('input[value="ngu-than"]').check();
      for (const key of ['ngoc', 'khan']) await page.locator(`#accessory-options [data-value="${key}"]`).click();
      for (const color of ['ivory', 'red', 'teal', 'pink', 'black']) {
        await page.locator(`#color-options [data-color="${color}"]`).click();
        await page.waitForFunction(expected => {
          const photo = document.querySelector('#model-image');
          return photo.complete && photo.naturalWidth && photo.currentSrc.includes(expected) && document.querySelector('#model-stage').getAttribute('aria-busy') === 'false';
        }, `/styles/classic/ngu-than-${color}--khan-ngoc.webp`);
        assert.equal(await page.locator('#accessory-options [aria-pressed="true"]').count(), 2);
        const alt = await page.locator('#model-image').getAttribute('alt');
        assert.ok(['Khuyên ngọc', 'Khăn vấn', 'Vòng cổ ngọc trai'].every(label => alt.includes(label)));
        await page.locator('#preview-card').screenshot({ path: path.join(output, `ngu-than-classic-${color}-${width}.png`) });
        const sizes = await page.evaluate(() => ({ viewport: innerWidth, page: document.documentElement.scrollWidth }));
        assert.ok(sizes.page <= sizes.viewport + 1, `Overflow at ${width}px`);
        results.push({ width, style: 'classic', garment: 'ngu-than', color, accessories: ['ngoc', 'khan'], alt, source: await page.locator('#model-image').getAttribute('src') });
      }
      for (const key of ['ngoc', 'khan']) await page.locator(`#accessory-options [data-value="${key}"]`).click();
      await page.locator('input[value="ao-dai"]').check();
      await page.locator('#color-options [data-color="ivory"]').click();
    }
    fs.writeFileSync(path.join(output, 'ui-report.json'), JSON.stringify(results, null, 2) + '\n');
    console.log('Verified all three styles and classic ngu than with jade earrings and headscarf in all five colors on desktop and mobile.');
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
