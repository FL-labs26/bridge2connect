// Web3Forms form keys are public submission identifiers, not account/API secrets.
// Activate only after verifying the recipient, 7-day retention and server-side captcha.
export const contactDelivery = {
  enabled: false,
  accessKey: '',
  recipient: 'lexdelange@bridge2connect.nl',
  recipientVerified: false,
  retentionDays: null,
  captchaEnforced: false,
};
export function resolveContactDelivery(config = contactDelivery) {
  if (!config.enabled) return { enabled: false };
  if (!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(config.accessKey || '')) throw new Error('A verified Web3Forms form key is required.');
  if (config.recipient !== 'lexdelange@bridge2connect.nl' || config.recipientVerified !== true) throw new Error('Verify the Bridge2Connect recipient before activation.');
  if (config.retentionDays !== 7) throw new Error('Verify seven-day provider retention before activation.');
  if (config.captchaEnforced !== true) throw new Error('Enable mandatory hCaptcha on the provider form before activation.');
  return { enabled: true, accessKey: config.accessKey, retentionDays: 7, endpoint: 'https://api.web3forms.com/submit' };
}
