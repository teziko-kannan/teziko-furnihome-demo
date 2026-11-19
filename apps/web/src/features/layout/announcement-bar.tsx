"use client";

import { usePrefersReducedMotion } from "@teziko/ui/hooks/use-reduced-motion";
import { AnimatePresence, m } from "motion/react";
import { useEffect, useState } from "react";

/** Coral bar with rotating offers. Pauses on hover/focus; fades instead of slides with reduced motion. */
export function AnnouncementBar({ messages }: { messages: string[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (paused || messages.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % messages.length), 4500);
    return () => clearInterval(t);
  }, [paused, messages.length]);

  return (
    <div
      className="bg-accent text-accent-foreground relative z-50"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="container-page flex h-9 items-center justify-center overflow-hidden text-center text-[13px] font-semibold">
        <p className="sr-only">{messages.join(". ")}</p>
        <AnimatePresence mode="wait" initial={false}>
          <m.p
            key={i}
            aria-hidden="true"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -14 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="truncate"
          >
            {messages[i]}
          </m.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
