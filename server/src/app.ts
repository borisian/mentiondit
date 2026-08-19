import cors from "@fastify/cors";
import Fastify, { type FastifyError, type FastifyInstance } from "fastify";
import { analysisRoutes } from "./modules/analysis/routes.js";
import { healthRoutes } from "./modules/health.js";

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: true });

  await app.register(healthRoutes);
  await app.register(analysisRoutes);

  app.setErrorHandler((error: FastifyError, _request, reply) => {
    app.log.error(error);
    const status = error.statusCode && error.statusCode < 500 ? error.statusCode : 500;
    reply.code(status).send({ error: error.message || "Erreur interne du serveur." });
  });

  return app;
}
