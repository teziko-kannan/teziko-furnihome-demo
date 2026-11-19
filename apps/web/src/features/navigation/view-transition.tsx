"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";

type Navigate = (href: string, sharedName?: string, el?: HTMLElement | null) => void;

const Ctx = createContext<Navigate | null>(null);

type DocWithVT = Document & {
  startViewTransition?: (cb: () => Promise<void>) => { finished: Promise<void> };
};

/**
 * Shared-element transitions between listing and product pages using the View Transitions API.
 * Falls back to a normal navigation when unsupported or when reduced motion is preferred.
 */
export function ViewTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const pending = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Route committed: let the browser capture the new state.
    const resolve = pending.current;
    if (resolve) {
      pending.current = null;
      requestAnimationFrame(() => resolve());
    }
  }, [pathname]);

  const navigate = useCallback<Navigate>(
    (href, sharedName, el) => {
      const doc = document as DocWithVT;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!doc.startViewTransition || reduced || !sharedName || !el) {
        router.push(href);
        return;
      }
      el.style.viewTransitionName = sharedName;
      const vt = doc.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            pending.current = resolve;
            router.push(href);
            // Safety net in case navigation is slow or fails.
            setTimeout(resolve, 1500);
          }),
      );
      vt.finished.finally(() => {
        el.style.viewTransitionName = "";
      });
    },
    [router],
  );

  return <Ctx.Provider value={navigate}>{children}</Ctx.Provider>;
}

export function useTransitionNavigate() {
  const nav = useContext(Ctx);
  const router = useRouter();
  return nav ?? ((href: string) => router.push(href));
}

export const productImageTransitionName = (slug: string) =>
  `product-${slug.replace(/[^a-z0-9-]/g, "")}`;
