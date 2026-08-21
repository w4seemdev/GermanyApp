/**
 * The content registry.
 *
 * `Record<Locale, SiteContent>` is what turns a missing translation into a
 * compile error rather than a `[missing key]` string in production: adding a
 * locale to LOCALES without adding its content module fails `tsc --noEmit`.
 */

import type { Locale, SiteContent } from '@/types/content';
import { arSite } from './ar/site';
import { deSite } from './de/site';

export const SITE_CONTENT: Record<Locale, SiteContent> = {
  de: deSite,
  ar: arSite,
};

export function getSiteContent(locale: Locale): SiteContent {
  return SITE_CONTENT[locale];
}

export { NAP, ADDRESS_ONE_LINE, hasUnresolvedPlaceholders } from './shared/nap';
export { SERVICES_IN_ORDER, SERVICE_META, serviceSlug } from './shared/services.meta';
