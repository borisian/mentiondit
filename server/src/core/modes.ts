import type { Mode } from "./types.js";

export interface ModeProfile {
  tracked: number;
  maxWords: number;
  minMentions: number;
  pinnable: boolean;
}

export const MODE_PROFILE: Record<Mode, ModeProfile> = {
  compare: { tracked: 6, maxWords: 2, minMentions: 3, pinnable: true },
  recommend: { tracked: 10, maxWords: 4, minMentions: 2, pinnable: false },
};
