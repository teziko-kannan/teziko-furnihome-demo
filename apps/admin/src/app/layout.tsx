import { MotionProvider, revealBootScript } from "@teziko/ui/motion/reveal-boot";
import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const heading = Fraunces({ subsets: ["latin"], variable: "--font-heading", display: "swap" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Home Vibe Admin", template: "%s | Home Vibe Admin" },
  robots: { index: false, follow: false, nocache: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN" className={`${heading.variable} ${body.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: revealBootScript }} />
      </head>
      <body className="bg-muted/50 min-h-dvh">
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
