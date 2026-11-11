import { cookies } from 'next/headers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileContactBar from '@/components/MobileContactBar';
import { commercialReceiptName, validCommercialReceipt } from '@/lib/commercial/receipt';

export const metadata = {
  title: 'Consulta comercial',
  robots: { index: false, follow: false },
};

export default async function CommercialInquiryResult() {
  const valid = validCommercialReceipt((await cookies()).get(commercialReceiptName)?.value);

  return (
    <div className="min-h-screen bg-white pb-24 text-neutral-950 md:pb-0">
      <Header />
      <main id="contenido-principal">
        <section className="brand-dark-surface pt-20 text-white">
          <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-semibold tracking-[-.045em] sm:text-5xl">
              {valid ? 'Hemos recibido tu consulta.' : '¿Quieres hacernos una consulta?'}
            </h1>
            <p className="mt-7 text-lg leading-8 text-white/80">
              {valid
                ? 'La revisaremos y te contactaremos para estudiar contigo el siguiente paso. Enviar una consulta no implica contratar ningún servicio.'
                : 'Puedes contarnos qué necesitas o contactar directamente por teléfono y WhatsApp.'}
            </p>
            <a href={valid ? '/' : '/consulta'} className="mt-9 inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-[#245E2A]">
              {valid ? 'Volver al inicio' : 'Solicitar información'}
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <MobileContactBar />
    </div>
  );
}
