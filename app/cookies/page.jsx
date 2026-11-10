import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileContactBar from '@/components/MobileContactBar';

export const metadata = {
  title: 'Política de cookies',
  description: 'Política de cookies de Electricidad Lakuntza.',
};

const sections = [
  {
    title: 'Uso actual de cookies',
    content: [
      'La web pública no utiliza actualmente píxeles publicitarios, seguimiento comercial ni analítica con cookies propias. Los enlaces externos no cargan esos servicios hasta que el usuario decide visitarlos.',
      'Cloudflare Turnstile comprueba los formularios frente a envíos automatizados mediante un desafío y validación de token de seguridad. No está habilitada su función opcional de preautorización mediante cookies de seguridad; pueden tratarse datos técnicos para realizar la comprobación. Tras guardar una solicitud se crea una cookie técnica de confirmación (lakuntza_invoice_receipt o lakuntza_commercial_receipt), limitada a su página de confirmación y con una duración de cinco minutos. No contiene datos de contacto ni documentación.',
      'El panel privado de administración puede utilizar cookies técnicas o mecanismos equivalentes estrictamente necesarios para mantener la sesión de usuario autenticado y garantizar la seguridad del acceso.',
    ],
  },
  {
    title: 'Cookies técnicas',
    content: [
      'Las cookies técnicas mantienen funciones esenciales como la seguridad de los formularios, la confirmación de recepción o el acceso al panel privado. No se utilizan para perfilar clientes ni para publicidad.',
      'Al ser necesarias para prestar el servicio solicitado o mantener la seguridad, no requieren consentimiento previo cuando se limitan a esa finalidad técnica.',
    ],
  },
  {
    title: 'Servicios de terceros',
    content: [
      'La web puede incluir enlaces externos a WhatsApp, Google Maps u otros servicios. Al acceder a esos servicios, el usuario sale del entorno de Electricidad Lakuntza y queda sujeto a las condiciones y políticas de privacidad o cookies de dichos terceros.',
      'Actualmente no se integra un mapa embebido en la página pública; se utiliza un enlace externo para evitar cargas de terceros innecesarias.',
    ],
  },
  {
    title: 'Cambios futuros',
    content: [
      'Si en el futuro se incorporan herramientas de analítica no exenta, mapas embebidos, píxeles publicitarios, chat externo u otras tecnologías no esenciales, se revisará la política y se habilitará consentimiento previo con opciones equivalentes para aceptar y rechazar cuando sea exigible.',
    ],
  },
  {
    title: 'Cómo gestionar cookies',
    content: [
      'El usuario puede bloquear o eliminar cookies desde la configuración de su navegador. Al hacerlo, algunas funciones técnicas, especialmente el acceso al panel privado, podrían dejar de funcionar correctamente.',
    ],
  },
];

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white pb-24 text-neutral-950 md:pb-0">
      <Header />
      <main id="contenido-principal">
        <section className="relative isolate overflow-hidden bg-neutral-950 pt-32 text-white">
          <div className="hero-grid absolute inset-0 opacity-30" />
          <div className="absolute -right-44 top-12 h-[28rem] w-[28rem] rounded-full bg-lakuntza-green/15 blur-3xl" />
          <div className="relative mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-lakuntza-green">Información de cookies</p>
            <h1 className="mt-5 text-5xl font-black leading-[.95] tracking-[-.06em] sm:text-6xl">Política de cookies</h1>
            <p className="mt-6 text-base leading-8 text-white/70">Información sobre el uso actual de cookies y tecnologías similares en la web.</p>
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
                Última actualización: 10 de noviembre de 2026.
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
