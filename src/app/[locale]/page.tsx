import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Cleaning } from '@/components/sections/Cleaning';
import { ContactStrip } from '@/components/sections/ContactStrip';
import { Hero } from '@/components/sections/Hero';
import { Pillars } from '@/components/sections/Pillars';
import { Process } from '@/components/sections/Process';
import { ServicesGrid } from '@/components/sections/ServicesGrid';
import { Scope } from '@/components/sections/Scope';
import { Why } from '@/components/sections/Why';
import { getSiteContent } from '@/content';
import { isLocale } from '@/lib/locale';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { meta } = getSiteContent(locale);
  // `absolute` opts out of the layout's "%s - Zukunft Service" template, which
  // would otherwise duplicate the brand name already inside homeTitle.
  return { title: { absolute: meta.homeTitle }, description: meta.homeDescription };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const content = getSiteContent(locale);

  return (
    <>
      <Hero locale={locale} content={content} />
      <Pillars locale={locale} content={content} />
      <Process content={content} />
      <ServicesGrid locale={locale} content={content} />
      <Why content={content} />
      <Cleaning locale={locale} content={content} />
      <Scope content={content} />
      <ContactStrip locale={locale} content={content} />
    </>
  );
}
