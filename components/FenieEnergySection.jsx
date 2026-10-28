import { ArrowRight, ArrowUpRight, CheckCircle2, Leaf } from 'lucide-react';

const fenieUrl = 'https://www.fenieenergia.es/es';
const logoUrl = 'https://storage.googleapis.com/stb-drupal-p-ew4-01/styles/large/cloud-storage/2022-11/logo.png?itok=W8Dkw-wk';

const steps = [
  ['01', 'Recibimos tu solicitud', 'Envíanos una factura o consulta la opción que te interesa.'],
  ['02', 'Revisamos las condiciones', 'Estudiamos la alternativa disponible y las condiciones aplicables.'],
  ['03', 'Tú decides', 'Te explicamos la propuesta antes de cualquier contratación.'],
];

export default function FenieEnergySection() {
  return (
    <section id="fenie" className="scroll-mt-24 bg-lakuntza-mist py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] lg:gap-12 lg:px-8">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.14em] text-lakuntza-greenDark"><Leaf size={16} /> Empresa delegada de Feníe Energía</p>
          <h2 className="mt-5 max-w-xl text-3xl font-black leading-tight tracking-[-.045em] text-neutral-950 sm:text-4xl">Energía y seguridad, con una persona al otro lado.</h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-neutral-600">
            Feníe Energía comercializa electricidad y gas y colabora con Movistar Prosegur Alarmas. Desde Electricidad Lakuntza escuchamos tu consulta, explicamos las opciones que podamos ofrecerte y te acompañamos cuando decides contratar.
          </p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-600">
            No somos un comparador independiente de todo el mercado ni prestamos directamente el servicio de seguridad. El precio, las promociones y las condiciones siempre se confirman para cada caso.
          </p>
          <a href={fenieUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-lakuntza-greenDark underline-offset-4 hover:underline">
            Conocer Feníe Energía en su web oficial <ArrowUpRight size={16} />
          </a>
        </div>
        <div className="min-w-0 rounded-[1.5rem] border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-6">
            <p className="text-xs font-black uppercase tracking-[.14em] text-neutral-600">Colaboración comercial</p>
            <img src={logoUrl} alt="Feníe Energía" loading="lazy" width="160" height="58" className="max-h-14 w-auto max-w-[160px] object-contain" />
          </div>
          <ol className="mt-7 grid gap-5">
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
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <a href="/revision-factura-luz-gas" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-lakuntza-greenDark px-4 py-3 text-sm font-black text-white transition hover:bg-neutral-950">Luz y gas <ArrowRight size={16} /></a>
            <a href="/alarmas-movistar-prosegur" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-lakuntza-greenDark px-4 py-3 text-sm font-black text-white transition hover:bg-neutral-950">Alarmas <ArrowRight size={16} /></a>
          </div>
          <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-neutral-500"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-lakuntza-greenDark" /> Atención directa, sin obligación de contratar.</p>
        </div>
      </div>
    </section>
  );
}
