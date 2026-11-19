import type { CSSProperties, ReactNode } from "react";
import { cn } from "../lib/utils";

interface MarqueeProps {
  children: ReactNode;
  /** Seconds for one full loop. */
  duration?: number;
  reverse?: boolean;
  className?: string;
  /** Accessible label for the region. */
  label?: string;
}

/**
 * CSS-only marquee (transform animation). Pauses on hover/focus; the global reduced-motion rule
 * stops it and the row becomes horizontally scrollable instead. Duplicate track is aria-hidden.
 */
export function Marquee({ children, duration = 40, reverse, className, label }: MarqueeProps) {
  return (
    <div
      data-marquee=""
      role={label ? "region" : undefined}
      aria-label={label}
      className={cn(
        "group relative flex overflow-hidden motion-reduce:overflow-x-auto",
        "[mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]",
        className,
      )}
    >
      <div
        data-marquee-track=""
        style={
          {
            "--marquee-duration": `${duration}s`,
            animationDirection: reverse ? "reverse" : "normal",
          } as CSSProperties
        }
        className="animate-marquee flex w-max shrink-0 motion-reduce:animate-none"
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center motion-reduce:hidden" aria-hidden="true" inert>
          {children}
        </div>
      </div>
    </div>
  );
}
