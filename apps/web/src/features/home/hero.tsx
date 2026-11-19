"use client";

import type { ProductImage as Img } from "@teziko/data/images";
import { Button } from "@teziko/ui/components/button";
import { useMediaQuery } from "@teziko/ui/hooks/use-media-query";
import { usePrefersReducedMotion } from "@teziko/ui/hooks/use-reduced-motion";
import { AnimatedText } from "@teziko/ui/motion/animated-text";
import { ImageReveal } from "@teziko/ui/motion/image-reveal";
import { Magnetic } from "@teziko/ui/motion/magnetic";
import { Reveal } from "@teziko/ui/motion/reveal";
import { ArrowRightIcon, ShieldCheckIcon, TruckIcon, WrenchIcon } from "lucide-react";
import { m, useScroll, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ProductImage } from "@/components/product-image";
import { formatINR } from "@/lib/format";

const FurnitureScene = dynamic(() => import("../three/furniture-scene"), { ssr: false });

interface HeroProps {
  eyebrow: string;
  title: string;
  body: string;
  cta: { label: string; href: string };
  image: Img;
  spotlight: { name: string; href: string; price: number; image: Img; colour: string };
}

export function Hero({ eyebrow, title, body, cta, image, spotlight }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const desktop = useMediaQuery("(min-width: 1024px) and (pointer: fine)");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced || !desktop ? 0 : 90]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, reduced || !desktop ? 0 : -60]);

  // Load the 3D preview only on capable desktops, after the page is idle.
  const [show3d, setShow3d] = useState(false);
  useEffect(() => {
    if (!desktop || reduced) return;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const id = w.requestIdleCallback
      ? w.requestIdleCallback(() => setShow3d(true))
      : window.setTimeout(() => setShow3d(true), 1500);
    return () => (w.cancelIdleCallback ? w.cancelIdleCallback(id) : clearTimeout(id));
  }, [desktop, reduced]);

  return (
    <section ref={ref} className="bg-background relative overflow-hidden">
      <div className="container-page grid items-center gap-10 py-10 sm:py-14 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:py-20">
        <div className="max-w-xl">
          <Reveal y={10}>
            <p className="text-muted-foreground mb-4 text-xs font-semibold tracking-[0.2em] uppercase">
              {eyebrow}
            </p>
          </Reveal>
          <AnimatedText
            text={title}
            className="text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-[4.2rem]"
            delay={0.1}
          />
          <Reveal delay={0.35} y={14}>
            <p className="text-muted-foreground mt-6 max-w-md text-[17px] leading-relaxed">
              {body}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic>
                <Button asChild variant="accent" size="lg">
                  <Link href={cta.href}>
                    {cta.label}
                    <ArrowRightIcon aria-hidden="true" />
                  </Link>
                </Button>
              </Magnetic>
              <Button asChild variant="outline" size="lg">
                <Link href="/#rooms">Explore rooms</Link>
              </Button>
            </div>
            <ul className="border-border text-muted-foreground mt-10 grid max-w-md grid-cols-3 gap-4 border-t pt-6 text-xs">
              <li className="flex flex-col gap-1.5">
                <TruckIcon className="text-foreground size-4" aria-hidden="true" />
                Free delivery over ₹4,999
              </li>
              <li className="flex flex-col gap-1.5">
                <WrenchIcon className="text-foreground size-4" aria-hidden="true" />
                Free installation on big items
              </li>
              <li className="flex flex-col gap-1.5">
                <ShieldCheckIcon className="text-foreground size-4" aria-hidden="true" />
                Up to 5-year warranty
              </li>
            </ul>
          </Reveal>
        </div>

        <div className="relative">
          <m.div style={{ y }}>
            <ImageReveal
              className="aspect-[4/5] rounded-[1.75rem] sm:aspect-[5/4] lg:aspect-[4/5]"
              maskClassName="bg-chrome"
            >
              <ProductImage image={image} sizes="(min-width: 1024px) 50vw, 100vw" priority alt="" />
            </ImageReveal>
          </m.div>

          <m.div
            style={{ y: cardY }}
            className="absolute right-4 bottom-4 left-4 sm:right-auto sm:bottom-8 sm:-left-6 sm:w-72"
          >
            <Reveal delay={0.9} y={20}>
              <Link
                href={spotlight.href}
                className="group bg-background/95 shadow-lift flex items-center gap-3 rounded-2xl p-3 backdrop-blur"
              >
                <span className="bg-muted size-16 shrink-0 overflow-hidden rounded-xl">
                  <ProductImage image={spotlight.image} sizes="64px" alt="" />
                </span>
                <span className="min-w-0">
                  <span className="text-muted-foreground block text-[11px] font-semibold tracking-wider uppercase">
                    Featured
                  </span>
                  <span className="block truncate text-sm font-semibold group-hover:underline">
                    {spotlight.name}
                  </span>
                  <span className="block text-sm tabular-nums">{formatINR(spotlight.price)}</span>
                </span>
              </Link>
            </Reveal>
          </m.div>

          {show3d ? (
            <div
              className="bg-background/80 shadow-lift absolute top-6 -right-4 hidden size-44 overflow-hidden rounded-2xl backdrop-blur xl:block"
              aria-hidden="true"
            >
              <FurnitureScene
                kind="armchair"
                color={spotlight.colour}
                autoRotate
                interactive={false}
              />
              <span className="text-muted-foreground absolute bottom-2 left-3 text-[10px] font-semibold tracking-wider uppercase">
                3D preview
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
