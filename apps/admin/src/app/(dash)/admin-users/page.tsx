import { adminUsers } from "@teziko/data";
import { Badge } from "@teziko/ui/components/badge";
import type { Metadata } from "next";
import { PageHeader } from "@/features/shell/page-header";
import { SimpleTable } from "@/features/shell/simple-table";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Admin users" };

const PERMS = {
  owner: "Everything",
  manager: "Catalogue, orders, marketing",
  support: "Orders and customers (read/update)",
} as const;

export default function Page() {
  return (
    <>
      <PageHeader
        title="Admin users"
        description="Seeded team members. Only admin@demo.com can sign in to this demo; the others are illustrative."
      />
      <SimpleTable
        caption="Admin users"
        head={["Name", "Role", "Permissions", "Last active"]}
        rows={adminUsers.map((u) => [
          <div key="n">
            <p className="font-medium">{u.name}</p>
            <p className="text-muted-foreground text-xs">{u.email}</p>
          </div>,
          <Badge key="r" variant={u.role === "owner" ? "default" : "muted"}>
            {u.role}
          </Badge>,
          PERMS[u.role],
          formatDateTime(u.lastActive),
        ])}
      />
    </>
  );
}
