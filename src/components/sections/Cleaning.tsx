/**
 * The cleaning arm. Anchor target for the "Reinigung" nav item.
 *
 * Given its own section rather than only a grid card because it is half the
 * business and reaches a different buyer — but the grid card stays too, so the
 * two arms remain structurally equal.
 */

import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { routePath } from '@/lib/routes';
import type { Locale, SiteContent } from '@/types/content';

export function Cleaning({ locale, content }: { locale: Locale; content: SiteContent }) {
  const { cleaning } = content;

  return (
    <section id="reinigungsservice" className="bg-brand-mint-100 section">
      <div className="mx-auto grid max-w-content gap-10 lg:grid-cols-2 lg:items-start">
        <SectionHeading heading={cleaning.heading} />

        <div className="flex flex-col gap-6">
          <ul className="flex flex-col gap-3">
            {cleaning.items.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Icon name="Check" size={20} className="mt-0.5 text-brand" />
                <span className="text-body text-text-body">{item}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2">
            <ButtonLink href={routePath(locale, 'contact')} variant="primary" size="lg" className="w-fit">
              {cleaning.cta.label}
            </ButtonLink>
            {cleaning.cta.hint === undefined ? null : (
              <p className="text-body-sm text-text-muted">{cleaning.cta.hint}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
