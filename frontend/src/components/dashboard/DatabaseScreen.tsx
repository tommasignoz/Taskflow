import * as React from 'react';
import {
  Database,
  Server,
  Cpu,
  Terminal,
  Layers,
  Key,
  RefreshCw,
  Play,
  CheckCircle2,
  AlertCircle,
  Activity,
  HardDrive,
  Code2,
  Search,
  Copy,
  Check,
  Radio,
} from 'lucide-react';
import { api } from '@/services/api';
import type { DatabaseOverview, TableInfo, QueryResult } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface DatabaseScreenProps {
  onRefreshTasks?: () => void;
}

export function DatabaseScreen({ onRefreshTasks }: DatabaseScreenProps) {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [overview, setOverview] = React.useState<DatabaseOverview | null>(null);
  const [selectedTable, setSelectedTable] = React.useState<string>('tasks');
  const [activeTab, setActiveTab] = React.useState<'data' | 'schema' | 'console' | 'json'>('data');
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  // SQL Console State
  const [sqlQuery, setSqlQuery] = React.useState<string>('SELECT * FROM tasks ORDER BY id DESC LIMIT 10;');
  const [queryExecuting, setQueryExecuting] = React.useState<boolean>(false);
  const [queryResult, setQueryResult] = React.useState<QueryResult | null>(null);
  const [queryError, setQueryError] = React.useState<string | null>(null);

  // Fetch Database Overview
  const fetchOverview = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getDatabaseOverview();
      setOverview(data);
      if (data.tables.length > 0 && !data.tables.some((t) => t.name === selectedTable)) {
        setSelectedTable(data.tables[0].name);
      }
    } catch (err: unknown) {
      console.error('Errore caricamento database:', err);
      setError(err instanceof Error ? err.message : 'Impossibile connettersi al database');
    } finally {
      setLoading(false);
    }
  }, [selectedTable]);

  React.useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  // Execute interactive SQL Query
  const handleRunQuery = async (queryToRun?: string) => {
    const q = (queryToRun || sqlQuery).trim();
    if (!q) return;

    setQueryExecuting(true);
    setQueryError(null);
    try {
      const result = await api.runDatabaseQuery(q);
      setQueryResult(result);
    } catch (err: unknown) {
      setQueryError(err instanceof Error ? err.message : 'Errore esecuzione query');
      setQueryResult(null);
    } finally {
      setQueryExecuting(false);
    }
  };

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const currentTableData: TableInfo | undefined = React.useMemo(() => {
    return overview?.tables.find((t) => t.name === selectedTable);
  }, [overview, selectedTable]);

  // Filter rows based on search
  const filteredRows = React.useMemo(() => {
    if (!currentTableData) return [];
    if (!searchTerm.trim()) return currentTableData.rows;

    const term = searchTerm.toLowerCase();
    return currentTableData.rows.filter((row) =>
      Object.values(row).some((val) => String(val).toLowerCase().includes(term))
    );
  }, [currentTableData, searchTerm]);

  return (
    <div className="flex flex-col gap-6 font-mono pb-10">
      {/* 1. FUTURISTIC TELEMETRY HUD HEADER */}
      <div className="relative overflow-hidden rounded-xl border border-cyan-500/40 bg-radial-[at_top_left] from-cyan-950/40 via-background to-black/90 p-5 shadow-[0_0_30px_rgba(6,182,212,0.15)] backdrop-blur-md">
        {/* Decorative Grid Lines & Ambient Glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 size-72 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative flex size-14 items-center justify-center rounded-lg border border-cyan-400/50 bg-cyan-950/60 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Database className="size-7 text-cyan-400 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex size-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex size-3 rounded-full bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-wider text-cyan-400 uppercase drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
                  Neural DB Matrix // Core
                </h1>
                <Badge
                  variant="outline"
                  className="border-emerald-500/50 bg-emerald-950/40 text-emerald-300 text-[10px] tracking-widest font-mono"
                >
                  <Radio className="size-2.5 mr-1 animate-pulse text-emerald-400" />
                  LIVE TELEMETRY
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                POSTGRESQL 16 • DRIZZLE ORM NODE • VOLATILITY PERSISTENCE ZERO-LOSS
              </p>
            </div>
          </div>

          {/* Quick HUD Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                fetchOverview();
                if (onRefreshTasks) onRefreshTasks();
              }}
              disabled={loading}
              className="border-cyan-500/40 bg-cyan-950/30 text-cyan-300 hover:bg-cyan-900/50 hover:text-cyan-100 hover:border-cyan-400 transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)] text-xs h-8"
            >
              <RefreshCw className={cn('size-3.5 mr-1.5', loading && 'animate-spin text-cyan-400')} />
              <span>SYNC TELEMETRY</span>
            </Button>
          </div>
        </div>

        {/* HUD TELEMETRY METRIC TILES */}
        {error && (
          <div className="mt-4 p-3 rounded-lg border border-red-500/50 bg-red-950/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0 text-red-400" />
            <span>Errore di connessione al database: {error}</span>
          </div>
        )}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 text-xs">
          {/* Status */}
          <div className="rounded-lg border border-border/60 bg-muted/30 p-2.5 flex flex-col justify-between">
            <span className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
              <Activity className="size-3 text-emerald-400" /> Status
            </span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1 mt-1 text-sm">
              <CheckCircle2 className="size-3.5" /> ONLINE
            </span>
          </div>

          {/* Database Name */}
          <div className="rounded-lg border border-border/60 bg-muted/30 p-2.5 flex flex-col justify-between">
            <span className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
              <Server className="size-3 text-cyan-400" /> Database
            </span>
            <span className="font-semibold text-foreground truncate mt-1 text-sm">
              {overview?.database || 'taskflow'}
            </span>
          </div>

          {/* Engine & Version */}
          <div className="rounded-lg border border-border/60 bg-muted/30 p-2.5 flex flex-col justify-between">
            <span className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
              <Cpu className="size-3 text-purple-400" /> Engine
            </span>
            <span className="font-semibold text-purple-300 truncate mt-1 text-sm">
              PG 16 (Alpine)
            </span>
          </div>

          {/* Storage Size */}
          <div className="rounded-lg border border-border/60 bg-muted/30 p-2.5 flex flex-col justify-between">
            <span className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
              <HardDrive className="size-3 text-amber-400" /> DB Storage
            </span>
            <span className="font-semibold text-amber-300 mt-1 text-sm font-mono">
              {overview?.dbSize || '7.6 MB'}
            </span>
          </div>

          {/* Ping Latency */}
          <div className="rounded-lg border border-border/60 bg-muted/30 p-2.5 flex flex-col justify-between">
            <span className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
              <Activity className="size-3 text-cyan-400" /> Ping Latency
            </span>
            <span className="font-semibold text-cyan-300 mt-1 text-sm font-mono">
              {overview?.latencyMs ?? 18} ms
            </span>
          </div>

          {/* Active Connections */}
          <div className="rounded-lg border border-border/60 bg-muted/30 p-2.5 flex flex-col justify-between">
            <span className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
              <Layers className="size-3 text-pink-400" /> Connessioni
            </span>
            <span className="font-semibold text-pink-300 mt-1 text-sm font-mono">
              {overview?.activeConnections || 1} Attiva
            </span>
          </div>
        </div>
      </div>

      {/* 2. TABLE SELECTION CARDS */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase flex items-center gap-1.5">
            <Layers className="size-3.5 text-cyan-400" />
            Tabelle Registrate nel Schema // Public
          </span>
          <span className="text-[11px] text-cyan-400/80 font-mono">
            {overview?.tables.length || 1} TABELLA RILEVATA
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {overview?.tables.map((table) => {
            const isSelected = selectedTable === table.name;
            return (
              <button
                key={table.name}
                type="button"
                onClick={() => setSelectedTable(table.name)}
                className={cn(
                  'group relative flex flex-col p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer',
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                    : 'border-border/60 bg-card hover:border-cyan-500/50 hover:bg-muted/40'
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        'size-8 rounded-lg flex items-center justify-center border transition-colors',
                        isSelected
                          ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                          : 'border-border bg-muted/50 text-muted-foreground group-hover:text-cyan-400'
                      )}
                    >
                      <Database className="size-4" />
                    </div>
                    <div>
                      <span className="font-bold text-sm tracking-wide text-foreground group-hover:text-cyan-300">
                        public.{table.name}
                      </span>
                      <p className="text-[11px] text-muted-foreground font-sans">
                        Tabella Principale TaskFlow
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-[10px] font-mono px-2 py-0.5',
                      isSelected
                        ? 'border-cyan-400 text-cyan-300 bg-cyan-950/50'
                        : 'border-border text-muted-foreground'
                    )}
                  >
                    {table.rowCount} RECORD
                  </Badge>
                </div>

                <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Code2 className="size-3 text-cyan-400" />
                    {table.columns.length} Colonne
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <HardDrive className="size-3 text-purple-400" />
                    {table.size}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MAIN TABBED CONTENT AREA */}
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
          <TabsList className="bg-muted/60 p-1 border border-border/60 rounded-lg">
            <TabsTrigger
              value="data"
              className="text-xs px-3 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 data-[state=active]:border-cyan-500/40"
            >
              <Layers className="size-3.5 mr-1.5 text-cyan-400" />
              <span>Contenuto Righe ({currentTableData?.rowCount || 0})</span>
            </TabsTrigger>
            <TabsTrigger
              value="schema"
              className="text-xs px-3 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300 data-[state=active]:border-purple-500/40"
            >
              <Key className="size-3.5 mr-1.5 text-purple-400" />
              <span>Schema & Colonne ({currentTableData?.columns.length || 0})</span>
            </TabsTrigger>
            <TabsTrigger
              value="console"
              className="text-xs px-3 data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300 data-[state=active]:border-emerald-500/40"
            >
              <Terminal className="size-3.5 mr-1.5 text-emerald-400" />
              <span>Cyber SQL Console</span>
            </TabsTrigger>
            <TabsTrigger
              value="json"
              className="text-xs px-3 data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300 data-[state=active]:border-amber-500/40"
            >
              <Code2 className="size-3.5 mr-1.5 text-amber-400" />
              <span>Raw JSON Stream</span>
            </TabsTrigger>
          </TabsList>

          {/* Search bar inside records view */}
          {activeTab === 'data' && (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Filtra record in memoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 pl-8 text-xs font-mono bg-muted/40 border-border/80 focus:border-cyan-400"
              />
            </div>
          )}
        </div>

        {/* TAB 1: DATA GRID (CONTENUTO RIGHE) */}
        <TabsContent value="data" className="mt-4 outline-none">
          <Card className="border border-cyan-500/30 bg-card/70 backdrop-blur-sm overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.4)]">
            <CardHeader className="bg-muted/40 px-4 py-3 border-b border-border/60 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                <Database className="size-3.5 text-cyan-400" />
                Dati Tabella: <span className="text-foreground">public.{selectedTable}</span>
              </CardTitle>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                <span>Visualizzati: {filteredRows.length} su {currentTableData?.rowCount || 0}</span>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              {filteredRows.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center justify-center gap-2">
                  <AlertCircle className="size-8 text-muted-foreground/60" />
                  <p className="text-xs text-muted-foreground">Nessun record corrispondente trovato</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border/60 bg-muted/20 font-semibold text-muted-foreground tracking-wider uppercase text-[10px]">
                      <th className="py-2.5 px-4 w-16">#ID</th>
                      <th className="py-2.5 px-4">Testo Attività</th>
                      <th className="py-2.5 px-4 w-32">Stato</th>
                      <th className="py-2.5 px-4 w-28">Priorità</th>
                      <th className="py-2.5 px-4 w-32">Categoria</th>
                      <th className="py-2.5 px-4 w-28">Creato Alle</th>
                      <th className="py-2.5 px-4 w-44">Aggiornato (DB)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono">
                    {filteredRows.map((row: any, idx) => {
                      const isEven = idx % 2 === 0;
                      return (
                        <tr
                          key={row.id || idx}
                          className={cn(
                            'hover:bg-cyan-950/20 transition-colors group',
                            isEven ? 'bg-transparent' : 'bg-muted/10'
                          )}
                        >
                          {/* ID with hex styling */}
                          <td className="py-3 px-4 font-bold text-cyan-400 whitespace-nowrap">
                            <span className="opacity-60 text-[10px]">#</span>
                            {String(row.id).padStart(4, '0')}
                          </td>

                          {/* Text Payload */}
                          <td className="py-3 px-4 text-foreground font-sans text-xs max-w-md truncate font-medium">
                            {row.text}
                          </td>

                          {/* Completed Status */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            {row.completed ? (
                              <Badge
                                variant="outline"
                                className="border-emerald-500/60 bg-emerald-950/40 text-emerald-300 text-[10px] tracking-wide"
                              >
                                <span className="size-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                                [RESOLVED]
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="border-amber-500/60 bg-amber-950/40 text-amber-300 text-[10px] tracking-wide"
                              >
                                <span className="size-1.5 rounded-full bg-amber-400 mr-1.5" />
                                [PENDING]
                              </Badge>
                            )}
                          </td>

                          {/* Priority */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            {row.priority === 'alta' && (
                              <span className="text-red-400 font-bold text-[11px] flex items-center gap-1">
                                <span className="size-1 rounded-full bg-red-400" /> ALTA
                              </span>
                            )}
                            {row.priority === 'media' && (
                              <span className="text-amber-400 text-[11px] flex items-center gap-1">
                                <span className="size-1 rounded-full bg-amber-400" /> MEDIA
                              </span>
                            )}
                            {row.priority === 'bassa' && (
                              <span className="text-blue-400 text-[11px] flex items-center gap-1">
                                <span className="size-1 rounded-full bg-blue-400" /> BASSA
                              </span>
                            )}
                          </td>

                          {/* Category */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="text-purple-300 text-[11px] bg-purple-950/40 border border-purple-500/30 px-2 py-0.5 rounded">
                              {row.category || 'Generale'}
                            </span>
                          </td>

                          {/* Created At */}
                          <td className="py-3 px-4 whitespace-nowrap text-muted-foreground text-[11px]">
                            {row.created_at || row.createdAt || 'N/A'}
                          </td>

                          {/* Updated At */}
                          <td className="py-3 px-4 whitespace-nowrap text-[10px] text-muted-foreground/80">
                            {row.updated_at
                              ? new Date(row.updated_at).toLocaleTimeString()
                              : 'now()'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: SCHEMA & COLONNE */}
        <TabsContent value="schema" className="mt-4 outline-none">
          <Card className="border border-purple-500/30 bg-card/70 backdrop-blur-sm overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.4)]">
            <CardHeader className="bg-muted/40 px-4 py-3 border-b border-border/60 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
                <Key className="size-3.5 text-purple-400" />
                Definizione Colonne Schema: <span className="text-foreground">public.{selectedTable}</span>
              </CardTitle>
              <Badge variant="outline" className="text-[10px] border-purple-500/40 text-purple-300">
                {currentTableData?.columns.length} CAMPI ATTIVI
              </Badge>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/20 font-semibold text-muted-foreground tracking-wider uppercase text-[10px]">
                    <th className="py-2.5 px-4 w-12">PK</th>
                    <th className="py-2.5 px-4">Nome Colonna</th>
                    <th className="py-2.5 px-4">Tipo Dato PostgreSQL</th>
                    <th className="py-2.5 px-4 w-28">Nullable</th>
                    <th className="py-2.5 px-4">Valore Default / Espressione</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-mono">
                  {currentTableData?.columns.map((col) => (
                    <tr key={col.name} className="hover:bg-purple-950/20 transition-colors">
                      <td className="py-3 px-4">
                        {col.isPrimary ? (
                          <Badge className="bg-amber-500/20 border border-amber-500/50 text-amber-300 text-[9px] px-1.5 py-0">
                            PK
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground/30">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-bold text-foreground flex items-center gap-1.5">
                        <Code2 className="size-3 text-cyan-400" />
                        {col.name}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded text-[11px]">
                          {col.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {col.nullable ? (
                          <span className="text-muted-foreground text-[11px]">NULL</span>
                        ) : (
                          <span className="text-emerald-400 font-semibold text-[11px]">NOT NULL</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-[11px] truncate max-w-xs">
                        {col.defaultValue || <span className="opacity-40">none</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: CYBER SQL CONSOLE */}
        <TabsContent value="console" className="mt-4 outline-none flex flex-col gap-4">
          <Card className="border border-emerald-500/30 bg-black/80 backdrop-blur-md overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <CardHeader className="bg-emerald-950/30 px-4 py-2.5 border-b border-emerald-500/20 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <Terminal className="size-3.5 text-emerald-400 animate-pulse" />
                Interactive Cyber SQL Console // Read-Only
              </CardTitle>
              <span className="text-[10px] text-emerald-500/80 font-mono">
                SECURE SELECT AGENT // FASTIFY POSTGRES
              </span>
            </CardHeader>

            <CardContent className="p-4 flex flex-col gap-3">
              {/* Quick Query Presets */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-[10px] text-muted-foreground mr-1 uppercase">Preset:</span>
                {[
                  'SELECT * FROM tasks ORDER BY id DESC LIMIT 10;',
                  'SELECT count(*) as total, priority FROM tasks GROUP BY priority;',
                  'SELECT id, text, priority, created_at FROM tasks WHERE completed = false;',
                  'SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\';',
                ].map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => {
                      setSqlQuery(preset);
                      handleRunQuery(preset);
                    }}
                    className="text-[10px] border border-emerald-500/30 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded cursor-pointer transition-colors"
                  >
                    Query #{pIdx + 1}
                  </button>
                ))}
              </div>

              {/* Terminal Code Input */}
              <div className="relative rounded-lg border border-emerald-500/40 bg-zinc-950 p-2 font-mono text-xs shadow-inner">
                <div className="flex items-center text-emerald-400 font-bold mb-1.5 select-none text-[11px]">
                  <span className="text-cyan-400">taskflow@postgres:~$</span>
                </div>
                <textarea
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  rows={3}
                  className="w-full bg-transparent text-emerald-300 font-mono text-xs focus:outline-none resize-none selection:bg-emerald-500/30"
                  placeholder="Scrivi una query SQL (es. SELECT * FROM tasks;)"
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-[10px] text-muted-foreground">
                  * Supporta istruzioni SELECT, EXPLAIN, SHOW con tempo di esecuzione in millisecondi.
                </p>
                <Button
                  size="sm"
                  onClick={() => handleRunQuery()}
                  disabled={queryExecuting}
                  className="bg-emerald-600 hover:bg-emerald-500 text-black font-bold h-8 px-4 text-xs shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                >
                  <Play className={cn('size-3 mr-1.5 fill-current', queryExecuting && 'animate-spin')} />
                  <span>{queryExecuting ? 'ESECUZIONE...' : 'ESEGUI QUERY'}</span>
                </Button>
              </div>

              {/* Execution Error Message */}
              {queryError && (
                <div className="p-3 rounded-lg border border-red-500/40 bg-red-950/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0 text-red-400" />
                  <span>{queryError}</span>
                </div>
              )}

              {/* Query Result Grid */}
              {queryResult && (
                <div className="mt-2 flex flex-col gap-2 rounded-lg border border-emerald-500/30 bg-zinc-950/80 p-3">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground border-b border-border/40 pb-2">
                    <span className="text-emerald-400 font-bold">
                      ✓ Righe restituite: {queryResult.rowCount}
                    </span>
                    <span>Tempo di esecuzione: {queryResult.executionTimeMs} ms</span>
                  </div>

                  <div className="overflow-x-auto max-h-60">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border/60 text-muted-foreground uppercase text-[10px]">
                          {queryResult.fields.map((f) => (
                            <th key={f} className="py-1.5 px-3 font-semibold">
                              {f}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20 font-mono text-[11px]">
                        {queryResult.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-emerald-950/20">
                            {queryResult.fields.map((f) => (
                              <td key={f} className="py-2 px-3 text-emerald-200">
                                {String(row[f])}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: RAW JSON STREAM */}
        <TabsContent value="json" className="mt-4 outline-none">
          <Card className="border border-amber-500/30 bg-zinc-950/90 overflow-hidden shadow-[0_0_25px_rgba(245,158,11,0.1)]">
            <CardHeader className="bg-amber-950/20 px-4 py-2.5 border-b border-amber-500/20 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                <Code2 className="size-3.5 text-amber-400" />
                Dati JSON Grezzi // PostgreSQL Node Output
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  handleCopy(
                    JSON.stringify(currentTableData?.rows || [], null, 2),
                    'json-stream'
                  )
                }
                className="text-[11px] text-amber-300 hover:text-amber-100 h-7"
              >
                {copiedId === 'json-stream' ? (
                  <>
                    <Check className="size-3 mr-1 text-emerald-400" /> COPIATO
                  </>
                ) : (
                  <>
                    <Copy className="size-3 mr-1" /> COPIA JSON
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              <pre className="max-h-96 overflow-y-auto rounded-lg bg-black/60 p-4 text-[11px] font-mono text-amber-200/90 leading-relaxed border border-border/40 selection:bg-amber-500/30">
                {JSON.stringify(currentTableData?.rows || [], null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
