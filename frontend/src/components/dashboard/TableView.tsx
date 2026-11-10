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
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
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

interface TableViewProps {
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

export function TableView({
  tasks,
  animatingDingId,
  onToggleTask,
  onStartEdit,
  onDeleteTask,
  onOpenCreateDialog,
}: TableViewProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center bg-card/40">
        <CheckCircle2 className="size-10 text-muted-foreground/40 mb-3" />
        <h3 className="text-base font-semibold text-foreground">Nessuna attività presente</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          Nessun task corrisponde ai filtri selezionati o non ci sono ancora attività registrate.
        </p>
        <Button
          size="sm"
          className="mt-4 text-xs font-medium"
          onClick={onOpenCreateDialog}
        >
          <Plus data-icon="inline-start" className="size-3.5" />
          Crea Nuova Attività
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card shadow-2xs overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="w-12 text-center">Stato</TableHead>
            <TableHead className="min-w-[280px]">Attività</TableHead>
            <TableHead className="w-32">Categoria</TableHead>
            <TableHead className="w-28">Priorità</TableHead>
            <TableHead className="w-24 font-mono text-xs">Orario</TableHead>
            <TableHead className="w-14 text-right pr-4">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => {
            const isDing = animatingDingId === task.id;
            return (
              <TableRow
                key={task.id}
                className={cn(
                  'group transition-colors',
                  task.completed ? 'bg-muted/20 text-muted-foreground' : 'hover:bg-muted/40',
                  isDing && 'ding-pulse bg-emerald-500/10'
                )}
              >
                {/* Checkbox Status */}
                <TableCell className="text-center py-3">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={task.completed}
                    onClick={() => onToggleTask(task.id)}
                    className={cn(
                      'inline-flex size-5 shrink-0 items-center justify-center rounded-md border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      task.completed
                        ? 'border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500'
                        : 'border-muted-foreground/40 bg-background hover:border-foreground'
                    )}
                    title={task.completed ? 'Riapri task' : 'Completa task'}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="size-3.5 stroke-[2.5]" />
                    ) : (
                      <Circle className="size-3 text-transparent" />
                    )}
                  </button>
                </TableCell>

                {/* Task Text */}
                <TableCell
                  className="font-medium cursor-pointer"
                  onClick={() => onToggleTask(task.id)}
                >
                  <span
                    className={cn(
                      'text-sm leading-snug transition-all',
                      task.completed && 'line-through text-muted-foreground/70'
                    )}
                  >
                    {task.text}
                  </span>
                </TableCell>

                {/* Category Badge */}
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="text-[11px] font-normal text-muted-foreground"
                  >
                    <Folder className="size-2.5 mr-1 text-muted-foreground/70" />
                    {task.category || 'Generale'}
                  </Badge>
                </TableCell>

                {/* Priority Badge */}
                <TableCell>
                  <PriorityBadge priority={task.priority} />
                </TableCell>

                {/* Timestamp */}
                <TableCell className="text-xs text-muted-foreground font-mono">
                  <div className="flex items-center gap-1">
                    <Clock className="size-3 text-muted-foreground/70" />
                    <span>{task.createdAt}</span>
                  </div>
                </TableCell>

                {/* Action Menu */}
                <TableCell className="text-right pr-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="text-muted-foreground hover:text-foreground opacity-60 group-hover:opacity-100"
                        aria-label="Opzioni riga"
                      >
                        <MoreVertical className="size-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => onStartEdit(task.id)}>
                          <Pencil data-icon="inline-start" className="size-3.5" />
                          <span>Modifica</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onToggleTask(task.id)}>
                          <CheckCircle2 data-icon="inline-start" className="size-3.5" />
                          <span>{task.completed ? 'Segna da fare' : 'Completa'}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDeleteTask(task.id)}
                          className="text-destructive focus:text-destructive focus:bg-destructive/10"
                        >
                          <Trash2 data-icon="inline-start" className="size-3.5" />
                          <span>Elimina</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
