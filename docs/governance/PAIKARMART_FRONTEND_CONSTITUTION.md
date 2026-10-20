# PAIKARMART ECOSYSTEM — FRONTEND & UX CONSTITUTION
*(Phase 8.0 - Complete UI/UX Super App Experience Layer)*

This constitution governs the complete, production-grade frontend architecture, visual design tokens, component specifications, and user experience flows for the Paikar Mart Super App. It unifies TikTok-style social commerce, Amazon-style retail, and Alibaba-style B2B wholesale storefronts into a seamless, high-performance responsive interface, utilizing existing backend API networks with zero schema mutations.

---

## 1. GLOBAL DESIGN SYSTEM & TOKENS

The design system is based on high contrast, clean typography, responsive density, and smooth motion curves.

### A. Color Palette Matrix
Portals subscribe to unified CSS variables of the Cyber-Accent theme:
*   **Background (`--pm-bg`)**: Deep Onyx (`#04070f`) — creates a high-purity slate canvas.
*   **Surface (`--pm-surface`)**: Dark Slate Obsidian (`#0b0f19`) — framed card structures.
*   **Accent/Primary (`--pm-accent`)**: Electric Cyan (`#22d3ee`) — highlights system-level calls-to-action.
*   **Secondary Accent**: Crimson Flame (`#f43f5e`) — representing virality, hot trending status, and danger.
*   **Border Highlighting (`--pm-border`)**: Semitransparent Cobalt (`rgba(255, 255, 255, 0.08)`).
*   **Text Primary**: Chalk White (`#ffffff`) — pure readable labels.
*   **Text Secondary**: Ash Muted (`#94a3b8`) — metadata and descriptors.

### B. Grid & Spacing Constraints (The 4px Scale)
All margins, padding sizes, and flex gaps must align strictly to the 4px geometric progression:
*   `xs`: 4px (`gap-1` / `p-1`) — inside micro-elements (badges, icon-label spacing).
*   `sm`: 8px (`gap-2` / `p-2`) — standard card inner element padding.
*   `md`: 12px (`gap-3` / `p-3`) — medium spacing for post headers and info rows.
*   `lg`: 16px (`gap-4` / `p-4`) — main wrapper internal padding and grid spacing.
*   `xl`: 24px (`gap-6` / `p-6`) — section-level vertical partitions.
*   `xxl`: 32px (`gap-8` / `p-8`) — outer margins and empty-state spacing.

### C. Typography System
*   **Display Font**: Inter or Space Grotesk (sans-serif) for high-impact responsive headings. High-density letter tracing: `tracking-tight`.
*   **Body & Reading Font**: Inter (Regular/Medium/Semi-Bold) optimized for localized Bengali and English character rendering.
*   **System Technical Font**: JetBrains Mono for monetary values (BDT symbol prefixing, discount counts, order serials, and system tickers).

### D. Framer Motion Performance Target
Animations are powered by `motion/react` with unified spring velocity mappings:
*   **Micro-Interactions (Click/Tap target scales)**:
    ```typescript
    const SPRING_TAP = { type: "spring", stiffness: 400, damping: 25 };
    // motion example: whileTap={{ scale: 0.95 }} transition={SPRING_TAP}
    ```
*   **Vignette & Screen Fade Transitions**:
    ```typescript
    const FADE_TRANSITION = { duration: 0.2, ease: "easeInOut" };
    ```

---

## 2. HERO SPOTLIGHT SYSTEM
Positioned prominently at the topmost viewport of the primary Home Feed page, the Hero Spotlight is the critical entry channel driving instant high-visibility social-to-commerce conversions.

```
┌─────────────────────────────────────────────────────────────┐
│                       HERO SPOTLIGHT                        │
│ ┌──────────────────────┐ ┌──────────────────────┐ ┌───────┐ │
│ │ 🔥 VIRAL STORYCARD   │ │ ⭐ SPONSORED PRODUCT │ │ MORE  │ │
│ │ [Thumbnail Preview]   │ │ [Product Imagery]    │ │ CARDS │ │
│ │ "Hilsa Catch Sale"   │ │ "Smartwatch Offer"   │ │ (👉)  │ │
│ │ Auth: Hilsha Market  │ │ Price: ৳1,999        │ │       │ │
│ └──────────────────────┘ └──────────────────────┘ └───────┘ │
└─────────────────────────────────────────────────────────────┘
```

### A. Layout Formats
*   **Mobile viewports (`xs` to `md`)**: A smooth, momentum-based horizontal scrolling swipe track with snap alignments (`snap-x snap-mandatory`), keeping off-screen assets partially visible to prompt navigation.
*   **Desktop viewports (`lg`+)**: A dynamic Bento-grid spotlight card panel grouping the top absolute highest-performing instances of organic user posts and verified merchant offers.

### B. Carousel Card Varieties & Content Schemas
The carousel feeds directly from the backend, ranking spotlight elements dynamically.

#### 1. Featured Viral Post Card
*   **Eligibility Indicator**: backend `ViralityIndex` score above threshold levels (`score >= 7.5`).
*   **Visual Highlights**: Anchored with a Crimson Red pulsing glow ring.
*   **Metadata Badges**: Embedded `🔥 Viral` badge inside a glassy backdrop overlay container.

#### 2. High Engagement Post Card
*   **Eligibility Indicator**: Calculated action velocity (total likes + comment triggers + shares > 500 actions/hour).
*   **Metadata Badges**: Highlighted with `⚡ Trending` badges utilizing interactive linear gradients.

#### 3. Sponsored/Boosted Commerce Card
*   **Eligibility Indicator**: Paid promotion payloads containing active business listings.
*   **Visual Highlights**: Subtle golden linear shadow frames.
*   **Metadata Badges**: Standardized `⭐ Promoted` label. Includes custom inline commerce parameters (`Price`, `Add to Cart` shortcut buttons).

#### 4. Featured Business Store Card
*   **Eligibility Indicator**: Highly active storefronts with high customer response rates.
*   **Visual Highlights**: Verified emblem decoration, quick-action `Follow Business` toggles.

### C. Technical Data Models (TypeScript UI Contracts)
```typescript
export interface HeroSpotlightItem {
  id: string;
  type: 'post' | 'product' | 'business';
  title: string;
  subtitle?: string;
  mediaUrl: string;
  actionUrl: string;
  viralityScore: number;
  badge: 'viral' | 'trending' | 'sponsored' | 'verified';
  meta?: {
    price?: number;
    discount?: number;
    merchantName?: string;
    followerCount?: number;
  };
}
```

---

## 3. SOCIAL POST CARD SYSTEM (POLYMORPHIC ENGINE)
The social card represents the ultimate social commerce bridge. It must cleanly render diverse media types and embed corresponding marketplace item snippets based on content properties.

```
┌─────────────────────────────────────────────────────────────┐
│  [Avatar]  Mayer Doa Enterprise   [✓ Verified]  [3m ago]    │
│  "Unboxing the container load of winter jackets today!..." │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                       │  │
│  │                    [MEDIA WINDOW]                     │  │
│  │               (High-Res Image / MP4 Video)            │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ [Image]  Waterproof Winter Jacket       Price: ৳1,450 │  │
│  │          Mayer Doa | Stock: 240pcs      [Add to Cart] │  │
│  └───────────────────────────────────────────────────────┘  │
│  [♥ Like (1.2k)]   [💬 Comment (142)]   [➦ Share]   [🔖 Save]│
└─────────────────────────────────────────────────────────────┘
```

### A. Component Layout Mapping
1.  **Card Wrapper**: Styled via `.cyber-card` (dark slate surface with high precision 1px border lines, dark drop shadows).
2.  **Card Header**: Inline Flex structure containing:
    *   **Avatar frame (40x40px)** with a thin cyan neon boundary ring.
    *   **Username** with responsive horizontal clipping (truncation on compact views).
    *   **Verified Seal**: Cyan shield icon (`BadgeCheck`) dynamically shown if `author.verified === true`.
    *   **Relative timestamp** (relative representation, e.g. "5 mins ago", "2 hours ago").
3.  **Unified Post Body**:
    *   **Text content wrapper**: Renders markdown with expandable `...See more` toggle thresholds when exceeding 3 text lines.
    *   **Polymorphic Media Window**:
        *   *Text Only*: Generous padding with custom gradient canvas.
        *   *Single/Multi Image*: High-density lazy-loaded square grid with zoom-transitions on click.
        *   *Video*: Embedded custom video players featuring mute controls, dynamic play-on-view viewport trackers, and progress indicators.
4.  **Integrated Commerce / Service Embedding Block**:
    *   If post contains `metadata.commerceType === "PRODUCT"`, render a compact, elegant sub-card interface detailing current price, discount levels, and immediate transaction buttons (Cart + Fast Buy).
    *   If linked to `metadata.commerceType === "SERVICE"`, display a booking anchor and service tag line.
5.  **Multi-Signal Engagement Bar**: Action buttons grouped horizontally. Includes native micro-interactive animations on click.
6.  **Real-Time Virality Indicator Line**:
    *   Dynamic bar highlighting relative `viralityScore` or heat metric (`🔥 9.8 Score - Super Viral`).

### B. TypeScript Schema Mapping (Frontend-to-API Bridge)
```typescript
export interface PostCardData {
  id: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
    verified: boolean;
    type?: 'buyer' | 'seller' | 'admin' | 'nearby_shop';
  };
  content: string;
  createdAt: string;
  images?: string[];
  videoUrl?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  bookmarksCount: number;
  likedByCurrentUser: boolean;
  bookmarkedByCurrentUser: boolean;
  viralityScore: number;
  product?: {
    id: string;
    title: string;
    price: number;
    compareAtPrice?: number;
    stock: number;
    images?: string[];
  };
}
```

---

## 4. FEED ARCHITECTURE & SCROLL ORCHESTRATION

The feed home is designed around a single-page view structure, preventing infinite re-rendering cycles through virtualization and optimized state handling.

### A. Section Priority Sequence
1.  **Top Navigation & Context Switcher Bar**: Controls active directory scope (Social Feed, Retail B2C, Wholesale B2B, Nearby Shops, Home Services).
2.  **StoryBar / Active Reels Ticker**: Positioned directly beneath navigation, taking a `context` prop ('feed' | 'retail' | 'wholesale' etc) to inject live-streaming circles.
3.  **Hero Spotlight Section**: Centered high-impact carousel.
4.  **Organic Social Feed Grid**: Dual-column cascade (desktop) or single full-width layout (mobile) rendering standard user posts.
5.  **Inline Interstitial Marketplace Grid**: Automatically injects a shelf of 4 products (`Recommended For You`) for every 5 posts scrolled.
6.  **Nearby Store Spotlights / Location Feeds**: Physical vendor listings within the user's localized geo-bounds.
7.  **Trending Now Hashtag Trackers**: Bottom-rail horizontal tickers highlighting current search velocity spikes.

### B. Performance Guardrails (Infinite Scroll)
*   **Virtualization**: Large feeds must utilize key viewport markers or intersection arrays to render visible cells, offloading distant off-screen DOM nodes to ensure high frame rates (target: 60fps).
*   **Fetch Thrashing Shield**: Cursor-based client paginator hooks guarding next-set fetch commands. It blocks secondary requests until the previous `/api/v1/feed` segment cleanly resolves.

---

## 5. MARKETPLACE PRODUCT CARD SPECIFICATION
Ensures clean layout rendering for retail listings, wholesale catalogs, and verified dropship sources.

```
┌──────────────────────────────────────┐
│ [★ -25% Off]           [🔥 Viral]    │
│                                      │
│           [PRODUCT MEDIA]            │
│               (Image)                │
│                                      │
├──────────────────────────────────────┤
│ Premium Leather Loafers              │
│ ৳2,450  <span class="line-through">৳3,200</span>            │
│ ⭐ 4.8 (120 reviews)                  │
│ Stock: 12 left | Dhaka Leather Ltd.  │
│ ┌──────────────────────────────────┐ │
│ │          🛒 Add to Cart          │ │
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

### A. Element Specs
*   **Discount Percent Badge** (top left): Calculated instantly at render time. Highlighted in deep Crimson Red.
*   **Virality Flag** (top right): Dynamic conditional indicator showing `🔥 Hot` if the linked product has generated active organic post features in the last 48 hours.
*   **Aspect Ratio Standard**: Perfectly square media layout wrapper (`aspect-square`). Handles missing placeholders gracefully via clean svg assets.
*   **Rating Details**: Numeric score + mini Star icon, styled in deep golden yellow.
*   **Quick Add Action Handler**: Click interceptor triggering instant cart state additions, including visual spring feedback without executing full page-load redirects.

---

## 6. BUSINESS STORE CARD SPECIFICATION
Dedicated merchant cards for standard business feeds, local trade listings, and B2B vendor profiles.

```
┌─────────────────────────────────────────────────────────────┐
│ [Logo]  Bhai Bhai Wholesale Grocer   [✓ Verified B2B Merchant]│
│         Category: Spices & Grains                            │
│         Location: Karwan Bazar, Dhaka                        │
│         Followers: 14.2k | Verified Trade License: YES       │
│                                                             │
│  ┌─────────────────────────┐     ┌────────────────────────┐ │
│  │       Visit Store       │     │       + Follow         │ │
│  └─────────────────────────┘     └────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### A. Structural Elements
*   **Merchant Brand Circular Logo (48x48px)**: Rendered alongside clear trade indicators.
*   **Category Sub-labels**: Displays primary product focus (e.g., "Wholesale Spices", "Consumer Electronics").
*   **Compliance Verification Tags**: Badge displaying "Verified Trade License" if verified.
*   **Action Callouts**: Dual-action row:
    1.  `Visit Store` (routing path `/vendors/:id`).
    2.  `Follow` (triggering optimistic state updates with custom highlight color maps).

---

## 7. CORE COMPONENT UX FLOW DIAGRAMS

The interface connects content and commerce seamlessly through reactive, single-page state updates:

### A. FLOW 1: The Social-to-Commerce Conversion Pipeline
```
[User scrolls Feed]
       │
       ▼
[Spots polymorphic PostCard] ──► Shows dynamic interactive embedded commerce widgets
       │
       ▼ (Tap Embed)
[Unfolds focused ProductModal] ──► Fluid backdrop transitions; retains exact feed position
       │
       ▼ (Tap Buy Now)
[Instant Cart state push] ──► Launches localized Checkout Layer (zero intrusive redirection)
```

### B. FLOW 2: Inter-Module Virality Boost Loop
```
[User enters reaction / share]
       │
       ▼
[Optimistic Client counter updates] ──► Immediate heart pulse & engagement increment lines
       │
       ▼ (Async API Dispatch)
[POST Request to /api/v1/engagement] ──► Sends engagement data asynchronously to backend
       │
       ▼ (Backend Event Bus trigger)
[Signals recalculate ViralityIndex] ──► Emits ORDER_CREATED / ENGAGEMENT_VELOCITY
       │
       ▼ (Instant UI refresh)
[Pulsing Glow badge updates to Hot!] ──► Real-time color shift reinforces community velocity
```

### C. FLOW 3: Marketplace Search & Fulfillment Path
```
[User queries search input]
       │
       ▼
[Renders ProductGrid cascade] ──► Skeleton structures morph to live product listings
       │
       ▼ (Select Card)
[Enters Storefront Detail Portal] ──► Displays verified trust elements
       │
       ▼
[Completes checkout payload] ──► Real-time progress trackers confirm transaction status
```

---

## 8. PLATFORM NAVIGATION BLUEPRINTS

Navigation adapts cleanly across mobile, tablet, and desktop environments.

### A. Mobile Bottom Tab-Bar Configuration
The bottom tab bar is designed for direct accessibility under one-thumb environments (height: 56px, background: blurred slate):
*   **Home Tab**: Dynamic Feed entry point (StoryBar + Hero Spotlight + Infinite scroll).
*   **Marketplace Tab**: Vertical category exploration matrix.
*   **Create Trigger (`+`)**: Open modal compositors with media upload zones.
*   **Orders Portal**: Status hub showing live order updates ("Shipped", "Delivered").
*   **Profile Tab**: User settings and business portals.

### B. Responsive Desktop Navigation Rails
On tablet and desktop resolutions (`lg`+), layout scales to a persistent left-hand navigation rail with structured tabs:
*   **Core Channels**: Social Feed, Marketplace catalog, Business registries.
*   **Admin Utilities**: Observability, Moderator queues, Platform Governance dashboard.

---

## 9. USER INTERFACE STATES & DEGRADATION SYSTEMS

Never display blank white states during asynchronous fetch operations. Render high-fidelity skeleton states to maintain layout continuity.

### A. Standard Skeleton Schemas
*   **Post Loading State**: Double pulse blocks matching post sizes. Includes circular avatar spaces and aligned body skeletons.
*   **Product Loading State**: Uniform square grid structures with subtle pulse effects.
*   **Optimistic Handlers**: Instant UI reactions for Likes & Cart additions. If the endpoint encounters failures, the UI rolls back state gracefully and alerts the user without disrupting context.

---

## 10. FRONTEND ARCHITECTURE & DIRECTORY MAP

A highly modular frontend architecture ensures scalability, clear separation of concerns, and clean import namespaces.

```
/src
├── components/          # Sharable UI modules
│   ├── feed/            # PostCard, CreatePostComposer, StoryBar
│   ├── product/         # ProductCard, ProductGrid, CategoryChips
│   ├── business/        # BusinessCard, StorefrontHeader
│   └── ui/              # GlassCard, Avatar, Button, Skeletons
├── features/            # Context state managers
│   ├── cart/            # CartContext, cartReducer
│   ├── wishlist/        # WishlistContext, wishlistReducer
│   └── auth/            # AuthContext, AuthGuard
└── portals/             # Top-level application containers
    ├── feed/            # FeedPortalContainer
    ├── marketplace/     # MarketplacePortalContainer
    └── admin/           # GovernancePortalContainer
```

---

By adhering to this Constitution, the Paikar Mart frontend team ensures a unified, high-performance visual experience that seamlessly bridges social interaction with physical marketplace transactions.
