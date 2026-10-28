import { ArrowRight, ArrowUpRight, CheckCircle2, Leaf } from 'lucide-react';

const fenieUrl = 'https://www.fenieenergia.es/es/sobre-fenie/historia';
const fenieLogoUrl = 'https://storage.googleapis.com/stb-drupal-p-ew4-01/styles/large/cloud-storage/2022-11/logo.png?itok=W8Dkw-wk';

export default function FenieEnergySection() {
  return (
    <section id="fenie" className="scroll-mt-20 bg-lakuntza-mist py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[.72fr_1.28fr] lg:items-center lg:gap-16 lg:px-8">
        <div className="rounded-[1.5rem] border border-neutral-200 bg-white p-7 sm:p-9">
          <p className="text-xs font-black uppercase tracking-[.14em] text-lakuntza-greenDark">Colaboración comercial</p>
          <div className="mt-7 flex min-h-28 items-center justify-center rounded-2xl bg-neutral-50 p-6">
            <img src={fenieLogoUrl} alt="Feníe Energía" loading="lazy" className="max-h-20 w-auto max-w-full object-contain" />
          </div>
          <p className="mt-5 text-sm font-bold leading-7 text-neutral-700">Electricidad Lakuntza es empresa delegada de Feníe Energía.</p>
        </div>
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.16em] text-lakuntza-greenDark"><Leaf size={15}/> Feníe Energía</p>
          <h2 className="mt-5 max-w-2xl text-3xl font-black leading-tight tracking-[-.045em] text-neutral-950 sm:text-5xl">Un contacto cercano para energía y seguridad.</h2>
          <p className="mt-6 text-base leading-8 text-neutral-600">Feníe Energía comercializa electricidad y gas mediante su red de agentes energéticos y colabora con Movistar Prosegur Alarmas. Desde Electricidad Lakuntza te explicamos las opciones disponibles y te acompañamos en la contratación cuando te interesa.</p>
          <div className="mt-7 grid gap-3 text-sm font-bold leading-6 text-neutral-700">
            {['Luz y gas: revisamos tus condiciones antes de proponer un cambio.', 'Alarmas: información comercial para hogares y negocios.', 'Trato directo, sin prometer ventajas ni precios sin comprobar las condiciones.'].map((item) => (
              <div key={item} className="flex items-start gap-3"><CheckCircle2 size={19} className="mt-0.5 shrink-0 text-lakuntza-greenDark" /><span>{item}</span></div>
            ))}
          </div>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href="/revision-factura-luz-gas" className="inline-flex items-center justify-center gap-2 rounded-xl bg-lakuntza-greenDark px-5 py-3.5 text-sm font-black text-white transition hover:bg-neutral-950">Revisar luz y gas <ArrowRight size={17}/></a>
            <a href="/alarmas-movistar-prosegur" className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 py-3.5 text-sm font-black text-neutral-950 hover:border-lakuntza-green">Consultar alarmas <ArrowRight size={17}/></a>
          </div>
          <a href={fenieUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-lakuntza-greenDark underline-offset-4 hover:underline">Conocer Feníe Energía en su web oficial <ArrowUpRight size={16}/></a>
          <p className="mt-5 text-xs leading-6 text-neutral-500">Somos empresa delegada de Feníe Energía, no un comparador independiente de todas las comercializadoras ni una empresa de seguridad.</p>
        </div>
      </div>
    </section>
  );
}
