/**
 * Quick-contact row plus the NAP info strip.
 *
 * WhatsApp brand green #25d366 is 1.98:1 on white and fails WCAG outright, so
 * the button uses WhatsApp's own darker #128c7e (4.14:1) — recognisably
 * WhatsApp, actually readable.
 *
 * The wa.me link is prefilled, so the user never faces an empty message box and
 * the enquiry arrives already labelled.
 */

import { Icon } from '@/components/ui/Icon';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { NAP } from '@/content/shared/nap';
import { formatHours, waLink } from '@/lib/format';
import type { Locale, SiteContent } from '@/types/content';

export function ContactStrip({ locale, content }: { locale: Locale; content: SiteContent }) {
  const { contact, info } = content;
  const hours = formatHours(NAP.hours, locale);
  const whatsappHref = waLink(NAP.phoneDigits, contact.heading.title);

  return (
    <section id="kontakt" className="bg-surface-warm section">
      <div className="mx-auto max-w-content">
        <SectionHeading heading={contact.heading} />

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex min-h-12 items-center gap-2 rounded-md bg-[#128c7e] px-5 text-body-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90"
          >
            <Icon name="MessagesSquare" size={19} />
            {contact.quickContact.whatsapp}
          </a>

          <a
            href={`tel:${NAP.phoneE164}`}
            className="focus-ring inline-flex min-h-12 items-center gap-2 rounded-md bg-brand px-5 text-body-sm font-semibold text-text-on-brand transition-colors duration-200 hover:bg-brand-hover"
          >
            <Icon name="Phone" size={19} />
            {contact.quickContact.call}
          </a>

          <a
            href={`mailto:${NAP.email}`}
            className="focus-ring inline-flex min-h-12 items-center gap-2 rounded-md border border-border-strong px-5 text-body-sm font-semibold text-text-heading transition-colors duration-200 hover:bg-surface-sunken"
          >
            <Icon name="Mail" size={19} />
            {contact.quickContact.email}
          </a>
        </div>

        <p className="mt-4 text-body-sm text-text-muted">{contact.responseNote}</p>

        <div className="mt-12 grid gap-8 rounded-xl border border-border-subtle bg-surface-raised p-7 sm:grid-cols-3">
          <div>
            <h3 className="flex items-center gap-2 text-eyebrow text-text-muted">
              <Icon name="Clock" size={16} />
              {info.hoursTitle}
            </h3>
            <dl className="mt-3 flex flex-col gap-1.5">
              {hours.map((row) => (
                <div key={row.day} className="flex items-baseline justify-between gap-3">
                  <dt className="text-body-sm text-text-secondary">{row.dayLabel}</dt>
                  <dd className="text-body-sm text-text-body tabular-nums">
                    {row.isClosed ? info.closedLabel : <bdi dir="ltr">{row.range}</bdi>}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-eyebrow text-text-muted">
              <Icon name="MapPin" size={16} />
              {info.addressTitle}
            </h3>
            <address className="mt-3 not-italic">
              <bdi dir="ltr" className="text-body-sm text-text-secondary">
                {NAP.street}
                <br />
                {NAP.postalCode} {NAP.city}
              </bdi>
            </address>
            <a
              href={NAP.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring mt-2 inline-block rounded-xs text-body-sm font-semibold text-accent-text hover:text-accent-text-strong"
            >
              {info.mapsLabel}
            </a>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-eyebrow text-text-muted">
              <Icon name="Phone" size={16} />
              {info.contactTitle}
            </h3>
            <div className="mt-3 flex flex-col gap-2">
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
            </div>
          </div>
        </div>

        <p className="mt-4 text-caption text-text-muted">{info.hoursNote}</p>
      </div>
    </section>
  );
}
