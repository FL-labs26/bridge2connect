/* Full-viewport native dialog; page position and focus are restored on close. */
(() => {
  const header = document.querySelector('.site-header');
  const trigger = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#mobile-menu');
  if (!header || !trigger || !(menu instanceof HTMLDialogElement)) return;
  const close = menu.querySelector('[data-menu-close]');
  const desktop = matchMedia('(min-width: 900px)');
  let savedY = 0, savedBody = null, lastFocus = null;
  const keys = ['position', 'top', 'left', 'right', 'width', 'overflow', 'paddingRight'];
  trigger.hidden = false;
  function unlock() {
    if (!savedBody) return;
    for (const key of keys) document.body.style[key] = savedBody[key];
    savedBody = null;
    window.scrollTo({ top: savedY, behavior: 'instant' });
  }
  function dismiss(restore = true) {
    if (!menu.open) return;
    menu.close(); unlock(); header.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    if (restore) (desktop.matches ? header.querySelector('.brand') : lastFocus || trigger)?.focus({ preventScroll: true });
    document.dispatchEvent(new CustomEvent('b2c:menu', { detail: { open: false } }));
  }
  function show() {
    if (desktop.matches || menu.open) return;
    savedY = window.scrollY; lastFocus = document.activeElement;
    savedBody = Object.fromEntries(keys.map(key => [key, document.body.style[key]]));
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    const padding = parseFloat(getComputedStyle(document.body).paddingRight) || 0;
    header.classList.remove('is-hidden'); header.classList.add('is-open');
    try { menu.showModal(); } catch { header.classList.remove('is-open'); savedBody = null; return; }
    Object.assign(document.body.style, { position:'fixed', top:`-${savedY}px`, left:'0', right:'0', width:'100%', overflow:'hidden', paddingRight:`${padding + gutter}px` });
    trigger.setAttribute('aria-expanded', 'true');
    close.focus({ preventScroll:true });
    document.dispatchEvent(new CustomEvent('b2c:menu', { detail: { open: true } }));
  }
  trigger.addEventListener('click', show);
  close.addEventListener('click', () => dismiss());
  menu.addEventListener('cancel', event => { event.preventDefault(); dismiss(); });
  menu.addEventListener('click', event => { if (event.target.closest('a[href]')) dismiss(false); });
  menu.addEventListener('close', () => {
    if (!savedBody) return;
    unlock(); header.classList.remove('is-open'); trigger.setAttribute('aria-expanded','false');
    document.dispatchEvent(new CustomEvent('b2c:menu', { detail: { open:false } }));
  });
  desktop.addEventListener('change', event => { if (event.matches) dismiss(); });
  window.addEventListener('pagehide', () => dismiss(false));
  window.addEventListener('pageshow', () => { if (menu.open) dismiss(false); });
})();
