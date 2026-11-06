import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  playDingSound,
  playUndingSound,
  playAddSound,
  playDeleteSound,
  playEditSound,
} from '../utils/soundEffects';

const STORAGE_KEY = 'taskflow_crud_tasks';

export const INITIAL_TASKS = [
  {
    id: 1,
    text: "Clicca la spunta qui a sinistra per sentire il DING!",
    completed: false,
    priority: "alta",
    createdAt: "18:30",
    category: "Audio",
  },
  {
    id: 2,
    text: "Scrivi una nuova attività nel riquadro e premi Invio o Aggiungi",
    completed: false,
    priority: "media",
    createdAt: "18:32",
    category: "Lavoro",
  },
  {
    id: 3,
    text: "Prova a modificare questa attività cliccando il tasto [Modifica]",
    completed: false,
    priority: "alta",
    createdAt: "18:35",
    category: "CRUD",
  },
  {
    id: 4,
    text: "Inserire floppy disk da 3.5 pollici nel drive A:",
    completed: true,
    priority: "bassa",
    createdAt: "18:20",
    category: "Sistema",
  },
  {
    id: 5,
    text: "Configurare memoria estesa MS-DOS 6.22 (HIMEM.SYS)",
    completed: true,
    priority: "media",
    createdAt: "18:25",
    category: "Sistema",
  },
];

/**
 * Hook personalizzato per la gestione completa dello stato CRUD di TaskFlow
 */
export function useTaskManager(soundEnabled = true) {
  // Caricamento iniziale sicuro da localStorage
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Errore lettura localStorage:", e);
    }
    return INITIAL_TASKS;
  });

  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc' | 'date-asc' | 'priority-desc'
  const [animatingDingId, setAnimatingDingId] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('PRONTO • Fai clic sulla spunta per il DING!');
  const [recentlyDeleted, setRecentlyDeleted] = useState(null);

  // Sincronizzazione persistente in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.warn("Errore scrittura localStorage:", e);
    }
  }, [tasks]);

  // CREATE (Aggiunta)
  const createTask = useCallback((text, priority = 'media', category = 'Generale') => {
    const trimmed = text.trim();
    if (!trimmed) return false;

    const newTask = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      text: trimmed,
      completed: false,
      priority,
      category,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setTasks((prev) => [newTask, ...prev]);
    playAddSound(soundEnabled);
    setStatusMessage(`[CREATE] Nuova attività aggiunta: "${trimmed.slice(0, 24)}..."`);
    return true;
  }, [soundEnabled]);

  // UPDATE (Modifica campi testo, priorità, categoria)
  const updateTask = useCallback((id, updates) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const updated = { ...task, ...updates };
          return updated;
        }
        return task;
      })
    );
    setEditingTaskId(null);
    playEditSound(soundEnabled);
    setStatusMessage(`[UPDATE] Attività #${id} aggiornata con successo!`);
  }, [soundEnabled]);

  // UPDATE - TOGGLE SPUNTA (Con suono Ding ed effetto elastico)
  const toggleTask = useCallback((id) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const nextCompleted = !task.completed;

          if (nextCompleted) {
            playDingSound(soundEnabled);
            setStatusMessage('🔔 DING! Attività completata con successo!');
          } else {
            playUndingSound(soundEnabled);
            setStatusMessage('Attività reimpostata come in corso.');
          }

          // Effetto animazione DING
          setAnimatingDingId(id);
          setTimeout(() => {
            setAnimatingDingId((curr) => (curr === id ? null : curr));
          }, 500);

          return { ...task, completed: nextCompleted };
        }
        return task;
      })
    );
  }, [soundEnabled]);

  // DELETE (Eliminazione singola attività con possibilità di Undo)
  const deleteTask = useCallback((id) => {
    const taskToDelete = tasks.find((t) => t.id === id);
    if (!taskToDelete) return;

    setTasks((prev) => prev.filter((t) => t.id !== id));
    setRecentlyDeleted(taskToDelete);
    playDeleteSound(soundEnabled);
    setStatusMessage(`[DELETE] Attività eliminata. Clicca "Annulla" per ripristinare.`);
  }, [tasks, soundEnabled]);

  // RESTORE (Annulla ultima eliminazione)
  const restoreDeletedTask = useCallback(() => {
    if (!recentlyDeleted) return;
    setTasks((prev) => [recentlyDeleted, ...prev]);
    playAddSound(soundEnabled);
    setStatusMessage(`[RESTORE] Attività ripristinata: "${recentlyDeleted.text.slice(0, 20)}..."`);
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
    setStatusMessage(`[DELETE] Eliminate ${completedCount} attività completate`);
  }, [tasks, soundEnabled]);

  // TOGGLE ALL (Segna tutti come completati o da fare)
  const toggleAll = useCallback(() => {
    const allDone = tasks.every((t) => t.completed);
    setTasks((prev) => prev.map((t) => ({ ...t, completed: !allDone })));
    if (!allDone) {
      playDingSound(soundEnabled);
      setStatusMessage('🔔 DING! Tutte le attività contrassegnate come completate!');
    } else {
      playUndingSound(soundEnabled);
      setStatusMessage('Tutte le attività riaperte.');
    }
  }, [tasks, soundEnabled]);

  // RESET DEMO
  const resetDemo = useCallback(() => {
    setTasks(INITIAL_TASKS);
    playAddSound(soundEnabled);
    setStatusMessage('Dati demo ripristinati con successo');
  }, [soundEnabled]);

  // READ & FILTER & SORT (Memoized)
  const filteredTasks = useMemo(() => {
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
    const priorityWeight = { alta: 3, media: 2, bassa: 1 };
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

  // Statistiche calcolate
  const stats = useMemo(() => {
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
