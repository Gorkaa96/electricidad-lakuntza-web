import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileContactBar from '@/components/MobileContactBar';
import { commercialIntakeReady } from '@/lib/invoice/protection';
import { submitCommercialInquiry } from './actions';

export const metadata = {
  title: 'Solicitar información sobre nuestros servicios',
  description: 'Consulta luz, gas, alarmas, cargadores eléctricos o asesoría energética con Electricidad Lakuntza.',
  robots: { index: false, follow: false },
};

const services = {
  luz: 'Luz', gas: 'Gas', luz_gas: 'Luz y gas',
  alarmas: 'Alarmas', cargadores: 'Cargadores eléctricos',
  asesoria: 'Asesoría energética',
};

const errors = {
  config: 'El formulario todavía no está disponible. Puedes escribirnos por WhatsApp o llamarnos.',
  datos: 'Revisa el servicio, nombre, contacto y mensaje antes de enviar.',
  verificacion: 'No se ha completado la comprobación de seguridad. Inténtalo de nuevo.',
  servicio: 'No podemos recibir tu solicitud en este momento. Inténtalo de nuevo más tarde o llámanos.',
  limite: 'Demasiados intentos desde este contacto. Inténtalo más tarde o llámanos.',
  registro: 'No hemos podido registrar tu consulta. Puedes llamarnos o escribir por WhatsApp.',
};
const field = 'min-h-12 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm focus:border-[#267130] focus:outline-none';

export default async function CommercialInquiryPage({ searchParams }) {
  const params = await searchParams;
  const ready = commercialIntakeReady();
  const selectedService = Object.hasOwn(services, params?.servicio) ? params.servicio : 'luz_gas';

  const contactHref = 'https://wa.me/34649853448?text=' + encodeURIComponent('Hola Electricidad Lakuntza. Quiero información sobre ' + services[selectedService] + '.');

  return (
    <div className="min-h-screen bg-white pb-24 text-neutral-950 md:pb-0">
      <Header />
      <main id="contenido-principal">
        <section className="brand-dark-surface pt-20 text-white">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <p className="text-sm font-semibold text-[#B6E6A4]">Electricidad Lakuntza · Contacto</p>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-.045em] sm:text-5xl">Cuéntanos qué necesitas.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
              Luz, gas, alarmas, cargadores eléctricos o asesoría energética. Una persona de nuestro equipo revisará tu consulta antes de proponerte el siguiente paso.
            </p>
          </div>
        </section>
        <section className="bg-[#F5F8F4] py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            {params?.error ? <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">{errors[params.error] || errors.registro}</div> : null}
            {ready ? (
              <form action={submitCommercialInquiry} className="grid gap-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-9">
                <div className="absolute -left-[9999px]" aria-hidden="true"><label htmlFor="commercial-hp">Dejar vacío</label><input name="website" id="commercial-hp" type="text" tabIndex={-1} autoComplete="off" /></div>
                <label className="grid gap-2 text-sm font-semibold">Servicio *
                  <select name="service" defaultValue={selectedService} className={field} required>
                    {Object.entries(services).map(([value,label])=><option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-semibold">Tipo de cliente *
                  <select name="customerType" defaultValue="vivienda" className={field}>
                    <option value="vivienda">Vivienda</option>
                    <option value="negocio">Negocio</option>
                    <option value="comunidad">Comunidad</option>
                    <option value="otro">Otro</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-semibold">Nombre de contacto *
                  <input name="contactName" minLength={2} maxLength={160} autoComplete="name" className={field} required />
                </label>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold">Teléfono
                    <input name="contactPhone" type="tel" inputMode="tel" maxLength={35} pattern="[+0-9() .-]{9,35}" title="Teléfono válido, por ejemplo 600 123 456" placeholder="600 123 456" autoComplete="tel" className={field} />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold">Correo electrónico
                    <input name="contactEmail" type="email" maxLength={254} placeholder="nombre@ejemplo.com" autoComplete="email" className={field} />
                  </label>
                </div>
                <p className="-mt-4 text-xs text-neutral-600">Indica al menos un medio de contacto.</p>
                <label className="grid gap-2 text-sm font-semibold">Tu consulta *
                  <textarea name="message" minLength={10} maxLength={1000} rows={5} className={field + ' min-h-32'} required placeholder="Explica brevemente qué necesitas. No incluyas DNI, IBAN ni datos sensibles." />
                </label>
                <label className="flex items-start gap-3 text-xs leading-6 text-neutral-600">
                  <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 shrink-0 accent-[#267130]" />
                  <span>Confirmo que puedo facilitar estos datos para recibir respuesta a mi consulta. He leído la <a href="/privacidad" className="font-semibold text-[#23632B] underline underline-offset-4">política de privacidad</a>.</span>
                </label>
                <div className="rounded-xl border border-neutral-200 p-4">
                  <p className="mb-2 text-sm font-semibold">Comprobación de seguridad</p><p className="mb-3 text-xs text-neutral-600">Para proteger el formulario contra envíos automáticos. Si no se completa, recarga la página o contacta por teléfono.</p>
                  <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
                  <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} data-action="commercial_inquiry" data-theme="light" />
                </div>
                <button type="submit" className="min-h-12 rounded-xl bg-[#24662D] px-6 py-3 font-semibold text-white hover:bg-[#194D20]">Enviar consulta</button>
                <p className="text-xs leading-6 text-neutral-600">Una consulta no implica contratación ni un presupuesto aceptado.</p>
              </form>
            ) : (
              <div className="rounded-2xl border border-neutral-200 bg-white p-8 sm:p-10">
                <h2 className="text-2xl font-semibold text-[#152017]">Estamos disponibles para ayudarte.</h2>
                <p className="mt-4 text-base leading-8 text-neutral-600">Puedes enviarnos tu consulta por WhatsApp, llamarnos o escribirnos por correo. Te atenderemos personalmente.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a className="rounded-xl bg-[#24662D] px-5 py-3 text-sm font-semibold text-white" target="_blank" rel="noopener noreferrer" href={contactHref}>Escribir por WhatsApp</a>
                  <a className="rounded-xl border border-neutral-300 px-5 py-3 text-sm font-semibold text-[#205127]" href="tel:+34649853448">Llamar</a>
                  <a className="rounded-xl border border-neutral-300 px-5 py-3 text-sm font-semibold text-[#205127]" href="mailto:eleclakuntza@yahoo.es">Enviar email</a>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <MobileContactBar />
    </div>
  );
}
