"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@teziko/ui/components/dropdown-menu";
import { toast } from "@teziko/ui/components/toaster";
import { HeartIcon, LogOutIcon, PackageIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { cn } from "@/lib/format";
import { useSession } from "../account/use-session";

/** Initials avatar with a deterministic warm background picked from the name. */
export function Avatar({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
  const palette = ["#ff4848", "#c99a2e", "#8fa58a", "#c49a92", "#9fb5c4"];
  const bg = palette[[...name].reduce((s, c) => s + c.charCodeAt(0), 0) % palette.length];
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-black ring-2 ring-white/20",
        className,
      )}
      style={{ backgroundColor: bg }}
    >
      {initials || "?"}
    </span>
  );
}

/**
 * Signed out: a profile icon linking to the account page (which redirects to sign in).
 * Signed in: the user's avatar and first name, opening a small account menu.
 */
export function AccountMenu({ iconClassName }: { iconClassName: string }) {
  const user = useSession((s) => s.user);
  const load = useSession((s) => s.load);
  const logout = useSession((s) => s.logout);

  useEffect(() => {
    void load();
  }, [load]);

  if (!user) {
    return (
      <Link href="/account" className={iconClassName} aria-label="Sign in or view my account">
        <UserIcon className="size-5" />
      </Link>
    );
  }

  const firstName = user.name.split(" ")[0] ?? user.name;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="hidden h-10 items-center gap-2 rounded-full pr-1 pl-1 transition-colors hover:bg-white/10 sm:inline-flex xl:pr-3"
        aria-label={`Account menu for ${user.name}`}
      >
        <Avatar name={user.name} />
        <span className="hidden max-w-24 truncate text-sm font-medium xl:inline">{firstName}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-3 py-2">
          <Avatar name={user.name} className="size-9 ring-0" />
          <span className="min-w-0">
            <span className="text-foreground block truncate text-sm font-semibold">
              {user.name}
            </span>
            <span className="block truncate">{user.email}</span>
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account">
            <UserIcon /> My account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account/orders">
            <PackageIcon /> My orders
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/wishlist">
            <HeartIcon /> Wishlist
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={async () => {
            await logout();
            toast("Signed out");
            // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- auth change: a full load clears router-cached pages rendered for the previous session.
            window.location.assign("/");
          }}
        >
          <LogOutIcon /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
