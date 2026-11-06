// Shared by public intake, internal CRM and abuse protection.
export function canonicalPhone(value) {
  const raw = String(value ?? '').trim();
  if (!raw || raw.length > 35 || !/^\+?[\d\s().-]+$/.test(raw)) return null;
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.length < 9 || digits.length > 15) return null;
  // National Spanish numbers and their +34 / 0034 variants share one quota.
  if (digits.length === 9 && !raw.startsWith('+') && !raw.startsWith('00')) digits = '34' + digits;
  return '+' + digits;
}

export function validContactChannels(phone, email) {
  const p = String(phone ?? '').trim();
  const e = String(email ?? '').trim();
  return Boolean((p || e) && (!p || canonicalPhone(p)) &&
    (!e || (e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))));
}

export function quotaContact(value) {
  const raw = String(value ?? '').trim();
  if (raw.includes('@')) return raw.toLowerCase();
  return canonicalPhone(raw);
}
