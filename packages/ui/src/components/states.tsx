import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../lib/utils";

interface StateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  tone?: "default" | "error";
}

/** Shared empty / error state block. */
export function StateBlock({
  icon: Icon,
  title,
  description,
  action,
  className,
  tone = "default",
}: StateProps) {
  return (
    <div
      role={tone === "error" ? "alert" : undefined}
      className={cn(
        "border-border flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-14 text-center",
        className,
      )}
    >
      <span
        className={cn(
          "mb-4 inline-flex size-14 items-center justify-center rounded-full",
          tone === "error" ? "bg-error/10 text-error" : "bg-muted text-foreground",
        )}
      >
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <h2 className="font-sans text-lg font-semibold tracking-normal">{title}</h2>
      {description ? (
        <p className="text-muted-foreground mt-1.5 max-w-sm text-sm">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
