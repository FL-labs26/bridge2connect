import { site, navigation } from '../content/site.mjs';
import { escape, icon, safeUrl, button, textLink, eyebrow } from './ui.mjs';

export function header(active) {
  return `<a class="skip-link" href="#main">Direct naar inhoud</a>
  <header class="site-header" id="site-header">
    <div class="header-inner container">
      <a class="brand" href="/" aria-label="Bridge2Connect — naar de homepage"><img src="/images/logo.png" alt="Bridge2Connect" width="460" height="240"></a>
      <span class="brand-caption">Bedrijfsleven ontmoet<br>Defensie & Veiligheid</span>
      <button class="menu-toggle" aria-expanded="false" aria-controls="primary-nav" hidden><span>Menu</span><span class="menu-lines" aria-hidden="true"></span></button>
      <nav class="site-nav" id="primary-nav" aria-label="Hoofdnavigatie">
        ${navigation.map(item => `<a href="${item.href}" ${active === item.href ? 'aria-current="page"' : ''}>${escape(item.label)}</a>`).join('')}
        <a class="nav-contact" href="/contact/" ${active === '/contact/' ? 'aria-current="page"' : ''}>Kennismaken ${icon('arrow')}</a>
      </nav>
    </div>
  </header>`;
}

export function cta() {
  return `<section class="contact-cta" aria-labelledby="cta-heading">
    <div class="container cta-inner">
      <div>${eyebrow('Contact')}<h2 id="cta-heading">Bespreek uw vraag<br>met Lex.</h2></div>
      <div class="cta-aside"><p>Mail kort wat uw bedrijf doet en waar u hulp bij zoekt. Dan bespreken we of ik iets kan betekenen.</p>${button('/contact/', 'Laten we kennismaken', 'light')}</div>
    </div>
  </section>`;
}

export function footer() {
  const email = safeUrl(site.email, { email: true });
  const linkedIn = safeUrl(site.linkedIn);
  return `<footer class="site-footer">
    <div class="container footer-main">
      <div class="footer-brand"><a href="/" aria-label="Bridge2Connect — homepage"><img src="/images/logo.png" width="460" height="240" alt="Bridge2Connect" loading="lazy"></a><p>Lex de Lange<br>Advies voor de Defensie- en Veiligheidssector</p></div>
      <div><h2>Ontdek Bridge2Connect</h2><nav aria-label="Footernavigatie"><a href="/expertise/">Expertise</a><a href="/over-lex/">Over Lex</a><a href="/netwerk/">Netwerk & samenwerking</a><a href="/contact/">Kennismaken</a></nav></div>
      <div><h2>Persoonlijk contact</h2><p>Lex de Lange<br>Adviseur</p>${email ? `<a href="${escape(email)}">${escape(site.email)}</a>` : textLink('/contact/', 'Neem contact op')}${site.phone ? `<a class="footer-phone" href="tel:${escape(site.phone)}">${escape(site.phoneDisplay || site.phone)}</a>` : ''}${linkedIn ? `<a class="footer-phone" href="${escape(linkedIn)}" target="_blank" rel="noopener noreferrer">Lex op LinkedIn ${icon('diagonal')}</a>` : ''}</div>
    </div>
    <div class="container footer-bottom"><span>© ${new Date().getFullYear()} Bridge2Connect · Lex de Lange${site.kvk ? ` · KvK ${escape(site.kvk)}` : ''}</span><a href="/privacy/">Privacy & website-informatie</a><a class="footer-top-link" href="#main">Naar boven</a></div>
  </footer>`;
}

export function layout(page, body, { className = '', withCta = true, assets = {} } = {}) {
  const base = safeUrl(site.domain);
  const canonical = base ? new URL(page.path, base).href : '';
  const structured = { '@context': 'https://schema.org', '@type': 'Organization', name: site.name, ...(base ? { url: base } : {}), ...(site.email ? { email: site.email } : {}) };
  return `<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(page.title)}</title><meta name="description" content="${escape(page.description)}">
  <meta name="theme-color" content="#102733"><meta name="color-scheme" content="light">
  <meta name="robots" content="${site.published && page.path !== '/404.html' ? 'index, follow' : 'noindex, nofollow'}">
  ${canonical ? `<link rel="canonical" href="${escape(canonical)}">` : ''}
  <meta property="og:type" content="website"><meta property="og:locale" content="nl_NL"><meta property="og:site_name" content="Bridge2Connect"><meta property="og:title" content="${escape(page.title)}"><meta property="og:description" content="${escape(page.description)}">
  ${base ? `<meta property="og:image" content="${escape(new URL('/images/share.jpg', base).href)}"><meta property="og:url" content="${escape(canonical)}">` : ''}
  <link rel="icon" type="image/png" href="/favicon.png">
  <link rel="stylesheet" href="${assets.css || '/assets/site.css'}">
  <script src="${assets.js || '/assets/site.js'}" defer></script>
  <script type="application/ld+json">${JSON.stringify(structured).replace(/</g, '\\u003c')}</script>
</head>
<body class="${escape(className)}">
  ${header(page.path)}
  <main id="main" tabindex="-1">${body}${withCta ? cta() : ''}</main>
  ${footer()}
  <button class="back-to-top" id="back-to-top" type="button" aria-label="Terug naar boven" hidden><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6"/></svg></button>
</body>
</html>`;
}
