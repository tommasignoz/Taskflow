import Fastify from 'fastify';
import cors from '@fastify/cors';
import { taskRoutes } from './routes/taskRoutes.js';

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  // Gestione flessibile dei content-type per supportare chiamate POST senza body
  // o con content-type differenti (es. application/x-www-form-urlencoded da script/curl)
  app.addContentTypeParser(
    ['application/x-www-form-urlencoded', 'text/plain'],
    (_request, _payload, done) => {
      done(null, {});
    }
  );

  // Registrazione CORS per comunicare con il frontend
  await app.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Health check
  app.get('/api/health', async () => {
    return {
      status: 'ok',
      service: 'taskflow-backend',
      timestamp: new Date().toISOString(),
      storage: 'volatile-in-memory',
    };
  });

  // Registrazione rotte /api
  await app.register(taskRoutes, { prefix: '/api' });

  return app;
}
