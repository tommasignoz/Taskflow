import * as React from 'react';
import {
  ArrowUpDown,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { FilterStatus, SortByOption, TaskStats } from '@/types/task';

interface TaskToolbarProps {
  filter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  sortBy: SortByOption;
  onSortChange: (sortBy: SortByOption) => void;
  selectedPriority: string;
  onPriorityFilterChange: (priority: string) => void;
  selectedCategory: string;
  onCategoryFilterChange: (category: string) => void;
  categories: string[];
  stats: TaskStats;
  onClearCompleted: () => void;
}

export function TaskToolbar({
  filter,
  onFilterChange,
  sortBy,
  onSortChange,
  selectedPriority,
  onPriorityFilterChange,
  selectedCategory,
  onCategoryFilterChange,
  categories,
  stats,
  onClearCompleted,
}: TaskToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-3 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 rounded-lg bg-muted p-1 text-xs">
          <button
            type="button"
            onClick={() => onFilterChange('all')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-background text-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>Tutti</span>
            <Badge variant="outline" className="h-4 px-1 text-[10px] font-mono">
              {stats.total}
            </Badge>
          </button>

          <button
            type="button"
            onClick={() => onFilterChange('pending')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-all cursor-pointer ${
              filter === 'pending'
                ? 'bg-background text-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>Da fare</span>
            <Badge
              variant="secondary"
              className="h-4 px-1 text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono"
            >
              {stats.pending}
            </Badge>
          </button>

          <button
            type="button"
            onClick={() => onFilterChange('completed')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-all cursor-pointer ${
              filter === 'completed'
                ? 'bg-background text-foreground shadow-2xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>Completati</span>
            <Badge
              variant="secondary"
              className="h-4 px-1 text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono"
            >
              {stats.completed}
            </Badge>
          </button>
        </div>

        {/* Dropdowns: Priority, Category, Sorting */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="hidden sm:inline">Priorità:</span>
            <select
              value={selectedPriority}
              onChange={(e) => onPriorityFilterChange(e.target.value)}
              className="h-8 rounded-lg border border-input bg-transparent px-2 text-xs text-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:outline-none cursor-pointer"
              aria-label="Filtra per priorità"
            >
              <option value="all">Tutte le priorità</option>
              <option value="alta">⚡ Alta</option>
              <option value="media">● Media</option>
              <option value="bassa">○ Bassa</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="hidden sm:inline">Categoria:</span>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryFilterChange(e.target.value)}
              className="h-8 rounded-lg border border-input bg-transparent px-2 text-xs text-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:outline-none cursor-pointer"
              aria-label="Filtra per categoria"
            >
              <option value="all">Tutte le categorie</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ArrowUpDown className="size-3.5 hidden sm:inline" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortByOption)}
              className="h-8 rounded-lg border border-input bg-transparent px-2 text-xs text-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:outline-none cursor-pointer"
              aria-label="Ordinamento"
            >
              <option value="date-desc">Più recenti prima</option>
              <option value="date-asc">Più vecchi prima</option>
              <option value="priority-desc">Per priorità (Alta prima)</option>
            </select>
          </div>

          {/* Clear Completed Action */}
          {stats.completed > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={onClearCompleted}
              title="Elimina tutte le attività completate"
            >
              <Trash2 data-icon="inline-start" className="size-3.5" />
              <span className="hidden md:inline">Pulisci Fatti</span> ({stats.completed})
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
