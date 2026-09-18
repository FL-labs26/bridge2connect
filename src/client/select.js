/* Select-only combobox; native select remains the form value and no-JS fallback. */
(() => {
  const select = document.querySelector('#subject');
  if (!(select instanceof HTMLSelectElement)) return;
  const label = document.querySelector('label[for="subject"]');
  if (!label) return;
  const wrapper = document.createElement('div'); wrapper.className = 'custom-select';
  const control = document.createElement('button'); control.type = 'button'; control.id = 'subject-control';
  control.className = 'select-control'; control.setAttribute('role','combobox');
  label.id = 'subject-label'; control.setAttribute('aria-labelledby','subject-label subject-value');
  control.setAttribute('aria-haspopup','listbox'); control.setAttribute('aria-controls','subject-options'); control.setAttribute('aria-expanded','false');
  control.innerHTML = '<span id="subject-value"></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  const list = document.createElement('ul'); list.id = 'subject-options'; list.className = 'select-options'; list.hidden = true;
  list.setAttribute('role','listbox'); list.setAttribute('aria-labelledby','subject-label');
  const choices = [...select.options].map((option, index) => {
    const item = document.createElement('li'); item.id = `subject-option-${index}`; item.setAttribute('role','option');
    item.dataset.index = index; item.textContent = option.textContent; list.append(item); return item;
  });
  wrapper.append(control,list); select.after(wrapper); select.hidden = true; label.htmlFor = control.id;
  let opened = false, active = select.selectedIndex, typed = '', typedAt = 0;
  const value = control.querySelector('#subject-value');
  function paint() {
    value.textContent = select.options[select.selectedIndex]?.textContent || '';
    choices.forEach((item,i) => { item.setAttribute('aria-selected',String(i===select.selectedIndex)); item.classList.toggle('is-active',opened && i===active); });
    if (opened) control.setAttribute('aria-activedescendant',choices[active].id);
    else control.removeAttribute('aria-activedescendant');
  }
  function place() {
    if (!opened) return;
    const rect = control.getBoundingClientRect(), vv = window.visualViewport;
    const low = (vv?.offsetTop || 0) + (vv?.height || innerHeight) - rect.bottom - 16;
    const high = rect.top - (vv?.offsetTop || 0) - 16;
    const above = low < 245 && high > low;
    wrapper.dataset.side = above ? 'above' : 'below';
    list.style.maxHeight = `${Math.max(80,Math.min(290,above ? high : low))}px`;
  }
  function revealOption() {
    const item = choices[active]; if (!item) return;
    const top = item.offsetTop, bottom = top + item.offsetHeight;
    if (top < list.scrollTop) list.scrollTop = top;
    else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
  }
  function open() {
    active = select.selectedIndex; opened = true; list.hidden = false;
    wrapper.dataset.open = 'true'; control.setAttribute('aria-expanded','true'); paint(); place(); revealOption();
    document.dispatchEvent(new Event('b2c:select'));
  }
  function close(commit = false) {
    if (!opened) return;
    if (commit && active !== select.selectedIndex) { select.selectedIndex = active; select.dispatchEvent(new Event('change',{bubbles:true})); }
    opened = false; list.hidden = true; wrapper.dataset.open = 'false'; control.setAttribute('aria-expanded','false'); paint();
    document.dispatchEvent(new Event('b2c:select'));
  }
  function move(index) { active = Math.max(0,Math.min(choices.length-1,index)); paint(); revealOption(); }
  control.addEventListener('click', () => opened ? close() : open());
  list.addEventListener('pointerdown', event => { if (event.pointerType === 'mouse') event.preventDefault(); });
  list.addEventListener('click', event => { const item = event.target.closest('[role="option"]'); if (!item) return; active = Number(item.dataset.index); close(true); control.focus({preventScroll:true}); });
  control.addEventListener('keydown', event => {
    const key = event.key;
    if (key==='Escape' && opened) { event.preventDefault(); close(); return; }
    if (key==='Tab') { close(true); return; }
    if (['Enter',' '].includes(key)) { event.preventDefault(); opened ? close(true) : open(); return; }
    if (['ArrowDown','ArrowUp','Home','End'].includes(key)) {
      event.preventDefault(); const wasOpen = opened; if (!opened) open();
      if (key==='Home') move(0); else if (key==='End') move(choices.length-1);
      else if (wasOpen) move(active + (key==='ArrowDown' ? 1 : -1)); return;
    }
    if (key.length===1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault(); if (!opened) open(); const now = performance.now();
      typed = now-typedAt>750 ? key : typed+key; typedAt = now;
      const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase(document.documentElement.lang || 'nl');
      const repeated = [...typed].every(c=>c===typed[0]); const query = normalize(repeated ? key : typed);
      const start = repeated ? active+1 : 0;
      for (let i=0;i<choices.length;i++) { const j=(start+i)%choices.length; if (normalize(choices[j].textContent).startsWith(query)) { move(j); break; } }
    }
  });
  wrapper.addEventListener('focusout', () => queueMicrotask(() => { if (!wrapper.contains(document.activeElement)) close(true); }));
  document.addEventListener('pointerdown', event => { if (!wrapper.contains(event.target)) close(true); });
  document.addEventListener('b2c:menu', () => close());
  select.addEventListener('change',paint);
  select.form?.addEventListener('reset', () => setTimeout(() => { close(); paint(); },0));
  window.addEventListener('resize',place,{passive:true}); window.addEventListener('scroll',place,{passive:true});
  window.visualViewport?.addEventListener('resize',place,{passive:true}); paint();
})();
