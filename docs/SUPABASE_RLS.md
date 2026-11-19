# Paikar Mart — Supabase Row Level Security (RLS) Deployment Guide

This guide details how to lock down your Supabase PostgreSQL database so that client-side `anon` and `authenticated` keys cannot directly read or write business tables. All database operations are safely handled server-side by the Express + Prisma backend.

---

## 🚀 Step-by-Step Instructions

1. **Log into Supabase Dashboard**: Navigate to your Supabase project dashboard.
2. **Open SQL Editor**: In the left sidebar, click on **SQL Editor**.
3. **Run Super Admin Policy Helper**:
   - Copy the contents of `supabase/sql/01_super_admin_rls_policies.sql`.
   - Paste into the SQL Editor and click **Run**.
4. **Enable RLS on All Tables**:
   - Copy the contents of `supabase/sql/02_enable_rls_all_tables.sql`.
   - Paste into the SQL Editor and click **Run**.

---

## ✅ Verification Checklist

To verify that RLS is successfully enabled and locked down:

- [ ] Run the following query in the Supabase SQL Editor to check RLS status on all tables:
  ```sql
  SELECT tablename, rowsecurity 
  FROM pg_tables 
  WHERE schemaname = 'public';
  ```
  *All business tables (`User`, `Product`, `Order`, `Wallet`, etc.) should show `rowsecurity = true`.*

- [ ] Verify that no direct client queries can bypass security:
  - Attempting to query `SELECT * FROM "User"` via the Supabase client SDK using the `anon` key should return zero rows or an empty result set.
  - The Express backend (connected via Prisma using the database connection string) continues to operate normally.
