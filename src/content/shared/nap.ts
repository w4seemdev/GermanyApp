/**
 * Confirmed business data — the single source of truth for the footer, the info
 * strip, the contact page, the LocalBusiness JSON-LD and the Impressum shell.
 *
 * Client-confirmed 20 Aug 2026 (docs/PLAN.md §2):
 *   Ruhrallee 55, 44139 Dortmund · +49 177 3825632 · info@zukunftservice.de
 *   Monday–Friday 10:00–16:00, closed Saturday and Sunday.
 *
 * NOTE: the hours differ from the client's own live draft site, which still
 * publishes Thu 10–15 and Fri 10–13. The confirmation is uniform 10–16 Mo–Fr and
 * wins everywhere, including `openingHoursSpecification`, which Google surfaces
 * directly in search and Maps.
 *
 * Fields still outstanding carry the «…» sentinel. Every one of them is a
 * mandatory § 5 DDG Impressum field: a missing or defective Impressum is
 * actionable under § 3a UWG and the first letter can cost more than the whole
 * project fee, so the release gate must fail the production build while any
 * sentinel survives — see `isPlaceholder`.
 */

import type { NapData } from '@/types/content';

/** Opening guillemet. Any string containing it is unconfirmed placeholder data. */
export const PLACEHOLDER_PREFIX = '«';

/** True when a value is still an unconfirmed placeholder. */
export function isPlaceholder(value: string): boolean {
  return value.includes(PLACEHOLDER_PREFIX);
}

export const NAP = {
  // ── Still unknown. Blocks launch, not the build of the UI. ───────────────
  legalName: '«Vollständiger Firmenname inkl. Rechtsform — vom Kunden zu bestätigen»',
  legalForm: '«Rechtsform: Einzelunternehmen / GbR / UG / GmbH — vom Kunden zu bestätigen»',
  managingDirector: '«Inhaber / Vertretungsberechtigte Person — vom Kunden zu bestätigen»',
  vatId: null,
  registerCourt: null,
  registerNumber: null,

  // ── Confirmed ────────────────────────────────────────────────────────────
  tradeName: 'Zukunft Service',

  street: 'Ruhrallee 55',
  postalCode: '44139',
  city: 'Dortmund',
  region: 'Nordrhein-Westfalen',
  country: 'DE',

  phoneE164: '+491773825632',
  phoneDisplay: '+49 177 3825632',
  phoneDigits: '491773825632',
  whatsappE164: '+491773825632',
  email: 'info@zukunftservice.de',

  // Link out only — never an iframe. An embedded map transmits the visitor's
  // IP to Google on page load, which triggers consent and therefore a banner.
  mapsUrl: 'https://maps.google.com/?q=Ruhrallee+55+44139+Dortmund',

  hours: [
    { day: 'mon', open: '10:00', close: '16:00' },
    { day: 'tue', open: '10:00', close: '16:00' },
    { day: 'wed', open: '10:00', close: '16:00' },
    { day: 'thu', open: '10:00', close: '16:00' },
    { day: 'fri', open: '10:00', close: '16:00' },
    { day: 'sat', open: null, close: null },
    { day: 'sun', open: null, close: null },
  ],

  availableLanguages: ['de', 'ar'],

  verified: {
    address: true,
    phone: true,
    email: true,
    hours: true,
  },
} satisfies NapData;

/** Convenience: the address as one line, e.g. for a JSON-LD `name` fallback. */
export const ADDRESS_ONE_LINE = `${NAP.street}, ${NAP.postalCode} ${NAP.city}`;

/** True while any Impressum field is still a «…» sentinel. */
export function hasUnresolvedPlaceholders(): boolean {
  return (
    isPlaceholder(NAP.legalName) ||
    isPlaceholder(NAP.legalForm) ||
    isPlaceholder(NAP.managingDirector)
  );
}
