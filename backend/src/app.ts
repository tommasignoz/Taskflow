import Fastify from 'fastify';
import cors from '@fastify/cors';
import { taskRoutes } from './routes/taskRoutes.js';
import { databaseRoutes } from './routes/databaseRoutes.js';
import { authRoutes } from './routes/authRoutes.js';
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

  // Registrazione CORS per comunicare con il frontend (inclusi cookie e credenziali di autenticazione)
  await app.register(cors, {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
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
      auth: 'better-auth',
      dbConnected: isDbConnected,
    };
  });

  // Registrazione rotte /api
  await app.register(authRoutes, { prefix: '/api' });
  await app.register(taskRoutes, { prefix: '/api' });
  await app.register(databaseRoutes, { prefix: '/api' });

  return app;
}
