import { ArrowRight, CheckCircle2, FileText, Leaf, Mail, MessageCircle, Phone, ShieldCheck, Wrench, Zap } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Badge from '@/components/Badge';
import FenieEnergySection from '@/components/FenieEnergySection';
import ProjectsSection from '@/components/ProjectsSection';
import MobileContactBar from '@/components/MobileContactBar';

export const metadata = {
  title: 'Luz, gas y alarmas con atención directa',
  description: 'Revisamos tu factura de luz o gas y te informamos sobre alarmas Movistar Prosegur a través de Feníe Energía. Instalaciones eléctricas y telecomunicaciones.',
  alternates: { canonical: '/' },
};

const generalWhatsapp = 'https://wa.me/34649853448?text=' + encodeURIComponent('Hola Electricidad Lakuntza. Quiero hacer una consulta desde la web.');

const routes = [
  {
    icon: Zap,
    label: 'Luz y gas',
    title: '¿Pagas lo adecuado por tu energía?',
    text: 'Envíanos tu factura en foto o PDF. Revisamos las condiciones y valoramos si una propuesta de Feníe Energía te conviene.',
    href: '/revision-factura-luz-gas',
    action: 'Revisar mi factura',
  },
  {
    icon: ShieldCheck,
    label: 'Alarmas',
    title: 'Movistar Prosegur Alarmas',
    text: 'Información y acompañamiento comercial para soluciones de seguridad de viviendas y negocios a través de Feníe Energía.',
    href: '/alarmas-movistar-prosegur',
    action: 'Consultar alarmas',
  },

  {
    icon: Wrench,
    label: 'Electricidad y telecomunicaciones',
    title: 'Instalaciones profesionales',
    text: 'Instalaciones, reformas, cuadros, averías y redes de datos. Trabajos en Navarra y País Vasco, según disponibilidad.',
    href: '/servicios',
    action: 'Ver instalaciones',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white pb-24 text-neutral-950 md:pb-0">
      <Header />
      <main>

        <section id="inicio" className="brand-dark-surface relative isolate overflow-hidden pt-20 text-white">
          <div aria-hidden="true" className="pointer-events-none absolute -right-28 top-16 h-[32rem] w-[32rem] rounded-full border border-white/10 opacity-60" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-52 top-8 h-[46rem] w-[46rem] rounded-full border border-white/5 opacity-50" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:py-28">
            <div className="lg:col-span-7">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[.07] px-4 py-2 text-xs font-bold text-white/85">
                <Leaf size={15} className="text-[#ADEB8D]" aria-hidden="true" /> Empresa delegada de Feníe Energía
              </p>
              <h1 className="mt-8 max-w-3xl text-[clamp(2.7rem,5.4vw,4.9rem)] font-extrabold leading-[1.08] tracking-[-.045em]">
                Luz, gas y alarmas. <span className="text-[#ADEB8D]">Decide con información clara.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/80 sm:text-xl">
                Revisamos tu factura de energía y te orientamos sobre alarmas para tu vivienda o negocio. Atención directa, propuestas explicadas y ninguna obligación de contratar.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-white/80">
                <span className="inline-flex items-center gap-2"><CheckCircle2 size={17} className="shrink-0 text-[#ADEB8D]" aria-hidden="true" /> Revisión energética sin coste</span>
                <span className="inline-flex items-center gap-2"><CheckCircle2 size={17} className="shrink-0 text-[#ADEB8D]" aria-hidden="true" /> Atención personal</span>
              </div>
              <a href="/servicios" className="mt-9 inline-flex items-center gap-2 text-sm font-semibold text-white/85 underline-offset-4 hover:text-white hover:underline">
                ¿Buscas una instalación eléctrica? <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
            <div className="grid gap-4 lg:col-span-5" aria-label="Elige el servicio que necesitas">
              <a href="/revision-factura-luz-gas" className="group block rounded-[1.5rem] border border-white/20 bg-white p-6 text-neutral-950 shadow-2xl shadow-black/10 transition hover:-translate-y-0.5 hover:shadow-black/20 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#ADEB8D] sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EBF6E5] text-lakuntza-greenDark"><FileText size={24} aria-hidden="true" /></span>
                  <ArrowRight size={22} className="text-lakuntza-greenDark transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-[.12em] text-lakuntza-greenDark">Luz y gas</p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-[-.035em]">Revisar mi factura</h2>
                <p className="mt-2 text-sm leading-6 text-neutral-600">Envíanos una factura y valoraremos tus condiciones antes de recomendar nada.</p>
              </a>
              <a href="/alarmas-movistar-prosegur" className="group block rounded-[1.5rem] border border-white/20 bg-white p-6 text-neutral-950 shadow-2xl shadow-black/10 transition hover:-translate-y-0.5 hover:shadow-black/20 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#ADEB8D] sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EBF6E5] text-lakuntza-greenDark"><ShieldCheck size={24} aria-hidden="true" /></span>
                  <ArrowRight size={22} className="text-lakuntza-greenDark transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-[.12em] text-lakuntza-greenDark">Alarmas</p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-[-.035em]">Consultar una alarma</h2>
                <p className="mt-2 text-sm leading-6 text-neutral-600">Consulta las opciones disponibles de Movistar Prosegur Alarmas a través de Feníe Energía.</p>
              </a>
              <p className="px-1 text-xs leading-5 text-white/65">Te informamos de las condiciones aplicables antes de que tomes una decisión.</p>
            </div>
          </div>
        </section>

        <section id="servicios" className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <Badge>Servicios</Badge>
              <h2 className="mt-5 text-3xl font-black leading-tight tracking-[-.045em] sm:text-5xl">Elige cómo podemos ayudarte.</h2>
              <p className="mt-4 text-base leading-7 text-neutral-600">Luz y gas, alarmas e instalaciones. Elige el servicio que buscas y contacta directamente con nosotros.</p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {routes.map((item) => {
                const Icon = item.icon;
                return (
                  <a key={item.label} href={item.href} className="group flex min-w-0 flex-col rounded-[1.5rem] border border-neutral-200 bg-white p-6 shadow-sm transition-colors hover:border-lakuntza-greenDark/40 hover:shadow-md sm:p-7">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0F8EB] text-lakuntza-greenDark"><Icon size={24} /></div>
                    <p className="mt-7 text-xs font-black uppercase tracking-[.12em] text-lakuntza-greenDark">{item.label}</p>
                    <h3 className="mt-3 text-xl font-black leading-tight tracking-[-.03em] text-neutral-950">{item.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-7 text-neutral-600">{item.text}</p>
                    <span className="mt-8 inline-flex items-center gap-2 text-sm font-black text-lakuntza-greenDark">{item.action} <ArrowRight size={17} className="transition group-hover:translate-x-1" /></span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <FenieEnergySection />
        <ProjectsSection />

        <section id="contacto" className="brand-dark-surface scroll-mt-20 py-20 text-white sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:items-center lg:px-8">
            <div className="lg:col-span-7">
              <p className="text-xs font-black uppercase tracking-[.16em] text-[#A9ED82]">Contacto</p>
              <h2 className="mt-5 max-w-2xl text-3xl font-black leading-tight tracking-[-.045em] sm:text-5xl">Hablemos de lo que necesitas.</h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-white/70">Escríbenos o llámanos. Te atendemos directamente, tanto si buscas luz o gas como una alarma o una instalación.</p>
            </div>
            <div className="grid gap-3 lg:col-span-5">
              <a href={generalWhatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-lakuntza-greenDark px-5 py-4 text-sm font-black text-white transition hover:bg-neutral-950"><MessageCircle size={19}/> Consultar por WhatsApp</a>
              <a href="tel:+34649853448" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl border border-white/30 px-5 py-4 text-sm font-black text-white hover:bg-white/10"><Phone size={19}/> Llamar: 649 853 448</a>
              <a href="mailto:eleclakuntza@yahoo.es" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl border border-white/30 px-5 py-4 text-sm font-black text-white hover:bg-white/10"><Mail size={19}/> eleclakuntza@yahoo.es</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileContactBar />
    </div>
  );
}
