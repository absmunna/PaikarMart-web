# Architecture & Modularity Guide (Root-to-Leaf Blueprint)

PaikarMart is organized as a **Feature-First Modular Monorepo** enforcing strict boundaries between **Root Configurations**, **Backend Domain Services**, **Shared Workspace Packages**, and **Frontend Features/Portals**. This architecture directly resolves the duplicate folders, route collisions, client-side DB bypasses, and cross-app import leaks identified in legacy ZIP prototypes (`PaikarMart-web-main`).

> **Current target:** Hub-first composition. Route-level portal folders remain compatibility boundaries during migration, but new product/service experiences MUST be created under a hub and registered as a child portal.

---

## 1. Authoritative Root-to-Leaf Directory Structure

```text
/                                       # Workspace Root
├── package.json                        # Root scripts: dev (tsx apps/backend/server.ts), build (vite + esbuild -> server.js), lint (tsc frontend)
├── .env.example                        # Env var contract (GEMINI_API_KEY, SUPABASE_*, VITE_FIREBASE_*)
├── firebase.json                       # Firebase Hosting SPA rewrite -> apps/frontend/dist
├── firebase-blueprint.json             # Canonical Firestore entity schema specification
├── firebase-applet-config.json         # Provisioned Firebase project client config
├── firestore.rules                     # Default-deny Firestore security rules
├── render.yaml                         # Render Web Service config (node server.js, port 10000)
├── vercel.json                         # Vercel SPA & /api/* proxy rewrites
├── metadata.json                       # AI Studio applet identity & capabilities
│
├── supabase/
│   └── schema.sql                      # Complete PostgreSQL DDL + Row Level Security (RLS) policies & indexes
│
├── packages/                           # Shared Cross-App Monorepo Packages (SSOT)
│   ├── shared/
│   │   └── src/
│   │       └── index.ts                # Unified types (UserRole, BusinessRole, TrustLevel, Order, CommerceItem, SocialPost)
│   └── database/
│       ├── index.ts                    # PrismaClient singleton export
│       └── prisma/
│           └── schema.prisma           # PostgreSQL ORM models (User, MasterProduct, SellerListing, Order, SocialPost)
│
├── apps/
│   ├── backend/                        # Node.js + Express API Server (Port 3000 dev / PORT env prod)
│   │   ├── server.ts                   # Mounts /api/* domain routers, CORS, JSON limit 10MB & Vite dev middleware / static prod dist
│   │   ├── ai/                         # aiRoutes.ts — @google/genai bilingual commerce assistant & catalog auditor
│   │   ├── messaging/                  # messagingRoutes.ts — Buyer-Vendor-Rider chat threads & AI bridge
│   │   ├── wholesale/                  # wholesaleRoutes.ts — B2B RFQ submissions, MOQ tiers & bulk quote acceptance
│   │   ├── wallet/                     # walletRoutes.ts — BDT balance, deposits, P2P transfers, withdrawals, PK Coins
│   │   ├── escrow/                     # escrowRoutes.ts — Hold funds, POD-triggered release, dispute arbitration
│   │   ├── orders/                     # orderRoutes.ts — Idempotent order creation, status machine, reorder & lookup
│   │   ├── logistics/                  # logisticsRoutes.ts — Haversine geofence, tariff quotes, waybills, fleet status & 3-step POD
│   │   └── services/
│   │       └── dbService.ts            # Supabase PostgreSQL adapter + graceful offline/dev fallback
│   │
│   └── frontend/
│       ├── index.html                  # SPA Entry point (synced title/meta)
│       ├── tsconfig.json               # TypeScript config (`@/*` -> `./src/*`)
│       ├── vite.config.ts              # Vite 8 + Tailwind v4 + React dedupe + `@` alias
│       └── src/
│           ├── main.tsx                # React 19 root mount with BrowserRouter
│           ├── index.css               # Tailwind CSS v4 (`@import "tailwindcss";`) & theme CSS tokens
│           ├── App.tsx                 # Canonical Route Table, synchronized domain state & App Shell
│           ├── types/                  # Centralized frontend TypeScript SSOT (`@/types` -> `PortalTab`, `User`, `Order`, etc.)
│           ├── contexts/               # AppProviders, ThemeContext, LanguageContext, LocationContext, SettingsContext (+ Auth export)
│           ├── lib/                    # Supabase client helper & localStorage persistence adapters
│           ├── data/                   # Initial seed defaults for offline/first-run dev hydration
│           │
│           ├── components/             # Global Chrome & Shell (NEVER business-domain isolated pages)
│           │   ├── layout/             # TopNavbar, BottomNav, DesktopLeftNav, DesktopRightSidebar, SidebarDrawer, SuperAppHubModal
│           │   └── shared/             # LocationPickerModal, DeploymentGuideModal, AdMobBanner, ScrollToTop, SkeletonLoaders
│           │
│           ├── features/               # Cross-Portal Headless Logic, API Clients, Stores & Reusable Widgets
│           │   ├── auth/               # AuthContext, AuthPortalModal, AuthGuard/RoleGuard helpers
│           │   ├── account/            # Profile/address helpers
│           │   ├── ai/                 # AI client hooks & bilingual prompt adapters
│           │   ├── b2b/                # useB2BStore (Zustand), RFQModal, tiered pricing helpers
│           │   ├── catalog/            # PMIN Master Catalog helpers & Buy-Box selectors
│           │   ├── logistics/          # useLogisticsStore, logisticsOrderApiClient, LogisticsLivePanel, CourierBookingPanel, DriverMatchingOverlay
│           │   ├── marketplace/        # CartCheckoutDrawer, category/price filters
│           │   ├── messaging/          # MessagingCenterModal & chat API client
│           │   ├── settings/           # Settings adapters & radar bindings
│           │   └── wallet/             # useWalletStore, EscrowLedgerPanel, Wallet top-up/payout clients
│           │
│           └── portals/                # Isolated Route-Level Portal Views ONLY (1 Folder = 1 Canonical Route Group)
│               ├── social-feed/        # `/` & `/portal/social` (StoriesTray, PostComposer, FeedPostCard)
│               ├── explore/            # `/portal/explore`
│               ├── marketplace/        # `/portal/marketplace` & `/product/:id` (ProductDetailsLanding)
│               ├── wholesale-hub/      # `/portal/wholesale`
│               ├── services-hub/       # `/portal/services` (Nearby Geofence + Service Booking)
│               ├── transit-logistics/  # `/portal/transit` (4-Sub-Portal Hub: Ride, Courier, Cargo/Rental, Fleet Console)
│               ├── orders-hub/         # `/portal/orders` (Purchases, Sales, Live Tracking, GuestOrderTracker)
│               ├── wallet/             # `/portal/wallet` & `WalletModal`
│               ├── messages-hub/       # `/portal/messages`
│               ├── seller-central/     # `/portal/seller` (KYC Onboarding, Inventory, Analytics, Dispatch)
│               ├── creator-studio/     # `/portal/creator`
│               ├── user-profile/       # `/portal/profile` & public `/store/:id`
│               ├── notifications-center/ # `/portal/notifications` & `NotificationsModal`
│               ├── settings-center/    # `/settings` & `SettingsModal`
│               ├── super-admin/        # Governance & KYC Arbitration (`SuperAdminControlModal`)
│               └── guide/              # `/portal/guide` (`UserGuidePortal`)
│
└── documents/                          # Authoritative Blueprints, Guides & Standards (Read before coding)
```

---

## 2. Hub-First Frontend Boundary

```text
apps/frontend/src/
├── hubs/
│   ├── marketplace-hub/
│   │   ├── MarketplaceHub.tsx
│   │   ├── config/marketplacePortals.ts
│   │   ├── components/MarketplacePortalBar.tsx
│   │   └── portals/{retail,wholesale,grocery,pharmacy,brand-shops,digital}/
│   ├── services-hub/
│   │   ├── ServicesHub.tsx
│   │   ├── config/servicePortals.ts
│   │   ├── components/ServicesPortalBar.tsx
│   │   └── portals/{local-services,food-delivery,travel,logistics}/
│   └── shared/{hubTypes.ts,portalRegistry.ts,HubFeedCard.tsx}
├── features/                 # headless business logic and API clients
├── components/               # global shell and primitives
└── portals/                  # route compatibility wrappers only during migration
```

Hub rules:

1. The hub owns the mixed feed, active child portal, portal rail, and hub-level loading/empty/error states.
2. Child portals own only their home view, domain cards, filters, and actions; they do not create a second app shell or route tree.
3. Portal definitions are data (`id`, `hubId`, labels, icon, component, feed types, enabled state, sort order), not scattered `if/else` navigation branches.
4. Bottom Navigation opens hubs. Explore opens the full portal directory. Child portal buttons stay inside the current hub.
5. Marketplace and Services use one polymorphic feed-card contract so product, service, demand, offer, provider, ride, and logistics cards can coexist safely.

## 3. Canonical Route Registry & Anti-Shadowing Rules

To prevent the ZIP's route collision bug (where `AppRoutes.tsx` exported two competing routers and `portal.routes.tsx` shadowed `/portal/:portalId` multiple times):
1. **Single Router Source of Truth:** All React Router routes MUST be defined cleanly inside `apps/frontend/src/App.tsx` (or one single route manifest imported by `App.tsx`). Never maintain two parallel route trees.
2. **Exact Path Ownership:**
   * `/` and `/portal/social` → `SocialPortal`
   * `/portal/explore` → `ExplorePortal`
   * `/portal/marketplace` and `/product/:id` → `MarketplacePortal` / `ProductDetailsLanding`
   * `/portal/wholesale` → `WholesalePortal`
   * `/portal/services` → `ServicesPortal`
   * `/portal/transit` → `TransitPortal` (with internal sub-tabs: `ride`, `courier`, `cargo`, `fleet`)
   * `/portal/orders` and `/orders/track/:id` → `OrdersPortal` (`GuestOrderTracker` when unauthenticated)
   * `/portal/wallet` → `WalletPortal`
   * `/portal/messages` → `MessagesPortal` / `MessagingCenterModal`
   * `/portal/seller` → `SellerCentralPortal` (**MUST enforce Auth + Approved Vendor/Admin role guard**)
   * `/portal/creator` → `CreatorPortal`
   * `/portal/profile` and `/store/:slug` → `ProfilePortal` (Private Buyer Cockpit when `isMe`, Dynamic Public Storefront when viewing a vendor)
   * `/portal/notifications` → `NotificationsPortal`
   * `/portal/guide` → `UserGuidePortal`
   * `/settings` → `UnifiedSettingsPortal`
   * `*` → Safe `<Navigate to="/portal/social" replace />` or dedicated `NotFound` page inside the shell.

---

## 3. Core Entity Relationship Model

```text
[User (Firebase Auth UID <-> public.profiles.auth_uid)]
  ├──1 [PrivateUserDetails] (Strictly PII-isolated: NID, emergency phone, bank routing)
  ├──< [SavedAddress] (Home | Office | Warehouse | Hub Pickup)
  ├──1 [Wallet] ──< [WalletTransaction] (deposit | purchase | escrow_hold | escrow_release | trip_earning | refund)
  ├──0..1 [Store / VendorProfile] (KYC Status: none|submitted|verified|suspended, BusinessRoles[], CommissionTier)
  │      ├──< [SellerListing] ──> [MasterProduct (PMIN)] (Buy-Box pricing + Retail Stock + B2B MOQ TieredSlabs)
  │      ├──< [ProviderServiceOffer] ──> [MasterService] (baseRate, serviceRadiusKm, isOnline)
  │      └──< [HyperlocalStoreConfig] (lat, lng, serviceRadiusKm, prepMinutes, isOpen)
  ├──< [Vehicle] (bike | cng | car | parcel | pickup | truck | ambulance)
  │      └──1 [LogisticsAvailability] (isOnline, currentLat, currentLng, activeZone)
  ├──< [SocialPost] ──< [SocialComment] (Optional taggedProductId + location city ranking)
  └──< [Order] (idempotencyKey, buyerId, vendorId, totalBdt, status lifecycle)
         ├──< [OrderItem]
         ├──1 [EscrowRecord] (held -> released on OTP/POD | disputed | refunded)
         └──1 [ShipmentWaybill] (trackingId, courierPartner, stops[], deliveryOtp, checkpoints[], podStatus)
                └──0..1 [RiderAssignment / RideDispatch] (vehicleId, routeCoords, quoteBreakdown)
```

---

## 4. Strict Monorepo & Cross-Module Integration Rules

1. **Zero Cross-App Boundary Imports (CRITICAL):**
   * `apps/backend` MUST NEVER import files from `apps/frontend` (fixing the ZIP's `backend/middleware/permission.ts` importing `../../frontend/src/core/config/roles.config`).

### Multi-store vendor identity

One authenticated account may operate multiple independent vendor stores. The consumer profile remains the identity owner; each store is an independent business entity, and `vendor_memberships` binds the profile to that store with its own active business roles and status. Frontend compatibility may expose one `vendorProfile` as the active store, while new flows should use `vendorProfiles[]`, `vendorMemberships[]`, and `activeVendorId`.
   * Shared enums, `AppRole`, `TrustLevel`, and DTO interfaces MUST live inside `packages/shared/src/` and be imported cleanly by both apps.
2. **Backend-Authority Business Math & Event Triggers:**
   * All pricing math (distance fare, surge, multi-stop fees, B2B MOQ tier discounts, 5% VAT, 8% commission), Haversine geofencing, OTP generation/validation, KYC state changes, and Escrow releases MUST execute in `apps/backend/<domain>/`.
   * Frontend components MUST NOT bypass Express endpoints to mutate privileged Firestore fields (like `role`, `sellerVerificationStatus`, `walletBalance`, or `escrowStatus`).
3. **PMIN Master Catalog & Buy-Box Sync:**
   * Vendors attach offers (`SellerListing`) to verified `MasterProduct` records rather than creating duplicate product pages. Storefronts and Marketplace automatically query the active lowest-price Buy-Box offer while listing competing verified offers.
4. **Domain Event Synchronization:**
   * `PRODUCT_ADDED` (Backend) → optionally creates a shoppable `SocialPost` (`contentType: 'PRODUCT'`) if enabled by merchant.
   * `ORDER_CREATED` / `ORDER_STATUS_UPDATED` → creates Buyer & Vendor notifications, initializes `EscrowRecord`, and syncs `ShipmentWaybill`.
   * `NEW_BID_RECEIVED` (RFQ / Demand) → alerts Buyer in `NotificationsCenter` and links directly to quote comparison.
   * `POD_VERIFIED` → marks `ShipmentWaybill` as `delivered` and atomically releases Escrow funds to Vendor + Rider Wallets.
5. **Single Store per Domain (`features/` SSOT) & Clean Imports:**
   * Keep domain state in one Zustand store per domain (`useLogisticsStore`, `useWalletStore`, `useB2BStore`).
   * Use `@/` path alias inside `apps/frontend/src/` (never deep `../../../` chains).
   * Replace duplicate components (e.g., ZIP's two competing `PublicSellerStoreFront.tsx` and `SellerStoreFront.tsx`) with one unified data-driven `StorefrontView` powered by live store/product queries.
