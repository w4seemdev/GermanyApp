/**
 * Contact form schema.
 *
 * Built as a factory rather than a module constant because every message is
 * locale-specific: the German and Arabic forms must reject the same input for
 * the same reason, in the user's own language.
 *
 * TWO ANTI-SPAM MEASURES, both invisible and both accessible:
 *  - `company` is a honeypot. It is off-screen, not display:none, and carries
 *    autocomplete="off" plus tabindex={-1}. Bots fill it; humans never see it.
 *  - `renderedAt` is a timing trap. A submit under MIN_FILL_MS did not involve
 *    a human reading the form.
 * Neither replaces server-side checks — both are advisory signals the backend
 * should re-verify.
 */

import { z } from 'zod';
import { SERVICE_IDS, type FormValidationStrings } from '@/types/content';

/** Anything faster than this was not typed by a person. */
export const MIN_FILL_MS = 3_000;

export const MESSAGE_MIN = 10;
export const MESSAGE_MAX = 4_000;

const SERVICE_VALUES = [...SERVICE_IDS, 'other'] as const;
const PREFERRED_TIME_VALUES = ['morning', 'afternoon', 'any'] as const;

/** Permissive on purpose: E.164, national forms, spaces, dashes and parens all
 *  pass. Rejecting a valid number a user actually owns is the worse failure. */
const PHONE_PATTERN = /^[+]?[\d\s()/.-]{6,25}$/;

export function createContactSchema(strings: FormValidationStrings) {
  return z
    .object({
      service: z.enum(SERVICE_VALUES, { message: strings.required }),
      message: z
        .string()
        .trim()
        .min(MESSAGE_MIN, strings.messageTooShort)
        .max(MESSAGE_MAX, strings.messageTooLong),
      name: z.string().trim().min(2, strings.nameTooShort),
      email: z.string().trim().email(strings.emailInvalid),
      phone: z
        .string()
        .trim()
        .regex(PHONE_PATTERN, strings.phoneInvalid)
        .optional()
        .or(z.literal('')),
      whatsappOptIn: z.boolean(),
      preferredTime: z.enum(PREFERRED_TIME_VALUES),
      /** Honeypot — must stay empty. */
      company: z.string().max(0),
      renderedAt: z.number(),
    })
    .refine(
      (data) => !data.whatsappOptIn || (data.phone !== undefined && data.phone.length > 0),
      { path: ['phone'], message: strings.phoneRequiredForWhatsapp },
    );
}

export type ContactFormValues = z.infer<ReturnType<typeof createContactSchema>>;
