# 🗄️ Paikar Mart - Database Migrations & Baselining Guide

This document outlines the standard procedure for managing Prisma database migrations in production and development environments.

## 📌 Architecture Rules
1. **Never run `prisma db push` or automatic seeding in production.**
2. Use **`prisma migrate deploy`** for all production deployments.
3. Keep **`DATABASE_URL`** (Transaction pooler) and **`DIRECT_URL`** (Direct connection) configured properly in your environment variables.

---

## 🚀 1. Running Migrations in Production (Render / CI)
The backend build and start steps execute:
```bash
npm run db:migrate:deploy
```
This command runs `prisma migrate deploy`, which applies any pending migration files located in `packages/database/prisma/migrations` safely and sequentially against your PostgreSQL database (Supabase).

---

## 🛠️ 2. Creating New Migrations (Local Development)
When modifying the schema in `packages/database/prisma/schema.prisma`, generate a new migration locally using:
```bash
npx prisma migrate dev --name <migration_name> --schema=packages/database/prisma/schema.prisma
```
This will create a new migration folder under `packages/database/prisma/migrations/`. Commit this folder to version control.

---

## 🔄 3. Baselining Existing Databases (`prisma migrate resolve`)
If you are connecting Prisma migrations to an **existing database** that was previously initialized (e.g., via `prisma db push` or raw SQL tables), Prisma migration history needs to be baselined so it doesn't attempt to re-create existing tables.

To mark the initial migration as already applied on an existing database without executing it:
1. Ensure your connection strings (`DATABASE_URL` and `DIRECT_URL`) point to the target database.
2. Run the resolve command specifying your initial migration name:
   ```bash
   npx prisma migrate resolve --applied 20261031000000_init --schema=packages/database/prisma/schema.prisma
   ```
3. Verify migration status:
   ```bash
   npx prisma migrate status --schema=packages/database/prisma/schema.prisma
   ```
