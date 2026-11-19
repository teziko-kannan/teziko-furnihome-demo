import type { ProductImage as Img } from "@teziko/data/images";
import Image from "next/image";
import type { CSSProperties } from "react";
import { cn } from "@/lib/format";

interface Props {
  image: Img;
  sizes: string;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
  alt?: string;
}

/** next/image wrapper with blur-up placeholder for catalogue illustrations. */
export function ProductImage({ image, sizes, priority, className, style, alt }: Props) {
  return (
    <Image
      src={image.src}
      alt={alt ?? image.alt}
      width={image.width}
      height={image.height}
      sizes={sizes}
      priority={priority}
      placeholder="blur"
      blurDataURL={image.blurDataURL}
      className={cn("h-full w-full object-cover", className)}
      style={style}
    />
  );
}
