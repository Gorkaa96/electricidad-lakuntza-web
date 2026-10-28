import { ArrowRight, ArrowUpRight, CheckCircle2, Home, MessageCircle, Phone, ShieldCheck, Store } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Badge from '@/components/Badge';
import MobileContactBar from '@/components/MobileContactBar';

export const metadata = {
  title: 'Alarmas Movistar Prosegur | Información y contratación',
  description: 'Consulta sobre alarmas de Movistar Prosegur Alarmas para hogar o negocio con Electricidad Lakuntza, a través de su colaboración con Feníe Energía. Atención directa, condiciones a confirmar.',
  alternates: { canonical: '/alarmas-movistar-prosegur' },
  openGraph: {
    title: 'Alarmas Movistar Prosegur con Electricidad Lakuntza',
    description: 'Información y asesoramiento para contratar alarmas a través de Feníe Energía. Para viviendas y negocios.',
  },
};

const whatsappText = encodeURIComponent('Hola Electricidad Lakuntza. Quiero información sobre las alarmas de Movistar Prosegur Alarmas a través de Feníe Energía. Es para una vivienda o negocio: ');
const whatsappHref = `https://wa.me/34649853448?text=${whatsappText}`;
const officialUrl = 'https://www.fenieenergia.es/es/movistar-prosegur-alarmas';

const steps = [
  ['01', 'Nos consultas', 'Cuéntanos si buscas una alarma para tu vivienda o negocio y si ya eres cliente de Feníe Energía.'],
  ['02', 'Revisamos las condiciones', 'Te informamos sobre el producto, su elegibilidad y las condiciones comerciales disponibles.'],
  ['03', 'Decides', 'Si la propuesta encaja, te orientamos en el proceso de contratación con el proveedor del servicio.'],
];

const questions = [
  ['¿Electricidad Lakuntza instala las alarmas?', 'Nuestra función es comercial y de acompañamiento a través de Feníe Energía. La instalación y el servicio de seguridad corresponden a los profesionales del proveedor de alarmas.'],
  ['¿Tengo que ser cliente de Feníe Energía?', 'La promoción publicada por Feníe Energía está dirigida a sus clientes. Si todavía no lo eres, podemos aclarar las condiciones actuales y, si te interesa, estudiar por separado tu suministro de luz o gas.'],
  ['¿Cuánto cuesta y qué permanencia tiene?', 'El precio, equipamiento, promociones y permanencia dependen de las condiciones concretas vigentes. Te las explicaremos antes de que tomes una decisión.'],
  ['¿Puedo contratarla para un negocio?', 'El acuerdo entre Feníe Energía y Movistar Prosegur Alarmas contempla hogares, negocios y pequeñas empresas. La disponibilidad y propuesta concreta deben confirmarse.'],
  ['¿Una consulta me obliga a contratar?', 'No. Puedes solicitar información sin compromiso de contratación.'],
];

export default function AlarmasMovistarProsegurPage() {
  return (
    <div className="min-h-screen bg-white pb-24 text-neutral-950 md:pb-0">
      <Header />
      <main>
        <section className="relative isolate overflow-hidden bg-[#101411] pt-32 text-white">
          <div className="hero-grid pointer-events-none absolute inset-0 opacity-35" />
          <div className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-lakuntza-green/20 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,.8fr)] lg:px-8">
            <div className="min-w-0">
              <Badge dark><ShieldCheck size={14} /> Seguridad · Hogares y negocios</Badge>
              <h1 className="mt-7 max-w-3xl text-4xl font-black leading-[1.06] tracking-[-.05em] sm:text-6xl">
                Alarmas de Movistar Prosegur, con atención cercana.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/80">
                Electricidad Lakuntza te informa sobre la contratación de Movistar Prosegur Alarmas a través de Feníe Energía. Te ayudamos a entender las opciones y condiciones antes de decidir.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-2xl bg-lakuntza-green px-6 py-4 text-sm font-black text-white shadow-green transition hover:bg-lakuntza-greenDark">
                  Consultar mi alarma <MessageCircle className="ml-2" size={18} />
                </a>
                <a href="tel:+34649853448" className="inline-flex items-center justify-center rounded-2xl border border-white/25 bg-white/10 px-6 py-4 text-sm font-black text-white transition hover:bg-white/15">
                  Llamar <Phone className="ml-2" size={18} />
                </a>
              </div>
              <p className="mt-5 text-sm leading-6 text-white/65">Consulta sin compromiso. Confirmamos precio, permanencia y promociones aplicables antes de contratar.</p>
            </div>
            <div className="min-w-0 rounded-[2rem] bg-white p-6 text-neutral-950 shadow-2xl sm:p-8">
              <p className="text-xs font-black uppercase tracking-[.17em] text-lakuntza-greenDark">Colaboración comercial</p>
              <h2 className="mt-3 text-2xl font-black tracking-[-.04em] sm:text-3xl">Electricidad Lakuntza · Feníe Energía · Movistar Prosegur Alarmas</h2>
              <p className="mt-5 text-sm leading-7 text-neutral-600">
                Feníe Energía y Movistar Prosegur Alarmas colaboran para ofrecer soluciones de seguridad. Electricidad Lakuntza actúa como empresa delegada de Feníe, no como compañía de seguridad.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-neutral-50 p-5">
                  <Home className="text-lakuntza-greenDark" size={25} />
                  <p className="mt-3 font-black">Viviendas</p>
                  <p className="mt-1 text-sm leading-6 text-neutral-600">Solicita información para proteger tu hogar.</p>
                </div>
                <div className="rounded-2xl bg-neutral-50 p-5">
                  <Store className="text-lakuntza-greenDark" size={25} />
                  <p className="mt-3 font-black">Negocios</p>
                  <p className="mt-1 text-sm leading-6 text-neutral-600">Consulta soluciones para tu actividad.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-lakuntza-mist py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[.18em] text-lakuntza-greenDark">Proceso comercial</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-.04em] sm:text-5xl">La tranquilidad empieza por tener la información clara.</h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {steps.map(([number, title, description]) => (
                <article key={number} className="rounded-[1.8rem] border border-neutral-200 bg-white p-6 shadow-card">
                  <p className="text-sm font-black text-lakuntza-greenDark">{number}</p>
                  <h3 className="mt-4 text-xl font-black">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-neutral-600">{description}</p>
                </article>
              ))}
            </div>
            <div className="mt-10 rounded-[1.8rem] border border-lakuntza-green/20 bg-white p-6 sm:p-8">
              <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p className="font-black text-neutral-950">¿Ya eres cliente de Feníe Energía?</p>
                  <p className="mt-2 text-sm leading-7 text-neutral-600">Puede haber promociones específicas para clientes. Son condiciones de la oferta oficial y pueden cambiar; no garantizamos descuentos ni instalaciones gratuitas sin confirmarlas.</p>
                </div>
                <a href={officialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-2xl border border-neutral-300 px-5 py-3 text-sm font-black text-neutral-900 hover:border-lakuntza-green">
                  Consultar oferta oficial <ArrowUpRight className="ml-2" size={17} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-black uppercase tracking-[.18em] text-lakuntza-greenDark">Resolvemos tus dudas</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-.04em] sm:text-4xl">Preguntas frecuentes</h2>
            <div className="mt-8 grid gap-3">
              {questions.map(([question, answer]) => (
                <details key={question} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 open:bg-white">
                  <summary className="cursor-pointer font-black leading-6 text-neutral-950">{question}</summary>
                  <p className="mt-3 text-sm leading-7 text-neutral-600">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-neutral-950 py-20 text-white sm:py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <ShieldCheck className="mx-auto text-lakuntza-green" size={34} />
            <h2 className="mt-5 text-3xl font-black tracking-[-.04em] sm:text-5xl">¿Quieres conocer las opciones para tu hogar o negocio?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/70">Escríbenos y dinos si ya eres cliente de Feníe y para qué espacio necesitas la alarma. Te orientaremos sobre las condiciones que correspondan.</p>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center justify-center rounded-2xl bg-lakuntza-green px-6 py-4 text-sm font-black text-white shadow-green transition hover:bg-lakuntza-greenDark">
              Solicitar información por WhatsApp <ArrowRight className="ml-2" size={18} />
            </a>
            <p className="mt-5 text-xs leading-6 text-white/50">El botón abre WhatsApp. El mensaje no se envía hasta que tú lo confirmes. También puedes llamar al 649 853 448.</p>
          </div>
        </section>
      </main>
      <Footer />
      <MobileContactBar />
    </div>
  );
}
