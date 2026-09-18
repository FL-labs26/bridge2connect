/* Progressive enhancement only. Core content and navigation are plain HTML. */
document.documentElement.classList.add('js');
const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

if (header && menuButton && nav) {
  menuButton.hidden = false;
  const closeMenu = (restoreFocus = false) => {
    header.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.querySelector('span').textContent = 'Menu';
    if (restoreFocus) menuButton.focus();
  };
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    header.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.querySelector('span').textContent = open ? 'Sluiten' : 'Menu';
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && header.classList.contains('is-open')) closeMenu(true);
  });
  document.addEventListener('click', event => { if (!header.contains(event.target)) closeMenu(); });
  header.addEventListener('focusout', () => {
    setTimeout(() => { if (!header.contains(document.activeElement)) closeMenu(); }, 0);
  });
  window.matchMedia('(min-width: 900px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
}

const form = document.querySelector('#contact-form');
const dialog = document.querySelector('#message-dialog');
if (form instanceof HTMLFormElement && dialog instanceof HTMLDialogElement) {
  const messageArea = document.querySelector('#prepared-message');
  const copyStatus = document.querySelector('#copy-status');
  const params = new URLSearchParams(window.location.search);
  const subject = form.elements.namedItem('subject');
  const requestedSubject = params.get('onderwerp');
  if (requestedSubject && subject instanceof HTMLSelectElement && [...subject.options].some(option => option.value === requestedSubject)) subject.value = requestedSubject;

  const validateField = element => {
    let error = '';
    if (!element.value.trim()) error = element.name === 'message' ? 'Vertel kort waar uw vraag over gaat.' : element.name === 'email' ? 'Vul uw e-mailadres in.' : 'Vul uw naam in.';
    else if (element.name === 'email' && !element.validity.valid) error = 'Vul een geldig e-mailadres in, bijvoorbeeld naam@bedrijf.nl.';
    else if (element.name === 'message' && element.value.trim().length < 10) error = 'Gebruik minimaal 10 tekens voor uw bericht.';
    else if (element.value.length > element.maxLength) error = 'Deze tekst is te lang. Maak hem iets korter.';
    const target = document.getElementById(element.name + '-error');
    if (target) target.textContent = error;
    element.setAttribute('aria-invalid', String(Boolean(error)));
    return !error;
  };
  const required = [...form.querySelectorAll('[required]')];
  required.forEach(field => field.addEventListener('input', () => {
    if (field.getAttribute('aria-invalid') === 'true') validateField(field);
  }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    const results = required.map(validateField);
    if (results.some(result => !result)) { required[results.indexOf(false)].focus(); return; }
    const data = new FormData(form);
    const value = name => String(data.get(name) || '').trim();
    const message = `Beste Lex,\n\n${value('message')}\n\nMet vriendelijke groet,\n${value('name')}${value('company') ? '\n' + value('company') : ''}\n${value('email')}\n\nOnderwerp: ${value('subject')}`;
    messageArea.value = message;
    copyStatus.textContent = '';
    const openEmail = document.querySelector('#open-email');
    const recipient = form.dataset.recipient;
    if (openEmail && recipient && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(recipient)) {
      openEmail.href = `mailto:${recipient}?subject=${encodeURIComponent('Bridge2Connect — ' + value('subject'))}&body=${encodeURIComponent(message)}`;
    }
    dialog.showModal();
  });
  dialog.querySelector('[data-close-dialog]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    }
  });
  document.querySelector('#copy-message').addEventListener('click', async () => {
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(messageArea.value);
      copyStatus.textContent = 'Bericht gekopieerd. Er is niets verstuurd.';
    } catch {
      messageArea.focus(); messageArea.select();
      copyStatus.textContent = 'De tekst is geselecteerd. Gebruik Ctrl+C of ⌘C om te kopiëren.';
    }
  });
}
