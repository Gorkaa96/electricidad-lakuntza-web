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
  return env.INVOICE_INTAKE_ENABLED === 'true' && hasPublicIntakeProtections(env) &&
    Boolean(env.RESEND_API_KEY && env.RESEND_FROM && env.INVOICE_REVIEW_TO);
}

export function isCommercialIntakeConfigured(env) {
  return env.PUBLIC_COMMERCIAL_INTAKE_ENABLED === 'true' &&
    hasPublicIntakeProtections(env) &&
    Boolean(env.RESEND_API_KEY && env.RESEND_FROM && env.COMMERCIAL_LEAD_TO);
}
