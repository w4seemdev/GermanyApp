import { notFound } from 'next/navigation';

import { Hero } from '@/components/sections/Hero';
import { getSiteContent } from '@/content';
import { isLocale } from '@/lib/locale';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const content = getSiteContent(locale);

  return <Hero locale={locale} content={content} />;
}
