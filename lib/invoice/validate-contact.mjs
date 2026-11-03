import { validContactChannels } from '../contact-validation.mjs';

export function validateInvoiceContact({ name, phone, email, consentAccepted }) {
  const contactName = String(name ?? '').trim();
  return contactName.length >= 2 && contactName.length <= 100 &&
    Boolean(String(phone ?? '').trim()) &&
    validContactChannels(phone, email) && consentAccepted === true;
}
