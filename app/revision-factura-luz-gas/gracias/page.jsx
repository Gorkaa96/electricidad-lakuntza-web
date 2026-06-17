import { AlertTriangle, CheckCircle2, MessageCircle, Phone } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Badge from '@/components/Badge';
import MobileContactBar from '@/components/MobileContactBar';

const whatsappText = encodeURIComponent('Hola Electricidad Lakuntza. Acabo de enviar mi factura desde la web y quiero comentar la revisión.');
const whatsappHref = `https://wa.me/34649853448?text=${whatsappText}`;

const messages = {
  potential_improvement: {
    title: 'Factura recibida. Parece revisable.',
    text: 'Por los datos iniciales, puede haber margen de mejora o al menos merece una revisión prioritaria. Electricidad Lakuntza revisará la factura y contactará contigo para explicártelo sin compromiso.',
    tone: 'green',
  },
  bonus_social_case: {
    title: 'Factura recibida. Caso especial.',
    text: 'Has indicado posible bono social o familia numerosa. Lo revisaremos con especial cuidado antes de recomendar cualquier cambio, porque puede no convenir salir de ciertas condiciones.',
    tone: 'amber',
  },
  manual_review: {
    title: 'Factura recibida correctamente.',
    text: 'La factura queda pendiente de revisión manual. Te contactaremos para decirte si hay margen de mejora o si conviene mantener tus condiciones actuales.',
    tone: 'green',
  },
  pending: {
    title: 'Factura recibida correctamente.',
    text: 'La factura queda pendiente de revisión. Te contactaremos para explicarte el resultado sin compromiso.',
    tone: 'green',
  },
};

export const metadata = {
  title: 'Factura recibida',
  description: 'Confirmación de recepción de factura para revisión gratuita.',
  robots: { index: false, follow: false },
};

export default function GraciasRevisionFacturaPage({ searchParams }) {
  const state = searchParams?.estado || 'pending';
  const message = messages[state] || messages.pending;
  const Icon = message.tone === 'amber' ? AlertTriangle : CheckCircle2;

  return (
    <div className="min-h-screen bg-white pb-24 text-neutral-950 md:pb-0">
      <Header />
      <main>
        <section className="relative isolate overflow-hidden bg-neutral-950 pt-32 text-white">
          <div className="hero-grid absolute inset-0 opacity-30" />
          <div className="absolute -right-44 top-12 h-[28rem] w-[28rem] rounded-full bg-lakuntza-green/15 blur-3xl" />
          <div className="relative mx-auto max-w-4xl px-4 pb-16 text-center sm:px-6 lg:px-8">
            <Badge dark>Revisión de factura</Badge>
            <div className="mx-auto mt-8 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-white text-lakuntza-greenDark">
              <Icon size={42} />
            </div>
            <h1 className="mt-8 text-5xl font-black leading-[.95] tracking-[-.06em] sm:text-6xl">{message.title}</h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/75">{message.text}</p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <a href="tel:+34649853448" className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-4 text-sm font-black text-neutral-950 transition hover:bg-lakuntza-mist">
                <Phone className="mr-2" size={18} /> Llamar
              </a>
              <a href={whatsappHref} className="inline-flex items-center justify-center rounded-2xl bg-lakuntza-green px-6 py-4 text-sm font-black text-white shadow-green transition hover:bg-lakuntza-greenDark">
                <MessageCircle className="mr-2" size={18} /> Escribir por WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileContactBar />
    </div>
  );
}
