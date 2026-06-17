import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2, Leaf, MessageCircle, PlugZap, Wifi } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Badge from '@/components/Badge';
import MobileContactBar from '@/components/MobileContactBar';
import { getServicePage, servicePages } from '@/lib/servicePages';

const whatsappText = encodeURIComponent('Hola Electricidad Lakuntza. Quiero hacer una consulta desde la web.');
const whatsappHref = `https://wa.me/34649853448?text=${whatsappText}`;

const iconBySlug = {
  'instalaciones-electricas': PlugZap,
  telecomunicaciones: Wifi,
  'asesoria-energetica-luz-gas': Leaf,
};

export function generateStaticParams() {
  return servicePages.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }) {
  const service = getServicePage(params.slug);

  if (!service) return { title: 'Servicio no encontrado' };

  return {
    title: service.title,
    description: service.description,
    alternates: {
      canonical: `/servicios/${service.slug}`,
    },
    openGraph: {
      title: `${service.title} | Electricidad Lakuntza`,
      description: service.description,
    },
  };
}

export default function ServiceDetailPage({ params }) {
  const service = getServicePage(params.slug);
  if (!service) notFound();

  const Icon = iconBySlug[service.slug] || PlugZap;

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    provider: {
      '@type': 'LocalBusiness',
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
    },
    areaServed: ['Navarra', 'País Vasco'],
  };

  return (
    <div className="min-h-screen bg-white pb-24 text-neutral-950 md:pb-0">
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <main>
        <section className="relative isolate overflow-hidden bg-neutral-950 pt-32 text-white">
          <div className="hero-grid absolute inset-0 opacity-30" />
          <div className="absolute -right-44 top-12 h-[28rem] w-[28rem] rounded-full bg-lakuntza-green/15 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 sm:px-6 xl:grid-cols-12 xl:items-end xl:px-8">
            <div className="xl:col-span-8">
              <Badge dark>{service.eyebrow}</Badge>
              <h1 className="mt-6 max-w-5xl text-5xl font-black leading-[.95] tracking-[-.06em] sm:text-7xl">
                {service.hero}
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-white/75">{service.intro}</p>
            </div>
            <div className="xl:col-span-4">
              <div className="rounded-[2rem] border border-white/10 bg-white/[.07] p-7">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-lakuntza-green text-white shadow-green">
                  <Icon size={30} />
                </div>
                <p className="text-sm leading-7 text-white/70">Atención directa desde Lakuntza para Navarra y País Vasco.</p>
                <a href="#contacto-servicio" className="mt-6 inline-flex items-center justify-center rounded-2xl bg-lakuntza-green px-5 py-3 text-sm font-black text-white transition hover:bg-lakuntza-greenDark">
                  Consultar servicio <ArrowRight className="ml-2" size={17} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-lakuntza-mist py-20 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 xl:grid-cols-12 xl:px-8">
            <article className="rounded-[2rem] border border-neutral-200 bg-white p-7 shadow-card sm:p-10 xl:col-span-7">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-lakuntza-greenDark">Qué incluye</p>
              <h2 className="mt-4 text-4xl font-black leading-[.95] tracking-[-.055em] text-neutral-950 sm:text-5xl">Servicios principales</h2>
              <div className="mt-8 grid gap-4">
                {service.services.map((item) => (
                  <div key={item} className="flex gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm font-bold text-neutral-700">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-lakuntza-green" size={18} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </article>

            <aside className="rounded-[2rem] border border-neutral-200 bg-white p-7 shadow-card sm:p-10 xl:col-span-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-lakuntza-greenDark">Proceso</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.05em] text-neutral-950">Cómo trabajamos</h2>
              <div className="mt-8 grid gap-4">
                {service.process.map((item, index) => (
                  <div key={item} className="rounded-2xl bg-neutral-50 p-4">
                    <p className="text-xs font-black text-lakuntza-greenDark">{String(index + 1).padStart(2, '0')}</p>
                    <p className="mt-2 text-sm font-bold leading-6 text-neutral-700">{item}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section id="contacto-servicio" className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <Badge>Contacto</Badge>
            <h2 className="mt-5 text-4xl font-black leading-[.95] tracking-[-.055em] text-neutral-950 sm:text-5xl">¿Necesitas este servicio?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-neutral-600">
              Cuéntanos qué necesitas, dónde se realizará el trabajo y si tienes alguna foto o factura que ayude a valorarlo mejor.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a href="tel:+34649853448" className="inline-flex items-center justify-center rounded-2xl bg-neutral-950 px-6 py-4 text-sm font-black text-white transition hover:bg-lakuntza-greenDark">
                Llamar al 649 853 448
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
