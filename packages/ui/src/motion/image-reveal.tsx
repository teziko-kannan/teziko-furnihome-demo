"use client";

import { animate, inView } from "motion";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { shouldAnimateEntrance } from "../hooks/entrance";
import { prefersReducedMotion } from "../hooks/use-reduced-motion";
import { REVEAL_EASE } from "../hooks/use-scroll-reveal";

interface ImageRevealProps {
  children: ReactNode;
  className?: string;
  /** Colour of the sliding mask panel. */
  maskClassName?: string;
  delay?: number;
  direction?: "left" | "up";
}

/**
 * Mask reveal: a solid panel scales away (transform) while the image settles from a slight zoom.
 * The panel starts at opacity 0, so without JS it is never visible.
 */
export function ImageReveal({
  children,
  className,
  maskClassName,
  delay = 0,
  direction = "left",
}: ImageRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const mask = maskRef.current;
    const inner = innerRef.current;
    if (!root || !mask || !inner || prefersReducedMotion() || !shouldAnimateEntrance(root)) return;
    const from = direction === "left" ? { scaleX: 1 } : { scaleY: 1 };
    const to = direction === "left" ? { scaleX: 0 } : { scaleY: 0 };
    animate(mask, { opacity: 1, ...from }, { duration: 0 });
    animate(inner, { scale: 1.12 }, { duration: 0 });
    return inView(
      root,
      () => {
        animate(mask, to, { duration: 1.1, ease: REVEAL_EASE, delay });
        animate(inner, { scale: 1 }, { duration: 1.6, ease: REVEAL_EASE, delay });
      },
      { amount: 0.25 },
    );
  }, [delay, direction]);

  return (
    <div ref={rootRef} className={cn("relative overflow-hidden", className)}>
      <div ref={innerRef} className="h-full w-full will-change-transform">
        {children}
      </div>
      <div
        ref={maskRef}
        aria-hidden="true"
        style={{
          opacity: 0,
          transformOrigin: direction === "left" ? "right center" : "center top",
        }}
        className={cn("bg-muted pointer-events-none absolute inset-0", maskClassName)}
      />
    </div>
  );
}
