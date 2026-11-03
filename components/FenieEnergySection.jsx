import { ArrowUpRight, Building2, UserRoundCheck } from 'lucide-react';

const fenieWebsite = 'https://www.fenieenergia.es/es';
const fenieHistory = 'https://www.fenieenergia.es/es/sobre-fenie/historia';

export default function FenieEnergySection() {
  return (
    <section id="fenie" aria-labelledby="fenie-title" className="scroll-mt-24 border-t border-[#E1E9DE] bg-white py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:items-center lg:gap-16 lg:px-8">
        <div className="lg:col-span-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9DEC6] bg-[#F1F8ED] px-4 py-2 text-xs font-semibold text-[#27612C]">
            <span className="h-2 w-2 rounded-full bg-[#3D9347]" aria-hidden="true" />
            Trabajamos con Feníe Energía
          </span>
          <h2 id="fenie-title" className="mt-6 max-w-xl text-4xl font-semibold leading-[1.12] tracking-[-.045em] text-[#152017] sm:text-5xl">
            ¿Qué es Feníe Energía?
          </h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-neutral-600">
            Feníe Energía es una comercializadora española de electricidad y gas impulsada por profesionales de las instalaciones. Su modelo se basa en una red de agentes energéticos que asesoran y acompañan a los clientes.
          </p>
          <p className="mt-4 max-w-xl text-base leading-8 text-neutral-600">
            Electricidad Lakuntza es tu agente de confianza: revisamos tu caso, te explicamos las opciones disponibles y te ayudamos con las gestiones. Los productos, sus precios y sus condiciones se confirman antes de contratar.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a href={fenieWebsite} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#24662D] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#194D20]">
              Visitar la web oficial de Feníe <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <a href={fenieHistory} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#28632D] underline decoration-[#9FC79A] underline-offset-4 hover:text-[#143F1D]">
              Conocer su historia <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
          <p className="mt-4 text-xs leading-6 text-neutral-500">
            Los enlaces llevan al sitio oficial de Feníe Energía y se abren en otra pestaña.
          </p>
        </div>
        <div className="lg:col-span-6">
          <div className="overflow-hidden rounded-2xl border border-[#DDE9DA] bg-[#F5F8F4]">
            <div className="border-b border-[#DDE9DA] px-6 py-5 sm:px-8">
              <p className="text-sm font-semibold text-[#2B6431]">Quién hace qué</p>
              <p className="mt-2 text-sm leading-6 text-neutral-600">Dos funciones diferentes que trabajan juntas.</p>
            </div>
            <div className="grid gap-0 divide-y divide-[#DDE9DA]">
              <div className="flex gap-4 px-6 py-7 sm:px-8">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#286D34]">
                  <Building2 size={23} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-[#152017]">Feníe Energía</h3>
                  <p className="mt-2 text-sm leading-7 text-neutral-600">
                    La comercializadora que ofrece los contratos de luz y gas y publica sus productos y condiciones oficiales.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 px-6 py-7 sm:px-8">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#286D34]">
                  <UserRoundCheck size={23} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-[#152017]">Electricidad Lakuntza</h3>
                  <p className="mt-2 text-sm leading-7 text-neutral-600">
                    Tu agente cercano: escucha, revisa las condiciones, te orienta y acompaña las gestiones que correspondan.
                  </p>
                </div>
              </div>
            </div>
            <p className="border-t border-[#DDE9DA] bg-white px-6 py-5 text-xs leading-6 text-neutral-600 sm:px-8">
              En alarmas y cargadores también intervienen proveedores o instaladores específicos. Confirmaremos quién presta cada servicio antes de realizar una propuesta.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
