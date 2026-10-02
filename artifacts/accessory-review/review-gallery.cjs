'use strict';
const path = require('node:path');
const fs = require('node:fs');
const { chromium } = require(path.join(process.env.APPDATA, 'npm/node_modules/openclaw/node_modules/playwright-core'));
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    await page.goto('file:///' + path.join(__dirname, 'gallery.html').replaceAll('\\', '/'));
    const sections = await page.locator('section').all();
    const output = path.join(__dirname, 'review');
    fs.mkdirSync(output, { recursive: true });
    for (const section of sections) {
      const id = await section.getAttribute('id');
      await section.scrollIntoViewIfNeeded();
      await section.locator('img').evaluateAll(images => images.forEach(image => image.loading = 'eager'));
      await section.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
      await section.screenshot({ path: path.join(output, id + '.png') });
    }
    console.log(`Saved ${sections.length} outfit review sheets.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
