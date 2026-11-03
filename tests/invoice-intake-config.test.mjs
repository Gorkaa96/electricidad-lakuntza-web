import test from 'node:test';
import assert from 'node:assert/strict';
import { isInvoiceIntakeConfigured, isCommercialIntakeConfigured } from '../lib/invoice/intake-config.mjs';

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

test('public commercial intake requires its own enable flag, bot protection and active notifications', () => {
  const enabled = {
    ...complete,
    PUBLIC_COMMERCIAL_INTAKE_ENABLED: 'true',
    RESEND_API_KEY: 'unit-test-key',
    RESEND_FROM: 'not-a-real-address@example.org',
    COMMERCIAL_LEAD_TO: 'not-a-real-address@example.org',
  };
  assert.equal(isCommercialIntakeConfigured(enabled), true);
  for (const key of ['PUBLIC_COMMERCIAL_INTAKE_ENABLED', 'RESEND_API_KEY', 'RESEND_FROM', 'COMMERCIAL_LEAD_TO', 'TURNSTILE_SECRET_KEY', 'INTAKE_RATE_LIMIT_SECRET']) {
    const trial = { ...enabled };
    delete trial[key];
    assert.equal(isCommercialIntakeConfigured(trial), false, key);
  }
});
