import { Stagger, StaggerItem } from "@teziko/ui/motion/stagger";
import { InfoIcon } from "lucide-react";
import Link from "next/link";
import { site } from "@/lib/site";
import { Logo } from "./logo";
import type { NavDepartment } from "./nav-data";

export function Footer({ nav }: { nav: NavDepartment[] }) {
  const help = [
    ["Track order", "/track-order"],
    ["FAQs", "/faqs"],
    ["Contact us", "/contact"],
    ["Returns & refunds", "/returns-policy"],
  ];
  const company = [
    ["About Teziko", "/about"],
    ["Privacy policy", "/privacy-policy"],
    ["Terms of use", "/terms"],
    ["Compare products", "/compare"],
  ];

  return (
    <footer className="bg-chrome text-chrome-foreground">
      <div className="border-b border-white/10">
        <p className="container-page text-chrome-foreground/85 flex items-start gap-2.5 py-4 text-[13px] sm:items-center">
          <InfoIcon className="text-accent mt-0.5 size-4 shrink-0 sm:mt-0" aria-hidden="true" />
          {site.demoNotice}
        </p>
      </div>
      <Stagger className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
        <StaggerItem className="max-w-xs">
          <Logo />
          <p className="text-chrome-muted mt-4 text-sm leading-relaxed">
            {site.tagline}. A demo storefront by Teziko Solutions.
          </p>
        </StaggerItem>
        {nav.map((d) => (
          <StaggerItem key={d.slug}>
            <h2 className="font-sans text-sm font-semibold tracking-normal text-white">{d.name}</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {d.columns.slice(0, 5).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={c.href}
                    className="text-chrome-muted transition-colors hover:text-white"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </StaggerItem>
        ))}
        <StaggerItem>
          <h2 className="font-sans text-sm font-semibold tracking-normal text-white">Help</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[...help, ...company].map(([label, href]) => (
              <li key={href}>
                <Link href={href!} className="text-chrome-muted transition-colors hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </StaggerItem>
      </Stagger>
      <div className="border-t border-white/10">
        <div className="container-page text-chrome-muted flex flex-col gap-2 py-6 text-xs sm:flex-row sm:justify-between">
          <p>© 2026 Teziko Solutions. Demo content. Brands shown are fictional.</p>
          <p>Prices in INR, inclusive of GST. Payments are simulated.</p>
        </div>
      </div>
    </footer>
  );
}
