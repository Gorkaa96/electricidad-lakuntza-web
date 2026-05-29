const siteUrl = 'https://electricidad-lakuntza-web.vercel.app';

export default function sitemap() {
  const routes = ['', '/aviso-legal', '/privacidad', '/cookies'];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'monthly' : 'yearly',
    priority: route === '' ? 1 : 0.3,
  }));
}
