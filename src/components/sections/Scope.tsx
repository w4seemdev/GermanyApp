/**
 * "Was wir tun – und was nicht."
 *
 * This section is the legal shield and a trust signal at once: naming the
 * boundary out loud is what keeps the surrounding copy clear of RDG and
 * § 34c/§ 34d GewO exposure, and customers read it as honesty rather than
 * hedging.
 *
 * The notice is rendered from content, never hard-coded here, so the German and
 * Arabic disclaimers cannot drift apart.
 */

import { Icon } from '@/components/ui/Icon';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { SiteContent } from '@/types/content';

export function Scope({ content }: { content: SiteContent }) {
  const { scope } = content;

  return (
    <section className="bg-surface section">
      <div className="mx-auto max-w-content">
        <SectionHeading heading={scope.heading} id="leistungsumfang" />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-xl border border-border-subtle bg-surface-raised p-7">
            <h3 className="text-title text-text-heading">{scope.doTitle}</h3>
            <ul className="flex flex-col gap-2.5">
              {scope.doItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Icon name="Check" size={19} className="mt-0.5 text-brand" />
                  <span className="text-body-sm text-text-body">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4 rounded-xl border border-border-subtle bg-surface-sunken p-7">
            <h3 className="text-title text-text-heading">{scope.dontTitle}</h3>
            <ul className="flex flex-col gap-2.5">
              {scope.dontItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Icon name="Info" size={19} className="mt-0.5 text-text-muted" />
                  <span className="text-body-sm text-text-secondary">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-6 flex items-start gap-3 rounded-lg border border-border-accent bg-brand-gold-50 p-5 text-body-sm text-text-body">
          <Icon name="ShieldCheck" size={20} className="mt-0.5 text-brand-gold-700" />
          <span>{scope.notice}</span>
        </p>
      </div>
    </section>
  );
}
