const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || 4174);
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.ttf': 'font/ttf', '.otf': 'font/otf', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { res.writeHead(400).end(); return; }
  const file = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
  if (!file.startsWith(root + path.sep) || /(?:^|\/)(?:\.git|\.codex|\.agents|\.aws|node_modules)(?:\/|$)/.test(pathname)) { res.writeHead(403).end(); return; }
  fs.stat(file, (error, stat) => {
    if (error || !stat.isFile()) { res.writeHead(404).end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': `${mime[path.extname(file)] || 'application/octet-stream'}; charset=utf-8`, 'Cache-Control': 'no-store' });
    fs.createReadStream(file).pipe(res);
  });
});
server.on('error', error => { console.error(`Cannot start GeoGlyph on port ${port}: ${error.message}`); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log(`GeoGlyph: http://localhost:${port}`));
