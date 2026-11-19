"use client";

import { animate, inView } from "motion";
import { useEffect, useRef } from "react";
import { shouldAnimateEntrance } from "./entrance";
import { prefersReducedMotion } from "./use-reduced-motion";

export interface ScrollRevealOptions {
  /** Vertical offset in px the element travels from. */
  y?: number;
  x?: number;
  scale?: number;
  delay?: number;
  duration?: number;
  /** Fraction of the element that must be visible. */
  amount?: number;
}

export const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Reveals an element when it scrolls into view. Only `opacity` and `transform` are animated.
 * The hidden state is applied from JS, so content stays visible if scripts never run.
 */
export function useScrollReveal<T extends HTMLElement>({
  y = 24,
  x = 0,
  scale = 1,
  delay = 0,
  duration = 0.7,
  amount = 0.2,
}: ScrollRevealOptions = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion() || !shouldAnimateEntrance(el)) {
      el.dataset.revealReady = "";
      return;
    }
    animate(el, { opacity: 0, x, y, scale }, { duration: 0 });
    el.dataset.revealReady = "";
    return inView(
      el,
      () => {
        animate(el, { opacity: 1, x: 0, y: 0, scale: 1 }, { duration, delay, ease: REVEAL_EASE });
      },
      { amount },
    );
  }, [x, y, scale, delay, duration, amount]);

  return ref;
}
