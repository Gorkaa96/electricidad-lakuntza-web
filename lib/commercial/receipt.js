import 'server-only';
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';

export const commercialReceiptName = 'lakuntza_commercial_receipt';

export function newCommercialReceipt() {
  const secret = process.env.INTAKE_RATE_LIMIT_SECRET;
  if (!secret || secret.length < 32) return null;
  const payload = Date.now() + '.' + randomUUID();
  const sig = createHmac('sha256', secret).update(payload).digest('hex');
  return {
    name: commercialReceiptName,
    value: payload + '.' + sig,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/consulta/gracias',
      maxAge: 300,
    },
  };
}

export function validCommercialReceipt(raw) {
  const secret = process.env.INTAKE_RATE_LIMIT_SECRET;
  if (!secret || secret.length < 32 || typeof raw !== 'string') return false;
  const [ts, nonce, sig] = raw.split('.');
  if (!/^\d{10,15}$/.test(ts || '') || !/^[0-9a-f-]{36}$/.test(nonce || '') || !/^[a-f0-9]{64}$/.test(sig || '')) return false;
  const age = Date.now() - Number(ts);
  if (age < 0 || age > 300000) return false;
  const expected = createHmac('sha256', secret).update(ts + '.' + nonce).digest('hex');
  return timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'));
}
