/**
 * Mirror of server/src/core/types.ts. Kept by hand: the two packages have no
 * shared build, and the wire format is small. If it grows, promote it to a real
 * shared package rather than letting the copies drift.
 */

export type Sentiment = "positive" | "neutral" | "negative";
export type Timeframe = "month" | "year" | "all";
export type Mode = "compare" | "recommend";

export interface Evidence {
  snippet: string;
  score: number;
  subreddit: string;
  permalink: string;
  createdUtc: number;
  sentiment: Sentiment;
}

export interface BrandResult {
  name: string;
  discovered: boolean;
  slot: number;
  mentions: number;
  commentCount: number;
  threadCount: number;
  netScore: number;
  shareOfVoice: number;
  sentiment: Record<Sentiment, number>;
  timeline: { month: string; mentions: number }[];
  evidence: Evidence[];
}

export interface AnalyzeParams {
  topic: string;
  mode: Mode;
  brands: string;
  timeframe: Timeframe;
  threadLimit: number;
  commentLimit: number;
  subreddits: string;
}

export interface AnalyzeResponse {
  topic: string;
  mode: Mode;
  provider: "google" | "reddit";
  threadsScanned: number;
  commentsScanned: number;
  totalMentions: number;
  months: string[];
  brands: BrandResult[];
  suggestions: { name: string; mentions: number }[];
}

/**
 * Fixed slot order — an entity keeps its colour when the ranking reorders. Six
 * entries, matching MODE_PROFILE.compare.tracked on the server; recommend mode
 * returns more but renders as a list, without colour identity.
 */
const SERIES = [
  "var(--series-1)",
  "var(--series-2)",
  "var(--series-3)",
  "var(--series-4)",
  "var(--series-5)",
  "var(--series-6)",
];

export const seriesColor = (slot: number): string => SERIES[slot % SERIES.length]!;

export const SENTIMENT_LABEL: Record<Sentiment, string> = {
  positive: "Positif",
  neutral: "Neutre",
  negative: "Négatif",
};

export const SENTIMENT_COLOR: Record<Sentiment, string> = {
  positive: "var(--positive)",
  neutral: "var(--neutral)",
  negative: "var(--negative)",
};
