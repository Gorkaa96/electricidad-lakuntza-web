import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Política de cookies',
  description: 'Política de cookies de Electricidad Lakuntza.',
};

const sections = [
  {
    title: 'Uso actual de cookies',
    content: [
      'La parte pública de esta web está preparada para funcionar sin cookies publicitarias, sin píxeles de seguimiento y sin analítica avanzada.',
      'El panel privado de administración puede utilizar cookies técnicas o mecanismos equivalentes estrictamente necesarios para mantener la sesión de usuario autenticado y garantizar la seguridad del acceso.',
    ],
  },
  {
    title: 'Cookies técnicas',
    content: [
      'Las cookies técnicas son necesarias para el funcionamiento correcto de determinadas partes de la web, como el acceso seguro al panel privado. Estas cookies no se utilizan con fines publicitarios.',
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
      'Si en el futuro se incorporan herramientas de analítica, mapas embebidos, píxeles publicitarios, chat externo, reCAPTCHA u otras tecnologías no estrictamente técnicas, esta política deberá actualizarse y, cuando corresponda, se añadirá un sistema de consentimiento de cookies.',
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
    <div className="min-h-screen bg-white text-neutral-950">
      <Header />
      <main>
        <section className="bg-neutral-950 pt-32 text-white">
          <div className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-lakuntza-green">Información de cookies</p>
            <h1 className="mt-5 text-5xl font-black leading-[.95] tracking-[-.06em] sm:text-6xl">Política de cookies</h1>
            <p className="mt-6 text-base leading-8 text-white/65">Información sobre el uso actual de cookies y tecnologías similares en la web.</p>
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
                Última actualización: junio de 2026. Esta política deberá actualizarse si se incorporan cookies no técnicas o herramientas externas que requieran consentimiento.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
