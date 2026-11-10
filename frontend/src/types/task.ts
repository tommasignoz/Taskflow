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

export interface TaskUpdates {
  text?: string;
  priority?: Priority;
  category?: Category;
  completed?: boolean;
}

export interface TaskManagerReturn {
  tasks: Task[];
  filteredTasks: Task[];
  stats: TaskStats;
  filter: FilterStatus;
  setFilter: (filter: FilterStatus) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: SortByOption;
  setSortBy: (sortBy: SortByOption) => void;
  editingTaskId: number | null;
  setEditingTaskId: (id: number | null) => void;
  animatingDingId: number | null;
  statusMessage: string;
  setStatusMessage: (message: string) => void;
  recentlyDeleted: Task | null;
  createTask: (text: string, priority?: Priority, category?: Category) => boolean;
  updateTask: (id: number, updates: TaskUpdates) => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
  restoreDeletedTask: () => void;
  clearCompleted: () => void;
  toggleAll: () => void;
  resetDemo: () => void;
}
