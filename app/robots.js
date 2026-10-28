import { siteUrl } from '@/lib/site';
const publicLaunchEnabled = process.env.NEXT_PUBLIC_PUBLICATION_ENABLED === 'true';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: publicLaunchEnabled ? '/' : undefined,
      disallow: publicLaunchEnabled ? ['/admin/', '/revision-factura-luz-gas/gracias'] : '/',
        disallow: ['/admin/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
