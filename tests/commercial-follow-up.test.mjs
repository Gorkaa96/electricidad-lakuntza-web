import test from 'node:test';
import assert from 'node:assert/strict';
import { businessToday, followUpLabel } from '../lib/commercial/follow-up.mjs';

test('businessToday uses the Madrid calendar across seasonal time changes', () => {
  assert.equal(businessToday(new Date('2026-11-08T23:30:00Z')), '2026-11-09');
  assert.equal(businessToday(new Date('2026-07-01T22:30:00Z')), '2026-07-02');
});

test('follow-up labels only flag open opportunities', () => {
  assert.equal(followUpLabel('2026-11-08', 'new', '2026-11-09'), 'Seguimiento vencido');
  assert.equal(followUpLabel('2026-11-09', 'reviewing', '2026-11-09'), 'Seguimiento para hoy');
  assert.equal(followUpLabel(null, 'contacted', '2026-11-09'), 'Sin fecha programada');
  assert.equal(followUpLabel('2026-11-08', 'converted', '2026-11-09'), null);
  assert.equal(followUpLabel('2026-11-08', 'discarded', '2026-11-09'), null);
});
