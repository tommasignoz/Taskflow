# ⚡ TaskFlow - Fullstack Task Management Dashboard

Applicazione di gestione attività moderna ed enterprise suddivisa in architettura monorepo:
- **Frontend**: [React 19](https://react.dev/), [Vite](https://vite.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) e TypeScript
- **Backend**: [Fastify](https://fastify.dev/) con TypeScript e **memorizzazione volatile in-memory** (in RAM)

---

## 📂 Struttura del Progetto

```text
lezioni/
├── frontend/               # Applicazione Client (React 19 + Vite + TypeScript)
│   ├── src/
│   │   ├── components/     # Componenti UI (dashboard, kanban, table, dialogs)
│   │   ├── hooks/          # Custom hooks (useTaskManager integrato con API)
│   │   ├── services/       # Client API per comunicare con il backend Fastify
│   │   ├── types/          # Contratti di tipo TypeScript
│   │   └── utils/          # Effetti sonori Web Audio API
│   ├── public/             # Icone e asset statici
│   ├── package.json        # Dipendenze e script frontend
│   ├── tsconfig.json       # Configurazione TypeScript frontend
│   └── vite.config.js      # Configurazione Vite con proxy /api -> backend:3001
│
├── backend/                # Server API (Fastify + TypeScript)
│   ├── src/
│   │   ├── routes/         # Rotte API Fastify (/api/tasks, /api/health)
│   │   ├── store/          # Store volatile in-memory (RAM)
│   │   ├── types/          # Tipi TypeScript (Task, DTO, ecc.)
│   │   ├── app.ts          # Configurazione Fastify, CORS, plugin
│   │   └── server.ts       # Entrypoint server (porta 3001)
│   ├── package.json        # Dipendenze e script backend
│   └── tsconfig.json       # Configurazione TypeScript backend
│
├── package.json            # Script root per gestione unificata
└── README.md               # Documentazione
```

---

## 💾 Memorizzazione Volatile (In-Memory)

Il backend è progettato per salvare tutti i dati **esclusivamente in memoria RAM** (volatile):
- All'avvio il server carica un dataset dimostrativo iniziale (`INITIAL_TASKS`).
- Qualsiasi operazione (creazione, modifica, eliminazione, spunta) viene memorizzata nel singleton `TaskStore` in memoria.
- **Nessun file o database persistente** viene scritto sul disco fisso: un riavvio del server azzera o ripristina lo stato iniziale.
- È disponibile l'endpoint dedicato `POST /api/tasks/reset` per resettare i dati in memoria in qualsiasi momento.

---

## 📡 API Endpoints (Fastify)

Tutti gli endpoint rispondono sotto il prefisso `/api`:

| Metodo | Endpoint | Descrizione |
|---|---|---|
| `GET` | `/api/health` | Health check del server e stato memoria volatile |
| `GET` | `/api/tasks` | Lista di tutti i task (supporta query: `status`, `search`, `sortBy`) |
| `GET` | `/api/tasks/:id` | Recupera un singolo task per ID |
| `POST` | `/api/tasks` | Crea un nuovo task (`{ text, priority?, category? }`) |
| `PUT` | `/api/tasks/:id` | Modifica un task esistente (`{ text?, priority?, category?, completed? }`) |
| `PATCH`| `/api/tasks/:id/toggle` | Inverte lo stato di completamento del task |
| `DELETE`| `/api/tasks/:id` | Rimuove un task |
| `POST` | `/api/tasks/restore` | Ripristina un task eliminato |
| `POST` | `/api/tasks/clear-completed` | Rimuove tutti i task completati |
| `POST` | `/api/tasks/toggle-all` | Completa o riapre tutti i task contemporaneamente |
| `POST` | `/api/tasks/reset` | Ripristina i dati demo in memoria |
| `GET` | `/api/tasks/stats` | Riepilogo statistico (totale, completati, in corso, %) |

---

## 🚀 Avvio del Progetto

### 1. Avviare il Backend (Fastify)
Dalla cartella principale del progetto:
```bash
npm run dev:backend
```
*Oppure entrando nella cartella `backend`:*
```bash
cd backend
npm run dev
```
Il server Fastify si avvierà su `http://localhost:3001`.

### 2. Avviare il Frontend (Vite + React)
In un altro terminale, dalla cartella principale:
```bash
npm run dev:frontend
```
*Oppure entrando nella cartella `frontend`:*
```bash
cd frontend
npm run dev
```
L'applicazione sarà accessibile su `http://localhost:5173`, con il proxy automatico configurato verso `http://localhost:3001` per tutte le chiamate `/api`.

---

## 📜 Script Disponibili nella Root

- `npm run dev:backend`: Avvia il backend Fastify con `tsx watch` e ricaricamento a caldo.
- `npm run dev:frontend`: Avvia il server di sviluppo Vite per il frontend.
- `npm run build`: Compila sia backend (`tsc`) che frontend (`vite build`).
- `npm run build:backend`: Compila il backend TypeScript nella cartella `backend/dist`.
- `npm run build:frontend`: Compila il frontend nella cartella `frontend/dist`.
- `npm run start:backend`: Avvia la versione compilata del backend (`node backend/dist/server.js`).
