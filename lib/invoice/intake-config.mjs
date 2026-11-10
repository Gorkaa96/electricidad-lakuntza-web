// A production deploy can serve the public site and private CRM for internal
// acceptance tests without accepting customer data until legal/security signoff.
export function isProductionIntakeAllowed(env) {
  return env.VERCEL_ENV !== 'production' || env.PUBLIC_LAUNCH_APPROVED === 'true';
}

export function hasPublicIntakeProtections(env) {
  return Boolean(
    env.NEXT_PUBLIC_SUPABASE_URL &&
    env.SUPABASE_SERVICE_ROLE_KEY &&
    env.NEXT_PUBLIC_TURNSTILE_SITE_KEY &&
    env.TURNSTILE_SECRET_KEY &&
    (env.INTAKE_RATE_LIMIT_SECRET || '').length >= 32
  );
}

export function isInvoiceIntakeConfigured(env) {
  return isProductionIntakeAllowed(env) && env.INVOICE_INTAKE_ENABLED === 'true' && hasPublicIntakeProtections(env) &&
    Boolean(env.RESEND_API_KEY && env.RESEND_FROM && env.INVOICE_REVIEW_TO);
}

export function isCommercialIntakeConfigured(env) {
  return isProductionIntakeAllowed(env) && env.PUBLIC_COMMERCIAL_INTAKE_ENABLED === 'true' &&
    hasPublicIntakeProtections(env) &&
    Boolean(env.RESEND_API_KEY && env.RESEND_FROM && env.COMMERCIAL_LEAD_TO);
}
