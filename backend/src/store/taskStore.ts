import { eq, and, or, desc, asc, sql, type SQL } from 'drizzle-orm';
import { db } from '../db/index.js';
import { tasksTable, type TaskSelect } from '../db/schema.js';
import { seedDatabase, INITIAL_TASKS } from '../db/seed.js';
import type {
  Task,
  Priority,
  Category,
  TaskStats,
  CreateTaskInput,
  UpdateTaskInput,
  FilterStatus,
  SortByOption,
} from '../types/task.js';

export { INITIAL_TASKS };

function mapRowToTask(row: TaskSelect): Task {
  return {
    id: Number(row.id),
    text: row.text,
    completed: row.completed,
    priority: row.priority as Priority,
    createdAt: row.createdAt,
    category: row.category as Category,
  };
}

/**
 * TaskStore: persistenza su database PostgreSQL gestita con Drizzle ORM.
 * Sostituisce la precedente memoria volatile in RAM con persistenza affidabile.
 */
export class TaskStore {
  public async getAll(options?: {
    status?: FilterStatus;
    query?: string;
    sortBy?: SortByOption;
  }): Promise<Task[]> {
    const conditions: SQL[] = [];

    if (options?.status) {
      if (options.status === 'pending') {
        conditions.push(eq(tasksTable.completed, false));
      } else if (options.status === 'completed') {
        conditions.push(eq(tasksTable.completed, true));
      }
    }

    if (options?.query && options.query.trim()) {
      const q = `%${options.query.trim().toLowerCase()}%`;
      conditions.push(
        or(
          sql`lower(${tasksTable.text}) LIKE ${q}`,
          sql`lower(${tasksTable.category}) LIKE ${q}`
        )!
      );
    }

    let query = db.select().from(tasksTable);

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    if (options?.sortBy === 'priority-desc') {
      query = query.orderBy(
        sql`CASE 
          WHEN ${tasksTable.priority} = 'alta' THEN 3 
          WHEN ${tasksTable.priority} = 'media' THEN 2 
          WHEN ${tasksTable.priority} = 'bassa' THEN 1 
          ELSE 0 END DESC`,
        desc(tasksTable.id)
      ) as typeof query;
    } else if (options?.sortBy === 'date-asc') {
      query = query.orderBy(asc(tasksTable.id)) as typeof query;
    } else {
      query = query.orderBy(desc(tasksTable.id)) as typeof query;
    }

    const rows = await query;
    return rows.map(mapRowToTask);
  }

  public async getById(id: number): Promise<Task | undefined> {
    const [row] = await db.select().from(tasksTable).where(eq(tasksTable.id, id));
    return row ? mapRowToTask(row) : undefined;
  }

  public async create(input: CreateTaskInput): Promise<Task> {
    const trimmed = input.text.trim();
    if (!trimmed) {
      throw new Error('Il testo del task non può essere vuoto');
    }

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const [inserted] = await db
      .insert(tasksTable)
      .values({
        text: trimmed,
        completed: false,
        priority: input.priority ?? 'media',
        category: input.category ?? 'Generale',
        createdAt: timeFormatted,
      })
      .returning();

    return mapRowToTask(inserted);
  }

  public async update(id: number, input: UpdateTaskInput): Promise<Task | null> {
    const toUpdate: Partial<typeof tasksTable.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (input.text !== undefined) toUpdate.text = input.text.trim();
    if (input.priority !== undefined) toUpdate.priority = input.priority;
    if (input.category !== undefined) toUpdate.category = input.category;
    if (input.completed !== undefined) toUpdate.completed = input.completed;

    const [updated] = await db
      .update(tasksTable)
      .set(toUpdate)
      .where(eq(tasksTable.id, id))
      .returning();

    return updated ? mapRowToTask(updated) : null;
  }

  public async toggle(id: number): Promise<Task | null> {
    const [toggled] = await db
      .update(tasksTable)
      .set({
        completed: sql`NOT ${tasksTable.completed}`,
        updatedAt: new Date(),
      })
      .where(eq(tasksTable.id, id))
      .returning();

    return toggled ? mapRowToTask(toggled) : null;
  }

  public async delete(id: number): Promise<Task | null> {
    const [deleted] = await db
      .delete(tasksTable)
      .where(eq(tasksTable.id, id))
      .returning();

    return deleted ? mapRowToTask(deleted) : null;
  }

  public async restore(task: Task): Promise<Task> {
    const [restored] = await db
      .insert(tasksTable)
      .values({
        id: task.id,
        text: task.text,
        completed: task.completed,
        priority: task.priority,
        category: task.category,
        createdAt: task.createdAt,
      })
      .onConflictDoUpdate({
        target: tasksTable.id,
        set: {
          text: task.text,
          completed: task.completed,
          priority: task.priority,
          category: task.category,
          updatedAt: new Date(),
        },
      })
      .returning();

    return mapRowToTask(restored);
  }

  public async clearCompleted(): Promise<{ deletedCount: number; remainingCount: number }> {
    const deleted = await db
      .delete(tasksTable)
      .where(eq(tasksTable.completed, true))
      .returning();

    const [stats] = await db
      .select({ count: sql<number>`count(*)` })
      .from(tasksTable);

    return {
      deletedCount: deleted.length,
      remainingCount: Number(stats?.count || 0),
    };
  }

  public async toggleAll(): Promise<{ allCompleted: boolean; updatedCount: number }> {
    const [pendingCheck] = await db
      .select({ pendingCount: sql<number>`count(*) filter (where ${tasksTable.completed} = false)` })
      .from(tasksTable);

    const hasPending = Number(pendingCheck?.pendingCount || 0) > 0;
    const targetState = hasPending;

    const updated = await db
      .update(tasksTable)
      .set({
        completed: targetState,
        updatedAt: new Date(),
      })
      .returning();

    return {
      allCompleted: targetState,
      updatedCount: updated.length,
    };
  }

  public async reset(): Promise<Task[]> {
    await seedDatabase(true);
    return this.getAll();
  }

  public async getStats(): Promise<TaskStats> {
    const [res] = await db
      .select({
        total: sql<number>`count(*)`,
        completed: sql<number>`count(*) filter (where ${tasksTable.completed} = true)`,
        pending: sql<number>`count(*) filter (where ${tasksTable.completed} = false)`,
      })
      .from(tasksTable);

    const total = Number(res?.total || 0);
    const completed = Number(res?.completed || 0);
    const pending = Number(res?.pending || 0);
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, percent };
  }
}

export const taskStore = new TaskStore();
