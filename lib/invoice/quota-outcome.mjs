export function quotaOutcome({ data, error, status }) {
  if (error || (status != null && (status < 200 || status >= 300))) return 'unavailable';
  if (data === true) return 'allowed';
  return data === false ? 'limited' : 'unavailable';
}
