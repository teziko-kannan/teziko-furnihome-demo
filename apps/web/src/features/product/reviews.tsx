"use client";

import { NO_JS_FORM } from "@/lib/no-js-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@teziko/ui/components/badge";
import { Button } from "@teziko/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@teziko/ui/components/dialog";
import { Input, Textarea } from "@teziko/ui/components/input";
import { describedBy, Field } from "@teziko/ui/components/label";
import { Rating } from "@teziko/ui/components/rating";
import { toast } from "@teziko/ui/components/toaster";
import type { Review } from "@teziko/types";
import { reviewSchema, type ReviewInput } from "@teziko/validators";
import { BadgeCheckIcon, StarIcon, ThumbsUpIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { cn, formatDate } from "@/lib/format";
import { getDataAdapter, type UserReview } from "../data-access";

type Display = (Review | (UserReview & { mine: true })) & { city?: string };

export function Reviews({ productId, seeded }: { productId: string; seeded: Review[] }) {
  const [mine, setMine] = useState<UserReview[]>([]);
  const [open, setOpen] = useState(false);
  const [helpful, setHelpful] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let alive = true;
    getDataAdapter()
      .listReviews(productId)
      .then((r) => alive && setMine(r))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [productId]);

  const all: Display[] = [...mine.map((r) => ({ ...r, mine: true as const })), ...seeded];
  const avg = all.length ? all.reduce((s, r) => s + r.rating, 0) / all.length : 0;
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, count: all.filter((r) => r.rating === n).length }));

  return (
    <section aria-labelledby="reviews-heading" className="grid gap-10 lg:grid-cols-[300px_1fr]">
      <div>
        <h2 id="reviews-heading" className="text-2xl">
          Ratings & reviews
        </h2>
        <div className="mt-4 flex items-center gap-3">
          <span className="font-display text-5xl">{avg.toFixed(1)}</span>
          <div>
            <Rating value={avg} size="md" />
            <p className="text-muted-foreground mt-1 text-xs">{all.length} reviews</p>
          </div>
        </div>
        <ul className="mt-5 space-y-1.5" aria-label="Rating distribution">
          {dist.map((d) => (
            <li key={d.n} className="flex items-center gap-2 text-xs">
              <span className="w-3 tabular-nums">{d.n}</span>
              <StarIcon className="size-3" fill="currentColor" strokeWidth={0} aria-hidden="true" />
              <span className="bg-border relative h-1.5 flex-1 overflow-hidden rounded-full">
                <span
                  className="bg-foreground absolute inset-y-0 left-0 w-full origin-left"
                  style={{ transform: `scaleX(${all.length ? d.count / all.length : 0})` }}
                />
              </span>
              <span className="text-muted-foreground w-6 text-right tabular-nums">{d.count}</span>
            </li>
          ))}
        </ul>
        <Button variant="outline" className="mt-6 w-full" onClick={() => setOpen(true)}>
          Write a review
        </Button>
        <p className="text-muted-foreground mt-3 text-xs leading-relaxed">
          Reviews marked “Demo” are seeded sample content, not real customers. Reviews you write are
          stored in this browser and deleted after 14 days.
        </p>
      </div>

      <ul className="divide-border divide-y">
        {all.map((r) => (
          <li key={r.id} className="py-6 first:pt-0">
            <div className="flex flex-wrap items-center gap-2">
              <Rating value={r.rating} />
              <h3 className="font-sans text-[15px] font-semibold tracking-normal">{r.title}</h3>
            </div>
            <p className="text-foreground/90 mt-2 text-[15px] leading-relaxed">{r.body}</p>
            <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
              <span className="text-foreground font-medium">{r.author}</span>
              {r.city ? <span>{r.city}</span> : null}
              <span>{formatDate(r.createdAt)}</span>
              {"demo" in r ? (
                <Badge variant="muted">Demo</Badge>
              ) : (
                <Badge variant="info">Your review</Badge>
              )}
              {"verified" in r && r.verified ? (
                <span className="text-success inline-flex items-center gap-1">
                  <BadgeCheckIcon className="size-3.5" aria-hidden="true" /> Verified purchase
                  (demo)
                </span>
              ) : null}
              {"helpful" in r ? (
                <button
                  type="button"
                  aria-pressed={Boolean(helpful[r.id])}
                  onClick={() => setHelpful((h) => ({ ...h, [r.id]: !h[r.id] }))}
                  className={cn(
                    "hover:bg-muted ml-auto inline-flex h-8 items-center gap-1.5 rounded-full px-2.5",
                    helpful[r.id] && "text-foreground",
                  )}
                >
                  <ThumbsUpIcon className="size-3.5" aria-hidden="true" />
                  Helpful ({r.helpful + (helpful[r.id] ? 1 : 0)})
                </button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      <ReviewDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={async (input) => {
          const review: UserReview = {
            id: crypto.randomUUID(),
            productId,
            createdAt: new Date().toISOString(),
            ...input,
            rating: input.rating as UserReview["rating"],
          };
          await getDataAdapter().addReview(review);
          setMine((m) => [review, ...m]);
          setOpen(false);
          toast.success("Thanks for your review", {
            description: "It's visible to you in this browser (demo).",
          });
        }}
      />
    </section>
  );
}

function ReviewDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSubmit: (r: ReviewInput) => Promise<void>;
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, title: "", body: "", author: "" },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) reset();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Write a review</DialogTitle>
          <DialogDescription>
            Share what you think. This is a demo: your review stays in this browser.
          </DialogDescription>
        </DialogHeader>
        <form {...NO_JS_FORM} onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
          <Controller
            control={control}
            name="rating"
            render={({ field }) => (
              <fieldset aria-describedby={errors.rating ? "rating-error" : undefined}>
                <legend className="mb-2 text-sm font-medium">Your rating</legend>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => field.onChange(n)}
                      aria-pressed={field.value === n}
                      aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      className="hover:bg-muted inline-flex size-10 items-center justify-center rounded-full"
                    >
                      <StarIcon
                        className={cn(
                          "size-6",
                          n <= field.value ? "text-foreground" : "text-foreground/20",
                        )}
                        fill="currentColor"
                        strokeWidth={0}
                      />
                    </button>
                  ))}
                </div>
                {errors.rating ? (
                  <p id="rating-error" role="alert" className="text-error mt-1 text-xs font-medium">
                    {errors.rating.message}
                  </p>
                ) : null}
              </fieldset>
            )}
          />
          <Field id="rv-title" label="Title" error={errors.title?.message} required>
            <Input
              id="rv-title"
              {...register("title")}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={describedBy("rv-title", errors.title?.message)}
            />
          </Field>
          <Field id="rv-body" label="Review" error={errors.body?.message} required>
            <Textarea
              id="rv-body"
              {...register("body")}
              aria-invalid={Boolean(errors.body)}
              aria-describedby={describedBy("rv-body", errors.body?.message)}
            />
          </Field>
          <Field id="rv-author" label="Display name" error={errors.author?.message} required>
            <Input
              id="rv-author"
              autoComplete="nickname"
              {...register("author")}
              aria-invalid={Boolean(errors.author)}
              aria-describedby={describedBy("rv-author", errors.author?.message)}
            />
          </Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Posting…" : "Post review"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
