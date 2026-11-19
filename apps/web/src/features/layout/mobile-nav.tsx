"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@teziko/ui/components/accordion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@teziko/ui/components/sheet";
import Link from "next/link";
import { Logo } from "./logo";
import type { NavDepartment } from "./nav-data";

export function MobileNav({
  nav,
  open,
  onOpenChange,
}: {
  nav: NavDepartment[];
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="text-foreground">
        <SheetHeader className="bg-chrome">
          <SheetTitle>
            <Logo />
          </SheetTitle>
          <SheetDescription className="sr-only">Store navigation</SheetDescription>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 pb-8">
          <Accordion type="single" collapsible>
            {nav.map((d) => (
              <AccordionItem key={d.slug} value={d.slug}>
                <AccordionTrigger className="text-base">{d.name}</AccordionTrigger>
                <AccordionContent className="text-foreground">
                  <ul className="space-y-1">
                    <li>
                      <Link href={d.href} className="block rounded-md py-2 font-semibold">
                        Shop all {d.name}
                      </Link>
                    </li>
                    {d.columns.map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={c.href}
                          className="text-muted-foreground hover:text-foreground block rounded-md py-2"
                        >
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <ul className="mt-4 space-y-1 text-[15px]">
            {[
              ["Shop all", "/shop"],
              ["New arrivals", "/shop?sort=newest"],
              ["Sale", "/shop?tag=sale"],
              ["Compare", "/compare"],
              ["My account", "/account"],
              ["Track order", "/track-order"],
              ["Help & FAQs", "/faqs"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href!} className="block rounded-md py-2.5 font-medium">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
