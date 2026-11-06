import React, { useState, useEffect, useRef } from 'react';
import { playMechanicalClick } from '../utils/soundEffects';

function TaskEditForm({ task, onSave, onCancel, soundEnabled }) {
  const [editText, setEditText] = useState(task.text);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editCategory, setEditCategory] = useState(task.category || 'Generale');
  const editInputRef = useRef(null);

  useEffect(() => {
    if (editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, []);

  const handleSave = (e) => {
    if (e) e.preventDefault();
    const trimmed = editText.trim();
    if (!trimmed) return;
    onSave(task.id, {
      text: trimmed,
      priority: editPriority,
      category: editCategory,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave(e);
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full animate-fadeIn">
      <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-[var(--accent-color)]">
        <span>✏️ MODIFICA ATTIVITÀ #{task.id}</span>
        <span className="text-xs text-[var(--win-text-muted)] font-normal">
          [Invio per Salvare, Esc per Annullare]
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <input
          ref={editInputRef}
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="retro-input-field flex-1 px-3 py-1.5 text-base sm:text-lg w-full"
          placeholder="Modifica testo..."
        />

        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value)}
            className="win-sunken px-2 py-1 text-base bg-[var(--win-bg)] text-[var(--win-text)] font-['VT323'] cursor-pointer outline-none flex-1 sm:flex-none"
          >
            <option value="alta">⚡ Alta</option>
            <option value="media">● Media</option>
            <option value="bassa">○ Bassa</option>
          </select>

          <select
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
            className="win-sunken px-2 py-1 text-base bg-[var(--win-bg)] text-[var(--win-text)] font-['VT323'] cursor-pointer outline-none flex-1 sm:flex-none"
          >
            <option value="Generale">📁 Generale</option>
            <option value="Lavoro">💼 Lavoro</option>
            <option value="Studio">📚 Studio</option>
            <option value="Sistema">💾 Sistema</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-1">
        <button
          type="button"
          className="retro-btn px-3 py-1 text-sm bg-[#d4ffd6] hover:bg-[#bbf7be] text-[#006611] font-bold"
          onClick={handleSave}
        >
          ✔ SALVA MODIFICHE
        </button>
        <button
          type="button"
          className="retro-btn px-3 py-1 text-sm text-[var(--win-text)] hover:bg-[#e0e0e0]"
          onClick={() => {
            playMechanicalClick(soundEnabled);
            onCancel();
          }}
        >
          ✕ ANNULLA
        </button>
      </div>
    </div>
  );
}

export default function TaskItem({
  task,
  isEditing,
  isDingAnimating,
  onToggle,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  soundEnabled,
}) {
  const priorityStyles = {
    alta: 'bg-[#ffd6d6] text-[#990000] border-[#cc0000]',
    media: 'bg-[#fff2cc] text-[#7f6000] border-[#bf9000]',
    bassa: 'bg-[#e2f0d9] text-[#385723] border-[#548235]',
  };

  return (
    <article
      className={`win-sunken p-2.5 sm:p-3 transition-colors duration-150 relative ${
        task.completed
          ? 'bg-[var(--task-done-bg)] opacity-90'
          : 'bg-[var(--win-inset-bg)] hover:bg-[#f7f7f7]'
      }`}
    >
      {isEditing ? (
        /* VISTA MODIFICA (UPDATE IN CRUD) */
        <TaskEditForm
          task={task}
          onSave={onSaveEdit}
          onCancel={onCancelEdit}
          soundEnabled={soundEnabled}
        />
      ) : (
        /* VISTA NORMALE (READ + TOGGLE + DELETE) */
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-4 w-full">
          {/* Checkbox e Testo */}
          <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0 w-full sm:w-auto">
            {/* SPUNTA CLICCABILE CON DING ED EFFETTO ELASTICO */}
            <div className="relative shrink-0 pt-0.5 sm:pt-0">
              <button
                type="button"
                role="checkbox"
                aria-checked={task.completed}
                className={`retro-checkbox ${task.completed ? 'checked' : ''} ${
                  isDingAnimating ? 'ding-active' : ''
                }`}
                onClick={() => onToggle(task.id)}
                title={task.completed ? "Segna come non completata" : "Completa e ascolta il DING!"}
              >
                {task.completed ? '✔' : ''}
              </button>

              {/* Scintilla fluttuante "DING!" quando cliccata */}
              {isDingAnimating && (
                <span className="ding-sparkle">
                  {task.completed ? '🔔 DING!' : '✦'}
                </span>
              )}
            </div>

            {/* Testo e Metadati dell'Attività */}
            <div
              className="flex-1 min-w-0 cursor-pointer"
              onClick={() => onToggle(task.id)}
            >
              <p
                className={`text-lg sm:text-xl leading-snug break-words transition-all duration-150 ${
                  task.completed
                    ? 'line-through text-[var(--win-text-muted)]'
                    : 'text-[var(--win-text)]'
                }`}
              >
                {task.text}
              </p>

              {/* Badge e Dettagli */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1 text-xs sm:text-sm font-['VT323']">
                {/* Badge Priorità */}
                <span
                  className={`px-1.5 py-0.2 border text-xs sm:text-sm ${
                    priorityStyles[task.priority] || priorityStyles.media
                  }`}
                >
                  {task.priority === 'alta'
                    ? '⚡ Alta'
                    : task.priority === 'media'
                    ? '● Media'
                    : '○ Bassa'}
                </span>

                {/* Badge Categoria */}
                <span className="px-1.5 py-0.2 border border-[var(--win-dark)] bg-[var(--win-bg)] text-[var(--win-text)] text-xs sm:text-sm">
                  {task.category || 'Generale'}
                </span>

                {/* Orario */}
                <span className="text-[var(--win-text-muted)]">
                  ore {task.createdAt}
                </span>

                {/* Tag Stato */}
                <span
                  className={`px-1 font-['Press_Start_2P'] text-[8px] sm:text-[9px] border ${
                    task.completed
                      ? 'border-[#007711] text-[#007711]'
                      : 'border-[var(--win-title-start)] text-[var(--win-title-start)]'
                  }`}
                >
                  {task.completed ? '[FATTO ✓]' : '[IN CORSO]'}
                </span>
              </div>
            </div>
          </div>

          {/* Pulsanti Azione (MODIFICA & ELIMINA) */}
          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
            {/* Tasto Modifica (UPDATE) */}
            <button
              type="button"
              className="retro-btn px-2 sm:px-2.5 py-1 text-xs sm:text-sm gap-1 hover:bg-[#e0e8ff]"
              onClick={(e) => {
                e.stopPropagation();
                playMechanicalClick(soundEnabled);
                onStartEdit(task.id);
              }}
              title="Modifica attività"
            >
              ✏️ <span className="hidden sm:inline">Modifica</span>
            </button>

            {/* Tasto Elimina (DELETE) */}
            <button
              type="button"
              className="retro-btn px-2.5 py-1 text-sm sm:text-base hover:bg-[#ff4d4d] hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              title="Elimina attività dal registro"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
