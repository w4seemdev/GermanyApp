import type { MetadataRoute } from 'next';

import { SERVICES_IN_ORDER } from '@/content/shared/services.meta';
import { LOCALES } from '@/lib/locale';
import { SITE_URL } from '@/lib/site-url';


/** German segments, used in both locales - see src/lib/routes.ts. */
const STATIC_SEGMENTS = ['', 'leistungen', 'kontakt'];

/**
 * Every page in both locales, each carrying `alternates.languages` so Google
 * treats /de/x and /ar/x as one page in two languages rather than as duplicates
 * competing with each other.
 *
 * Impressum and Datenschutz are excluded: they are marked noindex, and listing
 * a noindexed URL in the sitemap is a contradictory signal.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...STATIC_SEGMENTS,
    ...SERVICES_IN_ORDER.map((meta) => `leistungen/${meta.slug}`),
  ];

  return paths.flatMap((path) =>
    LOCALES.map((locale) => {
      const suffix = path === '' ? '' : `/${path}`;
      return {
        url: `${SITE_URL}/${locale}${suffix}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: path === '' ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((alt) => [alt, `${SITE_URL}/${alt}${suffix}`]),
          ),
        },
      };
    }),
  );
}
