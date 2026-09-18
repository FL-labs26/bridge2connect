import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { build, root } from '../scripts/build.mjs';
import { site, pages, companies } from '../src/content/site.mjs';
import { escape, safeUrl } from '../src/components/ui.mjs';
import { publicationIssues } from '../scripts/preflight.mjs';

await build();
for (const [name, page] of Object.entries(pages)) {
  test(`${name}: correct title, language and one main heading`, async () => {
    const file = path.join(root, 'dist', page.path === '/404.html' ? '404.html' : path.join(page.path, 'index.html'));
    const html = await readFile(file, 'utf8');
    assert.ok(html.includes(`<title>${escape(page.title)}</title>`));
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.equal((html.match(/<main\b/g) || []).length, 1);
    assert.ok(html.includes('<html lang="nl">'));
    assert.ok(html.includes('noindex, nofollow'));
    assert.ok(!html.includes('undefined'));
    assert.ok(!/href="(?:#|javascript:|tel:|mailto:)"/.test(html));
  });
}
test('Escapes HTML and attribute injection', () => assert.equal(escape('<script x="a">&\''), '&lt;script x=&quot;a&quot;&gt;&amp;&#39;'));
test('Accepts only safe external URL schemes', () => { assert.equal(safeUrl('javascript:alert(1)'), ''); assert.equal(safeUrl('http://example.com'), ''); assert.equal(safeUrl('https://example.com'), 'https://example.com/'); });
test('Rejects invalid email recipients', () => { assert.equal(safeUrl('none', { email: true }), ''); assert.equal(safeUrl('', { email: true }), ''); assert.equal(safeUrl('test@example.org', { email: true }), 'mailto:test@example.org'); });
test('Does not pretend the website is published', () => { assert.equal(site.published, false); assert.ok(publicationIssues().length > 0); });
test('Contains all supplied company names', async () => { const html = await readFile(path.join(root, 'dist/netwerk/index.html'), 'utf8'); for (const name of companies) assert.ok(html.includes(escape(name))); });
test('Contact form does not claim to send a message', async () => { const html = await readFile(path.join(root, 'dist/contact/index.html'), 'utf8'); assert.ok(html.includes('E-mail opstellen')); assert.ok(html.includes('nog niet verstuurd')); assert.ok(html.includes(`data-recipient="${site.email}"`)); });
test('No tracker or external font dependency in generated HTML', async () => { const html = await readFile(path.join(root, 'dist/index.html'), 'utf8'); assert.ok(!/https:\/\/(?:fonts\.|www\.googletagmanager|www\.google-analytics)/.test(html)); });
test('Robots blocks indexing in draft mode', async () => { assert.equal(await readFile(path.join(root, 'dist/robots.txt'), 'utf8'), 'User-agent: *\nDisallow: /\n'); });
test('Hero is a declared AI still, not mislabeled interactive 3D', async () => { const html = await readFile(path.join(root, 'dist/index.html'), 'utf8'); assert.ok(html.includes('AI-sfeerimpressie')); assert.ok(!html.includes('<canvas')); assert.ok(html.includes('fetchpriority="high"')); });

test('Confirmed email is configured and available as a real contact link', async () => {
  assert.equal(site.email, 'lexdelange@bridge2connect.nl');
  const html = await readFile(path.join(root, 'dist/contact/index.html'), 'utf8');
  assert.ok(html.includes('href="mailto:lexdelange@bridge2connect.nl"'));
  assert.ok(!html.includes('De definitieve contactgegevens worden nog toegevoegd'));
});

// Regression checks from the September visual review.
test('Hero has no location/3D caption and portrait has no decorative line', async () => {
  const html = await readFile(path.join(root, 'dist/index.html'), 'utf8');
  assert.ok(!html.includes('class="hero-location"'));
  assert.ok(!html.includes('portrait-line'));
  assert.ok(!html.includes('Architectonische 3D-impressie'));
});
test('Header and footer use the transparent PNG, not the white-matted logo', async () => {
  const html = await readFile(path.join(root, 'dist/index.html'), 'utf8');
  assert.equal((html.match(/src="\/images\/logo.png"/g) || []).length, 2);
  assert.ok(!html.includes('src="/images/logo.webp"'));
  const png = await readFile(path.join(root, 'public/images/logo.png'));
  assert.equal(png.subarray(1, 4).toString(), 'PNG');
  assert.equal(png[25], 6, 'PNG color type is RGBA');
});
test('Homepage services have no decorative numbering or generic icons', async () => {
  const html = await readFile(path.join(root, 'dist/index.html'), 'utf8');
  assert.ok(!html.includes('service-top'));
  assert.ok(!html.includes('service-number'));
  assert.ok(!html.includes('lex-name'));
});
