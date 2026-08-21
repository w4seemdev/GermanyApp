/**
 * Width-constrained wrapper.
 *
 * The four widths come from the --container-* theme tokens, so page rhythm is
 * decided in one place. `mx-auto` is direction-neutral and needs no RTL
 * counterpart.
 */

import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

const WIDTHS = {
  prose: 'max-w-prose',
  content: 'max-w-content',
  wide: 'max-w-wide',
  page: 'max-w-page',
} as const;

export type ContainerWidth = keyof typeof WIDTHS;

export interface ContainerProps {
  children: ReactNode;
  width?: ContainerWidth;
  className?: string;
}

export function Container({ children, width = 'content', className }: ContainerProps) {
  return <div className={cn('mx-auto w-full', WIDTHS[width], className)}>{children}</div>;
}
