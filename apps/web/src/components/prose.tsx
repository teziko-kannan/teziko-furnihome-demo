import type { ReactNode } from "react";

/** Readable long-form text for policy pages. */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="text-foreground/90 [&_h2]:text-foreground max-w-3xl space-y-4 text-[15px] leading-relaxed [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-10 [&_h2]:font-sans [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-normal [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1.5">
      {children}
    </div>
  );
}
