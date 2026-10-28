export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://electricidad-lakuntza-web.vercel.app';

export const siteConfig = {
  name: 'Electricidad Lakuntza',
  alternateName: 'Elektrizitatea',
  url: siteUrl,
  phoneDisplay: '649 853 448',
  phoneInternational: '+34 649 853 448',
  email: 'eleclakuntza@yahoo.es',
  address: {
    street: 'Uriz Kalea, 27',
    postalCode: '31830',
    locality: 'Lakuntza',
    region: 'Navarra',
    country: 'ES',
  },
  areaServed: ['Lakuntza', 'Sakana', 'Navarra', 'zonas cercanas del País Vasco'],
  description:
    'Revisamos facturas de luz y gas y estudiamos alternativas con Feníe Energía como empresa delegada. Instalaciones eléctricas y telecomunicaciones desde Lakuntza.',
};
