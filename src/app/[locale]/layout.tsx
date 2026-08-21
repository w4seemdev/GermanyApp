/**
 * Root layout. It lives under [locale] rather than at app/ so that `lang` and
 * `dir` are known at render time and emitted server-side — an LTR-then-RTL
 * repaint on first load is the single most visible bilingual bug there is.
 *
 * FONTS are self-hosted by next/font at build time. Nothing is ever requested
 * from fonts.gstatic.com at runtime, which keeps visitor IPs out of Google's
 * logs — the exposure LG München I, 3 O 17493/20 turned into damages.
 */

import type { Metadata } from 'next';
import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic, IBM_Plex_Serif } from 'next/font/google';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import '../globals.css';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { WhatsAppFab } from '@/components/layout/WhatsAppFab';
import { StructuredData } from '@/components/seo/StructuredData';
import { getSiteContent } from '@/content';
import { DIRECTION, LOCALES, isLocale } from '@/lib/locale';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zukunftservice.de';

const sans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

const serif = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-serif',
  display: 'swap',
});

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600'],
  variable: '--font-arabic',
  display: 'swap',
});

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const { meta } = getSiteContent(locale);
  return {
    // metadataBase makes every relative URL below absolute. Without it,
    // Open Graph images and canonicals resolve against localhost in previews.
    metadataBase: new URL(SITE_URL),
    title: { default: meta.homeTitle, template: `%s — ${meta.siteName}` },
    description: meta.homeDescription,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        de: '/de',
        ar: '/ar',
        'x-default': '/de',
      },
    },
    openGraph: {
      type: 'website',
      siteName: meta.siteName,
      title: meta.homeTitle,
      description: meta.homeDescription,
      url: `/${locale}`,
      locale: locale === 'de' ? 'de_DE' : 'ar_AR',
      alternateLocale: locale === 'de' ? 'ar_AR' : 'de_DE',
    },
    // No og:image yet — the client has not supplied photography, and a
    // generated placeholder card looks worse in a WhatsApp preview than none.
    twitter: { card: 'summary' },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const content = getSiteContent(locale);
  const fontVars = `${sans.variable} ${serif.variable} ${arabic.variable}`;

  return (
    <html lang={locale} dir={DIRECTION[locale]} className={fontVars}>
      <body className="min-h-dvh bg-surface text-ink antialiased">
        <StructuredData locale={locale} content={content} />
        <Header locale={locale} content={content} />
        <main id="inhalt">{children}</main>
        <Footer locale={locale} content={content} year={new Date().getFullYear()} />
        <WhatsAppFab content={content} />
      </body>
    </html>
  );
}
