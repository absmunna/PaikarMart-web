# Architecture & Modularity Guide (Root-to-Leaf Blueprint)

PaikarMart is organized as a **Feature-First Modular Monorepo** enforcing strict boundaries between **Root Configurations**, **Backend Domain Modules**, **Shared Workspace Packages**, **Frontend App Bootstrap (`src/app`)**, **Design System (`src/design-system`)**, **Hub Shells (`src/hubs`)**, **Portals (`src/portals`)**, and **Headless Features (`src/features`)**. This architecture aligns with the *Final Modular Structure Blueprint* (`2026-11-17`) while preserving AI Studio single-root runtime compatibility and offline `mockData` fallbacks.

> **Hub & Portal Ownership Rule:** Hubs (`src/hubs/*`) own mixed feeds, child portal registries (`portalRegistry.ts`), and hub-level chrome; canonical full pages stay cleanly in `src/portals/*` rather than thin wrapper files in `hubs/*`. All cross-cutting business logic and API clients belong in `src/features/*`.

---

## 1. Authoritative Root-to-Leaf Directory Structure

```text
/                                       # Workspace Root (Single root package.json for AI Studio + Render)
├── package.json                        # Root scripts: dev (tsx apps/backend/server.ts), build (vite + esbuild -> server.js), lint
├── .env.example                        # Env var contract (GEMINI_API_KEY, SUPABASE_*, VITE_FIREBASE_*)
├── firebase.json                       # Firebase Hosting SPA rewrite -> apps/frontend/dist
├── firebase-blueprint.json             # Canonical Firestore entity schema specification
├── firebase-applet-config.json         # Provisioned Firebase project client config (imported via @firebase-config alias)
├── firestore.rules                     # Default-deny Firestore security rules
├── storage.rules                       # Firebase Storage security rules
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
│   │       └── index.ts                # Unified types (UserRole, BusinessRole, TrustLevel, Order, CommerceItem, SocialPost, handle helpers)
│   └── database/                       # Schema mirror synced 1:1 with supabase/schema.sql (Prisma client wiring optional)
│       ├── index.ts
│       └── prisma/
│           └── schema.prisma
│
├── apps/
│   ├── backend/                        # Node.js + Express API Server (Port 3000 dev / PORT env prod)
│   │   ├── server.ts                   # Entry point: CORS, JSON limit 10MB, /api/* mount & Vite middleware / static dist
│   │   ├── tsconfig.json               # Backend TypeScript check config (`server.ts`, `config/*`, `middleware/*`, `services/*`, `modules/*`)
│   │   ├── config/                     # Centralized server runtime config & clients
│   │   │   ├── env.ts                  # Typed server env contract (port, CORS, Gemini, Firebase, Supabase)
│   │   │   └── supabaseAdmin.ts        # Public & Service-Role Supabase clients + offline fallback checks
│   │   ├── middleware/
│   │   │   └── requireFirebaseAuth.ts  # Firebase ID token verification & privileged role helpers
│   │   ├── services/
│   │   │   └── dbService.ts            # Supabase PostgreSQL adapter + resolveProfileUuidByAuthUid + offline fallback
│   │   └── modules/                    # Domain-isolated Express routers & services
│   │       ├── ai/                     # aiRoutes.ts + aiServices.ts + geminiClient.ts
│   │       ├── auth/                   # authRoutes.ts — Firebase <-> Supabase profile & saved address sync
│   │       ├── catalog/                # catalogRoutes.ts — Verified PMIN Master Catalog & seller_listings projection
│   │       ├── escrow/                 # escrowRoutes.ts — Hold funds, POD-triggered release, dispute arbitration
│   │       ├── logistics/              # logisticsRoutes.ts + logisticsService.ts + distanceEngine.ts + tariffConfig.ts
│   │       ├── messaging/              # messagingRoutes.ts — Auth-scoped Buyer-Vendor-Rider chat + AI copilot bridge
│   │       ├── orders/                 # orderRoutes.ts — Server-priced order creation, status machine, reorder & lookup
│   │       ├── retail/                 # retailRoutes.ts — Retail vouchers, checkout & product offer helpers
│   │       ├── vendors/                # vendorRoutes.ts + vendorService.ts — KYC submission, PII-stripped public stores
│   │       ├── wallet/                 # walletRoutes.ts + walletService.ts — BDT ledger, escrow summary, PK Coins
│   │       └── wholesale/              # wholesaleRoutes.ts — B2B RFQ submissions, MOQ tiers & bulk quote acceptance
│   │
│   └── frontend/
│       ├── index.html                  # SPA Entry point (synced title/meta)
│       ├── tsconfig.json               # TypeScript aliases (`@/*`, `@paikarmart/shared`, `@firebase-config`)
│       ├── vite.config.ts              # Vite 8 + Tailwind v4 + path aliases (`@`, `@paikarmart/shared`, `@firebase-config`)
│       └── src/
│           ├── main.tsx                # React 19 root mount
│           ├── index.css               # Tailwind CSS v4 (`@import "tailwindcss";`) & global theme styles
│           ├── App.tsx                 # App Shell orchestrating TopNavbar, Navs, Modals, and <AppRoutes />
│           ├── assets/images/          # Bundled local marketplace/service photography
│           │
│           ├── app/                    # Application Bootstrap Layer
│           │   ├── providers/
│           │   │   └── AppProviders.tsx # ErrorBoundary + BrowserRouter + Auth + Theme + Language + Location + Settings
│           │   ├── guards/
│           │   │   ├── AuthGuard.tsx   # Authenticated route boundary wrapper
│           │   │   └── RoleGuard.tsx   # Merchant KYC & Governance role boundary wrapper
│           │   └── router/
│           │       ├── routeIds.ts     # Canonical route constants & PortalTab-to-path resolver
│           │       └── routeManifest.tsx # Lazy-loaded route manifest rendered inside App shell
│           │
│           ├── design-system/          # Design Tokens, Layout Shells & Reusable UI Primitives
│           │   ├── tokens/
│           │   │   └── tokens.css      # CSS Custom Properties (--pm-*) multi-theme tokens
│           │   ├── components/
│           │   │   └── index.ts        # AdMobBanner, ErrorBoundary, PromotionalAdCard, ScrollToTop, SkeletonLoaders
│           │   └── layouts/
│           │       └── index.ts        # TopNavbar, BottomNav, DesktopLeftNav, DesktopRightSidebar, SidebarDrawer, UnifiedSidebar
│           │
│           ├── shared/                 # Cross-Cutting Utilities & Hooks (Zero Domain Dependencies)
│           │   ├── hooks/
│           │   │   └── useBodyScrollLock.ts # Global modal/drawer overscroll & body lock manager
│           │   └── utils/
│           │       └── index.ts        # Shared frontend helpers
│           │
│           ├── types/                  # Centralized frontend TypeScript SSOT (`@/types`)
│           ├── contexts/               # ThemeContext, LanguageContext, LocationContext, SettingsContext (re-exports AppProviders)
│           ├── lib/                    # Pure infrastructure clients ONLY (`firebase.ts`, `supabase.ts`)
│           ├── data/                   # Seed defaults & i18n locales (`locales/en.ts`, `locales/bn.ts`, `bangladeshLocations.ts`, `portalsData.ts`, `mockData.ts`)
│           ├── components/             # Physical UI shell & shared components surfaced cleanly via `@/design-system`
│           │   ├── layout/             # TopNavbar, TopNavLocationMenu, BottomNav, DesktopLeftNav, DesktopRightSidebar, SidebarDrawer, UnifiedSidebar, SuperAppHubModal
│           │   └── shared/             # LocationPickerModal, DeploymentGuideModal, MegaSearch, PortalBannerCarousel, PromotionalAdCard, TrendingTopicsWidget, AdMobBanner, ErrorBoundary, ScrollToTop, SkeletonLoaders
│           │
│           ├── hubs/                   # 4-Hub Configs & Mixed Feeds (Mixed Feed, Portal Rail Config & Registry)
│           │   ├── marketplace-hub/    # MarketplaceHub.tsx + MarketplaceMixedFeed.tsx + config/marketplacePortals.ts + index.ts
│           │   ├── services-hub/       # ServicesHub.tsx + ServicesMixedFeed.tsx + config/servicePortals.ts + index.ts
│           │   ├── community-hub/      # CommunityHub.tsx + CommunityMixedFeed.tsx + config/communityPortals.ts + index.ts
│           │   ├── utility-hub/        # UtilityHub.tsx + UtilityMixedFeed.tsx + config/utilityPortals.ts + index.ts
│           │   └── shared/             # HubFeedCard.tsx + hubTypes.ts + portalRegistry.ts (`HUB_METADATA`, `PORTAL_REGISTRY`)
│           │
│           ├── features/               # Cross-Portal Headless Logic, Types, API Clients, Stores & Shared Domain Widgets
│           │   ├── auth/               # AuthContext, AuthPortalModal, AuthGuard, RoleGuard, authProfileApi, userVerification
│           │   ├── ai/                 # AiAssistantDrawer, MapsGroundingWidget, SearchGroundingWidget, VoiceSearchRecorder, aiApiClient
│           │   ├── b2b/                # useB2BRFQStore, wholesaleApiClient, b2bTypes, BulkTierPricingTable, RFQModal, SampleRequestModal
│           │   ├── governance/         # Role-gated Admin/Moderator controls (`SuperAdminControlModal`, `AdminCatalogGovernanceModal`)
│           │   ├── inventory/          # useSellerInventory, inventoryService, InventoryToolbar, InventoryProductCard, ProductEditorModal
│           │   ├── demand/             # Demand types, initial seed demands, DemandCard, CreateDemandModal
│           │   ├── logistics/          # useLogisticsStore, logisticsOrderApiClient, LogisticsLivePanel, CourierBookingPanel, hyperlocal
│           │   ├── marketplace/        # types.ts (`PortalFilterType`), CategoryBar, CommerceProductCard, CartCheckoutDrawer, MarketplaceFilters, catalogApiClient, retailApiClient, masterCatalogFallback, commerceUtils
│           │   ├── messaging/          # useMessagingStore, MessagingCenterModal, AiCoPilotPanel, ChatFloatingButton, messagingApiClient
│           │   ├── services/           # Shared service discovery & slot booking UI (`ServiceCard`, `ServiceBookingModal`)
│           │   ├── social/             # Shared social post card (`FeedPostCard`) reused across Social Feed, Profile & Storefront
│           │   ├── vendors/            # vendorApiClient + `MultiRoleOnboardingModal` (5-Step KYC Onboarding)
│           │   └── wallet/             # useWalletStore, EscrowLedgerPanel, walletEscrowApiClient, walletTypes
│           │
│           └── portals/                # Hub-Categorized Route Portals (Grouped into Hub Directories + Shared)
│               ├── marketplaces/       # Marketplace Child Portals
│               │   ├── shared/         # Shared `MarketplaceCategoryPortal.tsx` shell
│               │   ├── retail/         # `RetailPortal.tsx` & `ProductDetailsLanding.tsx`
│               │   ├── wholesale/      # `/portal/wholesale` (`WholesalePortal.tsx`, `WholesaleProductCard`, `WholesaleFilterBar`)
│               │   ├── grocery/        # `GroceryPortal.tsx`
│               │   ├── pharmacy/       # `PharmacyPortal.tsx`
│               │   ├── brand-shops/    # `BrandShopsPortal.tsx`
│               │   └── digital/        # `DigitalGoodsPortal.tsx`
│               ├── services/           # Services Child Portals
│               │   ├── shared/         # Shared `ServiceCategoryPortal.tsx` shell
│               │   ├── local-services/ # `LocalServicesPortal.tsx` (Repair, Salon, Clinic)
│               │   ├── food-delivery/  # `FoodDeliveryPortal.tsx` (Restaurants, Homemade, Bakery)
│               │   └── travel/         # `TravelStaysPortal.tsx` (Hotels, Tours, Venues)
│               ├── logistics/          # Logistics & Transit Portals
│               │   └── transit-logistics/ # `/portal/transit` (`TransitPortal.tsx`, RideFleetView, CargoFreightView, FleetPartnerConsole)
│               ├── community/          # Community & Social Portals
│               │   ├── social-feed/    # `/` & `/portal/social` (`SocialPortal.tsx`, StoriesTray, PostComposer)
│               │   ├── creator-studio/ # `/portal/creator` (`CreatorPortal.tsx`, `CreatorContentCard`)
│               │   └── messages/       # `/portal/messages` (`MessagesPortal.tsx`)
│               ├── utilities/          # Utility & Account Portals
│               │   ├── orders-hub/     # `/portal/orders` (`OrdersPortal.tsx`, PurchasesOrdersTab, StoreSalesOrdersTab)
│               │   ├── wallet/         # `/portal/wallet` (`WalletPortal.tsx`, `WalletModal`)
│               │   ├── seller-central/ # `/portal/seller` & `/portal/seller/inventory` (`SellerCentralPortal.tsx`, `SellerInventoryPage.tsx`)
│               │   ├── user-profile/   # `/portal/profile`, `/u/:handle`, `/store/:storeId` (`ProfilePortal.tsx`, `PublicStorefrontPage.tsx`)
│               │   ├── notifications-center/ # `/portal/notifications` (`NotificationsPortal.tsx`, `NotificationsModal`)
│               │   ├── settings-center/ # `/settings` (`SettingsPortal.tsx`, `SettingsModal`, `ThemeToggle`, `LanguageSwitcher`)
│               │   ├── guide/          # `/portal/guide` (`UserGuidePortal.tsx`)
│               │   └── explore/        # `/portal/explore` (`ExplorePortal.tsx`)
│               ├── shared/             # Cross-Hub Dynamic Context-Aware Portals
│               │   ├── demand-board/   # `/portal/demand` (`DemandBoardPortal.tsx` with dynamic `?hub=marketplace|services|logistics` filter)
│               │   └── nearby-radar/   # `/portal/nearby` (`NearbyRadarPortal.tsx` with live GPS radar and `?hub=marketplace|services|logistics` filter)
│               └── index.ts            # Central barrel exporting all hub-categorized portals
│
└── documents/                          # Canonical Blueprints, Guides & Standards (Single Source of Truth, Zero Duplicates)
```

---

## 2. Hub-First Frontend Boundary & Layering Rules

1. **Dependency Flow (Strict One-Way Graph):**
   * `app/` -> imports `hubs/`, `portals/`, `design-system/`, `features/`, `contexts/`, `shared/`
   * `hubs/` -> imports `portals/`, `features/`, `design-system/`, `shared/`
   * `portals/` -> imports `features/`, `design-system/`, `shared/`, `types/`
   * `features/` -> imports `shared/`, `design-system/`, `types/`, `lib/`, `data/`, `hubs/shared/*` (config metadata only; **NEVER imports from `portals/` or `app/`**)
   * `design-system/` & `shared/` -> zero dependency on `portals/` or `features/` state
2. **Hub-vs-Portal Ownership:**
   * Hubs own mixed discovery feeds (`HubFeedCard`), child portal configuration (`portalRegistry.ts`), and hub-level loading/empty states.
   * Canonical full route pages stay inside `src/portals/<portal-id>/`; never generate redundant pass-through page wrappers in `hubs/`.
3. **Portal Registry Contract:**
   * All child portal definitions live in `src/hubs/marketplace-hub/config/marketplacePortals.ts`, `src/hubs/services-hub/config/servicePortals.ts`, `src/hubs/community-hub/config/communityPortals.ts`, and `src/hubs/utility-hub/config/utilityPortals.ts`, aggregated in `src/hubs/shared/portalRegistry.ts`.

---

## 3. Canonical Route Registry & Anti-Shadowing Rules

1. **Single Router Source of Truth:** All React Router routes MUST be defined inside `apps/frontend/src/app/router/routeManifest.tsx` with route constants in `apps/frontend/src/app/router/routeIds.ts`, and rendered cleanly by `apps/frontend/src/App.tsx`. Never maintain parallel route trees.
2. **Exact Path Ownership (Synced with `routeManifest.tsx`):**
   * `/` → Redirects to `/portal/social`
   * `/portal/social` → `SocialPortal`
   * `/portal/explore` → `ExplorePortal`
   * `/hub/marketplace` (legacy redirect `/portal/marketplace`) → `MarketplaceHub`
   * `/hub/marketplace/product/:id` (legacy redirect `/portal/marketplace/product/:id`) → `ProductDetailsLanding`
   * `/portal/wholesale` → `WholesalePortal`
   * `/hub/services` (legacy redirect `/portal/services`) → `ServicesHub`
   * `/hub/community` → `CommunityHub`
   * `/hub/utility` → `UtilityHub`
   * `/portal/transit` → `TransitPortal` (internal sub-tabs: `ride`, `courier`, `cargo`, `fleet`)
   * `/portal/demand` → `DemandBoardPortal` (Dynamic buyer RFQ board context-filtered by `?hub=marketplace|services|logistics` or direct view)
   * `/portal/nearby` → `NearbyRadarPortal` (Dynamic hyperlocal GPS radar context-filtered by `?hub=marketplace|services|logistics` or direct view)
   * `/portal/orders` → `OrdersPortal` (wrapped in `AuthGuard`)
   * `/portal/wallet` → `WalletPortal` (wrapped in `AuthGuard`)
   * `/portal/messages` → `MessagesPortal` (`portals/messages`, wrapped in `AuthGuard`)
   * `/portal/seller` & `/portal/seller/inventory` → `SellerCentralPortal` / `SellerInventoryPage` (**MUST enforce `RoleGuard` (`requiredMode="seller"`)**)
   * `/portal/creator` → `CreatorPortal`
   * `/u/:handle` & `/store/:storeId` → `PublicStorefrontPage`
   * `/portal/profile` → `ProfilePortal` (wrapped in `AuthGuard`)
   * `/portal/notifications` → `NotificationsPortal` (wrapped in `AuthGuard`)
   * `/portal/guide` → `UserGuidePortal`
   * `/settings` → `SettingsPortal` (wrapped in `AuthGuard`)

---

## 4. Core Entity Relationship Model

```text
[User (Firebase Auth UID <-> public.profiles.auth_uid)]
  ├──1 [PrivateUserDetails] (Strictly PII-isolated: NID, emergency phone, bank routing)
  ├──< [SavedAddress] (Home | Office | Warehouse | Hub Pickup)
  ├──1 [Wallet] ──< [WalletTransaction] (deposit | purchase | escrow_hold | escrow_release | trip_earning | refund)
  ├──0..N [Store / VendorProfile via vendor_memberships] (KYC Status: none|submitted|under_review|approved|suspended, BusinessRoles[])
  │      ├──< [SellerListing] ──> [MasterProduct (PMIN)] (Buy-Box pricing + Retail Stock + B2B MOQ TieredSlabs)
  │      ├──< [ProviderServiceOffer] ──> [MasterService] (baseRate, serviceRadiusKm, isOnline)
  │      └──< [HyperlocalStoreConfig] (lat, lng, serviceRadiusKm, prepMinutes, isOpen)
  ├──< [Vehicle] (bike | cng | car | parcel | pickup | truck | ambulance)
  │      └──1 [LogisticsAvailability] (isOnline, currentLat, currentLng, activeZone)
  ├──< [SocialPost] ──< [SocialComment] (Optional taggedProductId + location city ranking)
  └──< [Order] (idempotencyKey, buyerId, storeId, totalBdt, status lifecycle)
         ├──< [OrderItem]
         ├──1 [EscrowRecord] (held -> released on OTP/POD | disputed | refunded)
         └──1 [ShipmentWaybill] (trackingId, courierPartner, stops[], deliveryOtp, checkpoints[], podStatus)
                └──0..1 [RiderAssignment / RideDispatch] (vehicleId, routeCoords, quoteBreakdown)
```

---

## 5. Strict Monorepo & Cross-Module Integration Rules

1. **Zero Cross-App Boundary Imports (CRITICAL):**
   * `apps/backend` MUST NEVER import frontend source components or React code (`apps/frontend/src/*`). Static asset/dist path resolution in `server.ts` is the only allowed filesystem bridge.
   * Shared enums, `AppRole`, `TrustLevel`, handle normalizers, and DTO interfaces MUST live inside `packages/shared/src/` and be imported via `@paikarmart/shared` (frontend) or relative workspace package entry (backend).
2. **Backend-Authority Business Math, Auth & DB Boundary:**
   * All pricing math (server-verified SKU unit prices, 5% VAT, delivery tariffs, B2B MOQ discounts, 8% commission), Haversine geofencing, OTP generation/validation, KYC state changes, conversation ACL checks, and Escrow releases MUST execute in `apps/backend/modules/<domain>/`.
   * Backend modules resolve environment & Supabase admin/public clients via `apps/backend/config/` and `apps/backend/services/dbService.ts`. Client-submitted totals, auto-approve KYC flags, or raw profile/conversation IDs MUST NEVER be trusted as identity or financial authority.
3. **PMIN Master Catalog & Buy-Box Sync:**
   * `GET /api/catalog/products` serves only verified `master_products` (`is_verified = true`) paired with active/verified stores and active listings.
4. **Single Store per Domain (`features/` SSOT) & Clean Imports:**
   * Use `@/` path alias inside `apps/frontend/src/` and `@firebase-config` for root Firebase config (never deep `../../../../` chains).

---

## 6. Remaining Incremental Refactor Roadmap

Resolved items from prior audits (P0/P1 backend auth/price/KYC hardening, `VendorOnboardingModal` & `SavedAddressesTab` deduplication, `PortalFilterType` inversion fix, `@firebase-config` alias, `src/app/`, `src/design-system/`, `src/shared/`, `src/lib/` domain extraction, `portalRegistry` wiring, `apps/backend/tsconfig.json`, `apps/backend/config/` & `apps/backend/modules/` layout) are now complete. Remaining long-term tasks:

1. **Workspace Package Linking (`@paikarmart/shared`):** Note that root `package.json` uses single-root `esbuild --packages=external`; only switch backend `packages/shared` relative imports to `@paikarmart/shared` if adopting workspace linking or bundling internal packages explicitly.
2. **`packages/database` Runtime Alignment:** Keep `packages/database/prisma/schema.prisma` synced 1:1 with `supabase/schema.sql`, and install `@prisma/client` only if direct Prisma ORM queries are introduced alongside Supabase REST/RPC.
3. **Deeper Child Portal & Production Integrations:** Configure live Supabase/Payment callbacks to enable persistent Wallet/Escrow transactions and progressive child-portal consolidation inside hubs without duplicating full portal pages.


