import { brands, getKindImage, products } from "@teziko/data";
import { Button } from "@teziko/ui/components/button";
import { ImageReveal } from "@teziko/ui/motion/image-reveal";
import { Reveal } from "@teziko/ui/motion/reveal";
import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { ProductImage } from "@/components/product-image";

export const metadata: Metadata = {
  title: "About Home Vibe",
  description:
    "Home Vibe is a demonstration storefront built by Teziko Solutions to show a modern furniture and appliance shopping experience.",
  alternates: { canonical: "/about" },
};

export default function Page() {
  const values = [
    {
      title: "Considered pieces",
      body: "Every product in the demo catalogue is chosen to work in real Indian homes: humid summers, compact apartments and big family dinners.",
    },
    {
      title: "Honest pricing",
      body: "Prices are shown inclusive of GST with the tax broken out at checkout. Discounts are calculated against MRP.",
    },
    {
      title: "Privacy by default",
      body: "The demo collects the minimum data it needs and deletes it automatically after 14 days.",
    },
  ];
  return (
    <PageShell title="About Home Vibe" crumbs={[{ label: "About" }]}>
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal className="text-foreground/90 space-y-4 text-[17px] leading-relaxed">
          <p>
            Home Vibe is a <strong>demonstration store</strong> built by Teziko Solutions. It shows
            how a premium furniture, appliance and decor brand could sell online: fast browsing,
            honest pricing, and calm, considered design.
          </p>
          <p>
            The catalogue has {products.length} products from {brands.length} fictional brands.
            Product images are illustrations generated for the demo, reviews and testimonials are
            sample content, and checkout is simulated. Nothing is charged or shipped.
          </p>
          <Button asChild variant="accent" size="lg" className="mt-2">
            <Link href="/shop">Browse the catalogue</Link>
          </Button>
        </Reveal>
        <ImageReveal className="aspect-[4/3] rounded-2xl">
          <ProductImage
            image={getKindImage("dining-table", "#b07a44", 3, "")}
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </ImageReveal>
      </div>
      <ul className="mt-20 grid gap-6 md:grid-cols-3">
        {values.map((v, i) => (
          <Reveal
            as="li"
            key={v.title}
            delay={i * 0.08}
            className="border-border rounded-2xl border p-6"
          >
            <h2 className="text-2xl">{v.title}</h2>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{v.body}</p>
          </Reveal>
        ))}
      </ul>
    </PageShell>
  );
}
