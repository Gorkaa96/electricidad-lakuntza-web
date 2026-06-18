import { ArrowRight, FileText, Leaf, PlugZap, Wifi } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Badge from '@/components/Badge';
import MobileContactBar from '@/components/MobileContactBar';
import { servicePages } from '@/lib/servicePages';

export const metadata = {
  title: 'Servicios',
  description:
    'Servicios de Electricidad Lakuntza: revisión de facturas de luz y gas, instalaciones eléctricas y telecomunicaciones en Navarra y País Vasco.',
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
          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 sm:px-6 lg:grid-cols-12 lg:items-end lg:px-8">
            <div className="lg:col-span-8">
              <Badge dark>Servicios</Badge>
              <h1 className="mt-6 max-w-5xl text-5xl font-black leading-[.95] tracking-[-.06em] sm:text-7xl">
                Revisión de facturas, electricidad y telecomunicaciones.
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-white/75">
                El primer paso recomendado es subir una factura de luz o gas. Es gratis, rápido y permite detectar oportunidades sin visita inicial.
              </p>
            </div>
            <div className="lg:col-span-4">
              <div className="rounded-[2rem] border border-lakuntza-green/20 bg-lakuntza-green/10 p-7">
                <FileText className="mb-5 text-lakuntza-green" size={32} />
                <h2 className="text-2xl font-black tracking-[-0.04em]">Sube tu factura gratis</h2>
                <p className="mt-3 text-sm leading-6 text-white/70">Revisamos luz, gas, potencia, consumo y servicios añadidos. Sin compromiso.</p>
                <a href="/revision-factura-luz-gas" className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-lakuntza-green px-5 py-3 text-sm font-black text-white shadow-green transition hover:bg-lakuntza-greenDark">
                  Revisar factura <ArrowRight className="ml-2" size={17} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-lakuntza-mist py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 rounded-[2rem] border border-lakuntza-green/20 bg-white p-6 shadow-card sm:p-8">
              <div className="grid gap-5 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-8">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-lakuntza-greenDark">Revisión gratuita</p>
                  <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-neutral-950">Empieza por una factura de luz o gas.</h2>
                  <p className="mt-4 text-sm leading-7 text-neutral-600">Con una factura podemos revisar consumo, potencia, condiciones y servicios añadidos. Después te explicamos si merece la pena mejorar algo o si conviene mantener lo actual.</p>
                </div>
                <div className="lg:col-span-4">
                  <a href="/revision-factura-luz-gas" className="inline-flex w-full items-center justify-center rounded-2xl bg-neutral-950 px-5 py-4 text-sm font-black text-white transition hover:bg-lakuntza-greenDark">
                    Subir factura ahora <ArrowRight className="ml-2" size={17} />
                  </a>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {servicePages.map((service) => {
                const Icon = iconBySlug[service.slug] || PlugZap;
                const href = service.slug === 'asesoria-energetica-luz-gas' ? '/revision-factura-luz-gas' : `/servicios/${service.slug}`;
                return (
                  <a key={service.slug} href={href} className="group rounded-[2rem] border border-neutral-200 bg-white p-7 shadow-card transition hover:-translate-y-1 hover:border-lakuntza-green/40 hover:shadow-2xl">
                    <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F3FAEF] text-lakuntza-greenDark">
                      <Icon size={30} />
                    </div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-lakuntza-greenDark">{service.eyebrow}</p>
                    <h2 className="mt-3 text-2xl font-black tracking-[-.04em] text-neutral-950">{service.title}</h2>
                    <p className="mt-4 text-sm leading-7 text-neutral-600">{service.intro}</p>
                    <span className="mt-6 inline-flex items-center text-sm font-black text-lakuntza-greenDark">
                      {service.slug === 'asesoria-energetica-luz-gas' ? 'Subir factura' : 'Ver servicio'} <ArrowRight className="ml-2 transition group-hover:translate-x-1" size={17} />
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
