import type { Brand } from "./brands.js";
import { scoreSentence, toSentiment } from "./sentiment.js";
import { splitSentences } from "./text.js";
import type { BrandResult, Comment, Evidence, Sentiment } from "./types.js";

const EVIDENCE_PER_BRAND = 5;
const SNIPPET_LENGTH = 260;

interface Accumulator {
  mentions: number;
  commentCount: number;
  threads: Set<string>;
  netScore: number;
  sentiment: Record<Sentiment, number>;
  months: Map<string, number>;
  evidence: Evidence[];
}

const emptyAccumulator = (): Accumulator => ({
  mentions: 0,
  commentCount: 0,
  threads: new Set(),
  netScore: 0,
  sentiment: { positive: 0, neutral: 0, negative: 0 },
  months: new Map(),
  evidence: [],
});

const monthKey = (createdUtc: number): string =>
  new Date(createdUtc * 1000).toISOString().slice(0, 7);

function truncate(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= SNIPPET_LENGTH ? clean : `${clean.slice(0, SNIPPET_LENGTH)}…`;
}

export function analyseBrands(comments: Comment[], brands: Brand[]): BrandResult[] {
  const accumulators = brands.map(emptyAccumulator);

  for (const comment of comments) {
    let sentences: string[] | null = null;

    brands.forEach((brand, index) => {
      const hits = [...comment.body.matchAll(brand.pattern)].length;
      if (hits === 0) return;

      sentences ??= splitSentences(comment.body);
      const accumulator = accumulators[index]!;

      accumulator.mentions += hits;
      accumulator.commentCount += 1;
      accumulator.threads.add(comment.threadId);
      accumulator.netScore += comment.score;

      const month = monthKey(comment.createdUtc);
      accumulator.months.set(month, (accumulator.months.get(month) ?? 0) + hits);

      const matching = sentences.filter((sentence) => brand.matcher.test(sentence));
      const opinion = matching.reduce((sum, sentence) => sum + scoreSentence(sentence), 0);
      const sentiment = toSentiment(opinion);
      accumulator.sentiment[sentiment] += 1;

      accumulator.evidence.push({
        snippet: truncate(matching[0] ?? comment.body),
        score: comment.score,
        subreddit: comment.subreddit,
        permalink: comment.permalink,
        createdUtc: comment.createdUtc,
        sentiment,
      });
    });
  }

  const totalMentions = accumulators.reduce((sum, acc) => sum + acc.mentions, 0);

  return brands
    .map((brand, index) => {
      const accumulator = accumulators[index]!;
      return {
        name: brand.name,
        discovered: brand.discovered,
        slot: index,
        mentions: accumulator.mentions,
        commentCount: accumulator.commentCount,
        threadCount: accumulator.threads.size,
        netScore: accumulator.netScore,
        shareOfVoice: totalMentions === 0 ? 0 : accumulator.mentions / totalMentions,
        sentiment: accumulator.sentiment,
        timeline: [...accumulator.months.entries()]
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([month, mentions]) => ({ month, mentions })),
        evidence: accumulator.evidence
          .sort((a, b) => b.score - a.score)
          .slice(0, EVIDENCE_PER_BRAND),
      };
    })
    .sort((a, b) => b.mentions - a.mentions);
}
