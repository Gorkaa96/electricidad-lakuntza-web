export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.electricidadlakuntza.com';

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
    'Agentes de Feníe Energía para luz y gas, comerciales de alarmas Movistar Prosegur e instaladores de cargadores eléctricos. Asesoría energética realizada por Electricidad Lakuntza.',
};
