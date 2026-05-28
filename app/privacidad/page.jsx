import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Privacidad',
};

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <Header />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black tracking-[-.05em] sm:text-5xl">Privacidad</h1>
        <div className="mt-8 space-y-5 text-sm leading-7 text-neutral-700">
          <p>Página legal provisional pendiente de revisión final.</p>
          <p>La información recibida por teléfono, email, WhatsApp o formulario se usará para responder a la solicitud y prestar el servicio solicitado.</p>
          <p>Antes de publicar la web con dominio propio conviene completar esta página con el texto legal definitivo.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
