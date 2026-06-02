import { siteUrl } from '@/lib/site';

export default function sitemap() {
  const routes = [
    { path: '', changeFrequency: 'monthly', priority: 1 },
    { path: '/trabajos-realizados', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/aviso-legal', changeFrequency: 'yearly', priority: 0.2 },
    { path: '/privacidad', changeFrequency: 'yearly', priority: 0.2 },
    { path: '/cookies', changeFrequency: 'yearly', priority: 0.2 },
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
