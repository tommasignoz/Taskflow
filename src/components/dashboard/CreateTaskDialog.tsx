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
import { Plus } from 'lucide-react';
import type { Priority, Category } from '@/types/task';

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (text: string, priority: Priority, category: Category) => boolean;
}

function CreateTaskForm({
  onClose,
  onCreateTask,
}: {
  onClose: () => void;
  onCreateTask: (text: string, priority: Priority, category: Category) => boolean;
}) {
  const [text, setText] = React.useState('');
  const [priority, setPriority] = React.useState<Priority>('media');
  const [category, setCategory] = React.useState<Category>('Generale');
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const success = onCreateTask(text, priority, category);
    if (success) {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <DialogHeader>
        <DialogTitle className="text-base font-semibold">
          Nuova Attività
        </DialogTitle>
        <DialogDescription className="text-xs text-muted-foreground">
          Aggiungi un nuovo task al tuo flusso di lavoro. Premi Invio per salvare rapidamente.
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-3 py-1">
        {/* Input Descrizione */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="create-task-title"
            className="text-xs font-medium text-foreground"
          >
            Descrizione Task
          </label>
          <Input
            ref={inputRef}
            id="create-task-title"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Es. Rivedere PR #42 o definire i test E2E..."
            className="text-sm h-9"
            required
          />
        </div>

        {/* Selettori Priorità e Categoria */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="create-task-priority"
              className="text-xs font-medium text-foreground"
            >
              Priorità
            </label>
            <select
              id="create-task-priority"
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
              htmlFor="create-task-category"
              className="text-xs font-medium text-foreground"
            >
              Categoria
            </label>
            <select
              id="create-task-category"
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
          <Plus data-icon="inline-start" className="size-3.5" />
          <span>Crea Attività</span>
        </Button>
      </DialogFooter>
    </form>
  );
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  onCreateTask,
}: CreateTaskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {open && (
          <CreateTaskForm
            onClose={() => onOpenChange(false)}
            onCreateTask={onCreateTask}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
