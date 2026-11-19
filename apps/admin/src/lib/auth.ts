import "server-only";
import { resolveSecret, SESSION_COOKIE, verifySession } from "@teziko/validators/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const authSecret = () => resolveSecret(process.env.AUTH_SECRET);

/** Server-side role check used by every admin page (the proxy is the first line of defence). */
export async function requireAdmin() {
  const store = await cookies();
  const session = await verifySession(store.get(SESSION_COOKIE)?.value, authSecret());
  if (!session || session.role !== "admin") redirect("/login");
  return session;
}
