// Catálogo comercial visible. El trabajo eléctrico tradicional sigue disponible en
// lib/servicePages.js, pero no forma parte de la captación pública actual.
export const commercialCatalog = [
  {
    slug: 'luz',
    title: 'Luz',
    eyebrow: 'Energía',
    description: 'Revisamos tu factura y comparamos, a través del CRM oficial de Feníe Energía, sus ofertas disponibles para tu suministro.',
    href: '/revision-factura-luz-gas?servicio=luz',
    action: 'Consultar mi tarifa',
  },
  {
    slug: 'gas',
    title: 'Gas',
    eyebrow: 'Energía',
    description: 'Estudiamos tu consumo y comparamos las ofertas de gas disponibles en el CRM oficial de Feníe Energía antes de recomendar un cambio.',
    href: '/revision-factura-luz-gas?servicio=gas',
    action: 'Revisar mi gas',
  },
  {
    slug: 'alarmas',
    title: 'Alarmas',
    eyebrow: 'Seguridad',
    description: 'Comercializamos alarmas a través de Feníe Energía. Movistar Prosegur realiza la instalación y presta el servicio de seguridad.',
    href: '/alarmas-movistar-prosegur',
    action: 'Consultar una alarma',
  },
  {
    slug: 'cargadores',
    title: 'Cargadores eléctricos',
    eyebrow: 'Movilidad',
    description: 'En Electricidad Lakuntza estudiamos, presupuestamos e instalamos puntos de recarga para viviendas, garajes y negocios.',
    href: '/cargadores-electricos',
    action: 'Pedir asesoramiento',
  },
  {
    slug: 'asesoria',
    title: 'Asesoría energética',
    eyebrow: 'Optimización',
    description: 'Electricidad Lakuntza realiza el análisis de facturas, potencias, consumos y condiciones para ayudarte a optimizar tu suministro.',
    href: '/asesoria-energetica',
    action: 'Solicitar una revisión',
  },
];
