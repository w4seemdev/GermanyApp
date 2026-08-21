/**
 * THE BACKEND CONTRACT.
 *
 * This file is the whole interface between this UI and whatever the backend
 * developer builds. Nothing else in the app knows how a message is sent.
 *
 * ── What the backend receives ────────────────────────────────────────────────
 * POST <NEXT_PUBLIC_CONTACT_ENDPOINT>
 * Content-Type: application/json
 *
 * {
 *   "service":       "authorities" | "marriage-translation" | "study-visa"
 *                  | "finance" | "real-estate" | "cleaning" | "other",
 *   "message":       string,   // 10..4000 chars, already trimmed
 *   "name":          string,   // >= 2 chars
 *   "email":         string,   // syntactically valid
 *   "phone":         string,   // may be "" - required only if whatsappOptIn
 *   "whatsappOptIn": boolean,
 *   "preferredTime": "morning" | "afternoon" | "any",
 *   "locale":        "de" | "ar",   // reply in this language
 *   "company":       string,   // HONEYPOT - must be "". Non-empty ⇒ drop it.
 *   "elapsedMs":     number    // ms the form was open. < 3000 ⇒ treat as bot.
 * }
 *
 * ── What the backend must return ─────────────────────────────────────────────
 *   200  { "status": "ok" }
 *   422  { "status": "validation", "fieldErrors": { "email": "…" } }
 *   4xx/5xx → anything else is treated as { status: "error" }
 *
 * ── Still on the backend's plate ─────────────────────────────────────────────
 * Client-side validation is a convenience, never a security control: re-validate
 * every field server-side. Rate-limit by IP. Re-check the honeypot and
 * elapsedMs. Send to CONTACT_RECIPIENT_EMAIL with the user's address in
 * Reply-To, never in From, or SPF/DKIM will fail and the mail will be spam-
 * filtered. Under DSGVO Art. 13 the enquiry is Art. 6(1)(b)/(f) processing -
 * lawful without consent - but it still needs a retention period.
 */

import type { Locale } from './locale';
import type { ContactFormValues } from './contact-schema';

export interface ContactPayload extends Omit<ContactFormValues, 'renderedAt'> {
  locale: Locale;
  elapsedMs: number;
}

export type ContactResult =
  | { status: 'ok' }
  | { status: 'validation'; fieldErrors: Record<string, string> }
  | { status: 'error' };

const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? '';
const TRANSPORT = process.env.NEXT_PUBLIC_CONTACT_TRANSPORT ?? 'mock';

/** Mock transport: the UI is complete and demonstrable before any backend
 *  exists. Flip NEXT_PUBLIC_CONTACT_TRANSPORT to "http" to go live. */
async function mockSend(payload: ContactPayload): Promise<ContactResult> {
  await new Promise((resolve) => setTimeout(resolve, 700));
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console -- the mock's only observable output
    console.info('[contact:mock] would send', payload);
  }
  return { status: 'ok' };
}

async function httpSend(payload: ContactPayload): Promise<ContactResult> {
  if (ENDPOINT.length === 0) return { status: 'error' };

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) return { status: 'ok' };

    if (response.status === 422) {
      const body: unknown = await response.json().catch(() => null);
      const fieldErrors =
        body !== null && typeof body === 'object' && 'fieldErrors' in body
          ? ((body as { fieldErrors?: Record<string, string> }).fieldErrors ?? {})
          : {};
      return { status: 'validation', fieldErrors };
    }

    return { status: 'error' };
  } catch {
    // Network failure, DNS, CORS, offline. The user sees the same recovery
    // path either way: WhatsApp or email.
    return { status: 'error' };
  }
}

export function sendContact(payload: ContactPayload): Promise<ContactResult> {
  return TRANSPORT === 'http' ? httpSend(payload) : mockSend(payload);
}
