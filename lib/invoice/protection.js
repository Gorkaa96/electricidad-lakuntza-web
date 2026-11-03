import 'server-only';
import { createHmac } from 'node:crypto';
import { quotaContact } from '../contact-validation.mjs';
import {
  isInvoiceIntakeConfigured,
  isCommercialIntakeConfigured,
} from './intake-config.mjs';

export function invoiceIntakeReady() {
  return isInvoiceIntakeConfigured(process.env);
}

export function commercialIntakeReady() {
  return isCommercialIntakeConfigured(process.env);
}

function readyFor(flow) {
  return flow === 'invoice' ? invoiceIntakeReady()
    : flow === 'commercial' ? commercialIntakeReady() : false;
}

export async function verifyPublicHuman({ token, requestHeaders, flow }) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const responseToken = String(token || '');
  const host = requestHeaders.get('host')?.split(':')[0]?.toLowerCase();
  const ip = requestHeaders.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()
    || requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim();

  if (!readyFor(flow) || !secret || !responseToken ||
      responseToken.length > 2048 || !host) return false;

  try {
    const params = new URLSearchParams({ secret, response: responseToken });
    if (ip) params.set('remoteip', ip);
    const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', body: params, cache: 'no-store', signal: AbortSignal.timeout(7000),
    });
    if (!result.ok) return false;
    const validation = await result.json();
    const expectedAction = flow === 'invoice' ? 'invoice_review' : 'commercial_inquiry';
    return validation.success === true &&
      validation.action === expectedAction &&
      validation.hostname?.toLowerCase() === host;
  } catch (e) {
    console.error('[public-intake] Human verification unavailable:', e?.name || 'unknown');
    return false;
  }
}

export async function verifyInvoiceHuman(args) {
  return verifyPublicHuman({ ...args, flow: 'invoice' });
}

export async function consumePublicQuotas({ supabase, requestHeaders, contact, flow }) {
  const salt = process.env.INTAKE_RATE_LIMIT_SECRET;
  if (!readyFor(flow) || !salt || !supabase) return false;

  const ip = requestHeaders.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()
    || requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim();
  const normalized = quotaContact(contact);
  if (!normalized || normalized.length < 7 || normalized.length > 254) return false;

  const identifiers = [
    ...(ip ? ['ip:' + ip] : []),
    'contact:' + normalized,
  ];

  for (const identifier of identifiers) {
    const fingerprint = createHmac('sha256', salt).update(identifier).digest('hex');
    try {
      const { data, error } = await supabase.rpc('consume_public_intake_quota', { fingerprint });
      if (error || data !== true) {
        if (error) console.error('[public-intake] Rate limiting unavailable:', error.code || 'unknown');
        return false;
      }
    } catch (e) {
      console.error('[public-intake] Rate limiting request failed:', e?.name || 'unknown');
      return false;
    }
  }
  return true;
}

export async function consumeInvoiceQuotas({ supabase, requestHeaders, phone }) {
  return consumePublicQuotas({ supabase, requestHeaders, contact: phone, flow: 'invoice' });
}
