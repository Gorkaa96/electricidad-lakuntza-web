// Shared by public intake, internal CRM and abuse protection.
// Keep email/phone checks consistent between browser and server actions.
export function canonicalPhone(value) {
  const raw = String(value ?? '').trim();
  if (!raw || raw.length > 35 || !/^\+?[\d\s().-]+$/.test(raw)) return null;
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.length < 9 || digits.length > 15) return null;
  // Spanish national numbers must begin with 6/7 (mobile) or 8/9 (landline).
  // Normalize their +34 / 0034 variants to one abuse-protection fingerprint.
  if (digits.length === 9 && !raw.startsWith('+') && !raw.startsWith('00')) {
    if (!/^[6789]\d{8}$/.test(digits)) return null;
    digits = '34' + digits;
  }
  if (digits.startsWith('34') && digits.length === 11 && !/^[6789]\d{8}$/.test(digits.slice(2))) return null;
  if (/^(\d)\1+$/.test(digits)) return null;
  return '+' + digits;
}

export function validEmail(value) {
  const email = String(value ?? '').trim();
  if (!email || email.length > 254 || /[\s\u0000-\u001f]/.test(email)) return false;
  const at = email.lastIndexOf('@');
  if (at < 1 || email.indexOf('@') !== at) return false;
  const local = email.slice(0,at), domain=email.slice(at+1);
  if (local.length > 64 || /^\.|\.$|\.\./.test(local) || !/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local)) return false;
  if (domain.length > 253 || domain.includes('..')) return false;
  const labels=domain.split('.');
  if (labels.length < 2 || !/^[A-Za-z]{2,63}$/.test(labels.at(-1))) return false;
  return labels.every(label => label.length <= 63 && /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(label));
}

export function validContactChannels(phone, email) {
  const p = String(phone ?? '').trim();
  const e = String(email ?? '').trim();
  return Boolean((p || e) && (!p || canonicalPhone(p)) && (!e || validEmail(e)));
}

export function quotaContact(value) {
  const raw = String(value ?? '').trim();
  if (raw.includes('@')) return validEmail(raw) ? raw.toLowerCase() : null;
  return canonicalPhone(raw);
}
