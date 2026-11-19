import { getKindImage } from "@teziko/data/images";
import { Button } from "@teziko/ui/components/button";
import Link from "next/link";
import { ProductImage } from "@/components/product-image";

export default function NotFound() {
  return (
    <div className="container-page grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-2">
      <div>
        <p className="text-muted-foreground text-sm font-semibold tracking-[0.2em] uppercase">
          404
        </p>
        <h1 className="mt-3 text-4xl sm:text-5xl">This room is empty</h1>
        <p className="text-muted-foreground mt-4 max-w-md">
          The page you were looking for has moved or never existed. Try the catalogue or search
          instead.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="accent" size="lg">
            <Link href="/shop">Shop all products</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
      <div className="bg-muted aspect-square max-w-md overflow-hidden rounded-2xl">
        <ProductImage
          image={getKindImage("armchair", "#c49a92", 3, "")}
          sizes="(min-width: 1024px) 40vw, 90vw"
        />
      </div>
    </div>
  );
}
