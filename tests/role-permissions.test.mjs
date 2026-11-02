import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ROLE_DEFAULTS, hasPermission, allowedRoleForManager,
  canViewLeads, validateMemberPermissions,
} from '../lib/rolePermissions.js';

const owner = { role: 'owner', active: true, permissions: ROLE_DEFAULTS.owner };
const admin = { role: 'admin', active: true, permissions: ROLE_DEFAULTS.admin };
const agent = { role: 'agent', active: true, permissions: ROLE_DEFAULTS.agent };

test('owner has all permissions, but inactive memberships lose access', () => {
  assert.equal(hasPermission(owner, 'users.manage'), true);
  assert.equal(hasPermission({ ...owner, active: false }, 'users.manage'), false);
});

test('agents only read assigned leads by default', () => {
  assert.equal(hasPermission(agent, 'leads.read_assigned'), true);
  assert.equal(hasPermission(agent, 'leads.read_all'), false);
  assert.equal(hasPermission(agent, 'users.manage'), false);
  assert.equal(canViewLeads(agent), true);
});

test('owner may invite admins; admins may invite only agents', () => {
  assert.equal(allowedRoleForManager(owner, 'admin'), true);
  assert.equal(allowedRoleForManager(admin, 'admin'), false);
  assert.equal(allowedRoleForManager(admin, 'agent'), true);
  assert.equal(allowedRoleForManager(agent, 'agent'), false);
});

test('rejects agent privilege escalation and unknown permissions', () => {
  assert.equal(validateMemberPermissions(owner, 'agent', ['users.manage']), null);
  assert.equal(validateMemberPermissions(owner, 'agent', ['not-allowed']), null);
});

test('rejects incomplete permission dependencies', () => {
  assert.equal(validateMemberPermissions(owner, 'agent', ['leads.edit_assigned']), null);
  assert.equal(validateMemberPermissions(owner, 'admin', ['leads.assign', 'leads.read_all']), null);
  assert.equal(validateMemberPermissions(owner, 'admin', ['leads.delete']), null);
});

test('validates a narrowly scoped agent and privileged admin', () => {
  assert.deepEqual(validateMemberPermissions(owner, 'agent', ROLE_DEFAULTS.agent), ROLE_DEFAULTS.agent);
  assert.deepEqual(validateMemberPermissions(owner, 'admin', ROLE_DEFAULTS.admin), ROLE_DEFAULTS.admin);
});

test('admins may not grant rights they do not hold', () => {
  const limited = { role: 'admin', active: true, permissions: ['users.manage', 'leads.read_assigned'] };
  assert.equal(validateMemberPermissions(limited, 'agent', ['projects.manage']), null);
  assert.deepEqual(validateMemberPermissions(limited, 'agent', ['leads.read_assigned']), ['leads.read_assigned']);
});
