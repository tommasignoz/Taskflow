import React, { useState, useEffect } from 'react';

export default function StatusBar({ statusMessage, stats }) {
  const [currentTime, setCurrentTime] = useState(() => new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="w-full mt-2 grid grid-cols-1 md:grid-cols-[1.5fr_1fr_120px] gap-1 p-1 bg-[var(--win-bg)] border-t border-[var(--win-dark)] text-xs sm:text-sm font-['VT323']">
      <div className="win-sunken px-2 py-0.5 truncate bg-[var(--win-bg)]">
        {statusMessage}
      </div>
      <div className="win-sunken px-2 py-0.5 truncate bg-[var(--win-bg)] hidden sm:block">
        Stato: {stats.completed}/{stats.total} completati ({stats.percent}%)
      </div>
      <div className="win-sunken px-2 py-0.5 text-center bg-[var(--win-bg)]">
        🕒 {currentTime}
      </div>
    </footer>
  );
}
