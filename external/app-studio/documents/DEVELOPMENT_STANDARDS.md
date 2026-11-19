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
   * Never create duplicate Zustand stores, duplicate API clients, duplicate storefront/address components, or thin wrapper files in `hubs/*`.
   * Search `apps/frontend/src/features/`, `apps/frontend/src/portals/`, and `apps/frontend/src/shared/` first; extend or compose existing modules cleanly.
3. **Never Copy Raw Mock Scripts from Legacy Archives:**
   * When porting features from `PaikarMart-web-main`, translate business logic into our **Feature-First Monorepo** (`apps/backend/modules/*` + `packages/shared/*` + `apps/frontend/src/{app,design-system,features,hubs,portals,shared}/*`).
   * Strip hardcoded pricing/fare math from UI components, remove `window.alert`/`window.prompt`, remove UI demo role-switchers, and replace fake static arrays with real API + offline fallback adapters.
4. **Hub-First Extension Rule:**
   * Register new marketplace/service experiences inside `src/hubs/shared/portalRegistry.ts` (`marketplacePortals` / `servicePortals`) and keep full page components cleanly in `src/portals/`.
   * Do not add a new Bottom Navigation item for a child portal.
   * Do not create a second CategoryBar containing hub entry buttons; hub switching belongs to Bottom Navigation or Explore.
   * Child portal selection must preserve the hub shell and update only the active portal, feed query, and category chips.

---

## 2. Hard Code, Security & Architectural Constraints

1. **Backend-Authority API Rule (No Client-Side Privileged Writes):**
   * Financial balances, escrow holds/releases, server-calculated order totals, KYC status transitions, vendor analytics ownership checks, conversation ACLs, and tariff/geofence math MUST execute inside `apps/backend/modules/<domain>/` — never trust client-submitted order prices, KYC auto-approve flags, or raw profile IDs.
2. **Route Guard Enforcement:**
   * Protected user portals (`/portal/orders`, `/portal/wallet`, `/portal/messages`, `/portal/profile` self-cockpit) MUST wrap with `AuthGuard` (`@/app/guards/AuthGuard`).
   * Merchant & Governance portals (`/portal/seller`, `/portal/seller/inventory`, `SuperAdminControlModal`) MUST enforce `RoleGuard` (`@/app/guards/RoleGuard`) and server-verified permissions.
3. **Zero Cross-App Boundary Imports & Dependency Direction:**
   * `apps/backend` and `apps/frontend` MUST communicate strictly over HTTP (`/api/*`) and share static types/role configs via `packages/shared`. Backend files MUST NEVER import from `apps/frontend/src/`.
   * Frontend `features/*`, `design-system/*`, and `shared/*` MUST NEVER import from `portals/*` or `app/*`.
4. **Absolute Path Aliasing (`@/` & `@firebase-config`):**
   * Always import cross-directory modules inside `apps/frontend/src/` using `@/` (e.g., `import { useLogisticsStore } from '@/features/logistics';`) and root Firebase config via `@firebase-config`. Never write `../../../` parent chains.
5. **Secrets & Environment Hygiene:**
   * Never store `GEMINI_API_KEY`, DB connection strings, or service-role tokens in `VITE_*` variables.
   * Backend reads runtime config through `apps/backend/config/env.ts` and Supabase clients through `apps/backend/config/supabaseAdmin.ts`.
   * Never render API-key input UI; route all AI calls cleanly via `/api/ai/*` or `/api/catalog/verify-product`.
6. **Clean Production UI & No Browser Dialogs:**
   * Replace `alert()`, `confirm()`, and `prompt()` with accessible React modals/drawers and toast feedback.
   * Never render internal telemetry, console dumps, or raw stack traces in UI views.
7. **Mixed Feed Contract:**
   * Hub feeds must render typed `HubFeedCard` variants and support explicit loading, empty, error, and offline fallback states.
   * Product/service category chips must be driven by the active portal registry entry (`src/hubs/shared/portalRegistry.ts`), never by duplicated hardcoded lists in page components.
8. **Catalog Source-of-Truth Rule:**
   * Public marketplace cards must read from `GET /api/catalog/products`, which projects active `seller_listings` joined strictly with verified `master_products` (`is_verified = true`) and verified `stores` (`is_verified = true`).
   * Local mock catalog data remains an explicit offline/dev fallback only when Supabase is unconfigured or returns an empty catalog. It must never override a non-empty API response.

---

## 3. Master Build & Migration Roadmap (Updated Post-Audit)

### Completed Foundation
* [x] **Phase 1 — Messaging & Gemini AI Bridge:** Live buyer–vendor chat integrated with Gemini AI assistant (`/api/ai`, `/api/messages`).
* [x] **Phase 2 — B2B Wholesale, Wallet & Escrow (`Option 1`):** Tiered MOQ slabs, RFQ quoting (`useB2BStore`), Dual BDT (`৳`) Wallet & PK Coins, Escrow hold/release ledger, and `WalletModal`.
* [x] **Phase 3A — Courier Waybills & Order Lifecycle (`Option 2 Core`):** `apps/backend/modules/orders` + `apps/backend/modules/logistics`, `features/logistics` store & `LogisticsLivePanel`, BDT conversion in `Orders Hub`, Reorder, Confirm Delivery OTP & Guest Order Tracker.
* [x] **Phase 3B — Interactive User & Vendor Guide:** `/portal/guide` + `/documents/USER_AND_VENDOR_GUIDE.md`.
* [x] **Phase 3C — Logistics Ecosystem 4-Sub-Portal Redesign:** Split `portals/transit-logistics` into the 4 clean Sub-Portals (`Ride & Instant Fleet`, `Courier & Multi-Stop`, `Cargo & Rentals`, `Role-Gated Fleet Console`), with server-side tariff/geofence/surge math.
* [x] **Phase 4 — Seller Central Analytics, Real KYC Pipeline & Guarded Profiles (`Option 3`):** Shared roles & Trust Levels in `packages/shared`, `RoleGuard` enforcement, 5-step KYC pipeline (`/api/vendors/register`), and unified `ProfilePortal` + `PublicStorefront`.
* [x] **Phase 5 — Hyperlocal Geofence & Unified `@handle` Profile (`Option 4`):** Single public `@handle` profile (`/u/:handle` zero-PII backend projection) + live `1–20 km` Haversine geofence radar.
* [x] **Phase 6 — Production Database Sync, Security Rules & Deployment Verification:** Synced `packages/database/prisma/schema.prisma` with `supabase/schema.sql`, enforced zero-trust RLS & `firestore.rules`, aligned `vercel.json`/`firebase.json`/`render.yaml`/`package.json`/`server.ts`.
* [x] **Phase 7A — API-First Marketplace Catalog:** Server-only `GET /api/catalog/products` projection paired with offline dev fallback.
* [x] **Phase 7B — Security Hardening & Modular Structure Blueprint Sync (`2026-11-17`):** Removed KYC auto-approve bypasses & stripped vendor PII from public responses, enforced conversation/order/analytics ownership ACLs and server-authoritative order pricing, consolidated duplicate UI (`VendorOnboardingModal`, `SavedAddressesTab`), fixed `PortalFilterType` dependency inversion & `@firebase-config` alias, and organized frontend `src/{app,design-system,hubs,shared}` + backend `{config,modules}` layers.

* [x] **Phase 8A — Pure Infrastructure `src/lib/` & Registry Consolidation:** Migrated domain helpers (`commerceUtils`, `hyperlocal`, `masterCatalogFallback`, `userVerification`) into `features/{marketplace,logistics,auth}`, unified `CategoryBar` on `portalRegistry.ts`, and added `apps/backend/tsconfig.json`.
* [x] **Phase 8B — Live Production DB, Persistent Wallet/Escrow & External Courier Adapters:** Added Supabase PostgreSQL read/write adapters for `wallet_transactions`, `escrow_records`, and `shipment_waybills`, signed `POST /api/wallet/webhooks/payment` & `POST /api/logistics/webhooks/:partner` HMAC/secret verification, partner status normalization (`Steadfast`, `Pathao`, `RedX`, `PaikarForce`), and fail-closed `503`/`401` guards when DB or webhook secrets are absent.

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
   npx tsc --noEmit --project apps/backend/tsconfig.json
   ```
   *(Must exit `0` with zero missing imports or type errors.)*
