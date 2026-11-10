import * as React from 'react';
import { Database, Clock } from 'lucide-react';
import type { TaskStats } from '@/types/task';

interface StatusBarProps {
  statusMessage: string;
  stats: TaskStats;
}

export function StatusBar({ statusMessage, stats }: StatusBarProps) {
  const [currentTime, setCurrentTime] = React.useState(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="flex h-8 w-full items-center justify-between border-t bg-card/60 px-4 text-[11px] text-muted-foreground backdrop-blur-xs select-none">
      {/* Left: Status Message */}
      <div className="flex items-center gap-2 truncate">
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
        </span>
        <span className="truncate max-w-sm sm:max-w-md font-mono">{statusMessage}</span>
      </div>

      {/* Right: Stats & Real-time Clock */}
      <div className="flex items-center gap-4 shrink-0 font-mono">
        <span className="hidden sm:inline-flex items-center gap-1.5">
          <Database className="size-3 text-muted-foreground/70" />
          <span>
            {stats.completed}/{stats.total} completati ({stats.percent}%)
          </span>
        </span>
        <span className="flex items-center gap-1">
          <Clock className="size-3 text-muted-foreground/70" />
          <span>{currentTime}</span>
        </span>
      </div>
    </footer>
  );
}
