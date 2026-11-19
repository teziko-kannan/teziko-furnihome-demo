"use client";

import { ArrowRightIcon } from "lucide-react";
import { AnimatePresence, m, type Variants } from "motion/react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ProductImage } from "@/components/product-image";
import type { NavDepartment } from "./nav-data";

const panel: Variants = {
  hidden: { opacity: 0, y: -10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.045,
      delayChildren: 0.05,
    },
  },
  exit: { opacity: 0, y: -6, transition: { duration: 0.18 } },
};

const column: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

export function MegaMenu({
  nav,
  openSlug,
  onClose,
}: {
  nav: NavDepartment[];
  openSlug: string | null;
  onClose: () => void;
}) {
  const dep = nav.find((d) => d.slug === openSlug);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openSlug) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        document.querySelector<HTMLButtonElement>(`[aria-controls="mega-${openSlug}"]`)?.focus();
      }
    }
    function onClick(e: MouseEvent) {
      const target = e.target as Node;
      if (ref.current?.contains(target)) return;
      if ((target as HTMLElement).closest?.("[aria-controls^='mega-']")) return;
      onClose();
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
    };
  }, [openSlug, onClose]);

  return (
    <AnimatePresence>
      {dep ? (
        <m.div
          key={dep.slug}
          ref={ref}
          id={`mega-${dep.slug}`}
          variants={panel}
          initial="hidden"
          animate="show"
          exit="exit"
          className="border-border bg-background text-foreground shadow-lift absolute inset-x-0 top-full border-t"
        >
          <div className="container-page grid grid-cols-[1fr_300px] gap-10 py-8">
            <div className="grid grid-cols-4 gap-x-8 gap-y-7">
              {dep.columns.map((c) => (
                <m.div key={c.slug} variants={column}>
                  <Link href={c.href} className="text-sm font-semibold hover:underline">
                    {c.name}
                  </Link>
                  <ul className="mt-3 space-y-2">
                    {c.items.map((it) => (
                      <li key={it.href}>
                        <Link
                          href={it.href}
                          className="text-muted-foreground hover:text-foreground line-clamp-1 text-[13px]"
                        >
                          {it.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </m.div>
              ))}
            </div>
            <m.div variants={column}>
              <Link href={dep.href} className="group bg-muted block overflow-hidden rounded-xl">
                <div className="aspect-[4/3] overflow-hidden">
                  <ProductImage
                    image={dep.image}
                    sizes="300px"
                    alt=""
                    className="transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <p className="font-display text-lg">Shop all {dep.name}</p>
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-[13px]">
                    {dep.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold">
                    Explore{" "}
                    <ArrowRightIcon
                      aria-hidden="true"
                      className="size-3.5 transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </Link>
            </m.div>
          </div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
