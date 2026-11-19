"use client";

import { animate } from "motion";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@teziko/ui/hooks/use-reduced-motion";
import { formatINR } from "@/lib/format";

/** Rupee amount that tweens between values when totals change. */
export function AnimatedPrice({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const from = prev.current;
    prev.current = value;
    if (from === value || prefersReducedMotion()) {
      el.textContent = formatINR(value);
      return;
    }
    const c = animate(from, value, {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => (el.textContent = formatINR(v)),
    });
    return () => c.stop();
  }, [value]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {formatINR(value)}
    </span>
  );
}
