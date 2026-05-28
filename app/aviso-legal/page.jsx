import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Aviso legal',
};

export default function AvisoLegalPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <Header />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black tracking-[-.05em] sm:text-5xl">Aviso legal</h1>
        <div className="mt-8 space-y-5 text-sm leading-7 text-neutral-700">
          <p>Esta página es una plantilla inicial y debe revisarse antes de la publicación definitiva.</p>
          <p><strong>Titular:</strong> Electricidad Lakuntza.</p>
          <p><strong>Contacto:</strong> 649 853 448 · eleclakuntza@yahoo.es.</p>
          <p><strong>Actividad:</strong> instalaciones eléctricas, telecomunicaciones y asesoría energética.</p>
          <p>El contenido de esta web tiene carácter informativo. La prestación de servicios se valorará según disponibilidad, alcance del trabajo y condiciones concretas de cada solicitud.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
