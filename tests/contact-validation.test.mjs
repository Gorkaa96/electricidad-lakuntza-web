import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalPhone, validContactChannels, quotaContact } from '../lib/contact-validation.mjs';

test('Spanish phone formatting cannot bypass a contact quota', () => {
  const variants = ['600123456', '600 123 456', '+34 (600) 123-456', '0034 600.123.456'];
  assert.equal(new Set(variants.map(quotaContact)).size, 1);
  assert.equal(quotaContact(variants[0]), '+34600123456');
});
test('rejects punctuation-only, misplaced plus, short and excessive numbers', () => {
  for (const value of ['-------', '1234567', '600+123456', '+1234567890123456', 'abc600123456']) {
    assert.equal(canonicalPhone(value), null, value);
    assert.equal(validContactChannels(value, ''), false, value);
  }
});
test('supports email-only inquiries and normalizes email quotas', () => {
  assert.equal(validContactChannels('', 'cliente@example.org'), true);
  assert.equal(quotaContact(' Cliente@Example.org '), 'cliente@example.org');
  assert.equal(validContactChannels('', ''), false);
  assert.equal(validContactChannels('', 'invalid'), false);
});
test('a valid email never excuses a malformed phone', () => {
  assert.equal(validContactChannels('---', 'cliente@example.org'), false);
});
