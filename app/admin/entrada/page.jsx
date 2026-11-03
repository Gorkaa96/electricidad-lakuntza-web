import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin';
import { canViewLeads, hasPermission } from '@/lib/rolePermissions';

export const metadata = { title: 'Entrar al panel', robots: { index: false, follow: false } };

export default async function AdminEntryPage() {
  const { admin } = await requireAdmin();
  if (canViewLeads(admin)) redirect('/admin/resumen');
  if (hasPermission(admin, 'projects.manage')) redirect('/admin/proyectos');
  if (hasPermission(admin, 'users.manage')) redirect('/admin/usuarios');
  redirect('/admin/sin-permisos');
}
