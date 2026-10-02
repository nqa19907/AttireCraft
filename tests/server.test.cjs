'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { createServer } = require('../server.cjs');

async function withServer(t) {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  t.after(() => new Promise(resolve => server.close(resolve)));
  return `http://127.0.0.1:${server.address().port}`;
}

test('serves the static website and its assets', async t => {
  const base = await withServer(t);
  const page = await fetch(`${base}/`);
  assert.equal(page.status, 200);
  assert.match(page.headers.get('content-type'), /^text\/html/);
  assert.match(await page.text(), /AttireCraft/);

  const script = await fetch(`${base}/app.js`);
  assert.equal(script.status, 200);
  assert.match(script.headers.get('content-type'), /^text\/javascript/);

  const head = await fetch(`${base}/styles.css`, { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
});

test('rejects unsupported methods, hidden paths and missing files', async t => {
  const base = await withServer(t);
  const post = await fetch(`${base}/`, { method: 'POST' });
  assert.equal(post.status, 405);
  assert.equal(post.headers.get('allow'), 'GET, HEAD');

  for (const pathname of ['/.hidden', '/api/missing', '/missing.png']) {
    const response = await fetch(base + pathname);
    assert.equal(response.status, 404, pathname);
  }
});
