// Catálogo comercial visible. El trabajo eléctrico tradicional sigue disponible en
// lib/servicePages.js, pero no forma parte de la captación pública actual.
export const commercialCatalog = [
  {
    slug: 'luz',
    title: 'Luz',
    eyebrow: 'Energía',
    description: 'Revisamos tu factura y las condiciones de tu suministro. Si existe una opción adecuada en Feníe Energía, te la explicamos antes de contratar.',
    href: '/revision-factura-luz-gas?servicio=luz',
    action: 'Consultar mi tarifa',
  },
  {
    slug: 'gas',
    title: 'Gas',
    eyebrow: 'Energía',
    description: 'Estudiamos tu consumo, el término fijo y el variable, y valoramos una propuesta de gas adaptada a tu situación.',
    href: '/revision-factura-luz-gas?servicio=gas',
    action: 'Revisar mi gas',
  },
  {
    slug: 'alarmas',
    title: 'Alarmas',
    eyebrow: 'Seguridad',
    description: 'Te orientamos sobre Movistar Prosegur Alarmas comercializadas a través de Feníe Energía, con condiciones y elegibilidad a confirmar.',
    href: '/alarmas-movistar-prosegur',
    action: 'Consultar una alarma',
  },
  {
    slug: 'cargadores',
    title: 'Cargadores eléctricos',
    eyebrow: 'Movilidad',
    description: 'Te ayudamos a valorar un punto de recarga para casa, garaje o negocio. Estudio previo y presupuesto según la instalación.',
    href: '/cargadores-electricos',
    action: 'Pedir asesoramiento',
  },
  {
    slug: 'asesoria',
    title: 'Asesoría energética',
    eyebrow: 'Optimización',
    description: 'Analizamos facturas, potencia, consumos y condiciones del contrato para detectar ajustes o alternativas que merezcan la pena.',
    href: '/asesoria-energetica',
    action: 'Solicitar una revisión',
  },
];
