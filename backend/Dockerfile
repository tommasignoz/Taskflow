FROM node:22-alpine

# Abilita pnpm tramite corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copia definizioni workspace e dipendenze per massimizzare la cache dei layer
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY backend/package.json ./backend/

# Installa le dipendenze
RUN pnpm --filter ./backend install --frozen-lockfile

# Copia il codice del backend
COPY backend ./backend

WORKDIR /app/backend

# Compila TypeScript
RUN pnpm run build

EXPOSE 3001

ENV HOST=0.0.0.0
ENV PORT=3001

# Di default avvia con hot-reload in sviluppo, oppure dist/server.js in produzione
CMD ["pnpm", "run", "dev"]
