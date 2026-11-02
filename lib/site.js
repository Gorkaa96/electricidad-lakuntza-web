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
    'Luz, gas, alarmas Movistar Prosegur, cargadores de vehículo eléctrico y asesoría energética a través de Feníe Energía, con asesoramiento cercano desde Electricidad Lakuntza.',
};
