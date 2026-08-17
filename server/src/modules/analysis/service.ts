import { config } from "../../config.js";
import type { RequestContext } from "../../context.js";
import { discoveredBrand, parseBrands } from "../../core/brands.js";
import { discoverCandidates } from "../../core/discovery.js";
import { analyseBrands } from "../../core/mentions.js";
import { MODE_PROFILE } from "../../core/modes.js";
import type { AnalyzeParams, AnalyzeResponse, Comment } from "../../core/types.js";
import { fetchComments, mapLimit } from "../../providers/reddit.js";
import { findThreads } from "../../providers/search.js";

/** Extra candidates kept beyond the ranking, offered as "also mentioned". */
const SPARE_CANDIDATES = 8;

export class NoThreadsFound extends Error {
  constructor() {
    super("Aucune discussion Reddit trouvée pour ce sujet.");
  }
}

const parseSubreddits = (input: string): string[] =>
  input
    .split(/[,\s]+/)
    .map((sub) => sub.replace(/^\/?r\//, "").trim())
    .filter(Boolean);

/**
 * The whole pipeline, independent of transport. Quota checks belong immediately
 * before it (the Serper and Reddit fan-out is the expensive part) and usage
 * metering immediately after.
 */
export async function runAnalysis(
  params: AnalyzeParams,
  context: RequestContext,
  log: { warn: (msg: string) => void }
): Promise<AnalyzeResponse> {
  const { topic, mode, brands: brandsInput, timeframe, subreddits } = params;
  const profile = MODE_PROFILE[mode];

  const threadLimit = Math.min(params.threadLimit, context.limits.maxThreads);
  const commentLimit = Math.min(params.commentLimit, context.limits.maxComments);

  const { threads, provider } = await findThreads(
    topic,
    timeframe,
    threadLimit,
    parseSubreddits(subreddits),
    log
  );
  if (threads.length === 0) throw new NoThreadsFound();

  const batches = await mapLimit(threads, config.reddit.concurrency, (thread) =>
    fetchComments(thread, commentLimit)
  );
  const comments: Comment[] = batches.flat();

  // Named entities are pinned; discovery fills the remaining slots so a query with
  // no names still produces a ranking of whatever Reddit actually talks about.
  const pinned = profile.pinnable ? parseBrands(brandsInput, profile.tracked) : [];
  const candidates = discoverCandidates(comments, pinned, {
    limit: profile.tracked + SPARE_CANDIDATES,
    topic,
    titles: threads.map((thread) => thread.title),
    maxWords: profile.maxWords,
    minMentions: profile.minMentions,
  });

  const promoted = candidates.slice(0, Math.max(profile.tracked - pinned.length, 0));
  const tracked = [...pinned, ...promoted.map((candidate) => discoveredBrand(candidate.name))];

  const results = analyseBrands(comments, tracked);

  return {
    topic,
    mode,
    provider,
    threadsScanned: threads.length,
    commentsScanned: comments.length,
    totalMentions: results.reduce((sum, brand) => sum + brand.mentions, 0),
    months: [...new Set(results.flatMap((b) => b.timeline.map((p) => p.month)))].sort(),
    brands: results,
    suggestions: candidates.slice(promoted.length),
  };
}
