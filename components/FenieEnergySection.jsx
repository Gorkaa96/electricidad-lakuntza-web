import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

const fenieUrl = 'https://www.fenieenergia.es/es';

const facts = [
  'Revisamos la situación antes de hacer una propuesta.',
  'Aclaramos precios y condiciones concretas antes de contratar.',
  'La decisión final siempre es tuya.',
];

export default function FenieEnergySection() {
  return (
    <section id="fenie" className="scroll-mt-24 bg-[#F5F8F4] py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:items-start lg:gap-16 lg:px-8">
        <div className="lg:col-span-6">
          <p className="text-sm font-semibold text-[#2E7136]">Colaboramos con Feníe Energía</p>
          <h2 className="mt-5 max-w-xl text-3xl font-semibold leading-tight tracking-[-.04em] text-[#152017] sm:text-4xl">
            Te explicamos las opciones, sin letra pequeña escondida.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-neutral-600">
            A través de Feníe Energía podemos ayudarte a valorar propuestas de luz y gas y a consultar soluciones de Movistar Prosegur Alarmas.
          </p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-600">
            No somos un comparador independiente de todo el mercado ni instalamos directamente los sistemas de alarma. Confirmamos las condiciones de cada producto antes de plantearte una contratación.
          </p>
          <a href={fenieUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#28632D] underline underline-offset-4 hover:text-[#153D1A]">
            Conocer Feníe Energía <ArrowUpRight size={16} aria-hidden="true"/>
          </a>
        </div>
        <div className="lg:col-span-6">
          <div className="border-l-4 border-[#3E8E40] bg-white px-6 py-7 sm:px-9 sm:py-9">
            <h3 className="text-xl font-semibold tracking-[-.03em] text-neutral-950">Nuestra forma de trabajar</h3>
            <ul className="mt-7 grid gap-6">
              {facts.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-7 text-neutral-700">
                  <CheckCircle2 size={19} className="mt-1 shrink-0 text-[#327837]" aria-hidden="true"/>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
