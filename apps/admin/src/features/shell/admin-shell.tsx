"use client";

import { Badge } from "@teziko/ui/components/badge";
import { Button } from "@teziko/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@teziko/ui/components/sheet";
import { ExternalLinkIcon, LogOutIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/format";
import { NAV } from "./nav";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="space-y-6">
      {NAV.map((g) => (
        <div key={g.group}>
          <p className="text-chrome-muted mb-2 px-3 text-[11px] font-semibold tracking-[0.15em] uppercase">
            {g.group}
          </p>
          <ul className="space-y-0.5">
            {g.items.map((it) => {
              const active = it.href === "/" ? pathname === "/" : pathname.startsWith(it.href);
              return (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-white/10 text-white"
                        : "text-chrome-foreground/75 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    {active ? (
                      <span
                        aria-hidden="true"
                        className="bg-accent absolute inset-y-2 left-0 w-0.5 rounded-full"
                      />
                    ) : null}
                    <it.icon className="size-4" aria-hidden="true" />
                    {it.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <span className="font-display flex items-baseline gap-1 text-2xl text-white">
      teziko
      <span aria-hidden="true" className="bg-accent inline-block size-1.5 rounded-full" />
      <span className="text-chrome-muted ml-1 font-sans text-[10px] font-semibold tracking-[0.2em] uppercase">
        Admin
      </span>
    </span>
  );
}

export function AdminShell({
  children,
  user,
  storefrontUrl,
}: {
  children: ReactNode;
  user: { name: string; email: string };
  storefrontUrl: string;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[248px_1fr]">
      <a
        href="#admin-main"
        className="bg-primary text-primary-foreground sr-only z-50 rounded-full px-4 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <aside className="bg-chrome text-chrome-foreground sticky top-0 hidden h-dvh flex-col overflow-y-auto px-3 py-5 lg:flex">
        <Link href="/" className="mb-8 px-3">
          <Brand />
        </Link>
        <NavLinks />
        <div className="text-chrome-muted mt-auto space-y-2 border-t border-white/10 px-3 pt-4 text-xs">
          <p className="truncate">{user.email}</p>
          <a
            href={storefrontUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-white"
          >
            Open storefront <ExternalLinkIcon className="size-3" aria-hidden="true" />
          </a>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="border-border bg-background/90 sticky top-0 z-30 flex h-16 items-center gap-3 border-b px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="hover:bg-muted -ml-2 inline-flex size-10 items-center justify-center rounded-full lg:hidden"
            aria-label="Open navigation"
          >
            <MenuIcon className="size-5" />
          </button>
          <Badge variant="warning" className="min-w-0 truncate normal-case">
            <span className="sm:hidden">Demo · local edits</span>
            <span className="hidden sm:inline">
              Demo admin · edits are saved in this browser only
            </span>
          </Badge>
          <div className="ml-auto flex shrink-0 items-center gap-3">
            <span className="text-muted-foreground hidden text-sm sm:inline">{user.name}</span>
            <Button variant="outline" size="sm" onClick={signOut} aria-label="Sign out">
              <LogOutIcon aria-hidden="true" /> <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </header>
        <main id="admin-main" className="min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="bg-chrome text-chrome-foreground">
          <SheetHeader className="border-white/10">
            <SheetTitle>
              <Brand />
            </SheetTitle>
            <SheetDescription className="sr-only">Admin navigation</SheetDescription>
          </SheetHeader>
          <div className="overflow-y-auto p-3">
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
