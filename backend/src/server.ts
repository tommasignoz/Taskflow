import os from 'os';
import { buildApp } from './app.js';
import { checkDbConnection, initDatabase, sqlClient } from './db/index.js';
import { seedDatabase } from './db/seed.js';

const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || '0.0.0.0';

function getNetworkAddresses(): { name: string; address: string }[] {
  const interfaces = os.networkInterfaces();
  const addresses: { name: string; address: string }[] = [];

  for (const [name, nets] of Object.entries(interfaces)) {
    for (const net of nets || []) {
      if (net.family === 'IPv4' && !net.internal) {
        addresses.push({ name, address: net.address });
      }
    }
  }

  return addresses;
}

async function start() {
  try {
    console.log('🔄 Connessione al database PostgreSQL in corso...');
    const connected = await checkDbConnection();
    if (!connected) {
      console.warn('⚠️ Attenzione: impossibile verificare la connessione a PostgreSQL. Assicurati che il container Docker sia avviato con: pnpm run docker:up');
    } else {
      console.log('✅ Connesso a PostgreSQL con successo.');
      await initDatabase();
      await seedDatabase(false);
      console.log('✅ Schema e dati iniziali verificati.');
    }

    const app = await buildApp();

    await app.listen({ port: PORT, host: HOST });
    console.log(`\n🚀 Server Fastify avviato con successo!`);
    console.log(`📡 Accessibile ai seguenti indirizzi:`);
    console.log(`   - Locale:     http://localhost:${PORT}`);

    const networkAddrs = getNetworkAddresses();
    for (const net of networkAddrs) {
      const isTailscale = net.name.toLowerCase().includes('tailscale') || net.address.startsWith('100.');
      const label = isTailscale ? 'Tailscale' : `Rete locale (${net.name})`;
      console.log(`   - ${label.padEnd(26)}: http://${net.address}:${PORT}`);
    }

    console.log(`\n📡 Endpoints API:`);
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
    console.log(`🐘 Database: PostgreSQL (Docker) + Drizzle ORM\n`);

    const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
    for (const signal of signals) {
      process.on(signal, async () => {
        console.log(`\nRicevuto ${signal}, chiusura del server...`);
        await app.close();
        await sqlClient.end();
        process.exit(0);
      });
    }
  } catch (err) {
    console.error('Errore durante l\'avvio del server:', err);
    process.exit(1);
  }
}

start();
