"use client";

import { animate, stagger } from "motion";
import { useEffect, useRef, type ElementType } from "react";
import { shouldAnimateEntrance } from "../hooks/entrance";
import { prefersReducedMotion } from "../hooks/use-reduced-motion";
import { REVEAL_EASE } from "../hooks/use-scroll-reveal";

interface AnimatedTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  /** Delay before the first word, seconds. */
  delay?: number;
}

/** Word-by-word headline reveal. Words rise from a clipped line using transform only. */
export function AnimatedText({ text, as, className, delay = 0 }: AnimatedTextProps) {
  const ref = useRef<HTMLElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal-item]"));
    if (prefersReducedMotion() || !shouldAnimateEntrance(root)) {
      items.forEach((i) => (i.dataset.revealReady = ""));
      return;
    }
    animate(items, { opacity: 0, y: "105%" }, { duration: 0 });
    items.forEach((i) => (i.dataset.revealReady = ""));
    const controls = animate(
      items,
      { opacity: 1, y: "0%" },
      { duration: 0.9, ease: REVEAL_EASE, delay: stagger(0.07, { startDelay: delay }) },
    );
    return () => controls.stop();
  }, [delay]);

  const Component: ElementType = as ?? "h1";
  return (
    <Component ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden="true"
          className="inline-block overflow-hidden pb-[0.1em] align-bottom"
        >
          <span data-reveal-item="" className="inline-block will-change-transform">
            {word}
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Component>
  );
}
