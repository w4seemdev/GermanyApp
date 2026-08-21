/**
 * Locale primitives. No i18n library - see docs/research/03-frontend-architecture.md §5.
 *
 * URLs are prefix-always (`/de/…`, `/ar/…`) so that `<html lang dir>` is
 * server-rendered and there is no LTR→RTL flash, hreflang is unambiguous, and
 * a link shared into WhatsApp always lands exactly where it points.
 */

export const LOCALES = ['de', 'ar'] as const;

export type Locale = (typeof LOCALES)[number];

export type Direction = 'ltr' | 'rtl';

/** German is the default and the hreflang `x-default`: it is the primary market. */
export const DEFAULT_LOCALE: Locale = 'de';

export const DIRECTION: Record<Locale, Direction> = {
  de: 'ltr',
  ar: 'rtl',
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

export function dirFor(locale: Locale): Direction {
  return DIRECTION[locale];
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'de' ? 'ar' : 'de';
}

/**
 * Rewrites ONLY the locale segment and keeps everything else - remaining path
 * segments, query string and hash. This powers the language button, and the
 * requirement it exists to satisfy is that switching language lands the user on
 * the *equivalent* page rather than dumping them back at the homepage.
 *
 * It compares whole segments, never substrings. A naive
 * `pathname.replace('/de', '/ar')` corrupts `/de/leistungen/dessau` into
 * `/ar/leistungen/ssau`-class bugs and mangles any segment that merely contains
 * the locale code.
 *
 * ```
 * swapLocalePath('/de/leistungen/reinigungsservice', 'ar')
 *   → '/ar/leistungen/reinigungsservice'
 * swapLocalePath('/de/leistungen/dessau#kontakt', 'ar')
 *   → '/ar/leistungen/dessau#kontakt'      // inner "de" untouched
 * swapLocalePath('/deutschland/de', 'ar')
 *   → '/ar/deutschland/de'                 // segment 1 is not a locale
 * swapLocalePath('/', 'ar')          → '/ar'
 * swapLocalePath('/kontakt?x=1', 'ar') → '/ar/kontakt?x=1'
 * ```
 *
 * @param pathname Absolute path, optionally with `?query` and/or `#hash`.
 * @param next     The locale to switch to.
 */
export function swapLocalePath(pathname: string, next: Locale): string {
  // Split the suffix off first: '?' and '#' must never be treated as segments.
  let cut = pathname.length;
  const queryIndex = pathname.indexOf('?');
  const hashIndex = pathname.indexOf('#');
  if (queryIndex !== -1) cut = Math.min(cut, queryIndex);
  if (hashIndex !== -1) cut = Math.min(cut, hashIndex);

  const path = pathname.slice(0, cut);
  const suffix = pathname.slice(cut);
  const normalized = path.startsWith('/') ? path : `/${path}`;

  // ['', 'de', 'leistungen', …] - index 1 is the only candidate locale segment.
  const segments = normalized.split('/');
  const first = segments[1];

  if (first !== undefined && isLocale(first)) {
    segments[1] = next;
    const rebuilt = segments.join('/');
    return `${rebuilt === '' ? '/' : rebuilt}${suffix}`;
  }

  const rest = normalized === '/' ? '' : normalized;
  return `/${next}${rest}${suffix}`;
}
