import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ContactForm } from '@/components/form/ContactForm';
import { ContactStrip } from '@/components/sections/ContactStrip';
import { SectionHeading } from '@/components/ui/SectionHeading';
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
    title: content.contact.heading.title,
    description: content.contact.heading.lead,
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const content = getSiteContent(locale);

  return (
    <>
      <section className="bg-surface section">
        <div className="mx-auto max-w-content">
          <SectionHeading heading={content.contact.heading} as="h1" />
          <div className="mt-10">
            <ContactForm locale={locale} content={content} />
          </div>
        </div>
      </section>
      <ContactStrip locale={locale} content={content} />
    </>
  );
}
