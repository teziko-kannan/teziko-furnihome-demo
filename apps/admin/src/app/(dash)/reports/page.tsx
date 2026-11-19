import { categoryBySlug, monthlySales, products } from "@teziko/data";
import { Card, CardContent, CardHeader, CardTitle } from "@teziko/ui/components/card";
import { Reveal } from "@teziko/ui/motion/reveal";
import type { Metadata } from "next";
import { BarSeries } from "@/features/dashboard/charts";
import { PageHeader } from "@/features/shell/page-header";
import { formatINR } from "@/lib/format";

export const metadata: Metadata = { title: "Reports" };

export default function Page() {
  const units = new Map<string, number>();
  for (const p of products) units.set(p.subcategory, (units.get(p.subcategory) ?? 0) + p.sold);
  const byCategory = [...units.entries()]
    .map(([slug, value]) => ({ label: categoryBySlug.get(slug)?.name ?? slug, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
  const aov = monthlySales.map((m) => ({
    label: m.month,
    value: Math.round(m.revenue / m.orders),
  }));
  const best = monthlySales.reduce((a, b) => (b.revenue > a.revenue ? b : a));

  return (
    <>
      <PageHeader
        title="Reports"
        description="Seeded demo analytics. Revenue and order counts are shown as separate charts rather than on a shared axis."
      />
      <div className="grid gap-6 xl:grid-cols-2 [&>*]:min-w-0">
        <Reveal>
          <Card>
            <CardHeader>
              <CardTitle>Orders per month</CardTitle>
            </CardHeader>
            <CardContent>
              <BarSeries
                title="Orders per month"
                money={false}
                data={monthlySales.map((m) => ({ label: m.month, value: m.orders }))}
              />
            </CardContent>
          </Card>
        </Reveal>
        <Reveal delay={0.06}>
          <Card>
            <CardHeader>
              <CardTitle>Average order value</CardTitle>
              <p className="text-muted-foreground text-xs">
                Best month: {best.month} at {formatINR(best.revenue)}
              </p>
            </CardHeader>
            <CardContent>
              <BarSeries title="Average order value" data={aov} />
            </CardContent>
          </Card>
        </Reveal>
        <Reveal className="xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Units sold by category (90 days)</CardTitle>
            </CardHeader>
            <CardContent>
              <BarSeries
                title="Units sold by category"
                money={false}
                horizontal
                height={360}
                data={byCategory}
              />
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </>
  );
}
