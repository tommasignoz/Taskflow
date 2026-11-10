import * as React from 'react';
import { Undo2, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Task } from '@/types/task';

interface UndoBannerProps {
  deletedTask: Task | null;
  onRestore: () => void;
  onDismiss: () => void;
}

export function UndoBanner({
  deletedTask,
  onRestore,
  onDismiss,
}: UndoBannerProps) {
  if (!deletedTask) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-12 right-4 z-50 flex max-w-md items-center justify-between gap-3 rounded-xl border bg-card/95 p-3.5 text-card-foreground shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <div className="flex items-center gap-2.5 overflow-hidden">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
          <Trash2 className="size-3.5" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-xs font-medium text-foreground">
            Attività eliminata
          </span>
          <span className="truncate text-xs text-muted-foreground max-w-[200px]">
            "{deletedTask.text}"
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <Button
          variant="secondary"
          size="sm"
          className="h-7 text-xs font-medium gap-1"
          onClick={onRestore}
        >
          <Undo2 data-icon="inline-start" className="size-3" />
          <span>Annulla</span>
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onDismiss}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Ignora notifica"
        >
          <X className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
