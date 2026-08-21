/**
 * The two arms of the business, stated plainly.
 *
 * The numerals 01/02 are content, not decoration — they come from the content
 * file so they never mirror or renumber under RTL.
 */

import { Icon } from '@/components/ui/Icon';
import { routePath } from '@/lib/routes';
import type { Locale, SiteContent } from '@/types/content';
import Link from 'next/link';

export function Pillars({ locale, content }: { locale: Locale; content: SiteContent }) {
  return (
    <section className="bg-surface-alt section">
      <div className="mx-auto grid max-w-content gap-6 md:grid-cols-2">
        {content.pillars.map((pillar) => (
          <article
            key={pillar.id}
            className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface-raised p-8"
          >
            <div className="flex items-center gap-3">
              <span className="font-heading text-display-sm text-brand-gold-700 tabular-nums">
                {pillar.index}
              </span>
              <Icon name={pillar.icon} className="text-brand" />
            </div>
            <h2 className="text-display-sm text-text-heading">{pillar.title}</h2>
            <p className="text-body text-text-secondary">{pillar.body}</p>
            <Link
              href={
                pillar.id === 'cleaning'
                  ? `${routePath(locale, 'home')}#reinigungsservice`
                  : routePath(locale, 'services')
              }
              className="focus-ring mt-auto inline-flex w-fit rounded-xs text-body-sm font-semibold text-accent-text hover:text-accent-text-strong"
            >
              {pillar.linkLabel}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
