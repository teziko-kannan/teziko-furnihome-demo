"use client";

import { useEffect } from "react";
import { getDataAdapter } from ".";

/** Runs the 14-day retention purge once per app load (local adapter). */
export function RetentionPurge() {
  useEffect(() => {
    void getDataAdapter().purgeExpired();
  }, []);
  return null;
}
