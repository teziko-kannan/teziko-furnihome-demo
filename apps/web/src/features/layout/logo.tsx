import { cn } from "@/lib/format";

/** Wordmark: serif name with a coral dot. */
export function Logo({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <span
      className={cn(
        "font-display inline-flex items-baseline gap-1 text-[26px] leading-none tracking-tight",
        tone === "light" ? "text-white" : "text-foreground",
        className,
      )}
    >
      teziko
      <span
        aria-hidden="true"
        className="bg-accent inline-block size-2 translate-y-[-2px] rounded-full"
      />
      <span className="ml-1 font-sans text-[11px] font-semibold tracking-[0.2em] uppercase opacity-70">
        Home
      </span>
    </span>
  );
}
