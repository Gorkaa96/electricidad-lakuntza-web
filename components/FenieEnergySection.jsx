import { ArrowRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const fenieUrl = 'https://www.fenieenergia.es/es/sobre-fenie/historia';

const steps = [
  ['01', 'Envíanos tu factura', 'Una foto o PDF de tu última factura de luz o gas.'],
  ['02', 'Revisamos las condiciones', 'Comprobamos los datos y estudiamos las opciones disponibles con Feníe Energía.'],
  ['03', 'Tú decides', 'Te explicamos el resultado sin obligación de contratar.'],
];

export default function FenieEnergySection() {
  return (
    <section id="fenie" className="scroll-mt-20 bg-lakuntza-mist py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:px-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[.14em] text-lakuntza-greenDark">Cómo trabajamos</p>
          <h2 className="mt-5 max-w-xl text-3xl font-black leading-tight tracking-[-.045em] text-neutral-950 sm:text-4xl">Antes de cambiar de compañía, revisamos tu factura.</h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-neutral-600">
            Somos agentes energéticos de Feníe Energía. Revisamos las condiciones que nos facilites y te explicamos si una de sus propuestas puede interesarte. No comparamos todas las ofertas del mercado ni garantizamos un ahorro.
          </p>
          <a href={fenieUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-lakuntza-greenDark underline-offset-4 hover:underline">
            Conocer Feníe Energía <ArrowUpRight size={16} />
          </a>
        </div>
        <div className="rounded-[1.5rem] border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
          <ol className="grid gap-6">
            {steps.map(([number, title, description]) => (
              <li key={number} className="flex items-start gap-4">
                <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0F8EB] text-xs font-black text-lakuntza-greenDark">{number}</span>
                <div>
                  <h3 className="text-base font-black text-neutral-950">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-neutral-600">{description}</p>
                </div>
              </li>
            ))}
          </ol>
          <a href="/revision-factura-luz-gas" className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-lakuntza-greenDark px-5 py-3.5 text-sm font-black text-white transition hover:bg-neutral-950">
            Revisar mi factura gratis <ArrowRight size={17} />
          </a>
          <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-neutral-500"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-lakuntza-greenDark" /> Revisión gratuita, sin compromiso y con recomendación humana.</p>
        </div>
      </div>
    </section>
  );
}
