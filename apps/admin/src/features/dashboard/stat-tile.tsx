import type { LucideIcon } from "lucide-react";
import { CountUp } from "@teziko/ui/motion/count-up";
import { Reveal } from "@teziko/ui/motion/reveal";
import Link from "next/link";

interface Props {
  label: string;
  value: number;
  prefix?: string;
  hint: string;
  icon: LucideIcon;
  href: string;
  delay?: number;
}

/** KPI tile with a count-up number. Renders the final value on the server. */
export function StatTile({ label, value, prefix = "", hint, icon: Icon, href, delay = 0 }: Props) {
  return (
    <Reveal delay={delay} y={12}>
      <Link
        href={href}
        className="border-border bg-background hover:shadow-soft block h-full rounded-2xl border p-5 transition-shadow"
      >
        <div className="text-muted-foreground flex items-center justify-between text-sm">
          {label}
          <Icon className="size-4" aria-hidden="true" />
        </div>
        <p className="font-display mt-3 text-3xl tracking-tight">
          {prefix}
          <CountUp to={value} />
        </p>
        <p className="text-muted-foreground mt-1 text-xs">{hint}</p>
      </Link>
    </Reveal>
  );
}
