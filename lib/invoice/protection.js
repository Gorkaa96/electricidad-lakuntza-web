import 'server-only';
import { createHmac } from 'node:crypto';

// Both a real server verification and an atomic database quota are mandatory.
// If a key is missing, invoice intake remains off (fail closed).
export function invoiceIntakeReady() {
  return process.env.INVOICE_INTAKE_ENABLED === 'true' &&
    Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY &&
      process.env.TURNSTILE_SECRET_KEY &&
      (process.env.INTAKE_RATE_LIMIT_SECRET || '').length >= 32
    );
}

export async function verifyInvoiceHuman({ token, requestHeaders }) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const responseToken = String(token || '');
  const host = requestHeaders.get('host')?.split(':')[0]?.toLowerCase();
  const ip = requestHeaders.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()
    || requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim();

  if (!invoiceIntakeReady() || !secret || !responseToken ||
      responseToken.length > 2048 || !host) return false;

  try {
    const params = new URLSearchParams({
      secret,
      response: responseToken,
    });
    if (ip) params.set('remoteip', ip);
    const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: params,
      cache: 'no-store',
      signal: AbortSignal.timeout(7000),
    });
    if (!result.ok) return false;
    const validation = await result.json();
    return validation.success === true &&
      validation.action === 'invoice_review' &&
      validation.hostname?.toLowerCase() === host;
  } catch (e) {
    console.error('[invoice-intake] Human verification unavailable:', e?.name || 'unknown');
    return false;
  }
}

export async function consumeInvoiceQuotas({ supabase, requestHeaders, phone }) {
  const salt = process.env.INTAKE_RATE_LIMIT_SECRET;
  if (!invoiceIntakeReady() || !salt || !supabase) return false;

  const ip = requestHeaders.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()
    || requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim();
  const normalizedPhone = String(phone || '').replace(/\D/g, '');

  if (!normalizedPhone || normalizedPhone.length < 9) return false;

  const identifiers = [
    ...(ip ? ['ip:' + ip] : []),
    'phone:' + normalizedPhone,
  ];

  for (const identifier of identifiers) {
    const fingerprint = createHmac('sha256', salt).update(identifier).digest('hex');
    try {
      const { data, error } = await supabase.rpc('consume_public_intake_quota', { fingerprint });
      if (error || data !== true) {
        if (error) console.error('[invoice-intake] Rate-limit backend unavailable:', error.code || 'unknown');
        return false;
      }
    } catch (e) {
      console.error('[invoice-intake] Rate-limit request failed:', e?.name || 'unknown');
      return false;
    }
  }
  return true;
}
