/* Direction-aware header: no layout shift, no hidden keyboard focus. */
(() => {
  const header = document.querySelector('.site-header'); if (!header) return;
  let previous = window.scrollY, direction = 0, distance = 0, frame = 0;
  let height = header.offsetHeight;
  const show = () => header.classList.remove('is-hidden');
  function update() {
    frame = 0;
    const active = document.activeElement;
    const protectedState = header.classList.contains('is-open') || document.querySelector('dialog[open]') ||
      active?.matches('input,textarea,select,[contenteditable="true"],[role="combobox"]') ||
      (header.contains(active) && active?.matches(':focus-visible'));
    const limit = Math.max(0,document.documentElement.scrollHeight-window.innerHeight);
    const y = Math.max(0,Math.min(window.scrollY,limit));
    const delta = y - previous; previous = y;
    header.classList.toggle('is-scrolled',y>16);
    if (protectedState || y < height+32) { show(); direction=0; distance=0; return; }
    if (Math.abs(delta)<2) return;
    const next = Math.sign(delta);
    distance = next===direction ? distance+Math.abs(delta) : Math.abs(delta); direction=next;
    if (next>0 && distance>=16) header.classList.add('is-hidden');
    if (next<0 && distance>=7) show();
  }
  function schedule() { if (!frame && !document.hidden) frame=requestAnimationFrame(update); }
  function reset() { previous=window.scrollY; direction=0; distance=0; height=header.offsetHeight; show(); schedule(); }
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',reset,{passive:true});
  window.addEventListener('pageshow',reset);
  document.addEventListener('b2c:menu',reset);
  document.addEventListener('b2c:select',() => { show(); schedule(); });
  header.addEventListener('focusin',show);
  document.addEventListener('focusin',schedule);
  document.addEventListener('visibilitychange',() => { if (document.hidden) { cancelAnimationFrame(frame); frame=0; } else reset(); });
  document.querySelector('.back-to-top')?.addEventListener('click',show);
  document.querySelectorAll('a[href*="#"]').forEach(link => link.addEventListener('click',show));
  reset();
})();
