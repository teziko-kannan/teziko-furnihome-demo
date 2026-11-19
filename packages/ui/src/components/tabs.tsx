"use client";

import { Tabs as T } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../lib/utils";

export const Tabs = T.Root;

export function TabsList({ className, ...props }: ComponentProps<typeof T.List>) {
  return (
    <T.List
      className={cn("border-border flex w-full gap-6 overflow-x-auto border-b", className)}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof T.Trigger>) {
  return (
    <T.Trigger
      className={cn(
        "text-muted-foreground hover:text-foreground data-[state=active]:border-accent data-[state=active]:text-foreground relative -mb-px shrink-0 border-b-2 border-transparent pt-1 pb-3 text-sm font-medium transition-colors",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: ComponentProps<typeof T.Content>) {
  return <T.Content className={cn("pt-6 outline-none", className)} {...props} />;
}
