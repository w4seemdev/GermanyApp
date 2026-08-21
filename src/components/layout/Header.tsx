'use client';

/**
 * Site header: wordmark, primary nav, language switch, contact CTA.
 *
 * Client component only because the mobile panel holds open/closed state.
 *
 * RTL: every horizontal offset is logical (gap, ms-/me-, start-/end-), so the
 * whole bar mirrors from the `dir` attribute alone with no `rtl:` overrides.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/cn';
import { homePath, navHref, routePath } from '@/lib/routes';
import type { Locale, SiteContent } from '@/types/content';
import { LanguageSwitcher } from './LanguageSwitcher';

export interface HeaderProps {
  locale: Locale;
  content: SiteContent;
}

export function Header({ locale, content }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close the panel on navigation - without this the menu stays open over the
  // new page after a client-side transition.
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const { nav, meta, a11y } = content;
  const contactHref = routePath(locale, 'contact');

  // The contact link is already the green CTA on the right, so rendering it in
  // the nav as well printed "Kontakt" twice in the same bar and ate the width
  // the rest of the nav needed. Desktop nav drops it; the mobile panel keeps
  // the full list, because there the CTA is not visible.
  const contactItem = nav.primary.find(
    (item) => item.target.kind === 'route' && item.target.routeId === 'contact',
  );
  const desktopNav = nav.primary.filter((item) => item.id !== contactItem?.id);

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-surface/95 backdrop-blur-sm">
      <a
        href="#inhalt"
        className={cn(
          'focus-ring sr-only focus:not-sr-only focus:absolute focus:top-3 focus:start-3',
          'focus:z-50 focus:rounded-md focus:bg-brand focus:px-4 focus:py-2',
          'focus:text-body-sm focus:font-semibold focus:text-text-on-brand',
        )}
      >
        {a11y.skipToContent}
      </a>

      <div className="mx-auto flex max-w-page items-center gap-4 px-gutter py-3">
        <Link
          href={homePath(locale)}
          className="focus-ring -ms-1 flex shrink-0 items-center gap-2 rounded-md px-1 py-1"
        >
          {/* The brand name is Latin in both locales and never transliterated. */}
          <span dir="ltr" className="font-heading text-title text-text-heading">
            Zukunft&nbsp;Service
          </span>
        </Link>

        <nav aria-label={a11y.menuLabel} className="ms-auto hidden min-w-0 lg:block">
          <ul className="flex items-center gap-1">
            {desktopNav.map((item) => (
              <li key={item.id}>
                <Link
                  href={navHref(item.target, locale)}
                  className={cn(
                    'focus-ring inline-flex min-h-11 items-center rounded-md px-3',
                    'text-body-sm font-semibold text-text-secondary',
                    'transition-colors duration-200 hover:text-text-heading',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-2 lg:ms-0">
          <LanguageSwitcher
            locale={locale}
            switchLabel={meta.switchLabel}
            switchAriaLabel={meta.switchAriaLabel}
          />

          <Link
            href={contactHref}
            className={cn(
              'focus-ring hidden min-h-11 items-center rounded-md bg-brand px-5',
              'text-body-sm font-semibold text-text-on-brand',
              'transition-colors duration-200 hover:bg-brand-hover sm:inline-flex',
            )}
          >
            {contactItem?.label ?? content.contact.heading.eyebrow}
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            aria-label={isOpen ? a11y.closeMenu : a11y.openMenu}
            className={cn(
              'focus-ring inline-flex size-11 items-center justify-center rounded-md',
              'border border-border-default text-text-heading lg:hidden',
            )}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
              focusable="false"
            >
              {isOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isOpen ? (
        <nav
          id="mobile-nav"
          aria-label={a11y.menuLabel}
          className="border-t border-border-subtle bg-surface-raised lg:hidden"
        >
          <ul className="mx-auto flex max-w-page flex-col px-gutter py-2">
            {nav.primary.map((item) => (
              <li key={item.id} className="border-b border-border-subtle last:border-b-0">
                <Link
                  href={navHref(item.target, locale)}
                  className="focus-ring flex min-h-13 items-center rounded-md text-body font-semibold text-text-heading"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
