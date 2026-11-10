import * as React from 'react';
import {
  Kanban,
  Table as TableIcon,
  CheckCircle2,
  Clock,
  ListTodo,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { FilterStatus, TaskStats } from '@/types/task';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  currentView: 'kanban' | 'table';
  onSelectView: (view: 'kanban' | 'table') => void;
  activeFilter: FilterStatus;
  onSelectFilter: (filter: FilterStatus) => void;
  stats: TaskStats;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onTestDing: () => void;
}

export function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  currentView,
  onSelectView,
  activeFilter,
  onSelectFilter,
  stats,
  soundEnabled,
  onToggleSound,
  onTestDing,
}: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-card transition-all duration-300 ease-in-out md:static',
          collapsed ? 'w-16' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Header / Brand */}
        <div className="flex h-14 items-center justify-between border-b px-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
              <CheckCircle2 className="size-5" />
            </div>
            {!collapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-sm font-semibold tracking-tight">TaskFlow</span>
                <span className="truncate text-[11px] text-muted-foreground flex items-center gap-1">
                  Enterprise OS <ShieldCheck className="size-3 text-emerald-500 inline" />
                </span>
              </div>
            )}
          </div>

          {/* Mobile Close Button */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={onCloseMobile}
            aria-label="Chiudi menu laterale"
          >
            <X />
          </Button>

          {/* Desktop Collapse Toggle */}
          <Button
            variant="ghost"
            size="icon-xs"
            className="hidden md:inline-flex text-muted-foreground hover:text-foreground"
            onClick={onToggleCollapse}
            title={collapsed ? 'Espandi barra laterale' : 'Comprimi barra laterale'}
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-4">
          {/* Main Views */}
          <div className="flex flex-col gap-1">
            {!collapsed && (
              <span className="px-2 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                Viste Principali
              </span>
            )}

            <Button
              variant={currentView === 'kanban' ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start h-9',
                collapsed && 'justify-center px-0'
              )}
              onClick={() => {
                onSelectView('kanban');
                onCloseMobile();
              }}
              title="Vista Kanban"
            >
              <Kanban data-icon="inline-start" />
              {!collapsed && (
                <span className="flex-1 text-left truncate flex items-center justify-between">
                  <span>Kanban Board</span>
                  <Badge variant="outline" className="ml-auto text-[10px] h-4 px-1.5 font-mono">
                    {stats.pending}
                  </Badge>
                </span>
              )}
            </Button>

            <Button
              variant={currentView === 'table' ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start h-9',
                collapsed && 'justify-center px-0'
              )}
              onClick={() => {
                onSelectView('table');
                onCloseMobile();
              }}
              title="Vista Tabella"
            >
              <TableIcon data-icon="inline-start" />
              {!collapsed && (
                <span className="flex-1 text-left truncate flex items-center justify-between">
                  <span>Tabella / Lista</span>
                  <Badge variant="outline" className="ml-auto text-[10px] h-4 px-1.5 font-mono">
                    {stats.total}
                  </Badge>
                </span>
              )}
            </Button>
          </div>

          <Separator />

          {/* Status Filters */}
          <div className="flex flex-col gap-1">
            {!collapsed && (
              <span className="px-2 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                Filtri Rapidi
              </span>
            )}

            <Button
              variant={activeFilter === 'all' ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start h-8 text-xs',
                collapsed && 'justify-center px-0'
              )}
              onClick={() => onSelectFilter('all')}
              title="Tutte le attività"
            >
              <ListTodo data-icon="inline-start" className="size-3.5" />
              {!collapsed && (
                <span className="flex-1 text-left truncate flex items-center justify-between">
                  <span>Tutte</span>
                  <span className="text-muted-foreground text-[11px] font-mono">{stats.total}</span>
                </span>
              )}
            </Button>

            <Button
              variant={activeFilter === 'pending' ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start h-8 text-xs',
                collapsed && 'justify-center px-0'
              )}
              onClick={() => onSelectFilter('pending')}
              title="Attività da completare"
            >
              <Clock data-icon="inline-start" className="size-3.5 text-amber-500" />
              {!collapsed && (
                <span className="flex-1 text-left truncate flex items-center justify-between">
                  <span>Da fare</span>
                  <Badge variant="secondary" className="text-[10px] h-4 px-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono">
                    {stats.pending}
                  </Badge>
                </span>
              )}
            </Button>

            <Button
              variant={activeFilter === 'completed' ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start h-8 text-xs',
                collapsed && 'justify-center px-0'
              )}
              onClick={() => onSelectFilter('completed')}
              title="Attività completate"
            >
              <CheckCircle2 data-icon="inline-start" className="size-3.5 text-emerald-500" />
              {!collapsed && (
                <span className="flex-1 text-left truncate flex items-center justify-between">
                  <span>Completate</span>
                  <Badge variant="secondary" className="text-[10px] h-4 px-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono">
                    {stats.completed}
                  </Badge>
                </span>
              )}
            </Button>
          </div>

          <Separator />

          {/* Sound Synthesizer Controls */}
          <div className="flex flex-col gap-1">
            {!collapsed && (
              <span className="px-2 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                Feedback Audio
              </span>
            )}

            <Button
              variant="outline"
              size="sm"
              className={cn(
                'w-full justify-start text-xs h-8',
                collapsed && 'justify-center px-0'
              )}
              onClick={onToggleSound}
              title={soundEnabled ? 'Disattiva effetti audio' : 'Attiva effetti audio'}
            >
              {soundEnabled ? (
                <Volume2 data-icon="inline-start" className="text-emerald-500" />
              ) : (
                <VolumeX data-icon="inline-start" className="text-muted-foreground" />
              )}
              {!collapsed && (
                <span className="truncate">
                  {soundEnabled ? 'Audio: Attivo' : 'Audio: Muto'}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'w-full justify-start text-xs h-8 text-muted-foreground hover:text-foreground',
                collapsed && 'justify-center px-0'
              )}
              onClick={onTestDing}
              title="Ascolta suono DING di prova"
            >
              <Sparkles data-icon="inline-start" className="text-amber-400" />
              {!collapsed && <span className="truncate">Prova DING!</span>}
            </Button>
          </div>
        </div>

        {/* Footer User Profile */}
        <div className="border-t p-2">
          <div
            className={cn(
              'flex items-center gap-2.5 rounded-lg p-1.5 transition-colors hover:bg-muted/60',
              collapsed && 'justify-center'
            )}
          >
            <div className="relative">
              <Avatar className="size-8">
                <AvatarImage src="" alt="Senior Engineer" />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  SE
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 size-2 rounded-full bg-emerald-500 ring-2 ring-card" />
            </div>

            {!collapsed && (
              <div className="flex flex-col overflow-hidden leading-tight">
                <span className="truncate text-xs font-medium">Senior Engineer</span>
                <span className="truncate text-[10px] text-muted-foreground">Lead Frontend UI/UX</span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
