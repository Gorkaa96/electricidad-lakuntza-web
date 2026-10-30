import test from 'node:test';
import assert from 'node:assert/strict';
import { validateInvoiceContact } from '../lib/invoice/validate-contact.mjs';

const valid = { name: 'María', phone: '+34 600 123 456', email: '', consentAccepted: true };

test('accepts a contact other than the invoice holder, with phone only', () => {
  assert.equal(validateInvoiceContact(valid), true);
});

test('accepts an optional valid email', () => {
  assert.equal(validateInvoiceContact({ ...valid, email: 'contacto@ejemplo.es' }), true);
});

test('does not accept a missing or very short contact name', () => {
  assert.equal(validateInvoiceContact({ ...valid, name: ' ' }), false);
  assert.equal(validateInvoiceContact({ ...valid, name: 'M' }), false);
});

test('rejects invalid phone formats and lengths', () => {
  assert.equal(validateInvoiceContact({ ...valid, phone: 'xyz600123456' }), false);
  assert.equal(validateInvoiceContact({ ...valid, phone: '1234' }), false);
  assert.equal(validateInvoiceContact({ ...valid, phone: '1234567890123456' }), false);
});

test('rejects invalid optional email and missing consent', () => {
  assert.equal(validateInvoiceContact({ ...valid, email: 'contacto-sin-arroba' }), false);
  assert.equal(validateInvoiceContact({ ...valid, consentAccepted: false }), false);
});
