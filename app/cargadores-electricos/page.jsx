import { ArrowRight, BadgeCheck, Building2, CircleHelp, House, MessageCircle, PlugZap, ShieldCheck } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileContactBar from '@/components/MobileContactBar';

export const metadata = {
  title: 'Cargadores eléctricos para hogares y negocios',
  description: 'Electricidad Lakuntza estudia, presupuesta e instala cargadores para vehículos eléctricos en viviendas, garajes y negocios.',
  alternates: { canonical: '/cargadores-electricos' },
};

const whatsapp = 'https://wa.me/34649853448?text=' + encodeURIComponent('Hola Electricidad Lakuntza. Quiero estudiar la instalación de un cargador eléctrico. Mi ubicación es: ');
const questions = [
  ['¿Qué precio tiene?', 'Depende del cargador, de la distancia al cuadro, del garaje y de los trabajos necesarios. Te ofreceremos un presupuesto tras revisar esos datos.'],
  ['¿Tengo que contratar la luz con Feníe Energía?', 'No. Electricidad Lakuntza realiza el estudio, presupuesto e instalación del cargador. Si quieres revisar también tu contrato de luz, podemos asesorarte por separado como agentes de Feníe Energía.'],
  ['¿Hacéis la instalación?', 'Sí. Electricidad Lakuntza realiza la instalación del cargador, previa visita o estudio técnico y aceptación del presupuesto.'],
  ['¿Hay ayudas?', 'Revisaremos si existen convocatorias vigentes aplicables a tu caso. No garantizamos subvenciones ni su concesión.'],
];

export default function CargadoresElectricosPage() {
  return (
    <div className="min-h-screen bg-white pb-24 text-neutral-950 md:pb-0">
      <Header />
      <main id="contenido-principal">
        <section className="brand-dark-surface relative pt-20 text-white">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:items-center lg:px-8">
            <div className="lg:col-span-8">
              <p className="text-sm font-semibold text-[#B6E6A4]">Movilidad eléctrica</p>
              <h1 className="mt-6 max-w-4xl text-[clamp(2.8rem,5.5vw,5.1rem)] font-semibold leading-[1.06] tracking-[-.055em]">Tu cargador eléctrico, bien planteado desde el principio.</h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/80">En Electricidad Lakuntza estudiamos, presupuestamos e instalamos tu punto de recarga en vivienda, garaje o negocio, adaptándolo a las necesidades de cada instalación.</p>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="mt-9 inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#E7F4DF] px-6 py-4 text-sm font-semibold text-[#22582A] hover:bg-white"><MessageCircle size={19} aria-hidden="true" /> Consultar mi instalación <ArrowRight size={17} aria-hidden="true" /></a>
              <p className="mt-4 text-sm leading-6 text-white/65">Sin presupuesto estándar ni compromiso por consultar.</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white p-7 text-[#17271D] lg:col-span-4">
              <PlugZap size={38} className="text-[#35763B]" aria-hidden="true" />
              <h2 className="mt-5 text-2xl font-semibold tracking-[-.03em]">Cada instalación es diferente.</h2>
              <p className="mt-3 text-sm leading-7 text-neutral-600">El punto de recarga, el recorrido del cable y las características del suministro determinan el proyecto y su precio final.</p>
            </div>
          </div>
        </section>

        <section className="bg-[#F5F8F4] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold tracking-[-.04em] sm:text-4xl">¿Dónde quieres cargar?</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {[
                { Icon: House, title: 'Vivienda y garaje privado', text: 'Soluciones de recarga doméstica según tu plaza, potencia disponible y hábitos de uso.' },
                { Icon: Building2, title: 'Negocios y comunidades', text: 'Revisión de necesidades, ubicaciones y viabilidad, para concretar una propuesta a medida.' },
              ].map(({ Icon, title, text }) => (
                <article key={title} className="rounded-2xl border border-[#DEE9DC] bg-white p-7 sm:p-9">
                  <Icon size={26} className="text-[#35763B]" aria-hidden="true" />
                  <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-neutral-600">{text}</p>
                </article>
              ))}
            </div>
            <div className="mt-12 grid gap-6 border-t border-[#D9E5D8] pt-9 md:grid-cols-3">
              {[
                { Icon: CircleHelp, title: '1. Cuéntanos tu caso', text: 'Ubicación, vehículo, tipo de garaje y necesidades de recarga.' },
                { Icon: ShieldCheck, title: '2. Estudiamos la viabilidad', text: 'Revisamos los requisitos técnicos y posibles soluciones.' },
                { Icon: BadgeCheck, title: '3. Recibes una propuesta', text: 'Te indicamos alcance, presupuesto y condiciones antes de decidir.' },
              ].map(({ Icon, title, text }) => (
                <div key={title}><Icon size={22} className="text-[#327837]" aria-hidden="true" /><h3 className="mt-4 font-semibold">{title}</h3><p className="mt-2 text-sm leading-7 text-neutral-600">{text}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Preguntas habituales</h2>
          <div className="mt-7 divide-y divide-neutral-200 border-t border-neutral-200">
            {questions.map(([q,a]) => <div className="grid gap-3 py-6 md:grid-cols-12" key={q}><h3 className="font-semibold md:col-span-5">{q}</h3><p className="text-sm leading-7 text-neutral-600 md:col-span-7">{a}</p></div>)}
          </div>
          <div className="mt-10 border-l-4 border-[#34793B] bg-[#F5F8F4] p-6 text-sm leading-7 text-neutral-700">Electricidad Lakuntza realiza el estudio, presupuesto y montaje de tu cargador. La contratación de luz con Feníe Energía es un servicio diferente, que podemos estudiar si lo necesitas. <a href="https://www.fenieenergia.es/es/hogar/cargadores-electricos" target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-4">Información de Feníe Energía</a>.</div>
        </section>
        <section className="bg-[#F0F6ED] py-16"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8"><div><h2 className="text-2xl font-semibold">¿Valoramos tu punto de recarga?</h2><p className="mt-2 text-sm text-neutral-600">Cuéntanos dónde lo necesitas y revisamos las opciones.</p></div><a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#24662D] px-6 py-3 font-semibold text-white">Escribir por WhatsApp</a></div></section>
      </main>
      <Footer />
      <MobileContactBar />
    </div>
  );
}
