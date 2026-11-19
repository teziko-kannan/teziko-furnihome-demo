"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { ENTRANCE_WINDOW_MS } from "../hooks/entrance";

const loadFeatures = () => import("./motion-features").then((m) => m.default);

/**
 * Inline script for <head>. Adds `js-anim` so reveal targets can start hidden before hydration, then
 * always removes it after a short window, so content never waits on slow hydration or a failed bundle.
 */
export const revealBootScript = `(function(){var d=document.documentElement;d.classList.add('js-anim');setTimeout(function(){d.classList.remove('js-anim')},${ENTRANCE_WINDOW_MS})})();`;

/**
 * Applies the user's reduced-motion preference to every motion component and lazy-loads motion's
 * animation features (`strict`: components must use the lightweight `m.*` elements).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
