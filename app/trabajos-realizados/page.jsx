import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Badge from '@/components/Badge';
import ProjectCard from '@/components/ProjectCard';
import { Camera, CheckCircle2 } from 'lucide-react';
import { publishedProjects, projectCategories } from '@/lib/projects';

export const metadata = {
  title: 'Trabajos realizados',
  description:
    'Trabajos realizados por Electricidad Lakuntza: instalaciones eléctricas, telecomunicaciones, porteros, videoporteros, cuadros eléctricos y asesoría energética en Navarra y País Vasco.',
};

export default function TrabajosRealizadosPage() {
  const hasProjects = publishedProjects.length > 0;

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <Header />
      <main>
        <section className="bg-neutral-950 pt-32 text-white">
          <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
            <Badge dark>Trabajos realizados</Badge>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[.95] tracking-[-.06em] sm:text-7xl">
              Instalaciones y trabajos para clientes reales.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70">
              Selección de trabajos de electricidad, telecomunicaciones y energía realizados por Electricidad Lakuntza en Navarra y País Vasco.
            </p>
          </div>
        </section>

        <section className="bg-lakuntza-mist py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {hasProjects ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {publishedProjects.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            ) : (
              <div className="rounded-[2.2rem] border border-neutral-200 bg-white p-7 shadow-card sm:p-10">
                <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                  <div className="lg:col-span-7">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-3xl bg-[#F3FAEF] text-lakuntza-greenDark">
                      <Camera size={28} />
                    </div>
                    <h2 className="text-4xl font-black leading-[.95] tracking-[-.055em] text-neutral-950 sm:text-5xl">
                      Galería en preparación.
                    </h2>
                    <p className="mt-5 text-base leading-8 text-neutral-600">
                      Esta página está preparada para mostrar trabajos reales con imágenes propias. En cuanto se añadan los primeros proyectos desde el sistema de gestión, aparecerán aquí de forma ordenada.
                    </p>
                  </div>
                  <div className="grid gap-3 lg:col-span-5">
                    {projectCategories.slice(0, 6).map((item) => (
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
      </main>
      <Footer />
    </div>
  );
}
