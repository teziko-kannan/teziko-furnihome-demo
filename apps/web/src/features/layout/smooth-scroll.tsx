"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

type LenisInstance = {
  raf: (t: number) => void;
  destroy: () => void;
  scrollTo: (t: number, o?: { immediate?: boolean }) => void;
};

let lenis: LenisInstance | null = null;

/**
 * Lenis smooth scrolling, loaded lazily on desktop pointers only and never when the user prefers
 * reduced motion. Also keeps GSAP ScrollTrigger in sync when it is present.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine) and (min-width: 1024px)").matches;
    if (reduced || !fine) return;
    let raf = 0;
    let cancelled = false;
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const instance = new Lenis({ lerp: 0.12, wheelMultiplier: 1 }) as unknown as LenisInstance & {
        on: (e: string, cb: () => void) => void;
      };
      lenis = instance;
      instance.on("scroll", () => window.dispatchEvent(new Event("tz:lenis-scroll")));
      const loop = (t: number) => {
        instance.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  useEffect(() => {
    if (!window.location.hash) lenis?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
