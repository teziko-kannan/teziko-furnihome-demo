"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

export { toast } from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="bottom-right"
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "!rounded-xl !border-border !bg-background !text-foreground !shadow-lift !font-sans",
          description: "!text-muted-foreground",
          actionButton: "!bg-primary !text-primary-foreground !rounded-full",
        },
      }}
      {...props}
    />
  );
}
