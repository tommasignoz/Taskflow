import React, { useState, useRef } from 'react';

export default function TaskForm({ onCreateTask }) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('media');
  const [category, setCategory] = useState('Generale');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) {
      if (inputRef.current) inputRef.current.focus();
      return;
    }

    const success = onCreateTask(text, priority, category);
    if (success) {
      setText('');
      if (inputRef.current) inputRef.current.focus();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="win-raised p-2.5 sm:p-3 bg-[var(--win-bg)] flex flex-col gap-2 w-full"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm sm:text-base font-bold gap-1">
        <label htmlFor="task-input-field" className="cursor-pointer">
          &gt; CREA ATTIVITÀ [C in CRUD]:
        </label>
        <span className="text-xs sm:text-sm text-[var(--win-text-muted)] font-normal">
          [Premi INVIO per registrare nel disco]
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full">
        {/* Campo Testo Principale */}
        <input
          ref={inputRef}
          id="task-input-field"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Scrivi qui la nuova attività..."
          className="retro-input-field flex-1 px-3 py-1.5 text-lg sm:text-xl w-full"
          autoComplete="off"
        />

        {/* Gruppo Selettori e Pulsante */}
        <div className="flex gap-2 w-full sm:w-auto">
          {/* Selettore Priorità */}
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="win-sunken px-2 py-1.5 text-base sm:text-lg bg-[var(--win-bg)] text-[var(--win-text)] font-['VT323'] cursor-pointer outline-none flex-1 sm:flex-none"
            title="Seleziona priorità"
          >
            <option value="alta">⚡ Alta</option>
            <option value="media">● Media</option>
            <option value="bassa">○ Bassa</option>
          </select>

          {/* Selettore Categoria */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="win-sunken px-2 py-1.5 text-base sm:text-lg bg-[var(--win-bg)] text-[var(--win-text)] font-['VT323'] cursor-pointer outline-none flex-1 sm:flex-none"
            title="Seleziona categoria"
          >
            <option value="Generale">📁 Generale</option>
            <option value="Lavoro">💼 Lavoro</option>
            <option value="Studio">📚 Studio</option>
            <option value="Sistema">💾 Sistema</option>
          </select>

          {/* Pulsante Aggiungi */}
          <button
            type="submit"
            className="retro-btn px-3 sm:px-4 py-1.5 font-['Press_Start_2P'] text-[10px] sm:text-xs whitespace-nowrap bg-[var(--win-bg)] hover:bg-[#d8d8d8]"
          >
            + AGGIUNGI
          </button>
        </div>
      </div>
    </form>
  );
}
