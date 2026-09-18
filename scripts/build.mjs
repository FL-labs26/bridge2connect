import { readFile, writeFile, mkdir, cp, rm, rename, lstat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { site, pages } from '../src/content/site.mjs';
import { layout } from '../src/components/layout.mjs';
import home from '../src/pages/home.mjs';
import expertise from '../src/pages/expertise.mjs';
import about from '../src/pages/about.mjs';
import network from '../src/pages/network.mjs';
import contact from '../src/pages/contact.mjs';
import privacy from '../src/pages/privacy.mjs';
import notfound from '../src/pages/notfound.mjs';
import { normalizeBasePath, prefixHtmlPaths } from './paths.mjs';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
const renderers = { home, expertise, about, network, contact, privacy, notfound };
const digest = value => createHash('sha256').update(value).digest('hex').slice(0, 10);

export async function build({ basePath = process.env.SITE_BASE_PATH || '' } = {}) {
  const deployBase = normalizeBasePath(basePath);
  const manifest = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
  if (manifest.name !== 'bridge2connect-website') throw new Error('Unexpected project root; build stopped.');
  try { if ((await lstat(output)).isSymbolicLink()) throw new Error('Refusing to replace a symlinked dist directory.'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (site.published) {
    const { publicationIssues } = await import('./preflight.mjs');
    const issues = publicationIssues();
    if (issues.length) throw new Error('Publication is blocked:\n' + issues.join('\n'));
  }
  const staging = path.join(root, `.build-${process.pid}`);
  await mkdir(path.join(staging, 'assets'), { recursive: true });
  try {
    await cp(path.join(root, 'public'), staging, { recursive: true });
    const css = await readFile(path.join(root, 'src/styles/site.css'));
    const js = Buffer.concat([await readFile(path.join(root, 'src/client/site.js')), Buffer.from('\n;\n'), await readFile(path.join(root, 'src/client/motion.js'))]);
    const assets = { css: `/assets/site-${digest(css)}.css`, js: `/assets/site-${digest(js)}.js` };
    await writeFile(path.join(staging, assets.css), css);
    await writeFile(path.join(staging, assets.js), js);
    for (const [key, page] of Object.entries(pages)) {
      const relative = page.path === '/404.html' ? '404.html' : path.join(page.path, 'index.html');
      const dest = path.join(staging, relative);
      await mkdir(path.dirname(dest), { recursive: true });
      const html = layout(page, renderers[key](), { assets, className: `page-${key}`, withCta: !['contact', 'privacy', 'notfound'].includes(key) });
      await writeFile(dest, prefixHtmlPaths(html, deployBase), 'utf8');
    }
    await writeFile(path.join(staging, '.nojekyll'), '');
    await writeFile(path.join(staging, 'robots.txt'), site.published ? `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml', site.domain).href}\n` : 'User-agent: *\nDisallow: /\n');
    if (site.published) {
      const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.values(pages).filter(page => page.path !== '/404.html').map(page => `<url><loc>${new URL(page.path, site.domain).href.replace(/&/g, '&amp;')}</loc></url>`).join('')}</urlset>`;
      await writeFile(path.join(staging, 'sitemap.xml'), xml);
    }
    await writeFile(path.join(staging, '_headers'), `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: DENY\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n`);
    await rm(output, { recursive: true, force: true });
    await rename(staging, output);
    const result = { pages: Object.keys(pages).length, output, cssBytes: css.length, jsBytes: js.length, mode: site.published ? 'published' : 'draft' };
    console.log(`Built ${result.pages} pages → dist/ (${result.mode})`);
    return result;
  } catch (error) { await rm(staging, { recursive: true, force: true }); throw error; }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  build().catch(error => { console.error(error.message); process.exitCode = 1; });
}
