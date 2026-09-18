import { footer } from './footer.mjs';
import { site, pages } from '../content/site.mjs';
import { route, translate, navigationFor } from '../content/locale.mjs';
import { escape, icon, safeUrl, button, textLink, eyebrow } from './ui.mjs';

export function header(active, lang='nl', key='home') {
  const t=translate(lang), navigation=navigationFor(lang);
  const mobileLinks=[{href:route('home',lang),label:'Home'},...navigation];
  const brand=`<a class="brand" href="${route('home',lang)}" aria-label="Bridge2Connect — ${t('homepage','home')}"><img src="/images/logo.png" alt="Bridge2Connect" width="460" height="240"></a>`;
  return `<a class="skip-link" href="#main">${t('Direct naar inhoud','Skip to content')}</a>
  <header class="site-header" id="site-header"><div class="header-inner container">
    ${brand}<span class="brand-caption">${t('Bedrijfsleven ontmoet<br>Defensie & Veiligheid','Where business meets<br>Defence & Security')}</span>
    <nav class="site-nav" id="primary-nav" aria-label="${t('Hoofdnavigatie','Main navigation')}">${navigation.map(item=>`<a href="${item.href}" ${active===item.href?'aria-current="page"':''}>${escape(item.label)}</a>`).join('')}<a class="nav-contact" href="${route('contact',lang)}" ${key==='contact'?'aria-current="page"':''}>${t('Kennismaken','Get in touch')} ${icon('arrow')}</a></nav>
    <div class="header-controls"><button class="menu-toggle" type="button" aria-label="${t('Menu openen','Open menu')}" aria-expanded="false" aria-controls="mobile-menu" aria-haspopup="dialog" hidden><span class="menu-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg></span></button></div>
  </div></header>
  <dialog class="mobile-menu" id="mobile-menu" aria-label="${t('Navigatie','Navigation')}">
    <div class="mobile-menu-top">${brand}<div class="mobile-menu-tools"><button class="menu-close" type="button" aria-label="${t('Menu sluiten','Close menu')}" data-menu-close autofocus>${icon('close')}</button></div></div>
    <div class="mobile-menu-content"><p class="mobile-menu-label">${t('Ontdek Bridge2Connect','Explore Bridge2Connect')}</p><nav class="mobile-nav" aria-label="${t('Mobiele navigatie','Mobile navigation')}">${mobileLinks.map(item=>`<a class="mobile-nav-link" href="${item.href}" ${active===item.href?'aria-current="page"':''}><span>${escape(item.label)}</span>${icon('arrow')}</a>`).join('')}</nav>
    <div class="mobile-menu-contact"><p>${t('Een vraag over uw bedrijf?','What would you like to discuss?')}</p>${button(route('contact',lang),t('Kennismaken met Lex','Get in touch with Lex'))}<a class="mobile-menu-email" href="${escape(safeUrl(site.email,{email:true}))}">${escape(site.email)}</a></div></div>
  </dialog>`;
}
export function cta(lang='nl') {
  const t=translate(lang);
  return `<section class="contact-cta" aria-labelledby="cta-heading"><div class="container cta-inner"><div>${eyebrow(t('Contact','Let’s talk'))}<h2 id="cta-heading">${t('Bespreek uw vraag<br>met Lex.','Discuss your plans<br>with Lex.')}</h2></div><div class="cta-aside"><p>${t('Vertel kort wat uw bedrijf doet en waar u hulp bij zoekt. Dan bespreken we of ik iets kan betekenen.','Tell me a little about your company and where you need support. We can then discuss how I could help.')}</p>${button(route('contact',lang),t('Laten we kennismaken','Let’s get acquainted'),'light')}</div></div></section>`;
}
export function layout(page, body, {className='',withCta=true,assets={},baseUrl=''}={}) {
  const lang=page.lang||'nl', t=translate(lang);
  const key=page.key||Object.keys(pages).find(k=>pages[k].path===page.path)||'home';
  const base=safeUrl(site.domain)||safeUrl(baseUrl);
  const absolute=path=>base?new URL(path.replace(/^\//,''),base.endsWith('/')?base:base+'/').href:path;
  const structured={'@context':'https://schema.org','@type':'Organization',name:site.name,...(site.email?{email:site.email}:{}),...(base?{url:base}:{})};
  return `<!doctype html><html lang="${lang}"><head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title>${escape(page.title)}</title><meta name="description" content="${escape(page.description)}">
    <meta name="theme-color" content="#102c39"><meta name="color-scheme" content="light">
    <meta name="robots" content="${site.published&&key!=='notfound'?'index, follow':'noindex, nofollow'}">
    ${base?`<link rel="canonical" href="${escape(absolute(page.path))}">`:''}
    ${['nl','en'].map(code=>`<link rel="alternate" hreflang="${code}" href="${escape(absolute(route(key,code)))}">`).join('')}<link rel="alternate" hreflang="x-default" href="${escape(absolute(route(key,'nl')))}">
    <meta property="og:type" content="website"><meta property="og:locale" content="${lang==='en'?'en_GB':'nl_NL'}"><meta property="og:site_name" content="Bridge2Connect"><meta property="og:title" content="${escape(page.title)}"><meta property="og:description" content="${escape(page.description)}">
    ${base?`<meta property="og:image" content="${escape(absolute('/images/share.jpg'))}"><meta property="og:url" content="${escape(absolute(page.path))}"><meta name="twitter:card" content="summary_large_image">`:''}
    <link rel="icon" type="image/png" href="/favicon.png"><link rel="stylesheet" href="${assets.css||'/assets/site.css'}"><script src="${assets.js||'/assets/site.js'}" defer></script>
    <script type="application/ld+json">${JSON.stringify(structured).replace(/</g,'\\u003c')}</script>
    </head><body class="${escape(className)}">${header(page.path,lang,key)}<main id="main" tabindex="-1">${body}${withCta?cta(lang):''}</main>${footer(lang,key)}
    <button class="back-to-top" id="back-to-top" type="button" aria-label="${t('Terug naar boven','Back to top')}" hidden><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6"/></svg></button></body></html>`;
}
