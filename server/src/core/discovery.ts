import type { Brand } from "./brands.js";
import { NOT_A_BRAND, PLACES } from "./filters.js";
import { LEFT_EDGE, RIGHT_EDGE, singular, words } from "./text.js";
import type { Comment } from "./types.js";

export interface DiscoveryOptions {
  limit: number;
  topic: string;
  titles: string[];
  maxWords: number;
  minMentions: number;
}

export interface Candidate {
  name: string;
  mentions: number;
}

const candidatePattern = (maxWords: number): RegExp =>
  new RegExp(
    `${LEFT_EDGE}(\\p{Lu}[\\p{L}\\p{N}]+(?:[ -]\\p{Lu}[\\p{L}\\p{N}]+){0,${maxWords - 1}})${RIGHT_EDGE}`,
    "gu"
  );

const isAcronym = (label: string): boolean => /^\p{Lu}{2,4}$/u.test(label);

function subjectWords(titles: string[], topic: string, ratio = 0.4): Set<string> {
  const seed = new Set(words(topic).flatMap((word) => [word, singular(word)]));
  if (titles.length < 3) return seed;

  const counts = new Map<string, number>();
  for (const title of titles) {
    for (const word of new Set(words(title))) {
      counts.set(word, (counts.get(word) ?? 0) + 1);
    }
  }

  const threshold = Math.max(2, Math.ceil(titles.length * ratio));
  for (const [word, count] of counts) {
    if (count >= threshold) seed.add(word);
  }
  return seed;
}

function isSubject(label: string, subject: Set<string>): boolean {
  const tokens = words(label);
  return (
    tokens.length > 0 &&
    tokens.every((token) => subject.has(token) || subject.has(singular(token)))
  );
}

function lowercaseCounts(comments: Comment[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const comment of comments) {
    for (const word of comment.body.split(/[^\p{L}\p{N}]+/u)) {
      if (!word || word !== word.toLowerCase()) continue;
      counts.set(word, (counts.get(word) ?? 0) + 1);
    }
  }
  return counts;
}

function isCommonNoun(label: string, capitalised: number, lowercase: Map<string, number>): boolean {
  if (/[ -]/.test(label)) return false;
  const lower = lowercase.get(label.toLowerCase()) ?? 0;
  return lower / (lower + capitalised) > 0.25;
}

function sharesRoot(a: string, b: string): boolean {
  const [x, y] = [a.toLowerCase(), b.toLowerCase()];
  return x.startsWith(`${y} `) || y.startsWith(`${x} `);
}

interface Tally {
  label: string;
  total: number;
  midSentence: boolean;
}

export function discoverCandidates(
  comments: Comment[],
  brands: Brand[],
  options: DiscoveryOptions
): Candidate[] {
  const { limit, topic, titles, maxWords, minMentions } = options;

  const tracked = new Set(brands.flatMap((b) => b.aliases.map((a) => a.toLowerCase())));
  const subject = subjectWords(titles, topic);
  const lowercase = lowercaseCounts(comments);
  const pattern = candidatePattern(maxWords);

  const tallies = new Map<string, Tally>();
  const rejected = new Set<string>();

  for (const comment of comments) {
    for (const match of comment.body.matchAll(pattern)) {
      const label = match[1]!;
      const key = label.toLowerCase();

      let tally = tallies.get(key);
      if (!tally) {
        if (rejected.has(key)) continue;
        if (
          NOT_A_BRAND.has(key) ||
          PLACES.has(key) ||
          tracked.has(key) ||
          isSubject(label, subject)
        ) {
          rejected.add(key);
          continue;
        }
        tally = { label, total: 0, midSentence: false };
        tallies.set(key, tally);
      }

      tally.total += 1;
      if (!tally.midSentence) {
        const before = comment.body.slice(0, match.index).trimEnd();
        tally.midSentence = before !== "" && !/[.!?:;•\-*]$/.test(before);
      }
    }
  }

  const ranked = [...tallies.values()]
    .filter(
      (tally) =>
        tally.midSentence &&
        tally.total >= minMentions &&
        !isAcronym(tally.label) &&
        !isCommonNoun(tally.label, tally.total, lowercase)
    )
    .sort((a, b) => b.total - a.total);

  const kept: Tally[] = [];
  for (const tally of ranked) {
    if (kept.some((k) => sharesRoot(k.label, tally.label))) continue;
    kept.push(tally);
    if (kept.length === limit) break;
  }

  return kept.map((tally) => ({ name: tally.label, mentions: tally.total }));
}
