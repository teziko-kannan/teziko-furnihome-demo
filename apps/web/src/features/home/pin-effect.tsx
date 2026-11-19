"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Pins the section and translates its track horizontally while scrolling. Transform only. */
export default function PinEffect({ sectionId }: { sectionId: string }) {
  useGSAP(() => {
    const section = document.getElementById(sectionId);
    const track = section?.querySelector<HTMLElement>("[data-pin-track]");
    if (!section || !track) return;
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
    gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });
    const sync = () => ScrollTrigger.update();
    window.addEventListener("tz:lenis-scroll", sync);
    return () => window.removeEventListener("tz:lenis-scroll", sync);
  }, [sectionId]);
  return null;
}
