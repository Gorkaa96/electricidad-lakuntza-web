import { ArrowRight, Camera, CheckCircle2 } from 'lucide-react';
import Badge from './Badge';
import ProjectCard from './ProjectCard';
import { getFeaturedProjects } from '@/lib/projects';

export default async function ProjectsSection() {
  const featuredProjects = await getFeaturedProjects();
  const hasProjects = featuredProjects.length > 0;

  return (
    <section id="trabajos" className="bg-lakuntza-mist py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Badge>Trabajos realizados</Badge>
            <h2 className="mt-5 text-4xl font-black leading-[.95] tracking-[-.055em] sm:text-6xl">
              Una selección de trabajos para ver cómo trabajamos.
            </h2>
          </div>
          <p className="text-base leading-8 text-neutral-600 lg:col-span-5">
            Esta sección estará destinada a mostrar instalaciones, reformas, telecomunicaciones y trabajos energéticos realizados por Electricidad Lakuntza, con imágenes reales y descripción clara.
          </p>
        </div>

        {hasProjects ? (
          <>
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.slice(0, 3).map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <a href="/trabajos-realizados" className="inline-flex items-center justify-center rounded-2xl bg-neutral-950 px-6 py-4 text-sm font-black text-white transition hover:bg-lakuntza-greenDark">
                Ver todos los trabajos <ArrowRight className="ml-2" size={18} />
              </a>
            </div>
          </>
        ) : (
          <div className="mt-14 rounded-[2.2rem] border border-neutral-200 bg-white p-7 shadow-card sm:p-10">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-3xl bg-[#F3FAEF] text-lakuntza-greenDark">
                  <Camera size={28} />
                </div>
                <h3 className="text-3xl font-black tracking-[-.05em] text-neutral-950">
                  Próximamente, trabajos realizados con imágenes reales.
                </h3>
                <p className="mt-4 text-base leading-8 text-neutral-600">
                  La galería se publicará con fotos propias de trabajos terminados. Preferimos no usar imágenes genéricas: el objetivo es enseñar trabajos reales, bien presentados y con contexto útil para el cliente.
                </p>
              </div>
              <div className="grid gap-3 lg:col-span-5">
                {['Instalaciones eléctricas', 'Cuadros eléctricos', 'Telecomunicaciones', 'Porteros y videoporteros'].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm font-black text-neutral-800">
                    <CheckCircle2 className="shrink-0 text-lakuntza-green" size={18} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
