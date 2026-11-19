import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "../lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide whitespace-nowrap uppercase [&_svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        sale: "bg-accent text-accent-foreground",
        muted: "bg-muted text-foreground",
        outline: "border border-border bg-background text-foreground",
        success: "bg-success/10 text-success",
        warning: "bg-warning/12 text-warning-strong",
        error: "bg-error/10 text-error",
        info: "bg-info/10 text-info",
        inverse: "bg-white text-black",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
