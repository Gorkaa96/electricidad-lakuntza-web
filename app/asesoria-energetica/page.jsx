import { ArrowRight, BarChart3, FileSearch, MessageCircle, ReceiptText, ShieldCheck } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileContactBar from '@/components/MobileContactBar';

export const metadata = {
  title: 'Asesoría energética y revisión de contratos',
  description: 'Revisión personalizada de facturas, potencia y condiciones de luz y gas. Te explicamos las alternativas de Feníe Energía sin prometer ahorros automáticos.',
  alternates: { canonical: '/asesoria-energetica' },
};

const whatsapp = 'https://wa.me/34649853448?text=' + encodeURIComponent('Hola Electricidad Lakuntza. Quiero asesoramiento sobre mi contrato o factura de energía.');
const items = [
  { Icon: ReceiptText, title: 'Lectura de la factura', text: 'Aclaramos el precio de energía, la potencia, el término fijo y los servicios adicionales.' },
  { Icon: BarChart3, title: 'Consumo y potencia', text: 'Valoramos tu perfil de consumo y si las condiciones contratadas se ajustan a tus necesidades.' },
  { Icon: FileSearch, title: 'Revisión de alternativas', text: 'Si existe una opción razonable, explicamos su precio, riesgos y condiciones antes de avanzar.' },
];

export default function AsesoriaEnergeticaPage() {
  return (
    <div className="min-h-screen bg-white pb-24 text-neutral-950 md:pb-0">
      <Header />
      <main id="contenido-principal">
        <section className="brand-dark-surface pt-20 text-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:items-center lg:px-8">
            <div className="lg:col-span-8">
              <p className="text-sm font-semibold text-[#B6E6A4]">Asesoría energética</p>
              <h1 className="mt-6 max-w-4xl text-[clamp(2.8rem,5.5vw,5.1rem)] font-semibold leading-[1.06] tracking-[-.055em]">Entiende lo que pagas. Decide con información.</h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/80">Analizamos tus facturas y las condiciones de luz y gas para ayudarte a elegir una opción adecuada. No prometemos ahorro sin comprobar tu situación.</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="/revision-factura-luz-gas" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#E7F4DF] px-6 py-4 text-sm font-semibold text-[#22582A] hover:bg-white">Consultar revisión de factura <ArrowRight size={17} aria-hidden="true"/></a>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-4 text-sm font-semibold text-white hover:bg-white/10"><MessageCircle size={17} aria-hidden="true"/> Hablar con nosotros</a>
              </div>
              <p className="mt-4 text-sm text-white/65">La subida de facturas online se habilitará tras finalizar las pruebas de privacidad y seguridad.</p>
            </div>
            <aside className="rounded-2xl border border-white/20 bg-white p-7 text-[#17271D] lg:col-span-4">
              <ShieldCheck size={33} className="text-[#35763B]" aria-hidden="true" />
              <h2 className="mt-5 text-2xl font-semibold tracking-[-.03em]">Recomendaciones razonadas.</h2>
              <p className="mt-3 text-sm leading-7 text-neutral-600">Estudiaremos contigo la conveniencia de mantener la tarifa o cambiar a una propuesta de Feníe Energía.</p>
            </aside>
          </div>
        </section>
        <section className="bg-[#F5F8F4] py-20 sm:py-24"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="max-w-2xl text-3xl font-semibold tracking-[-.04em] sm:text-4xl">¿Qué podemos revisar?</h2>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {items.map(({Icon,title,text})=><article className="rounded-2xl border border-[#DEE9DC] bg-white p-7" key={title}><Icon size={26} className="text-[#35763B]" aria-hidden="true"/><h3 className="mt-5 text-lg font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-neutral-600">{text}</p></article>)}
          </div>
        </div></section>
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-[-.04em]">Cómo trabajamos</h2>
          <ol className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              ['01', 'Cuéntanos tu situación', 'Partimos de una factura y de lo que te preocupa: precio, potencia o consumo.'],
              ['02', 'Revisamos las condiciones', 'Comprobamos los elementos relevantes y las opciones que podamos ofrecer.'],
              ['03', 'Tú decides', 'Te explicamos ventajas, riesgos y condiciones reales. Nada se contrata automáticamente.'],
            ].map(([num,title,text])=><li key={num} className="border-t border-neutral-200 pt-5"><p className="text-sm font-semibold text-[#347B3B]">{num}</p><h3 className="mt-3 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-7 text-neutral-600">{text}</p></li>)}
          </ol>
          <p className="mt-9 max-w-3xl text-sm leading-7 text-neutral-600">Electricidad Lakuntza actúa como agente comercial de Feníe Energía: las alternativas analizadas pertenecen a su catálogo y no constituyen una comparación exhaustiva de todas las comercializadoras del mercado.</p>
        </section>
      </main><Footer /><MobileContactBar />
    </div>
  );
}
