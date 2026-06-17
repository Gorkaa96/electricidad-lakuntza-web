import { ArrowRight, CheckCircle2, MapPin, MessageCircle, Phone } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Badge from '@/components/Badge';
import MobileContactBar from '@/components/MobileContactBar';

const whatsappText = encodeURIComponent('Hola Electricidad Lakuntza. Quiero hacer una consulta desde la web.');
const whatsappHref = `https://wa.me/34649853448?text=${whatsappText}`;
const mapsHref = 'https://www.google.com/maps/search/?api=1&query=Uriz%20Kalea%2027%2031830%20Lakuntza%20Navarra';

const zones = [
  {
    title: 'Navarra',
    text: 'Servicio para viviendas, comunidades, comercios y pequeñas empresas, con especial cercanía en Lakuntza, Sakana y alrededores.',
  },
  {
    title: 'País Vasco',
    text: 'Atención en trabajos eléctricos, telecomunicaciones y asesoría energética valorando ubicación, alcance y disponibilidad.',
  },
  {
    title: 'Lakuntza y Sakana',
    text: 'Base local en Uriz Kalea, 27, desde donde se atienden solicitudes cercanas con trato directo y comunicación rápida.',
  },
];

const services = [
  'Instalaciones eléctricas',
  'Averías y mantenimiento',
  'Cuadros eléctricos',
  'Redes de datos y telecomunicaciones',
  'Porteros y videoporteros',
  'Revisión de facturas de luz y gas',
];

export const metadata = {
  title: 'Zona de servicio',
  description:
    'Electricidad Lakuntza presta servicio en Navarra y País Vasco desde Lakuntza: instalaciones eléctricas, telecomunicaciones y asesoría energética.',
};

export default function ZonaServicioPage() {
  const areaSchema = {
    '@context': 'https://schema.org',
    '@type': 'Electrician',
    name: 'Electricidad Lakuntza',
    telephone: '+34 649 853 448',
    email: 'eleclakuntza@yahoo.es',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Uriz Kalea, 27',
      postalCode: '31830',
      addressLocality: 'Lakuntza',
      addressRegion: 'Navarra',
      addressCountry: 'ES',
    },
    areaServed: ['Navarra', 'País Vasco', 'Lakuntza', 'Sakana'],
  };

  return (
    <div className="min-h-screen bg-white pb-24 text-neutral-950 md:pb-0">
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(areaSchema) }} />
      <main>
        <section className="relative isolate overflow-hidden bg-neutral-950 pt-32 text-white">
          <div className="hero-grid absolute inset-0 opacity-30" />
          <div className="absolute -right-44 top-12 h-[28rem] w-[28rem] rounded-full bg-lakuntza-green/15 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
            <Badge dark><MapPin size={14} /> Zona de servicio</Badge>
            <h1 className="mt-6 max-w-5xl text-5xl font-black leading-[.95] tracking-[-.06em] sm:text-7xl">
              Servicio en Navarra y País Vasco desde Lakuntza.
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-white/75">
              Electricidad Lakuntza atiende instalaciones eléctricas, telecomunicaciones y asesoría energética para particulares, comunidades, comercios y pequeñas empresas.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="#contacto-zona" className="inline-flex items-center justify-center rounded-2xl bg-lakuntza-green px-6 py-4 text-sm font-black text-white shadow-green transition hover:bg-lakuntza-greenDark">
                Consultar disponibilidad <ArrowRight className="ml-2" size={18} />
              </a>
              <a href={mapsHref} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-sm font-black text-white transition hover:bg-white/15">
                Ver ubicación
              </a>
            </div>
          </div>
        </section>

        <section className="bg-lakuntza-mist py-20 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 xl:grid-cols-12 xl:px-8">
            <article className="rounded-[2rem] border border-neutral-200 bg-white p-7 shadow-card sm:p-10 xl:col-span-7">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-lakuntza-greenDark">Cobertura actual</p>
              <h2 className="mt-4 text-4xl font-black leading-[.95] tracking-[-.055em] text-neutral-950 sm:text-5xl">
                Atención cercana y desplazamientos valorados caso a caso.
              </h2>
              <p className="mt-6 text-base leading-8 text-neutral-600">
                La empresa está ubicada en Uriz Kalea, 27, 31830 Lakuntza, Navarra. Desde esta base se atienden trabajos en Navarra y País Vasco, valorando en cada solicitud el tipo de servicio, urgencia, disponibilidad y desplazamiento.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {zones.map((zone) => (
                  <div key={zone.title} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                    <h3 className="font-black text-neutral-950">{zone.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-neutral-600">{zone.text}</p>
                  </div>
                ))}
              </div>
            </article>

            <aside className="rounded-[2rem] border border-neutral-200 bg-white p-7 shadow-card sm:p-10 xl:col-span-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-lakuntza-greenDark">Servicios disponibles</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-neutral-950">Qué puedes solicitar</h2>
              <div className="mt-8 grid gap-3">
                {services.map((item) => (
                  <div key={item} className="flex gap-3 rounded-2xl bg-neutral-50 p-4 text-sm font-bold text-neutral-700">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-lakuntza-green" size={18} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section id="contacto-zona" className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <Badge>Contacto</Badge>
            <h2 className="mt-5 text-4xl font-black leading-[.95] tracking-[-.055em] text-neutral-950 sm:text-5xl">Consulta tu caso concreto.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-neutral-600">
              Indica el tipo de trabajo, ubicación aproximada y urgencia para valorar la disponibilidad y los siguientes pasos.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a href="tel:+34649853448" className="inline-flex items-center justify-center rounded-2xl bg-neutral-950 px-6 py-4 text-sm font-black text-white transition hover:bg-lakuntza-greenDark">
                <Phone className="mr-2" size={18} /> Llamar
              </a>
              <a href={whatsappHref} className="inline-flex items-center justify-center rounded-2xl bg-lakuntza-green px-6 py-4 text-sm font-black text-white shadow-green transition hover:bg-lakuntza-greenDark">
                <MessageCircle className="mr-2" size={18} /> WhatsApp
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
