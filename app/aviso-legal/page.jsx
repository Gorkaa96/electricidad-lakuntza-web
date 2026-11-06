import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileContactBar from '@/components/MobileContactBar';

export const metadata = {
  title: 'Aviso legal',
  description: 'Información legal de Electricidad Lakuntza.',
};

const sections = [
  {
    title: 'Titular de la web',
    content: [
      'Denominación comercial: Electricidad Lakuntza · Elektrizitatea.',
      'Domicilio: Uriz Kalea, 27, 31830 Lakuntza, Navarra.',
      'Teléfono: 649 853 448.',
      'Correo electrónico: eleclakuntza@yahoo.es.',
      'Actividad ofrecida actualmente: asesoría energética e instalación de cargadores eléctricos por Electricidad Lakuntza; comercialización de contratos de luz y gas como agente de Feníe Energía y de alarmas de Movistar Prosegur a través de Feníe.',
    ],
  },
  {
    title: 'Objeto de la web',
    content: [
      'Esta web tiene carácter informativo y comercial. Su finalidad es presentar los servicios ofrecidos actualmente por Electricidad Lakuntza y facilitar el contacto con clientes potenciales.',
      'La información publicada no constituye presupuesto cerrado ni oferta vinculante. Cada trabajo se valorará según alcance, disponibilidad, ubicación, condiciones técnicas y necesidades concretas del cliente.',
    ],
  },
  {
    title: 'Servicios energéticos',
    content: [
      'Electricidad Lakuntza realiza directamente la asesoría energética y la revisión de facturas. Para comparar y tramitar contratos de luz y gas actúa como agente de Feníe Energía, que es la comercializadora con la que se formaliza el contrato.',
      'La comparación de suministros utiliza las condiciones actuales del cliente y las ofertas disponibles del portal profesional de Feníe. No es una comparación de todo el mercado ni implica obligación de contratación. Electricidad Lakuntza realiza directamente el estudio, presupuesto e instalación de cargadores eléctricos.',
    ],
  },
  {
    title: 'Consultas sobre alarmas',
    content: [
      'Electricidad Lakuntza ofrece información y acompañamiento comercial para contratar soluciones de Movistar Prosegur Alarmas a través de la colaboración con Feníe Energía.',
      'La instalación, prestaciones de seguridad, precios, permanencia y condiciones de las ofertas corresponden al proveedor del servicio y deben confirmarse antes de la contratación.',
    ],
  },
  {
    title: 'Propiedad intelectual',
    content: [
      'Los textos, diseño, logotipos, imágenes y demás elementos de esta web pertenecen a sus respectivos titulares o se utilizan con autorización. No se permite su reproducción, distribución o modificación sin autorización previa.',
      'Las imágenes de trabajos realizados se publican con finalidad informativa y representativa de la actividad profesional.',
    ],
  },
  {
    title: 'Responsabilidad',
    content: [
      'Electricidad Lakuntza trabaja para mantener la información de la web actualizada y correcta, pero no garantiza la ausencia de errores puntuales o desactualizaciones.',
      'La empresa no se hace responsable del uso indebido de la información publicada ni de incidencias técnicas ajenas a su control.',
    ],
  },
  {
    title: 'Normativa aplicable',
    content: [
      'Esta web se rige por la normativa española aplicable, incluida la normativa sobre servicios de la sociedad de la información, protección de datos y consumidores cuando corresponda.',
    ],
  },
];

export default function AvisoLegalPage() {
  return (
    <div className="min-h-screen bg-white pb-24 text-neutral-950 md:pb-0">
      <Header />
      <main id="contenido-principal">
        <section className="relative isolate overflow-hidden bg-neutral-950 pt-32 text-white">
          <div className="hero-grid absolute inset-0 opacity-30" />
          <div className="absolute -right-44 top-12 h-[28rem] w-[28rem] rounded-full bg-lakuntza-green/15 blur-3xl" />
          <div className="relative mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-lakuntza-green">Información legal</p>
            <h1 className="mt-5 text-5xl font-black leading-[.95] tracking-[-.06em] sm:text-6xl">Aviso legal</h1>
            <p className="mt-6 text-base leading-8 text-white/70">Información identificativa y condiciones generales de uso de la web de Electricidad Lakuntza.</p>
          </div>
        </section>

        <section className="bg-lakuntza-mist py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-[2rem] border border-neutral-200 bg-white p-7 shadow-card sm:p-10">
              <div className="space-y-10 text-sm leading-7 text-neutral-700">
                {sections.map((section) => (
                  <section key={section.title}>
                    <h2 className="text-2xl font-black tracking-[-0.04em] text-neutral-950">{section.title}</h2>
                    <div className="mt-4 space-y-3">
                      {section.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    </div>
                  </section>
                ))}
              </div>
              <p className="mt-10 rounded-2xl bg-neutral-50 p-4 text-xs leading-6 text-neutral-500">
                Última actualización: octubre de 2026.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileContactBar />
    </div>
  );
}
