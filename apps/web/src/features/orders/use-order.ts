"use client";

import { withSimulatedProgress } from "@teziko/data/orders";
import type { Order } from "@teziko/types";
import { useCallback, useEffect, useState } from "react";
import { getDataAdapter } from "../data-access";

type State = { key: string; order: Order | null; status: "loading" | "ready" | "error" };

/** Loads one order from the adapter and advances its simulated timeline every 20 seconds. */
export function useOrder(number: string, email?: string) {
  const key = `${number}|${email ?? ""}`;
  const [state, setState] = useState<State>({ key: "", order: null, status: "loading" });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let alive = true;
    getDataAdapter()
      .getOrder(number, email)
      .then(async (o) => {
        if (!alive) return;
        const progressed = o ? withSimulatedProgress(o) : null;
        if (o && progressed && progressed !== o)
          await getDataAdapter()
            .updateOrder(progressed)
            .catch(() => undefined);
        setState({ key, order: progressed, status: "ready" });
      })
      .catch(() => alive && setState({ key, order: null, status: "error" }));
    return () => {
      alive = false;
    };
  }, [key, number, email, tick]);

  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 20_000);
    return () => clearInterval(t);
  }, []);

  const replace = useCallback(
    async (o: Order) => {
      await getDataAdapter().updateOrder(o);
      setState({ key, order: o, status: "ready" });
    },
    [key],
  );

  return {
    order: state.key === key ? state.order : null,
    status: state.key === key ? state.status : "loading",
    replace,
  };
}
