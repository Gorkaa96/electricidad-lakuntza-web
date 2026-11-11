// Business dates must use the local calendar, not the UTC date from the server.
export function businessToday(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const values = Object.fromEntries(parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export const activeOpportunityStatuses = ['new', 'reviewing', 'contacted'];

export function followUpLabel(date, status, today = businessToday()) {
  if (!activeOpportunityStatuses.includes(status)) return null;
  if (!date) return 'Sin fecha programada';
  if (date < today) return 'Seguimiento vencido';
  if (date === today) return 'Seguimiento para hoy';
  return null;
}
