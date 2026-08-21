/**
 * Hero — the split composition the brief asked for: copy on one side, a warm
 * panel on the other, meeting at the page's optical centre.
 *
 * The split is built with grid fractions rather than absolute positioning, so
 * it collapses to a single column on small screens and mirrors under `dir=rtl`
 * without a single directional override.
 */

import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { routePath } from '@/lib/routes';
import type { Locale, SiteContent } from '@/types/content';

export interface HeroProps {
  locale: Locale;
  content: SiteContent;
}

export function Hero({ locale, content }: HeroProps) {
  const { hero } = content;

  return (
    <section className="border-b border-border-subtle bg-surface">
      <div className="mx-auto grid max-w-page gap-12 px-gutter py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
        <div className="flex flex-col items-start gap-6">
          <p className="text-eyebrow text-accent-text">{hero.eyebrow}</p>

          <h1 className="text-display-xl text-balance text-text-heading">{hero.headline}</h1>

          <p className="max-w-prose text-lead text-text-secondary">{hero.lead}</p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href={routePath(locale, 'contact')} variant="primary" size="lg">
              {hero.primaryCta.label}
            </ButtonLink>
            <ButtonLink href={routePath(locale, 'services')} variant="outline" size="lg">
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>

          {hero.primaryCta.hint === undefined ? null : (
            <p className="text-body-sm text-text-muted">{hero.primaryCta.hint}</p>
          )}

          <ul className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-3">
            {hero.trust.map((item) => (
              <li key={item.id} className="flex items-center gap-2">
                <Icon name={item.icon} size={18} className="text-accent-text" />
                <span className="text-body-sm font-semibold text-text-secondary">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right panel. No photography yet — the client has not supplied images,
            so this is a typographic panel rather than a grey placeholder box. */}
        <div
          data-surface="dark"
          className="relative overflow-hidden rounded-2xl bg-surface-inverse p-8 shadow-lg sm:p-10"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 -end-16 size-56 rounded-full bg-brand-gold-500/12"
          />
          <div className="relative flex flex-col gap-6">
            <span dir="ltr" className="font-heading text-display-sm text-brand-gold-300">
              Zukunft&nbsp;Service
            </span>
            <p className="text-lead text-brand-green-50/90">{content.meta.slogan}</p>
            <ul className="flex flex-col gap-3 border-t border-brand-green-50/15 pt-6">
              {content.pillars.map((pillar) => (
                <li key={pillar.id} className="flex items-start gap-3">
                  <Icon name={pillar.icon} size={20} className="mt-0.5 text-brand-gold-300" />
                  <span className="text-body font-semibold text-brand-green-50">
                    {pillar.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
