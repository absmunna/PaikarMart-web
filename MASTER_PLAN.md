# PaikarMart — Master Architecture & UI/UX Plan
> Version: 2.1 | Date: 2026-06-26 | Status: Phase 1 Complete — Moving to Phase 2 & 3

---

## 0. The Golden Rules (Build করার সময় সবার আগে পড়তে হবে)

এই rules ভাঙলে project শেষ পর্যন্ত maintain করা অসম্ভব হবে।

### 0.1 No Duplicate Files Rule
```
কোনো নতুন file বানানোর আগে:
  1. grep করো — same concept-এর file কোথাও আছে কিনা
  2. আছে? → সেটাই READ করো, তারপর EDIT/UPDATE করো
  3. নেই? → নতুন file বানাও, সঠিক folder-এ

Delete করার আগে:
  1. সেই file টি READ করো পুরোটা
  2. অন্য কোথাও import হচ্ছে কিনা grep করো
  3. বুঝে সিদ্ধান্ত নাও — merge করবে নাকি delete
```

### 0.2 No Hardcoded Data
```
✅ সঠিক: config file → component render করে
❌ ভুল:  component-এর ভেতরে const tiles = [{...}, {...}]
```

### 0.3 Single Source of Truth
```
প্রতিটি domain-এর জন্য একটাই store/context:
  Cart    → @/modules/cart/useCartStore (only)
  Wallet  → @/modules/wallet/useWalletStore (only)
  Auth    → @/features/auth/AuthContext (only)
```

### 0.4 Import Rules
```
✅ সঠিক:   import { X } from '@/modules/cart/useCartStore'
✅ সঠিক:   import { X } from '@modules/cart'  (barrel index.ts)
❌ ভুল:    import { X } from '../../modules/cart/cartStore'
❌ ভুল:    import { X } from '@/store/cartStore'
```

### 0.5 Module Boundary
```
src/modules/     → শুধু: store, service, hooks, types (NO JSX pages)
src/portals/     → শুধু: portal-specific pages, layouts
src/features/    → শুধু: cross-portal features (auth, cart, registration)
src/components/  → শুধু: reusable UI components (NO business logic)
src/pages/       → শুধু: core app pages (login, register, settings, 404)
```

### 0.6 Mock Data Rule
```
mockData.ts files → শুধু development/dev mode-এ
production build  → সব API call real হতে হবে
নতুন component    → mock দিয়ে শুরু করো, কিন্তু API hook-এর
                    placeholder রাখো সাথে সাথে
```

### 0.7 File Naming Convention
```
Component:     PascalCase.tsx         (ProfileCard.tsx)
Hook:          camelCase.ts           (useCartStore.ts)
Store:         camelCase.ts           (cartStore.ts)
Service:       camelCase.ts           (cartService.ts)
Config:        kebab-case.config.ts   (portals.config.ts)
Types:         camelCase.types.ts     (cart.types.ts)
Page:          PascalCase.tsx         (MarketplaceHome.tsx)
```

---

## 1. Vision

PaikarMart হবে Bangladesh-এর **Super App** — social commerce + marketplace + services + B2B সব একসাথে। প্রতিটি portal স্বতন্ত্র website-এর মতো feel করবে কিন্তু same account, wallet, profile দিয়ে চলবে।

**Design Philosophy:**
- **Minimal but Iconic** — কম element, বেশি impact; প্রতিটি element-এর কারণ থাকতে হবে
- **Social + Commerce Mixed** — প্রতিটি product একটা social post, প্রতিটি post-এ commerce hook
- **Mobile-first** — 44px touch target, safe-area, native feel
- **Dark Cosmic** — current dark theme برقرار থাকবে (`#04070f` base, `#00e676` green accent)
- **Bilingual** — বাংলা + English, সব UI তে
- **Progressive** — guest থেকে seller পর্যন্ত smooth upgrade path

---

## 2. Portal Architecture (12 Super Portals)

প্রতিটি portal আলাদা website-এর মতো কিন্তু same shell, auth, wallet share করে।

### 2.1 Portal Registry

| ID | Portal Name | Real-World Model | Route | Status |
|---|---|---|---|---|
| `marketplace` | Marketplace | Daraz / Shopee | `/marketplace` | ✅ আছে |
| `b2b` | B2B Trade Hub | Alibaba / TradeKey | `/b2b` | ✅ আছে |
| `food` | Food Delivery | FoodPanda | `/food` | ✅ আছে |
| `grocery` | Grocery | Chaldal | `/grocery` | ✅ আছে |
| `pharmacy` | Pharmacy | AmarLab | `/pharmacy` | ✅ আছে |
| `ride` | Logistics Hub | Pathao / Uber / Courier | `/ride` | ✅ আছে |
| `services` | Services | Fiverr | `/services` | ✅ আছে |
| `media` | News & Content | YouTube + Prothomalo | `/news` | ⚡ video/reels merge |
| `nearby` | Nearby Shops | Google Local | `/local` | ✅ আছে |
| `travel` | Travel & Hotel | Booking.com | `/travel` | ⚡ hotel merge |
| `jobs` | Jobs & Career | Bdjobs | `/jobs` | ⚡ page → portal |
| `verticals` | Niche Markets | Hub | `/verticals` | 🆕 নতুন hub |

**Verticals sub-portals:**
`/real-estate` | `/agriculture` | `/healthcare` | `/education` | `/auto` | `/finance` | `/events` | `/telecom`

### 2.2 Portal Structure Rule (Every Portal MUST Follow)

প্রতিটি portal homepage-এ এই structure গুরুত্বপূর্ণ:

```
[1] StoryBar          ← dynamic activity stories (Instagram-style, horizontal scroll)
[2] PortalIconBar     ← category shortcut icons (horizontal scroll, sticky)
[3] Hero / Feature    ← portal-specific hero (Bento Grid for marketplace, etc.)
[4] Main Content      ← products/listings/feed
[5] Sticky Bottom Bar ← primary action (Buy Now / Order / Book / Apply)
```

`StoryBar` এবং `PortalIconBar` আগে থেকেই `src/shared/` এ আছে — নতুন portal-এ import করবে, নতুন তৈরি করবে না।

### 2.3 Shared Portal Templates (No Code Duplication)

```
src/portals/_templates/
  ├── EcomDeliveryPortal/    ← Food + Grocery + Pharmacy use করবে
  │   ├── PortalLayout.tsx       (StoryBar + PortalIconBar + product grid)
  │   ├── ProductCard.tsx        (shared card)
  │   ├── CategoryFilter.tsx     (horizontal scroll)
  │   ├── CartDrawer.tsx         (slide-in cart)
  │   └── CheckoutFlow.tsx       (address → payment → confirm)
  │
  ├── ListingPortal/         ← Marketplace + Electronics + Fashion use করবে
  │   ├── SearchableProductGrid.tsx
  │   ├── FilterSidebar.tsx
  │   ├── SortBar.tsx
  │   └── ProductListCard.tsx
  │
  └── SellerDashboard/       ← সব portal-এর seller dashboard
      ├── DashboardStats.tsx     (orders, revenue, views — 160×88px cards)
      ├── ProductManager.tsx
      ├── OrderManager.tsx
      └── PayoutPanel.tsx
```

**বানানোর আগে চেক করতে হবে:** এই templates-এর কোনো component আগে থেকে `src/portals/*/components/` এ আছে কিনা — থাকলে সেখান থেকে move/refactor করবে, duplicate তৈরি করবে না।

---

## 3. Role & Trust System

### 3.1 Role Hierarchy

```
AppRole (single user can have multiple roles)
  │
  ├── guest              → browse only, no account
  ├── user               → default after registration
  │
  ├── [MERCHANT GROUP]   → same dashboard
  │   ├── retail_seller      → Marketplace shop
  │   ├── wholesale_seller   → B2B wholesale
  │   ├── factory_seller     → B2B factory + export
  │   ├── food_seller        → Food portal restaurant
  │   ├── grocery_seller     → Grocery portal shop
  │   ├── rural_seller       → Rural/nearby seller
  │   └── nearby_shop        → Local physical shop
  │
  ├── [SERVICE GROUP]    → service-specific dashboard
  │   ├── service_provider   → Services portal
  │   ├── digital_seller     → Digital products
  │   └── content_creator    → Media portal creator
  │
  ├── [TRANSPORT GROUP]  → map-based dashboard
  │   ├── rider              → Ride + delivery
  │   └── delivery_agent     → Delivery only
  │
  ├── [PROPERTY GROUP]
  │   ├── property_agent     → Real estate
  │   └── employer           → Job posts
  │
  └── [PLATFORM]
      ├── moderator
      ├── admin
      └── super_admin
```

### 3.2 Cascading Trust / Verification System (7 Levels)

```
Level 0 → Guest         (browse only, no account)
Level 1 → Phone OTP     (basic user, can buy, can post)
Level 2 → Email         (email confirmed, unlocks more features)
Level 3 → NID Submitted (seller application eligible)
Level 4 → NID Verified  (active seller, can list products)
Level 5 → Trade License (business seller, higher limits)
Level 6 → Export/Factory License (B2B + international)
Level 7 → Enterprise    (brand partnership, API access)
```

**UI Display:** Profile-এ trust badge দেখাবে:
- Level 0-1: কোনো badge নেই
- Level 2: ✉️ Email Verified
- Level 3-4: ✅ ID Verified
- Level 5: 🏢 Business Verified
- Level 6: 🌍 Export Verified
- Level 7: ⭐ Enterprise Partner

**Feature Gates:**
- Order value > ৳50,000 → Level 4 required
- B2B listing → Level 5 required
- Export inquiry → Level 6 required

### 3.3 Role-based Sidebar Nav

**Common সবার জন্য:**
```
🏠 Home Feed          → /
🛍️ Marketplace        → /marketplace
📦 My Orders          → /orders
💬 Messages + AI      → /messages
💰 Wallet             → /wallet
❤️ Wishlist           → /wishlist
🔔 Notifications      → /notifications
⚙️ Settings           → /settings
```

**Merchant extra:**
```
📊 Seller Dashboard   → /seller
🏪 My Products        → /seller/products
📋 Orders In          → /seller/orders
💸 Payouts            → /seller/payouts
📈 Analytics          → /seller/analytics
```

**Factory/B2B extra:**
```
🏭 Factory Dashboard  → /b2b/dashboard
📄 RFQ Management     → /b2b/rfq
🌍 Export Orders      → /b2b/export
📋 Documents          → /b2b/documents
⚙️ Machinery & Capacity → /b2b/capacity
```

**Driver extra:**
```
🚗 Go Online          → /ride/dashboard
📍 Active Trips       → /ride/trips
💵 Earnings           → /ride/earnings
🔧 Vehicle Profile    → /ride/vehicle
```

**Creator extra:**
```
🎬 Content Studio     → /media/studio
📈 Analytics          → /media/analytics
💡 Monetization       → /media/monetize
```

**Admin extra (3-column layout):**
```
Left Nav:    Portal list
Center:      Work area (users/orders/content)
Right Panel: AI Intelligence Matrix (fraud flags, velocity alerts, moderation queue)

Routes:
🛡️ Governance         → /admin
👥 Users              → /admin/users
📊 Platform Stats     → /admin/analytics
🚨 Reports            → /admin/reports
🤖 AI Flags           → /admin/ai-flags
```

---

## 4. Registration & Seller Upgrade

### 4.1 Base Registration (Universal)

```
Step 1 → Phone number → OTP verify (6-digit)
Step 2 → Full Name + Password (strength meter)
Step 3 → Done → role: "user", trust: Level 1

Optional Step 3a → "আমি বিক্রেতা হতে চাই" toggle
  → YES → Seller Type Selection screen
  → NO  → Home page
```

### 4.2 Seller Type Selection

```
┌─────────────────────────────────────┐
│  আপনার ব্যবসার ধরন বেছে নিন        │
│                                      │
│  [🛍️ Retail Shop]  [🏭 Wholesale]   │
│  [🍔 Restaurant]   [🛵 Rider]        │
│  [🔧 Service]      [📱 Digital]      │
│  [🏠 Real Estate]  [💼 Employer]     │
└─────────────────────────────────────┘
```

**নতুন file বানানোর আগে চেক করতে হবে:**
- `src/pages/auth/seller-register.tsx` — ৩৭৮ lines, 3-step seller flow আছে
- `src/pages/auth/factory-register.tsx` — ৪৮৪ lines, 5-step factory flow আছে
- `src/pages/auth/wholesale-register.tsx` — ৩০১ lines
- `src/pages/auth/rural-register.tsx` — আছে

→ এই ৪টি file থেকে logic extract করে একটাই smart wizard-এ merge করতে হবে (`src/features/registration/RegistrationWizard.tsx`). Old pages delete করার আগে সব কোড read করতে হবে।

### 4.3 Seller-Specific Steps

**Retail (3 steps):**
1. Shop Name + Category + Location (Division→District→Upazila selector)
2. Trade License (optional) + NID photo upload
3. Payout: bKash (#e2136e) | Nagad (#f37021) | Bank

**Wholesale/Factory (5 steps):**
1. Company + Type + District
2. Trade License + TIN + Export License
3. Product Categories + Export Countries
4. Bank Account (SWIFT for export)
5. Documents upload (Trade Lic scan, NID, export cert)

**Restaurant (3 steps):**
1. Name + Cuisine + Area + Operating hours
2. Min order + Delivery radius
3. Payout method

**Rider (3 steps):**
1. Vehicle type (bike/car/truck/van) + License no.
2. NID upload + Profile photo (license plate format: DHAKA-METRO-XXXX)
3. Service area selection

**Service Provider (3 steps):**
1. Skill category + sub-category
2. Portfolio + Rate (hourly/fixed)
3. Payout method

**Content Creator (2 steps):**
1. Channel name + Content type (video/blog/photo/podcast)
2. Platform links (YouTube/Facebook/TikTok/Instagram)

### 4.4 Profile → Seller Upgrade (Later Path)

```
Profile page → "PaikarMart-এ বিক্রি শুরু করুন" button
→ Same Seller Type Selection screen
→ Same portal-specific steps
→ Status: pending_review (visible on profile)
→ Push notification when approved
```

---

## 5. Profile System (Facebook-style)

### 5.1 Universal Profile Layout

```
┌──────────────────────────────────────┐
│  [Cover Photo — full width, 4:1]     │
│  [Avatar 88px] Name  [Trust Badge]   │
│  @handle • Role Badge • 📍 Location  │
│  Bio (160 chars max, Bengali support)│
│                                      │
│  [Edit Profile / Follow] [Message]   │
│  [•••  More options]                 │
├──────────────────────────────────────┤
│  Followers | Following | ⭐ Rating   │
│  [role-specific: Products | Orders]  │
├──────────────────────────────────────┤
│  Tabs (role-based):                  │
│  Posts | Products | Reviews | About  │
│  + Merchant: Dashboard               │
│  + Factory: Machinery | Export Hist  │
│  + Creator: Videos | Analytics       │
└──────────────────────────────────────┘
```

### 5.2 Role Badges

| Role | Badge | Color |
|---|---|---|
| user | 🛒 Buyer | gray |
| retail_seller | 🏪 Seller | blue |
| wholesale_seller | 🏭 Wholesale | indigo |
| factory_seller | 🏗️ Factory | orange |
| food_seller | 🍔 Restaurant | red |
| grocery_seller | 🛒 Grocery | green |
| rider | 🚗 Rider | cyan |
| service_provider | 🔧 Pro | purple |
| digital_seller | 💾 Digital | violet |
| content_creator | 🎬 Creator | pink |
| property_agent | 🏠 Agent | amber |
| employer | 💼 Employer | teal |
| moderator | 🛡️ Mod | yellow |
| admin | ⚡ Admin | lime |

### 5.3 Profile Data (Real API, No Mock in Production)

```
GET /api/v1/users/:userId          → profile info
GET /api/v1/users/:userId/posts    → feed items (paginated)
GET /api/v1/users/:userId/products → products (seller only)
GET /api/v1/users/:userId/reviews  → reviews received
GET /api/v1/users/:userId/stats    → follower counts, ratings
```

**বর্তমান সমস্যা:** `SocialProfilePage.tsx` পুরো `mockData.ts` থেকে data নিচ্ছে।
**Fix:** API hooks তৈরি করে replace করতে হবে। mockData.ts delete করার আগে সব fields document করতে হবে যাতে API schema match করে।

### 5.4 "Sell on PaikarMart" Prompt

Trust Level 1-2 user profile-এ একটি soft prompt দেখাবে:
```
┌──────────────────────────────┐
│ 💡 PaikarMart-এ বিক্রি করুন │
│ আপনার দোকান খুলুন, লক্ষ     │
│ ক্রেতার কাছে পৌঁছান।          │
│ [শুরু করুন →]                │
└──────────────────────────────┘
```
→ `src/components/common/ProgressiveVerificationPrompt.tsx` আগে থেকেই আছে — এটাই update করতে হবে।

---

## 6. Message Center + AI Chat (Unified)

### 6.1 Messages Page Structure (`/messages`)

```
┌──────────────────────────────────────┐
│  💬 Messages                 [✏️ New]  │
├──────────────────────────────────────┤
│  [🤖 AI Assistant]  ← pinned top     │
│  Smart help, order status,           │
│  product search via chat             │
├──────────────────────────────────────┤
│  Buyer-Seller Conversations          │
│  [Avatar] Seller Name                │
│           Last message preview       │
│           Time • unread count        │
│  ...                                 │
├──────────────────────────────────────┤
│  System Notifications (order, promo) │
└──────────────────────────────────────┘
```

### 6.2 AI Chat (Aloop AI) — Messages page-এ pinned

```
AI করতে পারবে:
  → "আমার অর্ডার কোথায়?" → order status দেখাবে
  → "সস্তায় ফোন খুঁজছি" → product search করবে
  → "দোকান খুলতে চাই"   → seller registration guide করবে
  → "bKash-এ পেমেন্ট দিতে চাই" → wallet/payment help
  → General Q&A about PaikarMart
```

**বর্তমান ChatWidget:** `src/modules/ai/components/ChatWidget.tsx` আছে — এটাকে messages page-এ integrate করতে হবে, floating widget থেকে সরাতে হবে।

**বর্তমান ChatList/ChatDetail:** `src/portals/messages/pages/` এ আছে — এগুলোই update করতে হবে।

### 6.3 Bottom Nav এর Message Item

Bottom Nav-এর Message icon-এ unread badge থাকবে:
- Buyer-Seller unread count
- AI new response indicator আলাদা রাখবে না (Messages-এ সব একসাথে)

---

## 7. Bottom Navigation Bar (Final)

```
🏠 Home | 🛍️ Marketplace | ⊞ Apps | 💬 Message | 👤 Profile
```

| Item | Icon | Route | Action |
|---|---|---|---|
| **Home** | Home | `/` | Social feed |
| **Marketplace** | ShoppingBag | `/marketplace` | Direct |
| **Apps** | Grid2x2 | — | AppLauncher modal open |
| **Message** | MessageCircle | `/messages` | Chat + AI |
| **Profile** | User/Avatar | `/profile/me` | Own profile |

**বর্তমান BottomNav.tsx:** আছে, structure ভালো। শুধু items update করতে হবে:
- `Notifications` item সরাবে
- `Marketplace` item যোগ করবে
- `Orders` সরাবে (sidebar-এ আছে)
- `Message` route → `/messages`

**Notification:** Sidebar nav-এ থাকবে + top bar bell icon-এ।

---

## 8. Home Feed (Bento Grid Hero)

### 8.1 Hero Section Layout

```
┌──────────────────────┬──────────┐
│                      │  Deal 1  │
│   Viral / Featured   │  Deal 2  │
│   Post (hero card)   ├──────────┤
│                      │  Deal 3  │
├──────────┬───────────┴──────────┤
│   Live   │   Open Demand Post   │
│  Banner  │   (B2B/buyer demand) │
└──────────┴──────────────────────┘
```

→ `HeroSection.tsx` আগে থেকে `src/components/common/` এ আছে — এটাই redesign করতে হবে, নতুন তৈরি নয়।

### 8.2 Feed Item (Polymorphic Post Card)

একটাই `<PostCard>` component — context বুঝে নিজেকে morph করে:

```typescript
type PostCardVariant =
  | 'marketplace'    // Buy Now + price + rating
  | 'service'        // Book Appointment + availability
  | 'b2b'            // Submit Bid + MOQ
  | 'food'           // Order Now + delivery time
  | 'job'            // Apply Now + salary range
  | 'real_estate'    // Request Visit + price/sqft
  | 'social'         // Like + Comment + Share (no commerce)
  | 'demand'         // "Open Demand" — buyer চাচ্ছে কিছু

// src/components/common/PostCard/PostCard.tsx
// variant prop দিয়ে behavior বদলায়
// CTA button, price display, metadata সব variant-specific
```

**বানানোর আগে চেক:** `src/components/` এ similar card আছে কিনা grep করতে হবে।

---

## 9. Product Detail Page Enhancements

### 9.1 Social Ticker (Live Urgency)

Product detail page-এ real-time social proof:
```
🔥 গত ২ ঘণ্টায় ১২ জন কিনেছেন
👀 এই মুহূর্তে ৮ জন দেখছেন
⚡ মাত্র ৩টি বাকি আছে
```

```typescript
// src/components/product/SocialTicker.tsx
// Props: { recentBuyers: number, currentViewers: number, stockLeft: number }
// WebSocket বা polling দিয়ে update হবে
// যদি data না থাকে — component render হবে না (no fake data)
```

### 9.2 Commerce-First Comment System (Tabbed)

Product comment section — ৩টি tab:

```
Tab 1: Reviews    → ✓ Verified Buyer badge — শুধু ক্রেতারা লিখতে পারবে
Tab 2: Q&A        → Buyer প্রশ্ন করে, Seller reply দেয় (thread)
Tab 3: Discussion → General (সবাই, unverified ও)

Algorithm: Verified Buyer review ranking-এ বেশি weight পাবে
```

```typescript
// src/components/product/CommentSection/
// ├── CommentSection.tsx   (tab wrapper)
// ├── ReviewTab.tsx
// ├── QATab.tsx
// └── DiscussionTab.tsx
```

---

## 10. Wallet System (Dual Currency)

### 10.1 Wallet Structure

```typescript
interface Wallet {
  bdt_balance: number        // বাস্তব টাকা
  pk_coin: number            // 1 PK = 0.5 BDT equivalent (reward)
  escrow_held: number        // চলমান order-এর hold amount
  credit_limit: number       // ভবিষ্যৎ: BNPL (Buy Now Pay Later)
}
```

### 10.2 PK Coin Rules

```
Earn PK Coin:
  → প্রতি purchase → 2% cashback in PK Coin
  → Review দিলে → 10 PK Coin bonus
  → Referral → 50 PK Coin

Spend PK Coin:
  → Checkout-এ partial payment (max 20% of order value)
  → Premium features unlock
  → Ad boost for sellers
```

### 10.3 Bangladesh Payment Integration

```typescript
// src/config/payment.config.ts — এটাই আছে, এখানে add করতে হবে

PAYMENT_PROVIDERS = {
  bkash:  { color: '#e2136e', flow: 'otp-pin', icon: 'bkash.svg' },
  nagad:  { color: '#f37021', flow: 'otp-pin', icon: 'nagad.svg' },
  rocket: { color: '#8B0000', flow: 'otp-pin', icon: 'rocket.svg' },
  card:   { flow: 'card-form' },
  bank:   { flow: 'bank-transfer', swiftEnabled: true },  // B2B export
  pk_coin: { flow: 'internal' }
}

VAT_RATE = 0.05  // Bangladesh: 5% VAT auto-calculation
```

---

## 11. Shared UI Components (New — Check Before Building)

এই components সব portal share করবে। বানানোর আগে `src/components/` grep করতে হবে।

### 11.1 BDAddressSelector
```
Division → District → Upazila → Area → ZIP
(8 Division → 64 District → ~495 Upazila)

// src/components/common/BDAddressSelector.tsx
// Props: { onChange, defaultValue, level: 'full' | 'district' | 'upazila' }
```

### 11.2 PostCard (Polymorphic)
```
// src/components/common/PostCard/PostCard.tsx
// Covered in section 8.2
```

### 11.3 SocialTicker
```
// src/components/product/SocialTicker.tsx
// Covered in section 9.1
```

### 11.4 TrustBadge
```
// src/components/common/TrustBadge.tsx
// Props: { level: 0-7, showLabel?: boolean }
// Renders appropriate trust level icon + tooltip
```

### 11.5 RiderCard (Order Tracking)
```
// src/components/orders/RiderCard.tsx
// Props: { name, photo, vehicleType, licensePlate, phone }
// License plate format: DHAKA-METRO-XXXX
// Shows: photo + name + plate + call button
```

---

## 12. Order Tracking (Live Map)

```
┌─────────────────────────────────────┐
│  [Interactive Map — SVG/MapBox]     │
│  • Pulsating rider marker           │
│  • Route line to destination        │
├─────────────────────────────────────┤
│  Timeline:                          │
│  ✅ Ordered → ✅ Packed →           │
│  🔄 Picked Up → 🚗 In Transit →    │
│  📍 Out for Delivery → ✅ Delivered  │
├─────────────────────────────────────┤
│  [RiderCard] — photo, name, plate   │
│  [📞 Call Rider] [💬 Message]       │
└─────────────────────────────────────┘
```

**Exception states:**
```
"মায়ের দোয়া Logistics — Tongi-তে delay হচ্ছে"
→ Estimated delay time + alternative pickup option
```

---

## 13. B2B Portal Extras

### 13.1 Factory Profile Special Tabs
```
Products | Machinery & Capacity | Certifications | Export History | Reviews
```

**Machinery & Capacity tab:**
```
Machine Name | Type | Monthly Capacity | Output Unit
[Knitting Machine] [Circular] [50,000 pcs] [Pieces/Month]
```

### 13.2 Supply Chain Pricing
```
Factory → Wholesaler → Retailer → End Buyer

Bulk discount tiers (configurable per seller):
  100+ units  → 10% off
  500+ units  → 18% off
  1000+ units → 25% off

Auto commission deduction on each tier transfer.
```

### 13.3 Cross-Border B2B
```
HS Code field on all B2B products
Live currency display: BDT + USD + EUR + SAR
Customs duty calculator (rate × HS Code)
Document checklist: Commercial Invoice, Packing List, Certificate of Origin
```

---

## 14. Platform Intelligence (Event Bus)

Analytics layer — observational only, no user-facing UI:

```
Event: post_viral → Check: order_frequency_increase (72h window)
Event: price_drop → Trigger: wishlist_notification
Event: stock_low  → Trigger: FOMO_banner on product detail
Event: new_review → Update: seller trust score
Event: payment_velocity_spike → Flag: fraud_check → Admin AI panel
```

```
// src/modules/analytics/ — ইতিমধ্যে আছে
// Event emission: EventBus pattern
// No direct DB write from frontend — backend handles all
```

---

## 15. Aloop AI Integration

### 15.1 AI Capabilities

```
User-facing (Messages page AI chat):
  → Order status inquiry
  → Product search by description
  → Seller registration guide
  → Payment help
  → General Q&A

Seller-facing (Seller Dashboard):
  → Auto product categorization on upload
  → Market-based price suggestion
  → "Your product is priced 15% above market average" alert
  → Demand trend insights

Admin-facing (Right panel):
  → Fraud risk scoring
  → Payment velocity anomaly
  → Content moderation queue
```

### 15.2 AI Integration Rules

```
// src/modules/ai/ — ইতিমধ্যে আছে (ChatWidget, hooks, store)
// ChatWidget → Messages page-এ embed করতে হবে
// Floating widget সরাবে (AppShell.tsx থেকে <ChatWidget /> remove করতে হবে)
// API: Gemini via existing existing integration
```

---

## 16. Technical Cleanup (Existing Bugs)

### 16.1 Store Unification

| Domain | Current Duplicate Paths | Target Single Path |
|---|---|---|
| Cart | 6 different imports | `@/modules/cart/useCartStore` |
| Wallet | 2 paths | `@/modules/wallet/useWalletStore` |
| Auth | AuthContext + authStore | `@/features/auth/AuthContext` only |

**Cleanup process:** grep করে সব import খুঁজে বের করো → সব `@/modules/cart/useCartStore`-এ point করাও → তারপর duplicate store files read করো → merge-এর পর delete করো।

### 16.2 Broken Features

| Item | সমস্যা | Fix |
|---|---|---|
| `/cart` route | NotFound | CartPage তৈরি করতে হবে |
| `NewsCard.tsx` | No forwardRef | `React.forwardRef()` wrap |
| `CreatePost.tsx` | console.log only | Real API call |
| `OrdersHome.tsx` | Reorder = no-op | Real action |
| `RideHome.tsx` | Empty onClick | Real action |
| `SocialProfilePage.tsx` | 100% mock data | API hooks |
| Seller doc upload | Mock only | Real file upload |
| Service Escrow | In-memory | DB-backed API |

### 16.3 CORS & Security

```
server.ts:
  CORS → wildcard (*) → production-এ specific origins দিতে হবে
  Auth middleware → mock JWT → real JWT validation লাগবে
  Rate limiting → currently missing → add per-route limits
```

---

## 17. Folder Structure (Final Target)

```
src/
├── app/AppShell/
│   ├── AppShell.tsx          (shell — ChatWidget remove করতে হবে)
│   ├── routeConfig.ts        (single route source of truth)
│   ├── navigationConfig.tsx  (sidebar nav items)
│   └── BottomNav-এর items update
│
├── config/                   (data-driven, no hardcode)
│   ├── portals.config.ts     🆕 Portal registry
│   ├── roles.config.ts       🆕 Role → permissions + trust levels
│   └── payment.config.ts     existing, needs payment provider data
│
├── features/
│   ├── auth/                 AuthContext (single source)
│   ├── social-profile/       Profile system
│   └── registration/         🆕 Smart registration wizard
│
├── modules/                  (store + service + hooks, NO pages)
│   ├── cart/                 single useCartStore
│   ├── wallet/               single useWalletStore
│   ├── auth/                 types only (context in features/)
│   ├── ai/                   existing, update for messages embed
│   └── analytics/            event bus
│
├── components/
│   ├── ui/                   Radix/shadcn primitives
│   ├── common/
│   │   ├── PostCard/          🆕 Polymorphic post card
│   │   ├── BDAddressSelector  🆕 Division→ZIP selector
│   │   ├── TrustBadge         🆕 Trust level badge
│   │   ├── StoryBar           existing (shared/)
│   │   ├── PortalIconBar      existing (shared/)
│   │   └── HeroSection        existing, Bento Grid update
│   ├── product/
│   │   ├── SocialTicker       🆕 Live urgency
│   │   └── CommentSection/    🆕 Tabbed comments
│   └── orders/
│       └── RiderCard          🆕 Rider info card
│
├── pages/
│   ├── auth/                 login + RegistrationWizard (merge 5 → 1)
│   ├── PortalsPage.tsx       redesign (data-driven)
│   └── NotFound.tsx
│
└── portals/
    ├── _templates/           🆕 shared templates
    │   ├── EcomDeliveryPortal/
    │   ├── ListingPortal/
    │   └── SellerDashboard/
    ├── marketplace/
    ├── b2b/
    ├── food/                 → use EcomDeliveryPortal template
    ├── grocery/              → use EcomDeliveryPortal template
    ├── pharmacy/             → use EcomDeliveryPortal template
    ├── ride/
    ├── services/
    ├── nearby/
    ├── news/                 media hub
    ├── travel/               + hotel
    ├── messages/             + AI Chat embed
    ├── jobs/                 🆕 upgrade to full portal
    ├── real-estate/          🆕 upgrade to full portal
    └── verticals/            🆕 hub
        ├── index.tsx
        ├── agriculture/
        ├── healthcare/
        ├── education/
        ├── auto/
        ├── finance/
        ├── events/
        └── telecom/
```

---

## 18. Logistics Hub (Commerce Logistics Ecosystem)

Logistics Hub-কে শুধু "Delivery App" নয়, একটি **Commerce Logistics Ecosystem** হিসেবে গড়ে তোলা হবে।

### 20.1 Unified Logistics Home (Quick Book)
- **Quick Book Section:** ইউজার সরাসরি `Pickup`, `Drop`, এবং `Package/Passenger` সিলেক্ট করলে সিস্টেম নিজেই সেরা সার্ভিস (Bike, Car, Courier, Truck) সাজেস্ট করবে।
- **Logistics Feed:** সোশ্যাল কমার্স স্টাইল ফিড যেখানে Nearby Courier Offers, Truck Available, এবং Verified Logistics Providers-এর ডিল দেখা যাবে।

### 20.2 Service Layers (6-Layer Architecture)
1. **Ride Layer:** Bike, Car, Rent a Car.
2. **Delivery Layer:** Food, Local Delivery, Same Day, Courier.
3. **Transport Layer:** Pickup, Truck, Freight, Business Transport.
4. **Business Layer:** Corporate Delivery, Recurring Delivery (B2B), Fleet Management.
5. **Fulfillment Layer:** Warehouse, Storage, Reverse Logistics (Return Management).
6. **Emergency Layer:** Medicine, Urgent Parcel, Priority Transport.

### 20.3 Advanced Logistics Features
- **Logistics Provider Store:** Truck owners, courier agencies, এবং rent-a-car কোম্পানিগুলো তাদের নিজস্ব প্রোফাইল (Vehicles, Coverage, Reviews) নিয়ে স্টোর খুলতে পারবে।
- **Scheduled & Booking:** "Now" বা "Schedule Later" (Specific Date) অপশন। B2B-এর জন্য প্রতিদিন/সাপ্তাহিক রিকারিং ডেলিভারি।
- **Multi-Stop Delivery:** এক ট্রিপে একাধিক ড্রপ-অফ পয়েন্ট (A → B → C → D) সাপোর্ট।
- **Fleet Management (Seller Central):** প্রোভাইডারদের জন্য Vehicles, Drivers, Maintenance, এবং Fuel ম্যানেজমেন্ট মডিউল।
- **Proof of Delivery (POD):** ডেলিভারি শেষে Photo, Signature, এবং OTP ভেরিফিকেশন।
- **Driver Reputation:** ড্রাইভারদের জন্য আলাদা প্রোফাইল যেখানে রেটিং, সাকসেস রেট এবং রিভিও থাকবে।

---

## 19. Universal Checkout & Unified Address System

প্ল্যাটফর্মের সব পোর্টাল (Marketplace, Logistics, Services) একটি কমন ফাউন্ডেশন ব্যবহার করবে।

### 21.1 Unified Address Foundation
- **Single Source of Truth:** ইউজার প্রোফাইলে সেভ করা অ্যাড্রেস সব পোর্টালে কাজ করবে।
- **Address Types:** Home, Office, Pickup Point, Service Address.
- **BD Address Integration:** Division → District → Upazila → Area → ZIP কোড স্ট্রিক্ট ভ্যালিডেশন।

### 21.2 Universal Checkout Flow
- **Consistent UX:** সব পোর্টালে অর্ডার ক্রিয়েশন, ডেলিভারি সিলেকশন এবং পেমেন্ট ফ্লো একই রকম হবে।
- **Multi-Vendor Cart Support:** একই সাথে একাধিক ভেন্ডরের প্রোডাক্ট হ্যান্ডেল করার ক্ষমতা।
- **Payment Integration:** bKash, Nagad, এবং Wallet-এর মাধ্যমে সেন্ট্রালাইজড পেমেন্ট প্রসেসিং।

---

## 20. Build Execution Phases (Priority Order)

### Phase 1 — Foundation Fix (Prerequisite for everything)
1. **Store unification** — grep → fix all cart/wallet imports → delete duplicates
2. **`portals.config.ts`** — portal registry (data-driven)
3. **`roles.config.ts`** — role permissions + trust level gates
4. **`payment.config.ts`** — add bKash/Nagad/VAT config
5. **Bottom Nav update** — 5 items: Home|Marketplace|Apps|Message|Profile
6. **ChatWidget** — move from AppShell floating → Messages page embed
7. **CartPage** — create `/cart` route (fix NotFound)
8. **NewsCard forwardRef** — fix console error

### Phase 2 — Portal Infrastructure
1. **`_templates/EcomDeliveryPortal`** — check existing food/grocery/pharmacy components first
2. **Food/Grocery/Pharmacy** — use template (avoid rewriting existing code)
3. **`_templates/ListingPortal`** — check marketplace components first
4. **PortalsPage redesign** — data-driven, search, recents, categories

### Phase 3 — Registration & Profile
1. **RegistrationWizard** — read all 5 existing auth pages → merge into 1 wizard
2. **Seller upgrade flow** — portal-specific steps
3. **Profile page** — real API hooks (read mockData.ts fields first)
4. **TrustBadge** — 7-level visual badge
5. **BDAddressSelector** — Division→ZIP

### Phase 4 — Commerce Features
1. **PostCard (Polymorphic)** — check existing card components first
2. **SocialTicker** — product detail page
3. **CommentSection (Tabbed)** — Reviews + Q&A + Discussion
4. **Wallet dual-currency** — PK Coin display + escrow section
5. **RiderCard** — order tracking upgrade
6. **Live Map** — order tracking map

### Phase 5 — Portal Upgrades
1. **Jobs** — full portal (read existing jobs.tsx first)
2. **Real Estate** — full portal (read existing real-estate.tsx first)
3. **Verticals hub** — niche portals grid
4. **Travel + Hotel** — merge
5. **B2B Factory profile** — machinery tab + supply chain pricing

### Phase 6 — Polish & Intelligence
1. **AI product categorization** (seller upload flow)
2. **Admin AI panel** — 3-column layout + intelligence matrix
3. **Event bus** — cross-portal analytics
4. **Error boundaries** per portal
5. **Loading skeletons** all portal homepages
6. **Mobile audit** — touch targets, safe-area, pull-to-refresh
7. **Bilingual consistency** — BN/EN across all portals

---

## 21. Next Steps (Current Focus)

1.  **Smart Registration Wizard (Phase 3)**: Refactor the multi-role registration flow for B2B, Wholesale, and Retail roles using a unified smart wizard.
2.  **Logistics Hub Expansion**: Implement backend layers for ride-share and transport availability to support the logistics ecosystem.

---

## 22. Pre-Build Checklist (Every Phase)

Before building any component or feature:

```
□ grep the component name — already exists somewhere?
□ Read existing file if found — can I extend/update it?
□ Check template — can I use _templates/ instead?
□ Check imports — am I using the correct @/ alias?
□ Check store — am I using the single source of truth?
□ Check config — should this be data-driven from config/?
□ Check mock data — is there a real API for this?
□ Mobile check — 44px touch targets, safe-area handled?
□ Bilingual — Bengali label added?
```

---

*Version 2.1 — Universal Checkout & Portals Launcher implemented. Ready to begin Phase 3 Smart Registration Wizard.*
