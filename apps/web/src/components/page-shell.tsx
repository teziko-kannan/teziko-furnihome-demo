import { Breadcrumb } from "@teziko/ui/components/breadcrumb";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/format";

interface Props {
  title: string;
  description?: string;
  crumbs?: { label: string; href?: string }[];
  children: ReactNode;
  className?: string;
  narrow?: boolean;
}

export function PageShell({ title, description, crumbs, children, className, narrow }: Props) {
  return (
    <div className={cn("container-page pt-6 pb-20 sm:pt-8", narrow && "max-w-3xl", className)}>
      {crumbs ? (
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, ...crumbs]}
          renderLink={(c, ch) => <Link href={c.href}>{ch}</Link>}
        />
      ) : null}
      <header className="mt-5 mb-10 max-w-3xl">
        <h1 className="text-3xl sm:text-[2.6rem] sm:leading-tight">{title}</h1>
        {description ? (
          <p className="text-muted-foreground mt-3 text-[15px] leading-relaxed">{description}</p>
        ) : null}
      </header>
      {children}
    </div>
  );
}
