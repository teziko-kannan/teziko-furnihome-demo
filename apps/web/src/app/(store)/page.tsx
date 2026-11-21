import { banners, getKindImage, getProductImage, productBySlug, testimonials } from "@teziko/data";
import type { Metadata } from "next";
import { Hero } from "@/features/home/hero";
import { Newsletter } from "@/features/home/newsletter";
import {
  BestSellingAppliances,
  FeaturedBrands,
  FeaturedCollections,
  NewArrivals,
  PromoOffers,
  RoomInspiration,
  SeasonalCollection,
  ShopByCategory,
  StoreStats,
  TrendingFurniture,
} from "@/features/home/sections";
import { Testimonials } from "@/features/home/testimonials";
import { RecentlyViewed } from "@/features/product/recently-viewed";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { title: site.name, description: site.description, url: "/" },
};

export default function HomePage() {
  const hero = banners.find((b) => b.placement === "hero")!;
  const promos = banners.filter((b) => b.placement === "promo");
  const seasonal = banners.find((b) => b.placement === "seasonal")!;
  const spot = productBySlug.get("halden-wingback-armchair")!;

  return (
    <>
      <Hero
        eyebrow={hero.eyebrow}
        title={hero.title}
        body={hero.body}
        cta={hero.cta}
        image={getKindImage(
          hero.kind,
          hero.tint,
          3,
          "A terracotta sofa styled in a warm living room",
        )}
        spotlight={{
          name: spot.name,
          href: `/product/${spot.slug}`,
          price: spot.price,
          image: getProductImage(spot, 0),
          colour: spot.variants[0]!.colour.hex,
        }}
      />
      <ShopByCategory />
      <FeaturedCollections />
      <TrendingFurniture />
      <BestSellingAppliances />
      <NewArrivals />
      <PromoOffers banners={promos} />
      <SeasonalCollection banner={seasonal} />
      <FeaturedBrands />
      <RoomInspiration />
      <StoreStats />
      <Testimonials items={testimonials} />
      <RecentlyViewed />
      <Newsletter />
    </>
  );
}
