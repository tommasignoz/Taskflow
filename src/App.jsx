import React, { useState, useEffect } from 'react';
import './App.css';
import { useTaskManager } from './hooks/useTaskManager';
import TopBar from './components/TopBar';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import TaskFilters from './components/TaskFilters';
import StatsBanner from './components/StatsBanner';
import StatusBar from './components/StatusBar';
import { playMechanicalClick, playDingSound } from './utils/soundEffects';

export default function App() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState('classic'); // 'classic' | 'crt-green' | 'crt-amber' | 'cyber-arcade'
  const [scanlines, setScanlines] = useState(true);

  // Hook completo di gestione dello stato CRUD
  const {
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

  // Aggiorna l'attributo tema sul documento HTML
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="min-h-screen p-2 sm:p-4 md:p-6 flex flex-col items-center bg-[var(--bg-desktop)] text-[var(--win-text)] font-['VT323'] text-base sm:text-lg relative select-none">
      {/* Overlay Scanlines CRT retrò */}
      {scanlines && <div className="scanlines-overlay" />}

      {/* Barra di Sistema Superiore */}
      <TopBar
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        theme={theme}
        setTheme={setTheme}
        scanlines={scanlines}
        setScanlines={setScanlines}
        setStatusMessage={setStatusMessage}
      />

      {/* Finestra Principale TaskFlow (Responsive Container) */}
      <main className="win-frame w-full max-w-4xl flex flex-col bg-[var(--win-bg)] shadow-2xl">
        {/* Barra del Titolo Finestra */}
        <div className="win-titlebar px-2 sm:px-3 py-1.5 flex justify-between items-center text-xs sm:text-sm font-['Press_Start_2P']">
          <div className="flex items-center gap-2 truncate">
            <span className="text-base sm:text-lg">💾</span>
            <span className="truncate">TASKFLOW CRUD v2.0 - [Attività]</span>
          </div>

          <div className="flex gap-1 shrink-0">
            <button
              type="button"
              className="retro-btn w-5 h-5 text-xs font-bold"
              title="Riduci a icona"
              onClick={() => playMechanicalClick(soundEnabled)}
            >
              _
            </button>
            <button
              type="button"
              className="retro-btn w-5 h-5 text-xs font-bold"
              title="Ingrandisci"
              onClick={() => playMechanicalClick(soundEnabled)}
            >
              □
            </button>
            <button
              type="button"
              className="retro-btn w-5 h-5 text-xs font-bold hover:bg-[#d11a2a] hover:text-white"
              title="Chiudi"
              onClick={() => {
                playMechanicalClick(soundEnabled);
                alert("TaskFlow non può essere chiuso: continua a completare le tue attività!");
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Menu a barra stile vintage */}
        <nav
          className="flex flex-wrap gap-2 sm:gap-4 px-2 sm:px-3 py-1 border-b border-[var(--win-dark)] bg-[var(--win-bg)] text-sm sm:text-base"
          aria-label="Menu opzioni CRUD"
        >
          <button
            type="button"
            className="hover:bg-[var(--win-title-start)] hover:text-[var(--win-title-text)] px-1 cursor-pointer transition-colors"
            onClick={toggleAll}
          >
            <u>T</u>utti Inverti
          </button>
          <button
            type="button"
            className="hover:bg-[var(--win-title-start)] hover:text-[var(--win-title-text)] px-1 cursor-pointer transition-colors"
            onClick={clearCompleted}
          >
            <u>P</u>ulisci Fatti
          </button>
          <button
            type="button"
            className="hover:bg-[var(--win-title-start)] hover:text-[var(--win-title-text)] px-1 cursor-pointer transition-colors"
            onClick={resetDemo}
          >
            <u>R</u>ipristina Demo
          </button>
          <button
            type="button"
            className="hover:bg-[var(--win-title-start)] hover:text-[var(--win-title-text)] px-1 cursor-pointer transition-colors"
            onClick={() => {
              playDingSound(true);
              setStatusMessage('🔔 *DING!* Suono di test riprodotto con successo!');
            }}
          >
            <u>A</u>scolta DING!
          </button>
        </nav>

        {/* Contenuto Principale della Finestra */}
        <div className="p-2 sm:p-4 flex flex-col gap-3 sm:gap-4 w-full">
          {/* Banner Hero Retrò */}
          <section className="win-sunken p-2.5 sm:p-3 bg-[var(--win-inset-bg)] text-center flex flex-col items-center gap-1">
            <h1 className="font-['Press_Start_2P'] text-lg sm:text-2xl text-[var(--win-title-start)] tracking-wider">
              ★ TASKFLOW CRUD ★
            </h1>
            <p className="text-sm sm:text-lg text-[var(--win-text-muted)] max-w-xl">
              Sistema di gestione attività a 8-bit con supporto completo <b>Create</b>, <b>Read</b>, <b>Update</b> e <b>Delete</b>.
            </p>
            <div className="mt-1 px-2.5 py-1 text-xs sm:text-sm font-bold bg-[#fff8c4] text-[#634a00] border border-[#bfa100] border-dashed">
              🔔 Fai clic sulla spunta [✓] per completare e ascoltare il rumorino DING!
            </div>
          </section>

          {/* Banner Undo / Ripristino Attività Eliminata */}
          {recentlyDeleted && (
            <div className="win-raised p-2 bg-[#fff2cc] border border-[#d6b656] text-[#7f6000] flex justify-between items-center text-xs sm:text-sm animate-fadeIn">
              <span className="truncate">
                🗑️ Eliminata: <b>"{recentlyDeleted.text.slice(0, 30)}..."</b>
              </span>
              <button
                type="button"
                className="retro-btn px-2 py-0.5 font-bold text-xs hover:bg-[#ffe082]"
                onClick={restoreDeletedTask}
              >
                ↩ ANNULLA ELIMINAZIONE
              </button>
            </div>
          )}

          {/* Sezione Statistiche e Progresso */}
          <StatsBanner stats={stats} />

          {/* Form Creazione Attività (CREATE) */}
          <TaskForm onCreateTask={createTask} />

          {/* Barra Filtri, Ricerca e Ordinamento (READ) */}
          <TaskFilters
            filter={filter}
            setFilter={setFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            stats={stats}
            onClearCompleted={clearCompleted}
            onToggleAll={toggleAll}
            soundEnabled={soundEnabled}
          />

          {/* Elenco Attività (READ, UPDATE, DELETE) */}
          <section
            className="flex flex-col gap-2 min-h-[140px] w-full"
            aria-label="Elenco attività TaskFlow"
          >
            {filteredTasks.length === 0 ? (
              <div className="win-sunken p-6 text-center text-[var(--win-text-muted)] bg-[var(--win-inset-bg)]">
                <p className="font-mono text-xs sm:text-sm leading-tight mb-2">
                  [ _____________________________________ ]
                  <br />
                  |  NESSUNA ATTIVITÀ CORRISPONDENTE     |
                  <br />
                  [ _____________________________________ ]
                </p>
                <p className="text-sm sm:text-base">
                  {searchQuery
                    ? `Nessun risultato trovato per "${searchQuery}". Prova un'altra ricerca!`
                    : 'Nessuna attività in questo filtro. Scrivine una nuova in alto!'}
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isEditing={editingTaskId === task.id}
                  isDingAnimating={animatingDingId === task.id}
                  onToggle={toggleTask}
                  onStartEdit={(id) => setEditingTaskId(id)}
                  onSaveEdit={updateTask}
                  onCancelEdit={() => setEditingTaskId(null)}
                  onDelete={deleteTask}
                  soundEnabled={soundEnabled}
                />
              ))
            )}
          </section>
        </div>

        {/* Barra di Stato Retrò a Piè di Pagina */}
        <StatusBar statusMessage={statusMessage} stats={stats} />
      </main>
    </div>
  );
}
