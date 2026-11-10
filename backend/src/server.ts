import { buildApp } from './app.js';

const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || '0.0.0.0';

async function start() {
  try {
    const app = await buildApp();

    await app.listen({ port: PORT, host: HOST });
    console.log(`\n🚀 Server Fastify avviato con successo su http://localhost:${PORT}`);
    console.log(`📡 Endpoints disponibili:`);
    console.log(`   - GET    /api/health`);
    console.log(`   - GET    /api/tasks`);
    console.log(`   - POST   /api/tasks`);
    console.log(`   - PUT    /api/tasks/:id`);
    console.log(`   - PATCH  /api/tasks/:id/toggle`);
    console.log(`   - DELETE /api/tasks/:id`);
    console.log(`   - GET    /api/tasks/stats`);
    console.log(`   - POST   /api/tasks/clear-completed`);
    console.log(`   - POST   /api/tasks/toggle-all`);
    console.log(`   - POST   /api/tasks/reset`);
    console.log(`💾 Memorizzazione: VOLATILE (in-memory RAM)\n`);

    const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
    for (const signal of signals) {
      process.on(signal, async () => {
        console.log(`\nRicevuto ${signal}, chiusura del server...`);
        await app.close();
        process.exit(0);
      });
    }
  } catch (err) {
    console.error('Errore durante l\'avvio del server:', err);
    process.exit(1);
  }
}

start();
