import { useState, useEffect, useMemo, useCallback } from 'react';
import type {
  Task,
  Priority,
  Category,
  FilterStatus,
  SortByOption,
  TaskStats,
  TaskUpdates,
  TaskManagerReturn,
} from '../types/task';
import {
  playDingSound,
  playUndingSound,
  playAddSound,
  playDeleteSound,
  playEditSound,
} from '../utils/soundEffects';

const STORAGE_KEY = 'taskflow_crud_tasks';

export const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    text: "Completare la revisione del Design System aziendale",
    completed: false,
    priority: "alta",
    createdAt: "09:30",
    category: "Lavoro",
  },
  {
    id: 2,
    text: "Configurare componenti shadcn/ui con token accessibili ARIA",
    completed: false,
    priority: "alta",
    createdAt: "10:15",
    category: "Lavoro",
  },
  {
    id: 3,
    text: "Analizzare metriche di produttività del team Q4",
    completed: false,
    priority: "media",
    createdAt: "11:00",
    category: "Generale",
  },
  {
    id: 4,
    text: "Allineamento sprint settimanale con Engineering Lead",
    completed: true,
    priority: "media",
    createdAt: "08:45",
    category: "Lavoro",
  },
  {
    id: 5,
    text: "Aggiornare documentazione tecnica API e contratti TypeScript",
    completed: true,
    priority: "bassa",
    createdAt: "08:00",
    category: "Studio",
  },
];

/**
 * Hook per la gestione completa dello stato CRUD e delle statistiche di TaskFlow
 */
export function useTaskManager(soundEnabled = true): TaskManagerReturn {
  // Caricamento iniziale da localStorage
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Task[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e: unknown) {
      console.warn("Errore lettura localStorage:", e);
    }
    return INITIAL_TASKS;
  });

  const [filter, setFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortByOption>('date-desc');
  const [animatingDingId, setAnimatingDingId] = useState<number | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Sistema pronto • Seleziona una vista per gestire i task');
  const [recentlyDeleted, setRecentlyDeleted] = useState<Task | null>(null);

  // Sincronizzazione persistente in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e: unknown) {
      console.warn("Errore scrittura localStorage:", e);
    }
  }, [tasks]);

  // CREATE (Aggiunta nuovo task)
  const createTask = useCallback(
    (text: string, priority: Priority = 'media', category: Category = 'Generale'): boolean => {
      const trimmed = text.trim();
      if (!trimmed) return false;

      const newTask: Task = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        text: trimmed,
        completed: false,
        priority,
        category,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setTasks((prev) => [newTask, ...prev]);
      playAddSound(soundEnabled);
      setStatusMessage(`Nuova attività creata: "${trimmed.slice(0, 24)}..."`);
      return true;
    },
    [soundEnabled]
  );

  // UPDATE (Modifica campi testo, priorità, categoria)
  const updateTask = useCallback(
    (id: number, updates: TaskUpdates) => {
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id === id) {
            return { ...task, ...updates };
          }
          return task;
        })
      );
      setEditingTaskId(null);
      playEditSound(soundEnabled);
      setStatusMessage(`Attività #${id} salvata con successo`);
    },
    [soundEnabled]
  );

  // UPDATE - TOGGLE SPUNTA (Con feedback sonoro ding)
  const toggleTask = useCallback(
    (id: number) => {
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id === id) {
            const nextCompleted = !task.completed;

            if (nextCompleted) {
              playDingSound(soundEnabled);
              setStatusMessage('Attività completata con successo');
            } else {
              playUndingSound(soundEnabled);
              setStatusMessage('Attività reimpostata come in corso');
            }

            // Animazione visiva DING
            setAnimatingDingId(id);
            setTimeout(() => {
              setAnimatingDingId((curr) => (curr === id ? null : curr));
            }, 500);

            return { ...task, completed: nextCompleted };
          }
          return task;
        })
      );
    },
    [soundEnabled]
  );

  // DELETE (Eliminazione con possibilità di Restore)
  const deleteTask = useCallback(
    (id: number) => {
      const taskToDelete = tasks.find((t) => t.id === id);
      if (!taskToDelete) return;

      setTasks((prev) => prev.filter((t) => t.id !== id));
      setRecentlyDeleted(taskToDelete);
      playDeleteSound(soundEnabled);
      setStatusMessage(`Attività eliminata. Fai clic su "Annulla" per ripristinare`);
    },
    [tasks, soundEnabled]
  );

  // RESTORE (Annulla ultima eliminazione)
  const restoreDeletedTask = useCallback(() => {
    if (!recentlyDeleted) return;
    setTasks((prev) => [recentlyDeleted, ...prev]);
    playAddSound(soundEnabled);
    setStatusMessage(`Attività ripristinata: "${recentlyDeleted.text.slice(0, 24)}..."`);
    setRecentlyDeleted(null);
  }, [recentlyDeleted, soundEnabled]);

  // DELETE MULTIPLO (Elimina completati)
  const clearCompleted = useCallback(() => {
    const completedCount = tasks.filter((t) => t.completed).length;
    if (completedCount === 0) {
      setStatusMessage('Nessuna attività completata da eliminare');
      return;
    }
    setTasks((prev) => prev.filter((t) => !t.completed));
    playDeleteSound(soundEnabled);
    setStatusMessage(`Eliminate ${completedCount} attività completate`);
  }, [tasks, soundEnabled]);

  // TOGGLE ALL
  const toggleAll = useCallback(() => {
    const allDone = tasks.length > 0 && tasks.every((t) => t.completed);
    setTasks((prev) => prev.map((t) => ({ ...t, completed: !allDone })));
    if (!allDone) {
      playDingSound(soundEnabled);
      setStatusMessage('Tutte le attività contrassegnate come completate');
    } else {
      playUndingSound(soundEnabled);
      setStatusMessage('Tutte le attività riaperte');
    }
  }, [tasks, soundEnabled]);

  // RESET DEMO
  const resetDemo = useCallback(() => {
    setTasks(INITIAL_TASKS);
    playAddSound(soundEnabled);
    setStatusMessage('Dati demo ripristinati con successo');
  }, [soundEnabled]);

  // READ & FILTER & SORT (Memoized)
  const filteredTasks = useMemo<Task[]>(() => {
    let result = [...tasks];

    // Filtro per stato
    if (filter === 'pending') {
      result = result.filter((t) => !t.completed);
    } else if (filter === 'completed') {
      result = result.filter((t) => t.completed);
    }

    // Filtro per ricerca
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.text.toLowerCase().includes(q) ||
          (t.category && t.category.toLowerCase().includes(q))
      );
    }

    // Ordinamento
    const priorityWeight: Record<Priority, number> = { alta: 3, media: 2, bassa: 1 };
    result.sort((a, b) => {
      if (sortBy === 'priority-desc') {
        const diff = (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
        if (diff !== 0) return diff;
      }
      if (sortBy === 'date-asc') {
        return a.id - b.id;
      }
      // default: date-desc
      return b.id - a.id;
    });

    return result;
  }, [tasks, filter, searchQuery, sortBy]);

  // Statistiche
  const stats = useMemo<TaskStats>(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, percent };
  }, [tasks]);

  return {
    tasks,
    filteredTasks,
    stats,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    editingTaskId,
    setEditingTaskId,
    animatingDingId,
    statusMessage,
    setStatusMessage,
    recentlyDeleted,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    restoreDeletedTask,
    clearCompleted,
    toggleAll,
    resetDemo,
  };
}
