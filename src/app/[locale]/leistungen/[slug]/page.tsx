import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ContactStrip } from '@/components/sections/ContactStrip';
import { ServiceBlocks } from '@/components/sections/ServiceBlocks';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { getService, getServices, getSiteContent } from '@/content';
import { SERVICES_IN_ORDER, serviceIdFromSlug } from '@/content/shared/services.meta';
import { LOCALES, isLocale } from '@/lib/locale';
import { routePath, servicePath } from '@/lib/routes';

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    SERVICES_IN_ORDER.map((meta) => ({ locale, slug: meta.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const serviceId = serviceIdFromSlug(slug);
  if (!isLocale(locale) || serviceId === undefined) return {};

  const service = getService(locale, serviceId);
  return {
    title: service.seo.title,
    description: service.seo.description,
    alternates: { canonical: servicePath(locale, serviceId) },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const serviceId = serviceIdFromSlug(slug);
  if (!isLocale(locale) || serviceId === undefined) notFound();

  const content = getSiteContent(locale);
  const services = getServices(locale);
  const service = services[serviceId];
  const meta = SERVICES_IN_ORDER.find((entry) => entry.id === serviceId);
  if (meta === undefined) notFound();

  const siblings = SERVICES_IN_ORDER.filter((entry) => entry.id !== serviceId).slice(0, 3);
  const arrow = locale === 'ar' ? '←' : '→';

  return (
    <>
      <section className="border-b border-border-subtle bg-surface section">
        <div className="mx-auto max-w-content">
          <nav aria-label={content.a11y.breadcrumbLabel} className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-body-sm text-text-muted">
              <li>
                <Link
                  href={routePath(locale, 'home')}
                  className="focus-ring rounded-xs hover:text-text-heading"
                >
                  {content.meta.siteName}
                </Link>
              </li>
              <li aria-hidden="true">{arrow}</li>
              <li>
                <Link
                  href={routePath(locale, 'services')}
                  className="focus-ring rounded-xs hover:text-text-heading"
                >
                  {content.services.heading.eyebrow}
                </Link>
              </li>
              <li aria-hidden="true">{arrow}</li>
              <li aria-current="page" className="text-text-secondary">
                {service.cardTitle}
              </li>
            </ol>
          </nav>

          <div className="flex items-center gap-3">
            <Icon name={meta.icon} className="text-brand" />
            <span className="text-eyebrow text-accent-text">{service.eyebrow}</span>
          </div>

          <h1 className="mt-4 text-display-lg text-balance text-text-heading">{service.title}</h1>
          <p className="mt-5 max-w-prose text-lead text-text-secondary">{service.intro}</p>
        </div>
      </section>

      <section className="bg-surface section">
        <div className="mx-auto max-w-content">
          <ServiceBlocks blocks={service.blocks} />

          {service.closing === undefined ? null : (
            <p className="mt-10 max-w-prose text-lead text-text-heading">{service.closing}</p>
          )}

          {/* Rendered from content, never hard-coded here, so the German and
              Arabic disclaimers for a regulated service cannot drift apart. */}
          {service.legalNote === undefined ? null : (
            <p className="mt-10 flex max-w-prose items-start gap-3 rounded-lg border border-border-accent bg-brand-gold-50 p-5 text-body-sm text-text-body">
              <Icon name="ShieldCheck" size={20} className="mt-0.5 text-brand-gold-700" />
              <span>{service.legalNote}</span>
            </p>
          )}

          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={routePath(locale, 'contact')} variant="primary" size="lg">
              {content.hero.primaryCta.label}
            </ButtonLink>
            <ButtonLink href={routePath(locale, 'services')} variant="outline" size="lg">
              {content.services.heading.eyebrow}
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="bg-surface-warm section">
        <div className="mx-auto max-w-content">
          <h2 className="text-display-sm text-text-heading">{content.services.heading.title}</h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-3">
            {siblings.map((sibling) => (
              <li key={sibling.id}>
                <Link
                  href={servicePath(locale, sibling.id)}
                  className="focus-ring flex h-full flex-col gap-3 rounded-lg border border-border-subtle bg-surface-raised p-6 hover:border-border-accent"
                >
                  <Icon name={sibling.icon} size={22} className="text-brand" />
                  <h3 className="text-title text-text-heading">
                    {services[sibling.id].cardTitle}
                  </h3>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ContactStrip locale={locale} content={content} />
    </>
  );
}
