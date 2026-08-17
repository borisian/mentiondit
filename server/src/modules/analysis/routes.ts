import type { FastifyInstance } from "fastify";
import { resolveContext } from "../../context.js";
import type { AnalyzeParams, AnalyzeResponse } from "../../core/types.js";
import { analyzeSchema } from "./schema.js";
import { NoThreadsFound, runAnalysis } from "./service.js";

/** Fastify applies the schema defaults before the handler, so the body is complete. */
export async function analysisRoutes(app: FastifyInstance): Promise<void> {
  app.post<{ Body: AnalyzeParams }>(
    "/api/analyze",
    { schema: analyzeSchema },
    async (request, reply): Promise<AnalyzeResponse | undefined> => {
      const context = resolveContext(request);

      try {
        return await runAnalysis(request.body, context, request.log);
      } catch (error) {
        if (error instanceof NoThreadsFound) {
          return reply.code(404).send({ error: error.message });
        }
        throw error;
      }
    }
  );
}
