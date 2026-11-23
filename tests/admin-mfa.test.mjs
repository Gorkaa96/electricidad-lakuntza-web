import assert from 'node:assert/strict';
import test from 'node:test';
import { needsMfaChallenge, validTotpCode } from '../lib/admin-mfa.mjs';

test('requires the second step only when Supabase reports an enrolled factor', () => {
  assert.equal(needsMfaChallenge({ currentLevel: 'aal1', nextLevel: 'aal2' }), true);
  assert.equal(needsMfaChallenge({ currentLevel: 'aal2', nextLevel: 'aal2' }), false);
  assert.equal(needsMfaChallenge({ currentLevel: 'aal1', nextLevel: 'aal1' }), false);
  assert.equal(needsMfaChallenge(null), false);
});

test('accepts exactly six TOTP digits', () => {
  assert.equal(validTotpCode('123456'), true);
  assert.equal(validTotpCode(' 123456 '), true);
  assert.equal(validTotpCode('12345'), false);
  assert.equal(validTotpCode('1234567'), false);
  assert.equal(validTotpCode('12345a'), false);
  assert.equal(validTotpCode(null), false);
});
