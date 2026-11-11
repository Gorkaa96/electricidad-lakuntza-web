import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isProductionIntakeAllowed,
  isInvoiceIntakeConfigured,
  isCommercialIntakeConfigured,
} from '../lib/invoice/intake-config.mjs';

const configured = {
  NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'synthetic-test-key',
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: 'synthetic-public-key',
  TURNSTILE_SECRET_KEY: 'synthetic-secret',
  INTAKE_RATE_LIMIT_SECRET: 'x'.repeat(40),
  RESEND_API_KEY: 'synthetic-email-key',
  RESEND_FROM: 'test@example.org',
  INVOICE_REVIEW_TO: 'recipient@example.org',
  COMMERCIAL_LEAD_TO: 'recipient@example.org',
  INVOICE_INTAKE_ENABLED: 'true',
  PUBLIC_COMMERCIAL_INTAKE_ENABLED: 'true',
};

test('production pilot cannot accept customer data without explicit release approval', () => {
  const env = {...configured, VERCEL_ENV: 'production'};
  assert.equal(isProductionIntakeAllowed(env), false);
  assert.equal(isInvoiceIntakeConfigured(env), false);
  assert.equal(isCommercialIntakeConfigured(env), false);
});

test('explicit release approval still requires each feature-specific intake flag', () => {
  const env = {...configured, VERCEL_ENV:'production', PUBLIC_LAUNCH_APPROVED:'true'};
  assert.equal(isInvoiceIntakeConfigured(env), true);
  assert.equal(isCommercialIntakeConfigured(env), true);
  assert.equal(isInvoiceIntakeConfigured({...env, INVOICE_INTAKE_ENABLED:'false'}), false);
  assert.equal(isCommercialIntakeConfigured({...env, PUBLIC_COMMERCIAL_INTAKE_ENABLED:'false'}), false);
});

test('protected preview supports synthetic invoice flow while honoring existing safeguards', () => {
  assert.equal(isInvoiceIntakeConfigured({...configured, VERCEL_ENV:'preview'}), true);
  assert.equal(isCommercialIntakeConfigured({...configured, VERCEL_ENV:'preview'}), true);
  assert.equal(isInvoiceIntakeConfigured({...configured, VERCEL_ENV:'preview', TURNSTILE_SECRET_KEY:''}), false);
});
