import type { HTMLAttributes } from "react";
import { cn } from "../lib/utils";

/** Responsive bento layout: one column on phones, 4-column dense grid on desktop. */
export function BentoGrid({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "grid auto-rows-[minmax(220px,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-flow-dense lg:grid-cols-4",
        className,
      )}
      {...rest}
    />
  );
}

interface BentoItemProps extends HTMLAttributes<HTMLDivElement> {
  span?: "1x1" | "2x1" | "1x2" | "2x2";
}

const spans: Record<NonNullable<BentoItemProps["span"]>, string> = {
  "1x1": "",
  "2x1": "sm:col-span-2",
  "1x2": "lg:row-span-2",
  "2x2": "sm:col-span-2 lg:row-span-2",
};

export function BentoItem({ span = "1x1", className, ...rest }: BentoItemProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl", spans[span], className)} {...rest} />
  );
}
