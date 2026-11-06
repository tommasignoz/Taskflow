import React from 'react';

export default function StatsBanner({ stats }) {
  return (
    <section className="win-sunken p-2.5 sm:p-3 bg-[var(--win-inset-bg)] flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center text-xs sm:text-sm font-['Press_Start_2P']">
        <span>STATO PRODUTTIVITÀ:</span>
        <span className="text-[var(--win-title-start)]">{stats.percent}% COMPLETATO</span>
      </div>

      {/* Barra di Progresso */}
      <div
        className="h-4 sm:h-5 win-sunken bg-[var(--win-bg)] overflow-hidden relative"
        role="progressbar"
        aria-valuenow={stats.percent}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          className="progress-fill"
          style={{ width: `${stats.percent}%` }}
        />
      </div>

      {/* Contatori Retrò */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm sm:text-base font-['VT323']">
        <span className="win-raised px-2 py-0.5 bg-[var(--win-bg)] border border-[var(--win-dark)]">
          Totali: <b>{stats.total}</b>
        </span>
        <span className="win-raised px-2 py-0.5 bg-[var(--win-bg)] border border-[var(--win-dark)]">
          Da fare: <b>{stats.pending}</b>
        </span>
        <span className="win-raised px-2 py-0.5 bg-[var(--win-bg)] border border-[var(--win-dark)]">
          Completati: <b>{stats.completed}</b>
        </span>
        <span className="win-raised px-2 py-0.5 bg-[var(--win-bg)] border border-[var(--win-dark)] ml-auto hidden sm:inline-block">
          Unità: <b>A:\TASKS.DAT [CRUD ACTIVE]</b>
        </span>
      </div>
    </section>
  );
}
