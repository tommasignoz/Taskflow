import type { FastifyPluginAsync } from 'fastify';
import { sqlClient } from '../db/index.js';

export const databaseRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/database/overview - Panoramica completa di tabelle, colonne, telemetria e dati
  fastify.get('/database/overview', async (_request, reply) => {
    const startTime = Date.now();

    try {
      // 1. Versione e Telemetria
      const versionResult = await sqlClient`SELECT version()`;
      const versionString = versionResult[0]?.version || 'PostgreSQL 16';

      const connResult = await sqlClient`
        SELECT count(*)::int as active_connections 
        FROM pg_stat_activity 
        WHERE datname = current_database()
      `;
      const activeConnections = connResult[0]?.active_connections || 1;

      const dbSizeResult = await sqlClient`
        SELECT pg_size_pretty(pg_database_size(current_database())) as db_size
      `;
      const dbSize = dbSizeResult[0]?.db_size || 'N/A';

      // 2. Elenco Tabelle nel schema public
      const tablesResult = await sqlClient`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'
        ORDER BY table_name;
      `;

      // 3. Recupera dettagli per ogni tabella (colonne, chiavi primarie, dimensioni e righe)
      const tablesData = [];

      for (const t of tablesResult) {
        const tableName = t.table_name as string;

        // Colonne
        const columns = await sqlClient`
          SELECT 
            c.column_name, 
            c.data_type, 
            c.is_nullable, 
            c.column_default,
            CASE WHEN pk.column_name IS NOT NULL THEN true ELSE false END as is_primary
          FROM information_schema.columns c
          LEFT JOIN (
            SELECT ku.column_name
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage ku
              ON tc.constraint_name = ku.constraint_name
              AND tc.table_schema = ku.table_schema
            WHERE tc.constraint_type = 'PRIMARY KEY'
              AND tc.table_schema = 'public'
              AND tc.table_name = ${tableName}
          ) pk ON c.column_name = pk.column_name
          WHERE c.table_schema = 'public' AND c.table_name = ${tableName}
          ORDER BY c.ordinal_position;
        `;

        // Conteggio righe
        const countRes = await sqlClient.unsafe(`SELECT count(*)::int as total FROM "${tableName}"`);
        const rowCount = countRes[0]?.total || 0;

        // Dimensione tabella
        const sizeRes = await sqlClient`
          SELECT pg_size_pretty(pg_total_relation_size(regclass(${tableName}))) as size
        `;
        const tableSize = sizeRes[0]?.size || 'N/A';

        // Contenuto righe (fino a 100 righe per anteprima)
        const rows = await sqlClient.unsafe(`SELECT * FROM "${tableName}" ORDER BY 1 DESC LIMIT 100`);

        tablesData.push({
          name: tableName,
          rowCount,
          size: tableSize,
          columns: columns.map((col) => ({
            name: col.column_name,
            type: col.data_type,
            nullable: col.is_nullable === 'YES',
            defaultValue: col.column_default,
            isPrimary: Boolean(col.is_primary),
          })),
          rows: rows.map((r) => ({ ...r })),
        });
      }

      const latencyMs = Date.now() - startTime;

      return reply.status(200).send({
        status: 'ONLINE',
        database: 'taskflow',
        engine: 'PostgreSQL 16',
        version: versionString,
        orm: 'Drizzle ORM (drizzle-orm/postgres-js)',
        dbSize,
        activeConnections,
        latencyMs,
        tablesCount: tablesData.length,
        tables: tablesData,
        timestamp: new Date().toISOString(),
      });
    } catch (err: unknown) {
      fastify.log.error(err);
      return reply.status(500).send({
        status: 'ERROR',
        error: err instanceof Error ? err.message : 'Errore nel recupero dei metadati del database',
      });
    }
  });

  // POST /api/database/query - Console SQL interattiva di sola lettura per esplorazione
  fastify.post<{
    Body: { query: string };
  }>('/database/query', async (request, reply) => {
    const { query } = request.body || {};

    if (!query || typeof query !== 'string' || !query.trim()) {
      return reply.status(400).send({ error: 'La query SQL non può essere vuota' });
    }

    const trimmed = query.trim();
    // Protezione minimale per sola lettura
    const isReadOnly = /^(select|explain|show)\s+/i.test(trimmed);
    if (!isReadOnly) {
      return reply.status(403).send({
        error: 'Per motivi di sicurezza, la console interattiva supporta solo query di lettura (SELECT, EXPLAIN, SHOW)',
      });
    }

    const start = Date.now();
    try {
      const results = await sqlClient.unsafe(trimmed);
      const executionTimeMs = Date.now() - start;

      const fields = results.length > 0 ? Object.keys(results[0]) : [];

      return reply.status(200).send({
        success: true,
        executionTimeMs,
        rowCount: results.length,
        fields,
        rows: results.map((r) => ({ ...r })),
      });
    } catch (err: unknown) {
      return reply.status(400).send({
        success: false,
        error: err instanceof Error ? err.message : 'Errore durante l\'esecuzione della query',
      });
    }
  });
};
