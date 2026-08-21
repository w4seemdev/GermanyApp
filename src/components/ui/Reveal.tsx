'use client';

/**
 * Reveal-on-scroll wrapper.
 *
 * THE CONTRACT FROM globals.css: "reveal-on-scroll content is visible by
 * default in CSS, so killing the animation never hides anything."
 *
 * That rules out the usual implementation. Nothing here sets `opacity: 0` in a
 * stylesheet - the animation class is added by JS only once the element enters
 * the viewport, and the keyframe itself starts at 0 and finishes at 1. So:
 *
 *  - no JavaScript  → content is visible, never a blank page
 *  - reduced motion → we bail out before observing, content is visible
 *  - normal         → it fades up as it scrolls into view
 *
 * The observer disconnects after firing: this is an entrance, not a scrubbing
 * effect, and re-animating on every scroll-past is nauseating.
 */

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger siblings. Milliseconds. */
  delayMs?: number;
}

export function Reveal({ children, className, delayMs = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (element === null) return;

    // Respect the OS setting before doing any work at all.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting === true) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      // Fire slightly before the element is fully on screen, so the motion has
      // finished by the time the reader's eye arrives.
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(revealed && 'animate-reveal', className)}
      style={revealed && delayMs > 0 ? { animationDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
