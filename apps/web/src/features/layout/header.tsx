"use client";

import { useHydrated } from "@teziko/ui/hooks/use-hydrated";
import { usePrefersReducedMotion } from "@teziko/ui/hooks/use-reduced-motion";
import {
  GitCompareArrowsIcon,
  HeartIcon,
  MenuIcon,
  SearchIcon,
  ShoppingBagIcon,
  UserIcon,
} from "lucide-react";
import { m, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/format";
import { useCart, useCompare, useUi, useWishlist } from "../shopper/stores";
import { Logo } from "./logo";
import { MegaMenu } from "./mega-menu";
import { MobileNav } from "./mobile-nav";
import type { NavDepartment } from "./nav-data";

export function Header({ nav }: { nav: NavDepartment[] }) {
  const { scrollY } = useScroll();
  const reduced = usePrefersReducedMotion();
  const [hidden, setHidden] = useState(false);
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const setSearchOpen = useUi((s) => s.setSearchOpen);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setCompact(y > 40);
    setHidden(!reduced && y > 420 && y > prev && menuOpen === null);
  });

  // Close menus on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(null);
    setMobileOpen(false);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setSearchOpen]);

  return (
    <m.header
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="bg-chrome text-chrome-foreground sticky top-0 z-40"
      onPointerLeave={() => setMenuOpen(null)}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.5)] transition-opacity duration-300",
          compact ? "opacity-100" : "opacity-0",
        )}
      />
      <div className="container-page relative flex h-16 items-center gap-3 lg:h-[72px] lg:gap-6">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="-ml-2 inline-flex size-10 items-center justify-center rounded-full hover:bg-white/10 lg:hidden"
          aria-label="Open menu"
        >
          <MenuIcon className="size-5" />
        </button>

        <Link href="/" className="shrink-0 rounded-md">
          <m.span
            className="block origin-left"
            animate={{ scale: compact ? 0.9 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Logo />
          </m.span>
        </Link>

        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="text-chrome-muted ml-auto hidden h-11 w-full max-w-md items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 text-left text-sm transition-colors hover:border-white/35 hover:bg-white/10 md:flex lg:mx-auto"
        >
          <SearchIcon className="size-4 shrink-0" aria-hidden="true" />
          <span className="flex-1 truncate">Search sofas, ACs, lamps…</span>
          <kbd className="hidden rounded border border-white/20 px-1.5 py-0.5 font-sans text-[11px] lg:inline">
            Ctrl K
          </kbd>
        </button>

        <HeaderActions onSearch={() => setSearchOpen(true)} />
      </div>

      <nav aria-label="Main" className="relative hidden border-t border-white/10 lg:block">
        <ul className="container-page flex h-12 items-center gap-1">
          {nav.map((d) => (
            <li key={d.slug}>
              <button
                type="button"
                aria-expanded={menuOpen === d.slug}
                aria-controls={`mega-${d.slug}`}
                onClick={() => setMenuOpen((m) => (m === d.slug ? null : d.slug))}
                onPointerEnter={(e) => e.pointerType === "mouse" && setMenuOpen(d.slug)}
                className={cn(
                  "relative inline-flex h-12 items-center px-3 text-sm font-medium transition-colors hover:text-white",
                  menuOpen === d.slug ? "text-white" : "text-chrome-foreground/85",
                )}
              >
                {d.name}
                <span
                  aria-hidden="true"
                  className={cn(
                    "bg-accent absolute inset-x-3 bottom-0 h-0.5 origin-left transition-transform duration-300",
                    menuOpen === d.slug ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </button>
            </li>
          ))}
          {[
            { label: "New Arrivals", href: "/shop?sort=newest" },
            { label: "Best Sellers", href: "/shop?sort=popular" },
            { label: "Rooms", href: "/#rooms" },
          ].map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onPointerEnter={() => setMenuOpen(null)}
                className="text-chrome-foreground/85 inline-flex h-12 items-center px-3 text-sm font-medium transition-colors hover:text-white"
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li className="ml-auto">
            <Link
              href="/shop?tag=sale"
              onPointerEnter={() => setMenuOpen(null)}
              className="text-accent inline-flex h-12 items-center px-3 text-sm font-semibold hover:text-white"
            >
              Sale
            </Link>
          </li>
        </ul>
        <MegaMenu nav={nav} openSlug={menuOpen} onClose={() => setMenuOpen(null)} />
      </nav>

      <MobileNav nav={nav} open={mobileOpen} onOpenChange={setMobileOpen} />
    </m.header>
  );
}

function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="bg-accent text-accent-foreground absolute -top-0.5 -right-0.5 inline-flex min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] leading-[18px] font-bold tabular-nums">
      {count > 99 ? "99+" : count}
    </span>
  );
}

function HeaderActions({ onSearch }: { onSearch: () => void }) {
  const hydrated = useHydrated();
  const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const wishCount = useWishlist((s) => s.ids.length);
  const compareCount = useCompare((s) => s.ids.length);
  const setCartOpen = useUi((s) => s.setCartOpen);
  const iconBtn =
    "relative inline-flex size-10 items-center justify-center rounded-full transition-colors hover:bg-white/10";

  return (
    <div className="ml-auto flex items-center gap-0.5 md:ml-0">
      <button
        type="button"
        onClick={onSearch}
        className={cn(iconBtn, "md:hidden")}
        aria-label="Search"
      >
        <SearchIcon className="size-5" />
      </button>
      <Link
        href="/account"
        className={cn(iconBtn, "hidden sm:inline-flex")}
        aria-label="My account"
      >
        <UserIcon className="size-5" />
      </Link>
      <Link
        href="/compare"
        className={cn(iconBtn, "hidden sm:inline-flex")}
        aria-label={`Compare (${hydrated ? compareCount : 0} items)`}
      >
        <GitCompareArrowsIcon className="size-5" />
        <CountBadge count={hydrated ? compareCount : 0} />
      </Link>
      <Link
        href="/wishlist"
        className={iconBtn}
        aria-label={`Wishlist (${hydrated ? wishCount : 0} items)`}
      >
        <HeartIcon className="size-5" />
        <CountBadge count={hydrated ? wishCount : 0} />
      </Link>
      <button
        type="button"
        onClick={() => setCartOpen(true)}
        className={iconBtn}
        aria-label={`Open cart (${hydrated ? cartCount : 0} items)`}
      >
        <ShoppingBagIcon className="size-5" />
        <CountBadge count={hydrated ? cartCount : 0} />
      </button>
    </div>
  );
}
