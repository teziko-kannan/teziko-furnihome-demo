"use client";

import type { ComponentPropsWithoutRef, ElementType } from "react";
import { useScrollReveal, type ScrollRevealOptions } from "../hooks/use-scroll-reveal";

type RevealProps<T extends ElementType> = ScrollRevealOptions & {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

/** Fades and slides children in when scrolled into view. */
export function Reveal<T extends ElementType = "div">({
  as,
  y,
  x,
  scale,
  delay,
  duration,
  amount,
  ...rest
}: RevealProps<T>) {
  const ref = useScrollReveal<HTMLElement>({ y, x, scale, delay, duration, amount });
  const Component: ElementType = as ?? "div";
  return <Component ref={ref} data-reveal="" {...rest} />;
}
