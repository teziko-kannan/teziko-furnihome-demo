"use client";

import { Badge } from "@teziko/ui/components/badge";
import {
  Carousel,
  CarouselControls,
  CarouselDots,
  CarouselSlide,
  CarouselTrack,
} from "@teziko/ui/components/carousel";
import { QuoteIcon } from "lucide-react";
import { SectionHeader } from "@/components/section-header";

interface Testimonial {
  name: string;
  quote: string;
  product: string;
}

/** Testimonial slider. Every quote is sample content and labelled as such. */
export function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <section className="bg-muted py-16 sm:py-24" aria-labelledby="t-heading">
      <div className="container-page">
        <Carousel label="Customer stories (demo)" autoplay={6000} options={{ loop: true }}>
          <div className="mb-8 flex items-end justify-between gap-4">
            <SectionHeader
              id="t-heading"
              eyebrow="Customer stories"
              title="What shoppers tell us"
              description="Sample testimonials written for this demo. They are not from real customers."
              className="mb-0 sm:mb-0"
            />
            <CarouselControls className="hidden shrink-0 sm:flex" />
          </div>
          <CarouselTrack>
            {items.map((t) => (
              <CarouselSlide key={t.name} className="md:basis-1/2 lg:basis-1/3">
                <figure className="bg-background flex h-full flex-col rounded-2xl p-7">
                  <QuoteIcon className="text-foreground/25 size-6" aria-hidden="true" />
                  <blockquote className="font-display mt-4 flex-1 text-xl leading-snug">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-6 flex items-center justify-between gap-3 text-sm">
                    <span>
                      <span className="block font-semibold">{t.name}</span>
                      <span className="text-muted-foreground block text-xs">{t.product}</span>
                    </span>
                    <Badge variant="muted">Demo</Badge>
                  </figcaption>
                </figure>
              </CarouselSlide>
            ))}
          </CarouselTrack>
          <CarouselDots className="mt-8" />
        </Carousel>
      </div>
    </section>
  );
}
