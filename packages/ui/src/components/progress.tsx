"use client";

import { Progress as P } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../lib/utils";

/** Progress bar. The indicator moves with transform, not width. */
export function Progress({ className, value, ...props }: ComponentProps<typeof P.Root>) {
  return (
    <P.Root
      className={cn("bg-border relative h-1.5 w-full overflow-hidden rounded-full", className)}
      value={value}
      {...props}
    >
      <P.Indicator
        className="bg-primary h-full w-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </P.Root>
  );
}
