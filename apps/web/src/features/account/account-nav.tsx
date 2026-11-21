"use client";

import { Button } from "@teziko/ui/components/button";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/format";
import { useSession } from "./use-session";

const LINKS = [
  { href: "/account", label: "Profile & addresses" },
  { href: "/account/orders", label: "My orders" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/track-order", label: "Track an order" },
];

export function AccountNav() {
  const pathname = usePathname();
  const logout = useSession((s) => s.logout);
  return (
    <nav aria-label="Account" className="flex gap-1 overflow-x-auto lg:flex-col">
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          aria-current={pathname === l.href ? "page" : undefined}
          className={cn(
            "shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition-colors lg:rounded-lg",
            pathname === l.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
          )}
        >
          {l.label}
        </Link>
      ))}
      <Button
        variant="ghost"
        className="shrink-0 justify-start rounded-full lg:mt-4 lg:rounded-lg"
        onClick={async () => {
          await logout();
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- auth change: a full load clears router-cached pages rendered for the previous session.
          window.location.assign("/");
        }}
      >
        <LogOutIcon aria-hidden="true" /> Sign out
      </Button>
    </nav>
  );
}
