import './globals.css';

const siteUrl = 'https://electricidad-lakuntza-web.vercel.app';

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'Electrician',
  name: 'Electricidad Lakuntza',
  alternateName: 'Elektrizitatea',
  url: siteUrl,
  image: `${siteUrl}/logo-lakuntza.png`,
  logo: `${siteUrl}/logo-lakuntza.png`,
  telephone: '+34 649 853 448',
  email: 'eleclakuntza@yahoo.es',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Lakuntza',
    addressRegion: 'Navarra',
    addressCountry: 'ES',
  },
  areaServed: ['Lakuntza', 'Sakana', 'Navarra', 'Gipuzkoa'],
  description:
    'Instalaciones eléctricas, telecomunicaciones y asesoría energética en Lakuntza, Sakana, Navarra y zonas cercanas. Empresa delegada de Fenie Energía para contratación de luz y gas.',
  makesOffer: [
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Instalaciones eléctricas' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Telecomunicaciones' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Asesoría energética y comparación de facturas' } },
  ],
};

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Electricidad Lakuntza | Elektrizitatea',
    template: '%s | Electricidad Lakuntza',
  },
  description:
    'Instalaciones eléctricas, telecomunicaciones y asesoría energética en Lakuntza, Sakana, Navarra y zonas cercanas. Empresa delegada de Fenie Energía para contratación de luz y gas.',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/logo-lakuntza.png',
    shortcut: '/logo-lakuntza.png',
    apple: '/logo-lakuntza.png',
  },
  openGraph: {
    title: 'Electricidad Lakuntza | Elektrizitatea',
    description:
      'Instalaciones eléctricas, telecomunicaciones y asesoría energética en Lakuntza, Sakana y Navarra.',
    url: siteUrl,
    siteName: 'Electricidad Lakuntza',
    type: 'website',
    locale: 'es_ES',
    images: [
      {
        url: '/logo-lakuntza.png',
        width: 992,
        height: 1075,
        alt: 'Electricidad Lakuntza',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Electricidad Lakuntza | Elektrizitatea',
    description:
      'Instalaciones eléctricas, telecomunicaciones y asesoría energética en Lakuntza, Sakana y Navarra.',
    images: ['/logo-lakuntza.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
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
