"use client";

import { useMediaQuery } from "@teziko/ui/hooks/use-media-query";
import { usePrefersReducedMotion } from "@teziko/ui/hooks/use-reduced-motion";
import dynamic from "next/dynamic";
import { useId, type ReactNode } from "react";

// GSAP + ScrollTrigger live in a separate chunk loaded only on capable desktops.
const PinEffect = dynamic(() => import("./pin-effect"), { ssr: false });

/**
 * Horizontal collection that pins and scrolls sideways on desktop (GSAP ScrollTrigger).
 * On touch devices, small screens and reduced motion it is a plain swipeable row.
 */
export function TrendingPinned({ header, children }: { header: ReactNode; children: ReactNode }) {
  const id = useId().replace(/:/g, "");
  const desktop = useMediaQuery("(min-width: 1024px) and (pointer: fine)");
  const reduced = usePrefersReducedMotion();
  const pin = desktop && !reduced;

  return (
    <section
      id={`pin-${id}`}
      className="bg-chrome text-chrome-foreground overflow-hidden py-16 lg:flex lg:min-h-dvh lg:flex-col lg:justify-center lg:py-20"
    >
      <div className="container-page">{header}</div>
      <div
        className={pin ? "" : "-mx-4 [scrollbar-width:none] overflow-x-auto px-4 sm:mx-0 sm:px-0"}
      >
        <div
          data-pin-track=""
          className="flex w-max gap-5 pr-[8vw] pl-4 will-change-transform sm:pl-6 lg:pl-[max(2rem,calc((100vw-1360px)/2+2rem))]"
        >
          {children}
        </div>
      </div>
      {pin ? <PinEffect sectionId={`pin-${id}`} /> : null}
    </section>
  );
}
