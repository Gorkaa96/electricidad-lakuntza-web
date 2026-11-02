import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from './supabase/server';
import { hasPermission } from './rolePermissions';

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

  return { supabase, user, admin };
}

export async function requireAdmin() {
  const context = await getAdminContext();

  if (!context.user) redirect('/admin/login');
  if (!context.admin) redirect('/admin/login?error=unauthorized');
  return context;
}

export async function requirePermission(permission) {
  const context = await requireAdmin();
  if (!hasPermission(context.admin, permission)) {
    redirect('/admin/facturas?error=unauthorized');
  }
  return context;
}

export async function requireAnyPermission(...permissions) {
  const context = await requireAdmin();
  if (!permissions.some((permission) => hasPermission(context.admin, permission))) {
    redirect('/admin/login?error=unauthorized');
  }
  return context;
}
