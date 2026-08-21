/**
 * The six services.
 *
 * Order, slug and icon come from SERVICE_META (locale-invariant), and only the
 * words come from the per-locale card copy - so the German and Arabic grids can
 * never disagree about which service is which or where a card links.
 *
 * The "read more" arrow is a text glyph chosen per direction rather than a
 * rotated icon: → in German, ← in Arabic, both pointing forward in reading
 * order.
 */

import Link from 'next/link';

import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getServices } from '@/content';
import { SERVICES_IN_ORDER } from '@/content/shared/services.meta';
import { servicePath } from '@/lib/routes';
import type { Locale, SiteContent } from '@/types/content';

export function ServicesGrid({ locale, content }: { locale: Locale; content: SiteContent }) {
  const services = getServices(locale);
  const arrow = locale === 'ar' ? '←' : '→';

  return (
    <section id="leistungen" className="bg-surface-warm section">
      <div className="mx-auto max-w-content">
        <SectionHeading heading={content.services.heading} />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES_IN_ORDER.map((meta, index) => {
            const service = services[meta.id];
            return (
              <li key={meta.id}>
                <Reveal delayMs={index * 60} className="h-full">
                <Link
                  href={servicePath(locale, meta.id)}
                  className="focus-ring group flex h-full flex-col gap-3 rounded-lg border border-border-subtle bg-surface-raised p-6 transition-colors duration-200 hover:border-border-accent"
                >
                  <div className="flex items-center gap-3">
                    <Icon name={meta.icon} size={22} className="text-brand" />
                    <span className="text-caption text-text-muted tabular-nums">
                      {String(meta.order).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="text-title text-text-heading">{service.cardTitle}</h3>
                  <p className="text-body-sm text-text-secondary">{service.cardDescription}</p>
                  <span className="mt-auto pt-2 text-body-sm font-semibold text-accent-text group-hover:text-accent-text-strong">
                    {content.services.detailLabel} <span aria-hidden="true">{arrow}</span>
                  </span>
                </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>

        {content.services.note === undefined ? null : (
          <p className="mt-8 text-body-sm text-text-muted">{content.services.note}</p>
        )}
      </div>
    </section>
  );
}
