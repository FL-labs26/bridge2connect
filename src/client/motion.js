/* Bounded scroll enhancement. The image remains an image, not a 3D scene. */
(() => {
  const hero = document.querySelector('[data-parallax]');
  const image = hero?.querySelector('.hero-image');
  const topButton = document.querySelector('#back-to-top');
  if (!image && !topButton) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pageHeader = document.querySelector('.site-header');
  const messageDialog = document.querySelector('#message-dialog');
  let frame = 0, needsMeasure = true, heroTop = 0, heroHeight = 0;
  let heroVisible = true, buttonShown = false;
  const focusTop = () => document.querySelector('#main')?.focus({ preventScroll: true });
  function update() {
    frame = 0;
    if (document.hidden) return;
    const scroll = Math.max(0, window.scrollY);
    if (needsMeasure && hero) {
      const rect = hero.getBoundingClientRect();
      heroTop = rect.top + scroll; heroHeight = rect.height; needsMeasure = false;
    }
    if (image) {
      const width = window.innerWidth;
      const maxDrift = width <= 650 ? 24 : width <= 899 ? 44 : 76;
      const travel = Math.max(0, Math.min(heroHeight, scroll - heroTop));
      const drift = reduced.matches ? 0 : Math.min(maxDrift, travel * .20);
      if (heroVisible || reduced.matches) image.style.setProperty('--hero-drift', drift.toFixed(2) + 'px');
    }
    if (topButton) {
      const editing = document.activeElement?.matches('input,textarea,select,[contenteditable="true"]');
      const blocked = pageHeader?.classList.contains('is-open') || messageDialog?.open || editing;
      const shouldShow = !blocked && scroll > (buttonShown ? 450 : 600);
      if (shouldShow !== buttonShown) {
        if (!shouldShow && document.activeElement === topButton) focusTop();
        topButton.hidden = !shouldShow; buttonShown = shouldShow;
      }
    }
  }
  function schedule() { if (!frame && !document.hidden) frame = requestAnimationFrame(update); }
  function measure() { needsMeasure = true; schedule(); }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  window.addEventListener('pageshow', measure);
  document.addEventListener('focusin', schedule);
  document.addEventListener('focusout', schedule);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
    else measure();
  });
  reduced.addEventListener('change', measure);
  topButton?.addEventListener('click', () => {
    focusTop();
    window.scrollTo({ top: 0, left: 0, behavior: reduced.matches ? 'instant' : 'smooth' });
  });
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      heroVisible = entries[0].isIntersecting;
      if (heroVisible) measure();
    }).observe(hero);
  }
  if (hero && 'ResizeObserver' in window) new ResizeObserver(measure).observe(hero);
  if ('MutationObserver' in window) {
    const observer = new MutationObserver(schedule);
    if (pageHeader) observer.observe(pageHeader, { attributes: true, attributeFilter: ['class'] });
    if (messageDialog) observer.observe(messageDialog, { attributes: true, attributeFilter: ['open'] });
  }
  measure();
})();
