"use client";

import { useRef, type HTMLAttributes, type PointerEvent } from "react";
import { cn } from "../lib/utils";

/**
 * Card with a soft light that follows the pointer. The light is a fixed-size layer moved with
 * transform and faded with opacity, so no paint-heavy properties are animated.
 */
export function SpotlightCard({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);

  function onMove(e: PointerEvent<HTMLDivElement>) {
    const card = ref.current;
    const light = lightRef.current;
    if (!card || !light || e.pointerType !== "mouse") return;
    const r = card.getBoundingClientRect();
    light.style.transform = `translate3d(${e.clientX - r.left - 200}px, ${e.clientY - r.top - 200}px, 0)`;
    light.style.opacity = "1";
  }

  function onLeave() {
    if (lightRef.current) lightRef.current.style.opacity = "0";
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn("relative isolate overflow-hidden", className)}
      {...rest}
    >
      <div
        ref={lightRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 -z-10 size-[400px] rounded-full opacity-0 transition-opacity duration-300 motion-reduce:hidden"
        style={{ background: "radial-gradient(circle, rgb(255 72 72 / 0.14), transparent 65%)" }}
      />
      {children}
    </div>
  );
}
