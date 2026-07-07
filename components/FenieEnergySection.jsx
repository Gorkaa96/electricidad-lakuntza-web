import { ArrowUpRight, CheckCircle2, Leaf, ShieldCheck, Users } from 'lucide-react';
import Badge from './Badge';

const fenieUrl = 'https://www.fenieenergia.es/es/sobre-fenie/historia';
const fenieLogoUrl = 'https://storage.googleapis.com/stb-drupal-p-ew4-01/styles/large/cloud-storage/2022-11/logo.png?itok=W8Dkw-wk';

const points = [
  'Comercializadora creada por empresas instaladoras.',
  'Contratación de electricidad y gas a través de agentes energéticos.',
  'Asesoramiento cercano para entender consumo, potencia y condiciones.',
];

export default function FenieEnergySection() {
  return (
    <section className="bg-lakuntza-mist py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 overflow-hidden rounded-[2.2rem] border border-neutral-200 bg-white p-7 shadow-card sm:p-10 xl:grid-cols-12 xl:items-center">
          <div className="xl:col-span-5">
            <Badge><Leaf size={14} /> Feníe Energía</Badge>
            <div className="mt-6 rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex min-h-28 items-center justify-center rounded-[1.5rem] bg-neutral-50 p-6">
                <img
                  src={fenieLogoUrl}
                  alt="Feníe Energía"
                  className="max-h-20 w-auto max-w-full object-contain"
                  loading="lazy"
                />
              </div>
              <p className="mt-4 text-xs font-bold leading-5 text-neutral-500">
                Electricidad Lakuntza trabaja como empresa delegada de Feníe Energía para la revisión y contratación de luz y gas.
              </p>
            </div>
          </div>

          <div className="xl:col-span-7">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-lakuntza-greenDark">Energía con acompañamiento</p>
            <h2 className="mt-4 text-4xl font-black leading-[.95] tracking-[-.055em] text-neutral-950 sm:text-5xl">
              Revisión de luz y gas con el respaldo de Feníe Energía.
            </h2>
            <p className="mt-6 text-base leading-8 text-neutral-600">
              Feníe Energía es una comercializadora impulsada por empresas instaladoras. Desde Electricidad Lakuntza revisamos cada caso, explicamos la factura y, si encaja, acompañamos al cliente en la contratación.
            </p>

            <div className="mt-7 grid gap-3">
              {points.map((point) => (
                <div key={point} className="flex gap-3 rounded-2xl bg-neutral-50 p-4 text-sm font-bold leading-6 text-neutral-700">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-lakuntza-green" size={18} />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-neutral-200 bg-white p-5">
                <ShieldCheck className="mb-4 text-lakuntza-green" size={24} />
                <h3 className="font-black text-neutral-950">Sin promesas automáticas</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">Primero se revisa la factura y después se explica si merece la pena actuar.</p>
              </div>
              <div className="rounded-3xl border border-neutral-200 bg-white p-5">
                <Users className="mb-4 text-lakuntza-green" size={24} />
                <h3 className="font-black text-neutral-950">Trato local</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">El contacto lo mantiene Electricidad Lakuntza, con explicación directa y cercana.</p>
              </div>
            </div>

            <a href={fenieUrl} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center justify-center rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-black text-white transition hover:bg-lakuntza-greenDark">
              Conocer Feníe Energía <ArrowUpRight className="ml-2" size={17} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
