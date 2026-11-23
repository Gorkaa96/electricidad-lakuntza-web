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

  // Check AAL BEFORE any database lookup. After the RLS rollout an aal1
  // session with an enrolled factor cannot SELECT admin_users; checking
  // membership first would accidentally send it to the unauthorized screen.
  if (process.env.CRM_MFA_ROLLOUT_ENABLED === 'true') {
    const { data: assurance, error: assuranceError } =
      await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    const mfaRequired = Boolean(assuranceError || !assurance || needsMfaChallenge(assurance));
    if (mfaRequired) return { supabase, user, admin: null, mfaRequired: true };
  }

  const { data: admin, error } = await supabase
    .from('admin_users')
    .select('user_id, email, role, permissions, active')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !admin?.active) {
    return { supabase, user, admin: null, mfaRequired: false };
  }

  return { supabase, user, admin, mfaRequired: false };
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
