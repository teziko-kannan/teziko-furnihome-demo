"use client";

import { CheckIcon } from "lucide-react";
import { Checkbox as CB, RadioGroup as RG, Slider as SL, Switch as SW } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../lib/utils";

export function Checkbox({ className, ...props }: ComponentProps<typeof CB.Root>) {
  return (
    <CB.Root
      className={cn(
        "peer border-foreground/30 bg-background hover:border-foreground data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground inline-flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors",
        className,
      )}
      {...props}
    >
      <CB.Indicator>
        <CheckIcon className="size-3.5" strokeWidth={3} />
      </CB.Indicator>
    </CB.Root>
  );
}

export function RadioGroup({ className, ...props }: ComponentProps<typeof RG.Root>) {
  return <RG.Root className={cn("grid gap-3", className)} {...props} />;
}

export function RadioGroupItem({ className, ...props }: ComponentProps<typeof RG.Item>) {
  return (
    <RG.Item
      className={cn(
        "border-foreground/30 bg-background hover:border-foreground data-[state=checked]:border-primary inline-flex size-[18px] shrink-0 items-center justify-center rounded-full border transition-colors",
        className,
      )}
      {...props}
    >
      <RG.Indicator className="bg-primary size-2.5 rounded-full" />
    </RG.Item>
  );
}

export function Slider({ className, ...props }: ComponentProps<typeof SL.Root>) {
  const count = (props.value ?? props.defaultValue ?? [0]).length;
  return (
    <SL.Root
      className={cn("relative flex w-full touch-none items-center py-2 select-none", className)}
      {...props}
    >
      <SL.Track className="bg-border relative h-1 w-full grow overflow-hidden rounded-full">
        <SL.Range className="bg-primary absolute h-full" />
      </SL.Track>
      {Array.from({ length: count }, (_, i) => (
        <SL.Thumb
          key={i}
          aria-label={count > 1 ? (i === 0 ? "Minimum" : "Maximum") : undefined}
          className="border-primary bg-background shadow-soft focus-visible:outline-ring block size-6 rounded-full border-2 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2"
        />
      ))}
    </SL.Root>
  );
}

export function Switch({ className, ...props }: ComponentProps<typeof SW.Root>) {
  return (
    <SW.Root
      className={cn(
        "peer bg-foreground/20 data-[state=checked]:bg-primary inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
        className,
      )}
      {...props}
    >
      <SW.Thumb className="shadow-soft pointer-events-none block size-5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0" />
    </SW.Root>
  );
}
