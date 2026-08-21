/**
 * LocalBusiness JSON-LD.
 *
 * For a business whose customers search "Behördenhilfe Dortmund" on a phone,
 * the knowledge panel matters more than any on-page SEO. This is built from the
 * same NAP object the footer renders, so what a human reads and what Google
 * indexes are guaranteed identical - the classic local-SEO failure is those two
 * drifting apart.
 *
 * `openingHoursSpecification` uses the client-CONFIRMED Mo–Fr 10:00–16:00, which
 * differs from the hours their current live draft publishes. Google surfaces
 * these directly, so the discrepancy is worth resolving with the client.
 *
 * Rendered with dangerouslySetInnerHTML because that is the only way to emit a
 * ld+json script. The input is entirely our own typed constants - no user
 * content reaches it - and JSON.stringify escapes the values.
 */

import { NAP } from '@/content/shared/nap';
import type { DayKey, Locale, SiteContent } from '@/types/content';
import { SITE_URL } from '@/lib/site-url';


/** schema.org expects full English day names. */
const SCHEMA_DAY: Record<DayKey, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

export function StructuredData({ locale, content }: { locale: Locale; content: SiteContent }) {
  const openingHours = NAP.hours
    .filter((hour) => hour.open !== null && hour.close !== null)
    .map((hour) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${SCHEMA_DAY[hour.day]}`,
      opens: hour.open,
      closes: hour.close,
    }));

  const data = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#organization`,
    name: NAP.tradeName,
    description: content.meta.homeDescription,
    url: `${SITE_URL}/${locale}`,
    telephone: NAP.phoneE164,
    email: NAP.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: NAP.street,
      postalCode: NAP.postalCode,
      addressLocality: NAP.city,
      addressRegion: NAP.region,
      addressCountry: NAP.country,
    },
    areaServed: { '@type': 'City', name: NAP.city },
    availableLanguage: NAP.availableLanguages.map((code) => ({
      '@type': 'Language',
      name: code === 'de' ? 'German' : 'Arabic',
      alternateName: code,
    })),
    openingHoursSpecification: openingHours,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: content.services.heading.title,
      itemListElement: content.pillars.map((pillar) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: pillar.title, description: pillar.body },
      })),
    },
    // Deliberately no aggregateRating: inventing review counts is both a lie and
    // a Google penalty. Add it only when real reviews exist.
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

