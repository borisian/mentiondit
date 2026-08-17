"use client";

import { useState } from "react";
import { Panel } from "@/components/ui/Panel";
import { Swatch } from "@/components/ui/Swatch";
import { seriesColor, type BrandResult } from "../types";
import { EvidenceMeta } from "./EvidenceMeta";

export function Evidence({ brands }: { brands: BrandResult[] }) {
  const withEvidence = brands.filter((brand) => brand.evidence.length > 0);
  const [active, setActive] = useState(0);

  if (withEvidence.length === 0) return null;
  const brand = withEvidence[Math.min(active, withEvidence.length - 1)]!;

  return (
    <Panel
      title="Preuves"
      description="Les commentaires les plus upvotés citant le nom. Chaque extrait renvoie à sa source."
    >
      <div className="mb-4 flex flex-wrap gap-1.5">
        {withEvidence.map((candidate, index) => (
          <button
            key={candidate.name}
            type="button"
            onClick={() => setActive(index)}
            className={`pill ${candidate.name === brand.name ? "border-transparent bg-sunken text-ink" : ""}`}
          >
            <Swatch color={seriesColor(candidate.slot)} />
            {candidate.name}
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {brand.evidence.map((item, index) => (
          <li key={`${item.permalink}-${index}`} className="rounded-lg border border-line bg-page p-3.5">
            <p className="text-sm leading-relaxed text-secondary">{item.snippet}</p>
            <EvidenceMeta item={item} />
          </li>
        ))}
      </ul>
    </Panel>
  );
}
