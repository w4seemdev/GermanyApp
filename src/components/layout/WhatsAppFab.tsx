/**
 * Floating WhatsApp button.
 *
 * WhatsApp is this audience's default channel, and someone anxious about a
 * Behördenbrief is far likelier to send a voice note than to fill in a form.
 * So the channel they already trust follows them down the page.
 *
 * COLOUR: WhatsApp's brand #25d366 is 1.98:1 on white and fails WCAG outright.
 * This uses WhatsApp's own darker #128c7e (4.14:1) — still unmistakably
 * WhatsApp, actually readable.
 *
 * POSITION is logical (`end-`), so it sits bottom-right in German and
 * bottom-left in Arabic without an RTL override.
 */

import { NAP } from '@/content/shared/nap';
import { waLink } from '@/lib/format';
import type { SiteContent } from '@/types/content';

export function WhatsAppFab({ content }: { content: SiteContent }) {
  return (
    <a
      href={waLink(NAP.phoneDigits, content.hero.primaryCta.label)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={content.a11y.whatsappFab}
      className={
        'focus-ring animate-fab-in fixed bottom-5 end-5 z-40 inline-flex size-14 '
        + 'items-center justify-center rounded-pill bg-[#128c7e] text-white '
        + 'shadow-fab transition-transform duration-200 hover:scale-105 '
        + 'active:scale-95 print:hidden'
      }
    >
      {/* WhatsApp glyph inlined: lucide has no brand marks, and one <svg> beats
          pulling in an icon package for a single logo. */}
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.41-.56-.42h-.47c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29Z" />
      </svg>
    </a>
  );
}
