import { CARD } from "@/components/ui/Panel";
import { formatNumber } from "@/lib/format";
import type { AnalyzeResponse } from "../types";

export function StatTiles({ result }: { result: AnalyzeResponse }) {
  const leader = result.brands[0];
  const hasLeader = leader !== undefined && leader.mentions > 0;

  const tiles = [
    { label: "Discussions", value: formatNumber(result.threadsScanned) },
    { label: "Commentaires", value: formatNumber(result.commentsScanned) },
    { label: "Mentions", value: formatNumber(result.totalMentions) },
    {
      label: "En tête",
      value: hasLeader ? leader.name : "—",
      hint: hasLeader ? `${(leader.shareOfVoice * 100).toFixed(0)} %` : undefined,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {tiles.map((tile) => (
        <div key={tile.label} className={`${CARD} px-4 py-3`}>
          <div className="label">{tile.label}</div>
          <div className="num mt-1 truncate text-xl font-semibold text-ink">
            {tile.value}
            {tile.hint && <span className="ml-1.5 text-sm font-normal text-muted">{tile.hint}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
