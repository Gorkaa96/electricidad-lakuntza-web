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
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Contratación de luz con Feníe Energía' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Contratación de gas con Feníe Energía' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Asesoramiento sobre alarmas Movistar Prosegur' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Cargadores eléctricos, estudio y presupuesto' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Asesoría energética' } },
  ],
};

// Dejar el dominio provisional fuera de buscadores hasta el lanzamiento oficial.
const publicLaunchEnabled = process.env.NEXT_PUBLIC_PUBLICATION_ENABLED === 'true';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Luz, gas, alarmas y cargadores | Electricidad Lakuntza',
    template: '%s | Electricidad Lakuntza',
  },
  description: siteConfig.description,
  keywords: [
    'Electricidad Lakuntza',
    'cargadores eléctricos Navarra',
    'instalación cargadores eléctricos',
    'alarmas Movistar Prosegur',
    'luz y gas Fenie Energía',
    'asesoría energética',
    'Feníe Energía',
    'revisión gratuita factura de luz',
    'comparar factura de gas',
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
    title: 'Luz, gas, alarmas y cargadores | Electricidad Lakuntza',
    description:
      'Luz, gas, alarmas, cargadores eléctricos y asesoría energética con atención directa a través de Feníe Energía.',
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
      'Luz, gas, alarmas, cargadores eléctricos y asesoría energética con atención cercana.',
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
