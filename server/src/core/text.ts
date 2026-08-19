const WORD = /[\p{L}\p{N}]+/gu;

export function words(text: string): string[] {
  return text.toLowerCase().match(WORD) ?? [];
}

// `\b` breaks on names like `WH-1000XM5` and `C++`.
export const LEFT_EDGE = "(?<![\\p{L}\\p{N}])";
export const RIGHT_EDGE = "(?![\\p{L}\\p{N}])";

export function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function boundedAlternation(terms: string[], global = true): RegExp {
  const parts = terms.map((term) => `${LEFT_EDGE}${escapeRegex(term)}${RIGHT_EDGE}`).join("|");
  return new RegExp(parts, global ? "giu" : "iu");
}

export function splitSentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+|\n+/).filter((sentence) => sentence.trim().length > 0);
}

export const singular = (word: string): string => word.replace(/s$/, "");
