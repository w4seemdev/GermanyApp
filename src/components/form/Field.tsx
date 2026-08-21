/**
 * Label + control + hint + error, wired together.
 *
 * A placeholder is NEVER the label: it vanishes on focus, fails at 3:1 in most
 * renderings, and is invisible to some assistive tech. Every control here gets
 * a real <label>.
 *
 * `aria-describedby` points at the hint and the error together, so a screen
 * reader announces both rather than only the last one written.
 */

import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  requiredLabel: string;
  optionalLabel?: string;
  children: (props: { id: string; describedBy: string | undefined; invalid: boolean }) => ReactNode;
}

export function Field({
  id,
  label,
  hint,
  error,
  required = false,
  requiredLabel,
  optionalLabel,
  children,
}: FieldProps) {
  const hintId = hint === undefined ? undefined : `${id}-hint`;
  const errorId = error === undefined ? undefined : `${id}-error`;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="flex items-baseline gap-2 text-label text-text-heading">
        <span>{label}</span>
        {required ? (
          <span className="text-caption font-normal text-text-muted">
            <span aria-hidden="true">*</span>
            <span className="sr-only">{requiredLabel}</span>
          </span>
        ) : optionalLabel === undefined ? null : (
          <span className="text-caption font-normal text-text-muted">({optionalLabel})</span>
        )}
      </label>

      {hint === undefined ? null : (
        <p id={hintId} className="text-caption text-text-muted">
          {hint}
        </p>
      )}

      {children({ id, describedBy, invalid: error !== undefined })}

      {error === undefined ? null : (
        <p id={errorId} className="text-body-sm font-semibold text-danger-fg">
          {error}
        </p>
      )}
    </div>
  );
}

/** Shared control styling. Focus uses the 3px gold ring from globals.css. */
export const controlClass = (invalid: boolean) =>
  cn(
    'focus-ring w-full rounded-sm border bg-surface-field px-3 py-2.5 text-body',
    'text-text-body transition-colors duration-200 focus:bg-surface-field-focus',
    invalid ? 'border-danger' : 'border-border-default hover:border-border-strong',
  );
