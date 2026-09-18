import { test } from 'node:test';
import assert from 'node:assert/strict';
import contact from '../src/pages/contact.mjs';
import privacy from '../src/pages/privacy.mjs';
import { contactDelivery, resolveContactDelivery } from '../src/content/contact-delivery.mjs';
const approved = { enabled: true, accessKey: '11111111-1111-4111-8111-111111111111', recipient: 'lexdelange@bridge2connect.nl', recipientVerified: true, retentionDays: 7, captchaEnforced: true };
test('Delivery stays off until the account has been confirmed', () => {
  assert.equal(resolveContactDelivery({ enabled: false }).enabled, false);
});
for (const [name, changes] of [
  ['missing key', { accessKey: '' }], ['invalid key', { accessKey: '<script>' }],
  ['wrong recipient', { recipient: 'other@example.org' }], ['unverified email', { recipientVerified: false }],
  ['unverified retention', { retentionDays: null }], ['long retention', { retentionDays: 1095 }],
  ['captcha not enforced', { captchaEnforced: false }],
]) test(`Activation rejects ${name}`, () => assert.throws(() => resolveContactDelivery({ ...approved, ...changes })));
for (const lang of ['nl','en']) {
  test(`${lang}: active form uses in-page delivery, not the mailto dialog`, () => {
    const html = contact(lang, approved);
    assert.ok(html.includes('data-delivery="web3forms"'));
    assert.ok(html.includes('method="post"')); assert.ok(html.includes('data-form-status'));
    assert.ok(html.includes('contact-captcha')); assert.ok(!html.includes('id="open-email"'));
    assert.ok(!html.includes('id="message-dialog"'));
    assert.ok(html.includes(lang === 'nl' ? 'Bericht versturen' : 'Send message'));
  });
  test(`${lang}: inactive version retains the working composer`, () => {
    const html = contact(lang, { enabled: false }); assert.ok(html.includes('id="open-email"')); assert.ok(!html.includes('contact-captcha'));
  });
  test(`${lang}: privacy describes actual processing only when active`, () => {
    const active = privacy(lang, approved), dormant = privacy(lang, { enabled: false });
    assert.ok(active.includes('https://web3forms.com/privacy')); assert.ok(active.includes('https://www.hcaptcha.com/privacy'));
    assert.ok(active.includes(lang === 'nl' ? 'zeven dagen' : 'seven days'));
    assert.ok(!dormant.includes('https://web3forms.com/privacy'));
  });
}
