import { Swatch } from "@/components/ui/Swatch";
import { formatDate, formatNumber } from "@/lib/format";
import { SENTIMENT_COLOR, SENTIMENT_LABEL, type Evidence } from "../types";

interface Props {
  item: Evidence;
  showSentiment?: boolean;
}

export function EvidenceMeta({ item, showSentiment = true }: Props) {
  return (
    <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
      {showSentiment && (
        <span className="flex items-center gap-1.5">
          <Swatch color={SENTIMENT_COLOR[item.sentiment]} shape="dot" />
          {SENTIMENT_LABEL[item.sentiment]}
        </span>
      )}
      <span className="num">{formatNumber(item.score)} upvotes</span>
      <span>r/{item.subreddit}</span>
      <span>{formatDate(item.createdUtc)}</span>
      <a
        href={item.permalink}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-auto text-accent transition hover:underline"
      >
        Voir sur Reddit →
      </a>
    </div>
  );
}
