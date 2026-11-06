import 'server-only';
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';

const cookieName = 'lakuntza_invoice_receipt';

export function receiptCookie() {
  const secret = process.env.INTAKE_RATE_LIMIT_SECRET;
  if (!secret || secret.length < 32) return null;
  const timestamp = Date.now().toString();
  const payload = timestamp + '.' + randomUUID();
  const digest = createHmac('sha256', secret).update(payload).digest('hex');
  return {
    name: cookieName,
    value: payload + '.' + digest,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/revision-factura-luz-gas/gracias',
      maxAge: 300,
    },
  };
}

export function hasValidReceipt(raw) {
  if (typeof raw !== 'string') return false;
  const secret = process.env.INTAKE_RATE_LIMIT_SECRET;
  const [timestamp, nonce, provided] = raw.split('.');
  if (!secret || secret.length < 32 || !/^\d{10,15}$/.test(timestamp || '') ||
      !/^[0-9a-f-]{36}$/.test(nonce || '') ||
      !/^[a-f0-9]{64}$/.test(provided || '')) return false;

  const age = Date.now() - Number(timestamp);
  if (age < 0 || age > 5 * 60 * 1000) return false;

  const expected = createHmac('sha256', secret).update(timestamp + '.' + nonce).digest('hex');
  return timingSafeEqual(Buffer.from(provided, 'hex'), Buffer.from(expected, 'hex'));
}

export const receiptCookieName = cookieName;
