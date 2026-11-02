'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requirePermission } from '@/lib/admin';
import { createUserManagementClient } from '@/lib/supabase/management';
import { allowedRoleForManager, ROLE_DEFAULTS, validateMemberPermissions } from '@/lib/rolePermissions';

function inviteError(code) {
  redirect('/admin/usuarios?error=' + encodeURIComponent(code));
}

function validEmail(value) {
  const email = String(value || '').trim().toLowerCase();
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

function permissionsFromForm(data, manager, role) {
  const values = data.getAll('permissions');
  const permissions = values.length ? values.map(String) : ROLE_DEFAULTS[role] || [];
  return validateMemberPermissions(manager, role, permissions);
}

export async function inviteTeamMember(formData) {
  const { admin: manager, user } = await requirePermission('users.manage');
  const email = validEmail(formData.get('email'));
  const role = String(formData.get('role') || 'agent');
  const permissions = permissionsFromForm(formData, manager, role);

  if (!email || !allowedRoleForManager(manager, role) || !permissions) inviteError('datos');
  if (email === user.email?.toLowerCase()) inviteError('self');

  const adminClient = createUserManagementClient();
  const base = process.env.ADMIN_INVITATION_BASE_URL;
  if (!adminClient || !base || !/^https:\/\/[^\s/]+/.test(base)) inviteError('config');

  const { data: existing, error: existingError } = await adminClient
    .from('admin_users')
    .select('user_id')
    .eq('email', email)
    .maybeSingle();

  if (existingError) inviteError('servidor');
  if (existing) inviteError('existe');

  // User credentials never pass through our UI; Supabase sends a one-time invite.
  // Configure custom SMTP and redirect allowlist in Supabase before enabling this.
  const { data: invite, error: invitationError } = await adminClient.auth.admin.inviteUserByEmail(email, {
    redirectTo: base.replace(/\/$/, '') + '/admin/activar-cuenta',
  });

  if (invitationError || !invite?.user?.id) {
    console.error('[team-invite] Supabase invitation failed', invitationError?.code || invitationError?.status || 'unknown');
    inviteError('invitacion');
  }

  const { error: membershipError } = await adminClient.from('admin_users').insert({
    user_id: invite.user.id,
    email,
    role,
    permissions,
    active: true,
    created_by: user.id,
  });

  if (membershipError) {
    console.error('[team-invite] Invitation delivered but role assignment failed', membershipError.code || 'unknown');
    inviteError('membresia');
  }

  revalidatePath('/admin/usuarios');
  redirect('/admin/usuarios?success=invitado');
}

export async function updateTeamMember(formData) {
  const { admin: manager, user } = await requirePermission('users.manage');
  const id = String(formData.get('userId') || '');
  const role = String(formData.get('role') || '');
  const permissions = permissionsFromForm(formData, manager, role);
  const active = formData.get('active') === 'on';

  if (!/^[0-9a-f-]{36}$/i.test(id) || !permissions) inviteError('datos');
  if (id === user.id) inviteError('self');

  const adminClient = createUserManagementClient();
  if (!adminClient) inviteError('config');

  const { data: target, error: readError } = await adminClient
    .from('admin_users')
    .select('user_id, role')
    .eq('user_id', id)
    .maybeSingle();

  if (readError || !target || target.role === 'owner') inviteError('protegido');
  if (manager.role !== 'owner' && target.role !== 'agent') inviteError('protegido');
  if (!allowedRoleForManager(manager, role)) inviteError('permisos');

  const { error } = await adminClient.from('admin_users')
    .update({ role, permissions, active, updated_at: new Date().toISOString() })
    .eq('user_id', id);

  if (error) {
    console.error('[team-update] Cannot update permissions', error.code || 'unknown');
    inviteError('servidor');
  }

  revalidatePath('/admin/usuarios');
  revalidatePath('/admin/facturas');
  redirect('/admin/usuarios?success=actualizado');
}
