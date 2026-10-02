'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const { chromium } = require(path.join(process.env.APPDATA, 'npm/node_modules/openclaw/node_modules/playwright-core'));

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    await page.route(/https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com)\//, route => route.fulfill({ status: 200, contentType: 'text/css', body: '' }));
    await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
    for (const width of [320, 390, 540, 768, 820, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      const size = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
      assert.ok(size.document <= size.viewport && size.body <= size.viewport, `Overflow at ${width}: ${JSON.stringify(size)}`);
      console.log(`PASS layout at ${width}px`);
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.screenshot({ path: path.join(__dirname, 'desktop.png') });
    const sectionStyle = '.site-header, .skip-link { visibility: hidden !important; }';
    await page.locator('#studio').screenshot({ path: path.join(__dirname, 'desktop-studio.png'), style: sectionStyle });
    await page.locator('#lookbook').screenshot({ path: path.join(__dirname, 'desktop-lookbook.png'), style: sectionStyle });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(__dirname, 'mobile.png') });
    await page.locator('#studio').screenshot({ path: path.join(__dirname, 'mobile-studio.png'), style: sectionStyle });
    await page.locator('#menu-button').click();
    await page.screenshot({ path: path.join(__dirname, 'mobile-menu.png') });
    const surfaces = await page.evaluate(() => Object.fromEntries(['body', '.inspiration-section', '.studio-section', '.config-panel', '.lookbook-section'].map(selector => [selector, getComputedStyle(document.querySelector(selector)).backgroundColor])));
    console.log(JSON.stringify(surfaces, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
