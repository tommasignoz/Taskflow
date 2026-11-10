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

/**
 * TaskStore: memorizzazione volatile in-memory (RAM)
 * I dati rimangono attivi per tutto il ciclo di vita del processo Node/Fastify
 * senza scrittura persistente su disco o database.
 */
export class TaskStore {
  private tasks: Task[];

  constructor(initialData: Task[] = INITIAL_TASKS) {
    this.tasks = initialData.map((t) => ({ ...t }));
  }

  public getAll(options?: {
    status?: FilterStatus;
    query?: string;
    sortBy?: SortByOption;
  }): Task[] {
    let result = [...this.tasks];

    if (options?.status) {
      if (options.status === 'pending') {
        result = result.filter((t) => !t.completed);
      } else if (options.status === 'completed') {
        result = result.filter((t) => t.completed);
      }
    }

    if (options?.query && options.query.trim()) {
      const q = options.query.trim().toLowerCase();
      result = result.filter(
        (t) =>
          t.text.toLowerCase().includes(q) ||
          (t.category && t.category.toLowerCase().includes(q))
      );
    }

    if (options?.sortBy) {
      const priorityWeight: Record<Priority, number> = { alta: 3, media: 2, bassa: 1 };
      result.sort((a, b) => {
        if (options.sortBy === 'priority-desc') {
          const diff = (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
          if (diff !== 0) return diff;
        }
        if (options.sortBy === 'date-asc') {
          return a.id - b.id;
        }
        return b.id - a.id;
      });
    }

    return result;
  }

  public getById(id: number): Task | undefined {
    return this.tasks.find((t) => t.id === id);
  }

  public create(input: CreateTaskInput): Task {
    const trimmed = input.text.trim();
    if (!trimmed) {
      throw new Error('Il testo del task non può essere vuoto');
    }

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newTask: Task = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      text: trimmed,
      completed: false,
      priority: input.priority ?? 'media',
      category: input.category ?? 'Generale',
      createdAt: timeFormatted,
    };

    // Inserisci in cima
    this.tasks = [newTask, ...this.tasks];
    return newTask;
  }

  public update(id: number, input: UpdateTaskInput): Task | null {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const existing = this.tasks[index];
    const updated: Task = {
      ...existing,
      text: input.text !== undefined ? input.text.trim() : existing.text,
      priority: input.priority !== undefined ? input.priority : existing.priority,
      category: input.category !== undefined ? input.category : existing.category,
      completed: input.completed !== undefined ? input.completed : existing.completed,
    };

    this.tasks[index] = updated;
    return updated;
  }

  public toggle(id: number): Task | null {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;

    this.tasks[index] = {
      ...this.tasks[index],
      completed: !this.tasks[index].completed,
    };

    return this.tasks[index];
  }

  public delete(id: number): Task | null {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const [deleted] = this.tasks.splice(index, 1);
    return deleted;
  }

  public restore(task: Task): Task {
    // Se non esiste già, reinserisce
    const exists = this.tasks.some((t) => t.id === task.id);
    if (!exists) {
      this.tasks = [task, ...this.tasks];
    }
    return task;
  }

  public clearCompleted(): { deletedCount: number; remainingCount: number } {
    const beforeCount = this.tasks.length;
    this.tasks = this.tasks.filter((t) => !t.completed);
    const deletedCount = beforeCount - this.tasks.length;
    return { deletedCount, remainingCount: this.tasks.length };
  }

  public toggleAll(): { allCompleted: boolean; updatedCount: number } {
    const allDone = this.tasks.length > 0 && this.tasks.every((t) => t.completed);
    const targetState = !allDone;
    this.tasks = this.tasks.map((t) => ({ ...t, completed: targetState }));
    return { allCompleted: targetState, updatedCount: this.tasks.length };
  }

  public reset(): Task[] {
    this.tasks = INITIAL_TASKS.map((t) => ({ ...t }));
    return this.tasks;
  }

  public getStats(): TaskStats {
    const total = this.tasks.length;
    const completed = this.tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, percent };
  }
}

// Istanza singleton volatile in-memory
export const taskStore = new TaskStore();
