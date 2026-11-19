"use client";

import { animate, inView } from "motion";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../hooks/use-reduced-motion";

interface CountUpProps {
  to: number;
  /** Formats the running value. Defaults to en-IN grouping. */
  format?: (value: number) => string;
  duration?: number;
  className?: string;
}

const defaultFormat = (v: number) => Math.round(v).toLocaleString("en-IN");

/**
 * Renders the final value on the server (correct without JS), then counts up from zero on first view.
 */
export function CountUp({ to, format = defaultFormat, duration = 1.6, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    return inView(
      el,
      () => {
        const controls = animate(0, to, {
          duration,
          ease: [0.16, 1, 0.3, 1],
          onUpdate: (v) => {
            el.textContent = format(v);
          },
        });
        return () => controls.stop();
      },
      { amount: 0.6 },
    );
  }, [to, format, duration]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {format(to)}
    </span>
  );
}
