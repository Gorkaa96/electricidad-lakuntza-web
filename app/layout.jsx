import './globals.css';

export const metadata = {
  metadataBase: new URL('https://electricidad-lakuntza-web.vercel.app'),
  title: {
    default: 'Electricidad Lakuntza | Elektrizitatea',
    template: '%s | Electricidad Lakuntza',
  },
  description:
    'Instalaciones eléctricas, telecomunicaciones y asesoría energética en Lakuntza, Sakana, Navarra y zonas cercanas. Empresa delegada de Fenie Energía para contratación de luz y gas.',
  icons: {
    icon: '/logo-lakuntza.png',
    shortcut: '/logo-lakuntza.png',
    apple: '/logo-lakuntza.png',
  },
  openGraph: {
    title: 'Electricidad Lakuntza | Elektrizitatea',
    description:
      'Instalaciones eléctricas, telecomunicaciones y asesoría energética con atención cercana y profesional.',
    type: 'website',
    locale: 'es_ES',
    images: ['/logo-lakuntza.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
