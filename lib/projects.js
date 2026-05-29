export const projectCategories = [
  'Instalaciones eléctricas',
  'Cuadros eléctricos',
  'Iluminación',
  'Telecomunicaciones',
  'Porteros y videoporteros',
  'Asesoría energética',
  'Otros trabajos',
];

export const projects = [];

export const featuredProjects = projects.filter((project) => project.published && project.featured);
export const publishedProjects = projects.filter((project) => project.published);
