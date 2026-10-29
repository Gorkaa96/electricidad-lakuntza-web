/**
 * Validate the person we will contact about an invoice.
 * This person is not necessarily the invoice contract holder.
 * Keep this rule identical for the server action and the automated tests.
 */
export function validateInvoiceContact({ name, phone, email, consentAccepted }) {
  const contactName = String(name ?? '').trim();
  const contactPhone = String(phone ?? '').trim();
  const contactEmail = String(email ?? '').trim();
  const digits = contactPhone.replace(/\D/g, '');

  if (contactName.length < 2 || contactName.length > 100) return false;
  if (contactPhone.length > 25 || !/^\+?[\d\s().-]+$/.test(contactPhone)) return false;
  if (digits.length < 9 || digits.length > 15) return false;
  if (contactEmail && (contactEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail))) return false;
  return consentAccepted === true;
}
