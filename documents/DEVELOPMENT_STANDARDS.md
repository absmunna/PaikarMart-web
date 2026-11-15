# PaikarMart Development Standards, Build Guidelines & AI Agent SOP

All engineers and AI coding agents MUST follow this workflow when auditing, modifying, or extending PaikarMart.

**Architecture mode:** HUB-FIRST. Marketplace and Services are persistent hub shells; child portals are registered modules inside those shells.

---

## 1. Mandatory Pre-Work Rules for AI Agents

1. **Read the Full Blueprint Suite First:** Before planning or editing code, inspect:
   * `/documents/MASTER_SPECIFICATION.md` (Goals, Canonical Portals, RBAC & Trust Levels 0–7)
   * `/documents/ARCHITECTURE_AND_MODULARITY.md` (Root-to-Leaf Directory, Routes, Entity Relationships, Monorepo Isolation)
   * `/documents/DESIGN_SYSTEM_AND_UI.md` & `/documents/CTA_DESIGN_SYSTEM.md` (Adaptive Light/Dark UI, Zero-Pill, BDT `৳` rules)
   * `/documents/DATABASE_AND_DEPLOYMENT.md` (Schema, RLS/Firestore rules, Env Vars, Build & Cloud Deployment)
   * Feature-specific blueprints (`/documents/LOGISTICS_ECOSYSTEM_BLUEPRINT.md`, `/documents/USER_AND_VENDOR_GUIDE.md`)
2. **Audit Before Creating (`grep` Rule):**
   * Never create duplicate Zustand stores, duplicate API clients, duplicate storefront components, or shadow portal directories.
   * Search `apps/frontend/src/features/` and `apps/frontend/src/portals/` first; extend or compose existing modules cleanly.
3. **Never Copy Raw Mock Scripts from Legacy Archives:**
   * When porting features from `PaikarMart-web-main`, translate business logic into our **Feature-First Monorepo** (`apps/backend/*` + `packages/shared/*` + `apps/frontend/src/features/*` + `apps/frontend/src/portals/*`).
   * Strip hardcoded pricing/fare math from UI components, remove `window.alert`/`window.prompt`, remove UI demo role-switchers, and replace fake static profile/product arrays with real API + fallback adapters.
4. **Hub-First Extension Rule:**
   * Add a new marketplace/service/logistics experience under the owning hub's `portals/` directory and register it in the hub registry.
   * Do not add a new Bottom Navigation item for a child portal.
   * Do not create a second CategoryBar containing hub entry buttons; hub switching belongs to Bottom Navigation or Explore.
   * Child portal selection must preserve the hub shell and update only the active portal, feed query, and category chips.

---

## 2. Hard Code, Security & Architectural Constraints

1. **Backend-Authority API Rule (No Client-Side Privileged Writes):**
   * Financial balances, escrow holds/releases, order creation, KYC status transitions, and tariff/geofence math MUST execute through `/api/*` Express endpoints—never mutate `role`, `wallet_balance`, or `escrow` directly from client Firestore calls.
2. **Route Guard Enforcement:**
   * Protected user portals (`/portal/orders`, `/portal/wallet`, `/portal/messages`, `/portal/profile` self-cockpit) MUST require authenticated user context.
* Consumer profile updates MUST be scoped to the authenticated Firebase UID. Firebase account email/password and Supabase private address records MUST NOT be trusted from caller-supplied identity fields.
   * Merchant & Governance portals (`/portal/seller`, `SuperAdminControlModal`) MUST verify `vendor` (KYC approved) or `admin`/`super_admin` permissions—never leave `/seller/*` wide open like the ZIP's `portal.routes.tsx`.
3. **Zero Cross-App Boundary Imports:**
   * `apps/backend` and `apps/frontend` MUST communicate strictly over HTTP (`/api/*`) and share static types/role configs via `packages/shared`. Backend files MUST NEVER import from `apps/frontend/src/`.
4. **Absolute Path Aliasing (`@/`):**
   * Always import cross-directory modules inside `apps/frontend/src/` using `@/` (e.g., `import { useLogisticsStore } from '@/features/logistics';`). Never write `../../../` relative imports.
5. **Secrets & Environment Hygiene:**
   * Never store `GEMINI_API_KEY`, DB connection strings, or service-role tokens in `VITE_*` variables.
   * Never render API-key input UI; route all AI calls cleanly via `/api/ai/*` or `/api/catalog/verify-product`.
6. **Clean Production UI & No Browser Dialogs:**
   * Replace `alert()`, `confirm()`, and `prompt()` with accessible React modals/drawers and toast feedback.
   * Never render internal telemetry, console dumps, or raw stack traces in UI views.
7. **Mixed Feed Contract:**
   * Hub feeds must render typed `HubFeedCard` variants and support explicit loading, empty, error, and offline fallback states.
   * Product/service category chips must be driven by the active portal registry entry, never by duplicated hardcoded lists in page components.
8. **Catalog Source-of-Truth Rule:**
   * Public marketplace cards must read from `GET /api/catalog/products`, which projects active `seller_listings` joined with verified catalog data and active stores.
   * `master_products` owns canonical title, category, brand, images, and specifications; `seller_listings` owns seller price, stock, offer photos, and trade mode; `stores` owns seller-facing shop identity.
   * Local mock catalog data may remain only as an explicit offline/dev fallback when Supabase is unconfigured or returns an empty catalog. It must never override a non-empty API response.

---

## 3. Master Build & Migration Roadmap (Updated Post-Audit)

### Completed Foundation
* [x] **Phase 1 — Messaging & Gemini AI Bridge:** Live buyer–vendor chat integrated with Gemini AI assistant (`/api/ai`, `/api/messages`).
* [x] **Phase 2 — B2B Wholesale, Wallet & Escrow (`Option 1`):** Tiered MOQ slabs, RFQ quoting (`useB2BStore`), Dual BDT (`৳`) Wallet & PK Coins, Escrow hold/release ledger, and `WalletModal`.
* [x] **Phase 3A — Courier Waybills & Order Lifecycle (`Option 2 Core`):** `apps/backend/orders` + `apps/backend/logistics`, `features/logistics` store & `LogisticsLivePanel`, BDT conversion in `Orders Hub`, Reorder, Confirm Delivery OTP & Guest Order Tracker.
* [x] **Phase 3B — Interactive User & Vendor Guide:** `/portal/guide` + `/documents/USER_AND_VENDOR_GUIDE.md`.

### Active & Upcoming Execution Phases
* [ ] **Phase 0 — Hub Shell Migration:** Create typed Marketplace/Services hub registries, move mixed feeds into hub shells, keep legacy routes as thin wrappers, and migrate child portals incrementally without copying raw legacy files.
* [x] **Phase 3C — Logistics Ecosystem 4-Sub-Portal Redesign:** Split `portals/transit-logistics` into the 4 clean Sub-Portals (`Ride & Instant Fleet`, `Courier & Multi-Stop`, `Cargo & Rentals`, `Role-Gated Fleet Console`), execute all tariff/geofence/surge math in `apps/backend/logistics/`, and implement 3-Step POD + Reverse Returns (per `LOGISTICS_ECOSYSTEM_BLUEPRINT.md`).
* [x] **Phase 4 — Seller Central Analytics, Real KYC Pipeline & Guarded Profiles (`Option 3`):**
  * Move shared roles & Trust Levels (0–7) into `packages/shared`.
  * Enforce Role Guards on `/portal/seller` and `SuperAdminControlModal`.
  * Wire real 5-step KYC submission (`NID`, `Trade License`, `TIN`, `Bank/bKash/Nagad`) through `/api/vendors/register`, merchant inventory/PMIN offer CRUD, and replace mock profile/storefront components with one unified, dynamic `ProfilePortal` + `PublicStorefront`.
* [x] **Phase 5 — Hyperlocal Local-Hub & Services Geofence + Unified `@handle` Profile (`Option 4`):** Implemented single public `@handle` profile (`/u/:handle` zero-PII backend projection + feed-to-store links uniting Posts, Shop & Services) and connected `services-hub` & `marketplace` to the live `1–20 km` (`5 km` default) Haversine Geofence API (`prepTime + transitTime` ETA, Open/Close shop state, in-app storekeeper chat, and slot booking with `5%` advance wallet discount).
* [x] **Phase 6 — Production Database Sync, Security Rules & Deployment Verification:** Synced `packages/database/prisma/schema.prisma` 1:1 with `supabase/schema.sql`, enforced zero-trust RLS + `public_handle_profiles` Zero-PII view + hardened `firestore.rules` (deployed to project Firestore), aligned `vercel.json`/`firebase.json`/`render.yaml`/`package.json`/`server.ts` production dist routing, and passed all verification gates.
* [x] **Phase 7A — API-First Marketplace Catalog:** Added the server-only `GET /api/catalog/products` projection for active multi-vendor listings and wired the Marketplace state to hydrate from it, retaining an offline fallback only when the database is unavailable or has no published listings.

---

## 4. Mandatory Verification Gates (Before Completing Any Code Change)

Every code implementation task MUST pass all three verification commands cleanly before reporting completion:

1. **Frontend Production Build:**
   ```bash
   npm run build
   ```
   *(Runs `vite build` to `apps/frontend/dist` + `esbuild` bundling `apps/backend/server.ts` -> `server.js` with zero errors.)*
2. **Frontend TypeScript Check (`lint_applet`):**
   ```bash
   npm run lint
   ```
   *(Runs `tsc --noEmit --project apps/frontend/tsconfig.json` — must exit `0`.)*
3. **Backend TypeScript Check:**
   ```bash
   npx tsc --noEmit --target ES2022 --module ESNext --moduleResolution bundler --skipLibCheck apps/backend/server.ts
   ```
   *(Must exit `0` with zero missing imports or type errors.)*
