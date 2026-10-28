import { siteUrl } from '@/lib/site';

const publicLaunchEnabled = process.env.NEXT_PUBLIC_PUBLICATION_ENABLED === 'true';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        ...(publicLaunchEnabled
          ? { allow: '/', disallow: ['/admin/', '/revision-factura-luz-gas/gracias'] }
          : { disallow: '/' }),
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
