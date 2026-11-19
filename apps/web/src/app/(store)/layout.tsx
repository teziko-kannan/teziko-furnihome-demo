import { announcements } from "@teziko/data";
import { Toaster } from "@teziko/ui/components/toaster";
import type { ReactNode } from "react";
import { RetentionPurge } from "@/features/data-access/retention";
import { AnnouncementBar } from "@/features/layout/announcement-bar";
import { Footer } from "@/features/layout/footer";
import { Header } from "@/features/layout/header";
import { LazyChrome } from "@/features/layout/lazy-chrome";
import { buildNav } from "@/features/layout/nav-data";
import { SmoothScroll } from "@/features/layout/smooth-scroll";
import { WhatsAppButton } from "@/features/layout/whatsapp-button";
import { ViewTransitionProvider } from "@/features/navigation/view-transition";

export default function StoreLayout({ children }: { children: ReactNode }) {
  const nav = buildNav();
  return (
    <ViewTransitionProvider>
      <a
        href="#main"
        className="bg-primary text-primary-foreground sr-only z-[60] rounded-full px-4 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <AnnouncementBar messages={announcements} />
      <Header nav={nav} />
      <main id="main" className="min-h-[60vh]">
        {children}
      </main>
      <Footer nav={nav} />
      <LazyChrome nav={nav} />
      <WhatsAppButton />
      <Toaster />
      <SmoothScroll />
      <RetentionPurge />
    </ViewTransitionProvider>
  );
}
