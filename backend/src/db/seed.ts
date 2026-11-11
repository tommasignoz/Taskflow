import { db, sqlClient, initDatabase } from './index.js';
import { tasksTable } from './schema.js';
import type { Task, Priority } from '../types/task.js';

export const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    text: 'Completare la revisione del Design System aziendale',
    completed: false,
    priority: 'alta',
    createdAt: '09:30',
    category: 'Lavoro',
  },
  {
    id: 2,
    text: 'Configurare componenti shadcn/ui con token accessibili ARIA',
    completed: false,
    priority: 'alta',
    createdAt: '10:15',
    category: 'Lavoro',
  },
  {
    id: 3,
    text: 'Analizzare metriche di produttività del team Q4',
    completed: false,
    priority: 'media',
    createdAt: '11:00',
    category: 'Generale',
  },
  {
    id: 4,
    text: 'Allineamento sprint settimanale con Engineering Lead',
    completed: true,
    priority: 'media',
    createdAt: '08:45',
    category: 'Lavoro',
  },
  {
    id: 5,
    text: 'Aggiornare documentazione tecnica API e contratti TypeScript',
    completed: true,
    priority: 'bassa',
    createdAt: '08:00',
    category: 'Studio',
  },
];

export async function seedDatabase(force = false): Promise<void> {
  await initDatabase();

  const countResult = await db.select().from(tasksTable);
  if (!force && countResult.length > 0) {
    return;
  }

  if (force) {
    await db.delete(tasksTable);
  }

  for (const task of INITIAL_TASKS) {
    await db.insert(tasksTable).values({
      id: task.id,
      text: task.text,
      completed: task.completed,
      priority: task.priority,
      createdAt: task.createdAt,
      category: task.category,
    }).onConflictDoNothing();
  }

  // Sincronizza il sequence dell'identity column se presente
  try {
    await sqlClient`
      SELECT setval(
        pg_get_serial_sequence('tasks', 'id'),
        COALESCE(MAX(id), 1) + 1,
        false
      ) FROM tasks;
    `;
  } catch (e) {
    // Sequence sync non critico se non identity sequence
  }
}

// Se invocato direttamente da riga di comando
if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  console.log('🌱 Avvio seeding database PostgreSQL...');
  seedDatabase(true)
    .then(() => {
      console.log('✅ Seeding completato con successo!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Errore durante il seeding:', err);
      process.exit(1);
    });
}
