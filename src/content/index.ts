/**
 * The content registry.
 *
 * `Record<Locale, ...>` is what turns a missing translation into a compile error
 * rather than a `[missing key]` string in production: adding a locale to
 * LOCALES without adding its content module fails `tsc --noEmit`.
 */

import type { Locale, ServiceContent, ServiceId, SiteContent } from '@/types/content';
import { arSite } from './ar/site';
import { deSite } from './de/site';
import { arServices } from './ar/services';
import { deServices } from './de/services';

export const SITE_CONTENT: Record<Locale, SiteContent> = {
  de: deSite,
  ar: arSite,
};

export const SERVICE_CONTENT: Record<Locale, Record<ServiceId, ServiceContent>> = {
  de: deServices,
  ar: arServices,
};

export function getSiteContent(locale: Locale): SiteContent {
  return SITE_CONTENT[locale];
}

export function getServices(locale: Locale): Record<ServiceId, ServiceContent> {
  return SERVICE_CONTENT[locale];
}

export function getService(locale: Locale, id: ServiceId): ServiceContent {
  return SERVICE_CONTENT[locale][id];
}

/** Content the client has not signed off yet. The release check should look at
 *  this rather than anyone remembering which locale was authored in-house. */
export function unapprovedServices(locale: Locale): readonly ServiceId[] {
  const services = SERVICE_CONTENT[locale];
  return (Object.keys(services) as ServiceId[]).filter(
    (id) => services[id].status !== 'final',
  );
}

export { NAP, ADDRESS_ONE_LINE, hasUnresolvedPlaceholders } from './shared/nap';
export { SERVICES_IN_ORDER, SERVICE_META, serviceSlug } from './shared/services.meta';
