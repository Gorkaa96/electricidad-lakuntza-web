import { ArrowRight, Leaf, PlugZap, Wifi } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Badge from '@/components/Badge';
import MobileContactBar from '@/components/MobileContactBar';
import { servicePages } from '@/lib/servicePages';

export const metadata = {
  title: 'Servicios',
  description:
    'Servicios de Electricidad Lakuntza: instalaciones eléctricas, telecomunicaciones y asesoría energética en Navarra y País Vasco.',
};

const iconBySlug = {
  'instalaciones-electricas': PlugZap,
  telecomunicaciones: Wifi,
  'asesoria-energetica-luz-gas': Leaf,
};

export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-white pb-24 text-neutral-950 md:pb-0">
      <Header />
      <main>
        <section className="relative isolate overflow-hidden bg-neutral-950 pt-32 text-white">
          <div className="hero-grid absolute inset-0 opacity-30" />
          <div className="absolute -right-44 top-12 h-[28rem] w-[28rem] rounded-full bg-lakuntza-green/15 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
            <Badge dark>Servicios</Badge>
            <h1 className="mt-6 max-w-5xl text-5xl font-black leading-[.95] tracking-[-.06em] sm:text-7xl">
              Electricidad, telecomunicaciones y energía con trato directo.
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-white/75">
              Soluciones para viviendas, comunidades, comercios y pequeñas empresas en Navarra y País Vasco.
            </p>
          </div>
        </section>

        <section className="bg-lakuntza-mist py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-3">
              {servicePages.map((service) => {
                const Icon = iconBySlug[service.slug] || PlugZap;
                return (
                  <a key={service.slug} href={`/servicios/${service.slug}`} className="group rounded-[2rem] border border-neutral-200 bg-white p-7 shadow-card transition hover:-translate-y-1 hover:border-lakuntza-green/40 hover:shadow-2xl">
                    <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F3FAEF] text-lakuntza-greenDark">
                      <Icon size={30} />
                    </div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-lakuntza-greenDark">{service.eyebrow}</p>
                    <h2 className="mt-3 text-2xl font-black tracking-[-.04em] text-neutral-950">{service.title}</h2>
                    <p className="mt-4 text-sm leading-7 text-neutral-600">{service.intro}</p>
                    <span className="mt-6 inline-flex items-center text-sm font-black text-lakuntza-greenDark">
                      Ver servicio <ArrowRight className="ml-2 transition group-hover:translate-x-1" size={17} />
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileContactBar />
    </div>
  );
}
