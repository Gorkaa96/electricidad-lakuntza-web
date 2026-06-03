import { CheckCircle2, FileText, Home, Leaf, Mail, MapPin, MessageCircle, Phone, ShieldCheck, Wifi, Zap, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Logo from '@/components/Logo';
import Badge from '@/components/Badge';
import InvoiceWhatsAppForm from '@/components/InvoiceWhatsAppForm';
import ContactForm from '@/components/ContactForm';
import FrequentServices from '@/components/FrequentServices';
import ProjectsSection from '@/components/ProjectsSection';
import MobileContactBar from '@/components/MobileContactBar';

const whatsappText = encodeURIComponent('Hola Electricidad Lakuntza. Quiero hacer una consulta desde la web.');
const whatsappHref = `https://wa.me/34649853448?text=${whatsappText}`;
const mapsHref = 'https://www.google.com/maps/search/?api=1&query=Uriz%20Kalea%2027%2031830%20Lakuntza%20Nafarroa';

const services = [
  {
    icon: Zap,
    title: 'Instalaciones eléctricas',
    text: 'Instalaciones, reformas, ampliaciones, cuadros eléctricos, puntos de luz, iluminación, averías y mantenimiento eléctrico.',
    items: ['Reformas eléctricas', 'Cuadros y protecciones', 'Averías, ampliaciones y puntos de luz'],
  },
  {
    icon: Wifi,
    title: 'Telecomunicaciones',
    text: 'Soluciones de conectividad para vivienda, comunidad, comercio y pequeño negocio, con instalación limpia y preparada para durar.',
    items: ['Redes de datos y cableado', 'Antenas y telecomunicaciones', 'Porteros y videoporteros'],
  },
  {
    icon: Leaf,
    title: 'Asesoría energética',
    text: 'Revisión de facturas, potencia contratada y alternativas de luz y gas con atención directa como empresa delegada de Fenie Energía.',
    items: ['Comparación gratuita de factura', 'Luz y gas', 'Acompañamiento en contratación'],
  },
];

const trustItems = [
  {
    icon: Home,
    title: 'Empresa local',
    text: 'Atención cercana desde Lakuntza, con servicio en Navarra y País Vasco.',
  },
  {
    icon: Phone,
    title: 'Trato directo',
    text: 'Hablas con una persona cercana, sin centralitas ni procesos impersonales.',
  },
  {
    icon: ShieldCheck,
    title: 'Trabajo claro',
    text: 'Se revisa la necesidad, se explica la solución y se ejecuta con orden.',
  },
  {
    icon: Leaf,
    title: 'Energía y contratación',
    text: 'Revisión de facturas de luz y gas sin compromiso y con explicación sencilla.',
  },
];

const steps = [
  ['01', 'Escucha', 'Entendemos qué necesitas, el tipo de instalación y la urgencia real.'],
  ['02', 'Diagnóstico', 'Revisamos el trabajo o la factura antes de plantear una solución.'],
  ['03', 'Propuesta', 'Explicamos alcance, opciones y próximos pasos de forma clara.'],
  ['04', 'Ejecución', 'Trabajo ordenado, comunicación directa y comprobación final.'],
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white pb-24 text-neutral-950 md:pb-0">
      <Header />
      <main>
        <section id="inicio" className="relative isolate overflow-hidden bg-[#101411] pt-20 text-white">
          <div className="hero-grid absolute inset-0 opacity-50" />
          <div className="absolute -right-40 top-20 h-[30rem] w-[30rem] rounded-full bg-lakuntza-green/25 blur-3xl" />
          <div className="absolute -left-40 bottom-0 h-[26rem] w-[26rem] rounded-full bg-white/10 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-12 lg:px-8 lg:py-24">
            <div className="lg:col-span-7">
              <div className="flex flex-wrap gap-3">
                <Badge dark><MapPin size={14} /> Lakuntza · Navarra · País Vasco</Badge>
                <Badge dark><ShieldCheck size={14} /> Empresa delegada de Fenie Energía</Badge>
              </div>
              <h1 className="mt-7 max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.06em] sm:text-7xl lg:text-[5.6rem]">
                Instalaciones eléctricas y energía con trato directo.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/75 sm:text-xl">
                Electricidad Lakuntza ofrece instalaciones eléctricas, telecomunicaciones y asesoría energética para viviendas, comunidades, comercios y pequeñas empresas en Navarra y País Vasco.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href="#contacto" className="inline-flex items-center justify-center rounded-2xl bg-lakuntza-green px-6 py-4 text-sm font-black text-white shadow-green transition hover:bg-lakuntza-greenDark">
                  Solicitar presupuesto <ArrowRight className="ml-2" size={18} />
                </a>
                <a href={whatsappHref} className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-sm font-black text-white transition hover:bg-white/15">
                  Escribir por WhatsApp
                </a>
                <a href="#energia" className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-sm font-black text-white transition hover:bg-white/15">
                  Comparar factura gratis
                </a>
              </div>
              <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/[.07] p-5"><p className="text-3xl font-black">3</p><p className="mt-1 text-xs font-black uppercase tracking-[.16em] text-white/50">Áreas de servicio</p></div>
                <div className="rounded-3xl border border-white/10 bg-white/[.07] p-5"><p className="text-3xl font-black">0€</p><p className="mt-1 text-xs font-black uppercase tracking-[.16em] text-white/50">Comparación factura</p></div>
                <div className="rounded-3xl border border-white/10 bg-white/[.07] p-5"><p className="text-3xl font-black">1:1</p><p className="mt-1 text-xs font-black uppercase tracking-[.16em] text-white/50">Atención directa</p></div>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="rounded-[2rem] border border-white/10 bg-white/[.08] p-3 shadow-2xl backdrop-blur">
                <div className="rounded-[1.55rem] bg-white p-7 text-neutral-950 sm:p-8">
                  <Logo />
                  <div className="my-9 border-y border-neutral-200 py-8">
                    <p className="text-xs font-black uppercase tracking-[.22em] text-lakuntza-greenDark">Instalación · Telecomunicaciones · Energía</p>
                    <h2 className="mt-4 text-4xl font-black leading-none tracking-[-.06em] sm:text-5xl">Soluciones claras para tu vivienda o negocio.</h2>
                    <p className="mt-4 text-sm leading-6 text-neutral-600">Presupuestos, averías, reformas, conectividad y revisión de facturas de luz y gas.</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl bg-[#F3FAEF] p-4"><Zap className="mb-3 text-lakuntza-green" /><p className="font-black">Instalaciones</p><p className="mt-1 text-sm text-neutral-600">Trabajo seguro y ordenado.</p></div>
                    <div className="rounded-3xl bg-neutral-100 p-4"><FileText className="mb-3 text-neutral-900" /><p className="font-black">Facturas</p><p className="mt-1 text-sm text-neutral-600">Revisión sin compromiso.</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="servicios" className="bg-lakuntza-mist py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7"><Badge>Servicios</Badge><h2 className="mt-5 text-4xl font-black leading-[.95] tracking-[-.055em] sm:text-6xl">Lo que ofrecemos</h2></div>
              <p className="text-base leading-8 text-neutral-600 lg:col-span-5">Atención para particulares, comunidades, comercios y pequeñas empresas, con un enfoque práctico: entender la necesidad, proponer una solución y ejecutar bien.</p>
            </div>
            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <article key={service.title} className="rounded-[2rem] border border-neutral-200 bg-white p-7 shadow-card transition hover:-translate-y-1 hover:border-lakuntza-green/40 hover:shadow-2xl">
                    <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F3FAEF] text-lakuntza-greenDark"><Icon size={30} /></div>
                    <h3 className="text-2xl font-black tracking-[-.04em]">{service.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-neutral-600">{service.text}</p>
                    <div className="mt-7 grid gap-3 text-sm font-bold text-neutral-700">
                      {service.items.map((item) => <div key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 shrink-0 text-lakuntza-green" size={17} /><span>{item}</span></div>)}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <FrequentServices />
        <ProjectsSection />

        <section className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <Badge>Confianza local</Badge>
                <h2 className="mt-5 text-4xl font-black leading-[.95] tracking-[-.055em] sm:text-6xl">Cercanía, oficio y explicación clara.</h2>
              </div>
              <p className="text-base leading-8 text-neutral-600 lg:col-span-5">Una instalación eléctrica o una contratación energética debe entenderse bien antes de tomar decisiones. Por eso el trato es directo y el proceso se explica desde el principio.</p>
            </div>
            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {trustItems.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-card">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F3FAEF] text-lakuntza-greenDark"><Icon size={23} /></div>
                    <h3 className="text-lg font-black tracking-[-.03em]">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-neutral-600">{item.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="energia" className="bg-white py-20 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:items-center lg:px-8">
            <div className="lg:col-span-6">
              <Badge><Leaf size={14} /> Luz y gas</Badge>
              <h2 className="mt-5 text-4xl font-black leading-[.95] tracking-[-.055em] sm:text-6xl">Compara tu factura sin compromiso.</h2>
              <p className="mt-6 text-base leading-8 text-neutral-600">Como empresa delegada de Fenie Energía, revisamos tu factura de luz o gas, te explicamos qué estás pagando y valoramos contigo si existe una opción más adecuada para tu consumo.</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm"><FileText className="mb-4 text-lakuntza-green" /><h3 className="font-black">Revisión de factura</h3><p className="mt-2 text-sm leading-6 text-neutral-600">Consumo, potencia contratada, condiciones y posibles mejoras.</p></div>
                <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm"><MessageCircle className="mb-4 text-lakuntza-green" /><h3 className="font-black">Atención cercana</h3><p className="mt-2 text-sm leading-6 text-neutral-600">Sin centralitas impersonales y sin obligación de contratar.</p></div>
              </div>
            </div>
            <div className="lg:col-span-6"><div className="rounded-[2rem] bg-neutral-950 p-2 shadow-2xl"><InvoiceWhatsAppForm /></div></div>
          </div>
        </section>

        <section id="proceso" className="bg-neutral-950 py-20 text-white sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7"><Badge dark>Proceso</Badge><h2 className="mt-5 text-4xl font-black leading-[.95] tracking-[-.055em] sm:text-6xl">Trabajo claro de principio a fin.</h2></div>
              <p className="text-base leading-8 text-white/70 lg:col-span-5">Un trato directo ayuda a evitar dudas: sabes con quién hablas, qué se va a revisar y cuál es el siguiente paso.</p>
            </div>
            <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {steps.map(([num, title, text]) => <div key={num} className="rounded-[2rem] border border-white/10 bg-white/[.05] p-6"><p className="text-sm font-black text-lakuntza-green">{num}</p><h3 className="mt-5 text-xl font-black tracking-[-.03em]">{title}</h3><p className="mt-3 text-sm leading-6 text-white/60">{text}</p></div>)}
            </div>
          </div>
        </section>

        <section id="zona" className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 rounded-[2.2rem] border border-neutral-200 bg-lakuntza-mist p-7 shadow-card sm:p-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <Badge><MapPin size={14} /> Zona de servicio</Badge>
                <h2 className="mt-5 text-4xl font-black leading-[.95] tracking-[-.055em] sm:text-5xl">Servicio en Navarra y País Vasco desde Lakuntza.</h2>
                <p className="mt-5 text-base leading-8 text-neutral-600">La empresa está ubicada en Uriz Kalea, 27, 31830 Lakuntza, Nafarroa. Desde Lakuntza se atienden trabajos en Navarra y País Vasco, valorando en cada solicitud el tipo de trabajo, disponibilidad y desplazamiento.</p>
                <a href={mapsHref} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center justify-center rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-black text-white transition hover:bg-lakuntza-greenDark">
                  Ver ubicación en Google Maps
                </a>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:col-span-5">
                {['Navarra', 'País Vasco', 'Particulares y comunidades', 'Comercios y pequeños negocios'].map((item) => <div key={item} className="rounded-3xl bg-white p-5 shadow-sm"><p className="font-black">{item}</p><p className="mt-2 text-sm leading-6 text-neutral-500">{item === 'Navarra' || item === 'País Vasco' ? 'Zona de servicio actual.' : 'Instalación, revisión y mantenimiento.'}</p></div>)}
              </div>
            </div>
          </div>
        </section>

        <section id="contacto" className="bg-lakuntza-mist py-20 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
            <div className="lg:col-span-5">
              <Badge>Contacto</Badge><h2 className="mt-5 text-4xl font-black leading-[.95] tracking-[-.055em] sm:text-6xl">Cuéntanos qué necesitas.</h2><p className="mt-6 text-base leading-8 text-neutral-600">Para averías, presupuestos o revisión de facturas, llama o escribe por WhatsApp.</p>
              <div className="mt-8 space-y-4">
                <a href="tel:+34649853448" className="flex items-center gap-4 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-lakuntza-green"><Phone className="text-lakuntza-green" /><div><p className="font-black">649 853 448</p><p className="text-sm text-neutral-500">Llamada directa</p></div></a>
                <a href={whatsappHref} className="flex items-center gap-4 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-lakuntza-green"><MessageCircle className="text-lakuntza-green" /><div><p className="font-black">Escribir por WhatsApp</p><p className="text-sm text-neutral-500">Presupuestos, dudas y envío de facturas</p></div></a>
                <a href="mailto:eleclakuntza@yahoo.es" className="flex items-center gap-4 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-lakuntza-green"><Mail className="text-lakuntza-green" /><div><p className="font-black">eleclakuntza@yahoo.es</p><p className="text-sm text-neutral-500">Presupuestos y documentación</p></div></a>
                <a href={mapsHref} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-lakuntza-green"><MapPin className="text-lakuntza-green" /><div><p className="font-black">Uriz Kalea, 27</p><p className="text-sm text-neutral-500">31830 Lakuntza, Nafarroa</p></div></a>
              </div>
            </div>
            <div className="lg:col-span-7"><ContactForm /></div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileContactBar />
    </div>
  );
}
