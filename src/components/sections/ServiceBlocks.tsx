/**
 * Renders a service's body blocks.
 *
 * The switch is exhaustive with a `never` default: adding a block kind to
 * ServiceBlock without handling it here is a compile error, not a section that
 * silently fails to render.
 *
 * List layouts are content decisions, not styling whims. `checks` is for
 * "things we do for you" (each item earns a tick), `two-column` is for short
 * enumerations like visa types or premises, and `plain` is the fallback.
 */

import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';
import type { ServiceBlock } from '@/types/content';

function ListItems({
  items,
  layout,
}: {
  items: readonly string[];
  layout: 'checks' | 'two-column' | 'plain';
}) {
  if (layout === 'checks') {
    return (
      <ul className="flex flex-col gap-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <Icon name="Check" size={19} className="mt-0.5 text-brand" />
            <span className="text-body text-text-body">{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul
      className={cn(
        'flex flex-col gap-2',
        layout === 'two-column' && 'sm:grid sm:grid-cols-2 sm:gap-x-8',
      )}
    >
      {items.map((item) => (
        <li
          key={item}
          className="border-b border-border-subtle py-2 text-body text-text-body last:border-b-0"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function Block({ block }: { block: ServiceBlock }) {
  switch (block.kind) {
    case 'list':
      return (
        <div className="flex flex-col gap-4">
          {block.title === undefined ? null : (
            <h2 className="text-display-sm text-text-heading">{block.title}</h2>
          )}
          {block.intro === undefined ? null : (
            <p className="max-w-prose text-body text-text-secondary">{block.intro}</p>
          )}
          <ListItems items={block.items} layout={block.layout ?? 'plain'} />
        </div>
      );

    case 'highlight':
      return (
        <div className="flex flex-col gap-4 rounded-xl border border-border-accent bg-brand-gold-50 p-7">
          <h2 className="text-display-sm text-text-heading">{block.title}</h2>
          <p className="max-w-prose text-body text-text-secondary">{block.intro}</p>
          <ListItems items={block.items} layout="checks" />
          {block.closing === undefined ? null : (
            <p className="text-body font-semibold text-text-heading">{block.closing}</p>
          )}
        </div>
      );

    case 'prose':
      return (
        <div className="flex flex-col gap-3">
          {block.title === undefined ? null : (
            <h2 className="text-display-sm text-text-heading">{block.title}</h2>
          )}
          <p className="max-w-prose text-body text-text-secondary">{block.body}</p>
        </div>
      );

    case 'notice':
      return (
        <p
          className={cn(
            'flex max-w-prose items-start gap-3 rounded-lg border p-5 text-body-sm',
            block.tone === 'legal'
              ? 'border-border-accent bg-brand-gold-50 text-text-body'
              : 'border-border-default bg-surface-sunken text-text-secondary',
          )}
        >
          <Icon
            name={block.tone === 'legal' ? 'ShieldCheck' : 'Info'}
            size={20}
            className="mt-0.5 text-brand-gold-700"
          />
          <span>
            {block.title === undefined ? null : <strong className="block">{block.title}</strong>}
            {block.body}
          </span>
        </p>
      );

    default: {
      const exhaustive: never = block;
      return exhaustive;
    }
  }
}

export function ServiceBlocks({ blocks }: { blocks: readonly ServiceBlock[] }) {
  return (
    <div className="flex flex-col gap-10">
      {blocks.map((block) => (
        <Block key={block.id} block={block} />
      ))}
    </div>
  );
}
