import type { Mode } from "./types.js";

export interface ModeProfile {
  /** How many entities the ranking holds. */
  tracked: number;
  /** Max capitalised words per candidate: 2 for brands, more for venue names. */
  maxWords: number;
  minMentions: number;
  /** Whether the caller may name entities up front. */
  pinnable: boolean;
}

/**
 * The complete description of a mode. Anything that differs between modes belongs
 * here — a behavioural difference expressed as `mode === "compare"` somewhere else
 * makes the next mode a hunt through the codebase instead of an entry in a table.
 */
export const MODE_PROFILE: Record<Mode, ModeProfile> = {
  // Brand names are short and repeated; six matches the validated colour palette.
  compare: { tracked: 6, maxWords: 2, minMentions: 3, pinnable: true },
  // Venues and titles run longer and are each named by fewer people.
  recommend: { tracked: 10, maxWords: 4, minMentions: 2, pinnable: false },
};
