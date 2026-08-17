import { config } from "../config.js";
import { QUERY_STOPWORDS } from "../core/filters.js";
import { words } from "../core/text.js";
import type { Comment, Thread, Timeframe } from "../core/types.js";

const OAUTH_BASE = "https://oauth.reddit.com";
const TOKEN_URL = "https://www.reddit.com/api/v1/access_token";
const IGNORED_AUTHORS = new Set(["AutoModerator", "[deleted]"]);

let cachedToken: { value: string; expiresAt: number } | null = null;
/** In-flight request, so a cold start does not send one token call per worker. */
let pendingToken: Promise<string> | null = null;

async function requestToken(): Promise<string> {
  const basic = Buffer.from(
    `${config.reddit.clientId}:${config.reddit.clientSecret}`
  ).toString("base64");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": config.reddit.userAgent,
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error(
      `Authentification Reddit refusée (${res.status}). Vérifiez REDDIT_CLIENT_ID et REDDIT_CLIENT_SECRET.`
    );
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };
  // Refresh a minute early so an in-flight batch never straddles expiry.
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return cachedToken.value;
}

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) return cachedToken.value;

  pendingToken ??= requestToken().finally(() => {
    pendingToken = null;
  });
  return pendingToken;
}

async function redditFetch<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = `${OAUTH_BASE}${path}?${new URLSearchParams({ ...params, raw_json: "1" })}`;

  for (let attempt = 0; attempt < 3; attempt++) {
    const token = await getToken();
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, "User-Agent": config.reddit.userAgent },
    });

    if (res.status === 429 || res.status >= 500) {
      await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** attempt));
      continue;
    }
    if (res.status === 401) {
      cachedToken = null;
      continue;
    }
    if (!res.ok) throw new Error(`Reddit API ${res.status} sur ${path}`);
    return (await res.json()) as T;
  }

  throw new Error(`Reddit API injoignable sur ${path} (rate limit ou incident).`);
}

interface Listing<T> {
  kind: string;
  data: { children: { kind: string; data: T }[] };
}

interface RawThread {
  id: string;
  title: string;
  subreddit: string;
  permalink: string;
  num_comments: number;
}

interface RawComment {
  id: string;
  body?: string;
  score: number;
  permalink?: string;
  created_utc: number;
  author?: string;
  replies?: Listing<RawComment> | "";
}

const toThread = (raw: RawThread): Thread => ({
  id: raw.id,
  title: raw.title,
  subreddit: raw.subreddit,
  permalink: `https://www.reddit.com${raw.permalink}`,
});

const usableThreads = (listing: Listing<RawThread>): Thread[] =>
  listing.data.children
    .filter((child) => child.kind === "t3" && child.data.num_comments > 0)
    .map((child) => toThread(child.data));

export async function searchThreads(
  topic: string,
  timeframe: Timeframe,
  limit: number,
  subreddits: string[]
): Promise<Thread[]> {
  const path = subreddits.length ? `/r/${subreddits.join("+")}/search` : "/search";
  const params: Record<string, string> = {
    q: topic,
    type: "link",
    sort: "relevance",
    t: timeframe,
    limit: String(Math.min(limit, 100)),
  };
  if (subreddits.length) params.restrict_sr = "1";

  return usableThreads(await redditFetch<Listing<RawThread>>(path, params));
}

/**
 * Hydrates post ids coming from an external search engine. `/api/info` takes up
 * to 100 fullnames at once, so a whole result page costs a single call.
 */
export async function fetchThreadsByIds(ids: string[]): Promise<Thread[]> {
  if (ids.length === 0) return [];

  const listing = await redditFetch<Listing<RawThread>>("/api/info", {
    id: ids.slice(0, 100).map((id) => `t3_${id}`).join(","),
  });
  return usableThreads(listing);
}

/**
 * Reddit's own relevance sort drifts badly on long-tail queries: for "best brunch
 * in Toronto" it returns an 879-comment reality-TV thread that then dominates every
 * count. Keep only threads whose title carries a content word of the query, and
 * order the closest matches first — requiring *every* term empties the set.
 */
export function filterByRelevance(threads: Thread[], topic: string): Thread[] {
  const terms = words(topic).filter(
    (word) => word.length > 2 && !QUERY_STOPWORDS.has(word)
  );
  if (terms.length === 0) return threads;

  const scored = threads
    .map((thread) => {
      const title = thread.title.toLowerCase();
      return { thread, hits: terms.filter((term) => title.includes(term)).length };
    })
    .filter((entry) => entry.hits > 0)
    .sort((a, b) => b.hits - a.hits);

  return scored.length >= 3 ? scored.map((entry) => entry.thread) : threads;
}

function flatten(listing: Listing<RawComment> | "", thread: Thread, out: Comment[]): void {
  if (!listing) return;

  for (const child of listing.data.children) {
    if (child.kind !== "t1") continue; // "more" placeholders carry no text
    const raw = child.data;
    const body = raw.body ?? "";

    if (
      body &&
      body !== "[deleted]" &&
      body !== "[removed]" &&
      !IGNORED_AUTHORS.has(raw.author ?? "")
    ) {
      out.push({
        threadId: thread.id,
        subreddit: thread.subreddit,
        body,
        score: raw.score,
        permalink: raw.permalink
          ? `https://www.reddit.com${raw.permalink}`
          : `${thread.permalink}${raw.id}/`,
        createdUtc: raw.created_utc,
      });
    }

    flatten(raw.replies ?? "", thread, out);
  }
}

export async function fetchComments(thread: Thread, limit: number): Promise<Comment[]> {
  const response = await redditFetch<[Listing<RawThread>, Listing<RawComment>]>(
    `/comments/${thread.id}`,
    { limit: String(limit), depth: "3", sort: "top" }
  );

  const comments: Comment[] = [];
  flatten(response[1], thread, comments);
  return comments;
}

/** Bounded concurrency: Reddit allows 100 req/min, and bursts get throttled. */
export async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;

  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await fn(items[index]!);
    }
  });

  await Promise.all(workers);
  return results;
}
