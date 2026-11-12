import * as React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Terminal,
  Cpu,
  Database,
  Key,
  Radio,
  Server,
  Sparkles,
  ArrowRight,
  LogOut,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { authClient } from '@/lib/auth-client';
import { api } from '@/services/api';
import { cn } from '@/lib/utils';

interface AuthScreenProps {
  onAuthenticated?: () => void;
  onExploreAsGuest?: () => void;
}

export function AuthScreen({ onAuthenticated, onExploreAsGuest }: AuthScreenProps) {
  const { data: session, refetch } = authClient.useSession();

  // Tab di autenticazione: sign-in o sign-up
  const [activeTab, setActiveTab] = React.useState<'sign-in' | 'sign-up'>('sign-in');

  // Campi form
  const [email, setEmail] = React.useState('commander@taskflow.cyber');
  const [password, setPassword] = React.useState('CyberTask2026!');
  const [name, setName] = React.useState('Cyber Commander');
  const [showPassword, setShowPassword] = React.useState(false);

  // Stati operativi
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  // Telemetria /api/me in tempo reale
  const [meStatus, setMeStatus] = React.useState<{
    statusCode: number | null;
    authenticated: boolean;
    data: any;
    loading: boolean;
  }>({
    statusCode: null,
    authenticated: false,
    data: null,
    loading: false,
  });

  // Esegue test dell'endpoint /api/me
  const testMeEndpoint = React.useCallback(async () => {
    setMeStatus((prev) => ({ ...prev, loading: true }));
    try {
      const res = await api.getMe();
      setMeStatus({
        statusCode: res.statusCode,
        authenticated: res.authenticated,
        data: res,
        loading: false,
      });
    } catch (err: any) {
      setMeStatus({
        statusCode: 500,
        authenticated: false,
        data: { error: err.message },
        loading: false,
      });
    }
  }, []);

  // Esegui test /api/me al caricamento
  React.useEffect(() => {
    testMeEndpoint();
  }, [testMeEndpoint, session]);

  // Gestione Accesso (Sign In)
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Inserisci email e chiave di accesso.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        setErrorMsg(result.error.message || 'Autenticazione fallita: credenziali errate.');
      } else {
        setSuccessMsg('Accesso autorizzato! Identità verificata nel nucleo neurale.');
        await refetch();
        await testMeEndpoint();
        setTimeout(() => {
          onAuthenticated?.();
        }, 600);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Errore di connessione al server Better Auth.');
    } finally {
      setIsLoading(false);
    }
  };

  // Gestione Registrazione (Sign Up)
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setErrorMsg('Compila tutti i parametri di inizializzazione.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('La chiave di accesso neurale deve contenere almeno 8 caratteri.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (result.error) {
        setErrorMsg(result.error.message || 'Impossibile creare operatore: account già esistente.');
      } else {
        setSuccessMsg('Nuovo Operatore inizializzato con successo in PostgreSQL!');
        await refetch();
        await testMeEndpoint();
        setTimeout(() => {
          onAuthenticated?.();
        }, 700);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Errore durante la registrazione operatore.');
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnessione (Sign Out)
  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await authClient.signOut();
      await refetch();
      await testMeEndpoint();
      setSuccessMsg('Sessione terminata. Endpoint /api/me nuovamente protetto (401).');
    } catch (err: any) {
      setErrorMsg(err.message || 'Errore durante la disconnessione.');
    } finally {
      setIsLoading(false);
    }
  };

  // Carica credenziali demo rapide
  const loadDemoCredentials = () => {
    setEmail('commander@taskflow.cyber');
    setPassword('CyberTask2026!');
    setName('Cyber Commander');
    setActiveTab('sign-in');
    setErrorMsg(null);
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background text-foreground flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Sfondo Futuristico con Griglia Cybernetica e Bagliori Radiali */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.22),rgba(15,23,42,0))]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#06b6d40a_1px,transparent_1px),linear-gradient(to_bottom,#06b6d40a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Top Header Bar HUD */}
      <header className="border-b border-cyan-900/30 bg-card/60 backdrop-blur-md px-4 py-3 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex size-9 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-950/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <ShieldCheck className="size-5 animate-pulse" />
              <span className="absolute -top-1 -right-1 size-2 rounded-full bg-emerald-400 ring-2 ring-background" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold tracking-wider text-cyan-400">
                  TASKFLOW // NEURAL ACCESS
                </span>
                <Badge variant="outline" className="border-cyan-500/30 bg-cyan-950/30 text-[10px] text-cyan-300">
                  v2.4 SECURE
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground font-mono">
                PostgreSQL 16 • Drizzle ORM • Fastify v5 • Better Auth
              </p>
            </div>
          </div>

          {/* Telemetria Rapida in alto */}
          <div className="hidden sm:flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-950/30 px-3 py-1 text-emerald-400">
              <Radio className="size-3 animate-ping" />
              <span>CORE: ACTIVE</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/30 px-3 py-1 text-cyan-300">
              <Database className="size-3 text-cyan-400" />
              <span>DB: PG-DRIZZLE</span>
            </div>
            {onExploreAsGuest && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onExploreAsGuest}
                className="text-xs text-muted-foreground hover:text-cyan-400 hover:bg-cyan-950/30"
              >
                Esplora Dashboard <ArrowRight className="size-3 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content: Layout Bilanciato a 3 Colonne per riempire armoniosamente lo spazio */}
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="mx-auto w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* COLONNA SINISTRA: Telemetria Sistema & Protocolli di Sicurezza */}
          <div className="hidden lg:flex lg:col-span-3 flex-col gap-4 text-xs font-mono">
            <div className="rounded-xl border border-cyan-500/20 bg-card/40 p-4 backdrop-blur-sm shadow-[0_0_20px_rgba(6,182,212,0.05)]">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-2">
                <Cpu className="size-4" />
                <span>PROTOCOLLO ZERO-TRUST</span>
              </div>
              <p className="text-muted-foreground text-[11px] leading-relaxed mb-3">
                Accesso crittografato conforme alle specifiche militari CyberNet. Le sessioni sono persistite in PostgreSQL tramite adapter Drizzle ORM.
              </p>
              <div className="space-y-1.5 border-t border-border/50 pt-2 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">HANDSHAKE:</span>
                  <span className="text-emerald-400 font-semibold">BETTER-AUTH v1.7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SESSION CIPHER:</span>
                  <span className="text-cyan-300">HMAC-SHA256</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">DB ADAPTER:</span>
                  <span className="text-cyan-300">drizzleAdapter(pg)</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-card/30 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-amber-400 font-semibold mb-2">
                <Terminal className="size-4" />
                <span>OPERATORE DEMO</span>
              </div>
              <p className="text-muted-foreground text-[11px] mb-3">
                Credenziali precaricate per test rapido del sistema:
              </p>
              <div className="rounded bg-muted/40 p-2 font-mono text-[11px] border border-border/40 space-y-1">
                <div><span className="text-muted-foreground">User:</span> <span className="text-cyan-300">commander@taskflow.cyber</span></div>
                <div><span className="text-muted-foreground">Pass:</span> <span className="text-cyan-300">CyberTask2026!</span></div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={loadDemoCredentials}
                className="mt-3 w-full border-cyan-500/30 text-cyan-300 hover:bg-cyan-950/40 text-xs"
              >
                <Sparkles className="size-3 mr-1 text-cyan-400" />
                Carica Credenziali Demo
              </Button>
            </div>
          </div>

          {/* COLONNA CENTRALE: La Schermata di Login Shadcn (Dimensioni Controllate max-w-md) */}
          <div className="col-span-1 lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Decorazioni Cyber agli angoli della card */}
              <div className="pointer-events-none absolute -top-1.5 -left-1.5 size-3 border-t-2 border-l-2 border-cyan-400" />
              <div className="pointer-events-none absolute -top-1.5 -right-1.5 size-3 border-t-2 border-r-2 border-cyan-400" />
              <div className="pointer-events-none absolute -bottom-1.5 -left-1.5 size-3 border-b-2 border-l-2 border-cyan-400" />
              <div className="pointer-events-none absolute -bottom-1.5 -right-1.5 size-3 border-b-2 border-r-2 border-cyan-400" />

              <Card className="border border-cyan-500/40 bg-card/85 shadow-[0_0_35px_rgba(6,182,212,0.15)] backdrop-blur-xl">
                <CardHeader className="text-center pb-3">
                  <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-950/50 text-cyan-400 shadow-inner">
                    <Key className="size-6 text-cyan-300" />
                  </div>
                  <CardTitle className="font-mono text-xl tracking-wide text-foreground flex items-center justify-center gap-2">
                    <span>PORTALE NEURALE</span>
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground font-mono">
                    Autenticazione operatore tramite Fastify & Better Auth
                  </CardDescription>

                  {/* Visualizzatore stato sessione attiva */}
                  {session?.user && (
                    <div className="mt-2 rounded-lg border border-emerald-500/40 bg-emerald-950/20 p-2.5 text-left text-xs">
                      <div className="flex items-center justify-between text-emerald-400 font-semibold mb-1">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="size-3.5 text-emerald-400" />
                          OPERATORE AUTENTICATO
                        </span>
                        <Badge variant="outline" className="border-emerald-500/40 text-emerald-300 text-[10px]">
                          200 OK
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-[11px] font-mono truncate">
                        Nome: <span className="text-foreground">{session.user.name}</span>
                      </p>
                      <p className="text-muted-foreground text-[11px] font-mono truncate">
                        Email: <span className="text-cyan-300">{session.user.email}</span>
                      </p>
                      <div className="mt-2.5 flex gap-2">
                        {onAuthenticated && (
                          <Button
                            size="sm"
                            onClick={onAuthenticated}
                            className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                          >
                            Entra in Dashboard <ArrowRight className="size-3 ml-1" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSignOut}
                          disabled={isLoading}
                          className="border-destructive/40 text-destructive hover:bg-destructive/10 text-xs font-mono"
                        >
                          <LogOut className="size-3 mr-1" />
                          Logout
                        </Button>
                      </div>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Feedback Messaggi di Successo o Errore */}
                  {errorMsg && (
                    <div className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-2.5 text-xs text-destructive">
                      <AlertCircle className="size-4 shrink-0 mt-0.5" />
                      <span className="font-mono">{errorMsg}</span>
                    </div>
                  )}

                  {successMsg && (
                    <div className="flex items-start gap-2 rounded-lg border border-emerald-500/50 bg-emerald-950/30 p-2.5 text-xs text-emerald-400">
                      <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
                      <span className="font-mono">{successMsg}</span>
                    </div>
                  )}

                  {/* Tabs Shadcn: Accedi vs Registrati */}
                  <Tabs
                    value={activeTab}
                    onValueChange={(val) => {
                      setActiveTab(val as 'sign-in' | 'sign-up');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2 bg-muted/70 p-1 rounded-lg">
                      <TabsTrigger value="sign-in" className="text-xs font-mono">
                        <Lock className="size-3 mr-1.5" />
                        Accedi
                      </TabsTrigger>
                      <TabsTrigger value="sign-up" className="text-xs font-mono">
                        <User className="size-3 mr-1.5" />
                        Inizializza
                      </TabsTrigger>
                    </TabsList>

                    {/* Tab 1: Accesso (Sign In) */}
                    <TabsContent value="sign-in" className="mt-4 space-y-3">
                      <form onSubmit={handleSignIn} className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-mono text-muted-foreground flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <Mail className="size-3 text-cyan-400" />
                              IDENTIFICATIVO OPERATORE (EMAIL)
                            </span>
                          </label>
                          <Input
                            type="email"
                            required
                            placeholder="operatore@taskflow.cyber"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="font-mono text-xs border-border/70 focus-visible:border-cyan-500 focus-visible:ring-cyan-500/30"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-mono text-muted-foreground flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <Key className="size-3 text-cyan-400" />
                              CHIAVE DI ACCESSO (PASSWORD)
                            </span>
                          </label>
                          <div className="relative">
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              required
                              placeholder="••••••••••••"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="font-mono text-xs pr-9 border-border/70 focus-visible:border-cyan-500 focus-visible:ring-cyan-500/30"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-cyan-400"
                              tabIndex={-1}
                            >
                              {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                            </button>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-all"
                        >
                          {isLoading ? (
                            <span className="flex items-center gap-2">
                              <RefreshCw className="size-3.5 animate-spin" />
                              AUTORIZZAZIONE IN CORSO...
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5">
                              <Lock className="size-3.5" />
                              AUTORIZZA ACCESSO NEURALE
                            </span>
                          )}
                        </Button>
                      </form>
                    </TabsContent>

                    {/* Tab 2: Registrazione (Sign Up) */}
                    <TabsContent value="sign-up" className="mt-4 space-y-3">
                      <form onSubmit={handleSignUp} className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                            <User className="size-3 text-cyan-400" />
                            NOME IN CODICE OPERATORE
                          </label>
                          <Input
                            type="text"
                            required
                            placeholder="Es. Cyber Commander"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="font-mono text-xs border-border/70 focus-visible:border-cyan-500 focus-visible:ring-cyan-500/30"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                            <Mail className="size-3 text-cyan-400" />
                            INDIRIZZO NEURALE (EMAIL)
                          </label>
                          <Input
                            type="email"
                            required
                            placeholder="nuovo.operatore@taskflow.cyber"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="font-mono text-xs border-border/70 focus-visible:border-cyan-500 focus-visible:ring-cyan-500/30"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                            <Key className="size-3 text-cyan-400" />
                            CHIAVE DI ACCESSO (MIN 8 CARATTERI)
                          </label>
                          <div className="relative">
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              required
                              placeholder="••••••••••••"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="font-mono text-xs pr-9 border-border/70 focus-visible:border-cyan-500 focus-visible:ring-cyan-500/30"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-cyan-400"
                              tabIndex={-1}
                            >
                              {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                            </button>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.35)] transition-all"
                        >
                          {isLoading ? (
                            <span className="flex items-center gap-2">
                              <RefreshCw className="size-3.5 animate-spin" />
                              INIZIALIZZAZIONE OPERATORE...
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5">
                              <User className="size-3.5" />
                              INIZIALIZZA NUOVO OPERATORE
                            </span>
                          )}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </CardContent>

                <CardFooter className="flex flex-col gap-2.5 pt-0 pb-4">
                  {/* Banner Stato Endpoint Protetto /api/me */}
                  <div className="w-full rounded-lg border border-border/60 bg-muted/30 p-2 text-xs font-mono">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Radio className="size-2.5 text-cyan-400" />
                        PROTETTO: /api/me
                      </span>
                      {meStatus.statusCode === 200 ? (
                        <span className="rounded bg-emerald-950/60 border border-emerald-500/40 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                          HTTP 200 OK
                        </span>
                      ) : meStatus.statusCode === 401 ? (
                        <span className="rounded bg-red-950/60 border border-red-500/40 px-1.5 py-0.5 text-[10px] font-bold text-red-400">
                          HTTP 401 UNAUTHORIZED
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">IN ATTESA...</span>
                      )}
                    </div>
                    <div className="text-[10px] text-muted-foreground truncate">
                      {meStatus.statusCode === 401
                        ? 'Bloccato: richiesta sessione Better Auth'
                        : meStatus.statusCode === 200
                        ? `Autorizzato: ${meStatus.data?.user?.email}`
                        : 'Verifica in corso...'}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* COLONNA DESTRA: Monitor Endpoint /api/me & Telemetria Live */}
          <div className="hidden lg:flex lg:col-span-3 flex-col gap-4 text-xs font-mono">
            {/* Monitor in tempo reale dell'endpoint /api/me con risposta HTTP 401 */}
            <div className="rounded-xl border border-cyan-500/20 bg-card/40 p-4 backdrop-blur-sm shadow-[0_0_20px_rgba(6,182,212,0.05)]">
              <div className="flex items-center justify-between text-cyan-400 font-semibold mb-2">
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="size-4 text-amber-400" />
                  GATEWAY /api/me
                </span>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={testMeEndpoint}
                  disabled={meStatus.loading}
                  title="Ping endpoint /api/me"
                  className="text-muted-foreground hover:text-cyan-400"
                >
                  <RefreshCw className={cn('size-3', meStatus.loading && 'animate-spin')} />
                </Button>
              </div>

              <p className="text-muted-foreground text-[11px] mb-2.5">
                Endpoint protetto con codice <span className="text-red-400 font-bold">401</span> se la sessione non è valida:
              </p>

              {/* Box JSON Telemetria Live */}
              <div className="rounded-lg bg-black/60 p-2.5 border border-cyan-950 text-[10px] text-cyan-300 font-mono overflow-x-auto max-h-40">
                <div className="text-muted-foreground mb-1">
                  GET /api/me -&gt; <span className={meStatus.statusCode === 200 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                    {meStatus.statusCode ? `HTTP ${meStatus.statusCode}` : '...'}
                  </span>
                </div>
                <pre className="text-[10px] leading-tight text-slate-300">
                  {JSON.stringify(
                    meStatus.data || {
                      statusCode: 401,
                      error: 'Unauthorized',
                      message: 'Accesso negato. Autenticazione richiesta per accedere a /api/me.',
                    },
                    null,
                    2
                  )}
                </pre>
              </div>

              <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground border-t border-border/40 pt-2">
                <span>SECURITY LEVEL:</span>
                <span className="text-cyan-300 font-bold">STRICT_AUTH</span>
              </div>
            </div>

            {/* Architettura Stack Box */}
            <div className="rounded-xl border border-border/60 bg-card/30 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-2">
                <Server className="size-4" />
                <span>STACK NEURALE</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-muted-foreground">
                <li className="flex items-center justify-between">
                  <span>Fastify Kernel:</span>
                  <span className="text-cyan-300">v5.2.0</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Better Auth:</span>
                  <span className="text-cyan-300">v1.7.21</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Drizzle ORM:</span>
                  <span className="text-cyan-300">v0.45.4</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>PostgreSQL:</span>
                  <span className="text-cyan-300">v16 Alpine</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </main>

      {/* Footer Cyber HUD */}
      <footer className="border-t border-cyan-900/30 bg-card/40 px-4 py-2.5 sm:px-8 text-center text-xs font-mono text-muted-foreground backdrop-blur-xs flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>TASKFLOW NEURAL OS // SECURE AUTH NODE</span>
        </div>
        <div className="text-[11px]">
          Tabelle Drizzle: <span className="text-cyan-300">user • session • account • verification • tasks</span>
        </div>
      </footer>
    </div>
  );
}
