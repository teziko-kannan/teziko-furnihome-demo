"use client";

import { animate, inView, stagger } from "motion";
import { useEffect, useRef, type ComponentPropsWithoutRef, type ElementType } from "react";
import { shouldAnimateEntrance } from "../hooks/entrance";
import { prefersReducedMotion } from "../hooks/use-reduced-motion";
import { REVEAL_EASE } from "../hooks/use-scroll-reveal";

type StaggerProps<T extends ElementType> = {
  as?: T;
  /** Seconds between each child. */
  interval?: number;
  y?: number;
  delay?: number;
  amount?: number;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

/**
 * Staggers descendants marked with `data-reveal-item` (use <StaggerItem>) when the group enters view.
 */
export function Stagger<T extends ElementType = "div">({
  as,
  interval = 0.08,
  y = 20,
  delay = 0,
  amount = 0.15,
  ...rest
}: StaggerProps<T>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal-item]"));
    if (items.length === 0) return;
    if (prefersReducedMotion() || !shouldAnimateEntrance(root)) {
      items.forEach((i) => (i.dataset.revealReady = ""));
      return;
    }
    animate(items, { opacity: 0, y }, { duration: 0 });
    items.forEach((i) => (i.dataset.revealReady = ""));
    return inView(
      root,
      () => {
        animate(
          items,
          { opacity: 1, y: 0 },
          { duration: 0.65, ease: REVEAL_EASE, delay: stagger(interval, { startDelay: delay }) },
        );
      },
      { amount },
    );
  }, [interval, y, delay, amount]);

  const Component: ElementType = as ?? "div";
  return <Component ref={ref} {...rest} />;
}

type StaggerItemProps<T extends ElementType> = { as?: T } & Omit<ComponentPropsWithoutRef<T>, "as">;

export function StaggerItem<T extends ElementType = "div">({ as, ...rest }: StaggerItemProps<T>) {
  const Component: ElementType = as ?? "div";
  return <Component data-reveal-item="" {...rest} />;
}
