import { PLAN_LIMITS } from "../../context.js";

/**
 * Ceilings here are the widest any plan allows; the service clamps further to the
 * caller's own limits. Keeping the schema permissive means a plan upgrade never
 * requires a schema change.
 */
const MAX_THREADS = PLAN_LIMITS.pro.maxThreads;
const MAX_COMMENTS = PLAN_LIMITS.pro.maxComments;

export const analyzeSchema = {
  body: {
    type: "object",
    required: ["topic"],
    additionalProperties: false,
    properties: {
      topic: { type: "string", minLength: 2, maxLength: 200 },
      mode: { type: "string", enum: ["compare", "recommend"], default: "compare" },
      brands: { type: "string", maxLength: 400, default: "" },
      timeframe: { type: "string", enum: ["month", "year", "all"], default: "year" },
      threadLimit: { type: "integer", minimum: 5, maximum: MAX_THREADS, default: 20 },
      commentLimit: { type: "integer", minimum: 20, maximum: MAX_COMMENTS, default: 120 },
      subreddits: { type: "string", maxLength: 200, default: "" },
    },
  },
} as const;
