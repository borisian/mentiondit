export type Sentiment = "positive" | "neutral" | "negative";

export type Timeframe = "month" | "year" | "all";

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
