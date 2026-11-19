"use client";

import { useReducedMotion } from "motion/react";

/**
 * Single source of truth for reduced-motion checks across the app.
 * Returns `true` when the user prefers reduced motion. Server render returns `false`.
 */
export function usePrefersReducedMotion(): boolean {
  return useReducedMotion() ?? false;
}

/** Imperative check for effects and event handlers. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
