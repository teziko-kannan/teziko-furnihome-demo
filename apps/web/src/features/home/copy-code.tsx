"use client";

import { toast } from "@teziko/ui/components/toaster";
import { CopyIcon } from "lucide-react";

export function CopyCode({ code, description }: { code: string; description: string }) {
  return (
    <button
      type="button"
      title={description}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
          toast.success(`Copied ${code}`, { description });
        } catch {
          toast(`Use code ${code}`, { description });
        }
      }}
      className="border-foreground/40 hover:border-foreground hover:bg-muted inline-flex h-9 items-center gap-2 rounded-full border border-dashed px-3.5 font-mono text-[13px] font-semibold tracking-wide transition-colors"
      aria-label={`Copy coupon code ${code}: ${description}`}
    >
      {code}
      <CopyIcon className="size-3.5" aria-hidden="true" />
    </button>
  );
}
