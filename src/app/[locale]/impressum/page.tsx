import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Icon } from '@/components/ui/Icon';
import { LEGAL } from '@/content/legal';
import { NAP, hasUnresolvedPlaceholders, isPlaceholder } from '@/content/shared/nap';
import { isLocale } from '@/lib/locale';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  // Legal pages must never be indexed away, but they also should not compete
  // with the service pages in search.
  return { title: LEGAL[locale].imprintTitle, robots: { index: false, follow: true } };
}

/** Renders a value, or marks it visibly when it is still a «…» sentinel. */
function Value({ value }: { value: string }) {
  if (!isPlaceholder(value)) return <>{value}</>;
  return (
    <mark className="rounded-xs bg-danger-bg px-1.5 py-0.5 text-danger-fg">{value}</mark>
  );
}

export default async function ImprintPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = LEGAL[locale];

  return (
    <section className="bg-surface section">
      <div className="mx-auto max-w-prose">
        <h1 className="text-display-lg text-text-heading">{t.imprintTitle}</h1>
        <p className="mt-3 text-lead text-text-secondary">{t.imprintLead}</p>

        {hasUnresolvedPlaceholders() ? (
          <p className="mt-8 flex items-start gap-3 rounded-lg border border-danger bg-danger-bg p-5 text-body-sm text-text-body">
            <Icon name="Info" size={20} className="mt-0.5 text-danger-fg" />
            <span>{t.pendingBanner}</span>
          </p>
        ) : null}

        <div className="mt-10 flex flex-col gap-8">
          <div>
            <h2 className="text-title text-text-heading">{t.providerHeading}</h2>
            <address className="mt-2 flex flex-col gap-1 not-italic text-body text-text-secondary">
              <span>
                <Value value={NAP.legalName} />
              </span>
              <span>
                <Value value={NAP.legalForm} />
              </span>
              <bdi dir="ltr">
                {NAP.street}
                <br />
                {NAP.postalCode} {NAP.city}
              </bdi>
            </address>
          </div>

          <div>
            <h2 className="text-title text-text-heading">{t.representativeHeading}</h2>
            <p className="mt-2 text-body text-text-secondary">
              <Value value={NAP.managingDirector} />
            </p>
          </div>

          <div>
            <h2 className="text-title text-text-heading">{t.contactHeading}</h2>
            <div className="mt-2 flex flex-col gap-1 text-body text-text-secondary">
              <a href={`tel:${NAP.phoneE164}`} className="focus-ring w-fit rounded-xs hover:text-text-heading">
                <bdi dir="ltr">{NAP.phoneDisplay}</bdi>
              </a>
              <a href={`mailto:${NAP.email}`} className="focus-ring w-fit rounded-xs hover:text-text-heading">
                <bdi dir="ltr">{NAP.email}</bdi>
              </a>
            </div>
          </div>

          {NAP.registerCourt === null || NAP.registerNumber === null ? null : (
            <div>
              <h2 className="text-title text-text-heading">{t.registerHeading}</h2>
              <p className="mt-2 text-body text-text-secondary">
                {NAP.registerCourt} · {NAP.registerNumber}
              </p>
            </div>
          )}

          {NAP.vatId === null ? null : (
            <div>
              <h2 className="text-title text-text-heading">{t.vatHeading}</h2>
              <p className="mt-2 text-body text-text-secondary">
                <bdi dir="ltr">{NAP.vatId}</bdi>
              </p>
            </div>
          )}

          <div>
            <h2 className="text-title text-text-heading">{t.disputeHeading}</h2>
            <p className="mt-2 text-body text-text-secondary">{t.disputeBody}</p>
          </div>

          <div>
            <h2 className="text-title text-text-heading">{t.liabilityHeading}</h2>
            <p className="mt-2 text-body text-text-secondary">{t.liabilityBody}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
