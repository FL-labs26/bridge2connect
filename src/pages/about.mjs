import { eyebrow, portrait, textLink } from '../components/ui.mjs';
import { breadcrumbs } from '../components/sections.mjs';

export default function about() {
  return `<section class="about-hero section-space"><div class="container">${breadcrumbs('Over Lex')}
    <div class="about-hero-grid"><div>${eyebrow('Over Lex')}<h1>Lex de Lange.<br>Ervaring aan beide kanten.</h1><p class="large-paragraph">Als oud-militair en gebrevetteerd commando ken ik Defensie van binnenuit. Vanuit grote en kleine IT-bedrijven heb ik jarenlang met deze sector samengewerkt.</p>${textLink('/contact/', 'Laten we kennismaken')}</div>
    <figure class="portrait-frame portrait-frame--about"><div class="portrait-window">${portrait({ eager: true })}</div><figcaption>Lex de Lange <span>— Bridge2Connect</span></figcaption></figure></div>
  </div></section>
  <section class="biography section-space"><div class="container editorial-layout"><div>${eyebrow('Twee perspectieven')}<h2>Van ervaring<br>naar advies.</h2></div><div class="prose">
    <p class="large-paragraph">Ik begrijp de praktijk van Defensie én de ambities van een bedrijf.</p>
    <p>Mijn achtergrond als oud-militair en gebrevetteerd commando vormt één kant van mijn ervaring. Ik ken de taal en de context van Defensie. De andere kant is mijn jarenlange samenwerking met de Defensie- en Veiligheidssector vanuit grote en kleine IT-bedrijven.</p>
    <p>Daardoor kan ik de vertaalslag maken tussen problemen en oplossingen, tussen verschillende niveaus in een organisatie en tussen mensen die elkaar nog niet vanzelfsprekend vinden.</p>
    <p>Met Bridge2Connect ondersteun ik bedrijven die zaken willen doen met deze sector, maar daar wat hulp bij kunnen gebruiken. Het vertrekpunt is uw bedrijf: wat biedt u, waar wilt u naartoe en waar loopt u tegenaan?</p>
  </div></div></section>
  <section class="quote-section"><div class="container"><blockquote>“Ik ken de weg, spreek de taal en heb mijn netwerk binnen en rondom deze bijzondere sector.”</blockquote><p>Lex de Lange <span>— Bridge2Connect</span></p></div></section>
  <section class="principles section-space"><div class="container">${eyebrow('Wat u van mij mag verwachten')}<div class="principle-grid">
    <article><h2>Persoonlijke betrokkenheid</h2><p>Direct contact en aandacht voor uw bedrijf, uw ambities en de mensen met wie u wilt samenwerken.</p></article>
    <article><h2>Begrip van beide werelden</h2><p>Ervaring vanuit de militaire praktijk en het bedrijfsleven. Om het gesprek niet alleen mogelijk te maken, maar ook inhoud te geven.</p></article>
    <article><h2>Relevante verbindingen</h2><p>Een netwerk is geen verzameling namen. Het gaat om de mensen en partners die passen bij uw vraag.</p></article>
  </div></div></section>`;
}
