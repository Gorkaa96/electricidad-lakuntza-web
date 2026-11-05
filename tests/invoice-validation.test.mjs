import test from 'node:test';
import assert from 'node:assert/strict';
import { validateInvoiceContact } from '../lib/invoice/validate-contact.mjs';

const valid = { name: 'María', phone: '+34 600 123 456', email: 'contacto@ejemplo.es', consentAccepted: true };

test('accepts a contact other than the invoice holder with phone and email', () => {
  assert.equal(validateInvoiceContact(valid), true);
});

test('requires email for invoice review even when phone is valid', () => {
  for (const email of ['', '   ', null, undefined]) {
    assert.equal(validateInvoiceContact({ ...valid, email }), false);
  }
});

test('does not accept a missing or very short contact name', () => {
  assert.equal(validateInvoiceContact({ ...valid, name: ' ' }), false);
  assert.equal(validateInvoiceContact({ ...valid, name: 'M' }), false);
});

test('rejects invalid phone formats and lengths', () => {
  for (const phone of ['', 'xyz600123456', '1234', '1234567890123456']) {
    assert.equal(validateInvoiceContact({ ...valid, phone }), false);
  }
});

test('rejects invalid email and missing consent', () => {
  for (const email of ['contacto-sin-arroba', 'contacto@', 'a'.repeat(250)+'@ejemplo.es', 'a@ejemplo.es\r\nBcc:otro@ejemplo.es']) {
    assert.equal(validateInvoiceContact({ ...valid, email }), false);
  }
  assert.equal(validateInvoiceContact({ ...valid, consentAccepted: false }), false);
});
