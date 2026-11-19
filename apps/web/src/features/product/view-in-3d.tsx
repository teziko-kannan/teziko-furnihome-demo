"use client";

import { Button } from "@teziko/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@teziko/ui/components/dialog";
import { Skeleton } from "@teziko/ui/components/skeleton";
import { usePrefersReducedMotion } from "@teziko/ui/hooks/use-reduced-motion";
import type { ProductKind } from "@teziko/types";
import { Rotate3dIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import type { SceneKind } from "../three/furniture-scene";

// R3F is loaded only when the viewer opens, keeping it out of the initial bundle.
const FurnitureScene = dynamic(() => import("../three/furniture-scene"), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full rounded-xl" />,
});

const SCENE_KIND: Partial<Record<ProductKind, SceneKind>> = {
  sofa: "sofa",
  sectional: "sofa",
  armchair: "armchair",
  "dining-chair": "chair",
  "dining-table": "table",
  desk: "table",
  "coffee-table": "coffee-table",
  bed: "bed",
};

export function ViewIn3D({ kind, hex, name }: { kind: ProductKind; hex: string; name: string }) {
  const [open, setOpen] = useState(false);
  const reduced = usePrefersReducedMotion();
  const scene = SCENE_KIND[kind];
  if (!scene) return null;

  return (
    <>
      <Button variant="outline" size="sm" className="mt-5" onClick={() => setOpen(true)}>
        <Rotate3dIcon aria-hidden="true" />
        View in 3D
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{name} in 3D</DialogTitle>
            <DialogDescription>
              A simplified 3D preview. Drag to rotate, scroll or pinch to zoom.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted aspect-[4/3] overflow-hidden rounded-xl">
            {open ? <FurnitureScene kind={scene} color={hex} autoRotate={!reduced} /> : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
