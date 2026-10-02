'use strict';

// Minimal local server for the static AttireCraft website.
const http = require('node:http');
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

class RequestError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function sendError(res, error) {
  const body = JSON.stringify({ error: { code: error.code, message: error.message } });
  res.writeHead(error.status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
}

function assertLocalRequest(req) {
  let host;
  try { host = new URL(`http://${req.headers.host || ''}`); }
  catch (_) { throw new RequestError(403, 'local_only', 'Chỉ hỗ trợ truy cập từ máy đang chạy web.'); }
  const allowedHosts = ['localhost', '127.0.0.1', '[::1]'];
  const allowedAddresses = ['127.0.0.1', '::1', '::ffff:127.0.0.1'];
  if (!allowedHosts.includes(host.hostname) || host.pathname !== '/' || host.username || host.password || Number(host.port || 80) !== req.socket.localPort || !allowedAddresses.includes(req.socket.remoteAddress)) {
    throw new RequestError(403, 'local_only', 'Chỉ hỗ trợ truy cập từ máy đang chạy web.');
  }
}

function createServer(options = {}) {
  const root = fs.realpathSync(options.frontendRoot || path.join(__dirname, 'frontend'));

  async function serveStatic(req, res, pathname) {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.setHeader('Allow', 'GET, HEAD');
      throw new RequestError(405, 'method_not_allowed', 'Phương thức không được hỗ trợ.');
    }
    let decoded;
    try { decoded = decodeURIComponent(pathname); }
    catch (_) { throw new RequestError(400, 'invalid_path', 'Đường dẫn không hợp lệ.'); }
    if (decoded.includes('\\') || decoded.includes('\0') || decoded.split('/').some(part => part.startsWith('.'))) {
      throw new RequestError(404, 'not_found', 'Không tìm thấy trang.');
    }
    const file = path.resolve(root, `.${decoded === '/' ? '/index.html' : decoded}`);
    const relative = path.relative(root, file);
    if (relative.startsWith('..') || path.isAbsolute(relative)) throw new RequestError(404, 'not_found', 'Không tìm thấy trang.');
    let actual;
    let stat;
    try {
      actual = await fsp.realpath(file);
      stat = await fsp.stat(actual);
    } catch (_) {
      throw new RequestError(404, 'not_found', 'Không tìm thấy trang.');
    }
    const actualRelative = path.relative(root, actual);
    if (actualRelative.startsWith('..') || path.isAbsolute(actualRelative) || !stat.isFile()) throw new RequestError(404, 'not_found', 'Không tìm thấy trang.');
    const type = MIME[path.extname(actual).toLowerCase()];
    if (!type) throw new RequestError(404, 'not_found', 'Không tìm thấy trang.');
    res.writeHead(200, {
      'Content-Type': type,
      'Content-Length': stat.size,
      'Cache-Control': type.startsWith('image/') ? 'public, max-age=3600' : 'no-store'
    });
    if (req.method === 'HEAD') { res.end(); return; }
    const stream = fs.createReadStream(actual);
    stream.once('error', () => res.destroy());
    res.once('close', () => stream.destroy());
    stream.pipe(res);
  }

  const server = http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'same-origin');
    try {
      assertLocalRequest(req);
      const url = new URL(req.url, `http://${req.headers.host}`);
      await serveStatic(req, res, url.pathname);
    } catch (error) {
      req.resume();
      sendError(res, error instanceof RequestError ? error : new RequestError(500, 'server_error', 'Web gặp lỗi xử lý. Hãy thử lại.'));
    }
  });
  server.requestTimeout = 30000;
  server.headersTimeout = 15000;
  server.keepAliveTimeout = 5000;
  server.maxRequestsPerSocket = 100;
  return server;
}

if (require.main === module) {
  const server = createServer();
  server.listen(4173, '127.0.0.1', () => console.log('AttireCraft: http://127.0.0.1:4173'));
  server.on('error', error => {
    console.error(error.code === 'EADDRINUSE' ? 'Cổng web đang được sử dụng.' : 'Không khởi động được server.');
    process.exitCode = 1;
  });
  process.once('SIGINT', () => server.close());
  process.once('SIGTERM', () => server.close());
}

module.exports = { createServer };
