import type { Product } from "@teziko/types";
import { getProductImage } from "@teziko/data/images";
import type { BreadcrumbList, Product as ProductLd, WithContext } from "schema-dts";
import { absoluteUrl } from "@/lib/site";

/**
 * Product + breadcrumb structured data. Ratings and reviews are intentionally omitted because the
 * seeded reviews are demo content; publishing them as aggregateRating would be fake structured data.
 */
export function ProductJsonLd({
  product,
  brandName,
  crumbs,
}: {
  product: Product;
  brandName: string;
  crumbs: { name: string; path: string }[];
}) {
  const inStock = product.variants.some((v) => v.stock > 0);
  const data: WithContext<ProductLd> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    sku: product.variants[0]?.sku,
    image: [absoluteUrl(getProductImage(product, 0).src)],
    brand: { "@type": "Brand", name: brandName },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/product/${product.slug}`),
      priceCurrency: "INR",
      price: product.price,
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
  const breadcrumb: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
