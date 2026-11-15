# PaikarMart Database, Security Rules & Multi-Cloud Deployment Blueprint

This document defines the authoritative **Data Persistence**, **Security / Access Control Rules**, **Environment Contract**, and **Multi-Cloud Build & Deployment Pipeline** for PaikarMart.

---

## 1. Hybrid Data Authority & Free-Tier Quota Protection

PaikarMart uses a multi-layer persistence architecture designed to combine strict relational integrity with real-time UX and zero-cost scalability:

| Layer | Technology | Authoritative Responsibility | Quota / Guardrails |
| :--- | :--- | :--- | :--- |
| **Identity & Session** | **Firebase Authentication** | Sign-up/login (Email, Google, Phone OTP), JWT `idToken` issuance, user `uid` anchor | Client never trusts UI-stored roles; verify `idToken` or authenticated session on server |
| **Core Relational Truth** | **PostgreSQL (Supabase + Prisma ORM)** | `profiles`, `private_user_details` (PII), `stores`, `master_products`, `seller_listings`, `orders`, `wallet_transactions`, `escrow_records`, `shipments` | Connect via Transaction Pooler (port `6543`); **Do NOT enable Supabase Realtime** (saves connection pool) |
| **Realtime Sync & Media** | **Firebase Firestore & Storage** | Live notifications, chat thread snapshots, KYC/product file uploads | Firestore and Storage rules use default-deny plus UID ownership; private documents are owner-only |
| **Local / Offline Dev** | **Express In-Memory + `localStorage` Adapter** | Instant preview inside AI Studio sandbox when external DB credentials are absent | Never overrides production API truth when DB/backend is live |

---

## 2. Database Schema & Security Isolation (`supabase/schema.sql` & `packages/database`)

### A. Canonical Tables & PII Separation
1. **`public.profiles` (Public Identity):** `id`, `auth_uid` (Firebase UID), `email`, `phone`, `name`, `handle`, `avatar_url`, `role`, `active_roles[]`, `trust_level` (0–7), `wallet_balance`, `reward_points`, `is_verified`.
2. **`public.private_user_details` (Strict PII Isolation):** `profile_id` (FK), `nid_passport_number`, `emergency_phone`, `full_delivery_address`, `tax_identification_no`, `payout_bank_name`, `payout_account_no`, `payout_routing_no`.
   * *Security Rule:* Viewable **ONLY** by the account owner (`profile_id = current_profile_id()`) or `admin`/`super_admin`. Never returned in public storefront or feed queries.
3. **`public.stores` (Multi-Vendor Entities):** `id`, `owner_id`, `store_name`, `legal_entity_name`, `business_reg_no`, `tax_id`, `category`, `status` (`active | pending | suspended`), `commission_tier`, `rating`, `total_sales`, plus hyperlocal coordinates (`lat`, `lng`, `service_radius_km`, `is_open`, `prep_minutes`).
4. **`public.master_products` & `public.seller_listings` (`1:N` PMIN Buy-Box):**
   * `master_products`: canonical `barcode`, `title_en`, `title_bn`, `brand`, `category`, `canonical_images`, `specifications`, `is_verified`.
   * `seller_listings`: links `master_product_id` + `store_id` + `seller_id` with `price`, `stock_quantity`, `trade_mode` (`retail | wholesale`), `min_wholesale_qty`, `wholesale_tiers` JSONB, `delivery_eta`.
5. **`public.catalog_submissions`:** AI pre-audit scores (`ai_confidence_score`, `ai_audit_notes`) + moderator review status (`pending_review | approved | rejected`).
6. **`public.master_services` & `public.provider_service_offers`:** Service checklists, estimated duration, provider `base_rate`, and `service_radius_km`.
7. **`public.social_posts` & `public.social_comments`:** Author link, media URL, optional `tagged_product_id`, reaction counters, and moderation controls.
8. **`public.orders`, `escrow_records`, & `shipment_waybills`:** Idempotent order placement (`idempotency_key`), itemized JSONB snapshot, BDT totals (`subtotal`, `delivery_fee`, `tax`, `total`), `status`, 4-digit `delivery_otp`, courier partner, and POD status.

### B. Zero-Trust Row Level Security (`supabase/schema.sql`) & `firestore.rules`
* **Default Deny:** All Firestore collections deny read/write unless explicitly matched (`allow read, write: if false;`).
* **Anti-Privilege Escalation:** Users can update their own profile metadata, **but RLS & `firestore.rules` block any client update that mutates `role`, `active_roles`, or `is_verified`** unless executed by `super_admin` or trusted backend service.
* **Financial API Authentication:** Wallet and escrow API routes require Firebase ID tokens verified with Firebase Admin (`FIREBASE_PROJECT_ID` plus Application Default Credentials/service identity). User IDs supplied by the client are never identity authority.
* **Financial Fail-Closed State:** Deposit, withdrawal, transfer, coin redemption and escrow mutations remain unavailable until persistent ledger transactions and verified payment/order callbacks are configured. UI must not report client-side/local balance changes as completed transactions.
* **Firebase Storage:** Deploy `storage.rules`; avatars and videos are readable, while uploaded KYC/business documents remain owner-only. Rules enforce per-folder MIME and size limits.
* **Strict Order Privacy:** Customers see only their own orders (`buyer_id` / `customer_id`); vendors see only orders targeting their store; riders see only assigned deliveries; `moderator`/`admin`/`super_admin` have audited read access.
* **Catalog Public Read / Vendor Own Write:** Anyone can read `active` stores, `master_products`, and `seller_listings`; only `has_role('vendor')` owning the parent `store_id` can insert/update/delete their own listings.

---

## 3. Environment Variables Contract (`.env.example`)

**Strict Rule:** Never place private credentials inside `VITE_*` variables (Vite bundles `VITE_*` directly into public browser JS).

| Variable | Scope | Purpose |
| :--- | :--- | :--- |
| `PORT` | Server (`3000` dev / `10000` Render) | Express API & Vite dev middleware port |
| `NODE_ENV` | Server (`development \| production`) | Switches Vite middleware vs static `apps/frontend/dist` serving |
| `APP_URL` | Server | Canonical hosted origin for callbacks & self-links |
| `GEMINI_API_KEY` | **Server-Only Secret** | Server-side `@google/genai` proxy (`/api/ai/*`, `/api/catalog/verify-product`) |
| `FIREBASE_PROJECT_ID` | Server | Firebase Admin ID-token audience validation |
| Application Default Credentials | Server-only credential | Firebase Admin verification; use the hosting platform's service identity or `GOOGLE_APPLICATION_CREDENTIALS` for local development |
| `CORS_ORIGINS` | Server | Comma-separated exact production frontend origins; local loopback origins are allowed in development |
| `DATABASE_URL` | **Server-Only Secret** | Prisma PostgreSQL Transaction Pooler URI (port `6543`) |
| `SUPABASE_URL` / `SUPABASE_ANON_KEY` | Server / Client (Safe Public) | Supabase REST adapter guarded by RLS |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | Client (Safe Public) | Frontend Supabase client (never Service Role key) |
| `VITE_FIREBASE_*` (`API_KEY`, `AUTH_DOMAIN`, `PROJECT_ID`, `STORAGE_BUCKET`, `MESSAGING_SENDER_ID`, `APP_ID`) | Client (Public SDK Config) | Firebase Authentication & Firestore SDK initialization |

---

## 4. Build Pipeline & Multi-Cloud Deployment Architecture

PaikarMart supports **Single-Server Monolithic Cloud Run / Render** deployment AND **Split Multi-Cloud Free-Tier** deployment from the exact same codebase:

### A. Root Build & Runtime Commands (`package.json`)
```json
"scripts": {
  "dev": "tsx apps/backend/server.ts",
  "build": "vite build --config apps/frontend/vite.config.ts && esbuild apps/backend/server.ts --bundle --platform=node --packages=external --format=esm --outfile=server.js",
  "start": "node server.js",
  "lint": "tsc --noEmit --project apps/frontend/tsconfig.json"
}
```
* **Development (`npm run dev`):** Runs Express (`apps/backend/server.ts`) on port `3000` with Vite middleware (`hmr: false`, `watch: null`) so `/api/*` and React SPA share one origin with zero CORS headaches.
* **Production Build (`npm run build`):**
  1. Compiles React + Tailwind v4 SPA into `apps/frontend/dist/`.
  2. Bundles `apps/backend/server.ts` with `esbuild` into root `server.js` (ESM, external `node_modules`).
  * *(Both `npm start` and `render.yaml` run `node server.js`, and `apps/backend/server.ts` resolves `apps/frontend/dist` cleanly from both root `server.js` and `apps/backend/`.)*

### B. Deployment Topologies

1. **AI Studio / Google Cloud Run (Unified Full-Stack Container):**
   * Runs `npm run build` followed by Express serving `apps/frontend/dist` and `/api/*` on port `3000`.
   * Injects `GEMINI_API_KEY` and `APP_URL` securely at runtime.
2. **Render Web Service (`render.yaml`) — Dedicated API + Static Server:**
   * `buildCommand`: `npm install && npm run build`
   * `startCommand`: `node server.js`
   * Configures `NODE_ENV=production`, `PORT=10000`, `SUPABASE_*`, `FIREBASE_PROJECT_ID`, `GEMINI_API_KEY`.
   * Exposes `/api/health` returning backend, database, auth, and frontend connectivity diagnostics.
3. **Firebase Hosting (`firebase.json`) + Render Backend:**
   * Serves `apps/frontend/dist` globally via CDN with SPA fallback rewrite `** -> /index.html`.
   * Deploys `firestore.rules` alongside hosting updates (`"firestore": { "rules": "firestore.rules" }`).
4. **Vercel (`vercel.json`) + Render Backend:**
   * Builds to `apps/frontend/dist` and proxies `/api/(.*)` directly to `https://paikarmart-backend.onrender.com/api/$1` while rewriting SPA routes `/(.*)` to `/index.html`.

---

## 5. Pre-Deployment Production Checklist

* [ ] Rotate or verify all secrets in cloud host env panel (`GEMINI_API_KEY`, `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`); `.env` is gitignored.
* [x] Sync `packages/database/prisma/schema.prisma` 1:1 with `supabase/schema.sql` (apply in Supabase SQL Editor or `npx prisma migrate deploy` inside `packages/database`).
* [x] Harden and deploy `firestore.rules` (Zero-Trust + Zero-PII `public_profiles` + strict `request.time` & owner checks).
* [x] Align `vercel.json` (`apps/frontend/dist`), `firebase.json` (`firestore.rules`), `render.yaml` (`node server.js`), and `package.json` (`start: node server.js`).
* [x] Confirm all 3 build/typecheck gates exit `0` (`npm run build`, `npm run lint`, backend `npx tsc --noEmit`).
