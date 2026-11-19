import {
  brandBySlug,
  categoryBySlug,
  getProductImage,
  getReviewsForProduct,
  productBySlug,
  products,
  relatedProducts,
} from "@teziko/data";
import { Breadcrumb } from "@teziko/ui/components/breadcrumb";
import { Rating } from "@teziko/ui/components/rating";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@teziko/ui/components/tabs";
import { Reveal } from "@teziko/ui/motion/reveal";
import { CheckIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SectionHeader } from "@/components/section-header";
import { toCard } from "@/features/catalog/card-data";
import { ProductRail } from "@/features/catalog/product-rail";
import { ProductJsonLd } from "@/features/product/json-ld";
import { PurchasePanel } from "@/features/product/purchase-panel";
import { RecentlyViewed } from "@/features/product/recently-viewed";
import { Reviews } from "@/features/product/reviews";
import { ViewIn3D } from "@/features/product/view-in-3d";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = productBySlug.get(slug);
  if (!p) return {};
  const brand = brandBySlug.get(p.brand)?.name ?? "";
  const title = `${p.name} by ${brand}`;
  return {
    title,
    description: p.shortDescription,
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: {
      type: "website",
      title,
      description: p.shortDescription,
      images: [{ url: getProductImage(p, 0).src, width: 800, height: 800, alt: p.name }],
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const product = productBySlug.get(slug);
  if (!product) notFound();
  const brand = brandBySlug.get(product.brand);
  const sub = categoryBySlug.get(product.subcategory)!;
  const dep = categoryBySlug.get(product.category)!;
  const crumbs = [
    { label: "Home", href: "/" },
    { label: dep.name, href: `/${dep.slug}` },
    { label: sub.name, href: `/category/${sub.slug}` },
    { label: product.name },
  ];
  const related = relatedProducts(product).map(toCard);
  const specs = [
    ...product.specs,
    {
      label: "Warranty",
      value: product.warrantyMonths ? `${product.warrantyMonths} months` : "Not applicable",
    },
    { label: "GST rate", value: `${product.gstRate}% (indicative)` },
  ];

  return (
    <>
      <ProductJsonLd
        product={product}
        brandName={brand?.name ?? product.brand}
        crumbs={[
          { name: "Home", path: "/" },
          { name: dep.name, path: `/${dep.slug}` },
          { name: sub.name, path: `/category/${sub.slug}` },
          { name: product.name, path: `/product/${product.slug}` },
        ]}
      />
      <div className="container-page pt-6 pb-10">
        <Breadcrumb
          items={crumbs}
          renderLink={(c, children) => <Link href={c.href}>{children}</Link>}
          className="mb-6"
        />
        <Suspense fallback={<div className="skeleton aspect-[2/1] rounded-2xl" />}>
          <PurchasePanel product={product} card={toCard(product)}>
            <div>
              <Link
                href={`/shop?brand=${product.brand}`}
                className="text-muted-foreground hover:text-foreground text-sm font-medium hover:underline"
              >
                {brand?.name}
              </Link>
              <h1 className="mt-1.5 text-3xl leading-tight sm:text-4xl">{product.name}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <a href="#reviews" className="rounded-sm hover:underline">
                  <Rating value={product.rating} count={product.reviewCount} />
                </a>
                <span className="text-muted-foreground text-xs">
                  SKU {product.variants[0]?.sku}
                </span>
              </div>
              <p className="text-muted-foreground mt-4 text-[15px] leading-relaxed">
                {product.shortDescription}
              </p>
              <ul className="mt-4 grid gap-2 text-sm">
                {product.highlights.map((h) => (
                  <li key={h} className="flex gap-2">
                    <CheckIcon className="text-success mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    {h}
                  </li>
                ))}
              </ul>
              <ViewIn3D
                kind={product.kind}
                hex={product.variants[0]!.colour.hex}
                name={product.name}
              />
            </div>
          </PurchasePanel>
        </Suspense>
      </div>

      <div className="container-page py-12">
        <Tabs defaultValue="details">
          <TabsList aria-label="Product information">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="delivery">Delivery & returns</TabsTrigger>
          </TabsList>
          <TabsContent
            value="details"
            className="text-foreground/90 max-w-3xl text-[15px] leading-relaxed"
          >
            <p>{product.description}</p>
            {brand ? (
              <p className="text-muted-foreground mt-4">
                <strong className="text-foreground">{brand.name}</strong>, {brand.origin}.{" "}
                {brand.tagline}. (Fictional demo brand.)
              </p>
            ) : null}
          </TabsContent>
          <TabsContent value="specs">
            <dl className="divide-border border-border grid max-w-3xl divide-y rounded-xl border">
              {specs.map((s) => (
                <div
                  key={s.label}
                  className="grid grid-cols-[minmax(120px,40%)_1fr] gap-4 px-4 py-3 text-sm"
                >
                  <dt className="text-muted-foreground">{s.label}</dt>
                  <dd className="font-medium">{s.value}</dd>
                </div>
              ))}
            </dl>
          </TabsContent>
          <TabsContent
            value="delivery"
            className="text-foreground/90 max-w-3xl space-y-3 text-[15px] leading-relaxed"
          >
            <p>
              Usually delivered in {product.deliveryDays[0]} to {product.deliveryDays[1]} working
              days. Free delivery above ₹4,999; large items below that carry a ₹499 delivery charge.
            </p>
            <p>
              {product.assembly === "free-installation"
                ? "Free installation is scheduled within 48 hours of delivery."
                : product.assembly === "self"
                  ? "Ships flat-packed with tools and an illustrated guide."
                  : "Ready to use out of the box."}
            </p>
            <p>
              Returns accepted within 10 days if unused and in original packaging.{" "}
              <Link href="/returns-policy" className="font-medium underline underline-offset-4">
                Read the full policy
              </Link>
              .
            </p>
            <p className="text-muted-foreground text-sm">
              This is a demo store: nothing will actually be delivered.
            </p>
          </TabsContent>
        </Tabs>
      </div>

      <div id="reviews" className="container-page border-border scroll-mt-32 border-t py-14">
        <Reviews productId={product.id} seeded={getReviewsForProduct(product.id)} />
      </div>

      {related.length ? (
        <Reveal as="section" className="container-page py-14" aria-label="You may also like">
          <ProductRail
            products={related}
            label="You may also like"
            header={
              <SectionHeader
                eyebrow={sub.name}
                title="You may also like"
                className="mb-0 sm:mb-0"
              />
            }
          />
        </Reveal>
      ) : null}
      <RecentlyViewed excludeId={product.id} />
    </>
  );
}
