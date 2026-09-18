/** GitHub project Pages needs /repository/; local preview keeps the root path. */
export function normalizeBasePath(value = '') {
  if (!value || value === '/') return '';
  if (!/^\/[A-Za-z0-9_-]+\/?$/.test(value)) {
    throw new Error('SITE_BASE_PATH must be empty or a single /repository-name/ segment.');
  }
  return value.replace(/\/$/, '');
}
export function prefixHtmlPaths(html, value = '') {
  const base = normalizeBasePath(value);
  if (!base) return html;
  return html
    .replace(/\b(href|src|action)="\/(?!\/)([^"]*)"/g, (_, key, rest) => `${key}="${base}/${rest}"`)
    .replace(/\bsrcset="([^"]*)"/g, (_, sources) => `srcset="${sources.split(',').map(item => item.trim().replace(/^\/(?!\/)/, `${base}/`)).join(', ')}"`);
}
