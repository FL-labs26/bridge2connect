// Logic tests with a modeled DOM; these are not visual browser tests.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
const source = await readFile(new URL('../src/client/motion.js', import.meta.url), 'utf8');
function setup({ withHero = true, width = 1440 } = {}) {
  const target = () => ({ handlers: {}, addEventListener(n, fn) { (this.handlers[n] ||= []).push(fn); }, fire(n) { (this.handlers[n] || []).forEach(fn => fn({})); } });
  const win = Object.assign(target(), { innerWidth: width, scrollY: 0 });
  const doc = Object.assign(target(), { hidden: false, activeElement: null });
  const values = {}; const image = { style: { setProperty: (n, v) => { values[n] = v; } } };
  const hero = { querySelector: () => image, getBoundingClientRect: () => ({ top: 88 - win.scrollY, height: 650 }) };
  const top = Object.assign(target(), { hidden: true, matches: () => false });
  const events = []; const main = { matches: () => false, focus: opts => { events.push(['focus',opts]);doc.activeElement = main; } };
  const classes = new Set(); const header = { classList: { contains: n => classes.has(n) } }; const dialog = { open: false };
  const reduced = Object.assign(target(), { matches: false }); win.matchMedia = () => reduced;
  win.scrollTo = opts => { events.push(['scroll',opts]);win.scrollY = opts.top;win.fire('scroll'); };
  doc.querySelector = s => ({ '[data-parallax]': withHero ? hero : null, '#back-to-top': top, '.site-header': header, '#message-dialog': dialog, '#main': main })[s] || null;
  const frames = new Map(); let id = 0; const observers = {};
  const observer = name => class { constructor(fn) { observers[name] = fn; } observe() {} };
  const context = { window:win, document:doc, requestAnimationFrame:fn => {frames.set(++id,fn);return id;}, cancelAnimationFrame:i=>frames.delete(i), IntersectionObserver:observer('intersection'), ResizeObserver:observer('resize'), MutationObserver:observer('mutation') };
  for(const key of ['IntersectionObserver','ResizeObserver','MutationObserver']) win[key] = context[key];
  vm.runInNewContext(source, context);
  const flush = () => { let i=0;while(frames.size){assert.ok(++i<20,'No endless frame loop');const work=[...frames.values()];frames.clear();work.forEach(fn=>fn());} };
  flush();
  const scroll = y => {win.scrollY=y;win.fire('scroll');flush();};
  return { win,doc,top,main,image,values,reduced,classes,dialog,events,frames,observers,flush,scroll };
}
test('Scroll logic: portrait page works without a hero', () => { const c=setup({withHero:false});c.scroll(700);assert.equal(c.top.hidden,false); });
test('Scroll logic: desktop image moves and displacement is bounded', () => { const c=setup();c.scroll(300);assert.equal(c.values['--hero-drift'],'42.40px');c.scroll(900);assert.equal(c.values['--hero-drift'],'76.00px');c.scroll(0);assert.equal(c.values['--hero-drift'],'0.00px'); });
test('Scroll logic: mobile displacement is limited to 24px', () => { const c=setup({width:390});c.scroll(500);assert.equal(c.values['--hero-drift'],'24.00px'); });
test('Scroll logic: reduced motion resets displacement immediately', () => { const c=setup();c.scroll(350);c.reduced.matches=true;c.reduced.fire('change');c.flush();assert.equal(c.values['--hero-drift'],'0.00px'); });
test('Scroll logic: button thresholds use hysteresis', () => { const c=setup();assert.equal(c.top.hidden,true);c.scroll(590);assert.equal(c.top.hidden,true);c.scroll(610);assert.equal(c.top.hidden,false);c.scroll(500);assert.equal(c.top.hidden,false);c.scroll(449);assert.equal(c.top.hidden,true); });
test('Scroll logic: return moves focus before native scroll without navigation', () => { const c=setup();c.scroll(700);c.doc.activeElement=c.top;c.top.fire('click');c.flush();assert.equal(c.events[0][0],'focus');assert.equal(c.events[0][1].preventScroll,true);assert.equal(c.events[1][0],'scroll');assert.equal(c.events[1][1].behavior,'smooth');assert.equal(c.win.scrollY,0);assert.equal(c.doc.activeElement,c.main);assert.equal(c.top.hidden,true); });
test('Scroll logic: reduced motion return is instant', () => { const c=setup();c.reduced.matches=true;c.scroll(900);c.top.fire('click');c.flush();assert.equal(c.events[1][1].behavior,'instant'); });
test('Scroll logic: menu and message dialog suppress the floating control', () => { const c=setup();c.scroll(700);c.classes.add('is-open');c.observers.mutation();c.flush();assert.equal(c.top.hidden,true);c.classes.clear();c.observers.mutation();c.flush();assert.equal(c.top.hidden,false);c.dialog.open=true;c.observers.mutation();c.flush();assert.equal(c.top.hidden,true); });
test('Scroll logic: editing fields suppresses the button', () => { const c=setup();c.scroll(900);c.doc.activeElement={matches:()=>true};c.doc.fire('focusin');c.flush();assert.equal(c.top.hidden,true); });
test('Scroll logic: no endless requestAnimationFrame loop when idle', () => { const c=setup();c.scroll(350);assert.equal(c.frames.size,0);c.observers.intersection([{isIntersecting:false}]);const old=c.values['--hero-drift'];c.scroll(900);assert.equal(c.values['--hero-drift'],old);assert.equal(c.frames.size,0); });
test('Scroll logic: hidden tab cancels outstanding frame', () => { const c=setup();c.win.fire('scroll');assert.equal(c.frames.size,1);c.doc.hidden=true;c.doc.fire('visibilitychange');assert.equal(c.frames.size,0); });
test('Scroll logic: focused button is not left hidden with stranded focus', () => { const c=setup();c.scroll(700);c.doc.activeElement=c.top;c.scroll(0);assert.equal(c.doc.activeElement,c.main);assert.equal(c.top.hidden,true); });
test('Scroll markup: semantics, bounded portrait and no old decoration', async () => {
  const [layout,css,home] = await Promise.all(['components/layout.mjs','styles/site.css','pages/home.mjs'].map(p=>readFile(new URL('../src/'+p,import.meta.url),'utf8')));
  assert.ok(layout.includes('type="button" aria-label="Terug naar boven" hidden'));
  assert.ok(layout.includes('class="footer-top-link" href="#main"'));
  assert.ok(css.includes('max-width:380px'));assert.ok(css.includes('aspect-ratio:4/5'));assert.ok(css.includes('border-radius:24px'));
  assert.ok(css.includes('prefers-reduced-motion:reduce'));assert.ok(!home.includes('portrait-line'));assert.ok(!home.includes('hero-location'));
});
