import { AlertTriangle, CheckCircle2, FileText, Leaf, Lock, MessageCircle, ShieldCheck } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Badge from '@/components/Badge';
import MobileContactBar from '@/components/MobileContactBar';
import { submitInvoiceReview } from './actions';

export const metadata = {
  title: 'Revisión gratuita de factura de luz y gas',
  description:
    'Sube tu factura de luz o gas y Electricidad Lakuntza revisará gratis si puedes mejorar tus condiciones en Navarra y País Vasco.',
};

const errorMessages = {
  config: 'La configuración del formulario no está disponible ahora mismo. Puedes enviar la factura por WhatsApp o email.',
  datos: 'Revisa nombre, teléfono y consentimiento antes de enviar.',
  factura: 'Debes adjuntar una factura en PDF o imagen.',
  tipo: 'Formato no válido. Sube un PDF, JPG, PNG o WebP.',
  tamano: 'La factura supera el tamaño máximo de 10 MB.',
  subida: 'No se ha podido subir la factura. Inténtalo de nuevo o envíala por WhatsApp.',
  registro: 'No se ha podido registrar la solicitud. Inténtalo de nuevo o envíala por WhatsApp.',
};

const benefits = [
  'Revisión gratuita y sin compromiso.',
  'Te explicamos la comparativa antes de cambiar nada.',
  'Atención directa desde Electricidad Lakuntza.',
  'Si no te conviene cambiar, también te lo diremos.',
];

const checks = [
  'Potencia contratada.',
  'Precio y condiciones actuales.',
  'Servicios añadidos o permanencias.',
  'Luz, gas o ambos suministros.',
];

export default function RevisionFacturaPage({ searchParams }) {
  const error = searchParams?.error;

  return (
    <div className="min-h-screen bg-white pb-24 text-neutral-950 md:pb-0">
      <Header />
      <main>
        <section className="relative isolate overflow-hidden bg-neutral-950 pt-32 text-white">
          <div className="hero-grid absolute inset-0 opacity-30" />
          <div className="absolute -right-44 top-12 h-[28rem] w-[28rem] rounded-full bg-lakuntza-green/15 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 sm:px-6 xl:grid-cols-12 xl:items-end xl:px-8">
            <div className="xl:col-span-8">
              <Badge dark><Leaf size={14} /> Luz y gas</Badge>
              <h1 className="mt-6 max-w-5xl text-5xl font-black leading-[.95] tracking-[-.06em] sm:text-7xl">
                Sube tu factura y revisamos gratis si puedes mejorar.
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-white/75">
                Envíanos tu factura de luz o gas. Hacemos un preanálisis y, si vemos margen de mejora o un caso especial, Electricidad Lakuntza contacta contigo para explicártelo sin compromiso.
              </p>
            </div>
            <div className="xl:col-span-4">
              <div className="rounded-[2rem] border border-white/10 bg-white/[.07] p-7">
                <FileText className="mb-6 text-lakuntza-green" size={34} />
                <p className="text-sm leading-7 text-white/70">
                  La factura se guarda en un espacio privado y solo se utiliza para estudiar tu consulta.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-lakuntza-mist py-20 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 xl:grid-cols-12 xl:px-8">
            <div className="xl:col-span-5">
              <Badge>Revisión gratuita</Badge>
              <h2 className="mt-5 text-4xl font-black leading-[.95] tracking-[-.055em] sm:text-5xl">
                Una revisión rápida puede detectar oportunidades reales.
              </h2>
              <p className="mt-6 text-base leading-8 text-neutral-600">
                No prometemos ahorro automático. Revisamos tu caso y te decimos con honestidad si merece la pena cambiar, ajustar condiciones o mantener lo que tienes.
              </p>

              <div className="mt-8 grid gap-3">
                {benefits.map((item) => (
                  <div key={item} className="flex gap-3 rounded-2xl bg-white p-4 text-sm font-bold text-neutral-700 shadow-sm">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-lakuntza-green" size={18} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[1.6rem] border border-amber-200 bg-amber-50 p-5">
                <div className="flex gap-3">
                  <AlertTriangle className="mt-0.5 shrink-0 text-amber-600" size={22} />
                  <div>
                    <h3 className="font-black text-amber-950">Bono social o familia numerosa</h3>
                    <p className="mt-2 text-sm leading-6 text-amber-900">
                      Si tienes bono social, familia numerosa o tarifa regulada, lo revisamos como caso especial antes de recomendar cualquier cambio.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="xl:col-span-7">
              <form action={submitInvoiceReview} className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-card sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F3FAEF] text-lakuntza-greenDark">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-lakuntza-greenDark">Formulario seguro</p>
                    <h3 className="mt-2 text-3xl font-black tracking-[-0.05em] text-neutral-950">Enviar factura para revisión</h3>
                    <p className="mt-3 text-sm leading-6 text-neutral-600">Rellena los datos mínimos para que podamos estudiar la factura y contactarte.</p>
                  </div>
                </div>

                {error ? (
                  <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold leading-6 text-red-700">
                    {errorMessages[error] || 'Ha ocurrido un error. Inténtalo de nuevo.'}
                  </div>
                ) : null}

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-black text-neutral-800">
                    Nombre *
                    <input name="name" required autoComplete="name" className="focus-ring min-h-12 rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-base font-medium outline-none focus:border-lakuntza-green sm:text-sm" />
                  </label>
                  <label className="grid gap-2 text-sm font-black text-neutral-800">
                    Teléfono *
                    <input name="phone" required type="tel" inputMode="tel" autoComplete="tel" className="focus-ring min-h-12 rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-base font-medium outline-none focus:border-lakuntza-green sm:text-sm" />
                  </label>
                  <label className="grid gap-2 text-sm font-black text-neutral-800">
                    Email
                    <input name="email" type="email" autoComplete="email" className="focus-ring min-h-12 rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-base font-medium outline-none focus:border-lakuntza-green sm:text-sm" />
                  </label>
                  <label className="grid gap-2 text-sm font-black text-neutral-800">
                    Localidad
                    <input name="locality" autoComplete="address-level2" className="focus-ring min-h-12 rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-base font-medium outline-none focus:border-lakuntza-green sm:text-sm" />
                  </label>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <label className="grid gap-2 text-sm font-black text-neutral-800">
                    Suministro *
                    <select name="supplyType" required defaultValue="luz" className="focus-ring min-h-12 rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-base outline-none focus:border-lakuntza-green sm:text-sm">
                      <option value="luz">Luz</option>
                      <option value="gas">Gas</option>
                      <option value="luz_gas">Luz y gas</option>
                    </select>
                  </label>
                  <label className="grid gap-2 text-sm font-black text-neutral-800">
                    Cliente *
                    <select name="customerType" required defaultValue="vivienda" className="focus-ring min-h-12 rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-base outline-none focus:border-lakuntza-green sm:text-sm">
                      <option value="vivienda">Vivienda</option>
                      <option value="negocio">Negocio</option>
                      <option value="comunidad">Comunidad</option>
                    </select>
                  </label>
                  <label className="grid gap-2 text-sm font-black text-neutral-800">
                    Bono social / familia numerosa *
                    <select name="bonusStatus" required defaultValue="no_lo_se" className="focus-ring min-h-12 rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-base outline-none focus:border-lakuntza-green sm:text-sm">
                      <option value="no">No</option>
                      <option value="si">Sí</option>
                      <option value="no_lo_se">No lo sé</option>
                    </select>
                  </label>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-black text-neutral-800">
                    Compañía actual
                    <input name="currentCompany" placeholder="Iberdrola, Endesa, Naturgy..." className="focus-ring min-h-12 rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-base font-medium outline-none placeholder:text-neutral-400 focus:border-lakuntza-green sm:text-sm" />
                  </label>
                  <label className="grid gap-2 text-sm font-black text-neutral-800">
                    Factura PDF o imagen *
                    <input name="invoice" required type="file" accept="application/pdf,image/jpeg,image/png,image/webp" className="focus-ring min-h-12 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium file:mr-4 file:rounded-xl file:border-0 file:bg-neutral-950 file:px-4 file:py-2 file:text-sm file:font-black file:text-white focus:border-lakuntza-green" />
                  </label>
                </div>

                <label className="mt-4 grid gap-2 text-sm font-black text-neutral-800">
                  Comentario opcional
                  <textarea name="notes" rows={4} placeholder="Ej.: creo que pago mucho, tengo permanencia, tengo servicios añadidos, quiero revisar luz y gas..." className="focus-ring rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-base font-medium outline-none placeholder:text-neutral-400 focus:border-lakuntza-green sm:text-sm" />
                </label>

                <div className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                  <label className="flex gap-3 text-xs leading-5 text-neutral-600">
                    <input name="consent" type="checkbox" required className="mt-1 h-4 w-4 shrink-0 accent-lakuntza-green" />
                    <span>
                      Acepto que Electricidad Lakuntza use mis datos y la factura enviada únicamente para revisar la consulta y contactarme. Más información en la <a href="/privacidad" className="font-black text-lakuntza-greenDark underline">política de privacidad</a>.
                    </span>
                  </label>
                </div>

                <button className="mt-5 w-full rounded-2xl bg-lakuntza-green px-6 py-4 text-sm font-black text-white shadow-green transition hover:bg-lakuntza-greenDark">
                  Enviar factura para revisión gratuita
                </button>

                <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-neutral-500">
                  <Lock className="mt-0.5 shrink-0" size={14} />
                  Formatos permitidos: PDF, JPG, PNG o WebP. Tamaño máximo: 10 MB.
                </p>
              </form>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {checks.map((item) => (
                <div key={item} className="rounded-[1.6rem] border border-neutral-200 bg-white p-5 shadow-card">
                  <CheckCircle2 className="text-lakuntza-green" size={22} />
                  <p className="mt-4 text-sm font-black text-neutral-900">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileContactBar />
    </div>
  );
}
