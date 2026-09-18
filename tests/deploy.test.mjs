import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { build, root } from '../scripts/build.mjs';
import { normalizeBasePath, prefixHtmlPaths } from '../scripts/paths.mjs';

test('Project base paths are validated; traversal and external origins are rejected', () => {
  assert.equal(normalizeBasePath('/bridge2connect/'), '/bridge2connect');
  assert.equal(normalizeBasePath('/'), '');
  for (const invalid of ['../other', '/../../other', 'https://example.org', '//other', '/one/two']) {
    assert.throws(() => normalizeBasePath(invalid));
  }
});
test('Subpath deployment rewrites links and all responsive image candidates', () => {
  const html = '<a href="/contact/?a=b#x">Contact</a><img src="/images/logo.png" srcset="/a.webp 400w, /b.webp 640w"><a href="#x">Anchor</a><a href="mailto:lex@example.org">Mail</a>';
  const out = prefixHtmlPaths(html, '/bridge2connect/');
  assert.ok(out.includes('href="/bridge2connect/contact/?a=b#x"'));
  assert.ok(out.includes('srcset="/bridge2connect/a.webp 400w, /bridge2connect/b.webp 640w"'));
  assert.ok(out.includes('href="#x"'));
  assert.ok(out.includes('href="mailto:lex@example.org"'));
});
test('Actual Pages build retains noindex and correct CSS, logo and page links', async () => {
  try {
    await build({ basePath: '/bridge2connect' });
    const html = await readFile(path.join(root, 'dist/index.html'), 'utf8');
    assert.ok(html.includes('href="/bridge2connect/contact/"'));
    assert.ok(html.includes('src="/bridge2connect/images/logo.png"'));
    assert.ok(html.includes('href="/bridge2connect/assets/site-'));
    assert.ok(html.includes('noindex, nofollow'));
    assert.ok(!/\b(?:src|href)="\/(?!bridge2connect\/)/.test(html));
    assert.equal(await readFile(path.join(root, 'dist/.nojekyll'), 'utf8'), '');
  } finally { await build({ basePath: '' }); }
});
