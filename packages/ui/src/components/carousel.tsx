"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { prefersReducedMotion } from "../hooks/use-reduced-motion";
import { cn } from "../lib/utils";

type EmblaApi = UseEmblaCarouselType[1];
type EmblaOptions = Parameters<typeof useEmblaCarousel>[0];

interface CarouselCtx {
  api: EmblaApi;
  canPrev: boolean;
  canNext: boolean;
  selected: number;
  snaps: number;
  prev: () => void;
  next: () => void;
  scrollTo: (i: number) => void;
}

const Ctx = createContext<CarouselCtx | null>(null);

export function useCarousel() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCarousel must be used inside <Carousel>");
  return ctx;
}

interface CarouselProps {
  children: ReactNode;
  options?: EmblaOptions;
  /** Autoplay delay in ms. Autoplay is skipped when the user prefers reduced motion. */
  autoplay?: number;
  className?: string;
  label: string;
}

export function Carousel({ children, options, autoplay, className, label }: CarouselProps) {
  const plugins = useMemo(
    () =>
      autoplay && typeof window !== "undefined" && !prefersReducedMotion()
        ? [Autoplay({ delay: autoplay, stopOnInteraction: true, stopOnMouseEnter: true })]
        : [],
    [autoplay],
  );
  const [viewportRef, api] = useEmblaCarousel({ align: "start", ...options }, plugins);
  const [state, setState] = useState({ canPrev: false, canNext: false, selected: 0, snaps: 0 });

  const sync = useCallback((a: NonNullable<EmblaApi>) => {
    setState({
      canPrev: a.canScrollPrev(),
      canNext: a.canScrollNext(),
      selected: a.selectedScrollSnap(),
      snaps: a.scrollSnapList().length,
    });
  }, []);

  useEffect(() => {
    if (!api) return;
    api.on("select", sync).on("reInit", sync);
    // Embla reports initial state via its init cycle; schedule to avoid sync setState in effect.
    const id = requestAnimationFrame(() => sync(api));
    return () => {
      cancelAnimationFrame(id);
      api.off("select", sync).off("reInit", sync);
    };
  }, [api, sync]);

  const value = useMemo<CarouselCtx>(
    () => ({
      api,
      ...state,
      prev: () => api?.scrollPrev(),
      next: () => api?.scrollNext(),
      scrollTo: (i: number) => api?.scrollTo(i),
    }),
    [api, state],
  );

  return (
    <Ctx.Provider value={value}>
      <section
        aria-roledescription="carousel"
        aria-label={label}
        className={cn("relative", className)}
      >
        <div ref={viewportRef} className="overflow-hidden">
          {children}
        </div>
      </section>
    </Ctx.Provider>
  );
}

export function CarouselTrack({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("-ml-4 flex touch-pan-y", className)} {...props} />;
}

export function CarouselSlide({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      className={cn("min-w-0 shrink-0 grow-0 basis-full pl-4", className)}
      {...props}
    />
  );
}

export function CarouselControls({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const { canPrev, canNext, prev, next } = useCarousel();
  const btn = cn(
    "inline-flex size-10 items-center justify-center rounded-full border transition-colors disabled:opacity-35",
    tone === "light"
      ? "border-foreground/15 bg-background hover:border-foreground"
      : "border-white/25 text-white hover:border-white",
  );
  return (
    <div className={cn("flex gap-2", className)}>
      <button
        type="button"
        className={btn}
        onClick={prev}
        disabled={!canPrev}
        aria-label="Previous slide"
      >
        <ChevronLeftIcon className="size-4" />
      </button>
      <button
        type="button"
        className={btn}
        onClick={next}
        disabled={!canNext}
        aria-label="Next slide"
      >
        <ChevronRightIcon className="size-4" />
      </button>
    </div>
  );
}

export function CarouselDots({ className }: { className?: string }) {
  const { snaps, selected, scrollTo } = useCarousel();
  if (snaps < 2) return null;
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {Array.from({ length: snaps }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => scrollTo(i)}
          aria-label={`Go to slide ${i + 1}`}
          aria-current={i === selected ? "true" : undefined}
          className="group inline-flex h-6 items-center"
        >
          <span
            className={cn(
              "bg-foreground/20 block h-1.5 w-6 origin-left rounded-full transition-transform duration-300",
              i === selected ? "bg-foreground scale-x-100" : "scale-x-50",
            )}
          />
        </button>
      ))}
    </div>
  );
}
