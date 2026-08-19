import { boundedAlternation } from "./text.js";

export interface Brand {
  name: string;
  aliases: string[];
  pattern: RegExp;
  // `/g` makes `test()` stateful.
  matcher: RegExp;
  discovered: boolean;
}

const build = (aliases: string[], discovered: boolean): Brand => ({
  name: aliases[0]!,
  aliases,
  pattern: boundedAlternation(aliases),
  matcher: boundedAlternation(aliases, false),
  discovered,
});

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
