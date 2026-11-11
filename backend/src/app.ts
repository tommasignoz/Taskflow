import Fastify from 'fastify';
import cors from '@fastify/cors';
import { taskRoutes } from './routes/taskRoutes.js';
import { databaseRoutes } from './routes/databaseRoutes.js';
import { checkDbConnection } from './db/index.js';

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
    const isDbConnected = await checkDbConnection();
    return {
      status: 'ok',
      service: 'taskflow-backend',
      timestamp: new Date().toISOString(),
      database: 'postgresql',
      orm: 'drizzle-orm',
      dbConnected: isDbConnected,
    };
  });

  // Registrazione rotte /api
  await app.register(taskRoutes, { prefix: '/api' });
  await app.register(databaseRoutes, { prefix: '/api' });

  return app;
}
