import { siteUrl } from '@/lib/site';
import { servicePages } from '@/lib/servicePages';

export default function sitemap() {
  const serviceRoutes = servicePages.map((service) => ({
    path: '/servicios/' + service.slug,
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  const routes = [
    { path: '', changeFrequency: 'monthly', priority: 1 },
    { path: '/servicios', changeFrequency: 'monthly', priority: 0.9 },
    ...serviceRoutes,
    { path: '/revision-factura-luz-gas', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/zona-servicio', changeFrequency: 'monthly', priority: 0.85 },
    { path: '/trabajos-realizados', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/aviso-legal', changeFrequency: 'yearly', priority: 0.2 },
    { path: '/privacidad', changeFrequency: 'yearly', priority: 0.2 },
    { path: '/cookies', changeFrequency: 'yearly', priority: 0.2 },
  ];

  return routes.map((route) => ({
    url: siteUrl + route.path,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
