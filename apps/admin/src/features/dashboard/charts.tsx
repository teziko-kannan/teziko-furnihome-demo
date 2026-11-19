"use client";

import { usePrefersReducedMotion } from "@teziko/ui/hooks/use-reduced-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompactINR, formatINR } from "@/lib/format";

const INK = "#222223";
const EMPHASIS = "#ff4848";
const GRID = "#ececec";
const AXIS = "#6b6b6b";

interface Datum {
  label: string;
  value: number;
}

function ChartTooltip({
  active,
  payload,
  label,
  money,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  money: boolean;
}) {
  if (!active || !payload?.[0]) return null;
  return (
    <div className="border-border bg-background shadow-lift rounded-lg border px-3 py-2 text-xs">
      <p className="text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums">
        {money ? formatINR(payload[0].value) : payload[0].value.toLocaleString("en-IN")}
      </p>
    </div>
  );
}

/**
 * Single-series bar chart: one ink colour, the latest bar emphasised in coral, 4px rounded data ends,
 * recessive grid, hover tooltip. A table equivalent is rendered alongside for screen readers.
 */
export function BarSeries({
  data,
  money = true,
  height = 280,
  title,
  horizontal,
}: {
  data: Datum[];
  money?: boolean;
  height?: number;
  title: string;
  horizontal?: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const fmt = (v: number) => (money ? formatCompactINR(v) : v.toLocaleString("en-IN"));
  return (
    <figure>
      <div style={{ height }} aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout={horizontal ? "vertical" : "horizontal"}
            margin={{ top: 8, right: 8, bottom: 0, left: horizontal ? 8 : 0 }}
            barCategoryGap={horizontal ? 6 : "22%"}
          >
            <CartesianGrid stroke={GRID} vertical={horizontal} horizontal={!horizontal} />
            {horizontal ? (
              <>
                <XAxis
                  type="number"
                  tickFormatter={fmt}
                  tick={{ fill: AXIS, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={130}
                  tick={{ fill: AXIS, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
              </>
            ) : (
              <>
                <XAxis
                  dataKey="label"
                  tick={{ fill: AXIS, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={fmt}
                  width={56}
                  tick={{ fill: AXIS, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
              </>
            )}
            <Tooltip
              cursor={{ fill: "rgb(0 0 0 / 0.04)" }}
              content={<ChartTooltip money={money} />}
            />
            <Bar
              dataKey="value"
              radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
              isAnimationActive={!reduced}
              animationDuration={700}
            >
              {data.map((d, i) => (
                <Cell key={d.label} fill={!horizontal && i === data.length - 1 ? EMPHASIS : INK} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <details className="text-muted-foreground mt-2 text-xs">
        <summary className="hover:text-foreground cursor-pointer select-none">
          View data table
        </summary>
        <table className="mt-2 w-full">
          <caption className="sr-only">{title}</caption>
          <tbody>
            {data.map((d) => (
              <tr key={d.label} className="border-border border-b last:border-0">
                <th scope="row" className="py-1 text-left font-normal">
                  {d.label}
                </th>
                <td className="py-1 text-right tabular-nums">
                  {money ? formatINR(d.value) : d.value.toLocaleString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
