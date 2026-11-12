FROM node:22-alpine

# Abilita pnpm tramite corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copia definizioni workspace e dipendenze
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY backend ./backend

# Installa le dipendenze
RUN pnpm --filter ./backend install --frozen-lockfile

WORKDIR /app/backend

# Compila TypeScript
RUN pnpm run build

EXPOSE 3001

ENV HOST=0.0.0.0
ENV PORT=3001

# Di default avvia con hot-reload in sviluppo, oppure dist/server.js in produzione
CMD ["pnpm", "run", "dev"]
