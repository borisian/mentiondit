"use client";

import { useMemo, useRef, useState } from "react";
import { Panel } from "@/components/ui/Panel";
import { Swatch } from "@/components/ui/Swatch";
import { formatMonth } from "@/lib/format";
import { seriesColor, type BrandResult } from "../types";

const W = 800;
const H = 240;
const PAD = { top: 14, right: 10, bottom: 26, left: 38 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;

interface Props {
  brands: BrandResult[];
  months: string[];
}

export function Timeline({ brands, months }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const chart = useMemo(() => {
    const series = brands.map((brand) => {
      const byMonth = new Map(brand.timeline.map((point) => [point.month, point.mentions]));
      return { brand, values: months.map((month) => byMonth.get(month) ?? 0) };
    });
    const maxY = Math.max(...series.flatMap((s) => s.values), 1);
    return {
      series,
      maxY,
      labels: months.map(formatMonth),
      labelStep: Math.ceil(months.length / 6),
    };
  }, [brands, months]);

  if (months.length < 2) return null;

  const { series, maxY, labels, labelStep } = chart;
  const x = (index: number) => PAD.left + (index / (months.length - 1)) * PLOT_W;
  const y = (value: number) => PAD.top + PLOT_H - (value / maxY) * PLOT_H;

  const onMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const localX = ((event.clientX - rect.left) * W) / rect.width;
    const index = Math.round(((localX - PAD.left) / PLOT_W) * (months.length - 1));
    setHovered(Math.min(Math.max(index, 0), months.length - 1));
  };

  return (
    <Panel title="Évolution des mentions" description="Mentions par mois, sur la période analysée.">
      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          onMouseMove={onMove}
          onMouseLeave={() => setHovered(null)}
          role="img"
          aria-label="Évolution mensuelle des mentions par entité"
        >
          {[0, maxY / 2, maxY].map((tick) => (
            <g key={tick}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={y(tick)}
                y2={y(tick)}
                stroke="var(--grid)"
                strokeWidth={1}
              />
              <text
                x={PAD.left - 8}
                y={y(tick) + 4}
                textAnchor="end"
                className="num"
                fill="var(--ink-muted)"
                fontSize={11}
              >
                {Math.round(tick)}
              </text>
            </g>
          ))}

          {labels.map((label, index) =>
            index % labelStep === 0 ? (
              <text
                key={months[index]}
                x={x(index)}
                y={H - 6}
                textAnchor="middle"
                fill="var(--ink-muted)"
                fontSize={11}
              >
                {label}
              </text>
            ) : null
          )}

          {hovered !== null && (
            <line
              x1={x(hovered)}
              x2={x(hovered)}
              y1={PAD.top}
              y2={PAD.top + PLOT_H}
              stroke="var(--ink-muted)"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          )}

          {series.map(({ brand, values }) => (
            <polyline
              key={brand.name}
              points={values.map((value, index) => `${x(index)},${y(value)}`).join(" ")}
              fill="none"
              stroke={seriesColor(brand.slot)}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {hovered !== null &&
            series.map(({ brand, values }) => (
              <circle
                key={brand.name}
                cx={x(hovered)}
                cy={y(values[hovered] ?? 0)}
                r={4.5}
                fill={seriesColor(brand.slot)}
                stroke="var(--surface)"
                strokeWidth={2}
              />
            ))}
        </svg>

        {hovered !== null && (
          <div
            className="tooltip top-2 w-max"
            style={{
              left: `${(x(hovered) / W) * 100}%`,
              transform: hovered > months.length / 2 ? "translateX(-105%)" : "translateX(5%)",
            }}
          >
            <div className="mb-1 font-medium text-ink">{labels[hovered]}</div>
            {series.map(({ brand, values }) => (
              <div key={brand.name} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-secondary">
                  <Swatch color={seriesColor(brand.slot)} />
                  {brand.name}
                </span>
                <span className="num text-ink">{values[hovered]}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-line pt-3">
        {brands.map((brand) => (
          <li key={brand.name} className="flex items-center gap-1.5 text-xs text-secondary">
            <Swatch color={seriesColor(brand.slot)} />
            {brand.name}
          </li>
        ))}
      </ul>
    </Panel>
  );
}
