import {
  bestSellers,
  brands,
  categories,
  coupons,
  getCategoryImage,
  getKindImage,
  getProductImage,
  newArrivals,
  productBySlug,
  products,
  productsByTag,
  rooms,
  type RoomInspiration,
} from "@teziko/data";
import type { Banner } from "@teziko/types";
import { Button } from "@teziko/ui/components/button";
import { BentoGrid, BentoItem } from "@teziko/ui/motion/bento-grid";
import { CountUp } from "@teziko/ui/motion/count-up";
import { ImageReveal } from "@teziko/ui/motion/image-reveal";
import { Marquee } from "@teziko/ui/motion/marquee";
import { Reveal } from "@teziko/ui/motion/reveal";
import { SpotlightCard } from "@teziko/ui/motion/spotlight-card";
import { Stagger, StaggerItem } from "@teziko/ui/motion/stagger";
import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { ProductImage } from "@/components/product-image";
import { SectionHeader } from "@/components/section-header";
import { formatINR } from "@/lib/format";
import { toCard } from "../catalog/card-data";
import { ProductCard } from "../catalog/product-card";
import { ProductRail } from "../catalog/product-rail";
import { CopyCode } from "./copy-code";
import { TrendingPinned } from "./trending-pinned";

export function ShopByCategory() {
  const subs = categories.filter((c) => c.parent);
  return (
    <section className="container-page py-16 sm:py-24" aria-labelledby="cat-heading">
      <SectionHeader
        id="cat-heading"
        eyebrow="Shop by category"
        title="Everything for the home, in one place"
        href="/shop"
        linkLabel="Shop all"
      />
      <Stagger
        className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6"
        interval={0.05}
      >
        {subs.slice(0, 12).map((c) => (
          <StaggerItem key={c.slug}>
            <Link href={`/category/${c.slug}`} className="group block">
              <span className="bg-muted block aspect-square overflow-hidden rounded-2xl">
                <ProductImage
                  image={getCategoryImage(c)}
                  sizes="(min-width: 1024px) 16vw, (min-width: 640px) 30vw, 46vw"
                  alt=""
                  className="transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
              </span>
              <span className="mt-3 flex items-center justify-between gap-2 text-sm font-medium">
                {c.name}
                <ArrowRightIcon
                  aria-hidden="true"
                  className="size-4 shrink-0 -translate-x-1 opacity-0 transition-[transform,opacity] group-hover:translate-x-0 group-hover:opacity-100"
                />
              </span>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

export function FeaturedCollections() {
  const tiles = [
    {
      title: "The living room edit",
      body: "Sofas, coffee tables and lamps that work together.",
      href: "/furniture",
      kind: "sectional" as const,
      hex: "#cdbfa8",
      span: "2x2" as const,
    },
    {
      title: "Cool, quiet bedrooms",
      body: "Inverter ACs and purifiers.",
      href: "/category/air-conditioners",
      kind: "air-conditioner" as const,
      hex: "#9fb5c4",
      span: "1x1" as const,
    },
    {
      title: "Kitchen upgrades",
      body: "Microwaves, mixers, dishwashers.",
      href: "/category/kitchen-appliances",
      kind: "microwave" as const,
      hex: "#3a3a3c",
      span: "1x1" as const,
    },
    {
      title: "Handmade by artisans",
      body: "Block prints, terracotta and kilims from across India.",
      href: "/home-decor",
      kind: "vase" as const,
      hex: "#b5654a",
      span: "2x1" as const,
    },
  ];
  return (
    <section className="container-page pb-16 sm:pb-24" aria-labelledby="col-heading">
      <SectionHeader
        id="col-heading"
        eyebrow="Featured collections"
        title="Curated for how you live"
      />
      <BentoGrid>
        {tiles.map((t, i) => (
          <BentoItem key={t.title} span={t.span} className="bg-muted">
            <Reveal className="h-full" delay={i * 0.06}>
              <SpotlightCard className="group h-full">
                <Link href={t.href} className="flex h-full min-h-[260px] flex-col justify-end p-6">
                  <span className="absolute inset-0 -z-10">
                    <ProductImage
                      image={getKindImage(t.kind, t.hex, i === 0 ? 3 : 0, "")}
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="transition-transform duration-1000 ease-out group-hover:scale-105"
                    />
                    <span className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
                  </span>
                  <h3 className="text-2xl text-white sm:text-3xl">{t.title}</h3>
                  <p className="mt-1.5 max-w-sm text-sm text-white/85">{t.body}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                    Explore{" "}
                    <ArrowUpRightIcon
                      aria-hidden="true"
                      className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </Link>
              </SpotlightCard>
            </Reveal>
          </BentoItem>
        ))}
      </BentoGrid>
    </section>
  );
}

export function TrendingFurniture() {
  const items = products
    .filter((p) => p.department === "furniture")
    .sort(
      (a, b) =>
        Number(b.tags.includes("trending")) - Number(a.tags.includes("trending")) ||
        b.sold - a.sold,
    )
    .slice(0, 8);
  return (
    <TrendingPinned
      header={
        <SectionHeader
          tone="dark"
          eyebrow="Trending furniture"
          title="What people are furnishing with this month"
          href="/furniture?sort=popular"
          linkLabel="See all furniture"
        />
      }
    >
      {items.map((p) => (
        <div
          key={p.id}
          className="bg-background text-foreground w-[72vw] shrink-0 rounded-2xl p-3 sm:w-[320px]"
        >
          <ProductCard product={toCard(p)} sizes="320px" />
        </div>
      ))}
    </TrendingPinned>
  );
}

export function BestSellingAppliances() {
  return (
    <section className="container-page py-16 sm:py-24" aria-label="Best-selling appliances">
      <ProductRail
        products={bestSellers("appliances", 10).map(toCard)}
        label="Best-selling appliances"
        header={
          <SectionHeader
            eyebrow="Best sellers"
            title="Best-selling appliances"
            className="mb-0 sm:mb-0"
            href="/home-appliances?sort=popular"
          />
        }
      />
    </section>
  );
}

export function NewArrivals() {
  return (
    <section className="container-page pb-16 sm:pb-24" aria-labelledby="new-heading">
      <SectionHeader
        id="new-heading"
        eyebrow="Just landed"
        title="New arrivals"
        href="/shop?sort=newest"
      />
      <Stagger
        className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4"
        interval={0.06}
      >
        {newArrivals(8).map((p) => (
          <StaggerItem key={p.id}>
            <ProductCard product={toCard(p)} />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

export function PromoOffers({ banners }: { banners: Banner[] }) {
  const codes = coupons.filter((c) => c.active).slice(0, 4);
  return (
    <section className="container-page pb-16 sm:pb-24" aria-labelledby="promo-heading">
      <h2 id="promo-heading" className="sr-only">
        Offers
      </h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {banners.map((b, i) => (
          <Reveal
            key={b.id}
            delay={i * 0.08}
            className="group relative overflow-hidden rounded-2xl"
            style={{ backgroundColor: b.tint }}
          >
            <div className="relative z-10 flex min-h-[280px] max-w-[60%] flex-col justify-center p-7 text-white sm:p-10">
              <p className="text-xs font-semibold tracking-[0.18em] uppercase opacity-85">
                {b.eyebrow}
              </p>
              <h3 className="mt-3 text-2xl sm:text-3xl">{b.title}</h3>
              <p className="mt-2 text-sm opacity-90">{b.body}</p>
              <Button asChild variant="inverse" size="sm" className="mt-6 self-start">
                <Link href={b.cta.href}>{b.cta.label}</Link>
              </Button>
            </div>
            <div className="absolute inset-y-0 right-0 w-[48%] transition-transform duration-700 ease-out group-hover:scale-105">
              <ProductImage
                image={getKindImage(b.kind, b.tint, 0, "")}
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="mix-blend-luminosity"
              />
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal className="border-border mt-4 flex flex-col gap-4 rounded-2xl border p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-xl">Codes you can use today</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Apply at checkout. One code per order.
          </p>
        </div>
        <ul className="flex flex-wrap gap-2">
          {codes.map((c) => (
            <li key={c.code}>
              <CopyCode code={c.code} description={c.description} />
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

export function SeasonalCollection({ banner }: { banner: Banner }) {
  const items = productsByTag("seasonal", 4);
  return (
    <section className="bg-muted py-16 sm:py-24" aria-labelledby="season-heading">
      <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.6fr] lg:items-center">
        <div>
          <ImageReveal className="aspect-[4/5] rounded-2xl" direction="up">
            <ProductImage
              image={getKindImage(banner.kind, banner.tint, 3, "")}
              sizes="(min-width: 1024px) 35vw, 100vw"
            />
          </ImageReveal>
        </div>
        <div>
          <SectionHeader
            id="season-heading"
            eyebrow={banner.eyebrow}
            title={banner.title}
            description={banner.body}
            href={banner.cta.href}
            linkLabel={banner.cta.label}
          />
          <Stagger className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
            {items.map((p) => (
              <StaggerItem key={p.id}>
                <ProductCard product={toCard(p)} sizes="(min-width: 1024px) 15vw, 46vw" />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

export function FeaturedBrands() {
  return (
    <section className="border-border border-y py-12" aria-labelledby="brands-heading">
      <h2
        id="brands-heading"
        className="container-page text-muted-foreground mb-6 text-center font-sans text-xs font-semibold tracking-[0.2em] uppercase"
      >
        Featured brands (fictional, for demo)
      </h2>
      <Marquee duration={45} label="Brands">
        {brands.map((b) => (
          <Link
            key={b.slug}
            href={`/shop?brand=${b.slug}`}
            className="group mx-6 flex flex-col items-center sm:mx-10"
          >
            <span className="font-display text-foreground/70 group-hover:text-foreground text-2xl whitespace-nowrap transition-colors sm:text-3xl">
              {b.name}
            </span>
            <span className="text-muted-foreground text-[11px]">{b.origin}</span>
          </Link>
        ))}
      </Marquee>
    </section>
  );
}

function RoomCard({ room, index }: { room: RoomInspiration; index: number }) {
  const items = room.productSlugs.map((s) => productBySlug.get(s)).filter((p) => p !== undefined);
  const hero = items[0]!;
  return (
    <Reveal
      delay={index * 0.08}
      className="group border-border bg-background overflow-hidden rounded-2xl border"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <ProductImage
          image={getProductImage(hero, 3)}
          sizes="(min-width: 1024px) 45vw, 100vw"
          alt=""
          className="transition-transform duration-1000 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <h3 className="text-2xl">{room.title}</h3>
        <p className="text-muted-foreground mt-1 text-sm">{room.blurb}</p>
        <ul className="divide-border mt-5 divide-y">
          {items.map((p) => (
            <li key={p.id}>
              <Link
                href={`/product/${p.slug}`}
                className="flex items-center gap-3 py-2.5 text-sm hover:underline"
              >
                <span className="bg-muted size-10 shrink-0 overflow-hidden rounded-md">
                  <ProductImage image={getProductImage(p, 0)} sizes="40px" alt="" />
                </span>
                <span className="min-w-0 flex-1 truncate">{p.name}</span>
                <span className="font-medium tabular-nums">{formatINR(p.price)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

export function RoomInspiration() {
  return (
    <section
      id="rooms"
      className="container-page scroll-mt-28 py-16 sm:py-24"
      aria-labelledby="rooms-heading"
    >
      <SectionHeader
        id="rooms-heading"
        eyebrow="Room inspiration"
        title="Shop complete rooms"
        description="Pieces that work together, picked by our (demo) stylists."
      />
      <div className="grid gap-6 md:grid-cols-2">
        {rooms.map((r, i) => (
          <RoomCard key={r.slug} room={r} index={i} />
        ))}
      </div>
    </section>
  );
}

export function StoreStats() {
  const stats = [
    { value: products.length, label: "Products in the demo catalogue" },
    { value: brands.length, label: "Fictional brands" },
    { value: categories.filter((c) => c.parent).length, label: "Categories" },
    { value: 14, label: "Days before demo data is deleted" },
  ];
  return (
    <section className="bg-chrome text-chrome-foreground py-16" aria-label="Store in numbers">
      <dl className="container-page grid grid-cols-2 gap-8 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="border-l border-white/15 pl-5">
            <dt className="text-chrome-muted text-sm">{s.label}</dt>
            <dd className="font-display order-first text-5xl text-white">
              <CountUp to={s.value} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
