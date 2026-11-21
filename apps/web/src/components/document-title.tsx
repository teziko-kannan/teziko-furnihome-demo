"use client";

import { useEffect } from "react";

/**
 * Re-applies a page title after hydration. Used on the 404 page, where the server-rendered title is
 * correct but the client router replaces it with the root layout's default title.
 */
export function DocumentTitle({ title }: { title: string }) {
  useEffect(() => {
    document.title = title;
  }, [title]);
  return null;
}
