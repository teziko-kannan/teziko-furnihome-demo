"use client";

import { ChevronDownIcon } from "lucide-react";
import { Accordion as A } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../lib/utils";

export const Accordion = A.Root;

export function AccordionItem({ className, ...props }: ComponentProps<typeof A.Item>) {
  return <A.Item className={cn("border-border border-b", className)} {...props} />;
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof A.Trigger>) {
  return (
    <A.Header className="flex">
      <A.Trigger
        className={cn(
          "hover:text-foreground/80 flex flex-1 items-center justify-between gap-4 py-4 text-left text-[15px] font-medium transition-colors [&[data-state=open]>svg]:rotate-180",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="text-muted-foreground size-4 shrink-0 transition-transform duration-200" />
      </A.Trigger>
    </A.Header>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: ComponentProps<typeof A.Content>) {
  return (
    <A.Content
      className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-1 overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("text-muted-foreground pb-4 leading-relaxed", className)}>{children}</div>
    </A.Content>
  );
}
