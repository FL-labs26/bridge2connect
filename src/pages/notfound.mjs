import { translate, route } from '../content/locale.mjs';
import { eyebrow, button } from '../components/ui.mjs';
export default function notfound(lang='nl') {
  const t=translate(lang);
  return `<section class="not-found section-space"><div class="container">${eyebrow('404')}<h1>${t('Deze pagina is<br>niet gevonden.','This page<br>could not be found.')}</h1><p>${t('Misschien is de link verouderd. Via de homepage vindt u de juiste ingang.','The link may be out of date. Please return to the homepage to find what you need.')}</p>${button(route('home',lang),t('Naar de homepage','Return to homepage'))}</div></section>`;
}
