import AdminShell from '@/components/admin/AdminShell';
import { requireAdmin } from '@/lib/admin';

export const metadata = {
  title: 'Admin proyectos',
  robots: { index: false, follow: false },
};

export const revalidate = 0;

export default async function AdminProjectsPage() {
  const { supabase } = await requireAdmin();
  const { data: projects = [] } = await supabase
    .from('projects')
    .select('id, slug, title, category, location, year, featured, published, sort_order, created_at')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  return (
    <AdminShell
      title="Proyectos"
      description="Gestiona los trabajos realizados que se muestran en la web pública."
      action={<a href="/admin/proyectos/nuevo" className="rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-black text-white transition hover:bg-lakuntza-greenDark">Nuevo proyecto</a>}
    >
      <div className="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-card">
        {projects.length > 0 ? (
          <div className="divide-y divide-neutral-200">
            {projects.map((project) => (
              <a key={project.id} href={`/admin/proyectos/${project.id}`} className="grid gap-4 p-5 transition hover:bg-neutral-50 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] ${project.published ? 'bg-green-50 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>
                      {project.published ? 'Publicado' : 'Borrador'}
                    </span>
                    {project.featured ? <span className="rounded-full bg-[#F3FAEF] px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-lakuntza-greenDark">Destacado</span> : null}
                  </div>
                  <h2 className="mt-3 text-xl font-black tracking-[-0.04em] text-neutral-950">{project.title}</h2>
                  <p className="mt-2 text-sm text-neutral-500">{project.category} · {project.location || 'Sin ubicación'} {project.year ? `· ${project.year}` : ''}</p>
                </div>
                <div className="text-sm font-black text-lakuntza-greenDark">Editar</div>
              </a>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-black tracking-[-0.04em] text-neutral-950">Aún no hay proyectos reales.</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">Crea el primer trabajo realizado cuando tengas imágenes y texto definitivos.</p>
            <a href="/admin/proyectos/nuevo" className="mt-6 inline-flex rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-black text-white">Crear primer proyecto</a>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
