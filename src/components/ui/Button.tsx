/**
 * Button and ButtonLink.
 *
 * CONTRAST RULES BAKED IN - see globals.css header:
 *  - `accent` is gold #c48a16 used as a FILL with near-black text on top.
 *    Gold is never the text colour here.
 *  - hover on the gold fill goes LIGHTER (#d3a32c), not darker, because a
 *    darker gold would sink toward the dark text sitting on it.
 *
 * RTL: spacing is logical (gap, ms-/me-), and a trailing arrow is flipped with
 * `rtl:-scale-x-100` so it points into the reading direction rather than out.
 */

import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'accent' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

const BASE =
  'focus-ring inline-flex items-center justify-center gap-2 rounded-md font-semibold '
  + 'transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-text-on-brand hover:bg-brand-hover active:bg-brand-active',
  accent: 'bg-accent text-accent-fg hover:bg-accent-hover active:bg-accent',
  outline:
    'border border-border-strong bg-transparent text-text-heading hover:bg-surface-sunken',
  ghost: 'bg-transparent text-accent-text hover:text-accent-text-strong hover:underline',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-3 text-body-sm',
  md: 'min-h-11 px-5 text-body',
  lg: 'min-h-13 px-7 text-body',
};

export function buttonClass(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
): string {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

export interface ButtonLinkProps {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
  /** Set for tel:, mailto: and wa.me - those must not be client-routed. */
  external?: boolean;
  ariaLabel?: string;
}

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  external = false,
  ariaLabel,
}: ButtonLinkProps) {
  const classes = buttonClass(variant, size, className);

  if (external) {
    return (
      <a href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
