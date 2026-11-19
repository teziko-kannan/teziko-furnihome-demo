import { localAdapter } from "./local-adapter";
import { remoteAdapter } from "./remote-adapter";
import type { DataAdapter } from "./types";

export type { DataAdapter, UserReview } from "./types";
export { RETENTION_DAYS } from "./types";

/** Picks the adapter from NEXT_PUBLIC_DATA_ADAPTER. Defaults to the local adapter. */
export function getDataAdapter(): DataAdapter {
  return process.env.NEXT_PUBLIC_DATA_ADAPTER === "supabase" ? remoteAdapter : localAdapter;
}
