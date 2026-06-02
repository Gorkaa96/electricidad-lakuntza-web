import AdminShell from '@/components/admin/AdminShell';
import AdminNotice from '@/components/admin/AdminNotice';
import ProjectForm from '@/components/admin/ProjectForm';
import { requireAdmin } from '@/lib/admin';

export const metadata = {
  title: 'Nuevo trabajo',
  robots: { index: false, follow: false },
};

export default async function NewProjectPage({ searchParams }) {
  await requireAdmin();

  return (
    <AdminShell title="Nuevo trabajo" description="Añade un trabajo realizado con texto claro e imágenes reales.">
      <AdminNotice success={searchParams?.success} error={searchParams?.error} />
      <ProjectForm />
    </AdminShell>
  );
}
