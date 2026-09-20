# PaikarMart — Agent & Developer Guidelines
> সব AI agent এবং developer-এর জন্য। Build শুরুর আগে এটা পড়তে হবে।

---

## 🏗️ Project Identity

- **Name:** PaikarMart
- **Type:** Bangladesh Super App — Social Commerce + B2B + Services + Media
- **Stack:** React 18 + TypeScript + Vite + Tailwind CSS v4 + Zustand + Express + Prisma + Socket.io + motion/react
- **Market:** Bangladesh first → global later
- **Server Port:** 5000 (tsx server.ts)
- **Dev Command:** `npm run dev` (workflow: "Start application")

---

## 📋 The Golden Rules (ভাঙলে project অচল হবে)

### Rule 1 — No Duplicate Files
```
নতুন file বানানোর আগে:
  1. grep করো — same concept-এর file কোথাও আছে কিনা
  2. আছে? → সেটা READ করো → EDIT/UPDATE করো
  3. নেই? → নতুন বানাও, সঠিক folder-এ

Delete করার আগে:
  1. সেই file পুরো READ করো
  2. grep করো — অন্য কোথাও import হচ্ছে কিনা
  3. বুঝে সিদ্ধান্ত নাও — merge করবে না delete করবে
```

### Rule 2 — Single Source of Truth
```
Cart   → @/modules/cart/useCartStore       (শুধু এটাই)
Wallet → @/modules/wallet/useWalletStore   (শুধু এটাই)
Auth   → @/features/auth/AuthContext       (শুধু এটাই)
```

### Rule 3 — Import Alias Always
```typescript
✅ import { X } from '@/modules/cart/useCartStore'
✅ import { X } from '@modules/cart'           // barrel index.ts
❌ import { X } from '../../modules/cart/cartStore'
❌ import { X } from '@/store/cartStore'
```

### Rule 4 — Module Boundaries
```
src/modules/     → store + service + hooks + types ONLY (JSX pages নেই)
src/portals/     → portal-specific pages + layouts
src/features/    → cross-portal features (auth, cart, registration)
src/components/  → reusable UI components (business logic নেই)
src/pages/       → core app pages শুধু (login, register, settings, 404)
src/config/      → data-driven config files (portal registry, roles)
src/shared/      → global shared components (StoryBar, PortalIconBar)
```

### Rule 5 — No Hardcoded Lists
```typescript
❌ const tiles = [{ label: 'Food', route: '/food' }, ...]  // component-এর ভেতরে
✅ PORTAL_REGISTRY থেকে import করে render করো (src/config/portals.config.ts)
```

### Rule 6 — Barrel-Only Imports for Modules
```typescript
✅ import { useCartStore } from '@modules/cart'      // barrel index.ts
❌ import { useCartStore } from '@modules/cart/store/cartStore.ts'  // direct
```

### Rule 7 — No Blind Full-File Overwrites
```
Edit করার সময় targeted edit করো।
Full overwrite করলে existing features ভাঙতে পারে।
```

### Rule 8 — Mock Data শুধু Dev-এ
```typescript
// Component-এ mock data থাকতে পারবে — কিন্তু API hook placeholder সাথেই থাকবে
// Production build-এ real API call mandatory
```

### Rule 9 — Component Placement
```
Global UI Primitives  → src/components/ui/
Cross-Portal Shared   → src/components/common/
Feature-Specific UI   → src/modules/[name]/components/
Portal Pages          → src/portals/[name]/pages/
```

---

## 📁 Folder Structure

```
src/
├── app/AppShell/
│   ├── routeConfig.ts        ← SINGLE route source of truth
│   ├── navigationConfig.tsx  ← Sidebar nav items
│   └── AppShell.tsx          ← Remove ChatWidget from here → to /messages
│
├── config/                   ← Data-driven, never hardcode
│   ├── portals.config.ts     ← 🆕 Portal registry (Phase 1)
│   ├── roles.config.ts       ← 🆕 Role → permissions (Phase 1)
│   └── payment.config.ts     ← bKash/Nagad/VAT config
│
├── features/
│   ├── auth/                 ← AuthContext (SINGLE source)
│   ├── social-profile/       ← Profile system
│   └── registration/         ← 🆕 Smart wizard (Phase 3)
│
├── modules/                  ← Business logic ONLY (no JSX pages)
│   ├── cart/                 ← useCartStore (single source)
│   ├── wallet/               ← useWalletStore (single source)
│   ├── ai/                   ← Aloop AI → embed in /messages
│   └── analytics/            ← Event bus
│
├── components/
│   ├── ui/                   ← Radix/shadcn primitives
│   └── common/               ← Cross-portal shared
│       ├── PostCard/          ← 🆕 Polymorphic card
│       ├── BDAddressSelector  ← 🆕 Division→ZIP
│       ├── TrustBadge         ← 🆕 7-level badge
│       └── HeroSection        ← Exists — update, don't recreate
│
├── portals/
│   ├── _templates/            ← 🆕 Shared templates
│   │   ├── EcomDeliveryPortal/ ← Food+Grocery+Pharmacy
│   │   ├── ListingPortal/      ← Marketplace+Electronics
│   │   └── SellerDashboard/    ← All seller dashboards
│   ├── messages/               ← Add AI Chat embed here
│   └── [12 super portals]/
│
└── shared/                   ← StoryBar, PortalIconBar (already exists)
```

---

## 🧭 Portal Homepage Rule (Mandatory)

**প্রতিটি portal homepage এই exact order-এ:**
```tsx
<StoryBar context="[portal-name]" />       // 1st
<PortalIconBar context="[portal-name]" />  // 2nd
{/* portal-specific content */}
```
`src/shared/` তে আছে — নতুন তৈরি করবে না।

---

## 🗺️ Bottom Navigation (Confirmed — Final)

```
🏠 Home | 🛍️ Marketplace | ⊞ Apps | 💬 Message | 👤 Profile
```

- **Message** → `/messages` — AI Chat + Buyer-Seller Chat একসাথে
- **Apps** → AppLauncher modal (portal grid)
- Orders, Notifications → sidebar-এ, bottom nav-এ নেই

---

## 🤖 AI Chat (Aloop AI)

```
❌ AppShell.tsx floating ChatWidget → সরাতে হবে (Phase 1)
✅ /messages page pinned top       → embed করতে হবে
```

---

## 📦 Logistics Hub & Universal Checkout (Upcoming)

```
1. Logistics Hub: শুধু Delivery নয়, Ecosystem হিসেবে build করো (Ride, Transport, Business, Fulfillment, Emergency layers).
2. Universal Checkout: সব portal-এর জন্য single unified checkout foundation + BD Address Selector ব্যবহার করো।
3. Single Address Source: User profile-এর address-ই সব পোর্টালে (Pickup/Drop/Delivery) use হবে।
```

---

## 🔐 Security Rules

```
1. Client bundle-এ NEVER: VITE_SUPABASE_ANON_KEY, JWT_SECRET, DATABASE_URL
2. CORS: production-এ wildcard (*) নয় — specific origins দিতে হবে
3. Auth middleware: dev mock JWT → production real JWT
4. Rate limit: auth (10/min), writes (30/min), general (200/min)
5. Soft delete only — hard delete কখনো নয়
```

---

## 🎨 UI/UX Core Rules

```
Icons:     lucide-react ONLY
Colors:    CSS variables ONLY — var(--pm-accent), var(--pm-bg), etc.
Animation: motion/react (NOT framer-motion — migration done)
Touch:     minimum 44×44px সব interactive elements
Mobile:    env(safe-area-inset-*) সব sticky elements-এ
Spacing:   8px grid strict
Bilingual: সব UI text-এ BN + EN label
```

---

## 🇧🇩 Bangladesh-Specific Rules

```typescript
BD_PHONE_RE = /^01[3-9]\d{8}$/          // phone validation
formatPrice(1234) → "৳1,234"            // price display
VAT_RATE = 0.05                          // 5% auto on checkout
bKash color: #e2136e                     // never change
Nagad color: #f37021                     // never change
Address: Division → District → Upazila → Area → ZIP
Rider plate: "DHAKA-METRO-XXXX"
```

---

## ✅ Pre-Build Checklist

```
□ same concept-এর file grep করেছি?
□ existing file আছে? → read → update করব?
□ _templates/ use করা যাবে?
□ @/ alias ব্যবহার করছি? (relative path নয়)
□ single store source of truth use করছি?
□ data config থেকে আসছে? (hardcode নয়)
□ real API hook / placeholder আছে?
□ 44px touch target hoga?
□ Bengali label আছে?
□ safe-area handled?
```

---

## 🚀 Next Steps (Current Focus)

```
1. Phase 3: Start the Smart Registration Wizard refactor for B2B/Wholesale/Retail roles.
2. Logistics Hub: Implement the ride-share and transport availability layers in the backend.
```

---

## 📚 Documentation Index

```
MASTER_PLAN.md                          ← Architecture + 6-phase build plan
AGENTS.md                               ← এই file — dev rules
README.md                               ← Project setup + overview
documentation/DESIGN_SYSTEM.md         ← UI/UX standards (colors, spacing, motion)
documentation/ROLES_AND_PERMISSIONS.md ← Role matrix + 7-level trust
documentation/API_AND_DATABASE.md      ← API endpoints + DB schema
```
