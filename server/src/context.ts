import type { FastifyRequest } from "fastify";

export type Plan = "anonymous" | "free" | "pro";

export interface PlanLimits {
  maxThreads: number;
  maxComments: number;
  analysesPerDay: number | null;
  allowExport: boolean;
}

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  anonymous: { maxThreads: 20, maxComments: 120, analysesPerDay: 5, allowExport: false },
  free: { maxThreads: 25, maxComments: 150, analysesPerDay: 20, allowExport: false },
  pro: { maxThreads: 50, maxComments: 300, analysesPerDay: null, allowExport: true },
};

export interface RequestContext {
  userId: string | null;
  plan: Plan;
  limits: PlanLimits;
}

export function resolveContext(_request: FastifyRequest): RequestContext {
  return { userId: null, plan: "anonymous", limits: PLAN_LIMITS.anonymous };
}
