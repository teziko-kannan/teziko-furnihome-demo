"use client";

import { NO_JS_FORM } from "@/lib/no-js-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getKindImage } from "@teziko/data/images";
import type { Banner, Coupon, Review } from "@teziko/types";
import { Badge } from "@teziko/ui/components/badge";
import { Button } from "@teziko/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@teziko/ui/components/dialog";
import { Switch } from "@teziko/ui/components/form-controls";
import { Input, NativeSelect } from "@teziko/ui/components/input";
import { describedBy, Field } from "@teziko/ui/components/label";
import { Rating } from "@teziko/ui/components/rating";
import { toast } from "@teziko/ui/components/toaster";
import { useHydrated } from "@teziko/ui/hooks/use-hydrated";
import { couponFormSchema, type CouponFormInput } from "@teziko/validators";
import { EyeIcon, EyeOffIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { cn, formatDate, formatINR } from "@/lib/format";
import { useOverrides } from "../overrides/store";
import { DataTable, type AdminColumnDef } from "../table/data-table";

function describeCoupon(c: Coupon) {
  if (c.kind === "free-shipping") return "Free delivery";
  if (c.kind === "flat") return `${formatINR(c.value)} off`;
  return `${c.value}% off${c.maxDiscount ? ` (max ${formatINR(c.maxDiscount)})` : ""}`;
}

export function CouponsManager({ coupons }: { coupons: Coupon[] }) {
  const hydrated = useHydrated();
  const state = useOverrides((s) => s.coupons);
  const created = useOverrides((s) => s.newCoupons);
  const setActive = useOverrides((s) => s.setCouponActive);
  const [open, setOpen] = useState(false);
  const all = hydrated ? [...created, ...coupons] : coupons;

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setOpen(true)}>
          <PlusIcon aria-hidden="true" /> New coupon
        </Button>
      </div>
      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {all.map((c) => {
          const active = hydrated && state[c.code] ? state[c.code]!.active : c.active;
          const isNew = "at" in c;
          return (
            <li
              key={c.code}
              className={cn(
                "rounded-2xl border border-dashed p-5 transition-opacity",
                active
                  ? "border-foreground/40 bg-background"
                  : "border-border bg-muted/50 opacity-70",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-lg font-semibold tracking-wide">{c.code}</p>
                  <p className="text-sm">{describeCoupon(c)}</p>
                </div>
                <Switch
                  checked={active}
                  aria-label={`${active ? "Deactivate" : "Activate"} ${c.code}`}
                  onCheckedChange={(v) => {
                    setActive(c.code, v);
                    toast(`${c.code} ${v ? "activated" : "deactivated"}`, {
                      description: "Demo admin setting (this browser only).",
                    });
                  }}
                />
              </div>
              <p className="text-muted-foreground mt-3 text-xs">{c.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <Badge variant="muted">Min {formatINR(c.minSubtotal)}</Badge>
                {c.department ? <Badge variant="muted">{c.department}</Badge> : null}
                <Badge variant="muted">Ends {formatDate(c.expiresAt)}</Badge>
                {isNew ? <Badge variant="info">Created here</Badge> : null}
              </div>
            </li>
          );
        })}
      </ul>
      <NewCouponDialog open={open} onOpenChange={setOpen} existing={all.map((c) => c.code)} />
    </>
  );
}

function NewCouponDialog({
  open,
  onOpenChange,
  existing,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  existing: string[];
}) {
  const add = useOverrides((s) => s.addCoupon);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CouponFormInput>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: { code: "", kind: "percent", value: 10, minSubtotal: 1999, description: "" },
  });

  function onSubmit(v: CouponFormInput) {
    if (existing.includes(v.code)) {
      setError("code", { message: "A coupon with this code already exists" });
      return;
    }
    if (v.kind === "percent" && v.value > 90) {
      setError("value", { message: "Percent discounts must be 90 or less" });
      return;
    }
    const expires = new Date(new Date().getTime() + 30 * 86400000).toISOString().slice(0, 10);
    add({ ...v, active: true, expiresAt: expires });
    toast.success(`Coupon ${v.code} created`, {
      description: "Stored in this browser only; the storefront does not accept it.",
    });
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New coupon</DialogTitle>
          <DialogDescription>Demo only: saved in this browser for 14 days.</DialogDescription>
        </DialogHeader>
        <form
          {...NO_JS_FORM}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="grid gap-4 sm:grid-cols-2"
        >
          <Field id="cp-code" label="Code" error={errors.code?.message} required>
            <Input
              id="cp-code"
              className="uppercase"
              {...register("code")}
              aria-invalid={Boolean(errors.code)}
              aria-describedby={describedBy("cp-code", errors.code?.message)}
            />
          </Field>
          <Field id="cp-kind" label="Type" required>
            <NativeSelect id="cp-kind" {...register("kind")}>
              <option value="percent">Percent off</option>
              <option value="flat">Flat amount off</option>
              <option value="free-shipping">Free shipping</option>
            </NativeSelect>
          </Field>
          <Field id="cp-value" label="Value" error={errors.value?.message} required>
            <Input
              id="cp-value"
              type="number"
              {...register("value", { valueAsNumber: true })}
              aria-invalid={Boolean(errors.value)}
              aria-describedby={describedBy("cp-value", errors.value?.message)}
            />
          </Field>
          <Field id="cp-min" label="Minimum order (₹)" error={errors.minSubtotal?.message} required>
            <Input
              id="cp-min"
              type="number"
              {...register("minSubtotal", { valueAsNumber: true })}
              aria-invalid={Boolean(errors.minSubtotal)}
              aria-describedby={describedBy("cp-min", errors.minSubtotal?.message)}
            />
          </Field>
          <Field
            id="cp-desc"
            label="Description"
            error={errors.description?.message}
            required
            className="sm:col-span-2"
          >
            <Input
              id="cp-desc"
              {...register("description")}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={describedBy("cp-desc", errors.description?.message)}
            />
          </Field>
          <Button type="submit" className="sm:col-span-2">
            Create coupon
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function BannersManager({ banners }: { banners: Banner[] }) {
  const hydrated = useHydrated();
  const state = useOverrides((s) => s.banners);
  const setActive = useOverrides((s) => s.setBannerActive);
  return (
    <ul className="grid gap-4 lg:grid-cols-2">
      {banners.map((b) => {
        const active = hydrated && state[b.id] ? state[b.id]!.active : b.active;
        return (
          <li key={b.id} className="border-border bg-background overflow-hidden rounded-2xl border">
            <div
              className="relative flex min-h-40 items-center gap-4 p-5 text-white"
              style={{ backgroundColor: b.tint }}
            >
              <div className="relative z-10 max-w-[60%]">
                <p className="text-[11px] font-semibold tracking-wider uppercase opacity-85">
                  {b.eyebrow}
                </p>
                <p className="font-display mt-1 text-2xl">{b.title}</p>
              </div>
              <Image
                src={getKindImage(b.kind, b.tint).src}
                alt=""
                width={160}
                height={160}
                className="absolute right-0 bottom-0 h-full w-auto mix-blend-luminosity"
              />
            </div>
            <div className="flex items-center justify-between gap-3 p-4 text-sm">
              <div>
                <Badge variant="muted" className="mr-2">
                  {b.placement}
                </Badge>
                <span className="text-muted-foreground">→ {b.cta.href}</span>
              </div>
              <label className="flex items-center gap-2">
                <Switch
                  checked={active}
                  onCheckedChange={(v) => {
                    setActive(b.id, v);
                    toast(`Banner ${v ? "scheduled" : "paused"}`, {
                      description: `${b.title} (demo setting)`,
                    });
                  }}
                  aria-label={`Banner ${b.title} active`}
                />
                {active ? "Live" : "Paused"}
              </label>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export interface ReviewRow extends Review {
  productName: string;
}

export function ReviewsModeration({ reviews }: { reviews: ReviewRow[] }) {
  const hydrated = useHydrated();
  const state = useOverrides((s) => s.reviews);
  const setHidden = useOverrides((s) => s.setReviewHidden);
  const [filter, setFilter] = useState<"all" | "low" | "hidden">("all");
  const hiddenMap = useMemo(() => (hydrated ? state : {}), [hydrated, state]);
  const data = reviews.filter((r) =>
    filter === "low"
      ? r.rating <= 3
      : filter === "hidden"
        ? Boolean(hiddenMap[r.id]?.hidden)
        : true,
  );

  const columns = useMemo<AdminColumnDef<ReviewRow>[]>(() => {
    const isHidden = (id: string) => Boolean(hiddenMap[id]?.hidden);
    return [
      {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => <Rating value={row.original.rating} />,
      },
      {
        accessorKey: "title",
        header: "Review",
        cell: ({ row }) => (
          <div className="max-w-md">
            <p className="font-medium">{row.original.title}</p>
            <p className="text-muted-foreground line-clamp-2 text-xs">{row.original.body}</p>
          </div>
        ),
      },
      { accessorKey: "productName", header: "Product" },
      {
        accessorKey: "author",
        header: "Author",
        cell: ({ row }) => (
          <span>
            {row.original.author}{" "}
            <Badge variant="muted" className="ml-1">
              Demo
            </Badge>
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ getValue }) => formatDate(getValue() as string),
      },
      {
        id: "moderate",
        header: "Visibility",
        enableSorting: false,
        cell: ({ row }) => {
          const hidden = isHidden(row.original.id);
          return (
            <Button
              size="sm"
              variant={hidden ? "default" : "outline"}
              onClick={() => {
                setHidden(row.original.id, !hidden);
                toast(hidden ? "Review restored" : "Review hidden", {
                  description: "Moderation flag saved in this browser (demo).",
                });
              }}
            >
              {hidden ? <EyeIcon aria-hidden="true" /> : <EyeOffIcon aria-hidden="true" />}
              {hidden ? "Restore" : "Hide"}
            </Button>
          );
        },
      },
    ];
  }, [hiddenMap, setHidden]);

  return (
    <DataTable
      caption="Reviews"
      data={data}
      columns={columns}
      getRowId={(r) => r.id}
      searchPlaceholder="Search reviews…"
      toolbar={
        <NativeSelect
          aria-label="Filter reviews"
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="h-10 w-44 text-sm"
        >
          <option value="all">All reviews</option>
          <option value="low">3 stars and below</option>
          <option value="hidden">Hidden</option>
        </NativeSelect>
      }
    />
  );
}
