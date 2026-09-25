# PAIKARMART — PRODUCT DETAIL UX ARCHITECTURE
*(Phase 8.3 - Full Product Detail Experience Architecture)*

This architecture document defines the exact, production-ready front-end visual layout, pixel-level specifications, spacing arrays, responsive grid systems, and interactive conversion UX flows for the Product Detail experience in the Paikar Mart Super App.

This is a **Frontend-only specification** that consumes dynamic APIs (B2C, B2B wholesale, factories, services, and demand structures) with zero backend, database, or event bus mutations. It translates raw data into a polymorphic visual interface.

---

## 1. COMPONENT HIERARCHY

```
[ProductDetail Page Chassis]
 ├── [Header Breadcrumb Navigation Tracker]
 ├── [Primary Product Overview Grid (12 Columns)]
 │    ├── [Left: Media Gallery Component (7 Columns)]
 │    │    ├── [Main Media Showcase Container (AspectRatio 1:1, Hover: Zoom)]
 │    │    │    └── [Overlays: Virality Status Badge + Save/Share Floating Actions]
 │    │    └── [Thumbnail Carousel Strip (88x88px, Horizontally Scrollable)]
 │    │
 │    └── [Right: Interactive Sourcing Details & Actions Container (5 Columns)]
 │         ├── [Category & Polymorphic Type Indicator Pill]
 │         ├── [Dynamic Product Title Display (H1/H2, Max 3 Lines Truncated)]
 │         ├── [Metadata Stats (Rating, Review Count, Location Badge, Live Inventory Status)]
 │         ├── [Social Commerce Hot Ticker (Recent purchase velocities)]
 │         ├── [Price & Discount Engine Stream (JetBrains Mono format)]
 │         ├── [Interactive Quantity Stepper Grid]
 │         ├── [Dynamic Primary Actions Deck (Buy / Add to Cart / Request Quote / Message Seller)]
 │         └── [Compact Integrated Trust Guarantee Panel]
 │
 ├── [Polymorphic Portal Mini-Cards Section (Seller Bio, Factory Certification, Services Badge)]
 ├── [Discussion & Interaction Hub Tab Set (Height 48px, Gap 24px)]
 │    ├── [Tabs Bar: Reviews | Questions | Comments]
 │    └── [Dynamic Workspace Viewport]
 │         ├── [Reviews View: Multi-Column Summary Card (Rating Bar) + Detailed Feedback Items with Verification Labels]
 │         ├── [Buyer Q&A View: Highlighted Question Containers + Seller Reply Blocks (Left Border Primary)]
 │         └── [Comments Stream View: Community Thread Panel]
 └── [Related / Recommended Products Carousel (4 Columns on Desktop, 3 on Tablet, 2 on Mobile)]
```

---

## 2. RESPONSIVE BREAKPOINTS & PACING MATRIX

All padding, margins, gaps, buttons, and font sizes align strictly to the **4px Base Spacing Grid** and **Major Third Typography Scale**.

| Viewport Dimension Target | Device Category | Wrapper Width | Layout Columns | Outer Padding Bounds | Column Grid Gap |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **320px – 767px** | Mobile Viewport | `100%` width | Single Column Stack | `16px` (`p-4`) | `12px` (`gap-3`) |
| **768px – 1023px** | Tablet Viewport | `720px` centered | Single Column | `24px` (`p-6`) | `24px` (`gap-6`) |
| **1024px – 1439px** | Desktop Viewport | `1280px` centered | 12-Column Grid | `32px` (`p-8`) | `32px` (`gap-8`) |
| **1440px – 1920px** | Wide Screen | `1440px` centered | 12-Column Grid | `48px` (`p-12`) | `40px` (`gap-10`) |

---

## 3. TEXT-BASED WIREFRAMES & SCHEMATIC SCHEDULING

### A. Desktop Viewport Layout Specs (≥1024px)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 👤 User Global Header Section                                  [Cart (0)]   │
├─────────────────────────────────────────────────────────────────────────────┤
│ ◄ Back to Marketplace                                                       │
│                                                                             │
│ ┌───────────────────────────────────────┐ ┌───────────────────────────────┐ │
│ │ LEFT GALLERY PANEL (7 Columns, 720px) │ │ RIGHT PANEL (5 Columns, 528px)│ │
│ │ ┌───────────────────────────────────┐ │ │ Category > Subcategory        │ │
│ │ │                                   │ │ │ ProductName (32px Bold)       │ │
│ │ │           MAIN IMAGE/VIDEO        │ │ │ ⭐️ 4.9 (124)  [In Stock]       │ │
│ │ │           (Ratio 1:1)             │ │ │ ৳1400  -15%  [৳1650 compare]  │ │
│ │ │           720x720px               │ │ │ ┌───────────────────────────┐ │ │
│ │ │           Radius: 20px            │ │ │ │ SOCIAL TICKER: 12 people   │ │ │
│ │ │                                   │ │ │ │ purchased in last 2 hours.  │ │ │
│ │ │                                   │ │ │ └───────────────────────────┘ │ │
│ │ └───────────────────────────────────┘ │ │ ┌───────────────────────────┐ │ │
│ │  [88x88] [88x88] [88x88] (Thumb Row) │ │ │ Trust Guaranteed Panel    │ │ │
│ └───────────────────────────────────────┘ │ └───────────────────────────┘ │ │
│                                           │ Quantity: [-]  1  [+]         │ │
│                                           │ [🛒 ADD TO CART]              │ │
│                                           │ [⚡ BUY NOW]                 │ │
│                                           └───────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### B. Tablet Viewport Adapter Specs (768px - 1023px)
*   **Media Gallery Matrix**: Responsive Single Column centered at `720px`, with Main Gallery scaling down to `640px` x `640px`.
*   **Thumbnails**: Horizontal swipeable row size set to `72px` x `72px` (gap: `10px`).
*   **Interactions**: Right Detail column wraps directly below the media gallery at `100%` container width.

### C. Mobile Viewport Touch Targets (320px - 767px)
*   **Main Media Container**: Full bleed width `100vw` with `1:1` aspect scaling. Left/Right edge spacing set to `0px`.
*   **Title/Price font sizing**: Downscales to `24px` (`text-xl`) to maximize above-the-fold screen space.
*   **Sticky Dynamic Bottom Action Drawer**:
    *   **Fixed Height**: `72px` (system margins integrated via `pb-[env(safe-area-inset-bottom)]`).
    *   **Click Hitbox Target**: Minimum `44px` x `44px` on all toggle tags and icons.
    *   **Double buttons structure**: `Add to Cart` and `Buy Now` split space with equal `50/50` flex widths.

---

## 4. PIXEL TOKENS SPECIFICATIONS & CLASS VALUES

| Element Context | Pixel Width | Pixel Height | Border Radius (Tailwind equivalent) | Text Size / Weight (Base-Scale) |
| :--- | :--- | :--- | :--- | :--- |
| **Main Media (Desktop)** | `720px` | `720px` | `20px` (`rounded-[20px]`) | None |
| **Main Media (Tablet)** | `640px` | `640px` | `16px` (`rounded-2xl`) | None |
| **Thumbnail Element** | `88px` | `88px` | `12px` (`rounded-xl`) | None |
| **Thumbnail (Tablet)** | `72px` | `72px` | `12px` (`rounded-xl`) | None |
| **Discount/Rating Pills**| Auto | `32px` | `999px` (`rounded-full`) | `12px` / Semibold |
| **Virality Alert Tape** | Auto | `28px` | `999px` (`rounded-full`) | `11px` / Bold |
| **Trust Stat Cube (Metric)** | `120px`| `72px` | `12px` (`rounded-xl`) | `14px` Value, `10px` Label |
| **B2B Actions Buttons** | Full width| `52px` | `12px` (`rounded-xl`) | `16px` / ExtraBold |
| **Primary Interaction Tabs** | Auto | `48px` | None (Indicators bottom border) | `16px` / Bold |
| **User Reaction Avatar**| `40px` | `40px` | `999px` (`rounded-full`) | None |
| **Feedback Attached Photo**| `120px`| `120px` | `20px` (`rounded-2xl`) | None |

---

## 5. DYNAMIC PORTAL POLYMORPHISM MATRIX

Because Paikar Mart serves multiple different commerce contexts (B2C, Wholesale, factory sourcing, localized services), the layout remains highly polymorphic utilizing generic item schemas but updating specific interfaces appropriately:

| Target Portal Context | Trust Certifications Displayed | Dynamic Actions Block Configuration | Sourcing Price Presentation |
| :--- | :--- | :--- | :--- |
| **B2C Retail** | Verified Shop, Fast Shipping, Top Rated | `Add to Cart` + `Buy Now` | Standard Unit Pricing stream |
| **B2B Bulk Wholesale**| Factory Inspected, Safe ESCROW badge | `Request Custom Quotation` + `Sourcing Cart` | Wholesale tiered breaks (QTY scaled) |
| **Factory / Manufacturer**| Trade License, Production Capacity | `Request Fleet/Capacity Quote` + `Message Factory` | Min MOQ requirement indicators |
| **Local Services** | Verified Skills rating, License certified | `Book Appointment Slot` + `Consult Provider` | Estimated project or hourly rate |

---

## 6. DISCUSSION, DETAILED REVIEWS, & Q&A PLATFORMS

Tab selectors set to height `48px` control the dynamic swap space.

```
┌───────────────────────────────────────────────────────────────┐
│ [★ Reviews]           [❓ Buyer Q&A]          [💬 Comments]   │  ◄ Tab Selectors
└───────────────────────────────────────────────────────────────┘
```

### A. Feedback Summary Metrics Box
*   **Average Score Banner**: Font Size `48px` (`text-5xl`), Font Weight `900` (`font-black`), using bold JetBrains Mono typography paired with `24px` star glyph assets.
*   **Rating Breakdowns**: Custom percentage bars constructed with clean tailwind nodes (`h-2 bg-white/5 rounded-full overflow-hidden`). Filled content highlights using cyan transitions.

### B. Verified Customer Feedback Row
*   **Inner Card Chassis Padding**: `20px` (`p-5`), Border Radius `20px` (`rounded-[20px]`).
*   **Verified Consumer Stamp**: Rounded wrapper pill container colored in light teal translucent assets (`bg-cyan-500/10 text-cyan-400 border-cyan-400/20`), height: `24px`.
*   **Attached Media Assets**: 1:1 aspect boxes (`120px` x `120px`) with elegant scale zooms on click.

### C. Contextual Buyer Q&A Modules
*   **Interactive Box Layout**: Padding `20px`, Radius `20px` dark Obsidian panels.
*   **Respondent Highlight**: Left border accent colored with bright turquoise indicators (`border-l-4 border-l-cyan-400`). Transparent background tinting identifies authority.

---

## 7. HIGH-CONVERSION SOCIAL PATHWAYS

The UI builds urgency and trust by seamlessly layering social metrics:

```
[Buyer lands on detail view]
             │
             ├────────► [Virality Notification: "🔥 12 bought in last 2h"]
             │
             ├────────► [Merchant Trust badge: "Verified Factory Exporter"]
             │
             ├────────► [Interactive Stepper: auto calculates B2B price tiers]
             │
             ▼
[Single-click high contrast sticky buying action triggers immediate conversion window]
```

By framing these physical specifications clearly, front-end developers can rapidly build clean, fast and highly engaging experience screens.
