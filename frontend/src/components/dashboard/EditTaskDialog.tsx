import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check } from 'lucide-react';
import type { Task, Priority, Category, TaskUpdates } from '@/types/task';

interface EditTaskDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveEdit: (id: number, updates: TaskUpdates) => void;
}

function EditTaskForm({
  task,
  onClose,
  onSaveEdit,
}: {
  task: Task;
  onClose: () => void;
  onSaveEdit: (id: number, updates: TaskUpdates) => void;
}) {
  const [text, setText] = React.useState(task.text);
  const [priority, setPriority] = React.useState<Priority>(task.priority);
  const [category, setCategory] = React.useState<Category>(task.category);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    onSaveEdit(task.id, {
      text: trimmed,
      priority,
      category,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <DialogHeader>
        <DialogTitle className="text-base font-semibold">
          Modifica Attività #{task.id}
        </DialogTitle>
        <DialogDescription className="text-xs text-muted-foreground">
          Aggiorna il titolo, la priorità o la categoria di questa attività.
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-3 py-1">
        {/* Input Descrizione */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="edit-task-title"
            className="text-xs font-medium text-foreground"
          >
            Titolo / Descrizione
          </label>
          <Input
            ref={inputRef}
            id="edit-task-title"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Modifica testo..."
            className="text-sm h-9"
            required
          />
        </div>

        {/* Selettori Priorità e Categoria */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="edit-task-priority"
              className="text-xs font-medium text-foreground"
            >
              Priorità
            </label>
            <select
              id="edit-task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-xs text-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:outline-none cursor-pointer"
            >
              <option value="alta">⚡ Alta</option>
              <option value="media">● Media</option>
              <option value="bassa">○ Bassa</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="edit-task-category"
              className="text-xs font-medium text-foreground"
            >
              Categoria
            </label>
            <select
              id="edit-task-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-xs text-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:outline-none cursor-pointer"
            >
              <option value="Generale">📁 Generale</option>
              <option value="Lavoro">💼 Lavoro</option>
              <option value="Studio">📚 Studio</option>
              <option value="Sistema">⚙️ Sistema</option>
            </select>
          </div>
        </div>
      </div>

      <DialogFooter className="mt-2 gap-2 sm:gap-0">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
        >
          Annulla
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={!text.trim()}
          className="gap-1.5"
        >
          <Check data-icon="inline-start" className="size-3.5" />
          <span>Salva Modifiche</span>
        </Button>
      </DialogFooter>
    </form>
  );
}

export function EditTaskDialog({
  task,
  open,
  onOpenChange,
  onSaveEdit,
}: EditTaskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {open && task && (
          <EditTaskForm
            task={task}
            onClose={() => onOpenChange(false)}
            onSaveEdit={onSaveEdit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
