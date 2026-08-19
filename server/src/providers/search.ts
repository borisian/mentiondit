import { config } from "../config.js";
import type { Thread, Timeframe } from "../core/types.js";
import { fetchThreadsByIds, filterByRelevance, searchThreads } from "./reddit.js";

const SERPER_URL = "https://google.serper.dev/search";

const FRESHNESS: Record<Timeframe, string> = { month: "qdr:m", year: "qdr:y", all: "" };

const PAGE_SIZE = 10;
const MAX_PAGES = 5;

export type Provider = "google" | "reddit";

export interface ThreadSearch {
  threads: Thread[];
  provider: Provider;
}

interface SerperResponse {
  organic?: { link?: string }[];
}

function buildQuery(topic: string, subreddits: string[]): string {
  if (subreddits.length === 0) return `${topic} site:reddit.com`;
  const scopes = subreddits.map((sub) => `site:reddit.com/r/${sub}`).join(" OR ");
  return `${topic} (${scopes})`;
}

function extractPostIds(links: string[]): string[] {
  const ids = new Set<string>();
  for (const link of links) {
    const match = /reddit\.com\/r\/[^/]+\/comments\/([a-z0-9]+)/i.exec(link);
    if (match) ids.add(match[1]!);
  }
  return [...ids];
}

async function serperPage(query: string, timeframe: Timeframe, page: number): Promise<string[]> {
  const body: Record<string, unknown> = { q: query, num: PAGE_SIZE, page };
  if (FRESHNESS[timeframe]) body.tbs = FRESHNESS[timeframe];

  const res = await fetch(SERPER_URL, {
    method: "POST",
    headers: { "X-API-KEY": config.serperApiKey, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = ((await res.json().catch(() => null)) as { message?: string } | null)?.message;
    throw new Error(`Serper ${res.status}${detail ? ` — ${detail}` : ""}`);
  }

  const data = (await res.json()) as SerperResponse;
  return (data.organic ?? []).map((item) => item.link ?? "").filter(Boolean);
}

async function serperSearch(
  topic: string,
  timeframe: Timeframe,
  limit: number,
  subreddits: string[]
): Promise<string[]> {
  const query = buildQuery(topic, subreddits);
  const pages = Math.min(Math.ceil(limit / PAGE_SIZE), MAX_PAGES);

  const batches = await Promise.all(
    Array.from({ length: pages }, (_, index) => serperPage(query, timeframe, index + 1))
  );
  return batches.flat();
}

export async function findThreads(
  topic: string,
  timeframe: Timeframe,
  limit: number,
  subreddits: string[],
  log: { warn: (msg: string) => void }
): Promise<ThreadSearch> {
  if (config.serperApiKey) {
    try {
      const links = await serperSearch(topic, timeframe, limit, subreddits);
      const threads = await fetchThreadsByIds(extractPostIds(links).slice(0, limit));
      if (threads.length > 0) return { threads, provider: "google" };
      log.warn("Serper n'a renvoyé aucune discussion exploitable, repli sur la recherche Reddit.");
    } catch (error) {
      log.warn(`Serper indisponible (${(error as Error).message}), repli sur la recherche Reddit.`);
    }
  }

  const found = await searchThreads(topic, timeframe, limit, subreddits);
  return { threads: filterByRelevance(found, topic), provider: "reddit" };
}
