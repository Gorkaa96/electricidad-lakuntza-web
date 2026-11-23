import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from './supabase/server';
import { hasPermission } from './rolePermissions';
import { needsMfaChallenge } from './admin-mfa.mjs';

export async function getAdminContext() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { supabase: null, user: null, admin: null };
  }

  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user || null;

  if (!user) {
    return { supabase, user: null, admin: null };
  }

  const { data: admin, error } = await supabase
    .from('admin_users')
    .select('user_id, email, role, permissions, active')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !admin?.active) {
    return { supabase, user, admin: null };
  }

  // A verified TOTP factor makes the second step mandatory for server-side
  // CRM access. This must also be enforced at RLS/API level before launch.
  const { data: assurance, error: assuranceError } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  const mfaRequired = Boolean(assuranceError || !assurance || needsMfaChallenge(assurance));
  return { supabase, user, admin: mfaRequired ? null : admin, mfaRequired };
}

export async function requireAdmin() {
  const context = await getAdminContext();

  if (!context.user) redirect('/admin/login');
  if (context.mfaRequired) redirect('/admin/mfa');
  if (!context.admin) redirect('/admin/login?error=unauthorized');
  return context;
}

export async function requirePermission(permission) {
  const context = await requireAdmin();
  if (!hasPermission(context.admin, permission)) {
    redirect('/admin/sin-permisos');
  }
  return context;
}

export async function requireAnyPermission(...permissions) {
  const context = await requireAdmin();
  if (!permissions.some((permission) => hasPermission(context.admin, permission))) {
    redirect('/admin/sin-permisos');
  }
  return context;
}
