"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useUi } from "../shopper/stores";
import type { NavDepartment } from "./nav-data";

// Cart drawer (vaul) and search palette (cmdk) load on first open, keeping them out of the initial bundle.
const CartDrawer = dynamic(() => import("../cart/cart-drawer").then((m) => m.CartDrawer), {
  ssr: false,
});
const SearchPalette = dynamic(() => import("./search-palette").then((m) => m.SearchPalette), {
  ssr: false,
});

export function LazyChrome({ nav }: { nav: NavDepartment[] }) {
  const cartOpen = useUi((s) => s.cartOpen);
  const searchOpen = useUi((s) => s.searchOpen);
  const [mounted, setMounted] = useState({ cart: false, search: false });
  if ((cartOpen && !mounted.cart) || (searchOpen && !mounted.search)) {
    setMounted({ cart: mounted.cart || cartOpen, search: mounted.search || searchOpen });
  }
  return (
    <>
      {mounted.cart ? <CartDrawer /> : null}
      {mounted.search ? <SearchPalette nav={nav} /> : null}
    </>
  );
}
