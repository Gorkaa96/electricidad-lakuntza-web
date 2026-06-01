import AdminShell from '@/components/admin/AdminShell';
import ProjectForm from '@/components/admin/ProjectForm';
import { requireAdmin } from '@/lib/admin';

export const metadata = {
  title: 'Nuevo proyecto',
  robots: { index: false, follow: false },
};

export default async function NewProjectPage() {
  await requireAdmin();

  return (
    <AdminShell title="Nuevo proyecto" description="Añade un trabajo realizado con texto claro e imágenes reales.">
      <ProjectForm />
    </AdminShell>
  );
}
