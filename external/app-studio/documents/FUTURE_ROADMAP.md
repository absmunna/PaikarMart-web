# PaikarMart Hub & Portal Roadmap (Post-Blueprint Status)

This roadmap tracks completed milestones and upcoming production expansions aligned with `/documents/MASTER_SPECIFICATION.md`, `/documents/ARCHITECTURE_AND_MODULARITY.md`, `/documents/LOGISTICS_ECOSYSTEM_BLUEPRINT.md`, `/documents/DEVELOPMENT_STANDARDS.md`, and `/documents/DATABASE_AND_DEPLOYMENT.md`.

---

## Completed Blueprint Milestones (Phases 1 – 8C)

### Foundation & Core Hubs (`Phases 1 – 6`)
- [x] **Messaging & Gemini AI Bridge:** Live buyer–vendor chat + AI Co-Pilot (`/api/ai`, `/api/messages`, `portals/messages`).
- [x] **B2B Wholesale, Wallet & Escrow (`Option 1`):** Tiered MOQ slabs, RFQ quoting (`features/b2b`), BDT (`৳`) Wallet & PK Coins, Escrow hold/release ledger, and `WalletModal`.
- [x] **Logistics Ecosystem 4-Sub-Portal Redesign (`Phase 3A–3C`):** 4 clean Logistics Sub-Portals (`Instant Ride`, `Parcel & Waybill`, `Cargo & Rentals`, `Role-Gated Fleet Console`) in `portals/transit-logistics`, backed by server-side tariff, surge & Haversine geofence math (`apps/backend/modules/logistics`).
- [x] **Interactive User & Vendor Handbook:** `/portal/guide` synced with `/documents/USER_AND_VENDOR_GUIDE.md`.
- [x] **Seller Central, Real KYC & Guarded Profiles (`Phase 4`):** Shared RBAC & Trust Levels (0–7) in `packages/shared`, `RoleGuard` enforcement on `/portal/seller`, 5-step KYC pipeline (`/api/vendors/register`), `ProfilePortal`, and `PublicStorefrontPage`.
- [x] **Hyperlocal Geofence & Unified `@handle` Profile (`Phase 5`):** Single zero-PII public `@handle` storefront (`/u/:handle`, `/store/:storeId`) + live `1–20 km` Haversine geofence radar.
- [x] **Database Sync, RLS & Deployment Configs (`Phase 6`):** Synced `packages/database/prisma/schema.prisma` with `supabase/schema.sql`, zero-trust RLS + `firestore.rules`, and `vercel.json` / `firebase.json` / `render.yaml`.

### Hub-First Modularity & Live Production Hardening (`Phases 7A – 8C`)
- [x] **API-First PMIN Master Catalog (`Phase 7A`):** Server-authoritative `GET /api/catalog/products` projecting verified `master_products` + `seller_listings` + verified `stores` with offline fallback when Supabase is unconfigured.
- [x] **Security Hardening & Modular Blueprint (`Phase 7B`):** Server-priced orders (`X-Idempotency-Key`), conversation & analytics ACLs, PII stripping on public responses, and `src/{app,design-system,hubs,shared}` + `apps/backend/{config,modules}` isolation.
- [x] **Pure Infrastructure `src/lib/` & Registry Consolidation (`Phase 8A`):** Domain utilities isolated in `features/{marketplace,logistics,auth}`, `CategoryBar` unified with `portalRegistry.ts`, and strict `apps/backend/tsconfig.json`.
- [x] **Live Supabase DB & Signed Payment/Courier Webhooks (`Phase 8B`):** Persistent PostgreSQL adapters for `wallet_transactions`, `escrow_records`, and `shipment_waybills`; HMAC/secret-verified `POST /api/wallet/webhooks/payment` & `POST /api/logistics/webhooks/:partner` (`Steadfast`, `Pathao`, `RedX`, `PaikarForce`).
- [x] **4-Hub Registry, Portal Naming & Canonical Page Structure (`Phase 8C`):**
  - Completed all 4 canonical hubs in `src/hubs/` (`marketplace-hub`, `services-hub`, `community-hub`, `utility-hub`) registered in `src/hubs/shared/portalRegistry.ts`.
  - Standardized portal routes & labels across `ExplorePortal`, `CategoryBar`, `BottomNav`, `UnifiedSidebar`, `routeManifest.tsx`, and EN/BN locales.
  - Added dedicated `src/portals/messages/` (`MessagesPortal`) and standardized every `src/portals/*/pages/*.tsx` filename (`SocialPortal`, `MarketplacePortal`, `ServicesPortal`, `TransitPortal`, `CreatorPortal`, `OrdersPortal`, `SettingsPortal`, `NotificationsPortal`, `ProfilePortal`).
- [x] **Dynamic Context-Aware Portals (`Phase 8D`):**
  - Built dedicated `DemandBoardPortal` (`/portal/demand`) and `NearbyRadarPortal` (`/portal/nearby`) in `src/portals/` powered by modular `src/features/demand` and `src/features/logistics`.
  - Implemented dynamic context-aware domain filtering (`?hub=marketplace|services|logistics` or tab switches) for live buyer RFQ demands and hyperlocal GPS vendor/rider radar (`0.5–20km`).
  - Integrated routes into `routeIds.ts`, `routeManifest.tsx`, `App.tsx`, `portalsData.ts`, and hub configurations with zero code duplication.
- [x] **Hub-Categorized Portal & 4-Hub Architecture (`Phase 8E – 8F`):**
  - Standardized all domain portals under `src/portals/{marketplaces,services,logistics,community,utilities,shared}` with central barrel exports (`index.ts`).
  - Completed all 4 canonical Hub shells & Mixed Feeds under `src/hubs/{marketplace-hub,services-hub,community-hub,utility-hub}` with registry-driven child portal dispatch (`portalRegistry.ts`), `/hub/*` routes, and 4-Hub navigation across `ExplorePortal`, `UnifiedSidebar`, `SuperAppHubModal`, and `CategoryBar`.
  - Built `ExportDutyCalculator` (`features/b2b` + `portals/marketplaces/wholesale`) supporting HS codes, FOB/CIF/EXW freight & customs estimation, BD cash incentive references, `BDT / USD / EUR` conversion, and Commercial Invoice / Packing List preview.

---

## Upcoming Production Roadmap (Phases 9 – 11)

### Phase 9: Live Supabase Seed & Production Gateway Activation
- **Supabase Catalog & Merchant Seeding:** Populate verified `master_products`, `stores`, and `seller_listings` in live Supabase PostgreSQL (`supabase/schema.sql`) and verify zero fallback usage in production builds.
- **Live bKash / Nagad / SSLCommerz & Courier APIs:** Connect live merchant callback secrets (`PAYMENT_WEBHOOK_SECRET`, `STEADFAST_WEBHOOK_SECRET`, `PATHAO_WEBHOOK_SECRET`, `REDX_WEBHOOK_SECRET`) to settle real wallet top-ups, escrow payouts, and automated courier status updates.

### Phase 10: Real-Time Hub Dispatch & Telemetry
- **WebSocket / Supabase Realtime Subscriptions:** Live rider GPS coordinates, order status stream, and instant buyer–seller quote updates inside `portals/community/messages` and `portals/utilities/orders-hub`.

### Phase 11: Native Mobile Wrapper & Offline-First PWA
- **PWA / Capacitor Mobile Packaging:** Installable mobile shell, Web Push order milestone notifications, and background GPS telemetry for verified `rideshare_driver` partners.
