'use client';

/**
 * DE ⇄ AR language switch.
 *
 * With exactly two locales a single toggle beats a dropdown: one control, one
 * keystroke, no menu to open. It is a real <Link>, so it works without JS,
 * middle-clicks into a new tab, and is crawlable.
 *
 * FOUR RULES THIS COMPONENT EXISTS TO KEEP
 *  1. The label is the TARGET language written in ITS OWN script - "العربية" on
 *     the German page, "Deutsch" on the Arabic one. A user who reads no German
 *     must still recognise their language. Never "Arabisch", never a flag: a
 *     flag names a country, not a language, and Arabic belongs to many.
 *  2. It lands on the EQUIVALENT page. swapLocalePath rewrites only the locale
 *     segment, so /de/leistungen/x becomes /ar/leistungen/x, never the home page.
 *  3. `dir` and `lang` on the link keep the target script laid out correctly no
 *     matter which direction the hosting page runs in.
 *  4. `hrefLang` tells crawlers what sits on the other end.
 *
 * Deliberately NOT preserving the query string: reading it needs
 * useSearchParams(), which forces every page hosting the header into a Suspense
 * boundary. Marketing URLs here carry no meaningful query state.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/cn';
import { DIRECTION, otherLocale, swapLocalePath, type Locale } from '@/lib/locale';

export interface LanguageSwitcherProps {
  locale: Locale;
  /** The target language in its own script, from content.meta.switchLabel. */
  switchLabel: string;
  /** Bilingual aria-label, from content.meta.switchAriaLabel. */
  switchAriaLabel: string;
  className?: string;
}

export function LanguageSwitcher({
  locale,
  switchLabel,
  switchAriaLabel,
  className,
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const target = otherLocale(locale);
  const href = swapLocalePath(pathname ?? `/${locale}`, target);

  return (
    <Link
      href={href}
      hrefLang={target}
      lang={target}
      dir={DIRECTION[target]}
      aria-label={switchAriaLabel}
      className={cn(
        'focus-ring inline-flex min-h-11 items-center gap-2 rounded-pill border',
        'border-border-default bg-surface-raised px-4 text-label font-semibold',
        'text-text-heading transition-colors duration-200',
        'hover:border-border-accent hover:bg-surface-warm',
        className,
      )}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        aria-hidden="true"
        focusable="false"
        className="shrink-0 opacity-70"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18" />
      </svg>
      {switchLabel}
    </Link>
  );
}
