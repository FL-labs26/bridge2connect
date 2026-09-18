import { site } from '../content/site.mjs';
import { route, translate, navigationFor } from '../content/locale.mjs';
import { escape, safeUrl, icon } from './ui.mjs';

export function languageSwitch(key='home', lang='nl') {
  const t=translate(lang);
  return `<nav class="language-switch" aria-label="${t('Taal kiezen','Choose language')}">${['nl','en'].map(code=>`<a href="${route(key,code)}" lang="${code}" hreflang="${code}" data-language-link ${code===lang?'aria-current="true"':''}>${code==='nl'?'Nederlands':'English'}</a>`).join('')}</nav>`;
}
export function footer(lang='nl', key='home') {
  const t=translate(lang), email=safeUrl(site.email,{email:true}), linkedIn=safeUrl(site.linkedIn);
  return `<footer class="site-footer">
    <div class="container footer-main">
      <div class="footer-brand"><a href="${route('home',lang)}" aria-label="Bridge2Connect — ${t('homepage','home')}"><img src="/images/logo.png" width="460" height="240" alt="Bridge2Connect" loading="lazy"></a><p>${t('Advies voor bedrijven.<br>Inzicht in Defensie & Veiligheid.','Advice for business.<br>Insight into Defence & Security.')}</p></div>
      <div class="footer-links"><h2>${t('De website','Explore')}</h2><nav aria-label="${t('Footernavigatie','Footer navigation')}">${navigationFor(lang).map(item=>`<a href="${item.href}">${escape(item.label)}</a>`).join('')}<a href="${route('contact',lang)}">${t('Kennismaken','Get in touch')}</a></nav></div>
      <div class="footer-contact"><h2>${t('Rechtstreeks contact','A direct conversation')}</h2><p>Lex de Lange</p>${email?`<a class="footer-email" href="${escape(email)}">${escape(site.email)} ${icon('diagonal')}</a>`:''}${site.phone?`<a class="footer-phone" href="tel:${escape(site.phone)}">${escape(site.phoneDisplay||site.phone)}</a>`:''}${linkedIn?`<a class="footer-phone" href="${escape(linkedIn)}">LinkedIn ${icon('diagonal')}</a>`:''}</div>
    </div>
    <div class="container footer-utility"><div class="footer-legal"><span>© ${new Date().getFullYear()} Bridge2Connect${site.kvk?` · KvK ${escape(site.kvk)}`:''}</span><a href="${route('privacy',lang)}">${t('Privacy & website-informatie','Privacy & website information')}</a></div><p class="footer-credit">${t('Gemaakt door','Designed & built by')} <a href="https://www.fllabs.nl/">FL Labs ${icon('diagonal')}</a></p></div>
    <div class="container footer-language"><span class="language-label">${t('Taal','Language')}</span>${languageSwitch(key,lang)}</div>
  </footer>`;
}
