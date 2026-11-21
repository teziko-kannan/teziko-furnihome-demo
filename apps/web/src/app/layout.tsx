import { MotionProvider, revealBootScript } from "@teziko/ui/motion/reveal-boot";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { body, heading } from "@/lib/fonts";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}: ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  openGraph: { type: "website", siteName: site.name, locale: "en_IN" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN" className={`${heading.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: revealBootScript }} />
      </head>
      <body className="min-h-dvh">
        <noscript>
          <div
            style={{
              background: "#ff4848",
              color: "#000",
              padding: "10px 16px",
              textAlign: "center",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            JavaScript is turned off. You can browse, but forms (sign in, checkout, contact) need
            JavaScript.
          </div>
        </noscript>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
