import { translate, route } from '../content/locale.mjs';
import { escape } from './ui.mjs';
export function deliveryControls(lang) {
  const t = translate(lang);
  return `<input type="checkbox" name="botcheck" hidden tabindex="-1" autocomplete="off">
    <div class="contact-security"><p>${t('Bevestig dat u geen robot bent.','Please confirm you are not a robot.')}</p>
      <div id="contact-captcha" tabindex="-1"></div><p class="captcha-status" data-captcha-status role="status"></p>
      <button type="button" class="text-link" data-captcha-retry>${t('Spambeveiliging laden','Load spam protection')}</button></div>
    <p class="form-note" id="form-note">${t('Bij verzenden gaan uw gegevens via Web3Forms naar Lex. Gebruik dit formulier niet voor vertrouwelijke of gevoelige informatie.','On submission, your details are sent to Lex through Web3Forms. Do not use this form for confidential or sensitive information.')} <a href="${route('privacy',lang)}">${t('Meer over privacy','More about privacy')}</a>.</p>`;
}
export function deliveryFeedback(lang) {
  const t = translate(lang);
  return `<div class="contact-result" data-form-status role="status" aria-live="polite" aria-atomic="true" tabindex="-1" hidden></div>
    <button class="text-link" type="button" data-send-another hidden>${t('Nog een bericht schrijven','Write another message')}</button>
    <div class="contact-recovery" data-form-recovery hidden><p>${t('Uw invoer is bewaard. U kunt later opnieuw proberen of de tekst kopiëren en Lex rechtstreeks mailen.','Your input has been preserved. You can try again later, or copy the text and email Lex directly.')}</p><button class="text-link" type="button" data-copy-inputs>${t('Kopieer bericht','Copy message')}</button><p data-copy-status role="status"></p></div>`;
}
export function deliveryPrivacy(lang) {
  const t = translate(lang);
  return t('Als u op Bericht versturen klikt, worden uw naam, e-mailadres, eventueel bedrijfsnaam, onderwerp en bericht via een beveiligde verbinding verwerkt door Web3Forms en doorgestuurd naar Lex. De ingestelde bewaartermijn bij Web3Forms is zeven dagen. Deze termijn geldt niet voor de ontvangen e-mail in de mailbox. Web3Forms werkt vanuit India en gebruikt internationale infrastructuur en subverwerkers voor verzending en spamcontrole. De spamcontrole kan ook technische gegevens, zoals uw IP-adres, verwerken. Deel geen vertrouwelijke of gevoelige informatie via dit formulier.','When you select Send message, your name, email address, optional company name, topic and message are processed over a secure connection by Web3Forms and forwarded to Lex. Web3Forms retention is set to seven days. This period does not apply to the received email in the mailbox. Web3Forms operates from India and uses international infrastructure and sub-processors for delivery and spam checks. Spam checks may also process technical data such as your IP address. Do not submit confidential or sensitive information through this form.') + ' <a href="https://web3forms.com/privacy">Web3Forms privacy</a> · <a href="https://web3forms.com/dpa">Web3Forms DPA</a>';
}
