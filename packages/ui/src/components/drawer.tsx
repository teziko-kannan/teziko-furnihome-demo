"use client";

import type { ComponentProps } from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "../lib/utils";

export function Drawer(props: ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root {...props} />;
}

export const DrawerTrigger = DrawerPrimitive.Trigger;
export const DrawerClose = DrawerPrimitive.Close;
export const DrawerTitle = DrawerPrimitive.Title;
export const DrawerDescription = DrawerPrimitive.Description;

/** Vaul drawer content. Right-hand panel on desktop, bottom sheet when direction="bottom". */
export function DrawerContent({
  className,
  children,
  direction = "right",
  ...props
}: ComponentProps<typeof DrawerPrimitive.Content> & { direction?: "right" | "bottom" }) {
  return (
    <DrawerPrimitive.Portal>
      <DrawerPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
      <DrawerPrimitive.Content
        className={cn(
          "bg-background fixed z-50 flex flex-col outline-none",
          direction === "right" &&
            "border-border shadow-lift inset-y-0 right-0 h-full w-[min(100%,28rem)] border-l",
          direction === "bottom" &&
            "border-border inset-x-0 bottom-0 max-h-[88dvh] rounded-t-2xl border-t",
          className,
        )}
        {...props}
      >
        {direction === "bottom" ? (
          <div
            aria-hidden="true"
            className="bg-border mx-auto mt-3 mb-1 h-1.5 w-12 shrink-0 rounded-full"
          />
        ) : null}
        {children}
      </DrawerPrimitive.Content>
    </DrawerPrimitive.Portal>
  );
}
