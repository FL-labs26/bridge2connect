import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('HTTP preview routes and asset handling', { timeout: 20000 }, async t => {
  const child = spawn(process.execPath, ['scripts/serve.mjs'], { cwd: root, env: { ...process.env, PORT: '45320' }, stdio: ['ignore', 'pipe', 'pipe'] });
  let log = '';
  try {
    const base = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Test server startup timed out: ' + log)), 8000);
      child.stdout.on('data', data => { log += data; const match = log.match(/http:\/\/127\.0\.0\.1:(\d+)/); if (match) { clearTimeout(timer); resolve(match[0]); } });
      child.stderr.on('data', data => { log += data; });
      child.on('error', error => { clearTimeout(timer); reject(error); });
      child.on('exit', code => { if (code) { clearTimeout(timer); reject(new Error(log)); } });
    });
    await t.test('Six content pages return HTTP 200', async () => {
      for (const route of ['/', '/expertise/', '/over-lex/', '/netwerk/', '/contact/', '/privacy/']) {
        const response = await fetch(base + route); assert.equal(response.status, 200); assert.ok((await response.text()).includes('<main'));
      }
    });
    await t.test('Unknown route returns the real 404 page and status', async () => { const r = await fetch(base + '/niet-bestaand/'); assert.equal(r.status, 404); assert.ok((await r.text()).includes('Pagina niet gevonden')); });
    await t.test('Directory routes redirect to a trailing slash', async () => { const r = await fetch(base + '/expertise', { redirect: 'manual' }); assert.equal(r.status, 308); assert.equal(r.headers.get('location'), '/expertise/'); });
    await t.test('There is no unconfigured POST endpoint', async () => { const r = await fetch(base + '/contact/', { method: 'POST', body: 'test' }); assert.equal(r.status, 405); });
    await t.test('HEAD returns headers without a body', async () => { const r = await fetch(base + '/', { method: 'HEAD' }); assert.equal(r.status, 200); assert.equal(await r.text(), ''); });
    await t.test('HTML, styles, scripts and responsive image variants resolve', async () => {
      const html = await (await fetch(base)).text();
      const assets = new Set([...html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+|\/images\/[^"?#]+|\/favicon\.png)"/g)].map(m => m[1]));
      for (const asset of [...assets, '/images/bridge-960.avif', '/images/bridge-1672.avif', '/images/lex-400.webp']) { const r = await fetch(base + asset); assert.equal(r.status, 200, asset); assert.ok((await r.arrayBuffer()).byteLength > 0); }
    });
    await t.test('Every local navigation link resolves', async () => {
      for (const route of ['/', '/expertise/', '/over-lex/', '/netwerk/', '/contact/', '/privacy/']) {
        const html = await (await fetch(base + route)).text();
        const links = new Set([...html.matchAll(/href="(\/[^"#]*)(?:#[^"]*)?"/g)].map(m => m[1].replace(/&amp;/g,'&')));
        for (const href of links) assert.equal((await fetch(base + href)).status, 200, href);
      }
    });
    await t.test('Draft robots and basic response headers are set', async () => { const r = await fetch(base); assert.equal(r.headers.get('x-content-type-options'), 'nosniff'); const robots = await (await fetch(base + '/robots.txt')).text(); assert.ok(robots.includes('Disallow: /')); });
    await t.test('Source files and dot paths are not exposed by preview', async () => { assert.equal((await fetch(base + '/src/content/site.mjs')).status, 404); assert.equal((await fetch(base + '/.env')).status, 400); });
  } finally { child.kill(); }
});
