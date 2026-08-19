"use client";

import { Panel } from "@/components/ui/Panel";
import { Swatch } from "@/components/ui/Swatch";
import { SENTIMENT_COLOR, SENTIMENT_LABEL, type BrandResult, type Sentiment } from "../types";
import { METRIC_ROW, METRIC_VALUE } from "./ShareOfVoice";

const ORDER: Sentiment[] = ["negative", "neutral", "positive"];

export function SentimentSplit({ brands }: { brands: BrandResult[] }) {
  const rated = brands.filter((brand) => brand.commentCount > 0);
  if (rated.length === 0) return null;

  return (
    <Panel
      title="Tonalité"
      description="Répartition des commentaires citant chaque nom."
      aside={
        <ul className="flex gap-3">
          {ORDER.map((sentiment) => (
            <li key={sentiment} className="flex items-center gap-1.5 text-xs text-secondary">
              <Swatch color={SENTIMENT_COLOR[sentiment]} />
              {SENTIMENT_LABEL[sentiment]}
            </li>
          ))}
        </ul>
      }
    >
      <ul className="space-y-3.5">
        {rated.map((brand) => {
          const total = brand.commentCount;
          const positiveShare = Math.round((brand.sentiment.positive / total) * 100);

          return (
            <li key={brand.name} className={METRIC_ROW}>
              <span className="truncate text-sm text-ink">{brand.name}</span>

              <div className="flex h-5 gap-[2px] overflow-hidden rounded-sm">
                {ORDER.map((sentiment) => {
                  const count = brand.sentiment[sentiment];
                  if (count === 0) return null;
                  return (
                    <div
                      key={sentiment}
                      style={{
                        width: `${(count / total) * 100}%`,
                        background: SENTIMENT_COLOR[sentiment],
                      }}
                      title={`${SENTIMENT_LABEL[sentiment]} : ${count} commentaire${count > 1 ? "s" : ""}`}
                    />
                  );
                })}
              </div>

              <div className={METRIC_VALUE}>
                <div className="num text-sm font-semibold text-ink">{positiveShare} % positif</div>
                <div className="num text-xs text-muted">{total} commentaires</div>
              </div>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
