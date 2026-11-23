// Centralise the AAL decision for server-rendered routes and sign-in.
// A factor has to be verified by Supabase before nextLevel becomes aal2.
export function needsMfaChallenge(levels) {
  return levels?.nextLevel === 'aal2' && levels.currentLevel !== 'aal2';
}

export function validTotpCode(value) {
  return /^\d{6}$/.test(String(value ?? '').trim());
}
