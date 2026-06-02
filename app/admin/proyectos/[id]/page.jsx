import { notFound } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import AdminNotice from '@/components/admin/AdminNotice';
import ProjectForm from '@/components/admin/ProjectForm';
import { requireAdmin } from '@/lib/admin';

export const metadata = {
  title: 'Editar trabajo',
  robots: { index: false, follow: false },
};

export const revalidate = 0;

export default async function EditProjectPage({ params, searchParams }) {
  const { supabase } = await requireAdmin();
  const { data: project } = await supabase
    .from('projects')
    .select('*, project_images(*)')
    .eq('id', params.id)
    .maybeSingle();

  if (!project) notFound();

  return (
    <AdminShell title="Editar trabajo" description="Revisa el contenido antes de publicarlo en la web.">
      <AdminNotice success={searchParams?.success} error={searchParams?.error} />
      <ProjectForm project={project} />
    </AdminShell>
  );
}
