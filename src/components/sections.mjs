import { companies } from '../content/site.mjs';
import { translate, route, stepsFor, faqsFor } from '../content/locale.mjs';
import { escape, icon, eyebrow, textLink } from './ui.mjs';

export function companyStrip(lang='nl') {
  const t=translate(lang), rows=[companies.slice(0,3),companies.slice(3)];
  return `<section class="company-strip" aria-label="${t('Bedrijven waarvoor of waarmee Lex werkt','Companies Lex works for or with')}"><div class="container"><p class="company-intro">${t('Bedrijven waarvoor of waarmee ik werk','Companies I work for or with')}</p><div class="company-names">${rows.map(row=>`<div class="company-row">${row.map(name=>`<span>${escape(name)}</span>`).join('')}</div>`).join('')}</div></div></section>`;
}
export function process({dark=true,lang='nl'}={}) {
  const t=translate(lang);
  return `<section class="process-section ${dark?'section-dark':''}"><div class="container"><div class="section-heading">${eyebrow(t('Werkwijze','Working together'))}<div class="heading-grid"><h2>${t('Hoe een samenwerking begint.','How a collaboration begins.')}</h2><p>${t('We bespreken eerst uw vraag. Daarna bepalen we samen welke ondersteuning past en welke afspraken daarbij horen.','We start with your question, then discuss what support would be useful and agree the scope of our work.')}</p></div></div><div class="steps">${stepsFor(lang).map(step=>`<article class="step"><h3>${escape(step.title)}</h3><p>${escape(step.text)}</p></article>`).join('')}</div></div></section>`;
}
export function faqSection(lang='nl') {
  const t=translate(lang);
  return `<section class="faq-section section-space"><div class="container faq-layout"><div class="faq-heading"><h2>${t('Veelgestelde vragen','Frequently asked questions')}</h2><p class="muted">${t('Staat uw vraag er niet bij?','Have a different question?')}</p>${textLink(route('contact',lang),t('Leg uw vraag voor aan Lex','Ask Lex'))}</div><div class="faq-list">${faqsFor(lang).map(item=>`<details name="faq"><summary><h3>${escape(item.question)}</h3>${icon('plus')}</summary><div class="faq-answer"><p>${escape(item.answer)}</p></div></details>`).join('')}</div></div></section>`;
}
export function breadcrumbs(title,lang='nl') {
  return `<nav class="breadcrumbs" aria-label="${translate(lang)('Broodkruimelnavigatie','Breadcrumb')} "><a href="${route('home',lang)}">Home</a><span aria-hidden="true">/</span><span aria-current="page">${escape(title)}</span></nav>`;
}
