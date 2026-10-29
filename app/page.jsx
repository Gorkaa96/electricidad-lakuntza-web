import { ArrowRight, CheckCircle2, FileText, Mail, MessageCircle, Phone, ShieldCheck, Wrench } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FenieEnergySection from '@/components/FenieEnergySection';
import ProjectsSection from '@/components/ProjectsSection';
import MobileContactBar from '@/components/MobileContactBar';

export const metadata = {
  title: 'Luz, gas y alarmas con atención directa',
  description: 'Revisamos facturas de luz y gas y orientamos sobre alarmas Movistar Prosegur a través de Feníe Energía. Instalaciones eléctricas y telecomunicaciones.',
  alternates: { canonical: '/' },
};

const whatsappHref = 'https://wa.me/34649853448?text=' + encodeURIComponent('Hola Electricidad Lakuntza. Quiero hacer una consulta desde la web.');

const process = [
  {
    title: 'Cuéntanos qué necesitas',
    description: 'Envía tu factura para revisar la energía o consulta directamente por una alarma.',
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
                  Electricidad Lakuntza
                </div>
                <h1 className="mt-8 max-w-[12ch] text-[clamp(2.9rem,6vw,5.6rem)] font-semibold leading-[1.02] tracking-[-.058em]">
                  Energía y seguridad, con criterio.
                </h1>
                <p className="mt-8 max-w-xl text-lg leading-[1.75] text-white/80 sm:text-xl">
                  Te ayudamos a revisar tu luz y gas y a conocer las opciones de alarmas para tu hogar o negocio. Trato directo, condiciones claras y decisiones sin presión.
                </p>
                <p className="mt-6 max-w-xl text-sm leading-6 text-white/60">Atención comercial a través de Feníe Energía. Sin obligación de contratar.</p>
                <a href="/servicios" className="mt-9 inline-flex items-center gap-2 text-sm font-semibold text-white underline decoration-[#9CDD81] decoration-2 underline-offset-8 transition-colors hover:text-[#B4F19B]">
                  <Wrench size={16} aria-hidden="true" /> ¿Necesitas una instalación eléctrica?
                </a>
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

        <section id="como-trabajamos" className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-4">
                <h2 className="max-w-sm text-3xl font-semibold leading-tight tracking-[-.04em] sm:text-4xl">Un proceso sencillo, de principio a fin.</h2>
                <p className="mt-5 max-w-sm text-base leading-7 text-neutral-600">Sin comparativas automáticas que prometen ahorros imposibles. Una persona revisa tu consulta.</p>
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

        <FenieEnergySection />
        <ProjectsSection />

        <section id="contacto" className="scroll-mt-20 border-t border-[#D8E7D6] bg-[#F0F6ED] py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
            <div className="lg:col-span-7">
              <h2 className="max-w-xl text-4xl font-semibold tracking-[-.045em] text-[#152017] sm:text-5xl">Hablemos de lo que necesitas.</h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-[#516051]">Consulta sobre luz, gas, alarmas o instalaciones. Te atenderemos directamente y te explicaremos las opciones reales.</p>
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
