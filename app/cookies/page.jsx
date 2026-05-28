import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Cookies',
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <Header />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black tracking-[-.05em] sm:text-5xl">Cookies</h1>
        <div className="mt-8 space-y-5 text-sm leading-7 text-neutral-700">
          <p>Página provisional pendiente de revisión final.</p>
          <p>La web se ha preparado para poder funcionar sin cookies publicitarias. Si más adelante se añaden analíticas, mapas, píxeles o herramientas externas, habrá que actualizar esta página y añadir el aviso correspondiente.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
