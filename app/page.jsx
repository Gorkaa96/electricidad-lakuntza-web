import { ArrowRight, BatteryCharging, FileText, Mail, MessageCircle, Phone, ShieldCheck, TrendingDown } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FenieEnergySection from '@/components/FenieEnergySection';
import { commercialCatalog } from '@/lib/commercialCatalog';
import MobileContactBar from '@/components/MobileContactBar';
import { commercialIntakeReady } from '@/lib/invoice/protection';

export const metadata = {
  title: 'Luz, gas, alarmas, cargadores y asesoría energética',
  description: 'Electricidad Lakuntza: agentes de Feníe Energía para luz y gas, comerciales de alarmas Movistar Prosegur, instalación propia de cargadores y asesoría energética.',
  alternates: { canonical: '/' },
};

const whatsappHref = 'https://wa.me/34649853448?text=' + encodeURIComponent('Hola Electricidad Lakuntza. Quiero hacer una consulta desde la web.');

const process = [
  {
    title: 'Cuéntanos qué necesitas',
    description: 'Cuéntanos qué necesitas: luz y gas, alarmas, cargadores o asesoría.',
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

const heroServices = [
  {
    title: 'Luz y gas',
    description: 'Revisamos tu factura y valoramos las tarifas disponibles.',
    href: '/revision-factura-luz-gas',
    icon: FileText,
  },
  {
    title: 'Alarmas',
    description: 'Consulta soluciones de seguridad para tu hogar o negocio.',
    href: '/alarmas-movistar-prosegur',
    icon: ShieldCheck,
  },
  {
    title: 'Cargadores eléctricos',
    description: 'Solicita un estudio para instalar tu punto de recarga.',
    href: '/cargadores-electricos',
    icon: BatteryCharging,
  },
  {
    title: 'Asesoría energética',
    description: 'Revisamos consumos, potencia y condiciones del contrato.',
    href: '/asesoria-energetica',
    icon: TrendingDown,
  },
];

export default function HomePage() {
  const inquiryReady = commercialIntakeReady();
  return (
    <div className="min-h-screen bg-white pb-24 text-neutral-950 md:pb-0">
      <Header />
      <main id="contenido-principal">
        <section id="inicio" className="relative overflow-hidden border-b border-[#DCE6DE] bg-[#F7FAF6] pt-20">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
            <div className="grid items-center gap-6 sm:gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="min-w-0 lg:col-span-7">
                <p className="hidden text-sm font-semibold text-[#376044] sm:block">Electricidad Lakuntza · Luz, gas, alarmas y cargadores</p>
                <h1 className="max-w-[15ch] text-[2.25rem] font-semibold leading-[1.06] tracking-[-.05em] text-[#173A29] sm:mt-6 sm:text-[clamp(3rem,5.5vw,5rem)]">Tu energía, en buenas manos.</h1>
                <p className="mt-4 max-w-xl text-base leading-6 text-[#526256] sm:mt-6 sm:text-xl sm:leading-8">Luz y gas, alarmas, cargadores y asesoría energética para tu hogar o negocio. Te ayudamos a decidir con información clara.</p>
                <div className="mt-8 hidden flex-wrap gap-3 sm:flex">
                  <a href="/revision-factura-luz-gas" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-[#245E36] px-6 py-3 text-sm font-semibold text-white hover:bg-[#194A28]">Revisar mi factura <ArrowRight size={18} aria-hidden="true"/></a>
                  <a href="#contacto" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#B7CABA] bg-white px-6 py-3 text-sm font-semibold text-[#264F32] hover:bg-[#EDF4EB]">Hablar con el equipo</a>
                </div>
                <p className="mt-6 hidden max-w-lg text-sm leading-6 text-[#5B6B5E] lg:block">Agentes de Feníe Energía para luz y gas. Cargadores y asesoría, directamente con nuestro equipo.</p>
              </div>
              <div className="min-w-0 lg:col-span-5">
                <div className="overflow-hidden rounded-2xl border border-[#C9DCCC] bg-white shadow-[0_12px_35px_rgba(26,67,42,.06)]">
                  <div className="border-b border-[#DFE9DD] bg-[#1C4C32] px-5 py-4 sm:px-6 sm:py-5"><h2 className="text-base font-semibold text-white">¿En qué podemos ayudarte?</h2></div>
                  <div className="divide-y divide-[#E5ECE3]">
                    {heroServices.map(({title,description,href,icon:Icon})=><a key={href} href={href} className="group flex min-h-16 items-center gap-3 px-4 py-3 hover:bg-[#F2F7EF] sm:min-h-[92px] sm:gap-4 sm:px-6 sm:py-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EEF5E9] text-[#32623C]"><Icon size={21} aria-hidden="true"/></span><span className="min-w-0 flex-1"><span className="block text-base font-semibold leading-6 text-[#22482E]">{title}</span><span className="mt-1 hidden text-sm leading-5 text-[#596A5D] sm:block">{description}</span></span><ArrowRight size={17} aria-hidden="true" className="shrink-0 text-[#49764D]"/></a>)}
                  </div>
                </div>
                <p className="mt-3 text-center text-xs leading-5 text-[#647467]">Te orientamos antes de contratar. Tú decides.</p>
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Feníe Energía y Electricidad Lakuntza" className="border-b border-[#D9E6D5] bg-[#F1F7EE]">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#286B2C]"><ShieldCheck size={20} aria-hidden="true" /></span>
              <p className="text-sm leading-6 text-[#305038]"><strong className="font-semibold text-[#173E20]">Agentes de Feníe Energía para luz y gas.</strong> También realizamos instalaciones de cargadores y asesoría propia.</p>
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
                <p className="mt-5 max-w-sm text-base leading-7 text-neutral-600">Revisamos tu caso y te explicamos las condiciones antes de que decidas.</p>
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
              <h2 className="mt-5 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">El servicio que necesitas, con las funciones claras.</h2>
              <p className="mt-5 text-base leading-8 text-neutral-600">Desde estudiar tu energía hasta valorar una alarma o un punto de recarga. Confirma las condiciones de cada servicio con nosotros antes de contratar.</p>
            </div>
            <div className="mt-9 grid gap-4 md:grid-cols-2">
              {[{...commercialCatalog[0], slug:'luz-gas',title:'Luz y gas',description:'Como agentes de Feníe Energía, comparamos sus propuestas en el CRM oficial. El contrato se firma con Feníe Energía.',href:'/revision-factura-luz-gas'}, ...commercialCatalog.slice(2)].map((service) => (
                <a href={service.href} key={service.slug} className="group rounded-2xl border border-[#DEE9DC] bg-white p-7 transition-colors hover:border-[#82B283] hover:bg-[#FBFDF9]">
                  <p className="text-sm font-medium text-[#52725A]">{service.eyebrow}</p>
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
              {inquiryReady ? (
                <a href="/consulta" className="inline-flex min-h-14 items-center justify-center rounded-xl bg-[#245E2A] px-6 py-4 text-sm font-semibold text-white hover:bg-[#164B20]">Enviar consulta desde la web</a>
              ) : null}
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
