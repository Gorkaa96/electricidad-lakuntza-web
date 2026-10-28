import { ArrowRight, CheckCircle2, FileText, Leaf, Mail, MessageCircle, Phone, ShieldCheck, Wrench, Zap } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Badge from '@/components/Badge';
import FenieEnergySection from '@/components/FenieEnergySection';
import ProjectsSection from '@/components/ProjectsSection';
import MobileContactBar from '@/components/MobileContactBar';

export const metadata = {
  title: 'Revisión gratuita de luz y gas',
  description: 'Revisamos gratuitamente tu factura de luz o gas y valoramos alternativas de Feníe Energía sin compromiso. Instalaciones eléctricas y otros servicios profesionales.',
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
    action: 'Revisión gratuita',
  },
  {
    icon: Wrench,
    label: 'Electricidad y telecomunicaciones',
    title: 'Instalaciones y mantenimiento',
    text: 'Instalaciones, reformas, cuadros, averías y telecomunicaciones. Atendemos trabajos en Navarra y País Vasco según disponibilidad.',
    href: '/servicios',
    action: 'Ver servicios técnicos',
  },
  {
    icon: ShieldCheck,
    label: 'Alarmas',
    title: 'Movistar Prosegur Alarmas',
    text: 'Información y acompañamiento comercial para soluciones de seguridad de viviendas y negocios a través de Feníe Energía.',
    href: '/alarmas-movistar-prosegur',
    action: 'Consultar alarmas',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white pb-24 text-neutral-950 md:pb-0">
      <Header />
      <main>
        <section id="inicio" className="relative isolate overflow-hidden bg-[#121915] pt-20 text-white">
          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
            <div className="max-w-4xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-black uppercase tracking-[.12em] text-white/85">
                <Leaf size={15} className="text-[#A9ED82]" /> Agentes energéticos de Feníe Energía
              </p>
              <h1 className="mt-9 max-w-4xl text-[clamp(2.5rem,5.7vw,4.9rem)] font-extrabold leading-[1.08] tracking-[-.045em]">
                Revisamos tu factura de luz o gas. <span className="text-[#A9ED82]">Gratis y sin compromiso.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/80 sm:text-xl">
                Envíanos tu última factura en foto o PDF. Revisamos tus condiciones actuales y te explicamos si una alternativa de Feníe Energía puede interesarte. Si te conviene seguir como estás, también te lo diremos.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href="/revision-factura-luz-gas" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-lakuntza-greenDark px-6 py-4 text-sm font-black text-white transition hover:bg-neutral-950">
                  <FileText size={19} /> Revisar mi factura gratis <ArrowRight size={17} />
                </a>
                <a href="/servicios" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 py-4 text-sm font-black text-white transition hover:bg-white/20">
                  <Wrench size={19} /> Ver instalaciones <ArrowRight size={17} />
                </a>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-7 gap-y-2 text-sm font-medium text-white/75">
                <span className="inline-flex items-center gap-2"><CheckCircle2 size={17} className="text-[#A9ED82]" /> Revisión gratuita</span>
                <span className="inline-flex items-center gap-2"><CheckCircle2 size={17} className="text-[#A9ED82]" /> Atención personal</span>
                <span className="inline-flex items-center gap-2"><CheckCircle2 size={17} className="text-[#A9ED82]" /> Sin obligación de contratar</span>
              </div>
              <a href="/alarmas-movistar-prosegur" className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-white/85 underline-offset-4 hover:text-white hover:underline">También te orientamos sobre alarmas Movistar Prosegur <ArrowRight size={16} /></a>
            </div>
          </div>
        </section>

        <section id="servicios" className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <Badge>Servicios</Badge>
              <h2 className="mt-5 text-3xl font-black leading-tight tracking-[-.045em] sm:text-5xl">Elige cómo podemos ayudarte.</h2>
              <p className="mt-4 text-base leading-7 text-neutral-600">Revisión de energía, instalaciones o alarmas: cada servicio tiene su propio recorrido, sin distracciones.</p>
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

        <section id="contacto" className="scroll-mt-20 bg-neutral-950 py-20 text-white sm:py-24">
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
