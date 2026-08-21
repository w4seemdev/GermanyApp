/**
 * Five reasons. Anchor target for the "Warum wir" nav item.
 *
 * The Arabic bodies run roughly twice the length of the German, so the grid is
 * built on `items-start` with no fixed card height - equal-height cards would
 * either clip the Arabic or strand the German in whitespace.
 */

import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { SiteContent } from '@/types/content';

export function Why({ content }: { content: SiteContent }) {
  const { why } = content;

  return (
    <section className="bg-surface section">
      <div className="mx-auto max-w-content">
        <SectionHeading heading={why.heading} id="warum-wir" />

        <ul className="mt-12 grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {why.points.map((point, index) => (
            <li key={point.id}>
              <Reveal delayMs={index * 70} className="flex flex-col gap-3">
              <span className="flex size-11 items-center justify-center rounded-md bg-brand-green-50">
                <Icon name={point.icon} size={20} className="text-brand" />
              </span>
              <h3 className="text-title text-text-heading">{point.title}</h3>
              <p className="text-body-sm text-text-secondary">{point.body}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
