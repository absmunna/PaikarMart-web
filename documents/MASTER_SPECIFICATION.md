# PaikarMart: Master Specification & Full-App Development Blueprint

**Version:** 3.1.0-HUB-FIRST (Post-Full-Audit Authoritative Spec)  
**Branding:** PaikarMart (Omnichannel Social Commerce, B2B Wholesale & Logistics Super App)  
**Primary Market:** Bangladesh (BDT `৳` Currency, Bilingual `EN / বাংলা`, Hyperlocal 5km & Nationwide)  
**Architecture Status:** Feature-First Modular Monorepo (`apps/frontend` + `apps/backend` + `packages/*`)

---

## 1. Core Vision & Main Goal (Full-App Synthesis)

PaikarMart is a unified **Omnichannel Social Commerce Super App** engineered to connect social discovery with every layer of trade in Bangladesh—from neighborhood local shops and B2C retail to B2B factory-direct wholesale, on-demand home/travel services, multi-modal courier & freight logistics, creator OTT monetization, and escrow-protected BDT payments—inside **one single user identity, wallet, and unified account**.

### Five Core Product Pillars
1. **Social + Commerce Convergence:** Users browse location-ranked social posts, stories and shared creator/business content in the Social Hub (`hubs/social`), then follow references into Marketplace checkout, B2B RFQs or service bookings. Content records/media remain single-source even when surfaced in multiple hubs.
2. **Master Catalog (PMIN) + Buy-Box + B2B Wholesale:** Uses a `1:N` Master Product (`PMIN`) architecture where multiple verified sellers attach competing offers (`seller_listings`). Retail defaults to the winning Buy-Box offer (lowest verified price + SLA), while Wholesale supports MOQ tiered price slabs, factory-direct tiers and interactive RFQ bidding (`hubs/marketplace/portals/wholesale`).
3. **Hyperlocal Store Geofencing (`5km` Default / `1–20km` Radar):** Connects GPS coordinates (`LocationContext`) to nearby grocery, pharmacy, electronics, food and neighborhood service providers (`hubs/marketplace` & `hubs/services`) with real-time store Open/Close state and `prepTime + transitTime` ETA. Local/Nearby discovery remains a cross-cutting surface for later design.
4. **Logistics & Last-Mile Ecosystem:** The Logistics Hub (`hubs/logistics`) separates instant rides (`Bike`/`CNG`/`Car`/`Ambulance`), multi-stop parcel/courier waybills (`PaikarForce`, `Steadfast`, `Pathao`, `RedX`), B2B freight/rentals, emergency dispatch and a role-gated fleet/rider console from the Services Hub.
5. **Zero-Trust Escrow Wallet, RBAC & AI Assistance:** Combines BDT (`৳`) Wallet balance, PK Coins loyalty rewards, Escrow holds released strictly on 4-digit OTP / Proof-of-Delivery (POD), Server-side Gemini AI (`@google/genai`) assistance, and a unified 0–7 Trust Level & Role hierarchy.

---

## 2. Canonical Hub & Workspace Architecture (Zero Route Collisions)

Business/discovery surfaces live under their owning folder in `apps/frontend/src/hubs/<hub>/`. Cross-hub account, order, wallet and governance workspaces live under `portals/`; legacy routes redirect to the canonical hub. **Never create duplicate portal folders or overlapping wildcard route shadows.**

| Hub / Portal ID | Canonical Route | Guard | Owning Folder | Core Responsibilities |
| :--- | :--- | :--- | :--- | :--- |
| `social` | `/hub/social` (`/portal/social` compatibility) | Public (Auth for write) | `hubs/social` | Mixed social feed, stories, composer, reactions and shoppable post references |
| `explore` | `/portal/explore` | Public | `portals/explore` | Directory for the five business hubs and separate account/workspace tools |
| `commerce` | `/hub/marketplace` (`/portal/marketplace` compatibility) | Public | `hubs/marketplace` | Mixed product feed and registered child homes: Retail, Wholesale/B2B, Grocery, Pharmacy, Brand Shops, Digital, Demand and Used |
| `product-details` | `/hub/marketplace/product/:id` | Public (checkout policy applies) | `hubs/marketplace/portals/product-details` | Product detail, seller comparison, variant selection and order actions |
| `wholesale` | `/hub/marketplace?portal=wholesale` (`/portal/wholesale` compatibility) | Public (RFQ requires Auth) | `hubs/marketplace/portals/wholesale` | B2B catalog, factory tiers, MOQ pricing, RFQs and sample requests inside Marketplace Hub |
| `services` | `/hub/services` (`/portal/services` compatibility) | Public (Booking requires Auth) | `hubs/services` | Mixed service/provider/demand feed and local services, food and travel child homes |
| `logistics` | `/hub/logistics` (`/portal/transit` compatibility) | Public Quote / Auth Book / Role-Gated Fleet | `hubs/logistics` | Ride, parcel/waybill, cargo/rental, emergency and fleet/rider experiences |
| `creator` | `/hub/creator` (`/portal/creator` compatibility) | Public (Creator actions require Auth) | `hubs/creator` | Free/ad-supported and paid creator content, video unlocks and creator posts |
| `orders` | `/portal/orders` | Auth (or Guest Tracker token) | `portals/orders-hub` | Purchases, Store Sales, shipment tracking, delivery OTP, escrow release, reorder, guest tracking |
| `wallet` | `/portal/wallet` | Auth | `portals/wallet` | BDT balance, escrow holds, top-up, withdraw, rewards and transaction ledger |
| `messages` | `/portal/messages` | Auth | `features/messaging` + shared workspace entry | Buyer–Vendor–Rider chat and bilingual shopping assistant |
| `vendor-dash` | `/portal/seller` | **Auth + Vendor/Admin Guard** | `portals/seller-central` | Multi-step KYC, business switching, inventory, pricing, dispatch and revenue analytics |
| `profile` | `/portal/profile` | Auth (Public Store view via `/store/:id`) | `portals/user-profile` | Unified Consumer Cockpit (`Orders`, `Saved Addresses`, `Trust Badge`, `Timeline`) + Verified Public Storefront link |
| `notifications` | `/portal/notifications` | Auth | `portals/notifications-center` | Categorized real-time alerts (`Orders`, `Logistics`, `Escrow`, `Bids`, `Social`) |
| `settings` | `/settings` | Public Preferences / Auth Security | `portals/settings-center` | Dark/Light Theme toggle, `EN / বাংলা` language switch, GPS Radar (`1–20km`), Privacy & Security |
| `guide` | `/portal/guide` | Public | `portals/guide` | Interactive **User & Vendor Navigation Guide** synced with `/documents/USER_AND_VENDOR_GUIDE.md` |

> **Admin & Governance Control:** `portals/super-admin` (`SuperAdminControlModal` / Admin Route) MUST enforce `admin` / `super_admin` server-verified authorization for KYC approvals, Master Product moderation, and Escrow dispute arbitration.

---

## 3. Five-Hub Navigation & Portal Composition

PaikarMart is organized around persistent product hubs. A hub owns the mixed feed, portal entry rail, child portal state, and hub-level filters. A child portal owns its domain-specific home surface, cards, categories, and actions.

### Canonical hubs

| Hub | Entry | Mixed feed | Child portal examples |
| :--- | :--- | :--- | :--- |
| **Marketplace Hub** | Bottom Navigation → Market | Mixed physical and digital product, shop, offer, demand and resale feed | Retail, Wholesale/B2B, Grocery, Pharmacy, Brand Shops, Digital Goods, Demand, Used |
| **Services Hub** | Bottom Navigation → Services | Mixed service, provider, service demand and offer feed | Local Services, Food Delivery, Travel & Stays |
| **Creator Hub** | Bottom Navigation → Creator | Free, ad-supported and paid creator content | Video, Shorts, paid unlocks, creator posts |
| **Social Hub** | Bottom Navigation → Feed | Following-based social and shoppable mixed feed | Posts, stories, business/creator content references |
| **Logistics Hub** | Explore / Logistics entry | Ride, parcel, transport, rental and emergency dispatch | Ride, Parcel & Waybill, Cargo & Rentals, Fleet Console |
| **Workspace Tools** | Explore / Account Navigation | Account, wallet, order and seller utilities; not counted as a business hub | Wallet, Orders, Seller Central, Guide, Settings |

### Hub interaction contract

1. Entering a hub from Bottom Navigation opens the hub mixed feed; it must not open a child portal directly.
2. The hub's portal entry rail is rendered above the feed and contains only child portals belonging to that hub.
3. Selecting a child portal keeps the user inside the same hub surface. It changes the active portal home, feed query, and product/service category chips; it does not replace the hub shell with a competing route.
4. Hub entry buttons MUST NOT be repeated inside the child portal category rail. Hub switching belongs to Bottom Navigation or Explore.
5. Child portal selection stays on the same hub screen and syncs to query state (`?portal=...&category=...`) for direct linking and browser back/forward.
6. A new child portal must be registered through the owning hub's typed portal config; business logic must not be copied across hubs to reuse a portal.
7. `HubPortalNavigation` is the shared portal/category rail. Marketplace and Services may keep domain-specific card layouts, but domain cards must not be duplicated between feeds.

### Target frontend composition

```text
apps/frontend/src/hubs/
├── shared/{HubPortalNavigation.tsx,HubFeedCard.tsx,hubTypes.ts}
├── marketplace/
│   ├── MarketplaceHub.tsx
│   ├── pages/MarketplaceHubPage.tsx
│   ├── pages/product-details/ProductDetailsPage.tsx
│   ├── config/marketplacePortals.ts
│   └── portals/wholesale/{pages,components}/
├── services/
│   ├── ServicesHub.tsx
│   ├── config/servicePortals.ts
│   └── portals/local-services/{pages,components}/
├── social/{pages,components}/
├── creator/{pages,components}/
└── logistics/{pages,components,config}/
```

The existing `/portal/social`, `/portal/marketplace`, `/portal/wholesale`, `/portal/services`, `/portal/transit`, and `/portal/creator` URLs remain compatibility redirects. Product/service data and backend domains have not been merged or duplicated by this frontend folder move.

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
   * User selects location/radar radius (`1–20 km`, default `5 km`) in `LocationContext` → `hubs/services` and `hubs/marketplace` filter nearby providers/stores by distance, `isOpen` status, and `prepTime + transitTime` ETA.

---

*Authoritative System Truth — Every AI agent and developer must align code, routes, schemas, and UI strictly with this specification.*
