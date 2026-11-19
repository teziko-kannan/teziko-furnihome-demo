"use client";

import type { SessionUser } from "@teziko/types";
import { create } from "zustand";

interface SessionState {
  user: SessionUser | null;
  status: "idle" | "loading" | "ready";
  load: () => Promise<void>;
  set: (u: SessionUser | null) => void;
  logout: () => Promise<void>;
}

/** Client view of the signed session cookie (httpOnly), fetched from /api/auth/session. */
export const useSession = create<SessionState>()((set, get) => ({
  user: null,
  status: "idle",
  load: async () => {
    if (get().status !== "idle") return;
    set({ status: "loading" });
    try {
      const res = await fetch("/api/auth/session", { cache: "no-store" });
      const json = (await res.json()) as { user: SessionUser | null };
      set({ user: json.user, status: "ready" });
    } catch {
      set({ user: null, status: "ready" });
    }
  },
  set: (user) => set({ user, status: "ready" }),
  logout: async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    set({ user: null, status: "ready" });
  },
}));
