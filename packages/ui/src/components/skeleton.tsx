import type { ComponentProps } from "react";
import { cn } from "../lib/utils";

/** Shimmer placeholder. The shimmer is a transform animation on a pseudo-element. */
export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div aria-hidden="true" data-slot="skeleton" className={cn("skeleton", className)} {...props} />
  );
}
