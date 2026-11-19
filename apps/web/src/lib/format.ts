export { cn, formatINR } from "@teziko/ui/lib/utils";

export function discountPercent(price: number, mrp: number) {
  return mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
}

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
const dateTimeFmt = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
});

export const formatDate = (iso: string) => dateFmt.format(new Date(iso));
export const formatDateTime = (iso: string) => dateTimeFmt.format(new Date(iso));

/** Expected delivery window label, e.g. "Thu, 20 Nov – Mon, 24 Nov". */
export function deliveryWindow([min, max]: [number, number], from = new Date()) {
  const f = new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short" });
  const a = new Date(from.getTime() + min * 86400000);
  const b = new Date(from.getTime() + max * 86400000);
  return `${f.format(a)} – ${f.format(b)}`;
}
