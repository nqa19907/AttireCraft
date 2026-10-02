'use strict';

const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('C:/Users/ADMIN/AppData/Roaming/npm/node_modules/openclaw/node_modules/playwright-core');
const root = path.resolve(__dirname, '../../frontend');
const server = http.createServer((request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) return response.writeHead(404).end();
  const type = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png' }[path.extname(file)];
  response.writeHead(200, { 'Content-Type': type || 'application/octet-stream' });
  fs.createReadStream(file).pipe(response);
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  try {
    for (const width of [1440, 768, 390]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      await context.route(/https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com)\//, route => route.fulfill({ status: 200, contentType: 'text/css', body: '' }));
      await page.goto(`http://127.0.0.1:${server.address().port}`, { waitUntil: 'networkidle' });
      await page.locator('.heritage-feature').scrollIntoViewIfNeeded();
      await page.locator('.feature-art img').evaluate(image => image.decode());
      await page.locator('.heritage-feature').screenshot({ path: path.join(__dirname, `heritage-${width}.png`) });
      const positions = await page.locator('.hero-image-frame img, .inspiration-card img, .model-stage img, .feature-art img').evaluateAll(images => images.map(image => ({ class: image.parentElement.className, fit: getComputedStyle(image).objectFit, position: getComputedStyle(image).objectPosition })));
      console.log(JSON.stringify({ width, positions }));
      await context.close();
    }
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; server.close(); });
