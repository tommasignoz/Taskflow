import * as React from 'react';
import {
  CheckCircle2,
  Circle,
  MoreVertical,
  Pencil,
  Trash2,
  Clock,
  Plus,
  Folder,
} from 'lucide-react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { Task, Priority } from '@/types/task';

interface KanbanViewProps {
  tasks: Task[];
  animatingDingId: number | null;
  onToggleTask: (id: number) => void;
  onStartEdit: (id: number) => void;
  onDeleteTask: (id: number) => void;
  onOpenCreateDialog: () => void;
}

function PriorityBadge({ priority }: { priority: Priority }) {
  if (priority === 'alta') {
    return (
      <Badge
        variant="destructive"
        className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5"
      >
        ⚡ Alta
      </Badge>
    );
  }
  if (priority === 'media') {
    return (
      <Badge
        variant="secondary"
        className="text-[10px] font-medium bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20 px-2 py-0.5"
      >
        ● Media
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="text-[10px] font-normal text-muted-foreground px-2 py-0.5"
    >
      ○ Bassa
    </Badge>
  );
}

function KanbanCard({
  task,
  isDingAnimating,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: Task;
  isDingAnimating: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card
      size="sm"
      className={cn(
        'group relative border bg-card transition-all duration-200 hover:shadow-xs',
        task.completed
          ? 'border-muted bg-muted/30 opacity-90'
          : 'hover:border-foreground/20',
        isDingAnimating && 'ding-pulse ring-2 ring-emerald-500/40 bg-emerald-500/5'
      )}
    >
      <CardContent className="p-3.5 flex flex-col gap-2.5">
        {/* Top: Checkbox, Text, Actions */}
        <div className="flex items-start justify-between gap-2">
          {/* Interactive Toggle Checkbox */}
          <button
            type="button"
            role="checkbox"
            aria-checked={task.completed}
            onClick={onToggle}
            className={cn(
              'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              task.completed
                ? 'border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500'
                : 'border-muted-foreground/40 bg-background hover:border-foreground'
            )}
            title={task.completed ? 'Segna come da fare' : 'Completa task'}
          >
            {task.completed ? (
              <CheckCircle2 className="size-3.5 stroke-[2.5]" />
            ) : (
              <Circle className="size-3 text-transparent" />
            )}
          </button>

          {/* Task Title */}
          <div
            className="flex-1 cursor-pointer select-none"
            onClick={onToggle}
          >
            <p
              className={cn(
                'text-sm leading-snug font-normal text-foreground transition-all break-words',
                task.completed && 'line-through text-muted-foreground/80'
              )}
            >
              {task.text}
            </p>
          </div>

          {/* Card Context Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                aria-label="Opzioni attività"
              >
                <MoreVertical className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={onEdit}>
                  <Pencil data-icon="inline-start" className="size-3.5" />
                  <span>Modifica</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onToggle}>
                  <CheckCircle2 data-icon="inline-start" className="size-3.5" />
                  <span>{task.completed ? 'Riapri task' : 'Completa'}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <Trash2 data-icon="inline-start" className="size-3.5" />
                  <span>Elimina</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Bottom Metadata: Priority, Category, Timestamp */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 border-t border-muted/50 text-[11px]">
          <div className="flex items-center gap-1.5">
            <PriorityBadge priority={task.priority} />
            <Badge variant="secondary" className="text-[10px] h-4.5 px-1.5 font-normal text-muted-foreground">
              <Folder className="size-2.5 mr-1 text-muted-foreground/70" />
              {task.category || 'Generale'}
            </Badge>
          </div>

          <div className="flex items-center gap-1 text-muted-foreground font-mono text-[10px]">
            <Clock className="size-2.5" />
            <span>{task.createdAt}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function KanbanView({
  tasks,
  animatingDingId,
  onToggleTask,
  onStartEdit,
  onDeleteTask,
  onOpenCreateDialog,
}: KanbanViewProps) {
  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
      {/* Column 1: Da Fare (To Do / In Progress) */}
      <div className="flex flex-col gap-3 rounded-xl border bg-muted/20 p-3 sm:p-4 min-h-[420px]">
        {/* Column Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              Da Completare
            </h3>
            <Badge variant="secondary" className="text-xs h-5 px-1.5 font-mono">
              {pendingTasks.length}
            </Badge>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-muted-foreground hover:text-foreground"
            onClick={onOpenCreateDialog}
          >
            <Plus data-icon="inline-start" className="size-3" />
            <span>Aggiungi</span>
          </Button>
        </div>

        {/* Task Cards Stack */}
        <div className="flex flex-col gap-2.5">
          {pendingTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center bg-card/40">
              <CheckCircle2 className="size-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm font-medium text-foreground">Tutto completato!</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Nessuna attività in sospeso. Crea un nuovo task per cominciare.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 text-xs"
                onClick={onOpenCreateDialog}
              >
                <Plus data-icon="inline-start" className="size-3" />
                Crea Attività
              </Button>
            </div>
          ) : (
            pendingTasks.map((task) => (
              <KanbanCard
                key={task.id}
                task={task}
                isDingAnimating={animatingDingId === task.id}
                onToggle={() => onToggleTask(task.id)}
                onEdit={() => onStartEdit(task.id)}
                onDelete={() => onDeleteTask(task.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Column 2: Completate (Done) */}
      <div className="flex flex-col gap-3 rounded-xl border bg-muted/20 p-3 sm:p-4 min-h-[420px]">
        {/* Column Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-emerald-500" />
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              Completate
            </h3>
            <Badge variant="secondary" className="text-xs h-5 px-1.5 font-mono">
              {completedTasks.length}
            </Badge>
          </div>
        </div>

        {/* Task Cards Stack */}
        <div className="flex flex-col gap-2.5">
          {completedTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center bg-card/40">
              <Circle className="size-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm font-medium text-foreground">Nessuna attività completata</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Spunta le attività da fare per vederle apparire qui con il feedback sonoro.
              </p>
            </div>
          ) : (
            completedTasks.map((task) => (
              <KanbanCard
                key={task.id}
                task={task}
                isDingAnimating={animatingDingId === task.id}
                onToggle={() => onToggleTask(task.id)}
                onEdit={() => onStartEdit(task.id)}
                onDelete={() => onDeleteTask(task.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
