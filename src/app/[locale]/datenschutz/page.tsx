import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { LEGAL } from '@/content/legal';
import { NAP } from '@/content/shared/nap';
import { isLocale } from '@/lib/locale';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: LEGAL[locale].privacyTitle, robots: { index: false, follow: true } };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = LEGAL[locale];

  const sections = [
    { id: 'form', heading: t.formDataHeading, body: t.formDataBody },
    { id: 'basis', heading: t.legalBasisHeading, body: t.legalBasisBody },
    { id: 'hosting', heading: t.hostingHeading, body: t.hostingBody },
    { id: 'retention', heading: t.retentionHeading, body: t.retentionBody },
    { id: 'tracking', heading: t.noTrackingHeading, body: t.noTrackingBody },
  ];

  return (
    <section className="bg-surface section">
      <div className="mx-auto max-w-prose">
        <h1 className="text-display-lg text-text-heading">{t.privacyTitle}</h1>
        <p className="mt-3 text-lead text-text-secondary">{t.privacyLead}</p>

        <div className="mt-10 flex flex-col gap-8">
          <div>
            <h2 className="text-title text-text-heading">{t.controllerHeading}</h2>
            <address className="mt-2 flex flex-col gap-1 not-italic text-body text-text-secondary">
              <span>{NAP.tradeName}</span>
              <bdi dir="ltr">
                {NAP.street}
                <br />
                {NAP.postalCode} {NAP.city}
              </bdi>
              <a href={`mailto:${NAP.email}`} className="focus-ring w-fit rounded-xs hover:text-text-heading">
                <bdi dir="ltr">{NAP.email}</bdi>
              </a>
            </address>
          </div>

          {sections.map((section) => (
            <div key={section.id}>
              <h2 className="text-title text-text-heading">{section.heading}</h2>
              <p className="mt-2 text-body text-text-secondary">{section.body}</p>
            </div>
          ))}

          <div>
            <h2 className="text-title text-text-heading">{t.rightsHeading}</h2>
            <p className="mt-2 text-body text-text-secondary">{t.rightsBody}</p>
            <ul className="mt-3 flex list-disc flex-col gap-1.5 ps-5">
              {t.rightsList.map((right) => (
                <li key={right} className="text-body text-text-secondary">
                  {right}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
