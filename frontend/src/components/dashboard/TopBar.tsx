import * as React from 'react';
import {
  Menu,
  Search,
  Plus,
  Sun,
  Moon,
  MoreVertical,
  CheckSquare,
  Trash2,
  RotateCcw,
  Sparkles,
  X,
  ShieldCheck,
  Key,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TopBarProps {
  onOpenMobileSidebar: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenCreateDialog: () => void;
  onTestDing: () => void;
  onToggleAll: () => void;
  onClearCompleted: () => void;
  onResetDemo: () => void;
  hasCompletedTasks: boolean;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currentUser?: { name?: string; email?: string } | null;
  onOpenAuth?: () => void;
}

export function TopBar({
  onOpenMobileSidebar,
  searchQuery,
  onSearchChange,
  onOpenCreateDialog,
  onTestDing,
  onToggleAll,
  onClearCompleted,
  onResetDemo,
  hasCompletedTasks,
  isDarkMode,
  onToggleDarkMode,
  currentUser,
  onOpenAuth,
}: TopBarProps) {
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Ctrl+K or Cmd+K to focus search, Esc to clear
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between gap-3 border-b bg-card/80 px-3 sm:px-6 backdrop-blur-md">
      {/* Left Section: Mobile Menu + Title */}
      <div className="flex items-center gap-2.5">
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          onClick={onOpenMobileSidebar}
          aria-label="Apri menu di navigazione"
        >
          <Menu />
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-tight hidden sm:inline-block">
            Dashboard
          </span>
          <span className="text-xs text-muted-foreground hidden lg:inline-block">
            / Gestione Attività
          </span>
        </div>
      </div>

      {/* Center Section: Global Search Input */}
      <div className="flex-1 max-w-md relative">
        <div className="relative flex items-center">
          <Search className="pointer-events-none absolute left-2.5 size-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cerca attività o categoria... (⌘K)"
            className="pl-8 pr-8 h-9 text-xs sm:text-sm bg-muted/30 focus-visible:bg-background"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2 text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Cancella ricerca"
            >
              <X className="size-3.5" />
            </button>
          ) : (
            <kbd className="pointer-events-none absolute right-2.5 hidden sm:inline-flex h-4.5 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Test Ding Button */}
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:inline-flex gap-1.5 h-8 text-xs font-normal"
          onClick={onTestDing}
          title="Riproduci il feedback sonoro DING!"
        >
          <Sparkles data-icon="inline-start" className="size-3.5 text-amber-500" />
          <span>Test DING!</span>
        </Button>

        {/* Create Task Button */}
        <Button
          size="sm"
          className="h-8 gap-1.5 text-xs font-medium shadow-xs"
          onClick={onOpenCreateDialog}
        >
          <Plus data-icon="inline-start" className="size-3.5" />
          <span className="hidden xs:inline">Nuova Attività</span>
        </Button>

        {/* Cyber Auth Badge / Button */}
        {onOpenAuth && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenAuth}
            className={
              currentUser
                ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-950/40 text-xs font-mono px-2.5 h-8 hidden sm:inline-flex'
                : 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300 hover:bg-cyan-950/40 text-xs font-mono px-2.5 h-8 hidden sm:inline-flex shadow-[0_0_10px_rgba(6,182,212,0.15)]'
            }
            title={currentUser ? `Autenticato come ${currentUser.email}` : 'Accesso richiesto (/api/me: 401)'}
          >
            {currentUser ? (
              <>
                <ShieldCheck data-icon="inline-start" className="size-3.5 text-emerald-400" />
                <span className="max-w-[120px] truncate">{currentUser.name || 'Operatore'}</span>
              </>
            ) : (
              <>
                <Key data-icon="inline-start" className="size-3.5 text-cyan-400" />
                <span>Accedi // 401</span>
              </>
            )}
          </Button>
        )}

        {/* Theme Toggle Button */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={onToggleDarkMode}
          title={isDarkMode ? 'Passa alla modalità chiara' : 'Passa alla modalità scura'}
          aria-label="Attiva/disattiva tema scuro"
        >
          {isDarkMode ? <Sun /> : <Moon />}
        </Button>

        {/* More Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Opzioni rapide"
            >
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>Azioni Globali</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {onOpenAuth && (
                <DropdownMenuItem onClick={onOpenAuth}>
                  <ShieldCheck data-icon="inline-start" className="size-4 text-cyan-400" />
                  <span>Terminale Auth // {currentUser ? 'Profilo' : 'Accedi'}</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={onToggleAll}>
                <CheckSquare data-icon="inline-start" className="size-4" />
                <span>Inverti tutti i task</span>
              </DropdownMenuItem>
              {hasCompletedTasks && (
                <DropdownMenuItem
                  onClick={onClearCompleted}
                  className="text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <Trash2 data-icon="inline-start" className="size-4" />
                  <span>Pulisci completati</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={onResetDemo}>
                <RotateCcw data-icon="inline-start" className="size-4" />
                <span>Ripristina dati demo</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
