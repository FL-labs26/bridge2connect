/* Same-page delivery. Provider secrets never belong here; the form key is public. */
(() => {
  const form = document.querySelector('#contact-form[data-delivery="web3forms"]');
  if (!(form instanceof HTMLFormElement)) return;
  const en = document.documentElement.lang === 'en';
  const t = (nl, english) => en ? english : nl;
  const fields = form.querySelector('[data-form-fields]');
  const status = form.querySelector('[data-form-status]');
  const recovery = form.querySelector('[data-form-recovery]');
  const another = form.querySelector('[data-send-another]');
  const submit = form.querySelector('[type="submit"]'), label = submit?.querySelector('span');
  const captcha = form.querySelector('#contact-captcha');
  const captchaStatus = form.querySelector('[data-captcha-status]');
  const captchaRetry = form.querySelector('[data-captcha-retry]');
  if (!fields || !status || !recovery || !another || !submit || !label || !captcha || !captchaStatus || !captchaRetry) return;
  let sending = false, completed = false, widget = null, token = '', loading = false, captchaScript, captchaTimer;
  const idleLabel = label.textContent;
  function feedback(message, kind = 'error', focus = true) {
    status.hidden = false; status.dataset.state = kind; status.textContent = message;
    if (focus) status.focus({ preventScroll: true });
  }
  function captchaFailure() {
    clearTimeout(captchaTimer); loading = false; token = '';
    captchaStatus.textContent = t('Spambeveiliging kon niet laden. Probeer opnieuw; uw tekst blijft staan.','Spam protection could not load. Please retry; your text is preserved.');
    captchaRetry.hidden = false;
  }
  function resetCaptcha() {
    token = '';
    try { if (widget !== null && window.hcaptcha) window.hcaptcha.reset(widget); } catch { captchaFailure(); }
  }
  window.b2cContactCaptchaReady = () => {
    clearTimeout(captchaTimer); loading = false;
    if (widget !== null) return;
    try {
      widget = window.hcaptcha.render(captcha, {
        sitekey: '50b2fe65-b00b-4b9e-ad62-3ba471098be2', theme: 'light',
        size: captcha.clientWidth < 310 ? 'compact' : 'normal', hl: en ? 'en' : 'nl',
        callback: value => { token = value; captchaStatus.textContent = ''; },
        'expired-callback': () => { token = ''; captchaStatus.textContent = t('Bevestig de spamcontrole opnieuw.','Please complete the spam check again.'); },
        'error-callback': captchaFailure,
      });
      captchaStatus.textContent = ''; captchaRetry.hidden = true;
    } catch { captchaFailure(); }
  };
  function loadCaptcha() {
    if (loading || widget !== null) return;
    loading = true; captchaRetry.hidden = true;
    captchaStatus.textContent = t('Spambeveiliging laden…','Loading spam protection…');
    captchaScript?.remove(); captchaScript = document.createElement('script');
    captchaScript.src = 'https://js.hcaptcha.com/1/api.js?render=explicit&onload=b2cContactCaptchaReady&recaptchacompat=off';
    captchaScript.async = true; captchaScript.defer = true; captchaScript.onerror = captchaFailure;
    captchaTimer = setTimeout(captchaFailure, 15000); document.head.append(captchaScript);
  }
  form.addEventListener('focusin', loadCaptcha, { once: true });
  captchaRetry.addEventListener('click', () => {
    if (widget !== null) { resetCaptcha(); captchaRetry.hidden = true; captchaStatus.textContent = ''; }
    else loadCaptcha();
  });
  const inputs = [...form.querySelectorAll('input:not([type="checkbox"]),textarea')];
  function validate(input) {
    let error = '', value = input.value.trim();
    if (input.required && !value) error = t('Vul dit veld in.','Please complete this field.');
    else if (input.name === 'email' && !input.validity.valid) error = t('Vul een geldig e-mailadres in.','Please enter a valid email address.');
    else if (input.name === 'message' && value.length < 10) error = t('Gebruik minimaal 10 tekens.','Please use at least 10 characters.');
    else if (input.maxLength > 0 && value.length > input.maxLength) error = t('Deze tekst is te lang.','This text is too long.');
    const target = document.getElementById(input.name + '-error');
    if (target) target.textContent = error;
    input.setAttribute('aria-invalid', String(Boolean(error))); return !error;
  }
  inputs.forEach(input => input.addEventListener('input', () => {
    if (input.getAttribute('aria-invalid') === 'true') validate(input);
  }));
  function values() {
    const data = new FormData(form), field = name => String(data.get(name) || '').trim();
    const subject = form.elements.namedItem('subject');
    return { name: field('name'), email: field('email'), company: field('company'), message: field('message'),
      topic: subject.options[subject.selectedIndex]?.textContent || '', botcheck: field('botcheck') };
  }
  form.addEventListener('submit', async event => {
    event.preventDefault(); if (sending || completed) return;
    const valid = inputs.map(validate), firstInvalid = valid.indexOf(false);
    if (firstInvalid >= 0) { inputs[firstInvalid].focus(); return; }
    const data = values();
    if (data.botcheck) { feedback(t('Uw bericht kon niet worden verzonden.','Your message could not be sent.')); return; }
    if (!token) { loadCaptcha(); feedback(t('Rond eerst de spamcontrole af. Uw bericht blijft bewaard.','Please complete the spam check first. Your message is preserved.')); return; }
    const key = form.dataset.accessKey;
    if (!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(key || '')) {
      feedback(t('Verzenden is niet beschikbaar. Mail Lex rechtstreeks.','Sending is unavailable. Please email Lex directly.')); return;
    }
    sending = true; recovery.hidden = true; fields.disabled = true; form.setAttribute('aria-busy', 'true');
    label.textContent = t('Bezig met versturen…','Sending…');
    feedback(t('Uw bericht wordt verstuurd…','Your message is being sent…'), 'pending', false);
    const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 20000);
    const payload = { access_key: key, name: data.name, email: data.email, company: data.company,
      message: data.message, subject: 'Bridge2Connect — ' + data.topic, from_name: 'Bridge2Connect website',
      language: en ? 'English' : 'Nederlands', 'h-captcha-response': token, botcheck: false };
    try {
      const response = await fetch('https://api.web3forms.com/submit', { method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload), credentials: 'omit', redirect: 'error', signal: controller.signal });
      let result; try { result = await response.json(); } catch { throw new Error('unconfirmed'); }
      if (!response.ok || result?.success !== true) {
        const error = new Error(response.status === 429 ? 'rate' : 'rejected'); throw error;
      }
      completed = true; form.reset(); fields.hidden = true; another.hidden = false;
      feedback(t('Bedankt. Uw bericht is verstuurd. Lex neemt contact met u op.','Thank you. Your message has been sent. Lex will be in touch.'), 'success');
    } catch (error) {
      const uncertain = error.name === 'AbortError' || !['rejected','rate'].includes(error.message);
      const text = uncertain ? t('We kunnen niet bevestigen of de verzending is gelukt. Uw tekst is bewaard; stuur niet direct opnieuw om een dubbel bericht te voorkomen.','We could not confirm whether your message was sent. Your text is preserved; avoid immediately resending to prevent duplicates.') : error.message === 'rate' ? t('Er worden momenteel te veel berichten aangeboden. Probeer later opnieuw of mail Lex rechtstreeks.','Too many messages are being submitted. Please try later or email Lex directly.') : t('De verzenddienst heeft het bericht niet geaccepteerd. Uw tekst is bewaard. Probeer later opnieuw of mail Lex rechtstreeks.','The delivery service did not accept the message. Your text is preserved. Please try later or email Lex directly.');
      feedback(text); recovery.hidden = false;
    } finally {
      clearTimeout(timer); sending = false; fields.disabled = false; form.removeAttribute('aria-busy');
      label.textContent = idleLabel; resetCaptcha();
    }
  });
  another.addEventListener('click', () => {
    completed = false; fields.hidden = false; status.hidden = true; another.hidden = true;
    recovery.hidden = true; inputs.forEach(input => { input.removeAttribute('aria-invalid'); });
    form.elements.namedItem('name')?.focus();
  });
  form.querySelector('[data-copy-inputs]')?.addEventListener('click', async () => {
    const data = values(), output = recovery.querySelector('[data-copy-status]');
    const text = `${data.message}\n\n${data.name}\n${data.company}\n${data.email}\n${data.topic}`;
    try {
      await navigator.clipboard.writeText(text);
      output.textContent = t('Bericht gekopieerd.','Message copied.');
    } catch {
      form.elements.namedItem('message')?.focus(); form.elements.namedItem('message')?.select();
      output.textContent = t('Selecteer en kopieer de tekst uit het berichtveld.','Select and copy the text from the message field.');
    }
  });
  fields.disabled = false;
})();
