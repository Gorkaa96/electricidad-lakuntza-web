import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, Tag } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Badge from '@/components/Badge';
import { getProjectBySlug } from '@/lib/projects';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    return { title: 'Trabajo no encontrado' };
  }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: `${project.title} | Electricidad Lakuntza`,
      description: project.description,
      images: project.coverImage ? [{ url: project.coverImage.url, alt: project.coverImage.alt }] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }) {
  const project = await getProjectBySlug(params.slug);

  if (!project) notFound();

  const galleryImages = project.images || [];

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <Header />
      <main>
        <section className="relative isolate overflow-hidden bg-neutral-950 pt-32 text-white">
          <div className="hero-grid absolute inset-0 opacity-30" />
          <div className="absolute -right-44 top-12 h-[28rem] w-[28rem] rounded-full bg-lakuntza-green/15 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <a href="/trabajos-realizados" className="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/[.06] px-4 py-2.5 text-sm font-black text-white/70 transition hover:border-lakuntza-green/40 hover:bg-white/[.09] hover:text-white">
                <ArrowLeft className="mr-2" size={17} /> Trabajos realizados
              </a>
              <span className="inline-flex w-fit rounded-full border border-lakuntza-green/30 bg-lakuntza-green/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-lakuntza-green">
                {project.category}
              </span>
            </div>

            <h1 className="max-w-5xl text-5xl font-black leading-[.95] tracking-[-.06em] sm:text-7xl">
              {project.title}
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-white/70">{project.description}</p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm font-black text-white/75">
              {project.location ? <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2"><MapPin size={16} />{project.location}</span> : null}
              {project.year ? <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2"><Calendar size={16} />{project.year}</span> : null}
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2"><Tag size={16} />{project.category}</span>
            </div>
          </div>
        </section>

        <section className="bg-lakuntza-mist py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {project.coverImage ? (
              <div className="overflow-hidden rounded-[2.2rem] border border-neutral-200 bg-white shadow-card">
                <img src={project.coverImage.url} alt={project.coverImage.alt || project.title} className="max-h-[680px] w-full object-cover" />
              </div>
            ) : null}

            <div className="mt-10 grid gap-8 lg:grid-cols-12">
              <article className="rounded-[2rem] border border-neutral-200 bg-white p-7 shadow-card sm:p-10 lg:col-span-7">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-lakuntza-greenDark">Detalle del trabajo</p>
                <div className="mt-5 space-y-5 text-base leading-8 text-neutral-650">
                  {(project.longDescription || project.description)
                    .split('\n')
                    .filter(Boolean)
                    .map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </article>

              <aside className="rounded-[2rem] border border-neutral-200 bg-white p-7 shadow-card sm:p-8 lg:col-span-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-lakuntza-greenDark">Información</p>
                <div className="mt-6 grid gap-3">
                  <div className="rounded-2xl bg-neutral-50 p-4"><p className="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">Categoría</p><p className="mt-1 font-black">{project.category}</p></div>
                  {project.location ? <div className="rounded-2xl bg-neutral-50 p-4"><p className="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">Ubicación</p><p className="mt-1 font-black">{project.location}</p></div> : null}
                  {project.year ? <div className="rounded-2xl bg-neutral-50 p-4"><p className="text-xs font-black uppercase tracking-[0.14em] text-neutral-400">Año</p><p className="mt-1 font-black">{project.year}</p></div> : null}
                </div>
              </aside>
            </div>

            {galleryImages.length > 1 ? (
              <section className="mt-12">
                <div className="mb-6 flex items-end justify-between gap-6">
                  <div>
                    <Badge>Galería</Badge>
                    <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-neutral-950 sm:text-4xl">Más imágenes del trabajo</h2>
                  </div>
                </div>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {galleryImages.slice(1).map((image, index) => (
                    <img key={`${image.url}-${index}`} src={image.url} alt={image.alt || project.title} className="aspect-[4/3] w-full rounded-[1.6rem] border border-neutral-200 object-cover shadow-card" />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
