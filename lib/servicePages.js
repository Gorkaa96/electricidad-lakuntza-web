export const servicePages = [
  {
    slug: 'instalaciones-electricas',
    title: 'Instalaciones eléctricas',
    shortTitle: 'Instalaciones eléctricas',
    eyebrow: 'Electricidad',
    description: 'Instalaciones eléctricas, reformas, averías, cuadros eléctricos, iluminación y mantenimiento para viviendas, comunidades, comercios y pequeños negocios en Navarra y País Vasco.',
    hero: 'Instalaciones eléctricas claras, seguras y bien ejecutadas.',
    intro: 'Revisamos la necesidad, explicamos la solución y realizamos el trabajo con orden, limpieza y criterio técnico. Atendemos tanto trabajos completos como ampliaciones, reformas o pequeñas actuaciones eléctricas.',
    services: ['Reformas eléctricas.', 'Nuevos puntos de luz, enchufes y mecanismos.', 'Cuadros eléctricos.', 'Iluminación interior y exterior.', 'Averías eléctricas y mantenimiento.', 'Ampliaciones y mejoras de instalación.'],
    process: ['Escuchamos la necesidad.', 'Revisamos la instalación.', 'Planteamos una solución clara.', 'Ejecutamos y comprobamos el resultado.'],
  },
  {
    slug: 'telecomunicaciones',
    title: 'Telecomunicaciones',
    shortTitle: 'Telecomunicaciones',
    eyebrow: 'Conectividad',
    description: 'Instalación y mejora de redes de datos, cableado, antenas, porteros y videoporteros para viviendas, comunidades, comercios y pequeños negocios en Navarra y País Vasco.',
    hero: 'Telecomunicaciones y conectividad preparadas para el uso diario.',
    intro: 'Una instalación de telecomunicaciones debe ser práctica, ordenada y preparada para durar. Trabajamos redes, cableado, antenas, porteros y videoporteros con una solución adaptada a cada espacio.',
    services: ['Redes de datos.', 'Cableado estructurado.', 'Puntos de red.', 'Antenas y telecomunicaciones.', 'Porteros.', 'Videoporteros.'],
    process: ['Analizamos el espacio.', 'Definimos trazado y puntos.', 'Realizamos la instalación.', 'Comprobamos el funcionamiento.'],
  },
  {
    slug: 'asesoria-energetica-luz-gas',
    title: 'Revisión de factura de luz y gas',
    shortTitle: 'Revisión factura',
    eyebrow: 'Energía',
    description: 'Revisión gratuita de facturas de luz y gas, comparación sin compromiso y acompañamiento en contratación como empresa delegada de Fenie Energía en Navarra y País Vasco.',
    hero: 'Sube tu factura de luz o gas y revisamos si puedes mejorar.',
    intro: 'La factura es la forma más rápida de empezar. Analizamos consumo, potencia, tarifa, servicios añadidos y condiciones actuales para valorar si existe una opción más adecuada. No prometemos ahorro automático: revisamos el caso y te explicamos la recomendación antes de cambiar nada.',
    services: ['Subida de factura online.', 'Preanálisis gratuito.', 'Revisión de potencia contratada.', 'Explicación de conceptos de la factura.', 'Valoración de alternativas de luz y gas.', 'Acompañamiento en contratación si conviene.'],
    process: ['Subes la factura.', 'Revisamos los datos relevantes.', 'Confirmamos si hay margen de mejora.', 'Decides sin compromiso.'],
  },
];

export function getServicePage(slug) {
  return servicePages.find((service) => service.slug === slug) || null;
}
