import { services } from '../content/site.mjs';
import { icon, eyebrow, button, textLink, portrait, bridgePicture, escape } from '../components/ui.mjs';
import { companyStrip, process, faqSection } from '../components/sections.mjs';

export default function home() {
  return `<section class="hero" aria-labelledby="hero-heading" data-parallax>
    ${bridgePicture({ className: 'hero-image', eager: true })}<div class="hero-shade" aria-hidden="true"></div>
    <div class="container hero-inner">
      <div class="hero-copy">${eyebrow('Bedrijfsleven ontmoet Defensie & Veiligheid')}
        <h1 id="hero-heading">Twee werelden.<br><em>Eén verbinding.</em></h1>
        <p class="hero-lead">Ik help bedrijven zaken te doen met de Defensie- en Veiligheidssector. Met kennis van de praktijk en de juiste mensen aan tafel.</p>
        <div class="hero-actions">${button('/contact/', 'Laten we kennismaken', 'light')}${textLink('#expertise', 'Waar ik bij help', 'hero-secondary')}</div>
      </div>
      <div class="hero-bottom"><a class="hero-person" href="/over-lex/">${portrait({ size: 'small', eager: true })}<span><strong>Lex de Lange</strong><small>Oud-militair. Adviseur. Verbinder.</small></span>${icon('arrow')}</a><a class="hero-scroll" href="#expertise"><span>Ontdek Bridge2Connect</span>${icon('down')}</a></div>
    </div>
  </section>
  ${companyStrip()}
  <section class="expertise-intro section-space" id="expertise" aria-labelledby="expertise-heading"><div class="container expertise-overview">
    <div class="expertise-heading">${eyebrow('Expertise')}<h2 id="expertise-heading">Een goed aanbod.<br>De juiste ingang.</h2><p>Uw bedrijf heeft iets te bieden. Ik help uitzoeken waar dat aansluit, met wie u in gesprek gaat en hoe u verder komt.</p></div>
    <div class="service-list">${services.map(service => `<article class="service-row"><h3>${escape(service.title)}</h3><p>${escape(service.short)}</p>${textLink('/expertise/#' + service.id, 'Meer over ' + ({sectorinzicht:'sectorinzicht',verbinding:'verbinding',samenwerking:'samenwerking'}[service.id]))}</article>`).join('')}</div>
  </div></section>
  <section class="about-preview section-space" aria-labelledby="about-heading"><div class="container about-grid">
    <div class="about-intro">${eyebrow('Aangenaam, Lex')}<h2 id="about-heading">Ervaring in Defensie<br>en het bedrijfsleven.</h2></div>
    <figure class="portrait-frame"><div class="portrait-window">${portrait()}</div><figcaption>Lex de Lange <span>— Bridge2Connect</span></figcaption></figure>
    <div class="about-copy"><p class="large-paragraph">Ik begrijp beide kanten van de tafel.</p><p>Als oud-militair en gebrevetteerd commando ken ik Defensie van binnenuit. Vanuit grote en kleine IT-bedrijven heb ik jarenlang met de Defensie- en Veiligheidssector samengewerkt.</p><p>Die ervaring gebruik ik om de vertaalslag te maken tussen wat een organisatie nodig heeft en wat uw bedrijf kan bijdragen.</p>${textLink('/over-lex/', 'Meer over Lex')}</div>
  </div></section>
  ${process()}
  <section class="partner-preview section-space"><div class="container partner-grid"><div>${eyebrow('Samenwerking')}<h2>Met de juiste mensen<br>kom je verder.</h2></div><div class="partner-copy"><h3>Floru Consulting</h3><p>Vanuit Bridge2Connect werk ik in meerdere trajecten intensief samen met Floru Consulting. Welke ondersteuning nodig is, bepalen we aan de hand van de vraag van uw bedrijf.</p>${textLink('/netwerk/#floru', 'Over deze samenwerking')}</div></div></section>
  ${faqSection()}`;
}
