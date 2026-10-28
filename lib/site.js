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
  areaServed: ['Navarra', 'País Vasco'],
  description:
    'Revisión de luz y gas y asesoramiento para contratar alarmas Movistar Prosegur a través de Feníe Energía. Electricidad y telecomunicaciones desde Lakuntza.',
};
