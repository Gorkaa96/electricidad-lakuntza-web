import './globals.css';
import { siteConfig, siteUrl } from '@/lib/site';

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'Electrician',
  name: siteConfig.name,
  alternateName: siteConfig.alternateName,
  url: siteUrl,
  image: `${siteUrl}/logo-lakuntza.png`,
  logo: `${siteUrl}/logo-lakuntza.png`,
  telephone: siteConfig.phoneInternational,
  email: siteConfig.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: siteConfig.address.street,
    postalCode: siteConfig.address.postalCode,
    addressLocality: siteConfig.address.locality,
    addressRegion: siteConfig.address.region,
    addressCountry: siteConfig.address.country,
  },
  areaServed: siteConfig.areaServed,
  description: siteConfig.description,
  makesOffer: [
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Instalaciones eléctricas' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Telecomunicaciones' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Asesoría energética y comparación de facturas' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Contratación de luz y gas' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Asesoramiento sobre alarmas Movistar Prosegur a través de Feníe Energía' } },
  ],
};

// Dejar el dominio provisional fuera de buscadores hasta el lanzamiento oficial.
const publicLaunchEnabled = process.env.NEXT_PUBLIC_PUBLICATION_ENABLED === 'true';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Luz, gas y alarmas | Electricidad Lakuntza',
    template: '%s | Electricidad Lakuntza',
  },
  description: siteConfig.description,
  keywords: [
    'Electricidad Lakuntza',
    'electricista Lakuntza',
    'electricista Navarra',
    'electricista País Vasco',
    'instalaciones eléctricas Navarra',
    'instalaciones eléctricas País Vasco',
    'telecomunicaciones Navarra',
    'asesoría energética Navarra',
    'Feníe Energía Navarra',
    'comparar factura luz gas',
  ],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: 'Luz, gas y alarmas | Electricidad Lakuntza',
    description:
      'Luz, gas y asesoramiento para alarmas Movistar Prosegur a través de Feníe Energía. Electricidad y telecomunicaciones en Navarra.',
    url: siteUrl,
    siteName: siteConfig.name,
    type: 'website',
    locale: 'es_ES',
    images: [
      {
        url: '/logo-lakuntza.png',
        width: 1024,
        height: 1024,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Luz, gas y alarmas | Electricidad Lakuntza',
    description:
      'Luz, gas y alarmas con atención directa; instalaciones eléctricas y telecomunicaciones en Navarra y País Vasco.',
    images: ['/logo-lakuntza.png'],
  },
  robots: {
    index: publicLaunchEnabled,
    follow: publicLaunchEnabled,
    googleBot: {
      index: publicLaunchEnabled,
      follow: publicLaunchEnabled,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
