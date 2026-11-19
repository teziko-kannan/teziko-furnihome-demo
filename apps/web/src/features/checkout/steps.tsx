"use client";

import { CheckIcon } from "lucide-react";
import { m } from "motion/react";
import { cn } from "@/lib/format";

export const STEPS = ["Address", "Payment", "Confirm"] as const;

/** Step indicator. The connecting bar fills with a transform (scaleX). */
export function CheckoutSteps({ current }: { current: number }) {
  return (
    <nav aria-label="Checkout progress" className="mb-8">
      <div className="relative">
        <div
          aria-hidden="true"
          className="bg-border absolute top-4 right-[16.66%] left-[16.66%] h-0.5"
        >
          <m.div
            className="bg-foreground h-full origin-left"
            initial={false}
            animate={{ scaleX: current / (STEPS.length - 1) }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <ol className="relative grid grid-cols-3">
          {STEPS.map((label, i) => {
            const done = i < current;
            const active = i === current;
            return (
              <li
                key={label}
                className="relative flex flex-col items-center gap-2"
                aria-current={active ? "step" : undefined}
              >
                <m.span
                  initial={false}
                  animate={{ scale: active ? 1.08 : 1 }}
                  className={cn(
                    "z-10 inline-flex size-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                    done && "border-foreground bg-foreground text-background",
                    active && "border-foreground bg-background",
                    !done && !active && "border-border bg-background text-muted-foreground",
                  )}
                >
                  {done ? <CheckIcon className="size-4" aria-hidden="true" /> : i + 1}
                </m.span>
                <span
                  className={cn(
                    "text-xs font-medium",
                    active || done ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {label}
                  {done ? <span className="sr-only"> (completed)</span> : null}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
