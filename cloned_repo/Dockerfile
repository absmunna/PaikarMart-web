# syntax=docker/dockerfile:1

# ------------------------------------------------------------------------------
# Stage 1: Base image with Node 20 & pnpm 9 matching engines specification
# ------------------------------------------------------------------------------
FROM node:20.12.0-alpine AS base

# Install required system tools and OpenSSL for Prisma client
RUN apk add --no-cache libc6-compat openssl
RUN corepack enable && corepack prepare pnpm@9.1.0 --activate

WORKDIR /app

# ------------------------------------------------------------------------------
# Stage 2: Install dependencies
# ------------------------------------------------------------------------------
FROM base AS dependencies

WORKDIR /app

# Copy package manifests and Prisma schema for dependency resolution
COPY package.json pnpm-workspace.yaml* ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/database/prisma ./packages/database/prisma

# Install dependencies with pnpm
RUN pnpm install --frozen-lockfile || pnpm install

# Generate Prisma Client
RUN npx prisma generate --schema=packages/database/prisma/schema.prisma

# ------------------------------------------------------------------------------
# Stage 3: Build backend bundle
# ------------------------------------------------------------------------------
FROM base AS builder

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=dependencies /app/packages/database/prisma ./packages/database/prisma
COPY . .

# Compile backend code via esbuild
WORKDIR /app/apps/backend
RUN pnpm run build

# ------------------------------------------------------------------------------
# Stage 4: Production Runner (Secure, Lean, No Embedded Secrets)
# ------------------------------------------------------------------------------
FROM node:20.12.0-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

# Defaults (overridable at container runtime via env vars or docker-compose)
ENV NODE_ENV=production
ENV PORT=10000

# Run container as non-root node user for container security
USER node

# Copy built server bundle and production runtime modules
COPY --chown=node:node --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --chown=node:node --from=dependencies /app/node_modules ./node_modules
COPY --chown=node:node --from=dependencies /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --chown=node:node --from=builder /app/packages/database/prisma ./packages/database/prisma
COPY --chown=node:node --from=builder /app/apps/backend/package.json ./apps/backend/package.json
COPY --chown=node:node --from=builder /app/package.json ./package.json

WORKDIR /app/apps/backend

EXPOSE 10000

# Start server
CMD ["node", "--no-deprecation", "dist/server.js"]
