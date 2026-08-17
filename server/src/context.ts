import type { FastifyRequest } from "fastify";

/**
 * The seam accounts and billing plug into.
 *
 * Everything downstream takes a RequestContext and reads its limits, so adding
 * authentication means replacing `resolveContext` with a real lookup and adding
 * entries to PLAN_LIMITS — no service or route logic has to change. Quota
 * counting and usage metering belong here too, wrapped around the same object.
 */

export type Plan = "anonymous" | "free" | "pro";

export interface PlanLimits {
  maxThreads: number;
  maxComments: number;
  /** null means unlimited. Nothing enforces this yet — there is no store to count in. */
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

/**
 * Every caller is anonymous today. This is deliberately the only place that
 * decides who someone is.
 */
export function resolveContext(_request: FastifyRequest): RequestContext {
  return { userId: null, plan: "anonymous", limits: PLAN_LIMITS.anonymous };
}
