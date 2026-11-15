# PaikarMart Future Roadmap (Post-Blueprint Expansion)

This roadmap aligns with the authoritative blueprints in `/documents/MASTER_SPECIFICATION.md`, `/documents/ARCHITECTURE_AND_MODULARITY.md`, `/documents/LOGISTICS_ECOSYSTEM_BLUEPRINT.md`, and `/documents/DATABASE_AND_DEPLOYMENT.md`.

## Phase 1: Logistics Sub-Portals & Backend Tariff Engine (Immediate Next)
- **Server-Side Quote & Geofence Engine:** Dynamic `৳` pricing (`base + km + weight + surge + multi-stop`) and 5km hyperlocal store radius checks inside `apps/backend/logistics/`.
- **4-Sub-Portal Transit UI:** Dedicated clean tabs for Instant Ride, Parcel & Multi-Stop, B2B Cargo & Rentals, and Role-Gated Fleet/Rider Console.
- **3-Step POD & Reverse Returns:** Photo + Digital Signature + Server OTP verification triggering automated Escrow release.

## Phase 2: Seller Central Analytics, Real KYC & Guarded Profiles (`Option 3`)
- **Shared RBAC & Guards:** Move role definitions & Trust Levels (0–7) to `packages/shared` and enforce Auth/Vendor route guards on `/portal/seller`.
- **KYC Document Pipeline:** Validated upload workflow for NID, Trade License, DBID/TIN, and Bank/bKash/Nagad payout setup via `/api/vendors/register`.
- **Unified Profile & Storefront:** Consolidate private `BuyerCockpit` and dynamic `PublicStorefront` driven by real seller offers & merchant analytics charts.

## Phase 3: Hyperlocal Perishables, Grocery & Pharmacy Hub (`Option 4`)
- **Live Store Open/Close & Prep Time:** Real-time store availability synced with `HyperlocalEngine`.
- **Prescription & Urgent Medicine Routing:** Priority dispatch lane integrated with Emergency/Instant Fleet.

## Phase 4: Cross-Border B2B & Warehouse 3PL Integrations
- **Export Documentation & HS Code Duty Calculator:** Commercial Invoice, Packing List, and multi-currency reference (BDT/USD/EUR).
- **External Courier Webhooks:** Live webhook adapters for Steadfast, Pathao, and RedX tracking updates.

## Phase 5: Native Mobile Wrapper & Offline PWA
- **Capacitor / PWA Installability:** Native GPS background tracking for active riders and push notifications for order milestones.
