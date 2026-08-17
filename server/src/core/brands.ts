import { boundedAlternation } from "./text.js";

export interface Brand {
  name: string;
  aliases: string[];
  /** Global — for counting occurrences via matchAll. */
  pattern: RegExp;
  /** Non-global twin — `test()` on a /g/ regex is stateful and alternates results. */
  matcher: RegExp;
  /** False when the caller named it, true when discovery found it. */
  discovered: boolean;
}

const build = (aliases: string[], discovered: boolean): Brand => ({
  name: aliases[0]!,
  aliases,
  pattern: boundedAlternation(aliases),
  matcher: boundedAlternation(aliases, false),
  discovered,
});

/** `Sony|WH-1000XM5, Bose|QuietComfort` -> two brands, aliases after the pipe. */
export function parseBrands(input: string, cap: number): Brand[] {
  return input
    .split(",")
    .map((entry) => entry.split("|").map((alias) => alias.trim()).filter(Boolean))
    .filter((aliases) => aliases.length > 0)
    .slice(0, cap)
    .map((aliases) => build(aliases, false));
}

export function discoveredBrand(name: string): Brand {
  return build([name], true);
}
