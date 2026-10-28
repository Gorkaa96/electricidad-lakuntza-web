import { AlertTriangle, CheckCircle2, FileText, Leaf, Lock, MessageCircle, ShieldCheck } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Badge from '@/components/Badge';
import MobileContactBar from '@/components/MobileContactBar';
import InvoiceFileInput from '@/components/InvoiceFileInput';
import EnergyEligibilityFields from '@/components/EnergyEligibilityFields';
import { submitInvoiceReview } from './actions';

export const metadata = {
  title: 'Revisión de factura de luz y gas',
  alternates: { canonical: '/revision-factura-luz-gas' },
  description:
    'Revisión de facturas de luz y gas con Electricidad Lakuntza, empresa delegada de Feníe Energía. Atención directa y sin compromiso.',
};

const errorMessages = {
  config: 'La configuración del formulario no está disponible ahora mismo. Puedes enviar la factura por WhatsApp o email.',
  bono: 'No tramitamos el cambio de suministro eléctrico con bono social o posible derecho por familia numerosa. Puedes consultar una comercializadora de referencia o elegir solo gas.',
  datos: 'Revisa nombre, teléfono y consentimiento antes de enviar.',
  factura: 'Debes adjuntar una factura en PDF o imagen.',
  tipo: 'Formato no válido. Sube un PDF, JPG, PNG o WebP.',
  tamano: 'La factura supera el tamaño máximo de 10 MB.',
  subida: 'No se ha podido subir la factura. Inténtalo de nuevo o envíala por WhatsApp.',
  registro: 'No se ha podido registrar la solicitud. Inténtalo de nuevo o envíala por WhatsApp.',
};

const benefits = [
  'Empresa delegada de Feníe Energía; te explicamos las opciones que ofrece.',
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

const privacyPoints = [
  'La factura se guarda en un espacio privado, no público.',
  'La usamos solo para revisar tu consulta y contactarte.',
  'El resultado final lo revisa una persona antes de darte una recomendación.',
  'Puedes pedir la eliminación de la solicitud y del archivo enviado.',
];

const processSteps = [
  {
    title: '1. Subes la factura',
    text: 'Puede ser PDF o imagen. Solo pedimos los datos mínimos para poder revisarla y contactar contigo.',
  },
  {
    title: '2. Preanálisis interno',
    text: 'Ordenamos los datos principales: compañía, tarifa, potencia, consumo, importe y posibles servicios añadidos.',
  },
  {
    title: '3. Confirmación humana',
    text: 'Antes de recomendar nada, Electricidad Lakuntza revisa el caso y te explica si conviene actuar o mantener lo actual.',
  },
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
                Revisa tu factura de luz o gas sin compromiso.
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-white/75">
                Envíanos tu factura para que revisemos tus condiciones y valoremos si existe una alternativa interesante con Feníe Energía. Si no te conviene cambiar, también te lo diremos.
              </p>
            </div>
            <div className="xl:col-span-4">
              <div className="rounded-[2rem] border border-white/10 bg-white/[.07] p-7">
                <FileText className="mb-6 text-lakuntza-green" size={34} />
                <p className="text-sm leading-7 text-white/70">
                  La factura se guarda en un espacio privado y solo se utiliza para estudiar tu consulta.
                </p>
                <div className="mt-5 grid gap-3 text-xs font-bold text-white/65">
                  <div className="flex gap-2"><Lock size={14} className="mt-0.5 shrink-0 text-lakuntza-green" /> Archivo privado</div>
                  <div className="flex gap-2"><ShieldCheck size={14} className="mt-0.5 shrink-0 text-lakuntza-green" /> Revisión humana</div>
                  <div className="flex gap-2"><MessageCircle size={14} className="mt-0.5 shrink-0 text-lakuntza-green" /> Contacto directo</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-lakuntza-mist py-20 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 xl:grid-cols-12 xl:px-8">
            <div className="xl:col-span-5">
              <Badge>Revisión de factura</Badge>
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
                      El bono social eléctrico solo puede aplicarse con comercializadoras de referencia. Si lo recibes o tienes título de familia numerosa, te orientamos hacia la información oficial antes de pedir tu factura de luz.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-[1.6rem] border border-neutral-200 bg-white p-5 shadow-sm">
                <div className="flex gap-3">
                  <Lock className="mt-0.5 shrink-0 text-lakuntza-green" size={22} />
                  <div>
                    <h3 className="font-black text-neutral-950">Privacidad y revisión humana</h3>
                    <div className="mt-3 grid gap-2 text-sm leading-6 text-neutral-600">
                      {privacyPoints.map((item) => <p key={item}>• {item}</p>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="xl:col-span-7">
              <form action={submitInvoiceReview} className="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-card">
                <div className="absolute -left-[9999px]" aria-hidden="true"><label htmlFor="website-hp">Deja este campo vacío</label><input id="website-hp" name="website" type="text" tabIndex={-1} autoComplete="off" /></div>
                <div className="border-b border-neutral-200 bg-white p-6 sm:p-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F3FAEF] text-lakuntza-greenDark">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-lakuntza-greenDark">Formulario seguro</p>
                      <h3 className="mt-2 text-3xl font-black tracking-[-0.05em] text-neutral-950">Enviar factura para revisión</h3>
                      <p className="mt-3 text-sm leading-6 text-neutral-600">Rellena los datos mínimos para que podamos estudiar la factura y contactarte. La recomendación final no es automática: la revisa una persona.</p>
                    </div>
                  </div>

                  {error ? (
                    <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold leading-6 text-red-700">
                      {errorMessages[error] || 'Ha ocurrido un error. Inténtalo de nuevo.'}
                    </div>
                  ) : null}
                </div>

                <div className="grid gap-7 p-5 sm:p-8">
                  <EnergyEligibilityFields />
                  <div className="border-t border-neutral-200 pt-7">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-neutral-400">2. Datos de contacto</p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-2 text-sm font-black text-neutral-800">
                        Nombre *
                        <input name="name" required autoComplete="name" className="focus-ring min-h-12 w-full min-w-0 rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-base font-medium outline-none focus:border-lakuntza-green sm:text-sm" />
                      </label>
                      <label className="grid gap-2 text-sm font-black text-neutral-800">
                        Teléfono *
                        <input name="phone" required type="tel" inputMode="tel" autoComplete="tel" className="focus-ring min-h-12 w-full min-w-0 rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-base font-medium outline-none focus:border-lakuntza-green sm:text-sm" />
                      </label>
                      <label className="grid gap-2 text-sm font-black text-neutral-800">
                        Email
                        <input name="email" type="email" autoComplete="email" className="focus-ring min-h-12 w-full min-w-0 rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-base font-medium outline-none focus:border-lakuntza-green sm:text-sm" />
                      </label>
                      <label className="grid gap-2 text-sm font-black text-neutral-800">
                        Localidad
                        <input name="locality" autoComplete="address-level2" className="focus-ring min-h-12 w-full min-w-0 rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-base font-medium outline-none focus:border-lakuntza-green sm:text-sm" />
                      </label>
                    </div>
                  </div>

                  <div className="border-t border-neutral-200 pt-7">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-neutral-400">3. Factura y comentarios</p>
                    <div className="mt-4 grid gap-4">
                      <label className="grid gap-2 text-sm font-black text-neutral-800">
                        Compañía actual
                        <input name="currentCompany" placeholder="Iberdrola, Endesa, Naturgy..." className="focus-ring min-h-12 w-full min-w-0 rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-base font-medium outline-none placeholder:text-neutral-400 focus:border-lakuntza-green sm:text-sm" />
                      </label>
                      <InvoiceFileInput />
                    </div>

                    <label className="mt-4 grid gap-2 text-sm font-black text-neutral-800">
                      Comentarios
                      <textarea name="notes" rows={4} placeholder="Ej.: creo que pago mucho, tengo permanencia, tengo servicios añadidos, quiero revisar luz y gas..." className="focus-ring w-full min-w-0 rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 text-base font-medium outline-none placeholder:text-neutral-400 focus:border-lakuntza-green sm:text-sm" />
                    </label>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                    <label className="flex gap-3 text-xs leading-5 text-neutral-600">
                      <input name="consent" type="checkbox" required className="mt-1 h-4 w-4 shrink-0 accent-lakuntza-green" />
                      <span>
                        Acepto que Electricidad Lakuntza use mis datos y la factura enviada únicamente para revisar la consulta y contactarme. Entiendo que el preanálisis es orientativo y que la recomendación final requiere revisión humana. Más información en la <a href="/privacidad" className="font-black text-lakuntza-greenDark underline">política de privacidad</a>.
                      </span>
                    </label>
                  </div>

                  <button className="w-full rounded-2xl bg-lakuntza-greenDark px-6 py-4 text-sm font-black text-white shadow-green transition hover:bg-neutral-950">
                    Enviar factura para revisión
                  </button>

                  <p className="flex items-start gap-2 text-xs leading-5 text-neutral-500">
                    <Lock className="mt-0.5 shrink-0" size={14} />
                    Formatos permitidos: PDF, JPG, PNG o WebP. Máximo 10 MB. No adjuntes DNI, IBAN ni documentación adicional: solo necesitamos la factura para esta primera revisión.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 md:grid-cols-3">
              {processSteps.map((step) => (
                <div key={step.title} className="rounded-[1.6rem] border border-neutral-200 bg-white p-6 shadow-card">
                  <ShieldCheck className="text-lakuntza-green" size={22} />
                  <h3 className="mt-4 text-lg font-black tracking-[-0.03em] text-neutral-950">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">{step.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {checks.map((item) => (
                <div key={item} className="rounded-[1.6rem] border border-neutral-200 bg-white p-5 shadow-card">
                  <CheckCircle2 className="text-lakuntza-green" size={22} />
                  <p className="mt-4 text-sm font-black text-neutral-900">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-24" aria-labelledby="faq-energia">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-black uppercase tracking-[.18em] text-lakuntza-greenDark">Preguntas frecuentes</p>
            <h2 id="faq-energia" className="mt-3 text-3xl font-black tracking-[-.04em] text-neutral-950 sm:text-4xl">Antes de enviar tu factura</h2>
            <div className="mt-8 grid gap-3">
              {[
                ['¿Es obligatorio contratar?', 'No. Revisamos tu consulta y te explicamos las alternativas que podamos ofrecerte. Tú decides si continuar.'],
                ['¿Comparáis todas las comercializadoras?', 'No. Electricidad Lakuntza trabaja como empresa delegada de Feníe Energía y estudia sus alternativas a partir de tus condiciones actuales.'],
                ['¿Me quedaré sin luz o gas si cambio?', 'El cambio ordinario de comercializadora es administrativo y no exige interrumpir el suministro. Antes de contratar revisamos las condiciones aplicables.'],
                ['¿Y si tengo bono social eléctrico o título de familia numerosa?', 'No podemos tramitar el cambio de luz a una tarifa con bono social. El PVPC y el descuento se solicitan ante una comercializadora de referencia. Para gas o alarmas puedes consultarnos por separado.'],
                ['¿No tengo la factura disponible?', 'Puedes preguntarnos primero por WhatsApp o llamarnos. No hace falta enviarla para una consulta inicial.'],
              ].map(([question, answer]) => (
                <details key={question} className="group rounded-2xl border border-neutral-200 bg-neutral-50 p-5 open:bg-white">
                  <summary className="cursor-pointer text-base font-black leading-6 text-neutral-950">{question}</summary>
                  <p className="mt-3 text-sm leading-7 text-neutral-600">{answer}</p>
                </details>
              ))}
            </div>
            <p className="mt-6 text-sm text-neutral-600">¿Prefieres hablar directamente? <a href="https://wa.me/34649853448?text=Hola%20Electricidad%20Lakuntza.%20Quiero%20consultar%20sobre%20luz%20o%20gas%20sin%20adjuntar%20todavia%20una%20factura." target="_blank" rel="noopener noreferrer" className="font-black text-lakuntza-greenDark underline">Consúltanos por WhatsApp</a>.</p>
          </div>
        </section>
      </main>
      <Footer />
      <MobileContactBar />
    </div>
  );
}
