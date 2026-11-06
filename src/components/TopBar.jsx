import React from 'react';
import { playMechanicalClick, playDingSound } from '../utils/soundEffects';

export default function TopBar({
  soundEnabled,
  setSoundEnabled,
  theme,
  setTheme,
  scanlines,
  setScanlines,
  setStatusMessage,
}) {
  const handleTestDing = () => {
    playDingSound(true);
    setStatusMessage('🔔 *DING!* Suono di prova riprodotto!');
  };

  return (
    <header className="win-raised w-full max-w-4xl p-2 sm:p-3 mb-3 flex flex-col md:flex-row justify-between items-center gap-2 bg-[var(--win-bg)] text-[var(--win-text)]">
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
        <span className="win-raised px-2 py-1 text-xs font-['Press_Start_2P'] bg-[var(--win-title-start)] text-[var(--win-title-text)] tracking-wider">
          💾 TASKFLOW OS
        </span>
        <span className="text-sm sm:text-base font-['VT323'] text-[var(--win-text-muted)]">
          CRUD v2.0 (1995-2026)
        </span>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center w-full md:w-auto">
        {/* Test Suono DING */}
        <button
          type="button"
          className="retro-btn px-2 sm:px-3 py-1 text-sm sm:text-base"
          onClick={handleTestDing}
          title="Ascolta il rumorino tipo ding"
        >
          🔔 Prova DING!
        </button>

        {/* Toggle Suono */}
        <button
          type="button"
          className="retro-btn px-2 sm:px-3 py-1 text-sm sm:text-base"
          onClick={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            if (next) playDingSound(true);
            setStatusMessage(next ? 'Audio attivato' : 'Audio disattivato');
          }}
        >
          {soundEnabled ? '🔊 Audio: ON' : '🔇 Audio: OFF'}
        </button>

        {/* Selettore Tema */}
        <select
          className="win-sunken px-2 py-1 text-sm sm:text-base bg-[var(--win-bg)] text-[var(--win-text)] font-['VT323'] cursor-pointer outline-none"
          value={theme}
          onChange={(e) => {
            setTheme(e.target.value);
            playMechanicalClick(soundEnabled);
          }}
          aria-label="Seleziona tema retro"
        >
          <option value="classic">🖥️ Win95 Teal</option>
          <option value="crt-green">🟢 CRT Fosfori Verdi</option>
          <option value="crt-amber">🟠 Terminale Ambra</option>
          <option value="cyber-arcade">🟣 Cyber Arcade 80s</option>
        </select>

        {/* Toggle Scanlines */}
        <button
          type="button"
          className="retro-btn px-2 sm:px-3 py-1 text-sm sm:text-base"
          onClick={() => {
            setScanlines(!scanlines);
            playMechanicalClick(soundEnabled);
          }}
        >
          {scanlines ? '📺 CRT: ON' : '📺 CRT: OFF'}
        </button>
      </div>
    </header>
  );
}
