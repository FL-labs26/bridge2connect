/* Local-only message composition; no form submissions or translation service. */
document.documentElement.classList.add('js');
(() => {
  const en=document.documentElement.lang==='en';
  const t=(nl,english)=>en?english:nl;
  const params=new URLSearchParams(location.search);
  document.querySelectorAll('[data-language-link]').forEach(link=>{
    const url=new URL(link.href);
    if (location.hash) url.hash=location.hash;
    for (const key of ['topic','onderwerp']) if(params.has(key)) url.searchParams.set(key,params.get(key));
    link.href=url.href;
  });
  const form=document.querySelector('#contact-form'), dialog=document.querySelector('#message-dialog');
  if (!(form instanceof HTMLFormElement) || !(dialog instanceof HTMLDialogElement)) return;
  const messageArea=document.querySelector('#prepared-message'), copyStatus=document.querySelector('#copy-status');
  const subject=form.elements.namedItem('subject');
  if (subject instanceof HTMLSelectElement) {
    const matching=[...subject.options].find(option=>option.dataset.topic===params.get('topic') || option.value===params.get('onderwerp') || option.textContent===params.get('onderwerp'));
    if(matching) subject.value=matching.value;
  }
  const validateField=element=>{
    let error='';
    if(!element.value.trim()) error=element.name==='message'?t('Vertel kort waar uw vraag over gaat.','Please briefly describe your question.'):element.name==='email'?t('Vul uw e-mailadres in.','Please enter your email address.'):t('Vul uw naam in.','Please enter your name.');
    else if(element.name==='email' && !element.validity.valid) error=t('Vul een geldig e-mailadres in, bijvoorbeeld naam@bedrijf.nl.','Enter a valid email address, such as name@company.com.');
    else if(element.name==='message' && element.value.trim().length<10) error=t('Gebruik minimaal 10 tekens voor uw bericht.','Please use at least 10 characters for your message.');
    else if(element.maxLength>0 && element.value.length>element.maxLength) error=t('Deze tekst is te lang. Maak hem iets korter.','This text is too long. Please shorten it.');
    const target=document.getElementById(element.name+'-error'); if(target) target.textContent=error;
    element.setAttribute('aria-invalid',String(Boolean(error))); return !error;
  };
  const required=[...form.querySelectorAll('[required]')];
  required.forEach(field=>field.addEventListener('input',()=>{if(field.getAttribute('aria-invalid')==='true') validateField(field);}));
  form.addEventListener('submit',event=>{
    event.preventDefault(); const results=required.map(validateField);
    if(results.includes(false)){required[results.indexOf(false)].focus();return;}
    const data=new FormData(form), value=name=>String(data.get(name)||'').trim();
    const subjectText=subject.options[subject.selectedIndex]?.textContent||'';
    const message=`${t('Beste Lex,','Dear Lex,')}\n\n${value('message')}\n\n${t('Met vriendelijke groet,','Kind regards,')}\n${value('name')}${value('company')?'\n'+value('company'):''}\n${value('email')}\n\n${t('Onderwerp','Subject')}: ${subjectText}`;
    messageArea.value=message;copyStatus.textContent='';
    const openEmail=document.querySelector('#open-email'),recipient=form.dataset.recipient;
    if(openEmail && recipient && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(recipient)) openEmail.href=`mailto:${recipient}?subject=${encodeURIComponent('Bridge2Connect - '+subjectText)}&body=${encodeURIComponent(message)}`;
    dialog.showModal();
  });
  dialog.querySelector('[data-close-dialog]').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{
    if(event.target!==dialog)return;
    const r=dialog.getBoundingClientRect();
    if(event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom)dialog.close();
  });
  document.querySelector('#copy-message').addEventListener('click',async()=>{
    try{if(!navigator.clipboard)throw Error('Clipboard unavailable');await navigator.clipboard.writeText(messageArea.value);copyStatus.textContent=t('Bericht gekopieerd. Er is niets verstuurd.','Message copied. Nothing has been sent.');}
    catch{messageArea.focus();messageArea.select();copyStatus.textContent=t('De tekst is geselecteerd. Gebruik Ctrl+C of ⌘C om te kopiëren.','Text selected. Use Ctrl+C or ⌘C to copy.');}
  });
  const fields=form.querySelector('[data-form-fields]');if(fields)fields.disabled=false;
})();
