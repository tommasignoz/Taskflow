import * as React from 'react';
import {
  ListTodo,
  Clock,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { TaskStats } from '@/types/task';

interface StatsOverviewProps {
  stats: TaskStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <section aria-label="Metriche di produttività" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Attività Totali */}
      <Card size="sm" className="transition-all hover:border-foreground/20">
        <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Totale Task
          </CardTitle>
          <div className="flex size-7 items-center justify-center rounded-md bg-muted text-foreground">
            <ListTodo className="size-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-semibold tracking-tight">{stats.total}</div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Attività registrate a sistema
          </p>
        </CardContent>
      </Card>

      {/* 2. Da Fare */}
      <Card size="sm" className="transition-all hover:border-amber-500/30">
        <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Da Completare
          </CardTitle>
          <div className="flex size-7 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock className="size-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-semibold tracking-tight text-amber-600 dark:text-amber-400">
              {stats.pending}
            </div>
            <Badge variant="secondary" className="text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-300">
              In Corso
            </Badge>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            In attesa di risoluzione
          </p>
        </CardContent>
      </Card>

      {/* 3. Completate */}
      <Card size="sm" className="transition-all hover:border-emerald-500/30">
        <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Completate
          </CardTitle>
          <div className="flex size-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-semibold tracking-tight text-emerald-600 dark:text-emerald-400">
              {stats.completed}
            </div>
            <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
              Risolte
            </Badge>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Obiettivi raggiunti con successo
          </p>
        </CardContent>
      </Card>

      {/* 4. Tasso di Produttività */}
      <Card size="sm" className="transition-all hover:border-primary/30">
        <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Tasso di Evasione
          </CardTitle>
          <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <TrendingUp className="size-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-semibold tracking-tight font-mono">{stats.percent}%</div>
            <span className="text-[11px] font-medium text-muted-foreground">
              {stats.completed}/{stats.total} task
            </span>
          </div>
          {/* Progress Bar Container */}
          <div
            className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={stats.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Percentuale di completamento task"
          >
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${stats.percent}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
