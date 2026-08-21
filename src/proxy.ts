/**
* Locale redirect (Next 16 proxy; this file was middleware.ts before the rename).
 *
 * Every page lives under an explicit /de or /ar prefix so that `lang` and `dir`
 * are server-rendered and there is no LTR→RTL flash. This sends the bare root
 * to the default locale.
 *
 * German is the default because it is the primary market and the hreflang
 * x-default. Deliberately NOT sniffing Accept-Language: a shared link must
 * always land on the language it names, or the language switch becomes a
 * suggestion rather than a control.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { DEFAULT_LOCALE, LOCALES } from '@/lib/locale';

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = pathname === '/' ? `/${DEFAULT_LOCALE}` : `/${DEFAULT_LOCALE}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Everything except Next internals and static assets.
  matcher: ['/((?!_next|favicon|robots.txt|sitemap.xml|.*\..*).*)'],
};
