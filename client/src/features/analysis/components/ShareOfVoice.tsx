"use client";

import { Panel } from "@/components/ui/Panel";
import { Swatch } from "@/components/ui/Swatch";
import { formatNumber } from "@/lib/format";
import { seriesColor, type BrandResult } from "../types";

/** Shared so the ranking and the tonality chart line up column-for-column. */
export const METRIC_ROW = "grid grid-cols-[minmax(0,10rem)_1fr_auto] items-center gap-3";
export const METRIC_VALUE = "w-28 text-right";

export function ShareOfVoice({ brands }: { brands: BrandResult[] }) {
  const max = Math.max(...brands.map((brand) => brand.mentions), 1);

  return (
    <Panel
      title="Part de voix"
      description="Nombre de fois où chaque nom est cité dans les commentaires analysés. « auto » = détecté, pas épinglé par vous."
    >
      <ol className="space-y-3.5">
        {brands.map((brand) => (
          <li key={brand.name} className={`group relative ${METRIC_ROW}`}>
            <div className="flex min-w-0 items-center gap-2">
              <Swatch color={seriesColor(brand.slot)} />
              <span className="truncate text-sm text-ink">{brand.name}</span>
              {brand.discovered && (
                <span
                  className="shrink-0 rounded-full bg-sunken px-1.5 py-0.5 text-[10px] text-muted"
                  title="Détecté automatiquement dans les commentaires"
                >
                  auto
                </span>
              )}
            </div>

            <div className="h-6 rounded-sm bg-sunken">
              <div
                className="h-full rounded-r-[4px] transition-[width] duration-500"
                style={{
                  width: `${(brand.mentions / max) * 100}%`,
                  background: seriesColor(brand.slot),
                }}
              />
            </div>

            <div className={METRIC_VALUE}>
              <div className="num text-sm font-semibold text-ink">
                {(brand.shareOfVoice * 100).toFixed(1)} %
              </div>
              <div className="num text-xs text-muted">{formatNumber(brand.mentions)} mentions</div>
            </div>

            {/* Anchored left so it never covers the value column of the rows above. */}
            <div className="tooltip -top-2 left-0 hidden -translate-y-full group-hover:block">
              <div className="mb-1 font-medium text-ink">{brand.name}</div>
              <dl className="num space-y-0.5 text-secondary">
                {[
                  ["Commentaires", brand.commentCount],
                  ["Discussions", brand.threadCount],
                  ["Upvotes cumulés", brand.netScore],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-6">
                    <dt>{label}</dt>
                    <dd className="text-ink">{formatNumber(value as number)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
