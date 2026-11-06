import React from 'react';
import { playMechanicalClick } from '../utils/soundEffects';

export default function TaskFilters({
  filter,
  setFilter,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  stats,
  onClearCompleted,
  onToggleAll,
  soundEnabled,
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Riga Ricerca e Ordinamento */}
      <div className="flex flex-col sm:flex-row gap-2 justify-between items-center w-full">
        {/* Ricerca in tempo reale */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto flex-1">
          <span className="text-sm sm:text-base font-bold whitespace-nowrap">
            🔍 CERCA:
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtra per parola chiave o categoria..."
            className="retro-input-field px-2 py-1 text-sm sm:text-base flex-1 w-full"
          />
          {searchQuery && (
            <button
              type="button"
              className="retro-btn px-2 py-1 text-xs"
              onClick={() => setSearchQuery('')}
              title="Pulisci ricerca"
            >
              ✕
            </button>
          )}
        </div>

        {/* Ordinamento */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
          <span className="text-xs sm:text-sm text-[var(--win-text-muted)] whitespace-nowrap">
            ORDINA:
          </span>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              playMechanicalClick(soundEnabled);
            }}
            className="win-sunken px-2 py-1 text-xs sm:text-sm bg-[var(--win-bg)] text-[var(--win-text)] font-['VT323'] cursor-pointer outline-none w-full sm:w-auto"
          >
            <option value="date-desc">🕒 Più recenti prima</option>
            <option value="date-asc">⏳ Più vecchi prima</option>
            <option value="priority-desc">⚡ Per Priorità (Alta prima)</option>
          </select>
        </div>
      </div>

      {/* Tabs di Stato e Azioni Rapide */}
      <div className="flex flex-wrap justify-between items-center gap-2 pt-1 border-t border-[var(--win-dark)]">
        {/* Tab Filtri */}
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            className={`retro-btn px-2.5 sm:px-3 py-1 text-sm sm:text-base ${
              filter === 'all' ? 'win-sunken font-bold bg-[var(--win-inset-bg)]' : ''
            }`}
            onClick={() => {
              setFilter('all');
              playMechanicalClick(soundEnabled);
            }}
          >
            Tutti ({stats.total})
          </button>
          <button
            type="button"
            className={`retro-btn px-2.5 sm:px-3 py-1 text-sm sm:text-base ${
              filter === 'pending' ? 'win-sunken font-bold bg-[var(--win-inset-bg)]' : ''
            }`}
            onClick={() => {
              setFilter('pending');
              playMechanicalClick(soundEnabled);
            }}
          >
            Da fare ({stats.pending})
          </button>
          <button
            type="button"
            className={`retro-btn px-2.5 sm:px-3 py-1 text-sm sm:text-base ${
              filter === 'completed' ? 'win-sunken font-bold bg-[var(--win-inset-bg)]' : ''
            }`}
            onClick={() => {
              setFilter('completed');
              playMechanicalClick(soundEnabled);
            }}
          >
            Completati ({stats.completed})
          </button>
        </div>

        {/* Azioni Rapide */}
        <div className="flex gap-1.5 flex-wrap">
          <button
            type="button"
            className="retro-btn px-2 sm:px-2.5 py-1 text-xs sm:text-sm"
            onClick={onToggleAll}
            title="Inverti stato di tutte le attività"
          >
            Tutti ✓/◻
          </button>
          {stats.completed > 0 && (
            <button
              type="button"
              className="retro-btn px-2 sm:px-2.5 py-1 text-xs sm:text-sm text-[#990000] hover:bg-[#ffe6e6]"
              onClick={onClearCompleted}
              title="Elimina tutte le attività completate"
            >
              Pulisci Fatti ({stats.completed})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
