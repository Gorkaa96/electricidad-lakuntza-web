import AdminShell from '@/components/admin/AdminShell';
import AdminNotice from '@/components/admin/AdminNotice';
import ProjectForm from '@/components/admin/ProjectForm';
import { requirePermission } from '@/lib/admin';

export const metadata = {
  title: 'Nuevo trabajo',
  robots: { index: false, follow: false },
};

export default async function NewProjectPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  await requirePermission('projects.manage');

  return (
    <AdminShell title="Nuevo trabajo" description="Añade un trabajo realizado con texto claro e imágenes reales.">
      <AdminNotice success={resolvedSearchParams?.success} error={resolvedSearchParams?.error} />
      <ProjectForm />
    </AdminShell>
  );
}
