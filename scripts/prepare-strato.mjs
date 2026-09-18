// Prepare a separate upload snapshot. Never upload source code or credentials.
import { readFile, writeFile, mkdir, cp, rm, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
if (pkg.name !== 'bridge2connect-website') throw Error('Wrong project root');
const id = new Date().toISOString().replace(/[:.]/g, '-');
const release = path.join(root, '.deploy-strato', id);
const website = path.join(release, 'website');
const state = path.join(root, '.review', 'strato-transfer');
await mkdir(release, { recursive: true }); await mkdir(state, { recursive: true });
execFileSync(process.execPath, ['scripts/build.mjs'], { cwd: root, stdio: 'inherit',
  env: { ...process.env, SITE_BASE_PATH: '', SITE_ORIGIN: 'https://bridge2connect.nl' } });
await cp(path.join(root, 'dist'), website, { recursive: true });
for (const name of ['_headers', '.nojekyll']) await rm(path.join(website, name), { force: true });
// Site-specific hosting disclosure in the release; source update follows separately.
for (const rel of ['privacy/index.html', 'en/privacy/index.html']) {
  const file = path.join(website, rel); let html = await readFile(file, 'utf8');
  html = html.replace('wordt gehost op GitHub Pages.', 'wordt gehost bij STRATO.')
             .replace('is hosted on GitHub Pages.', 'is hosted by STRATO.');
  await writeFile(file, html, 'utf8');
}
await writeFile(path.join(website, '.htaccess'), 'DirectoryIndex index.html\nErrorDocument 404 /404.html\n<IfModule mod_mime.c>\n  AddType image/avif .avif\n  AddType image/webp .webp\n</IfModule>\n<IfModule mod_headers.c>\n  Header set X-Content-Type-Options "nosniff"\n  Header set Referrer-Policy "strict-origin-when-cross-origin"\n  Header set X-Robots-Tag "noindex, nofollow"\n</IfModule>\n');
const files = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) throw Error('Symlinks are not publishable');
    if (entry.isDirectory()) { await walk(full); continue; }
    const relative = path.relative(website, full).replaceAll('\\', '/');
    if (!/^(?:\.htaccess|robots\.txt|build-info\.json|[a-zA-Z0-9_/-]+\.(?:html|css|js|png|jpg|jpeg|webp|avif|svg))$/.test(relative)) throw Error('Unexpected upload file: ' + relative);
    const data = await readFile(full);
    if (relative.endsWith('.html')) {
      const html = data.toString('utf8');
      if (/\b(?:href|src)="\/bridge2connect\//.test(html)) throw Error('GitHub base path remains: ' + relative);
      if (!html.includes('noindex, nofollow')) throw Error('Review noindex missing: ' + relative);
      const english = relative.startsWith('en/');
      if (!html.includes(`<html lang="${english ? 'en' : 'nl'}"`)) throw Error('Language mismatch: ' + relative);
    }
    files.push({ path: relative, bytes: data.length, sha256: createHash('sha256').update(data).digest('hex') });
  }
}
await walk(website);
if (files.filter(f => f.path.endsWith('.html')).length !== 14) throw Error('Expected fourteen bilingual HTML pages');
const manifest = { project: pkg.name, version: pkg.version, release: id, origin: 'https://bridge2connect.nl', files };
await writeFile(path.join(release, 'manifest.json'), JSON.stringify(manifest, null, 2));
await writeFile(path.join(state, 'release.json'), JSON.stringify({ folder: release, release: id }, null, 2));
console.log(JSON.stringify({ release: id, folder: release, pages: 14, files: files.length,
  bytes: files.reduce((n, f) => n + f.bytes, 0), sourceUploaded: false, dnsChanged: false }, null, 2));
