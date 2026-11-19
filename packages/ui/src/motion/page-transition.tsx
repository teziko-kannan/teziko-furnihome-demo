"use client";

import { m } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "../hooks/use-reduced-motion";

const state = { mountedOnce: false };

/**
 * Fade + slide for route changes. Use inside `template.tsx` so it remounts on navigation.
 * The very first page load is not animated, so server-rendered HTML is never hidden.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const [animateIn] = useState(() => state.mountedOnce);
  useEffect(() => {
    state.mountedOnce = true;
  }, []);

  return (
    <m.div
      initial={animateIn ? (reduced ? { opacity: 0 } : { opacity: 0, y: 12 }) : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0.15 : 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}
