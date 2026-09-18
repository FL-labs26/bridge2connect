import { companies, faqs, steps } from '../content/site.mjs';
import { escape, icon, eyebrow, textLink } from './ui.mjs';

export function companyStrip() {
  return `<section class="company-strip" aria-label="Bedrijven waarvoor of waarmee Lex werkt"><div class="container"><p class="company-intro">Een selectie van bedrijven waarvoor of waarmee ik werk</p><div class="company-names">${companies.map(name => `<span>${escape(name)}</span>`).join('')}</div></div></section>`;
}

export function process({ dark = true } = {}) {
  return `<section class="process-section ${dark ? 'section-dark' : ''}"><div class="container">
    <div class="section-heading">${eyebrow('Werkwijze')}<div class="heading-grid"><h2>Een gesprek als begin.</h2><p>We bespreken eerst uw vraag. Daarna bepalen we samen welke ondersteuning past en welke afspraken daarbij horen.</p></div></div>
    <div class="steps">${steps.map(step => `<article class="step"><h3>${escape(step.title)}</h3><p>${escape(step.text)}</p></article>`).join('')}</div>
  </div></section>`;
}

export function faqSection() {
  return `<section class="faq-section section-space"><div class="container faq-layout"><div class="faq-heading">${eyebrow('Praktisch')}<h2>Veelgestelde vragen</h2><p class="muted">Staat uw vraag er niet bij?</p>${textLink('/contact/', 'Stel uw vraag aan Lex')}</div>
    <div class="faq-list">${faqs.map(item => `<details name="faq"><summary><h3>${escape(item.question)}</h3>${icon('plus')}</summary><div class="faq-answer"><p>${escape(item.answer)}</p></div></details>`).join('')}</div>
  </div></section>`;
}

export function breadcrumbs(title) {
  return `<nav class="breadcrumbs" aria-label="Broodkruimelnavigatie"><a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">${escape(title)}</span></nav>`;
}
