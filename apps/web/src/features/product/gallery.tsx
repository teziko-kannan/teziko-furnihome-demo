"use client";

import type { ProductImage as Img } from "@teziko/data/images";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@teziko/ui/components/dialog";
import { usePrefersReducedMotion } from "@teziko/ui/hooks/use-reduced-motion";
import { ChevronLeftIcon, ChevronRightIcon, ExpandIcon } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useRef, useState, type PointerEvent, type TouchEvent } from "react";
import { ProductImage } from "@/components/product-image";
import { cn } from "@/lib/format";
import { productImageTransitionName } from "../navigation/view-transition";

export function Gallery({ images, slug, name }: { images: Img[]; slug: string; name: string }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [lightbox, setLightbox] = useState(false);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const reduced = usePrefersReducedMotion();
  const touchX = useRef<number | null>(null);
  const current = images[index] ?? images[0]!;

  // Reset to the first view when the colour changes.
  const [lastFirst, setLastFirst] = useState(images[0]?.src);
  if (lastFirst !== images[0]?.src) {
    setLastFirst(images[0]?.src);
    setIndex(0);
  }

  const go = (n: number) => {
    setDir(n > index ? 1 : -1);
    setIndex((n + images.length) % images.length);
  };

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  }

  function onTouchEnd(e: TouchEvent) {
    const start = touchX.current;
    touchX.current = null;
    if (start === null) return;
    const dx = (e.changedTouches[0]?.clientX ?? start) - start;
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
  }

  const slide = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, x: dir * 40 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: dir * -40 },
      };

  return (
    <div className="flex flex-col-reverse gap-3 lg:flex-row lg:gap-4">
      <div
        className="flex gap-2.5 overflow-x-auto pb-1 lg:w-20 lg:flex-col lg:overflow-visible"
        role="tablist"
        aria-label="Product images"
      >
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Show image ${i + 1}: ${img.alt}`}
            onClick={() => go(i)}
            className={cn(
              "bg-muted relative size-16 shrink-0 overflow-hidden rounded-lg transition-[opacity,transform] duration-300 lg:size-20",
              i === index ? "ring-foreground ring-2 ring-offset-2" : "opacity-60 hover:opacity-100",
            )}
          >
            <ProductImage image={img} sizes="80px" alt="" />
          </button>
        ))}
      </div>

      <div className="relative flex-1">
        <div
          className="bg-muted relative aspect-square cursor-zoom-in overflow-hidden rounded-2xl"
          style={{ viewTransitionName: productImageTransitionName(slug) }}
          onPointerMove={onMove}
          onPointerLeave={() => setZoom(null)}
          onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
          onTouchEnd={onTouchEnd}
          onClick={() => setLightbox(true)}
          role="presentation"
        >
          <AnimatePresence initial={false} mode="popLayout" custom={dir}>
            <m.div
              key={current.src}
              className="absolute inset-0"
              {...slide}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductImage
                image={current}
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority={index === 0}
                className="transition-transform duration-300 ease-out"
                style={
                  zoom
                    ? { transform: "scale(1.9)", transformOrigin: `${zoom.x}% ${zoom.y}%` }
                    : undefined
                }
              />
            </m.div>
          </AnimatePresence>
        </div>
        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="shadow-soft absolute right-3 bottom-3 inline-flex size-10 items-center justify-center rounded-full bg-white/90 hover:bg-white"
          aria-label="Open full-screen gallery"
        >
          <ExpandIcon className="size-4" />
        </button>
        <div className="absolute inset-y-0 left-2 flex items-center lg:hidden">
          <button
            type="button"
            onClick={() => go(index - 1)}
            className="shadow-soft inline-flex size-9 items-center justify-center rounded-full bg-white/85"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="size-4" />
          </button>
        </div>
        <div className="absolute inset-y-0 right-2 flex items-center lg:hidden">
          <button
            type="button"
            onClick={() => go(index + 1)}
            className="shadow-soft inline-flex size-9 items-center justify-center rounded-full bg-white/85"
            aria-label="Next image"
          >
            <ChevronRightIcon className="size-4" />
          </button>
        </div>
      </div>

      <Dialog open={lightbox} onOpenChange={setLightbox}>
        <DialogContent
          className="bg-background max-w-[min(92vw,900px)] p-3 sm:p-4"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(index + 1);
            if (e.key === "ArrowLeft") go(index - 1);
          }}
        >
          <DialogTitle className="sr-only">{name}: image gallery</DialogTitle>
          <DialogDescription className="sr-only">
            Use the left and right arrow keys to browse images.
          </DialogDescription>
          <div className="bg-muted relative aspect-square overflow-hidden rounded-xl">
            <AnimatePresence initial={false} mode="popLayout">
              <m.div
                key={current.src}
                className="absolute inset-0"
                {...slide}
                transition={{ duration: 0.4 }}
              >
                <ProductImage image={current} sizes="900px" />
              </m.div>
            </AnimatePresence>
          </div>
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => go(index - 1)}
              className="border-border hover:border-foreground inline-flex size-10 items-center justify-center rounded-full border"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="size-4" />
            </button>
            <p className="text-muted-foreground text-sm" aria-live="polite">
              {index + 1} / {images.length}: {current.alt}
            </p>
            <button
              type="button"
              onClick={() => go(index + 1)}
              className="border-border hover:border-foreground inline-flex size-10 items-center justify-center rounded-full border"
              aria-label="Next image"
            >
              <ChevronRightIcon className="size-4" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
