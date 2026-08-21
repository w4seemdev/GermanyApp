/**
 * Site footer: slogan, nav, legal links, and the full NAP block.
 *
 * The NAP here is the same object that feeds the LocalBusiness JSON-LD, so the
 * address a human reads and the address Google indexes cannot drift apart.
 *
 * BIDI: the phone number and the street address are Latin runs. Inside Arabic
 * copy an unisolated "+49 177 3825632" reorders and can render as "3825632 177
 * 49+". `<bdi dir="ltr">` pins them. This is a correctness fix, not styling.
 */

import Link from 'next/link';

import { NAP } from '@/content/shared/nap';
import { formatHours } from '@/lib/format';
import { navHref } from '@/lib/routes';
import type { Locale, SiteContent } from '@/types/content';

export interface FooterProps {
  locale: Locale;
  content: SiteContent;
  /** Passed in rather than read from the clock so the markup stays
   *  deterministic between server render and hydration. */
  year: number;
}

export function Footer({ locale, content, year }: FooterProps) {
  const { footer, nav, info } = content;
  const hours = formatHours(NAP.hours, locale);

  return (
    <footer className="border-t border-border-subtle bg-surface-warm">
      <div className="mx-auto max-w-page px-gutter py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <span dir="ltr" className="font-heading text-title text-text-heading">
              Zukunft&nbsp;Service
            </span>
            <p className="mt-3 text-body-sm text-text-secondary">{footer.slogan}</p>
          </div>

          <nav aria-label={footer.navTitle}>
            <h2 className="text-eyebrow text-text-muted">{footer.navTitle}</h2>
            <ul className="mt-4 flex flex-col gap-2">
              {nav.footer.map((item) => (
                <li key={item.id}>
                  <Link
                    href={navHref(item.target, locale)}
                    className="focus-ring rounded-xs text-body-sm text-text-secondary hover:text-text-heading"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-eyebrow text-text-muted">{info.hoursTitle}</h2>
            <dl className="mt-4 flex flex-col gap-1.5">
              {hours.map((row) => (
                <div key={row.day} className="flex items-baseline justify-between gap-3">
                  <dt className="text-body-sm text-text-secondary">{row.dayLabel}</dt>
                  <dd className="text-body-sm text-text-body tabular-nums">
                    {row.isClosed ? (
                      info.closedLabel
                    ) : (
                      <bdi dir="ltr">{row.range}</bdi>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-caption text-text-muted">{info.hoursNote}</p>
          </div>

          <div>
            <h2 className="text-eyebrow text-text-muted">{info.contactTitle}</h2>
            <address className="mt-4 flex flex-col gap-2 not-italic">
              <bdi dir="ltr" className="text-body-sm text-text-secondary">
                {NAP.street}
                <br />
                {NAP.postalCode} {NAP.city}
              </bdi>
              <a
                href={`tel:${NAP.phoneE164}`}
                className="focus-ring rounded-xs text-body-sm text-text-secondary hover:text-text-heading"
              >
                <bdi dir="ltr">{NAP.phoneDisplay}</bdi>
              </a>
              <a
                href={`mailto:${NAP.email}`}
                className="focus-ring rounded-xs text-body-sm text-text-secondary hover:text-text-heading"
              >
                <bdi dir="ltr">{NAP.email}</bdi>
              </a>
              <a
                href={NAP.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring rounded-xs text-body-sm text-accent-text hover:text-accent-text-strong"
              >
                {info.mapsLabel}
              </a>
            </address>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border-subtle pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-caption text-text-muted">
            {footer.copyright.replace('{year}', String(year))}
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {nav.legal.map((item) => (
              <li key={item.id}>
                <Link
                  href={navHref(item.target, locale)}
                  className="focus-ring rounded-xs text-caption font-semibold text-text-secondary hover:text-text-heading"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
