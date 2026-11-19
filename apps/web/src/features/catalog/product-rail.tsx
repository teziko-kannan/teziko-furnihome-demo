"use client";

import {
  Carousel,
  CarouselControls,
  CarouselSlide,
  CarouselTrack,
} from "@teziko/ui/components/carousel";
import type { ReactNode } from "react";
import type { CardProduct } from "./card-data";
import { ProductCard } from "./product-card";

/** Horizontal product carousel (Embla) with prev/next controls. */
export function ProductRail({
  products,
  label,
  header,
  autoplay,
}: {
  products: CardProduct[];
  label: string;
  header?: ReactNode;
  autoplay?: number;
}) {
  return (
    <Carousel label={label} options={{ dragFree: true }} autoplay={autoplay}>
      <div className="mb-6 flex items-end justify-between gap-4">
        {header}
        <CarouselControls className="hidden shrink-0 sm:flex" />
      </div>
      <CarouselTrack>
        {products.map((p) => (
          <CarouselSlide
            key={p.id}
            className="basis-[68%] sm:basis-[42%] md:basis-[31%] lg:basis-[23%]"
          >
            <ProductCard
              product={p}
              sizes="(min-width: 1024px) 23vw, (min-width: 640px) 42vw, 68vw"
            />
          </CarouselSlide>
        ))}
      </CarouselTrack>
    </Carousel>
  );
}
