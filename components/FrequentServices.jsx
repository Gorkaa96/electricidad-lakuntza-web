import { CheckCircle2, FileText, Lightbulb, PlugZap, Router, Satellite, ShieldCheck, Video } from 'lucide-react';
import Badge from './Badge';

const frequentServices = [
  {
    icon: Lightbulb,
    title: 'Reformas eléctricas',
    text: 'Actualización de instalaciones, nuevos puntos de luz, enchufes, mecanismos e iluminación interior o exterior.',
  },
  {
    icon: ShieldCheck,
    title: 'Cuadros eléctricos',
    text: 'Revisión, ordenación y mejora de cuadros eléctricos y protecciones según las necesidades de cada instalación.',
  },
  {
    icon: PlugZap,
    title: 'Averías y mantenimiento',
    text: 'Localización de fallos, pequeñas reparaciones y mantenimiento eléctrico en viviendas, comunidades y negocios.',
  },
  {
    icon: Router,
    title: 'Redes de datos',
    text: 'Cableado estructurado, puntos de red y mejoras de conectividad para hogares, oficinas y pequeños comercios.',
  },
  {
    icon: Satellite,
    title: 'Antenas y telecomunicaciones',
    text: 'Instalaciones y mejoras relacionadas con antenas, telecomunicaciones y señal en edificios y viviendas.',
  },
  {
    icon: Video,
    title: 'Porteros y videoporteros',
    text: 'Instalación, sustitución y mejora de porteros y videoporteros para viviendas, comunidades y locales.',
  },
  {
    icon: FileText,
    title: 'Revisión de factura',
    text: 'Comparación de facturas de luz y gas, revisión de potencia contratada y explicación clara de las opciones.',
  },
  {
    icon: CheckCircle2,
    title: 'Contratación luz y gas',
    text: 'Acompañamiento en la contratación de luz y gas como empresa delegada de Fenie Energía, sin compromiso previo.',
  },
];

export default function FrequentServices() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Badge>Servicios habituales</Badge>
            <h2 className="mt-5 text-4xl font-black leading-[.95] tracking-[-.055em] sm:text-6xl">
              Trabajos eléctricos y energéticos del día a día.
            </h2>
          </div>
          <p className="text-base leading-8 text-neutral-600 lg:col-span-5">
            Estos son algunos de los trabajos y consultas más habituales. Si no ves exactamente lo que necesitas, puedes llamar o escribir por WhatsApp para valorar el caso.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {frequentServices.map((service) => {
            const Icon = service.icon;
            return (
              <article key={service.title} className="rounded-[1.7rem] border border-neutral-200 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:border-lakuntza-green/40 hover:shadow-2xl">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F3FAEF] text-lakuntza-greenDark">
                  <Icon size={23} />
                </div>
                <h3 className="text-base font-black tracking-[-.03em] text-neutral-950">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600">{service.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
