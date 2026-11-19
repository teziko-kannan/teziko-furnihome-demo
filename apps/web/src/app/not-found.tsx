import type { Metadata } from "next";
import StoreLayout from "./(store)/layout";
import StoreNotFound from "./(store)/not-found";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

/** Unmatched URLs render outside route groups, so wrap the 404 in the store chrome explicitly. */
export default function NotFound() {
  return (
    <StoreLayout>
      <StoreNotFound />
    </StoreLayout>
  );
}
