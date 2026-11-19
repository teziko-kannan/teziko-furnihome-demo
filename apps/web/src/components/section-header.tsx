import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/format";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  actions?: ReactNode;
  className?: string;
  tone?: "light" | "dark";
  id?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "View all",
  actions,
  className,
  tone = "light",
  id,
}: Props) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow ? (
          <p
            className={cn(
              "mb-2 text-xs font-semibold tracking-[0.18em] uppercase",
              tone === "dark" ? "text-chrome-muted" : "text-muted-foreground",
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <h2
          id={id}
          className={cn("text-3xl leading-tight sm:text-4xl", tone === "dark" && "text-white")}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "mt-3 text-[15px] leading-relaxed",
              tone === "dark" ? "text-chrome-muted" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-4">
        {actions}
        {href ? (
          <Link
            href={href}
            className={cn(
              "group inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline",
              tone === "dark" ? "text-white" : "text-foreground",
            )}
          >
            {linkLabel}
            <ArrowRightIcon
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
