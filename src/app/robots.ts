import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zukunftservice.de';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Belt and braces: these already send X-Robots-Tag noindex via metadata.
      disallow: ['/de/impressum', '/ar/impressum', '/de/datenschutz', '/ar/datenschutz'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
