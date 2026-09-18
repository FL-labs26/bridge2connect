import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawn, spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const watching = process.argv.includes('--watch');
const wantsOpen = process.argv.includes('--open');
const clients = new Set();
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8' };
const headers = { 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'Permissions-Policy': 'camera=(), microphone=(), geolocation=()', 'Cache-Control': 'no-store' };
function rebuild() {
  const child = spawnSync(process.execPath, [path.join(root, 'scripts/build.mjs')], { cwd: root, stdio: 'inherit' });
  if (child.status !== 0) throw new Error('Build failed. Fix the reported issue and try again.');
}
rebuild();

const server = http.createServer(async (request, response) => {
  try {
    if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405, { ...headers, Allow: 'GET, HEAD' }); response.end('Method not allowed'); return; }
    const url = new URL(request.url, 'http://127.0.0.1');
    if (watching && url.pathname === '/__dev/events') {
      response.writeHead(200, { ...headers, 'Content-Type': 'text/event-stream', Connection: 'keep-alive' });
      response.write(': connected\n\n'); clients.add(response);
      request.on('close', () => clients.delete(response)); return;
    }
    if (watching && url.pathname === '/__dev/client.js') {
      response.writeHead(200, { ...headers, 'Content-Type': mime['.js'] });
      response.end('new EventSource("/__dev/events").onmessage = () => location.reload();'); return;
    }
    const pathname = decodeURIComponent(url.pathname);
    if (pathname.includes('\0') || pathname.includes('\\') || pathname.split('/').some(part => part === '..' || part.startsWith('.'))) {
      response.writeHead(400, headers); response.end('Invalid path'); return;
    }
    let candidate = path.resolve(dist, '.' + pathname);
    if (candidate !== dist && !candidate.startsWith(dist + path.sep)) { response.writeHead(403, headers); response.end('Forbidden'); return; }
    let code = 200;
    try {
      const info = await stat(candidate);
      if (info.isDirectory()) {
        if (!pathname.endsWith('/')) { response.writeHead(308, { ...headers, Location: pathname + '/' + url.search }); response.end(); return; }
        candidate = path.join(candidate, 'index.html');
      }
    } catch { candidate = path.join(dist, '404.html'); code = 404; }
    let data;
    try { data = await readFile(candidate); } catch { candidate = path.join(dist, '404.html'); data = await readFile(candidate); code = 404; }
    const ext = path.extname(candidate);
    if (ext === '.html' && watching) data = Buffer.from(data.toString().replace('</body>', '<script src="/__dev/client.js"></script></body>'));
    response.writeHead(code, { ...headers, 'Content-Type': mime[ext] || 'application/octet-stream', 'Content-Length': data.length });
    response.end(request.method === 'HEAD' ? undefined : data);
  } catch (error) { console.error(error.message); if (!response.headersSent) response.writeHead(500, headers); response.end('Local preview error'); }
});
let port = Number(process.env.PORT || 4342);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid PORT. Use an integer from 1024 through 65535.');
let retries = 0;
server.on('error', error => {
  if (error.code === 'EADDRINUSE' && retries++ < 10) { port++; server.listen(port, '127.0.0.1'); }
  else { console.error(error.message); process.exitCode = 1; }
});
server.listen(port, '127.0.0.1');
server.on('listening', async () => {
  const url = `http://127.0.0.1:${port}/`;
  console.log(`\nBridge2Connect staat op: ${url}\n${watching ? 'Wijzigingen in src/ en public/ worden automatisch herbouwd.\n' : ''}Sluiten: Ctrl+C. Alleen bereikbaar op deze computer.\n`);
  if (wantsOpen) {
    if (os.platform() === 'win32') {
      const possible = ['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'];
      let browser;
      for (const candidate of possible) { try { await stat(candidate); browser = candidate; break; } catch {} }
      const child = browser ? spawn(browser, [url], { detached: true, stdio: 'ignore' }) : spawn('cmd.exe', ['/c', 'start', '', url], { detached: true, stdio: 'ignore' });
      child.on('error', error => console.error(`Open de bovenstaande URL handmatig: ${error.message}`)); child.unref();
    } else if (os.platform() === 'darwin') { const child = spawn('open', [url], { stdio: 'ignore' }); child.on('error', () => {}); }
  }
});
let timer;
if (watching) {
  for (const folder of ['src', 'public']) {
    watch(path.join(root, folder), { recursive: true }, () => {
      clearTimeout(timer); timer = setTimeout(() => { try { rebuild(); for (const client of clients) client.write('data: reload\n\n'); } catch (error) { console.error(error.message); } }, 180);
    });
  }
}
process.on('SIGINT', () => { for (const client of clients) client.end(); server.close(); process.exit(0); });
