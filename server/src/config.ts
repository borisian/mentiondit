import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Variable d'environnement manquante : ${name}`);
  return value;
}

export const config = {
  port: Number(process.env.MENTIONDIT_PORT ?? process.env.PORT ?? 8080),
  reddit: {
    clientId: required("REDDIT_CLIENT_ID"),
    clientSecret: required("REDDIT_CLIENT_SECRET"),
    userAgent: required("REDDIT_USER_AGENT"),
    concurrency: Number(process.env.REDDIT_CONCURRENCY ?? 8),
  },
  serperApiKey: process.env.SERPER_API_KEY ?? "",
};
