/**
 * URL construction. Every path is locale-prefixed, always.
 *
 * Route segments stay German in both locales for the same reason service slugs
 * do: percent-encoded Arabic looks broken when pasted into WhatsApp, which is
 * this audience's primary sharing channel.
 */

import type { NavTarget, RouteId, ServiceId } from '@/types/content';
import { serviceSlug } from '@/content/shared/services.meta';
import type { Locale } from './locale';

/** The German segment for each route. `home` is the bare locale root. */
const SEGMENTS: Record<Exclude<RouteId, 'service' | 'notFound' | 'home'>, string> = {
  services: 'leistungen',
  contact: 'kontakt',
  imprint: 'impressum',
  privacy: 'datenschutz',
};

export function homePath(locale: Locale): string {
  return `/${locale}`;
}

export function routePath(
  locale: Locale,
  routeId: Exclude<RouteId, 'service' | 'notFound'>,
): string {
  if (routeId === 'home') return homePath(locale);
  return `/${locale}/${SEGMENTS[routeId]}`;
}

export function servicePath(locale: Locale, serviceId: ServiceId): string {
  return `/${locale}/${SEGMENTS.services}/${serviceSlug(serviceId)}`;
}

/**
 * Resolves a NavTarget to an href.
 *
 * An `anchor` target is returned as an absolute path plus hash rather than a
 * bare `#hash`, so the same nav data works in the footer of a sub-page - where
 * a bare hash would scroll the wrong page instead of navigating home.
 */
export function navHref(target: NavTarget, locale: Locale): string {
  switch (target.kind) {
    case 'route':
      return routePath(locale, target.routeId);
    case 'service':
      return servicePath(locale, target.serviceId);
    case 'anchor':
      return `${homePath(locale)}${target.hash}`;
    case 'external':
      return target.href;
    default: {
      // Exhaustiveness: adding a NavTarget kind without handling it here is a
      // compile error, not a silently broken link.
      const exhaustive: never = target;
      return exhaustive;
    }
  }
}

export function isExternalTarget(target: NavTarget): boolean {
  return target.kind === 'external';
}
