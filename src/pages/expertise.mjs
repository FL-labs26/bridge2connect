import { services } from '../content/site.mjs';
import { escape, eyebrow, icon, textLink } from '../components/ui.mjs';
import { breadcrumbs, process } from '../components/sections.mjs';

export default function expertise() {
  return `<section class="page-intro section-space"><div class="container">${breadcrumbs('Expertise')}${eyebrow('Expertise')}<div class="heading-grid page-heading"><h1>Zaken doen met<br>Defensie & Veiligheid.</h1><p class="large-paragraph">Ik help uw bedrijf de sector te begrijpen, relevante mensen te spreken en van een behoefte naar een passende oplossing te komen.</p></div>
    <nav class="service-jumps" aria-label="Expertisegebieden">${services.map(service => `<a href="#${service.id}">${escape(service.title)}${icon('down')}</a>`).join('')}</nav>
  </div></section>
  ${services.map(service => `<section class="expertise-detail section-space" id="${service.id}"><div class="container detail-layout"><div class="detail-label">${eyebrow(service.title)}<blockquote>“${escape(service.question)}”</blockquote></div><div class="detail-content"><h2>${escape(service.heading)}</h2>${service.paragraphs.map(paragraph => `<p>${escape(paragraph)}</p>`).join('')}<div class="outcomes"><h3>Waar we aan werken</h3>${service.results.map(result => `<p>${icon('check')}${escape(result)}</p>`).join('')}</div>${textLink('/contact/?onderwerp=' + encodeURIComponent(service.title), 'Bespreek uw vraag met Lex')}</div></div></section>`).join('')}
  ${process()}
  <section class="small-note"><div class="container"><p>De precieze ondersteuning en afspraken worden per vraagstuk bepaald. Een introductie of gesprek is geen garantie op een opdracht.</p></div></section>`;
}
