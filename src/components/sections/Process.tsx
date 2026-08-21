/**
 * The three-step strip.
 *
 * A process description makes no outcome promise, which makes it both the best
 * anxiety-reducer on the page and the legally safest section on the site.
 *
 * The connecting rule is drawn with a border on the list, not with ::before
 * arrows, so nothing needs flipping under RTL.
 */

import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { SiteContent } from '@/types/content';

export function Process({ content }: { content: SiteContent }) {
  const { process } = content;

  return (
    <section className="bg-surface section">
      <div className="mx-auto max-w-content">
        <SectionHeading heading={process.heading} />

        <ol className="mt-12 grid gap-8 md:grid-cols-3">
          {process.steps.map((step, index) => (
            <li key={step.id}>
              <Reveal delayMs={index * 90} className="flex flex-col gap-3 border-t-2 border-border-accent pt-5">
              <span className="text-eyebrow text-accent-text tabular-nums">{step.index}</span>
              <h3 className="text-title text-text-heading">{step.title}</h3>
              <p className="text-body-sm text-text-secondary">{step.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
