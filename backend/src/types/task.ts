export type Priority = 'alta' | 'media' | 'bassa';

export type Category = 'Generale' | 'Lavoro' | 'Studio' | 'Sistema' | string;

export type FilterStatus = 'all' | 'pending' | 'completed';

export type SortByOption = 'date-desc' | 'date-asc' | 'priority-desc';

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: string;
  category: Category;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  percent: number;
}

export interface CreateTaskInput {
  text: string;
  priority?: Priority;
  category?: Category;
}

export interface UpdateTaskInput {
  text?: string;
  priority?: Priority;
  category?: Category;
  completed?: boolean;
}
