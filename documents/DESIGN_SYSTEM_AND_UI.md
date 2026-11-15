# PaikarMart Design System & UI/UX Constitution

This document governs visual identity, layout architecture, responsiveness, typography, and portal-specific UX patterns across PaikarMart. Every frontend engineer and AI agent MUST follow this constitution together with `/documents/CTA_DESIGN_SYSTEM.md`.

---

## 1. Visual Identity & Dual-Theme Surface Architecture

PaikarMart uses an adaptive **Dual Light/Dark Contrast** system managed by `ThemeContext` (`dark` class on root, persisted in `PAIKARMART_DARK_MODE`). **Never build dark-only or light-only hard-coded pages** (fixing the ZIP's dark-only `bg-black` / `bg-[#0f111a]` hardcoded pages).

| Surface Token | Light Mode Classes | Dark Mode Classes |
| :--- | :--- | :--- |
| **App Canvas** | `bg-slate-50` | `bg-slate-950` |
| **Primary Card / Sheet** | `bg-white border-slate-200` | `bg-slate-900 border-slate-800` |
| **Elevated Sub-Panel / Input** | `bg-slate-50 border-slate-200/80` | `bg-slate-800/50 border-slate-700/60` |
| **Primary Heading / Copy** | `text-slate-900` | `text-white` / `text-slate-100` |
| **Secondary / Metadata** | `text-slate-500` | `text-slate-400` |

### Semantic Portal Color Accents
* **Social Feed & Core Retail:** PaikarMart Blue (`bg-blue-600`, `text-blue-600 dark:text-blue-400`)
* **B2B Wholesale & Verified Badges:** Emerald & Amber (`emerald-600`, `amber-500`)
* **Transit & Logistics:** Sky & Cyan (`sky-600`, `cyan-500`)
* **Wallet & Escrow Protection:** Emerald & Violet (`emerald-600`, `violet-600`)
* **Services & Hyperlocal Nearby:** Indigo & Teal (`indigo-600`, `teal-500`)
* **Emergency / Alerts / Stockout:** Rose (`rose-600`, `red-500`)

---

## 2. Adaptive App Shell & Responsive Viewport Rules

### Hub navigation pattern

* Bottom Navigation opens the two primary hubs: **Market** and **Services**. The center Hub button opens Explore/Portal Directory.
* A hub page starts with a mixed feed and one responsive child-portal rail directly above it.
* The rail contains child portals only; hub entry buttons are not duplicated inside it.
* Selecting a child portal keeps the current hub shell, changes the portal home surface, and replaces the lower category chips with that portal's product/service categories.
* On mobile, the child-portal rail is a horizontal snap scroller with 44px minimum touch targets; on desktop it remains a compact horizontal rail.

1. **Desktop 3-Column Ergonomics (`lg:` and up):**
   * **Left Rail (`w-64 xl:w-72 sticky`):** `DesktopLeftNav` — Profile card + Trust badge, Primary Portal switcher, Seller Central / Admin quick controls, Guide & Settings.
   * **Center Workspace (`flex-1 min-w-0`):** Active Portal canvas (`<main>`) with crisp horizontal padding and `max-w` containment.
   * **Right Sidebar (`DesktopRightSidebar`):** Active order/waybill live card, mini cart preview, verified nearby vendors, trending demand requests.
2. **Mobile Thumb-Zone Ergonomics (`375px–430px`):**
   * **Sticky `TopNavbar`:** Brand mark, GPS Location & Radius trigger (`LocationPickerModal`), Global Search, Messaging badge, Notification bell, Wallet pill, and `SidebarDrawer`.
   * **Fixed 5-Slot `BottomNav` (`h-[4.5rem]` + `pb-safe`):**
     1. **Home** (`feed`)
     2. **Market** (`commerce`)
     3. **Elevated Center Hub** (`explore` / `SuperAppHubModal` — gives 1-tap access to Wholesale, Seller Central, Orders, Wallet, Guide, Transit)
     4. **Creator** (`creator`)
     5. **Services / Rides** (`services` ↔ `rides`)
3. **Touch & Interaction Ergonomics:**
   * All primary interactive controls, tabs, and list buttons MUST meet comfortable touch targets (`min-h-[44px]`).
   * Apply subtle tactile press micro-interactions (`active:scale-[0.98]`) and `transition-colors`/`transition-all` feedback.
   * Never use native `window.alert`, `window.confirm`, or `window.prompt`; use in-app React modals/drawers and non-blocking toast notifications.

---

## 3. Anti-Slop Typography, Currency & Data Presentation Rules

1. **Zero-Pill Metadata Discipline:**
   * NEVER clutter cards with rows of tiny rounded-full pill badges for locations, timestamps, ratings, stock counts, and distances.
   * Format metadata cleanly in a single middot-separated scannable line (`·`):  
     `Chawkbazar, Dhaka · 3.2 km · ETA 22 min · ★ 4.9`
   * Reserve tinted pills strictly for high-signal actionable status indicators (e.g., `In Transit`, `Escrow Held`, `KYC Pending`, `Buy-Box Winner`).
2. **Strict BDT (`৳`) & Tabular Numerals:**
   * Every monetary value across Retail, Wholesale, Wallet, Escrow, Orders, and Logistics MUST display in **BDT (`৳`)**.
   * Apply `font-mono tabular-nums` to all prices, wallet balances, OTP digits, tracking IDs, distance counters, and KPI values so columns never jitter.
3. **Radius & Elevation System:**
   * Hero banners / Portal top cards: `rounded-[2rem]` or `rounded-3xl`
   * Data cards / Inputs / Primary CTAs: `rounded-2xl` or `rounded-xl`
   * Prefer crisp 1px borders (`border-slate-200 dark:border-slate-800`) and clean contrast over heavy neon glow clutter.
4. **Media & Asset Integrity:**
   * Never embed hardcoded `unsplash.com` or fake `dicebear` placeholder URLs inside newly created components. Use Lucide icons, clean SVG route/zone diagrams, or verified catalog/upload assets.
5. **Bilingual Parity (`EN / বাংলা`):**
   * Wire all primary UI labels, status chips, and empty states through `useLanguage()` (`t(en, bn)`) cleanly.
6. **Zero Telemetry / Zero Console Leaks:**
   * Never render raw JSON dumps, developer debug logs, or internal IDs in production user screens.

---

## 4. Module-Specific UI/UX Blueprints (Consolidated from ZIP Audit)

| Module / Portal | Authoritative UI/UX Pattern | Anti-Pattern Eliminated |
| :--- | :--- | :--- |
| **Social Feed (`social-feed`)** | Clean Facebook-style stream + Horizontal `StoriesTray` + Polymorphic `PostComposer` (`Text`, `Media`, `Product Tag`, `Open Demand`) + Filter tabs (`All`, `Following`, `Wholesale`, `Retail`, `Demand`). Location-matched posts rank first. | Fixes the ZIP bug where filtering `retail` inverted `postType !== 'product'`. |
| **Market / Retail (`marketplace`)** | Dual-responsive catalog (`4-column grid` desktop / `2-column` mobile) with Category strip, PMIN **Buy-Box Winner** highlight + "View N other seller offers" drawer, Discount/Wholesale MOQ filter, and `ProductDetailsLanding`. | Eliminates competing mobile-vs-desktop duplicate components and static hardcoded prices. |
| **Wholesale B2B (`wholesale-hub`)** | Factory & Distributor catalog showing `MOQ`, Tiered Slab table (`10+`, `50+`, `200+` units in `৳`), Direct Cart bulk calc, and **Request Quote (`RFQModal`)** side-by-side. | Separates true B2B tiered ordering cleanly from single-unit Retail checkout. |
| **Local Shops & Services (`services-hub`)** | Top GPS Radius Selector (`1, 3, 5, 8, 10, 20 km`) + Category chips (`Grocery`, `Pharmacy`, `Food`, `Repair`, `Salon`, `Clinic`) + Cards showing live `km` distance, Open/Close indicator, `prep + transit` ETA, direct store entry & in-app storekeeper chat. | Replaces fake offline shop arrays when API is healthy and consolidates shopkeeper chat into `features/messaging`. |
| **Transit & Logistics (`transit-logistics`)** | **4-Sub-Portal Architecture** (`Ride`, `Courier & Multi-Stop`, `Cargo & Rentals`, `Fleet/Rider Console`). Uses a **2-Column Booking & Live Quote Sheet** (Left: route/stops/load inputs; Right: server-calculated `৳` fare breakdown + driver matching + live route card). | Replaces 2,000-line monolithic stacked forms and hardcoded client fare math. |
| **Orders Hub (`orders-hub`)** | Split KPI overview + Tabbed `Purchases` / `Store Sales` / `Guest Tracker`. Clicking any order opens `OrderDetailsModal` with embedded `<LogisticsLivePanel />`, 4-digit delivery OTP verification, `Reorder`, and `Confirm Delivery` (Escrow Release). | Prevents disconnected order tracking and replaces USD (`$`) with BDT (`৳`). |
| **Unified Profile & Storefront (`user-profile`)** | **Owner Mode (`isMe`):** Facebook-style Timeline + `BuyerCockpit` (Wallet summary, Saved Addresses, Trust Level 0–7 badge, Order shortcuts) + Conditional Store tab (shows `Become a Seller` CTA if `none`, status tracker if `submitted`, or `Seller Central` link if `approved`). **Public Visitor Mode (`/store/:slug`):** Unified dynamic Storefront showing vendor catalog, rating breakdown, and Follow/Message actions. | Eliminates ZIP's local-only `useState` mock timeline, hardcoded `১,৪২০ Followers`, and dual competing storefront files (`SellerStoreFront` vs `PublicSellerStoreFront`). |
| **Seller Central (`seller-central`)** | Role-protected Merchant Cockpit (only accessible to `vendor`/`admin`) with Overview KPIs, KYC Status Banner, Product/PMIN Offer Manager, B2B Tier Editor, Order & Courier Dispatch Queue, and Wallet Settlement Ledger. | Removes ZIP's unguarded `/seller` route and removes fake UI "Role Demo Switcher". |
