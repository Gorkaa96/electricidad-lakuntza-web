export function isInvoiceIntakeConfigured(env) {
  return env.INVOICE_INTAKE_ENABLED === 'true' &&
    Boolean(env.NEXT_PUBLIC_SUPABASE_URL &&
      env.SUPABASE_SERVICE_ROLE_KEY &&
      env.NEXT_PUBLIC_TURNSTILE_SITE_KEY &&
      env.TURNSTILE_SECRET_KEY &&
      (env.INTAKE_RATE_LIMIT_SECRET || '').length >= 32);
}
