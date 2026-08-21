import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ContactStrip } from '@/components/sections/ContactStrip';
import { ServicesGrid } from '@/components/sections/ServicesGrid';
import { getSiteContent } from '@/content';
import { isLocale } from '@/lib/locale';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const content = getSiteContent(locale);
  return {
    title: content.services.heading.title,
    description: content.services.heading.lead,
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const content = getSiteContent(locale);

  return (
    <>
      <ServicesGrid locale={locale} content={content} />
      <ContactStrip locale={locale} content={content} />
    </>
  );
}
