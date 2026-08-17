"use client";

import { useState } from "react";
import { Segmented } from "@/components/ui/Segmented";
import { MODE_COPY } from "../copy";
import type { AnalyzeParams, Mode, Timeframe } from "../types";

const TIMEFRAMES: { value: Timeframe; label: string }[] = [
  { value: "month", label: "30 jours" },
  { value: "year", label: "12 mois" },
  { value: "all", label: "Tout" },
];

const INPUT =
  "w-full rounded-lg border border-line bg-page px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted focus:border-accent";

interface Props {
  mode: Mode;
  topic: string;
  brands: string;
  onTopicChange: (value: string) => void;
  onBrandsChange: (value: string) => void;
  onAnalyze: (params: AnalyzeParams) => void;
  loading: boolean;
}

export function SearchPanel({
  mode,
  topic,
  brands,
  onTopicChange,
  onBrandsChange,
  onAnalyze,
  loading,
}: Props) {
  const [timeframe, setTimeframe] = useState<Timeframe>("year");
  const [threadLimit, setThreadLimit] = useState(20);
  const [commentLimit, setCommentLimit] = useState(120);
  const [subreddits, setSubreddits] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const copy = MODE_COPY[mode];
  const pinnable = mode === "compare";

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!topic.trim() || loading) return;
    onAnalyze({ topic: topic.trim(), mode, brands, timeframe, threadLimit, commentLimit, subreddits });
  };

  return (
    <form onSubmit={submit} className="rounded-card border border-line bg-surface p-5 shadow-sm">
      <div className={`grid gap-4 ${pinnable ? "sm:grid-cols-2" : ""}`}>
        <div>
          <label htmlFor="topic" className="label mb-1.5 block">
            {copy.topicLabel}
          </label>
          <input
            id="topic"
            value={topic}
            onChange={(event) => onTopicChange(event.target.value)}
            placeholder={copy.topicPlaceholder}
            className={INPUT}
          />
        </div>
        {pinnable && (
          <div>
            <label htmlFor="brands" className="label mb-1.5 block">
              Marques à épingler <span className="normal-case tracking-normal">(optionnel)</span>
            </label>
            <input
              id="brands"
              value={brands}
              onChange={(event) => onBrandsChange(event.target.value)}
              placeholder="Laissez vide pour détecter automatiquement"
              className={INPUT}
            />
          </div>
        )}
      </div>

      <p className="mt-2 text-xs text-muted">
        {pinnable && brands.trim() ? (
          <>
            Ces marques sont toujours affichées, même à 0 mention. Les slots restants sont complétés
            par détection. Variantes avec <code className="text-secondary">|</code> — ex.{" "}
            <code className="text-secondary">Sony|WH-1000XM5</code>.
          </>
        ) : (
          copy.hint
        )}
      </p>

      {showOptions && (
        <div className="mt-4 grid gap-4 border-t border-line pt-4 sm:grid-cols-2">
          <div>
            <span className="label mb-1.5 block">Période</span>
            <Segmented
              options={TIMEFRAMES.map((t) => ({ value: t.value, label: t.label }))}
              value={timeframe}
              onChange={setTimeframe}
              size="sm"
              label="Période analysée"
            />
          </div>

          <div>
            <label htmlFor="subreddits" className="label mb-1.5 block">
              Subreddits (optionnel)
            </label>
            <input
              id="subreddits"
              value={subreddits}
              onChange={(event) => setSubreddits(event.target.value)}
              placeholder="headphones, audiophile"
              className={INPUT}
            />
          </div>

          <div>
            <label htmlFor="threads" className="label mb-1.5 block">
              Discussions analysées · <span className="num text-secondary">{threadLimit}</span>
            </label>
            <input
              id="threads"
              type="range"
              min={5}
              max={50}
              step={5}
              value={threadLimit}
              onChange={(event) => setThreadLimit(Number(event.target.value))}
              className="w-full accent-[var(--accent)]"
            />
          </div>

          <div>
            <label htmlFor="comments" className="label mb-1.5 block">
              Commentaires par discussion · <span className="num text-secondary">{commentLimit}</span>
            </label>
            <input
              id="comments"
              type="range"
              min={20}
              max={300}
              step={20}
              value={commentLimit}
              onChange={(event) => setCommentLimit(Number(event.target.value))}
              className="w-full accent-[var(--accent)]"
            />
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-4">
        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Analyse en cours…" : copy.submit}
        </button>

        <button
          type="button"
          onClick={() => setShowOptions(!showOptions)}
          className="text-sm text-secondary transition hover:text-ink"
        >
          {showOptions ? "Masquer les options" : "Options"}
        </button>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">Exemples</span>
          {copy.presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                onTopicChange(preset.topic);
                onBrandsChange("");
              }}
              className="pill"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
