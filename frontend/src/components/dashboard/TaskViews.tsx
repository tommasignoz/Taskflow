import * as React from 'react';
import { Kanban as KanbanIcon, Table as TableIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { KanbanView } from './KanbanView';
import { TableView } from './TableView';
import type { Task } from '@/types/task';

interface TaskViewsProps {
  currentView: 'kanban' | 'table';
  onSelectView: (view: 'kanban' | 'table') => void;
  tasks: Task[];
  animatingDingId: number | null;
  onToggleTask: (id: number) => void;
  onStartEdit: (id: number) => void;
  onDeleteTask: (id: number) => void;
  onOpenCreateDialog: () => void;
}

export function TaskViews({
  currentView,
  onSelectView,
  tasks,
  animatingDingId,
  onToggleTask,
  onStartEdit,
  onDeleteTask,
  onOpenCreateDialog,
}: TaskViewsProps) {
  return (
    <Tabs
      value={currentView}
      onValueChange={(val) => onSelectView(val as 'kanban' | 'table')}
      className="flex flex-col gap-3 w-full"
    >
      <div className="flex items-center justify-between">
        <TabsList className="bg-muted p-1 rounded-lg">
          <TabsTrigger value="kanban" className="text-xs px-3">
            <KanbanIcon data-icon="inline-start" className="size-3.5" />
            <span>Kanban Board</span>
          </TabsTrigger>
          <TabsTrigger value="table" className="text-xs px-3">
            <TableIcon data-icon="inline-start" className="size-3.5" />
            <span>Tabella / Lista</span>
          </TabsTrigger>
        </TabsList>

        <span className="text-xs text-muted-foreground font-mono">
          Visualizzando {tasks.length} task
        </span>
      </div>

      <TabsContent value="kanban" className="mt-0 outline-none">
        <KanbanView
          tasks={tasks}
          animatingDingId={animatingDingId}
          onToggleTask={onToggleTask}
          onStartEdit={onStartEdit}
          onDeleteTask={onDeleteTask}
          onOpenCreateDialog={onOpenCreateDialog}
        />
      </TabsContent>

      <TabsContent value="table" className="mt-0 outline-none">
        <TableView
          tasks={tasks}
          animatingDingId={animatingDingId}
          onToggleTask={onToggleTask}
          onStartEdit={onStartEdit}
          onDeleteTask={onDeleteTask}
          onOpenCreateDialog={onOpenCreateDialog}
        />
      </TabsContent>
    </Tabs>
  );
}
