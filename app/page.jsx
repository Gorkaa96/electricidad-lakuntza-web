import { ArrowRight, BatteryCharging, FileText, Mail, MessageCircle, Phone, ShieldCheck, TrendingDown } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FenieEnergySection from '@/components/FenieEnergySection';
import { commercialCatalog } from '@/lib/commercialCatalog';
import MobileContactBar from '@/components/MobileContactBar';

export const metadata = {
  title: 'Luz, gas, alarmas, cargadores y asesoría energética',
  description: 'Luz, gas, alarmas, cargadores eléctricos y asesoría energética con Electricidad Lakuntza, como agente de Feníe Energía.',
  alternates: { canonical: '/' },
};

const whatsappHref = 'https://wa.me/34649853448?text=' + encodeURIComponent('Hola Electricidad Lakuntza. Quiero hacer una consulta desde la web.');

const process = [
  {
    title: 'Cuéntanos qué necesitas',
    description: 'Escríbenos para valorar tu suministro, una alarma o un cargador eléctrico.',
  },
  {
    title: 'Revisamos tu caso',
    description: 'Estudiamos las condiciones aplicables y aclaramos cualquier dato que falte.',
  },
  {
    title: 'Decides con información',
    description: 'Te explicamos la propuesta antes de cualquier contratación. Sin compromisos por consultar.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white pb-24 text-neutral-950 md:pb-0">
      <Header />
      <main id="contenido-principal">
        <section id="inicio" className="brand-dark-surface relative isolate overflow-hidden pt-20 text-white">
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
            <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
              <div className="min-w-0 lg:col-span-7">
                <div className="flex items-center gap-3 text-sm font-medium text-white/70">
                  <span aria-hidden="true" className="h-[2px] w-8 bg-[#9CDD81]" />
                  Electricidad Lakuntza <span aria-hidden="true" className="text-white/40">·</span> <span className="text-[#B7F0A5]">Agentes de Feníe Energía</span>
                </div>
                <h1 className="mt-8 max-w-[12ch] text-[clamp(2.9rem,6vw,5.6rem)] font-semibold leading-[1.02] tracking-[-.058em]">
                  Energía y seguridad, con criterio.
                </h1>
                <p className="mt-8 max-w-xl text-lg leading-[1.75] text-white/80 sm:text-xl">
                  Luz, gas, alarmas, cargadores eléctricos y asesoría energética. Te ayudamos a encontrar una solución adecuada para tu hogar o negocio, con condiciones claras y trato directo.
                </p>
                <p className="mt-6 max-w-xl text-sm leading-6 text-white/75">Trabajamos como agentes de Feníe Energía para ayudarte con luz, gas y soluciones relacionadas. <a href="#fenie" className="font-semibold text-[#B7F0A5] underline decoration-[#8CCB79] underline-offset-4 hover:text-white">Descubre qué es Feníe</a>.</p>
                <div className="mt-9 flex flex-wrap gap-4 text-sm font-semibold">
                  <a href="/cargadores-electricos" className="inline-flex items-center gap-2 text-white underline decoration-[#9CDD81] decoration-2 underline-offset-8 transition-colors hover:text-[#B4F19B]"><BatteryCharging size={17} aria-hidden="true" /> Cargadores eléctricos</a>
                  <a href="/asesoria-energetica" className="inline-flex items-center gap-2 text-white underline decoration-[#9CDD81] decoration-2 underline-offset-8 transition-colors hover:text-[#B4F19B]"><TrendingDown size={17} aria-hidden="true" /> Asesoría energética</a>
                </div>
              </div>
              <div className="min-w-0 lg:col-span-5">
                <div className="overflow-hidden rounded-[1.35rem] border border-white/20 bg-white text-[#152017] shadow-[0_28px_85px_rgba(0,0,0,.18)]">
                  <div className="border-b border-[#DFE9DD] px-6 py-5 sm:px-8">
                    <p className="text-sm font-semibold text-[#38503F]">¿En qué podemos ayudarte?</p>
                  </div>
                  <a href="/revision-factura-luz-gas" className="group flex items-start gap-4 border-b border-[#DFE9DD] p-6 transition-colors hover:bg-[#F2F8EF] sm:p-8">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8F3E4] text-[#286B2C]">
                      <FileText size={22} aria-hidden="true"/>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-[#316C35]">Luz y gas</span>
                      <span className="mt-2 block text-2xl font-semibold leading-tight tracking-[-.035em]">Revisar mi factura</span>
                      <span className="mt-3 block text-sm leading-6 text-[#536257]">Comprobamos tus condiciones y te explicamos si merece la pena cambiar.</span>
                    </span>
                    <ArrowRight size={20} aria-hidden="true" className="mt-2 shrink-0 text-[#316C35] transition-transform group-hover:translate-x-1"/>
                  </a>
                  <a href="/alarmas-movistar-prosegur" className="group flex items-start gap-4 p-6 transition-colors hover:bg-[#F2F8EF] sm:p-8">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8F3E4] text-[#286B2C]">
                      <ShieldCheck size={22} aria-hidden="true"/>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-[#316C35]">Alarmas</span>
                      <span className="mt-2 block text-2xl font-semibold leading-tight tracking-[-.035em]">Consultar una alarma</span>
                      <span className="mt-3 block text-sm leading-6 text-[#536257]">Conoce las soluciones de Movistar Prosegur y sus condiciones actuales.</span>
                    </span>
                    <ArrowRight size={20} aria-hidden="true" className="mt-2 shrink-0 text-[#316C35] transition-transform group-hover:translate-x-1"/>
                  </a>
                </div>
                <p className="mt-4 text-center text-xs leading-5 text-white/60">Una consulta no supone contratación ni compromiso.</p>
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Feníe Energía y Electricidad Lakuntza" className="border-b border-[#D9E6D5] bg-[#F1F7EE]">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#286B2C]"><ShieldCheck size={20} aria-hidden="true" /></span>
              <p className="text-sm leading-6 text-[#305038]"><strong className="font-semibold text-[#173E20]">Agentes de Feníe Energía.</strong> Te atendemos desde Electricidad Lakuntza.</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pl-[3.25rem] text-sm font-semibold md:pl-0">
              <a href="#fenie" className="text-[#235D2B] underline underline-offset-4 hover:text-[#123E1B]">¿Qué es Feníe?</a>
              <a href="https://www.fenieenergia.es/es" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[#235D2B] hover:text-[#123E1B]">Web oficial <ArrowRight size={15} aria-hidden="true" /></a>
            </div>
          </div>
        </section>

        <section id="como-trabajamos" className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-4">
                <h2 className="max-w-sm text-3xl font-semibold leading-tight tracking-[-.04em] sm:text-4xl">Un proceso sencillo, de principio a fin.</h2>
                <p className="mt-5 max-w-sm text-base leading-7 text-neutral-600">Sin promesas de ahorro automáticas ni presupuestos inventados. Revisamos cada necesidad personalmente.</p>
              </div>
              <ol className="grid gap-0 border-t border-neutral-200 lg:col-span-8">
                {process.map((step, index) => (
                  <li key={step.title} className="grid gap-3 border-b border-neutral-200 py-6 sm:grid-cols-[2.5rem_1fr] sm:gap-5">
                    <span aria-hidden="true" className="mt-1 text-sm font-semibold tabular-nums text-[#387B39]">{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className="text-lg font-semibold tracking-[-.025em] text-neutral-950">{step.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-neutral-600">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="servicios-comerciales" className="bg-[#F5F8F4] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-[#2E7136]">Qué podemos hacer por ti</p>
              <h2 className="mt-5 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Cinco soluciones, una atención cercana.</h2>
              <p className="mt-5 text-base leading-8 text-neutral-600">Desde estudiar tu energía hasta valorar una alarma o un punto de recarga. Confirma las condiciones de cada servicio con nosotros antes de contratar.</p>
            </div>
            <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {commercialCatalog.map((service) => (
                <a href={service.href} key={service.slug} className="group rounded-2xl border border-[#DEE9DC] bg-white p-7 transition-colors hover:border-[#82B283] hover:bg-[#FBFDF9]">
                  <p className="text-xs font-semibold uppercase tracking-[.12em] text-[#327837]">{service.eyebrow}</p>
                  <h3 className="mt-4 text-xl font-semibold tracking-[-.025em]">{service.title}</h3>
                  <p className="mt-3 min-h-20 text-sm leading-7 text-neutral-600">{service.description}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#28632D]">{service.action}<ArrowRight size={17} aria-hidden="true" className="transition-transform group-hover:translate-x-1" /></span>
                </a>
              ))}
            </div>
          </div>
        </section>
        <FenieEnergySection />

        <section id="contacto" className="scroll-mt-20 border-t border-[#D8E7D6] bg-[#F0F6ED] py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
            <div className="lg:col-span-7">
              <h2 className="max-w-xl text-4xl font-semibold tracking-[-.045em] text-[#152017] sm:text-5xl">Hablemos de lo que necesitas.</h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-[#516051]">Consulta sobre luz, gas, alarmas, cargadores eléctricos o asesoría energética. Te explicaremos las opciones y condiciones reales.</p>
            </div>
            <div className="grid gap-3 lg:col-span-5">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-[#245E2A] px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#164B20]">
                <MessageCircle size={19} aria-hidden="true"/> Escribir por WhatsApp
              </a>
              <a href="tel:+34649853448" className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl border border-[#A5BDA1] bg-white px-6 py-4 text-sm font-semibold text-[#204E24] transition-colors hover:bg-[#E4EFE0]">
                <Phone size={19} aria-hidden="true"/> Llamar: 649 853 448
              </a>
              <a href="mailto:eleclakuntza@yahoo.es" className="inline-flex min-h-12 items-center justify-center gap-2 break-all py-2 text-sm font-medium text-[#285B2D] underline underline-offset-4 hover:text-[#102F18]">
                <Mail size={17} aria-hidden="true"/> eleclakuntza@yahoo.es
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileContactBar />
    </div>
  );
}
