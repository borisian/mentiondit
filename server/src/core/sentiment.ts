import { words } from "./text.js";
import type { Sentiment } from "./types.js";

const POSITIVE = new Set([
  "amazing", "awesome", "beautiful", "best", "brilliant", "comfortable", "convenient",
  "durable", "excellent", "fantastic", "favorite", "flawless", "gem", "great", "happy",
  "impressed", "impressive", "incredible", "love", "loved", "loves", "nice", "perfect",
  "phenomenal", "pleased", "polished", "premium", "quality", "rave", "recommend",
  "recommended", "reliable", "responsive", "robust", "sharp", "sleek", "smooth",
  "solid", "stellar", "sturdy", "superb", "supportive", "terrific", "underrated",
  "upgrade", "worth", "worthwhile", "wonderful", "fast", "affordable", "cheap",
  "intuitive", "seamless", "consistent", "crisp", "clean", "outstanding",
]);

const NEGATIVE = new Set([
  "annoying", "awful", "bad", "broke", "broken", "buggy", "bugs", "cheaply", "clunky",
  "confusing", "crap", "crappy", "defective", "disappointed", "disappointing", "dies",
  "died", "dogshit", "downgrade", "expensive", "fail", "failed", "failure", "flaky",
  "flimsy", "frustrating", "garbage", "hate", "hated", "horrible", "junk", "lacking",
  "laggy", "mediocre", "meh", "mess", "misleading", "nightmare", "overhyped",
  "overpriced", "painful", "pointless", "poor", "regret", "ridiculous", "rubbish",
  "scam", "shit", "shitty", "slow", "sucks", "sucked", "terrible", "trash",
  "unreliable", "unusable", "useless", "waste", "worse", "worst", "bloated", "gimmick",
]);

const NEGATORS = new Set([
  "not", "no", "never", "none", "cannot", "cant", "wasnt", "isnt", "arent", "dont",
  "doesnt", "didnt", "wouldnt", "couldnt", "shouldnt", "wont", "hardly", "barely",
  "without", "avoid", "stopped",
]);

const NEGATION_WINDOW = 3;

export function scoreSentence(sentence: string): number {
  const tokens = words(sentence.replace(/['’]/g, ""));
  let score = 0;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]!;
    const polarity = POSITIVE.has(token) ? 1 : NEGATIVE.has(token) ? -1 : 0;
    if (polarity === 0) continue;

    const negated = tokens
      .slice(Math.max(0, i - NEGATION_WINDOW), i)
      .some((previous) => NEGATORS.has(previous));
    score += negated ? -polarity : polarity;
  }

  return score;
}

export function toSentiment(score: number): Sentiment {
  if (score > 0) return "positive";
  if (score < 0) return "negative";
  return "neutral";
}
