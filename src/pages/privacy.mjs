import { site } from '../content/site.mjs';
import { escape, safeUrl, eyebrow } from '../components/ui.mjs';
import { breadcrumbs } from '../components/sections.mjs';

export default function privacy() {
  const email = safeUrl(site.email, { email: true });
  return `<section class="page-intro section-space"><div class="container">${breadcrumbs('Privacy & website-informatie')}${eyebrow('Website-informatie')}<h1>Privacy &<br>website-informatie.</h1></div></section>
  <section class="section-space legal-page"><div class="container legal-layout"><aside><p>Informatie over de werking van deze website.</p><p>Bijgewerkt: 18 september 2026</p></aside><div class="prose">
    ${!site.published ? '<div class="notice"><strong>Ontwerp ter beoordeling</strong><p>Dit is een deelbare beoordelingsversie, niet de definitief goedgekeurde bedrijfswebsite. Teksten en beeldgebruik worden nog inhoudelijk beoordeeld. De online versie is openbaar; een verzoek om niet te indexeren is geen toegangsbeveiliging.</p></div>' : ''}
    <h2>Wie zit er achter deze website?</h2><p>Deze website is gemaakt voor Bridge2Connect, het bedrijf van Lex de Lange. ${email ? `Voor vragen kunt u mailen naar <a href="${escape(email)}">${escape(site.email)}</a>.` : 'Contactgegevens worden nog aangevuld.'}</p>
    <h2>Het contactformulier</h2><p>Met het formulier stelt u een conceptbericht samen. De website stuurt uw invoer niet naar een server en slaat deze niet op in een database of in lokale websiteopslag. De tekst wordt in het geheugen van deze browserpagina verwerkt.</p><p>U bepaalt zelf of u de tekst kopieert of uw mailprogramma opent. Het openen van uw mailprogramma is niet hetzelfde als het versturen van een e-mail. Uw browser, besturingssysteem en mailprogramma kunnen hun eigen gegevensverwerking hebben.</p>
    <h2>Cookies, lettertypen en externe inhoud</h2><p>De websitecode plaatst geen cookies en bevat geen analytics, advertentietrackers of embedded socialmediafeeds. Afbeeldingen en scripts worden vanuit de website zelf geladen. De lettertypen zijn systeemlettertypen; er worden geen externe lettertypen opgevraagd.</p>
    <h2>Hosting van de beoordelingsversie</h2><p>De online beoordelingsversie wordt via GitHub Pages aangeboden. GitHub kan bij het leveren en beveiligen van zijn diensten technische gegevens verwerken. Meer informatie vindt u in de <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">privacyverklaring van GitHub</a>. Voor de definitieve bedrijfswebsite worden hosting en privacy-informatie opnieuw vastgesteld.</p>
    <h2>Beeldmateriaal en bedrijfsnamen</h2><p>Het logo en het portret zijn aangeleverd voor dit project. De brugbanner is een AI-gegenereerde sfeerimpressie, geen foto of nauwkeurige 3D-reconstructie. Het scroll-effect verandert die herkomst niet. De bedrijfsnamen beschrijven opgegeven werkrelaties, zonder beoordelingen of gegarandeerde resultaten.</p>
    <h2>Vragen of correcties</h2><p>Voor een vraag of correctie kunt u de <a href="/contact/">contactpagina</a> gebruiken.</p>
  </div></div></section>`;
}
