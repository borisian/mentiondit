import { Panel } from "@/components/ui/Panel";
import { Swatch } from "@/components/ui/Swatch";
import { formatNumber } from "@/lib/format";
import { SENTIMENT_COLOR, SENTIMENT_LABEL, type BrandResult, type Sentiment } from "../types";
import { EvidenceMeta } from "./EvidenceMeta";

export function Recommendations({ items }: { items: BrandResult[] }) {
  return (
    <Panel
      title="Ce que Reddit recommande"
      description="Classé par nombre de citations. Chaque extrait renvoie au commentaire d'origine."
    >
      <ol className="space-y-3">
        {items.map((item, index) => {
          const quote = item.evidence[0];
          const dominant: Sentiment =
            item.sentiment.positive >= item.sentiment.negative ? "positive" : "negative";

          return (
            <li key={item.name} className="rounded-lg border border-line bg-page p-4">
              <div className="flex items-baseline gap-3">
                <span className="num text-sm text-muted">{index + 1}</span>
                <h3 className="flex-1 text-base font-semibold text-ink">{item.name}</h3>
                <Swatch color={SENTIMENT_COLOR[dominant]} shape="dot" />
                <span className="text-xs text-muted">{SENTIMENT_LABEL[dominant]}</span>
              </div>

              <div className="num mt-1.5 flex flex-wrap gap-x-3 gap-y-1 pl-7 text-xs text-muted">
                <span>{formatNumber(item.mentions)} citations</span>
                <span>{item.threadCount} discussions</span>
                <span>{formatNumber(item.netScore)} upvotes cumulés</span>
              </div>

              {quote && (
                <figure className="ml-7 mt-3 border-l-2 border-line pl-3.5">
                  <blockquote className="text-sm leading-relaxed text-secondary">
                    {quote.snippet}
                  </blockquote>
                  <EvidenceMeta item={quote} showSentiment={false} />
                </figure>
              )}
            </li>
          );
        })}
      </ol>
    </Panel>
  );
}
