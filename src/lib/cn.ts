import { clsx, type ClassValue } from 'clsx';

export type { ClassValue };

/** Conditional className joiner. Thin re-export of clsx — there is no
 *  tailwind-merge here, so do not rely on later classes beating earlier ones. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
