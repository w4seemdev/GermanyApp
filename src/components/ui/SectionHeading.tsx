/**
 * Eyebrow + title + lead, used by every section so vertical rhythm and the
 * heading level are decided once.
 *
 * `text-balance` on the title stops a two-word orphan on the second line, and
 * the lead is capped at prose width because a 1200px-wide paragraph is
 * unreadable regardless of how good the type is.
 */

import { cn } from '@/lib/cn';
import type { SectionHeading as SectionHeadingContent } from '@/types/content';

export interface SectionHeadingProps {
  heading: SectionHeadingContent;
  /** h2 by default; the page's single h1 is the hero. */
  as?: 'h1' | 'h2' | 'h3';
  align?: 'start' | 'center';
  className?: string;
  /** Anchor target for the in-page nav links. */
  id?: string;
}

export function SectionHeading({
  heading,
  as: Tag = 'h2',
  align = 'start',
  className,
  id,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      <p className="text-eyebrow text-accent-text">{heading.eyebrow}</p>
      <Tag id={id} className="text-display-md text-balance text-text-heading">
        {heading.title}
      </Tag>
      {heading.lead === undefined ? null : (
        <p className={cn('max-w-prose text-lead text-text-secondary', align === 'center' && 'mx-auto')}>
          {heading.lead}
        </p>
      )}
    </div>
  );
}
