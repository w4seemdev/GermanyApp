/**
 * The content registry.
 *
 * `Record<Locale, …>` is what turns a missing translation into a compile error
 * rather than a `[missing key]` string in production: adding a locale to
 * LOCALES without adding its content module fails `tsc --noEmit`.
 */

import type { Locale, ServiceId, SiteContent } from '@/types/content';
import { arSite } from './ar/site';
import { deSite } from './de/site';
import { arServiceCards } from './ar/services.cards';
import { deServiceCards, type ServiceCard } from './de/services.cards';

export type { ServiceCard };

export const SITE_CONTENT: Record<Locale, SiteContent> = {
  de: deSite,
  ar: arSite,
};

export const SERVICE_CARDS: Record<Locale, Record<ServiceId, ServiceCard>> = {
  de: deServiceCards,
  ar: arServiceCards,
};

export function getSiteContent(locale: Locale): SiteContent {
  return SITE_CONTENT[locale];
}

export function getServiceCards(locale: Locale): Record<ServiceId, ServiceCard> {
  return SERVICE_CARDS[locale];
}

export { NAP, ADDRESS_ONE_LINE, hasUnresolvedPlaceholders } from './shared/nap';
export { SERVICES_IN_ORDER, SERVICE_META, serviceSlug } from './shared/services.meta';
