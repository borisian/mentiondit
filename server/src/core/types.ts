export type Sentiment = "positive" | "neutral" | "negative";

export type Timeframe = "month" | "year" | "all";

/**
 * "compare" ranks a known set of brands in a category.
 * "recommend" discovers what Reddit names in answer to a question — places,
 * venues, titles — where the entities are longer and the long tail matters.
 */
export type Mode = "compare" | "recommend";

export interface Thread {
  id: string;
  title: string;
  subreddit: string;
  permalink: string;
}

export interface Comment {
  threadId: string;
  subreddit: string;
  body: string;
  score: number;
  permalink: string;
  createdUtc: number;
}

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
  /** True when discovery surfaced it rather than the caller naming it. */
  discovered: boolean;
  /** Categorical palette slot, stable across filters so an entity keeps its colour. */
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
  /** Which engine found the threads — Reddit search is the no-key fallback. */
  provider: "google" | "reddit";
  threadsScanned: number;
  commentsScanned: number;
  totalMentions: number;
  months: string[];
  brands: BrandResult[];
  suggestions: { name: string; mentions: number }[];
}
