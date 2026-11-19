import type { ComponentProps } from "react";
import { cn } from "../lib/utils";

export const fieldClasses =
  "w-full min-w-0 rounded-lg border border-input bg-background px-3.5 text-[15px] text-foreground transition-colors placeholder:text-muted-foreground/80 hover:border-foreground/40 focus-visible:border-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-error";

export function Input({ className, type = "text", ...props }: ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(fieldClasses, "h-11", className)}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(fieldClasses, "min-h-28 py-2.5", className)}
      {...props}
    />
  );
}

export function NativeSelect({ className, ...props }: ComponentProps<"select">) {
  return (
    <select
      data-slot="native-select"
      className={cn(
        fieldClasses,
        "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%23111' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")] h-11 appearance-none bg-[right_0.75rem_center] bg-no-repeat pr-9",
        className,
      )}
      {...props}
    />
  );
}
