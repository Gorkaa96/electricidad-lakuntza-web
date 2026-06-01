import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from './supabase/server';

export async function getAdminContext() {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return { supabase: null, user: null, admin: null };
  }

  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user || null;

  if (!user) {
    return { supabase, user: null, admin: null };
  }

  const { data: admin } = await supabase
    .from('admin_users')
    .select('user_id, email')
    .eq('user_id', user.id)
    .maybeSingle();

  return { supabase, user, admin };
}

export async function requireAdmin() {
  const context = await getAdminContext();

  if (!context.user) {
    redirect('/admin/login');
  }

  if (!context.admin) {
    redirect('/admin/login?error=unauthorized');
  }

  return context;
}
