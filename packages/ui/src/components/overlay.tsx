"use client";

import { Popover as P, Tooltip as T } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../lib/utils";

export const TooltipProvider = T.Provider;
export const Tooltip = T.Root;
export const TooltipTrigger = T.Trigger;

export function TooltipContent({
  className,
  sideOffset = 6,
  ...props
}: ComponentProps<typeof T.Content>) {
  return (
    <T.Portal>
      <T.Content
        sideOffset={sideOffset}
        className={cn(
          "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 z-50 rounded-md px-2.5 py-1.5 text-xs",
          className,
        )}
        {...props}
      />
    </T.Portal>
  );
}

export const Popover = P.Root;
export const PopoverTrigger = P.Trigger;
export const PopoverAnchor = P.Anchor;

export function PopoverContent({
  className,
  sideOffset = 8,
  ...props
}: ComponentProps<typeof P.Content>) {
  return (
    <P.Portal>
      <P.Content
        sideOffset={sideOffset}
        className={cn(
          "border-border bg-popover text-popover-foreground shadow-lift data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 z-50 w-72 rounded-xl border p-4 outline-none",
          className,
        )}
        {...props}
      />
    </P.Portal>
  );
}
