# Paikar Mart — Supabase Infrastructure & Security Audit

This document outlines the database configuration and security model for the Supabase Free PostgreSQL integration.

## 🗄️ Connection Strategy (Prisma)

To stay within the connection limits of the Supabase Free tier, Paikar Mart uses two distinct connection strings:

1.  **`DATABASE_URL`**: Used for standard application access. 
    *   **Port**: `6543` (Supabase Transaction Pooler).
    *   **Reasoning**: Prevents connection exhaustion by using PgBouncer.
    *   **Constraint**: Must include `?pgbouncer=true` and `connection_limit=1`.

2.  **`DIRECT_URL`**: Used exclusively for Prisma migrations (`npx prisma migrate`).
    *   **Port**: `5432` (Direct PostgreSQL connection).
    *   **Reasoning**: Required for DDL operations that are incompatible with PgBouncer.

## 🛡️ Row Level Security (RLS) & Authorization

Paikar Mart follows a **"Zero-Trust Baseline"** for client-side database access.

*   **Firebase as IDP**: Identity is managed by Firebase Auth. Since Firebase JWTs are not verified by Supabase Auth automatically, `auth.uid()` in RLS is effectively `NULL`.
*   **Disabled Client Access**: RLS is enabled on all tables (see `/supabase/sql/02_enable_rls_all_tables.sql`), but **NO policies** are granted to `anon` or `authenticated` roles.
*   **Backend Authority**: All business logic and data access must go through the **Express Backend**. The backend uses Prisma with a privileged role that bypasses RLS, making API-level authorization checks mandatory.
*   **Frontend SDK Usage**: The Supabase SDK (`supabase.ts`) is reserved for public features (like Storage downloads) that do not require business-table access.

## 📊 Supabase Free Tier Quotas (Spark Compatibility)

| Resource | Limit | Action on Exhaustion |
| :--- | :--- | :--- |
| **Database Size** | ~500 MB | Project enters read-only mode. Use `FileAsset` for large files. |
| **Active Projects** | 2 | Projects paused after 7 days of inactivity. |
| **Direct Connections** | ~60 | Use Transaction Pooler (Port 6543). |
| **Egress** | 2 GB / month | Monitor large file downloads via Storage. |

## 🧪 Security Checklist
- [x] No `VITE_SUPABASE_SERVICE_ROLE_KEY` in frontend.
- [x] No DB passwords in client-side code.
- [x] Transaction pooling configured for production.
- [x] RLS enabled on all existing Prisma tables.
- [x] Mandatory API checks for user ownership on all endpoints.
