import AdminShell from '@/components/admin/AdminShell';
import AdminNotice from '@/components/admin/AdminNotice';
import { requireAdmin } from '@/lib/admin';

export const metadata = {
  title: 'Trabajos',
  robots: { index: false, follow: false },
};

export const revalidate = 0;

export default async function AdminProjectsPage({ searchParams }) {
  const { supabase } = await requireAdmin();
  const { data: projects = [] } = await supabase
    .from('projects')
    .select('id, slug, title, category, location, year, featured, published, sort_order, created_at')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  const published = projects.filter((project) => project.published).length;
  const drafts = projects.length - published;
  const featured = projects.filter((project) => project.featured).length;

  return (
    <AdminShell
      title="Trabajos"
      description="Trabajos realizados que se muestran en la web pública. Mantén solo ejemplos reales, claros y bien presentados."
      action={<a href="/admin/proyectos/nuevo" className="rounded-xl bg-[#24662D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-lakuntza-greenDark">Nuevo trabajo</a>}
    >
      <AdminNotice success={searchParams?.success} error={searchParams?.error} />

      <section className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-semibold text-neutral-500">Publicados</p>
          <p className="mt-2 text-3xl font-black tracking-[-0.06em] text-neutral-950">{published}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-semibold text-neutral-500">Borradores</p>
          <p className="mt-2 text-3xl font-black tracking-[-0.06em] text-neutral-950">{drafts}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-semibold text-neutral-500">En portada</p>
          <p className="mt-2 text-3xl font-black tracking-[-0.06em] text-neutral-950">{featured}</p>
        </div>
      </section>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        {projects.length > 0 ? (
          <div className="divide-y divide-neutral-200">
            {projects.map((project) => (
              <a key={project.id} href={`/admin/proyectos/${project.id}`} className="grid gap-4 p-5 transition hover:bg-neutral-50 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${project.published ? 'bg-[#F3FAEF] text-lakuntza-greenDark' : 'bg-neutral-100 text-neutral-500'}`}>
                      {project.published ? 'Publicado' : 'Borrador'}
                    </span>
                    {project.featured ? <span className="rounded-full bg-neutral-950 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-white">Portada</span> : null}
                  </div>
                  <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-neutral-950">{project.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-neutral-500">
                    {project.category} · {project.location || 'Sin ubicación'} {project.year ? `· ${project.year}` : ''}
                  </p>
                </div>
                <div className="text-sm font-black text-lakuntza-greenDark">Editar</div>
              </a>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-neutral-950">Aún no hay trabajos.</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">Crea el primer trabajo cuando tengas texto e imágenes revisadas.</p>
            <a href="/admin/proyectos/nuevo" className="mt-6 inline-flex rounded-xl bg-[#24662D] px-5 py-3 text-sm font-semibold text-white">Crear trabajo</a>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
