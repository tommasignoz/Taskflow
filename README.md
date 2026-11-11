# ⚡ TaskFlow - Fullstack Task Management Dashboard

Applicazione di gestione attività moderna ed enterprise suddivisa in architettura monorepo:
- **Package Manager**: [pnpm](https://pnpm.io/) workspace
- **Frontend (Host)**: [React 19](https://react.dev/), [Vite](https://vite.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) e TypeScript
- **Backend (Docker)**: [Node.js 22](https://nodejs.org/) con [Fastify](https://fastify.dev/) e TypeScript in container Docker (`taskflow-backend`)
- **Database & ORM (Docker)**: [PostgreSQL 16](https://www.postgresql.org/) in container Docker (`taskflow-postgres`) gestito con [Drizzle ORM](https://orm.drizzle.team/)
- **Accessibilità Rete**: Configurato per l'accesso da **localhost**, dalla **rete locale (LAN)** e da **Tailscale**

---

## 📂 Struttura del Progetto

```text
lezioni/
├── docker-compose.yml       # Servizi Docker: postgres (DB) + backend (Node.js 22 Fastify)
├── pnpm-workspace.yaml      # Configurazione workspace pnpm (frontend + backend)
├── pnpm-lock.yaml           # Lockfile pnpm
├── frontend/                # Applicazione Client eseguita su Host (React 19 + Vite + TypeScript)
│   ├── src/
│   │   ├── components/      # Componenti UI (dashboard, kanban, table, dialogs)
│   │   ├── hooks/           # Custom hooks (useTaskManager integrato con API)
│   │   ├── services/        # Client API per comunicare con il backend Fastify
│   │   ├── types/           # Contratti di tipo TypeScript
│   │   └── utils/           # Effetti sonori Web Audio API
│   ├── public/              # Icone e asset statici
│   ├── package.json         # Dipendenze e script frontend
│   ├── tsconfig.json        # Configurazione TypeScript frontend
│   └── vite.config.js       # Vite configurato su 0.0.0.0, allowedHosts e proxy API
│
├── backend/                 # Server API containerizzato su Docker (Node.js 22 + Fastify + Drizzle)
│   ├── Dockerfile           # Immagine Docker Node.js 22 con pnpm e TypeScript
│   ├── drizzle.config.ts    # Configurazione Drizzle Kit
│   ├── src/
│   │   ├── db/              # Connessione DB, schema Drizzle e seed
│   │   │   ├── index.ts     # Client PostgreSQL e pool Drizzle
│   │   │   ├── schema.ts    # Schema tabella tasks
│   │   │   ├── seed.ts      # Seeding iniziale dei task
│   │   │   └── migrations/  # Migrazioni SQL generate da Drizzle Kit
│   │   ├── routes/          # Rotte API Fastify (/api/tasks, /api/health)
│   │   ├── store/           # TaskStore con query asincrone Drizzle ORM
│   │   ├── types/           # Tipi TypeScript (Task, DTO, ecc.)
│   │   ├── app.ts           # Configurazione Fastify, CORS, plugin
│   │   └── server.ts        # Entrypoint server (porta 3001, binding 0.0.0.0)
│   ├── package.json         # Dipendenze e script backend
│   └── tsconfig.json        # Configurazione TypeScript backend
│
├── package.json             # Script root per gestione unificata con pnpm
└── README.md                # Documentazione
```

---

## 🐳 Architettura Docker (Backend + PostgreSQL)

Il backend e il database sono completamente containerizzati con Docker Compose:

1. **`postgres`** (`taskflow-postgres`):
   - Immagine `postgres:16-alpine`.
   - Volume persistente `postgres_data` per conservare i task.
   - Healthcheck automatico integrato.
2. **`backend`** (`taskflow-backend`):
   - Immagine personalizzata basata su `node:22-alpine` ([`backend/Dockerfile`](file:///C:/Users/Tommaso/orca/projects/lezioni/backend/Dockerfile)).
   - Connessione interna di rete Docker a `postgres:5432`.
   - Porta `3001` esposta sull'host (`0.0.0.0:3001`).
   - Volume montato `./backend/src:/app/backend/src` per supporto **hot-reload** istantaneo.
3. **`frontend` (Host)**:
   - Viene eseguito direttamente sulla macchina host con Vite (`pnpm run dev:frontend`), consumando l'API esposta dal backend Docker.

---

## 🌐 Accesso da Rete Locale e Tailscale

Sia il server Vite frontend (su host) che il backend Fastify (su Docker) sono configurati per ascoltare su tutte le interfacce (`0.0.0.0`) con `allowedHosts: true` e CORS abilitato:

1. **Da questo computer (Locale)**:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3001`
2. **Da qualsiasi dispositivo nella Rete Locale (LAN)** (stesso Wi-Fi o Ethernet):
   - Frontend: `http://192.168.1.14:5173` (o l'IP locale della tua macchina)
3. **Da remoto via Tailscale**:
   - Frontend: `http://100.66.119.100:5173` (o tramite nome macchina MagicDNS)

---

## 🚀 Guida di Avvio Rapido

### 1. Avviare Backend e Database con Docker
Dalla cartella principale del progetto:
```bash
pnpm run docker:up
```
Questo comando avvia sia il container PostgreSQL che il container Fastify Node.js in background.

### 2. Avviare il Frontend (Vite su Host)
In un terminale:
```bash
pnpm run dev:frontend
```
L'applicazione è immediatamente disponibile su `http://localhost:5173`, `http://192.168.1.14:5173` e `http://<ip-tailscale>:5173`.

---

## 📜 Script Disponibili nella Root (pnpm)

- `pnpm run docker:up`: Avvia i container Docker (Backend Node.js + Database PostgreSQL).
- `pnpm run docker:down`: Ferma tutti i container Docker.
- `pnpm run docker:build`: Ricostruisce l'immagine Docker del backend e riavvia i container.
- `pnpm run docker:logs`: Visualizza i log aggregati di tutti i container.
- `pnpm run docker:logs:backend`: Log in tempo reale del container backend Node.js.
- `pnpm run docker:logs:db`: Log in tempo reale del container PostgreSQL.
- `pnpm run dev:frontend`: Avvia il server di sviluppo Vite su host.
- `pnpm run db:push`: Applica lo schema Drizzle direttamente al database PostgreSQL.
- `pnpm run db:seed`: Esegue il seeding dei dati demo.
- `pnpm run db:studio`: Avvia Drizzle Studio per esplorare visivamente il database nel browser.
- `pnpm run build`: Compila sia backend (`tsc`) che frontend (`vite build`).
