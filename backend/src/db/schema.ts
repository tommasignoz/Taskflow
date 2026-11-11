import { pgTable, bigint, text, boolean, varchar, timestamp } from 'drizzle-orm/pg-core';

export const tasksTable = pgTable('tasks', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  text: text('text').notNull(),
  completed: boolean('completed').default(false).notNull(),
  priority: varchar('priority', { length: 20 }).default('media').notNull(),
  createdAt: varchar('created_at', { length: 30 }).notNull(),
  category: varchar('category', { length: 50 }).default('Generale').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export type TaskSelect = typeof tasksTable.$inferSelect;
export type TaskInsert = typeof tasksTable.$inferInsert;
