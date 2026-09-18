export function escape(value = '') {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}

export function safeUrl(value, { email = false } = {}) {
  if (!value) return '';
  if (email) return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value) ? `mailto:${value}` : '';
  try { const url = new URL(value); return url.protocol === 'https:' ? url.href : ''; } catch { return ''; }
}

export function icon(name = 'arrow', className = '') {
  const paths = {
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    diagonal: '<path d="M6 18 18 6M6 6h12v12"/>',
    down: '<path d="M12 4v16m-6-6 6 6 6-6"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    connection: '<circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="19" r="2"/><path d="M7 6h10M6 8l5 9m7-9-5 9"/>',
    'arrow-path': '<path d="M4 7h10a5 5 0 0 1 0 10H5m4-4-4 4 4 4M4 3v8"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 6 9 7 9-7"/>',
    phone: '<path d="m5 3 4 4-2 3a14 14 0 0 0 7 7l3-2 4 4-2 2C9 21 3 15 3 5z"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
  };
  return `<svg class="icon ${escape(className)}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
}

export function button(href, label, variant = 'primary', arrow = 'arrow') {
  return `<a class="button button--${escape(variant)}" href="${escape(href)}"><span>${escape(label)}</span>${icon(arrow)}</a>`;
}

export function textLink(href, label, className = '') {
  return `<a class="text-link ${escape(className)}" href="${escape(href)}">${escape(label)}${icon('arrow')}</a>`;
}

export function eyebrow(label, number = '') {
  return `<p class="eyebrow">${number ? `<span class="eyebrow__number">${escape(number)}</span>` : ''}${escape(label)}</p>`;
}

export function portrait({ className = '', eager = false, size = 'large' } = {}) {
  return `<img class="${escape(className)}" src="/images/lex-${size === 'small' ? '160' : '640'}.webp" ${size !== 'small' ? 'srcset="/images/lex-400.webp 400w, /images/lex-640.webp 640w" sizes="(max-width: 360px) 88vw, (max-width: 650px) 300px, 380px"' : ''} alt="Lex de Lange" width="640" height="640" ${eager ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"'} decoding="async">`;
}

export function bridgePicture({ className = '', eager = false, sizes = '100vw' } = {}) {
  return `<picture class="${escape(className)}"><source type="image/avif" srcset="/images/bridge-960.avif 960w, /images/bridge-1672.avif 1672w" sizes="${escape(sizes)}"><img src="/images/bridge-1672.webp" srcset="/images/bridge-960.webp 960w, /images/bridge-1672.webp 1672w" sizes="${escape(sizes)}" alt="AI-sfeerimpressie van de John Frostbrug bij Arnhem in avondlicht" width="1672" height="941" ${eager ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"'} decoding="async"></picture>`;
}
