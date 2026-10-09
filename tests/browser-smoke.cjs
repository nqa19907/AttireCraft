/* Run with: node tests/browser-smoke.cjs
 * Uses an installed Playwright package and Chromium; it does not install tools.
 * Optional: PLAYWRIGHT_MODULE, BROWSER_EXECUTABLE, TEST_SCREENSHOTS, TEST_FILTER.
 */
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', 'frontend');
const STORAGE_KEY = 'attirecraft-lookbook';
const garmentKeys = ['ao-dai', 'tu-than', 'ngu-than', 'ba-ba'];
const colorKeys = ['ivory', 'red', 'teal', 'pink', 'black'];
const screenshotDir = process.env.TEST_SCREENSHOTS && path.resolve(process.env.TEST_SCREENSHOTS);
const testFilter = process.env.TEST_FILTER && new RegExp(process.env.TEST_FILTER, 'i');

function sampleLook(overrides = {}) {
  return { garment: 'ao-dai', occasion: 'le-hoi', weather: 'warm', color: 'ivory', style: 'minimal', accessories: [], id: 'example-look', createdAt: 1750000000000, ...overrides };
}

function findPlaywright() {
  const candidates = [process.env.PLAYWRIGHT_MODULE, 'playwright', 'playwright-core'];
  if (process.env.APPDATA) candidates.push(path.join(process.env.APPDATA, 'npm', 'node_modules', 'openclaw', 'node_modules', 'playwright-core'));
  for (const candidate of candidates.filter(Boolean)) {
    try { return require(candidate); } catch (error) {
      if (error.code !== 'MODULE_NOT_FOUND') throw error;
    }
  }
  throw new Error('Playwright is not available. Set PLAYWRIGHT_MODULE to an existing playwright or playwright-core package.');
}

function findBrowser() {
  const candidates = [
    process.env.BROWSER_EXECUTABLE,
    process.env.PROGRAMFILES && path.join(process.env.PROGRAMFILES, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    process.env['PROGRAMFILES(X86)'] && path.join(process.env['PROGRAMFILES(X86)'], 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  ];
  return candidates.find(candidate => candidate && fs.existsSync(candidate));
}

const mimeTypes = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.json': 'application/json; charset=utf-8' };

function startServer() {
  return new Promise((resolve, reject) => {
    const server = require('../server.cjs').createServer({ frontendRoot: ROOT });
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

async function imageReady(page, fragment) {
  await page.waitForFunction(expected => {
    const image = document.querySelector('#model-image');
    return image && image.complete && image.naturalWidth > 0 && (!expected || image.currentSrc.includes(expected));
  }, fragment);
}

async function selectGarment(page, key) {
  await page.locator(`.garment-option:has(input[value="${key}"])`).click();
  assert.equal(await page.locator(`input[name="garment"][value="${key}"]`).isChecked(), true);
}

async function selectColor(page, key) {
  await page.locator(`#color-options [data-color="${key}"]`).click();
}

async function clearAccessories(page) {
  const selected = await page.locator('#accessory-options [aria-pressed="true"]').evaluateAll(buttons => buttons.map(button => button.dataset.value));
  for (const key of selected) await page.locator(`#accessory-options [data-value="${key}"]`).click();
}

async function saveCount(page) {
  return page.locator('#saved-grid .saved-card').count();
}

async function assertNoOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
  assert.ok(dimensions.document <= dimensions.viewport + 1 && dimensions.body <= dimensions.viewport + 1, `${label}: horizontal overflow ${JSON.stringify(dimensions)}`);
}

async function main() {
  const { chromium } = findPlaywright();
  const server = await startServer();
  const origin = `http://127.0.0.1:${server.address().port}`;
  let browser;
  const results = [];
  try {
    browser = await chromium.launch({ headless: true, executablePath: findBrowser() });

    async function scenario(name, run, options = {}) {
      if (testFilter && !testFilter.test(name)) return;
      const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce', ...options.context });
      const errors = [];
      const failures = [];
      // The product must remain usable with its system font fallback offline.
      await context.route(/https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com)\//, route => route.fulfill({ status: 200, contentType: 'text/css', body: '' }));
      if (options.seed !== undefined) {
        await context.addInitScript(({ key, value }) => {
          if (!/^https?:$/.test(location.protocol)) return;
          if (!sessionStorage.getItem('smoke-seeded')) {
            localStorage.setItem(key, value);
            sessionStorage.setItem('smoke-seeded', '1');
          }
        }, { key: STORAGE_KEY, value: options.seed });
      }
      if (options.init) await context.addInitScript(options.init);
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      page.on('response', response => {
        if (response.url().startsWith(origin) && response.status() >= 400) failures.push(`${response.status()} ${response.url()}`);
      });
      page.setDefaultTimeout(7000);
      try {
        await page.goto(origin + (options.suffix || '/'), { waitUntil: 'domcontentloaded' });
        await imageReady(page);
        await run(page, context, origin);
        assert.deepEqual(errors, [], 'No uncaught browser errors');
        assert.deepEqual(failures, [], 'All local assets load successfully');
        results.push({ name, status: 'PASS' });
        process.stdout.write(`PASS ${name}\n`);
      } catch (error) {
        results.push({ name, status: 'FAIL', error: error.message, browserErrors: errors, assetErrors: failures });
        process.stderr.write(`FAIL ${name}: ${error.message}\n`);
        if (screenshotDir) {
          fs.mkdirSync(screenshotDir, { recursive: true });
          await page.screenshot({ path: path.join(screenshotDir, `failed-${name.replace(/[^a-z0-9]+/gi, '-')}.png`), fullPage: true }).catch(() => {});
        }
      } finally { await context.close(); }
    }

    await scenario('responsive layouts and native keyboard selection', async page => {
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await assertNoOverflow(page, `${width}px`);
        if (screenshotDir && [390, 1440].includes(width)) {
          fs.mkdirSync(screenshotDir, { recursive: true });
          await page.locator('#heritage').scrollIntoViewIfNeeded();
          await page.locator('#lookbook').scrollIntoViewIfNeeded();
          await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
          await page.screenshot({ path: path.join(screenshotDir, `attirecraft-${width}.png`), fullPage: true });
        }
      }
      const firstRadio = page.locator('input[name="garment"]').first();
      await firstRadio.focus();
      await page.keyboard.press('ArrowRight');
      assert.equal(await page.locator('input[value="tu-than"]').isChecked(), true, 'Arrow keys change native garment radio');
      const color = page.locator('#color-options [data-color="red"]');
      await color.focus();
      await page.keyboard.press('Enter');
      assert.equal(await color.getAttribute('aria-pressed'), 'true', 'Color exposes selected state to assistive technology');
      await imageReady(page, 'tu-than-red');
      assert.ok((await page.locator('#model-image').getAttribute('alt')).length > 8);
    });

    await scenario('logos and back-to-top links return to the beginning repeatedly', async page => {
      for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 900 });
        for (let repeat = 0; repeat < 2; repeat++) {
          await page.locator('#studio').scrollIntoViewIfNeeded();
          assert.ok(await page.evaluate(() => window.scrollY > 500), 'Start well below the hero');
          if (width === 390) await page.locator('#menu-button').click();
          await page.locator('.site-header .brand').click();
          await page.waitForFunction(() => window.scrollY === 0);
          assert.equal(await page.evaluate(() => location.hash), '#top');
          assert.equal(await page.locator('#menu-button').getAttribute('aria-expanded'), 'false');
        }
        await page.locator('.footer-brand').click();
        await page.waitForFunction(() => window.scrollY === 0);
        await page.locator('.site-footer a[href="#top"]').last().click();
        await page.waitForFunction(() => window.scrollY === 0);
      }
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.locator('#lookbook').scrollIntoViewIfNeeded();
      await page.locator('.site-header .brand').click();
      await page.waitForFunction(() => window.scrollY === 0);
    });

    await scenario('all 20 outfit images and accessory limit', async page => {
      for (const garment of garmentKeys) {
        await selectGarment(page, garment);
        for (const color of colorKeys) {
          await selectColor(page, color);
          await imageReady(page, `${garment}-${color}`);
          assert.equal(await page.locator('#color-options [aria-pressed="true"]').count(), 1);
        }
      }
      for (const accessory of ['non', 'khan']) await page.locator(`#accessory-options [data-value="${accessory}"]`).click();
      assert.equal(await page.locator('#accessory-options [data-value="ngoc"]').getAttribute('aria-disabled'), 'true', 'A third accessory is unavailable at the limit');
      await page.locator('#accessory-options [data-value="ngoc"]').dispatchEvent('click');
      assert.equal(await page.locator('#accessory-options [aria-pressed="true"]').count(), 2, 'At most two accessories');
      await page.locator('#accessory-options [data-value="non"]').click();
      assert.equal(await page.locator('#accessory-options [aria-pressed="true"]').count(), 1);
    });

    await scenario('selected accessories update preview, saved photos and comparison', async page => {
      const items = ['khan', 'ngoc', 'non', 'tui'];
      const combinations = items.map(key => [key]);
      for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) combinations.push([items[i], items[j]]);
      for (const garment of garmentKeys) {
        await selectGarment(page, garment);
        for (const color of colorKeys) {
          await selectColor(page, color);
          for (const accessories of combinations) {
            await clearAccessories(page);
            for (const key of accessories) await page.locator(`#accessory-options [data-value="${key}"]`).click();
            const stem = `${garment}-${color}--${[...accessories].sort().join('-')}`;
            await imageReady(page, `/accessories/${stem}.webp`);
            assert.equal(await page.locator('#model-stage').getAttribute('aria-busy'), 'false');
          }
        }
      }
      await page.locator('#save-button').click();
      const selectedSource = await page.locator('#model-image').getAttribute('src');
      const thumbSource = selectedSource.replace('/accessories/', '/accessories/thumbs/');
      assert.equal(await page.locator('.saved-card img').getAttribute('src'), thumbSource);
      await page.locator('#compare-button').click();
      assert.equal(await page.locator('.compare-item.current img').getAttribute('src'), thumbSource);
      await page.locator('#tray-close').click();
      await clearAccessories(page);
      await imageReady(page, '/ba-ba-black.webp');
      assert.ok(!(await page.locator('#model-image').getAttribute('src')).includes('/accessories/'));
    });

    await scenario('published personality photos and pending fallbacks persist through saving comparison and download', async page => {
      const published = new Set(require('../frontend/style-image-variants.js'));
      const keys = ['khan', 'ngoc', 'non', 'tui'];
      const combinations = [[], ...keys.map(key => [key])];
      for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) combinations.push([keys[i], keys[j]]);
      for (const garment of garmentKeys) {
        await selectGarment(page, garment);
        for (const color of colorKeys) {
          await selectColor(page, color);
          for (const accessories of combinations) {
            await clearAccessories(page);
            for (const key of accessories) await page.locator(`#accessory-options [data-value="${key}"]`).click();
            const stem = `${garment}-${color}${accessories.length ? '--' + [...accessories].sort().join('-') : ''}`;
            for (const style of ['genz', 'classic', 'minimal']) {
              await page.locator(`#style-options [data-value="${style}"]`).click();
              const hasStyle = published.has(`${style}/${stem}`);
              const folder = hasStyle ? `/styles/${style}/` : accessories.length ? '/accessories/' : '/';
              await imageReady(page, folder + stem + '.webp');
              assert.equal(await page.locator('#accessory-options [aria-pressed="true"]').count(), accessories.length);
              if (hasStyle) assert.match(await page.locator('#model-image').getAttribute('alt'), style === 'genz' ? /Kính râm/ : /Vòng cổ ngọc trai/);
            }
          }
        }
      }
      await selectGarment(page, 'ngu-than');
      await selectColor(page, 'ivory');
      await clearAccessories(page);
      for (const key of ['ngoc', 'khan']) await page.locator(`#accessory-options [data-value="${key}"]`).click();
      await page.locator('#style-options [data-value="genz"]').click();
      await imageReady(page, '/styles/genz/');
      await page.locator('#save-button').click();
      await page.locator('#compare-button').click();
      await page.locator('#style-options [data-value="classic"]').click();
      await imageReady(page, '/styles/classic/');
      assert.ok((await page.locator('.saved-card img').getAttribute('src')).includes('/styles/genz/thumbs/'));
      assert.ok((await page.locator('.compare-item.current img').getAttribute('src')).includes('/styles/classic/thumbs/'));
      const png = await page.evaluate(async () => {
        const config = { garment: 'ngu-than', color: 'ivory', occasion: 'le-hoi', weather: 'warm', style: 'classic', accessories: ['ngoc', 'khan'] };
        const source = window.AttireCore.imagePath(config, false, true);
        const blob = await window.AttireDownload.create([config], look => window.AttireCore.imagePath(look, false, true));
        const decoded = await createImageBitmap(blob);
        const original = await createImageBitmap(await (await fetch(source)).blob());
        return { source, type: blob.type, output: [decoded.width, decoded.height], original: [original.width, original.height] };
      });
      assert.ok(png.source.includes('/styles/classic/'));
      assert.equal(png.type, 'image/png');
      assert.deepEqual(png.output, png.original);
      await page.reload();
      assert.ok((await page.locator('.saved-card img').getAttribute('src')).includes('/styles/genz/thumbs/'));
    });

    await scenario('lookbook distinguishes weather and accessories and survives reload', async page => {
      await page.locator('#save-button').click();
      assert.equal(await saveCount(page), 1);
      await page.locator('#save-button').click();
      assert.equal(await saveCount(page), 1, 'Duplicate is not added');
      await page.locator('#weather-select').selectOption('cool');
      await page.locator('#save-button').click();
      assert.equal(await saveCount(page), 2, 'A change of weather is a distinct saved look');
      await page.locator('#accessory-options [data-value="tui"]').click();
      await page.locator('#save-button').click();
      assert.equal(await saveCount(page), 3, 'A change of accessory is a distinct saved look');
      await selectColor(page, 'teal');
      await selectGarment(page, 'ngu-than');
      await page.reload({ waitUntil: 'domcontentloaded' });
      await imageReady(page, 'ngu-than-teal');
      assert.equal(await saveCount(page), 3);
      assert.equal(await page.locator('#weather-select').inputValue(), 'cool');
      assert.equal(await page.locator('#accessory-options [data-value="tui"]').getAttribute('aria-pressed'), 'true');
    });

    await scenario('editing preserves identity and deleting can be undone', async page => {
      const firstCard = page.locator('#saved-grid .saved-card').first();
      const originalId = await firstCard.locator('.saved-edit').getAttribute('data-id');
      await firstCard.locator('.saved-edit').click();
      await selectColor(page, 'black');
      await page.locator('#save-button').click();
      assert.equal(await saveCount(page), 2, 'Editing updates a saved look in place');
      assert.equal(await page.locator(`.saved-edit[data-id="${originalId}"]`).count(), 1, 'Editing preserves the look ID');
      await page.locator(`.saved-edit[data-id="${originalId}"]`).click();
      await imageReady(page, 'ao-dai-black');
      await page.locator(`.remove-look[data-id="${originalId}"]`).click();
      assert.equal(await saveCount(page), 1);
      await page.locator('#undo-button').click();
      assert.equal(await saveCount(page), 2, 'Undo restores deleted look');
      assert.equal(await page.locator(`.saved-edit[data-id="${originalId}"]`).count(), 1);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await imageReady(page);
      assert.equal(await saveCount(page), 2, 'Undo persists restored data');
    }, { seed: JSON.stringify([sampleLook(), sampleLook({ id: 'second-look', color: 'pink' })]) });

    const fullLookbook = garmentKeys.flatMap(garment => colorKeys.map(color => sampleLook({ garment, color, id: `${garment}-${color}` }))).slice(0, 12);
    await scenario('capacity never silently removes existing saved looks', async page => {
      assert.equal(await saveCount(page), 12);
      const before = await page.locator('.saved-edit').evaluateAll(nodes => nodes.map(node => node.dataset.id));
      await selectGarment(page, 'ba-ba');
      await selectColor(page, 'black');
      await page.locator('#save-button').click();
      assert.equal(await saveCount(page), 12);
      assert.deepEqual(await page.locator('.saved-edit').evaluateAll(nodes => nodes.map(node => node.dataset.id)), before, 'Full lookbook leaves every existing entry intact');
      await page.locator('.saved-edit').first().click();
      await page.locator('#weather-select').selectOption('cool');
      await page.locator('#save-button').click();
      assert.equal(await saveCount(page), 12, 'Updating remains possible when full');
    }, { seed: JSON.stringify(fullLookbook) });

    await scenario('comparison updates live and can replace its baseline', async page => {
      assert.equal(await page.locator('#compare-tray').isVisible(), false);
      await page.locator('#compare-button').click();
      assert.equal(await page.locator('#compare-tray').isVisible(), true);
      await page.locator('#set-baseline').click();
      await selectColor(page, 'red');
      await imageReady(page, 'ao-dai-red');
      const currentName = await page.locator('#look-name').innerText();
      assert.ok((await page.locator('#compare-content .current').innerText()).includes(currentName), 'Current comparison follows configuration changes without reopening');
      const changed = await page.locator('#compare-status').innerText();
      assert.match(changed, /Màu|màu|Ngà|Đỏ son/, 'Comparison explains the changed field');
      await page.locator('#set-baseline').click();
      assert.notEqual(await page.locator('#compare-status').innerText(), changed, 'Pin can replace a previous baseline');
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#compare-tray').isVisible(), false);
      assert.equal(await page.locator('#compare-button').evaluate(node => node === document.activeElement), true, 'Closing comparison returns focus');
    });

    await scenario('culture dialog and mobile navigation', async page => {
      const opener = page.locator('.read-button[data-story="tu-than"]');
      await opener.click();
      assert.equal(await page.locator('#story-dialog').evaluate(node => node.open), true);
      assert.ok(await page.locator('#story-dialog').getAttribute('aria-labelledby'), 'Dialog has an accessible title');
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#story-dialog').evaluate(node => node.open), false);
      assert.equal(await opener.evaluate(node => document.activeElement === node), true, 'Closing dialog restores trigger focus');
      await page.setViewportSize({ width: 390, height: 844 });
      await page.locator('#menu-button').click();
      assert.equal(await page.locator('#menu-button').getAttribute('aria-expanded'), 'true');
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#menu-button').getAttribute('aria-expanded'), 'false');
      await page.locator('#menu-button').click();
      await page.locator('.desktop-nav a[href="#studio"]').click();
      assert.equal(await page.locator('#menu-button').getAttribute('aria-expanded'), 'false');
      await page.locator('#menu-button').click();
      await page.locator('#studio-title').click();
      assert.equal(await page.locator('#menu-button').getAttribute('aria-expanded'), 'false', 'Clicking outside navigation closes the mobile menu');
      await assertNoOverflow(page, 'Mobile menu closed');
    });

    for (const bad of ['{invalid json', '{}', 'null', '[null, {}, {"garment":"unknown"}]']) {
      await scenario(`corrupt saved data ${bad.slice(0, 16)}`, async page => {
        assert.equal(await saveCount(page), 0);
        await selectColor(page, 'pink');
        await page.locator('#save-button').click();
        assert.equal(await saveCount(page), 1, 'Recovery permits saving normally');
      }, { seed: bad });
    }

    await scenario('stored labels cannot inject executable markup', async page => {
      assert.equal(await page.evaluate(() => window.__unsafeMarkupExecuted), undefined);
      assert.equal(await page.locator('#saved-grid script, #saved-grid img[onerror]').count(), 0);
      assert.equal(await saveCount(page), 1, 'A valid legacy look remains usable');
    }, { seed: JSON.stringify([{ garment: 'ao-dai', occasion: 'le-hoi', weather: 'warm', color: 'ivory', style: 'minimal', accessories: [], name: '<img src=x onerror="window.__unsafeMarkupExecuted=true">', score: 999, id: '"><script>window.__unsafeMarkupExecuted=true</script>' }]) });

    await scenario('JSON export and import round-trip without partial invalid imports', async page => {
      const [download] = await Promise.all([page.waitForEvent('download'), page.locator('#export-button').click()]);
      const stream = await download.createReadStream();
      const chunks = [];
      for await (const chunk of stream) chunks.push(chunk);
      const exported = Buffer.concat(chunks);
      const document = JSON.parse(exported.toString('utf8'));
      assert.equal(document.version, 2);
      assert.equal(document.looks.length, 2);
      while (await saveCount(page)) await page.locator('.remove-look').first().click();
      await page.locator('#import-input').setInputFiles({ name: 'lookbook.json', mimeType: 'application/json', buffer: exported });
      await page.waitForFunction(() => document.querySelectorAll('#saved-grid .saved-card').length === 2);
      const ids = await page.locator('.saved-edit').evaluateAll(nodes => nodes.map(node => node.dataset.id));
      await page.locator('#import-input').setInputFiles({ name: 'invalid.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ app: 'AttireCraft', version: 2, looks: [sampleLook({ id: 'candidate', garment: 'ba-ba', color: 'black' }), { garment: 'invalid' }] })) });
      await page.waitForFunction(() => /không hợp lệ|chưa được nhập/i.test(document.querySelector('#toast-message').textContent));
      assert.deepEqual(await page.locator('.saved-edit').evaluateAll(nodes => nodes.map(node => node.dataset.id)), ids, 'Invalid file cannot partially change a collection');
      await page.locator('#import-input').setInputFiles({ name: 'untrusted-label.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify([sampleLook({ id: 'unsafe-label', garment: 'ba-ba', color: 'red', name: '<img src=x onerror="window.__unsafeMarkupExecuted=true">', score: 999 })])) });
      await page.waitForFunction(() => document.querySelectorAll('#saved-grid .saved-card').length === 3);
      assert.equal(await page.locator('#saved-grid script, #saved-grid img[onerror]').count(), 0);
      assert.equal(await page.evaluate(() => window.__unsafeMarkupExecuted), undefined);
      assert.equal(await page.locator('#saved-grid').innerText().then(text => text.includes('999')), false, 'Imported derived scores are recomputed');
    }, { seed: JSON.stringify([sampleLook(), sampleLook({ id: 'second-look', color: 'pink' })]) });

    await scenario('share links reconstruct outfits and import collections explicitly', async page => {
      await selectGarment(page, 'ba-ba');
      await selectColor(page, 'teal');
      await page.locator('#accessory-options [data-value="tui"]').click();
      await page.locator('#share-current-button').click();
      await page.locator('#share-link-button').click();
      await page.waitForFunction(() => Boolean(window.__sharedPayload));
      const single = await page.evaluate(() => window.__sharedPayload);
      assert.ok(single.url && single.url.includes('#look='), 'Current outfit share contains reconstructable link');
      await selectColor(page, 'red');
      await page.goto(single.url, { waitUntil: 'domcontentloaded' });
      await imageReady(page, 'ba-ba-teal');
      assert.equal(await page.locator('#accessory-options [data-value="tui"]').getAttribute('aria-pressed'), 'true');
      assert.equal(await saveCount(page), 2, 'Opening an outfit does not alter the local collection');
      await page.locator('#share-button').click();
      await page.locator('#share-link-button').click();
      await page.waitForFunction(() => Boolean(window.__sharedPayload?.url?.includes('#lookbook=')));
      const collection = await page.evaluate(() => window.__sharedPayload.url);
      const retained = sampleLook({ id: 'recipient-existing-look', garment: 'ngu-than', color: 'black' });
      await page.evaluate(({ key, look }) => {
        localStorage.clear();
        localStorage.setItem(key, JSON.stringify([look]));
      }, { key: STORAGE_KEY, look: retained });
      await page.goto('about:blank');
      await page.goto(collection, { waitUntil: 'domcontentloaded' });
      await imageReady(page);
      assert.equal(await saveCount(page), 1, 'Opening a collection leaves recipient data unchanged');
      assert.equal(await page.locator('#shared-lookbook-notice').isVisible(), true);
      await page.locator('#import-shared-button').click();
      assert.equal(await saveCount(page), 3, 'Explicit import merges with existing data');
      assert.equal(await page.locator('.saved-edit[data-id="recipient-existing-look"]').count(), 1);
    }, {
      seed: JSON.stringify([sampleLook(), sampleLook({ id: 'second-look', color: 'pink' })]),
      init: () => { Object.defineProperty(navigator, 'share', { configurable: true, value: async payload => { window.__sharedPayload = payload; } }); }
    });

    await scenario('malformed shared links leave the editor usable', async page => {
      assert.equal(await saveCount(page), 1);
      assert.equal(await page.locator('#saved-grid img[onerror], #saved-grid script').count(), 0);
      await selectColor(page, 'teal');
      await page.locator('#save-button').click();
      assert.equal(await saveCount(page), 2);
    }, { seed: JSON.stringify([sampleLook()]), suffix: '/#lookbook=%3Cscript%3Ealert(1)%3C/script%3E' });

    await scenario('separate tabs sync saved looks while preserving local draft', async (page, context, origin) => {
      const second = await context.newPage();
      const secondErrors = [];
      second.on('pageerror', error => secondErrors.push(error.message));
      await second.goto(origin, { waitUntil: 'domcontentloaded' });
      await imageReady(second);
      await selectGarment(second, 'ngu-than');
      await selectColor(second, 'red');
      await page.locator('#save-button').click();
      await second.waitForFunction(() => document.querySelectorAll('#saved-grid .saved-card').length === 1);
      await imageReady(second, 'ngu-than-red');
      await page.locator('.remove-look').click();
      await second.waitForFunction(() => document.querySelectorAll('#saved-grid .saved-card').length === 0);
      assert.equal(await second.locator('input[value="ngu-than"]').isChecked(), true, 'Lookbook synchronization preserves the other tab’s current garment');
      assert.equal(await second.locator('#color-options [data-color="red"]').getAttribute('aria-pressed'), 'true');
      assert.deepEqual(secondErrors, []);
      await second.close();
    });

    await scenario('unavailable storage leaves editor and temporary saving usable', async page => {
      await selectGarment(page, 'ba-ba');
      await selectColor(page, 'red');
      await imageReady(page, 'ba-ba-red');
      await page.locator('#save-button').click();
      assert.equal(await saveCount(page), 1);
      const notice = await page.locator('#toast').innerText();
      assert.ok(notice.length > 0, 'Storage limitation is communicated');
    }, { init: () => {
      Storage.prototype.getItem = function () { throw new DOMException('Storage disabled', 'SecurityError'); };
      Storage.prototype.setItem = function () { throw new DOMException('Storage disabled', 'SecurityError'); };
    } });

    const failed = results.filter(result => result.status === 'FAIL').length;
    assert.ok(results.length, 'TEST_FILTER must match at least one scenario');
    process.stdout.write(`\n${results.length - failed}/${results.length} browser scenarios passed.\n`);
    if (failed) process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}

main().catch(error => { process.stderr.write(error.stack + '\n'); process.exitCode = 1; });
