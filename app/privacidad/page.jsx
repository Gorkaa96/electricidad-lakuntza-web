import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileContactBar from '@/components/MobileContactBar';

export const metadata = {
  title: 'Política de privacidad',
  description: 'Política de privacidad de Electricidad Lakuntza.',
};

const sections = [
  {
    title: 'Responsable del tratamiento',
    content: [
      'Responsable: Electricidad Lakuntza · Elektrizitatea.',
      'Domicilio: Uriz Kalea, 27, 31830 Lakuntza, Navarra.',
      'Email de contacto: eleclakuntza@yahoo.es.',
      'Teléfono: 649 853 448.',
    ],
  },
  {
    title: 'Datos que podemos tratar',
    content: [
      'Podemos tratar los datos que el usuario facilita voluntariamente al contactar por teléfono, correo electrónico, WhatsApp o formulario web: nombre, teléfono, email, mensaje, ubicación aproximada del trabajo y documentación que el usuario decida enviar.',
      'En el caso de revisión de facturas de luz o gas, la factura puede incluir datos como nombre y apellidos, dirección del suministro, CUPS, compañía comercializadora, tarifa o peaje, potencia contratada, consumo, importes, periodo facturado y otros conceptos asociados al contrato.',
      'No se deben enviar datos de terceros ni información especialmente sensible salvo que sea imprescindible para atender la solicitud.',
    ],
  },
  {
    title: 'Revisión de facturas de luz y gas',
    content: [
      'Cuando el usuario sube una factura para revisión, Electricidad Lakuntza la utiliza para realizar un preanálisis energético y valorar si puede existir una oportunidad de mejora, ahorro, cambio de condiciones o revisión comercial.',
      'El análisis puede incluir la extracción manual o asistida de datos de la factura. Cualquier resultado mostrado o registrado internamente es orientativo y requiere revisión humana antes de comunicar una recomendación al cliente.',
      'La factura subida se almacena en un espacio privado no público y solo debe ser accesible por personal autorizado para gestionar la solicitud.',
      'El usuario puede solicitar la eliminación de la factura o de la solicitud escribiendo a eleclakuntza@yahoo.es.',
    ],
  },
  {
    title: 'Finalidades',
    content: [
      'Responder consultas, preparar presupuestos, gestionar solicitudes de servicio, valorar trabajos técnicos, revisar facturas de luz o gas y mantener la comunicación necesaria con el cliente.',
      'También podemos conservar información mínima de trabajos realizados para gestión interna, historial de servicio y obligaciones legales cuando corresponda.',
      'No utilizamos los datos recibidos para publicidad masiva ni cesiones comerciales no solicitadas.',
    ],
  },
  {
    title: 'Base jurídica',
    content: [
      'La base jurídica principal es la solicitud del usuario y la aplicación de medidas precontractuales o contractuales. En algunos casos, también puede existir interés legítimo en responder consultas, conservar comunicaciones profesionales y acreditar la correcta prestación del servicio.',
      'Cuando el usuario sube una factura desde la web, acepta expresamente que se trate esa documentación para estudiar su consulta energética.',
    ],
  },
  {
    title: 'Conservación',
    content: [
      'Los datos se conservarán durante el tiempo necesario para responder a la solicitud, prestar el servicio, atender posibles responsabilidades y cumplir obligaciones legales aplicables.',
      'Las facturas enviadas para comparación energética se usarán para estudiar la consulta y no deberán conservarse más tiempo del necesario para dicha finalidad, salvo que exista relación contractual, gestión posterior solicitada por el cliente u obligación legal que justifique su conservación.',
      'Las solicitudes de prueba, duplicadas, erróneas o no necesarias podrán eliminarse del panel interno y del almacenamiento privado asociado.',
    ],
  },
  {
    title: 'Destinatarios y proveedores técnicos',
    content: [
      'No se cederán datos a terceros salvo obligación legal o cuando sea necesario para prestar el servicio solicitado.',
      'Para servicios energéticos, si el cliente decide avanzar con una contratación, podrán comunicarse los datos necesarios a la comercializadora, distribuidora, entidad delegada o entidades implicadas en la gestión del contrato.',
      'La web puede utilizar proveedores técnicos de alojamiento, almacenamiento, formularios, correo electrónico, analítica o comunicaciones para que el servicio funcione correctamente. Estos proveedores solo deben tratar los datos en la medida necesaria para prestar el servicio técnico correspondiente.',
      'Al usar WhatsApp, email u otros servicios externos, la comunicación se rige también por las condiciones y políticas de privacidad de dichos proveedores.',
    ],
  },
  {
    title: 'Decisiones automatizadas',
    content: [
      'El preanálisis de una factura puede apoyarse en reglas internas o herramientas de ayuda para ordenar la información, pero no se toman decisiones totalmente automatizadas con efectos jurídicos o similares para el usuario.',
      'La recomendación final sobre una factura, cambio de tarifa, contratación o viabilidad comercial debe ser revisada por una persona de Electricidad Lakuntza antes de comunicarse al cliente.',
    ],
  },
  {
    title: 'Derechos',
    content: [
      'El usuario puede solicitar el acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad de sus datos cuando proceda.',
      'Para ejercer estos derechos puede escribir a eleclakuntza@yahoo.es indicando el derecho que desea ejercer y la información necesaria para identificar la solicitud.',
      'También puede presentar una reclamación ante la autoridad de control competente si considera que el tratamiento no se ajusta a la normativa aplicable.',
    ],
  },
  {
    title: 'Seguridad',
    content: [
      'Electricidad Lakuntza aplicará medidas razonables para proteger la información recibida y evitar accesos no autorizados, pérdidas o usos indebidos.',
      'Las facturas de luz o gas se tratan como documentación privada y no deben compartirse fuera del proceso de revisión o gestión solicitada.',
      'No obstante, ningún sistema de comunicación por Internet puede considerarse absolutamente seguro, por lo que se recomienda no enviar información innecesaria o excesiva.',
    ],
  },
];

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-white pb-24 text-neutral-950 md:pb-0">
      <Header />
      <main>
        <section className="relative isolate overflow-hidden bg-neutral-950 pt-32 text-white">
          <div className="hero-grid absolute inset-0 opacity-30" />
          <div className="absolute -right-44 top-12 h-[28rem] w-[28rem] rounded-full bg-lakuntza-green/15 blur-3xl" />
          <div className="relative mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-lakuntza-green">Protección de datos</p>
            <h1 className="mt-5 text-5xl font-black leading-[.95] tracking-[-.06em] sm:text-6xl">Política de privacidad</h1>
            <p className="mt-6 text-base leading-8 text-white/70">Información sobre cómo tratamos los datos recibidos a través de la web, teléfono, email, WhatsApp o revisión de facturas.</p>
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
                Última actualización: junio de 2026. Esta política tiene carácter informativo y podrá actualizarse si cambian los servicios, herramientas o requisitos aplicables.
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
