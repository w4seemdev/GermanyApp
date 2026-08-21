/**
 * Locale-aware formatting.
 *
 * Two ICU traps this file exists to close:
 *  1. Bare `'ar'` can resolve to the Umm al-Qura calendar in some ICU builds,
 *     so a weekday name comes out of the Hijri calendar. `-ca-gregory` forces
 *     Gregorian.
 *  2. Bare `'ar'` can emit Eastern Arabic-Indic digits (٠١٢٣). This audience
 *     lives in Germany and transacts with German forms, phone numbers and
 *     addresses, so `-nu-latn` forces Latin digits.
 *
 * Phone numbers are NEVER run through Intl and are always bidi-isolated by the
 * component that renders them — see `<bdi dir="ltr">` in the design system.
 */

import { DAY_KEYS, type OpeningHour } from '@/types/content';
import type { Locale } from './locale';

/** Gregorian calendar + Latin digits are both forced for Arabic. */
const DATE_LOCALE: Record<Locale, string> = {
  de: 'de-DE',
  ar: 'ar-u-nu-latn-ca-gregory',
};

/** 2024-01-01 was a Monday, so dayIndex 0 = Monday, matching DAY_KEYS. */
const MONDAY_UTC_MS = Date.UTC(2024, 0, 1);
const DAY_MS = 86_400_000;

/**
 * Weekday name in the given locale.
 *
 * @param dayIndex 0 = Monday … 6 = Sunday.
 * @param locale   Site locale.
 * @param style    'long' → "Montag" / "الاثنين"; 'short' → "Mo" / "الاثنين".
 */
export function formatWeekday(
  dayIndex: number,
  locale: Locale,
  style: 'long' | 'short' = 'long',
): string {
  const date = new Date(MONDAY_UTC_MS + dayIndex * DAY_MS);
  // timeZone: 'UTC' is required — without it a negative-offset runtime formats
  // the previous day and every label shifts by one.
  return new Intl.DateTimeFormat(DATE_LOCALE[locale], {
    weekday: style,
    timeZone: 'UTC',
  }).format(date);
}

/**
 * "10:00–16:00", or `null` when the day is closed.
 * Digits stay Latin and the separator is an en dash; the caller wraps the
 * result in `<bdi dir="ltr">` so it does not reorder inside Arabic copy.
 */
export function formatHourRange(open: string | null, close: string | null): string | null {
  if (open === null || close === null) return null;
  return `${open}–${close}`;
}

export interface FormattedOpeningHour {
  day: OpeningHour['day'];
  /** 0 = Monday. */
  dayIndex: number;
  dayLabel: string;
  /** "10:00–16:00", or null when closed. */
  range: string | null;
  isClosed: boolean;
}

/**
 * Turns the structural opening-hours data into render-ready rows.
 * One data shape serves the German page, the Arabic page and the schema.org
 * `openingHoursSpecification`.
 */
export function formatHours(
  hours: readonly OpeningHour[],
  locale: Locale,
): readonly FormattedOpeningHour[] {
  return hours.map((hour) => {
    const dayIndex = DAY_KEYS.indexOf(hour.day);
    const range = formatHourRange(hour.open, hour.close);
    return {
      day: hour.day,
      dayIndex,
      dayLabel: formatWeekday(dayIndex, locale),
      range,
      isClosed: range === null,
    };
  });
}

/**
 * WhatsApp deep link with an optional prefilled message.
 *
 * Prefilling with the service name means the user never faces a blank box and
 * the enquiry arrives pre-qualified.
 *
 * @param phoneDigits Digits only, e.g. '491773825632'. Any punctuation in the
 *                    argument is stripped — wa.me rejects '+' and spaces.
 * @param text        Plain text; encoded here, so pass it unencoded.
 */
export function waLink(phoneDigits: string, text?: string): string {
  const digits = phoneDigits.replace(/\D/g, '');
  const base = `https://wa.me/${digits}`;
  if (text === undefined || text.length === 0) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}
