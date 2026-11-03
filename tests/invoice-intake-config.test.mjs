import test from 'node:test';
import assert from 'node:assert/strict';
import { isInvoiceIntakeConfigured } from '../lib/invoice/intake-config.mjs';

const complete = {
  INVOICE_INTAKE_ENABLED: 'true',
  NEXT_PUBLIC_SUPABASE_URL: 'https://unit-test.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'only-unit-test-not-a-real-secret',
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: 'unit-test-public',
  TURNSTILE_SECRET_KEY: 'unit-test-secret',
  INTAKE_RATE_LIMIT_SECRET: 'x'.repeat(32),
};

test('intake remains off unless explicitly enabled', () => {
  assert.equal(isInvoiceIntakeConfigured({ ...complete, INVOICE_INTAKE_ENABLED: 'false' }), false);
});

test('intake fails closed if any critical credential or captcha piece is absent', () => {
  for (const name of Object.keys(complete)) {
    const copy = { ...complete };
    delete copy[name];
    assert.equal(isInvoiceIntakeConfigured(copy), false, name);
  }
});

test('intake refuses a short fingerprint salt', () => {
  assert.equal(isInvoiceIntakeConfigured({ ...complete, INTAKE_RATE_LIMIT_SECRET: 'short' }), false);
});

test('intake may be enabled only with all required protections', () => {
  assert.equal(isInvoiceIntakeConfigured(complete), true);
});
