import { ArrowRight, BatteryCharging, FileText, Lightbulb, ShieldCheck, TrendingDown } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileContactBar from '@/components/MobileContactBar';
import { commercialCatalog } from '@/lib/commercialCatalog';

export const metadata = {
  title: 'Servicios de luz, gas, alarmas y movilidad',
  description: 'Luz, gas, alarmas Movistar Prosegur, cargadores eléctricos y asesoría energética con Electricidad Lakuntza y Feníe Energía. Consulta sin compromiso.',
  alternates: { canonical: '/servicios' },
};

const icons = { luz: Lightbulb, gas: FileText, alarmas: ShieldCheck, cargadores: BatteryCharging, asesoria: TrendingDown };

export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-white pb-24 text-neutral-950 md:pb-0">
      <Header />
      <main id="contenido-principal">
        <section className="brand-dark-surface pt-20 text-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <p className="text-sm font-semibold text-[#B6E6A4]">Electricidad Lakuntza · Servicios</p>
            <h1 className="mt-6 max-w-4xl text-[clamp(2.9rem,5.5vw,5.3rem)] font-semibold leading-[1.04] tracking-[-.055em]">
              Energía, seguridad y movilidad. Sin complicaciones.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/80">
              Nos centramos en cinco soluciones: luz, gas, alarmas, cargadores eléctricos y asesoría energética. Te orientamos, estudiamos tu caso y te explicamos las condiciones reales.
            </p>
          </div>
        </section>

        <section className="bg-[#F5F8F4] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 max-w-2xl">
              <p className="text-sm font-semibold text-[#2E7136]">Qué ofrecemos</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Elige cómo podemos ayudarte.</h2>
              <p className="mt-5 text-base leading-8 text-neutral-600">Comparamos las condiciones disponibles dentro del catálogo de Feníe Energía y revisamos los presupuestos de instalación caso a caso. No anunciamos precios sin confirmarlos.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {commercialCatalog.map((service) => {
                const Icon = icons[service.slug] || Lightbulb;
                return (
                  <a href={service.href} key={service.slug} className="group rounded-2xl border border-[#DEE9DC] bg-white p-7 transition-colors hover:border-[#82B283] hover:bg-[#FCFEFB] sm:p-9">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F3E4] text-[#286B2C]"><Icon size={23} aria-hidden="true"/></div>
                    <p className="mt-7 text-xs font-semibold uppercase tracking-[.12em] text-[#327837]">{service.eyebrow}</p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-[-.035em]">{service.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-neutral-600">{service.description}</p>
                    <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#28632D]">{service.action}<ArrowRight size={17} aria-hidden="true" className="transition-transform group-hover:translate-x-1"/></span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-t border-[#DFE7DC] bg-white py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:items-center lg:px-8">
            <div className="lg:col-span-7">
              <h2 className="text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Una propuesta adecuada empieza por conocer tu caso.</h2>
              <p className="mt-5 text-base leading-8 text-neutral-600">Las tarifas pueden ser fijas o indexadas, las alarmas tienen condiciones de elegibilidad y los cargadores se presupuestan según la instalación. Antes de contratar, te explicaremos lo aplicable a tu situación.</p>
            </div>
            <div className="lg:col-span-5">
              <a href="/#contacto" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#24662D] px-6 py-4 text-sm font-semibold text-white hover:bg-[#194D20]">Consultar sin compromiso<ArrowRight size={18} aria-hidden="true"/></a>
              <p className="mt-4 text-xs leading-6 text-neutral-500">La consulta no implica contratación, presupuesto aceptado ni reserva de instalación.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileContactBar />
    </div>
  );
}
