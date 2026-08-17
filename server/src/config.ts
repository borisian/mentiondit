import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Variable d'environnement manquante : ${name}`);
  return value;
}

export const config = {
  port: Number(process.env.PORT ?? 8080),
  reddit: {
    clientId: required("REDDIT_CLIENT_ID"),
    clientSecret: required("REDDIT_CLIENT_SECRET"),
    userAgent: required("REDDIT_USER_AGENT"),
    /**
     * Wall time is N x latency / concurrency, so this is the single biggest lever
     * on request duration. One analysis issues at most ~51 calls, well inside the
     * 100 req/min budget; raise carefully once several users share that budget.
     */
    concurrency: Number(process.env.REDDIT_CONCURRENCY ?? 8),
  },
  /** Optional: Google results via Serper. Without it we fall back to Reddit search. */
  serperApiKey: process.env.SERPER_API_KEY ?? "",
};
