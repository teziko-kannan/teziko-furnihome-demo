import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/** True only when the optional Supabase adapter is selected and configured. */
export function supabaseEnabled() {
  return (
    process.env.NEXT_PUBLIC_DATA_ADAPTER === "supabase" &&
    Boolean(process.env.SUPABASE_URL) &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
  );
}

/** Server-only client using the service role key. Never import this from client code. */
export function getSupabase(): SupabaseClient | null {
  if (!supabaseEnabled()) return null;
  client ??= createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
