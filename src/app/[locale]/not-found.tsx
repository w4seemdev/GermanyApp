import Link from 'next/link';

import { getSiteContent } from '@/content';
import { DIRECTION, LOCALES } from '@/lib/locale';

/**
 * 404.
 *
 * Next does not pass route params to not-found.tsx, so this page cannot know
 * which language the visitor was heading for. Rather than guess and show an
 * Arabic speaker a German dead end, it offers both - which is also the most
 * useful thing a bilingual site can do when someone arrives from a broken link.
 *
 * Each half carries its own `lang` and `dir` so both scripts lay out correctly
 * on the same page.
 */
export default function NotFound() {
  return (
    <section className="bg-surface section">
      <div className="mx-auto flex max-w-content flex-col gap-10">
        <p className="font-heading text-display-xl text-brand-gold-300" aria-hidden="true">
          404
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          {LOCALES.map((locale) => {
            const content = getSiteContent(locale);
            return (
              <div
                key={locale}
                lang={locale}
                dir={DIRECTION[locale]}
                className="flex flex-col items-start gap-4 rounded-xl border border-border-subtle bg-surface-raised p-7"
              >
                <h2 className="text-display-sm text-text-heading">{content.meta.siteName}</h2>
                <p className="text-body text-text-secondary">{content.meta.slogan}</p>
                <Link
                  href={`/${locale}`}
                  hrefLang={locale}
                  className="focus-ring mt-auto inline-flex min-h-11 items-center rounded-md bg-brand px-5 text-body-sm font-semibold text-text-on-brand hover:bg-brand-hover"
                >
                  {content.meta.localeLabel}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
