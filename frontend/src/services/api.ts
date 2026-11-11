import type {
  Task,
  Priority,
  Category,
  FilterStatus,
  SortByOption,
  TaskStats,
  TaskUpdates,
  DatabaseOverview,
  QueryResult,
} from '../types/task';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = {
  async getTasks(params?: {
    status?: FilterStatus;
    search?: string;
    sortBy?: SortByOption;
  }): Promise<Task[]> {
    const searchParams = new URLSearchParams();
    if (params?.status && params.status !== 'all') {
      searchParams.set('status', params.status);
    }
    if (params?.search) {
      searchParams.set('search', params.search);
    }
    if (params?.sortBy) {
      searchParams.set('sortBy', params.sortBy);
    }

    const query = searchParams.toString();
    const url = `${API_BASE}/tasks${query ? `?${query}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Errore recupero task: ${res.statusText}`);
    }
    return res.json();
  },

  async createTask(
    text: string,
    priority: Priority = 'media',
    category: Category = 'Generale'
  ): Promise<Task> {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, priority, category }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Errore creazione task: ${res.statusText}`);
    }
    return res.json();
  },

  async updateTask(id: number, updates: TaskUpdates): Promise<Task> {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      throw new Error(`Errore aggiornamento task: ${res.statusText}`);
    }
    return res.json();
  },

  async toggleTask(id: number): Promise<Task> {
    const res = await fetch(`${API_BASE}/tasks/${id}/toggle`, {
      method: 'PATCH',
    });
    if (!res.ok) {
      throw new Error(`Errore modifica stato task: ${res.statusText}`);
    }
    return res.json();
  },

  async deleteTask(id: number): Promise<Task> {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error(`Errore eliminazione task: ${res.statusText}`);
    }
    return res.json();
  },

  async restoreTask(task: Task): Promise<Task> {
    const res = await fetch(`${API_BASE}/tasks/restore`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task }),
    });
    if (!res.ok) {
      throw new Error(`Errore ripristino task: ${res.statusText}`);
    }
    return res.json();
  },

  async clearCompleted(): Promise<{ deletedCount: number; remainingCount: number }> {
    const res = await fetch(`${API_BASE}/tasks/clear-completed`, {
      method: 'POST',
    });
    if (!res.ok) {
      throw new Error(`Errore eliminazione completati: ${res.statusText}`);
    }
    return res.json();
  },

  async toggleAll(): Promise<{ allCompleted: boolean; updatedCount: number }> {
    const res = await fetch(`${API_BASE}/tasks/toggle-all`, {
      method: 'POST',
    });
    if (!res.ok) {
      throw new Error(`Errore inversione completamento: ${res.statusText}`);
    }
    return res.json();
  },

  async resetDemo(): Promise<Task[]> {
    const res = await fetch(`${API_BASE}/tasks/reset`, {
      method: 'POST',
    });
    if (!res.ok) {
      throw new Error(`Errore ripristino demo: ${res.statusText}`);
    }
    return res.json();
  },

  async getStats(): Promise<TaskStats> {
    const res = await fetch(`${API_BASE}/tasks/stats`);
    if (!res.ok) {
      throw new Error(`Errore recupero statistiche: ${res.statusText}`);
    }
    return res.json();
  },

  // Database Overview & Introspection
  async getDatabaseOverview(): Promise<DatabaseOverview> {
    const res = await fetch(`${API_BASE}/database/overview`);
    if (!res.ok) {
      throw new Error(`Errore recupero metadati database: ${res.statusText}`);
    }
    return res.json();
  },

  // Esecuzione query SQL sicura (SELECT)
  async runDatabaseQuery(query: string): Promise<QueryResult> {
    const res = await fetch(`${API_BASE}/database/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `Errore esecuzione query: ${res.statusText}`);
    }
    return data;
  },
};
