'use client';

/**
 * The contact form — the one conversion path on the site.
 *
 * On failure the user is never left stranded: the error state repeats the
 * WhatsApp and email routes, because a form that cannot send must not become a
 * dead end for someone who needs help.
 *
 * Validation messages come from the locale content, so the German and Arabic
 * forms reject the same input for the same reason in the user's own language.
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Field, controlClass } from '@/components/form/Field';
import { Icon } from '@/components/ui/Icon';
import { NAP } from '@/content/shared/nap';
import { cn } from '@/lib/cn';
import { createContactSchema, type ContactFormValues } from '@/lib/contact-schema';
import { sendContact } from '@/lib/contact-transport';
import { waLink } from '@/lib/format';
import type { Locale, SiteContent } from '@/types/content';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm({ locale, content }: { locale: Locale; content: SiteContent }) {
  const { form: strings } = content;
  const [status, setStatus] = useState<Status>('idle');

  // Captured once on mount. The gap between this and submit is the timing trap:
  // a submit under MIN_FILL_MS did not involve a human reading the form.
  const renderedAt = useRef(Date.now());

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(createContactSchema(strings.validation)),
    defaultValues: {
      service: 'other',
      message: '',
      name: '',
      email: '',
      phone: '',
      whatsappOptIn: false,
      preferredTime: 'any',
      company: '',
      renderedAt: renderedAt.current,
    },
  });

  const errorList = Object.entries(errors)
    .map(([key, value]) => ({ key, message: value?.message }))
    .filter((entry): entry is { key: string; message: string } => typeof entry.message === 'string');

  async function onSubmit(values: ContactFormValues) {
    setStatus('submitting');

    const result = await sendContact({
      service: values.service,
      message: values.message,
      name: values.name,
      email: values.email,
      phone: values.phone ?? '',
      whatsappOptIn: values.whatsappOptIn,
      preferredTime: values.preferredTime,
      company: values.company,
      locale,
      elapsedMs: Date.now() - renderedAt.current,
    });

    if (result.status === 'ok') {
      setStatus('success');
      reset();
      return;
    }

    setStatus('error');
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        className="flex flex-col gap-3 rounded-xl border border-border-accent bg-success-bg p-8"
      >
        <Icon name="Check" className="text-success-fg" />
        <h2 className="text-display-sm text-text-heading">{strings.successTitle}</h2>
        <p className="text-body text-text-secondary">{strings.successBody}</p>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 rounded-xl border border-border-subtle bg-surface-raised p-6 sm:p-8"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-display-sm text-text-heading">{strings.title}</h2>
        <p className="text-body-sm text-text-muted">{strings.lead}</p>
      </div>

      {errorList.length > 0 ? (
        <div role="alert" className="rounded-lg border border-danger bg-danger-bg p-4">
          <h3 className="text-label text-danger-fg">{strings.errorSummaryTitle}</h3>
          <ul className="mt-2 flex flex-col gap-1">
            {errorList.map((entry) => (
              <li key={entry.key}>
                <a
                  href={`#field-${entry.key}`}
                  className="focus-ring rounded-xs text-body-sm text-danger-fg underline"
                >
                  {entry.message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {status === 'error' ? (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-lg border border-danger bg-danger-bg p-4"
        >
          <h3 className="text-label text-danger-fg">{strings.errorTitle}</h3>
          <p className="text-body-sm text-text-body">{strings.errorBody}</p>
          <div className="flex flex-wrap gap-4">
            <a
              href={waLink(NAP.phoneDigits)}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring rounded-xs text-body-sm font-semibold text-accent-text underline"
            >
              {content.contact.quickContact.whatsapp}
            </a>
            <a
              href={`mailto:${NAP.email}`}
              className="focus-ring rounded-xs text-body-sm font-semibold text-accent-text underline"
            >
              {content.contact.quickContact.email}
            </a>
          </div>
        </div>
      ) : null}

      <Field
        id="field-service"
        label={strings.service.label}
        hint={strings.service.hint}
        error={errors.service?.message}
        required
        requiredLabel={strings.requiredLabel}
      >
        {({ id, describedBy, invalid }) => (
          <select
            id={id}
            aria-describedby={describedBy}
            aria-invalid={invalid}
            className={controlClass(invalid)}
            {...register('service')}
          >
            {strings.service.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </Field>

      <Field
        id="field-message"
        label={strings.message.label}
        hint={strings.message.hint}
        error={errors.message?.message}
        required
        requiredLabel={strings.requiredLabel}
      >
        {({ id, describedBy, invalid }) => (
          <textarea
            id={id}
            rows={5}
            placeholder={strings.message.placeholder}
            aria-describedby={describedBy}
            aria-invalid={invalid}
            className={cn(controlClass(invalid), 'resize-y')}
            {...register('message')}
          />
        )}
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          id="field-name"
          label={strings.name.label}
          error={errors.name?.message}
          required
          requiredLabel={strings.requiredLabel}
        >
          {({ id, describedBy, invalid }) => (
            <input
              id={id}
              type="text"
              autoComplete="name"
              placeholder={strings.name.placeholder}
              aria-describedby={describedBy}
              aria-invalid={invalid}
              className={controlClass(invalid)}
              {...register('name')}
            />
          )}
        </Field>

        <Field
          id="field-email"
          label={strings.email.label}
          hint={strings.email.hint}
          error={errors.email?.message}
          required
          requiredLabel={strings.requiredLabel}
        >
          {({ id, describedBy, invalid }) => (
            <input
              id={id}
              type="email"
              autoComplete="email"
              dir="ltr"
              placeholder={strings.email.placeholder}
              aria-describedby={describedBy}
              aria-invalid={invalid}
              className={controlClass(invalid)}
              {...register('email')}
            />
          )}
        </Field>

        <Field
          id="field-phone"
          label={strings.phone.label}
          hint={strings.phone.hint}
          error={errors.phone?.message}
          requiredLabel={strings.requiredLabel}
          optionalLabel={strings.optionalLabel}
        >
          {({ id, describedBy, invalid }) => (
            <input
              id={id}
              type="tel"
              autoComplete="tel"
              dir="ltr"
              placeholder={strings.phone.placeholder}
              aria-describedby={describedBy}
              aria-invalid={invalid}
              className={controlClass(invalid)}
              {...register('phone')}
            />
          )}
        </Field>

        <Field
          id="field-preferredTime"
          label={strings.preferredTime.label}
          error={errors.preferredTime?.message}
          requiredLabel={strings.requiredLabel}
          optionalLabel={strings.optionalLabel}
        >
          {({ id, describedBy, invalid }) => (
            <select
              id={id}
              aria-describedby={describedBy}
              aria-invalid={invalid}
              className={controlClass(invalid)}
              {...register('preferredTime')}
            >
              {strings.preferredTime.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </Field>
      </div>

      <label className="flex items-start gap-3 text-body-sm text-text-body">
        <input
          type="checkbox"
          className="focus-ring mt-0.5 size-5 rounded-xs border-border-strong"
          {...register('whatsappOptIn')}
        />
        <span>
          {strings.whatsappOptIn.label}
          {strings.whatsappOptIn.hint === undefined ? null : (
            <span className="block text-caption text-text-muted">
              {strings.whatsappOptIn.hint}
            </span>
          )}
        </span>
      </label>

      {/* Honeypot. Positioned off-screen rather than display:none, because a
          display:none input is skipped by many bots and by autofill alike. */}
      <div aria-hidden="true" className="absolute -start-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="field-company">{strings.honeypot.label}</label>
        <input
          id="field-company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register('company')}
        />
      </div>

      <p className="flex items-start gap-2 text-caption text-text-muted">
        <Icon name="ShieldCheck" size={16} className="mt-0.5" />
        <span>{strings.hedgeNotice}</span>
      </p>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className={cn(
          'focus-ring inline-flex min-h-13 w-full items-center justify-center rounded-md',
          'bg-brand px-7 text-body font-semibold text-text-on-brand',
          'transition-colors duration-200 hover:bg-brand-hover',
          'disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit',
        )}
      >
        {status === 'submitting' ? strings.submitting : strings.submit}
      </button>

      <p className="text-caption text-text-muted">{strings.privacyNotice}</p>
    </form>
  );
}
