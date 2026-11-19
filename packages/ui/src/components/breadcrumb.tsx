import { ChevronRightIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * Accessible breadcrumb. Pass a link renderer (e.g. next/link) so this package stays framework-agnostic.
 */
export function Breadcrumb({
  items,
  renderLink,
  className,
}: {
  items: Crumb[];
  renderLink: (c: Required<Crumb>, children: ReactNode) => ReactNode;
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-muted-foreground text-[13px]", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {item.href && !last ? (
                renderLink(
                  item as Required<Crumb>,
                  <span className="hover:text-foreground hover:underline">{item.label}</span>,
                )
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={cn(last && "text-foreground")}
                >
                  {item.label}
                </span>
              )}
              {!last ? <ChevronRightIcon aria-hidden="true" className="size-3.5" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
