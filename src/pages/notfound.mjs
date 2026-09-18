import { eyebrow, button } from '../components/ui.mjs';
export default function notfound() {
  return `<section class="not-found section-space"><div class="container">${eyebrow('404 · Pagina niet gevonden')}<h1>Hier loopt de route<br><em>even anders.</em></h1><p>Deze pagina bestaat niet of is verplaatst.<br>Vanaf de homepage vindt u de juiste verbinding.</p>${button('/', 'Terug naar de homepage')}</div></section>`;
}
