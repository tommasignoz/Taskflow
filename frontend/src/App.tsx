import * as React from 'react';
import { useTaskManager } from './hooks/useTaskManager';
import { Sidebar } from './components/dashboard/Sidebar';
import { TopBar } from './components/dashboard/TopBar';
import { StatsOverview } from './components/dashboard/StatsOverview';
import { TaskToolbar } from './components/dashboard/TaskToolbar';
import { TaskViews } from './components/dashboard/TaskViews';
import { CreateTaskDialog } from './components/dashboard/CreateTaskDialog';
import { EditTaskDialog } from './components/dashboard/EditTaskDialog';
import { UndoBanner } from './components/dashboard/UndoBanner';
import { StatusBar } from './components/dashboard/StatusBar';
import { playDingSound } from './utils/soundEffects';
import { authClient } from './lib/auth-client';
import type { Task } from './types/task';

export default function App() {
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  const [currentView, setCurrentView] = React.useState<'kanban' | 'table' | 'database' | 'auth'>('kanban');

  // Monitoraggio sessione Better Auth in tempo reale
  const { data: session } = authClient.useSession();

  // Filtri aggiuntivi per la toolbar
  const [selectedPriority, setSelectedPriority] = React.useState<string>('all');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  // Stato Modali
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  // Dark Mode support
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Hook originale che preserva 100% dello stato CRUD, logica e persistenza
  const {
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
  } = useTaskManager(soundEnabled);

  // Sincronizza dark mode con l'elemento html
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Task attualmente in fase di modifica (se presente)
  const taskToEdit = React.useMemo<Task | null>(() => {
    if (!editingTaskId) return null;
    return tasks.find((t) => t.id === editingTaskId) || null;
  }, [tasks, editingTaskId]);

  // Categorie univoche presenti nei task
  const categories = React.useMemo<string[]>(() => {
    const set = new Set<string>(['Generale', 'Lavoro', 'Studio', 'Sistema']);
    tasks.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set);
  }, [tasks]);

  // Ulteriore rifinitura dei task filtrati con priorità e categoria
  const finalFilteredTasks = React.useMemo<Task[]>(() => {
    return filteredTasks.filter((t) => {
      if (selectedPriority !== 'all' && t.priority !== selectedPriority) {
        return false;
      }
      if (selectedCategory !== 'all' && t.category !== selectedCategory) {
        return false;
      }
      return true;
    });
  }, [filteredTasks, selectedPriority, selectedCategory]);

  const handleTestDing = () => {
    playDingSound(true);
    setStatusMessage('🔔 Suono di test DING! riprodotto con successo');
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* 1. Sidebar Collassabile */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        currentView={currentView}
        onSelectView={setCurrentView}
        activeFilter={filter}
        onSelectFilter={setFilter}
        stats={stats}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          const next = !soundEnabled;
          setSoundEnabled(next);
          if (next) playDingSound(true);
          setStatusMessage(next ? 'Audio attivato' : 'Audio disattivato');
        }}
        onTestDing={handleTestDing}
        currentUser={session?.user || null}
      />

      {/* 2. Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* TopBar */}
        <TopBar
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenCreateDialog={() => setIsCreateOpen(true)}
          onTestDing={handleTestDing}
          onToggleAll={toggleAll}
          onClearCompleted={clearCompleted}
          onResetDemo={resetDemo}
          hasCompletedTasks={stats.completed > 0}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
          currentUser={session?.user || null}
          onOpenAuth={() => setCurrentView('auth')}
        />

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 md:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-5">
            {/* KPI Cards / Metriche (nascoste durante la schermata auth per non ingombrare) */}
            {currentView !== 'auth' && <StatsOverview stats={stats} />}

            {/* Toolbar: Filtri, Categorie, Ricerca, Ordinamento */}
            {currentView !== 'database' && currentView !== 'auth' && (
              <TaskToolbar
                filter={filter}
                onFilterChange={setFilter}
                sortBy={sortBy}
                onSortChange={setSortBy}
                selectedPriority={selectedPriority}
                onPriorityFilterChange={setSelectedPriority}
                selectedCategory={selectedCategory}
                onCategoryFilterChange={setSelectedCategory}
                categories={categories}
                stats={stats}
                onClearCompleted={clearCompleted}
              />
            )}

            {/* Central Area: Kanban, Tabella e Database con Tabs */}
            <TaskViews
              currentView={currentView}
              onSelectView={setCurrentView}
              tasks={finalFilteredTasks}
              animatingDingId={animatingDingId}
              onToggleTask={toggleTask}
              onStartEdit={(id) => setEditingTaskId(id)}
              onDeleteTask={deleteTask}
              onOpenCreateDialog={() => setIsCreateOpen(true)}
              onRefreshTasks={resetDemo}
            />
          </div>
        </main>

        {/* Bottom Status Bar */}
        <StatusBar statusMessage={statusMessage} stats={stats} />
      </div>

      {/* Dialog Creazione Task */}
      <CreateTaskDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreateTask={createTask}
      />

      {/* Dialog Modifica Task */}
      <EditTaskDialog
        task={taskToEdit}
        open={Boolean(editingTaskId)}
        onOpenChange={(open) => {
          if (!open) setEditingTaskId(null);
        }}
        onSaveEdit={updateTask}
      />

      {/* Undo Notification Banner */}
      <UndoBanner
        deletedTask={recentlyDeleted}
        onRestore={restoreDeletedTask}
        onDismiss={() => {
          // Mantieni eliminato senza notifica
        }}
      />
    </div>
  );
}
