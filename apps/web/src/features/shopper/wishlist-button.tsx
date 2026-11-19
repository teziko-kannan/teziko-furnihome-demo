"use client";

import { useHydrated } from "@teziko/ui/hooks/use-hydrated";
import { HeartIcon } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/format";
import { useToggleWishlist } from "./actions";
import { useWishlist } from "./stores";

const PARTICLES = Array.from({ length: 7 }, (_, i) => (i / 7) * Math.PI * 2);

/** Heart toggle with a small burst when saved. Transform/opacity only. */
export function WishlistButton({
  id,
  name,
  className,
  size = "md",
}: {
  id: string;
  name: string;
  className?: string;
  size?: "sm" | "md";
}) {
  const hydrated = useHydrated();
  const saved = useWishlist((s) => s.ids.includes(id)) && hydrated;
  const toggle = useToggleWishlist();
  const [burst, setBurst] = useState(0);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (toggle(id, name)) setBurst((b) => b + 1);
      }}
      className={cn(
        "text-foreground shadow-soft relative inline-flex items-center justify-center rounded-full bg-white/90 backdrop-blur transition-colors hover:bg-white",
        size === "md" ? "size-10" : "size-9",
        className,
      )}
    >
      <m.span
        key={burst}
        initial={burst ? { scale: 0.6 } : false}
        animate={{ scale: [0.6, 1.3, 1] }}
        transition={{ duration: 0.45 }}
      >
        <HeartIcon
          className={cn("size-[18px]", saved && "fill-accent text-accent")}
          strokeWidth={2}
        />
      </m.span>
      <AnimatePresence>
        {burst > 0 ? (
          <span key={burst} aria-hidden="true" className="pointer-events-none absolute inset-0">
            {PARTICLES.map((a, i) => (
              <m.span
                key={i}
                className="bg-accent absolute top-1/2 left-1/2 -mt-[3px] -ml-[3px] size-1.5 rounded-full"
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: Math.cos(a) * 22, y: Math.sin(a) * 22, opacity: 0, scale: 0.4 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              />
            ))}
          </span>
        ) : null}
      </AnimatePresence>
    </button>
  );
}
