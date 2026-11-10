# PaikarMart multi-stage production image (Node 20)
# Note: pnpm-lock.yaml is optional; install falls back when lockfile is absent.

# ------------------------------------------------------------------------------
# Stage 1: Base
# ------------------------------------------------------------------------------
FROM node:20.12.0-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.1.0 --activate

# ------------------------------------------------------------------------------
# Stage 2: Dependencies
# ------------------------------------------------------------------------------
FROM base AS dependencies
COPY package.json pnpm-workspace.yaml* pnpm-lock.yaml* .npmrc* ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/frontend/package.json ./apps/frontend/package.json
COPY packages/database/package.json ./packages/database/package.json
# Prefer frozen lockfile when present; otherwise install without freeze (repo may lack lockfile)
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; else pnpm install; fi

# ------------------------------------------------------------------------------
# Stage 3: Builder
# ------------------------------------------------------------------------------
FROM base AS builder
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=dependencies /app/apps/frontend/node_modules ./apps/frontend/node_modules
COPY --from=dependencies /app/packages ./packages
COPY . .
# Generate Prisma client + build backend
WORKDIR /app/packages/database
RUN npx prisma generate || true
WORKDIR /app/apps/backend
RUN pnpm run build

# ------------------------------------------------------------------------------
# Stage 4: Production Runner
# ------------------------------------------------------------------------------
FROM node:20.12.0-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat
ENV NODE_ENV=production
ENV PORT=10000
USER node
COPY --chown=node:node --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --chown=node:node --from=dependencies /app/node_modules ./node_modules
COPY --chown=node:node --from=dependencies /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --chown=node:node --from=builder /app/packages/database/prisma ./packages/database/prisma
COPY --chown=node:node --from=builder /app/apps/backend/package.json ./apps/backend/package.json
COPY --chown=node:node --from=builder /app/package.json ./package.json
WORKDIR /app/apps/backend
EXPOSE 10000
CMD ["node", "--no-deprecation", "dist/server.js"]
