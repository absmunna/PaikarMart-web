# PaikarMart: Master Specification & Full-App Development Blueprint

**Version:** 3.1.0-HUB-FIRST (Post-Full-Audit Authoritative Spec)  
**Branding:** PaikarMart (Omnichannel Social Commerce, B2B Wholesale & Logistics Super App)  
**Primary Market:** Bangladesh (BDT `৳` Currency, Bilingual `EN / বাংলা`, Hyperlocal 5km & Nationwide)  
**Architecture Status:** Feature-First Modular Monorepo (`apps/frontend` + `apps/backend` + `packages/*`)

---

## 1. Core Vision & Main Goal (Full-App Synthesis)

PaikarMart is a unified **Omnichannel Social Commerce Super App** engineered to connect social discovery with every layer of trade in Bangladesh—from neighborhood local shops and B2C retail to B2B factory-direct wholesale, on-demand home/travel services, multi-modal courier & freight logistics, creator OTT monetization, and escrow-protected BDT payments—inside **one single user identity, wallet, and unified account**.

### Five Core Product Pillars
1. **Social + Commerce Convergence:** Users browse location-ranked social posts, reels, and buyer **Open Demand** requests on a Facebook-style feed (`social-feed`) and convert directly into Retail Cart checkout, B2B RFQ quotes, or Service slot bookings without leaving the app. Auto-synced catalog events (`PRODUCT_ADDED`) can publish shoppable items straight into the social stream.
2. **Master Catalog (PMIN) + Buy-Box + B2B Wholesale:** Uses a `1:N` Master Product (`PMIN`) architecture where multiple verified sellers attach competing offers (`seller_listings`). Retail defaults to the winning Buy-Box offer (lowest verified price + SLA), while Wholesale supports MOQ tiered price slabs, factory-direct tiers, and interactive RFQ bidding (`wholesale-hub`).
3. **Hyperlocal Store Geofencing (`5km` Default / `1–20km` Radar):** Connects GPS coordinates (`LocationContext`) to nearby grocery, pharmacy, electronics, food, and neighborhood service providers (`services-hub` & `marketplace`) with real-time store Open/Close state and `prepTime + transitTime` ETA.
4. **4-Sub-Portal Logistics & Last-Mile Ecosystem:** Unifies instant Ride-Sharing (`Bike`/`CNG`/`Car`/`Ambulance`), Multi-Stop Parcel & External Courier Waybills (`PaikarForce`, `Steadfast`, `Pathao`, `RedX`), B2B Heavy Freight & Rentals, and a role-gated Fleet/Rider Console (`transit-logistics`) tied to every checkout order (`orders-hub`).
5. **Zero-Trust Escrow Wallet, RBAC & AI Assistance:** Combines BDT (`৳`) Wallet balance, PK Coins loyalty rewards, Escrow holds released strictly on 4-digit OTP / Proof-of-Delivery (POD), Server-side Gemini AI (`@google/genai`) assistance, and a unified 0–7 Trust Level & Role hierarchy.

---

## 2. Canonical Portal & Sub-Portal Architecture (Zero Route Collisions)

All canonical route views reside cleanly in `apps/frontend/src/portals/<portal-name>/`, register under `PortalTab` in `apps/frontend/src/types/index.ts`, and mount via `apps/frontend/src/app/router/routeManifest.tsx`. **Never create duplicate portal folders or overlapping wildcard route shadows.**

| Portal ID (`PortalTab`) | Canonical Route | Guard | Portal Folder | Sub-Portals & Core Responsibilities |
| :--- | :--- | :--- | :--- | :--- |
| `feed` | `/` , `/portal/social` | Public (Auth for write) | `portals/community/social-feed` | Stories tray, polymorphic post composer, location-ranked feed (`All`, `Following`, `Wholesale`, `Retail`, `Demand`), reactions & shoppable product tags |
| `explore` / `hub` | `/portal/explore` | Public | `portals/utilities/explore` | Super App module launcher & categorized directory |
| `commerce` | `/hub/marketplace` (`/portal/marketplace` compatibility) | Public | `hubs/marketplace-hub` (`MarketplaceMixedFeed`) + `portals/marketplaces` | Mixed product/feed surface (`MarketplaceMixedFeed`), grouped child portals (`retail/`, `wholesale/`, `grocery/`, `pharmacy/`, `brand-shops/`, `digital/`), PMIN Buy-Box comparison, Flash Deals, category chips, Product Details, Cart Drawer |
| `wholesale` | `/portal/wholesale` | Public (RFQ requires Auth) | `portals/marketplaces/wholesale` | B2B Wholesale catalog, Factory Direct tier, Export Hub, Tiered MOQ Price Slabs, Reverse RFQ request & supplier quote comparison |
| `services` | `/hub/services` (`/portal/services` compatibility) | Public (Booking requires Auth) | `hubs/services-hub` (`ServicesMixedFeed`) + `portals/services` | Mixed service/provider/demand/offer/logistics feed (`ServicesMixedFeed`), grouped child portals (`local-services/`, `food-delivery/`, `travel/`), Hyperlocal Nearby (`1–20km` geofence radar), Service slot booking (`5%` advance wallet discount) |
| `rides` | `/portal/transit` | Public Quote / Auth Book / Role-Gated Fleet | `portals/logistics/transit-logistics` | **4 Logistics Sub-Portals**: (1) Instant Ride (`Bike/Car/Emergency`), (2) Parcel & Multi-Stop Courier, (3) B2B Cargo Truck & Hourly Rentals, (4) Role-Gated Driver/Fleet Console |
| `orders` | `/portal/orders` | Auth (or Guest Tracker token) | `portals/utilities/orders-hub` | Purchases tab, Store Sales tab, Live Courier Waybill tracking (`LogisticsLivePanel`), 4-digit Delivery OTP, Confirm Delivery (Escrow Release), Reorder, Guest Order Tracker |
| `wallet` | `/portal/wallet` | Auth | `portals/utilities/wallet` | Available BDT (`৳`) Balance, Escrow On-Hold balance, Top-Up (bKash/Nagad/Card), Withdraw, PK Coins, Transaction Ledger (`EscrowLedgerPanel`) |
| `messages` | `/portal/messages` | Auth | `portals/community/messages` (uses `features/messaging`) | Buyer–Vendor–Rider threaded chat (`MessagesPortal`), Storekeeper quick chat, Gemini AI Bilingual Shopping Assistant bridge |
| `vendor-dash` | `/portal/seller` | **Auth + Vendor/Admin Guard** | `portals/utilities/seller-central` | Multi-Step KYC Onboarding (`MultiRoleOnboardingModal`), Storefront Preview, Inventory/PMIN Offers, B2B Tier Pricing, Dispatch Sync, Revenue Analytics |
| `creator` | `/portal/creator` | Public (Creator Studio Auth) | `portals/community/creator-studio` | Short Video / Reels stream, Live Commerce previews, Gated creator content & tipping |
| `profile` | `/portal/profile` | Auth (Public Store view via `/store/:id`) | `portals/utilities/user-profile` | Unified Consumer Cockpit (`Orders`, `SavedAddressesPage`, `Trust Badge`, `Timeline`) + Verified Public Storefront link |
| `notifications` | `/portal/notifications` | Auth | `portals/utilities/notifications-center` | Categorized real-time alerts (`Orders`, `Logistics`, `Escrow`, `Bids`, `Social`) |
| `demand` | `/portal/demand` | Public (Post / Quote requires Auth) | `portals/shared/demand-board` | Dynamic buyer RFQ demand board, polymorphic context-filtering by `?hub=marketplace\|services\|logistics` or domain selector, urgency badge, quotes count & quote submission modal |
| `nearby` | `/portal/nearby` | Public (Order/Booking requires Auth) | `portals/shared/nearby-radar` | Dynamic hyperlocal GPS radar (`0.5–20km` slider), context-filtering by `?hub=marketplace\|services\|logistics` (Shops, Services, Logistics Fleet), live distance computation & direct booking CTA |
| `settings` | `/settings` | Public Preferences / Auth Security | `portals/utilities/settings-center` | Dark/Light Theme toggle, `EN / বাংলা` language switch, GPS Radar (`1–20km`), Privacy & Security |
| `guide` | `/portal/guide` | Public | `portals/utilities/guide` | Interactive **User & Vendor Navigation Guide** synced with `/documents/USER_AND_VENDOR_GUIDE.md` |

> **Admin & Governance Control:** `features/governance` (`SuperAdminControlModal`, `AdminCatalogGovernanceModal`) MUST enforce `moderator` / `admin` / `super_admin` (`isGovernanceRole`) server-verified authorization for KYC approvals, Master Product moderation, and Escrow dispute arbitration.

---

## 3. Hub-First Navigation & Portal Composition

PaikarMart is organized around persistent product hubs. A hub owns the mixed feed, portal entry rail, child portal state, and hub-level filters (`src/hubs/*`). Canonical full portal views remain inside `src/portals/*` rather than thin pass-through duplicates.

### Canonical hubs

| Hub | Entry | Mixed feed | Child portal examples |
| :--- | :--- | :--- | :--- |
| **Marketplace Hub** | Bottom Navigation → Market | Retail product, wholesale lot, offer, seller and demand cards | Retail, Wholesale/B2B, Grocery, Pharmacy, Brand Shops, Digital Goods |
| **Services Hub** | Bottom Navigation → Services | Service, provider, demand, offer, nearby and logistics cards | Local Services, Food Delivery, Travel & Stays, Ride, Transport, Rent & Cargo, Emergency |
| **Community Hub** | Explore/Portal Hub (`/hub/community`) | Posts, demands, live commerce and creator cards | Social Feed, Demand Board, Creator Studio, Messages |
| **Utility Hub** | Explore/Portal Hub (`/hub/utility`) | Account, wallet, order and seller utilities | Orders Hub, Wallet, Seller Central, Profile, Notifications, Settings, Guide |

### Hub interaction contract

1. Entering a hub from Bottom Navigation opens the hub mixed feed; it must not open a child portal directly.
2. The hub's portal entry rail is rendered above the feed and contains only child portals belonging to that hub.
3. Selecting a child portal keeps the user inside the same hub surface. It changes the active portal home, feed query, and product/service category chips; it does not replace the hub shell with a competing route.
4. Hub entry buttons (`Marketplace Hub`, `Services Hub`, `Community Hub`, etc.) MUST NOT be repeated inside the child portal category rail. Hub switching belongs to Bottom Navigation or the Explore portal directory.
5. Every child portal registers via `src/hubs/shared/portalRegistry.ts` (`marketplacePortals`, `servicePortals`, `communityPortals`, `utilityPortals`); the hub shell does not hardcode one-off conditional branches per portal.
6. Marketplace and Services feeds use a shared polymorphic `HubFeedCard` contract: `product`, `service`, `demand`, `offer`, `seller`, `provider`, `ride`, `logistics`, `post`, and `creator`.

### Implemented frontend hub composition

```text
apps/frontend/src/hubs/
├── marketplace-hub/
│   ├── MarketplaceHub.tsx
│   ├── MarketplaceMixedFeed.tsx
│   ├── index.ts
│   └── config/marketplacePortals.ts
├── services-hub/
│   ├── ServicesHub.tsx
│   ├── ServicesMixedFeed.tsx
│   ├── index.ts
│   └── config/servicePortals.ts
├── community-hub/
│   ├── CommunityHub.tsx
│   ├── CommunityMixedFeed.tsx
│   ├── index.ts
│   └── config/communityPortals.ts
├── utility-hub/
│   ├── UtilityHub.tsx
│   ├── UtilityMixedFeed.tsx
│   ├── index.ts
│   └── config/utilityPortals.ts
└── shared/{HubFeedCard.tsx,hubTypes.ts,portalRegistry.ts}
```

The existing `/portal/marketplace`, `/portal/services`, `/portal/social`, `/portal/orders`, and `/portal/transit` URLs remain compatibility/direct entry points while all 4 canonical hubs (`/hub/marketplace`, `/hub/services`, `/hub/community`, `/hub/utility`) run inside hub shells and `src/app/router/routeManifest.tsx`.

## 4. Unified Role Hierarchy, Seller Tiers & Trust Levels (0–7)

PaikarMart operates on a **Unified Identity Model** (`1 Auth UID = 1 Account`) capable of holding Consumer access alongside verified Commercial capabilities. Canonical role definitions MUST live in `packages/shared/src/` so both `apps/backend` and `apps/frontend` share one source of truth.

One account may also own or operate multiple independent vendor stores. Store-specific KYC, payout, inventory, listings, and permissions belong to the store membership boundary, not directly to the consumer account. The database source of truth is `stores` plus `vendor_memberships`; `vendorProfile` remains a frontend compatibility field for the active store during migration.

### A. Role Groups & Capabilities
| Role Group | Sub-Roles (`BusinessRole` / `AppRole`) | Core Permissions |
| :--- | :--- | :--- |
| **Consumer** | `consumer` / `buyer` / `member` | `CAN_BUY`, `CAN_POST_SOCIAL`, `CAN_POST_DEMAND`, `CAN_BOOK_RIDES`, `CAN_BOOK_SERVICES`, `CAN_USE_WALLET` |
| **Vendor / Partner** | `retail_merchant`, `wholesale_supplier` (`factory`, `exporter`, `importer`, `distributor`), `service_provider`, `rideshare_driver` (`rider`, `fleet_owner`), `content_creator` | Inherit Consumer permissions + `CAN_SELL`, `CAN_MANAGE_ORDERS`, `CAN_RESPOND_RFQ` (wholesale), `CAN_MANAGE_SLOTS` (services), `CAN_DELIVER` & `CAN_ACCEPT_RIDES` (rider), `CAN_PUBLISH_CREATOR` (creator) |
| **Governance** | `moderator`, `admin`, `super_admin` | `CAN_MODERATE_FEED`, `CAN_APPROVE_MASTER_CATALOG`, `CAN_VERIFY_SELLERS_KYC`, `CAN_ARBITRATE_ESCROW`, `CAN_ACCESS_ADMIN_PANEL` |

### B. 7-Tier Physical Product Seller Hierarchy
When a vendor sells physical inventory, privileges scale by verification tier:
1. `factory_seller` (Manufacturer / OEM — Bulk MOQ + Custom RFQ)
2. `exporter` (Cross-Border International B2B — Requires Export License)
3. `importer` (Authorized Distributor)
4. `b2b_seller` (High-volume Trade Enterprise)
5. `wholesale_seller` (Regional Chawkbazar / Wholesale Distributor)
6. `brand_seller` (Official Brand Flagship Store)
7. `retail_seller` (Individual / Neighborhood Retail Storefront)

### C. Trust Levels (0–7 Verification Ladder)
* **Level 0 (Guest):** Browse public catalogs, social feed, and track order via Guest Order ID (`GuestOrderTracker`).
* **Level 1 (Phone / Email Verified):** Social engagement, retail checkout up to standard wallet limits, ride/parcel booking.
* **Level 2–3 (Profile & Address Complete):** Full cart checkout, wishlist, demand posting, review submission.
* **Level 4 (NID KYC Verified):** **Mandatory threshold for B2B/Wholesale orders > ৳50,000**, Wallet bank withdrawals, and Driver/Service Partner activation.
* **Level 5 (Trade License + DBID/TIN Verified):** Verified Storefront badge (`VERIFIED MERCHANT`), lower commission tiers, RFQ bidding rights.
* **Level 6–7 (Export License / Enterprise Audited):** International Export Portal & dedicated 3PL Logistics contract billing.

### D. Unified User-to-Seller State Machine
A single user upgrades smoothly without creating duplicate accounts:
`none` (Default Consumer) → `submitted` (5-step KYC uploaded via backend `/api/vendors/register`) → `under_review` (Admin/Moderator checks NID + Trade License) → `approved` (Activates `isVendor: true` + `SellerCentralPortal` + Storefront) → optional `suspended` (Governance lock on fraud/chargebacks).

> **Zero Demo-Bypass Rule:** UI components MUST NEVER allow switching roles or bypassing KYC status in client state (`Role Demo Switcher` removed). Role elevation happens exclusively through verified backend tokens/database state.

---

## 4. Inter-Module Lifecycle & Data Authority Flows

1. **Social ↔ Commerce Auto-Bridge:**
   * Creating/approving a vendor listing emits a domain event so the product becomes taggable inside `PostComposer` (`TaggedProduct`) and optionally appears in the Social Feed (`contentType: 'PRODUCT'`).
2. **Checkout → Order → Escrow → Logistics → POD:**
   * Cart Checkout calls `/api/orders` with `X-Idempotency-Key` → creates Order + `EscrowRecord` (`held`) + `ShipmentWaybill` (generating 4-digit OTP) → vendor/rider dispatches via `apps/backend/logistics` → Buyer confirms 4-digit OTP (`Confirm Delivery`) → Backend releases Escrow to Seller Wallet (`released`).
3. **B2B RFQ → Quote → Bulk Order:**
   * Buyer submits RFQ (`/api/wholesale/rfq`) → Verified Wholesale Supplier responds with tiered BDT quote (`/api/wholesale/quotes`) → Accepted quote converts into Escrow-protected Bulk Order with B2B Freight dispatch.
4. **Hyperlocal Geofence Engine (`Haversine`):**
   * User selects location/radar radius (`1–20 km`, default `5 km`) in `LocationContext` → `services-hub` and `marketplace` filter nearby stores/technicians by distance, `isOpen` status, and `prepTime + transitTime` ETA.

---

*Authoritative System Truth — Every AI agent and developer must align code, routes, schemas, and UI strictly with this specification.*
