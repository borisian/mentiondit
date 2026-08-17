"use client";

import { Segmented } from "@/components/ui/Segmented";
import { CARD } from "@/components/ui/Panel";
import { Evidence } from "@/features/analysis/components/Evidence";
import { Recommendations } from "@/features/analysis/components/Recommendations";
import { SearchPanel } from "@/features/analysis/components/SearchPanel";
import { SentimentSplit } from "@/features/analysis/components/SentimentSplit";
import { ShareOfVoice } from "@/features/analysis/components/ShareOfVoice";
import { StatTiles } from "@/features/analysis/components/StatTiles";
import { Suggestions } from "@/features/analysis/components/Suggestions";
import { Timeline } from "@/features/analysis/components/Timeline";
import { EMPTY_PINNED, MODE_COPY } from "@/features/analysis/copy";
import { downloadCsv } from "@/features/analysis/csv";
import type { AnalyzeResponse, Mode } from "@/features/analysis/types";
import { useAnalysis } from "@/features/analysis/useAnalysis";

const TABS = (Object.keys(MODE_COPY) as Mode[]).map((mode) => ({
  value: mode,
  label: MODE_COPY[mode].tab,
}));

export default function Page() {
  const {
    mode, topic, brands, result, loading, error,
    setTopic, setBrands, switchMode, addBrand, run,
  } = useAnalysis();

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-5 py-12">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Comment Hub</h1>
        <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-secondary">
          {MODE_COPY[mode].blurb}
        </p>
      </header>

      <nav className="mb-5">
        <Segmented options={TABS} value={mode} onChange={switchMode} label="Mode d'analyse" />
      </nav>

      <SearchPanel
        mode={mode}
        topic={topic}
        brands={brands}
        onTopicChange={setTopic}
        onBrandsChange={setBrands}
        onAnalyze={run}
        loading={loading}
      />

      {error && (
        <p className={`${CARD} mt-5 px-4 py-3 text-sm text-negative`}>{error}</p>
      )}

      {loading && (
        <div className="mt-5 space-y-3" aria-live="polite">
          <div className="h-20 animate-pulse rounded-card bg-surface" />
          <div className="h-64 animate-pulse rounded-card bg-surface" />
        </div>
      )}

      {!loading && result && (
        <Results result={result} pinned={brands.trim().length > 0} onAddBrand={addBrand} />
      )}

      {!loading && !result && !error && (
        <section className={`${CARD} mt-8 px-5 py-10 text-center`}>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-secondary">
            {MODE_COPY[mode].intro}
          </p>
        </section>
      )}

      <footer className="mt-12 border-t border-line pt-5 text-xs text-muted">
        Données publiques via l&apos;API Reddit. La tonalité est calculée par lexique — un signal
        indicatif, pas un jugement.
      </footer>
    </main>
  );
}

interface ResultsProps {
  result: AnalyzeResponse;
  pinned: boolean;
  onAddBrand: (name: string) => void;
}

function Results({ result, pinned, onAddBrand }: ResultsProps) {
  const empty = result.totalMentions === 0;
  const emptyMessage =
    pinned && result.mode === "compare" ? EMPTY_PINNED : MODE_COPY[result.mode].empty;

  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex flex-wrap items-center gap-x-2 text-sm text-secondary">
          <span className="text-ink">{result.topic}</span>
          <span>· {result.threadsScanned} discussions analysées</span>
          <span
            className="rounded-full bg-sunken px-2 py-0.5 text-[11px] text-muted"
            title={
              result.provider === "google"
                ? "Discussions trouvées via Google (Serper)"
                : "Recherche Reddit native — ajoutez SERPER_API_KEY pour de meilleurs résultats"
            }
          >
            via {result.provider === "google" ? "Google" : "Reddit"}
          </span>
        </h2>
        <button
          type="button"
          onClick={() => downloadCsv(result)}
          className="rounded-lg border border-line px-3 py-1.5 text-xs text-secondary transition hover:border-accent hover:text-ink"
        >
          Exporter en CSV
        </button>
      </div>

      <StatTiles result={result} />

      {empty ? (
        <p className={`${CARD} px-4 py-6 text-center text-sm text-secondary`}>{emptyMessage}</p>
      ) : result.mode === "recommend" ? (
        <Recommendations items={result.brands} />
      ) : (
        <>
          <ShareOfVoice brands={result.brands} />
          <Timeline brands={result.brands} months={result.months} />
          <SentimentSplit brands={result.brands} />
          <Evidence brands={result.brands} />
          <Suggestions suggestions={result.suggestions} onAdd={onAddBrand} />
        </>
      )}
    </div>
  );
}
