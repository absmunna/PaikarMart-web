# PAIKARMART — PROFILE ECOSYSTEM UX ARCHITECTURE
*(Phase 8.2 - Multi-Role Profile Experience Architecture)*

This architecture document defines the exact, production-grade visual structural layouts, pixel specifications, spacing arrays, responsive grid variables, and interactive UX flows for all Profile variants in the Paikar Mart Super App ecosystem. 

This is a **Frontend-only specification** that consumes existing APIs with zero backend or database mutations. All dimensions, paddings, margins, ratios, and font weights are defined in absolute metrics for direct translation into React + Tailwind CSS code by any engineering lead or developer without requiring Figma files.

---

## 1. RESPONSIVE BREAKPOINTS & CONTAINERS

The layout uses fixed grid containers centered on desktop viewports to maintain perfect density and readable design.

| Viewport Category | Responsive Bounds | App Container Width | Grid Systems & Margin | Outer Padding |
| :--- | :--- | :--- | :--- | :--- |
| **Mobile** | `320px` to `767px` | `100%` width | Single Column / Scrollable | `16px` (`p-4`) |
| **Tablet** | `768px` to `1023px` | `720px` centered | Vertical Stack / Auto grids | `24px` (`p-6`) |
| **Desktop** | `1024px` to `1439px` | `1280px` centered | 12-Column Grid system | `32px` (`p-8`) |
| **Wide Desktop** | `1440px` to `1920px` | `1440px` centered | 12-Column Grid with margins | `48px` (`p-12`) |

---

## 2. THE CHASSIS: PROFILE COVER & AVATAR GEOMETRY

The cover image banner and overlapping profile avatar form a unified identity container. Let's map their exact physical boundaries:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          COVER BANNERS BY DEVICE                            │
│                                                                             │
│   DESKTOP: 1280px x 320px  [Radius: 24px]                                   │
│   TABLET:  720px  x 260px  [Radius: 16px]                                   │
│   MOBILE:  100%   x 180px  [Radius:  0px]                                   │
│                                                                             │
│                        Avatar Overlaps Cover:                               │
│                        - Desktop / Tablet: 50% Overlap                      │
│                        - Mobile: 40% Overlap                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

### A. Desktop Structural Dimensions (≥1024px)
*   **Cover Banner Box**: Width `1280px`, Height `320px`, Border Radius `24px`.
*   **Avatar Image**: Circular frame, Diameter `160px` x `160px`, Border width `6px` solid background color (`--pm-bg`).
*   **Overlap Physics**: Top margin offset: `-80px` (exactly 50% of avatar diameter).
*   **Spacing Below**: `24px` gap before entering the primary Profile Info grid.

### B. Tablet Structural Dimensions (768px - 1023px)
*   **Cover Banner Box**: Width `720px`, Height `260px`, Border Radius `16px`.
*   **Avatar Image**: Circular, Diameter `120px` x `120px`, Border `4px` solid `--pm-bg`.
*   **Overlap Physics**: Top margin offset: `-60px` (exactly 50% overlap).
*   **Spacing Below**: `20px` gap.

### C. Mobile Structural Dimensions (320px - 767px)
*   **Cover Banner Box**: Width `100%`, Height `180px`, Border Radius `0px` (full bleed to match screen bounds).
*   **Avatar Image**: Circular, Diameter `88px` x `88px`, Border `3px` solid `--pm-bg`.
*   **Overlap Physics**: Top margin offset: `-35.2px` (exactly 40% overlap).
*   **Spacing Below**: `16px` gap.

---

## 3. UNIVERSAL PROFILE HEADER LAYOUT

Consolidated data blocks containing Name, Verification tag, Handle, Location, joined timestamp, trust indices, and button rows.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ DESKTOP PROFILE HEADER LAYOUT (Gap: 24px)                                   │
│ ┌───────────────┐ ┌───────────────────────────────────────┐ ┌──────────────┐│
│ │               │ │ Name (32px Bold) [Verified]           │ │ [Follow]     ││
│ │    AVATAR     │ │ @username  [RoleBadge]                │ │ [Message]    ││
│ │  (160x160px)  │ │ Location • Rating • JoinedDate        │ │ [Save] [Share]││
│ └───────────────┘ └───────────────────────────────────────┘ └──────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

### A. Sizing & Alignments per Resolution
*   **Desktop Layout (Horizontal Flex Grid)**:
    *   **Spacing Grid Grid Columns**: 2-Column layout where Avatar/Info represent the Left (col-span-9), and Primary User Actions represent the Right (col-span-3).
    *   **Left Section Alignments**: Left-aligned elements with a clean gap margin of `24px` separating the Avatar border from the Profile text.
    *   **Right Section Alignments**: Right-aligned, vertically centered call-to-action stack.
*   **Tablet Layout (Intermediate Adapter)**:
    *   **Flex Strategy**: Horizontal flex row matching desktop, but with smaller button widths and scaled fonts.
*   **Mobile Layout (Centered Stack)**:
    *   **Flex Strategy**: Vertical Column Flex with absolute centering (`flex-col items-center text-center`). Buttons stretch to full width (`w-full`).

### B. Button Components Specification
*   **Action Button Heights**: Exactly `48px` (`h-12`).
*   **Border Radius**: Exactly `16px` (`rounded-xl` / `.cyber-button`).
*   **Typography Sizing inside Buttons**: Font Size `16px` (`text-base`), semi-bold.
*   **Standard Layout Hierarchy**:
    1.  `Follow` (Filled primary Cyan accent, dark text).
    2.  `Message` (Glass surface border, glowing typography).
    3.  `Share / Bookmark` (Square Icon triggers `48px` x `48px`, `16px` Radius, centered vector glyphs).

---

## 4. TRUST BADGES & VERIFICATION COMPONENT OVERLAYS

Badges highlight specific merchant tiers, factory statuses, and logistics verifications.

*   **Size Constraints**: Height exactly `28px`, Border Radius `999px` (clean capsules/pills).
*   **Interactive Styles**: Glassmorphic borders (`border border-white/10`), thin translucent backdrops matching `--pm-glass` parameters.
*   **Pre-defined System Badges**:
    *   `Verified`: Cyan capsule text decoration + `BadgeCheck` vector tracking.
    *   `Top Seller`: Golden crown glyph + orange-amber text labels.
    *   `Top Factory`: Steel gray mechanical icon layout.
    *   `Top Service Provider`: Emerald green calibration emblem.
    *   `Top Logistics`: Deep blue route container glyph tag.
    *   `Exporter Verified` / `Importer Verified`: Royal purple globe badge matrices.

---

## 5. PROFILE INTERFACE RUNTIME STATS (METRIC CARDS)

Direct numerical indicators shown below the header layout, providing immediate transparency.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ DESKTOP STATS GRID (4-Column Layout, Width: 160px items, Height: 88px)      │
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ │
│ │ Followers      │ │ Completed Ords │ │ Total Products │ │ Trust Score    │ │
│ │ 12.4k          │ │ 1,240          │ │ 480            │ │ ⭐ 4.9          │ │
│ └────────────────┘ └────────────────┘ └────────────────┘ └────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

*   **Metric Card Outer Wrapper**:
    *   **Desktop Dimensions**: Width exactly `160px`, Height exactly `88px`. Radius exactly `16px`.
    *   **Grid Specs**: 4-Column Flex layout on desktop (Gap: `16px`), collapsing to a 2-Column Grid layout on mobile (Gap: `12px`).
    *   **Styling**: Dark obsidian base background with thin cobalt borders and custom padding values `12px`.
*   **Typography Scale inside Cards**:
    *   Label/Value titles: Font Size `14px` (`text-sm`), muted colors.
    *   Numeric state data: Font Size `24px` (`text-2xl`), bold style using JetBrains Mono formatting.

---

## 6. SYSTEM RUNTIME INTERACTION TABS (UNIVERSAL SELECTOR)

Used to transition within the primary content viewports.

*   **Tab-bar Height**: Strictly `52px` (`h-[52px]`).
*   **Border Radius**: Exactly `16px` on highlight states.
*   **Horizontal Configurations**:
    *   **Desktop/Tablet**: Inline list with matching horizontal margin dividers. Active markers use indicator rings.
    *   **Mobile**: Horizontal scrolling bounds with snap indicators (`overflow-x-auto snap-x scrollbar-none scroll-smooth`), ensuring zero truncations.

---

## 7. POLYMORPHIC MODULES SPECS BY PROFILE ROLE

Below are the tab specifications and custom stats modules for each role to be compiled dynamically based on their credentials:

### A. Buyer Profile Interface Mode
*   **Tab System Options**: `Activity` | `Reviews` | `Wishlist` | `Orders` | `Saved Posts`.
*   **Custom Stats Module Card**:
    *   *Verified Purchase Score*: Outlining transaction volume index out of 100 points (`text-cyan-400`).
    *   *Review Reputation Rating*: Indicating active review quality metrics.

### B. Seller Profile Interface Mode
*   **Tab System Options**: `Products` | `Posts` | `Reviews` | `About` | `Contact` | `Analytics`.
*   **Custom Stats Module Card**:
    *   *Response Rate Limiters*: (e.g., "99% in 5m").
    *   *Merchant Completed Orders History*: Absolute figures.
    *   *Live Store Rating Tracker*: Star value matrices.

### C. Factory Profile Interface Mode (B2B Structural)
*   **Tab System Options**: `Products` | `Machines` | `Capacity` | `Certificates` | `Export`.
*   **Custom Stats Module Card**:
    *   *Available Production Volumes*: Output metrics (e.g., "120,000 Pcs/Month").
    *   *Verified Facility Coordinates*: Factory blueprint details.
    *   *Audited Certification Badges*: Direct verification emblems.

### D. Service Provider Profile Interface Mode
*   **Tab System Options**: `Services` | `Portfolio` | `Reviews` | `Availability` | `Bookings`.
*   **Custom Stats Module Card**:
    *   *Absolute Professional Experience*: Years of field experience.
    *   *Completed Service Bookings*: Completed tasks.
    *   *Validated Task Skill Checklist*: Verified capabilities.

### E. Logistics / Freight Provider Profile Interface Mode
*   **Tab System Options**: `Vehicles` | `Routes` | `Trips` | `Reviews` | `Availability`.
*   **Custom Stats Module Card**:
    *   *Registered Active Fleet Count*: Total active vehicles.
    *   *Covered Regional Districts*: Reach.
    *   *Timely Delivery Track Record*: Percentage score showing on-time performance.

---

## 8. PROFILE CONTENT STREAMS & FEED ORCHESTRATION

Every profile features a polymorphic personal timeline displaying content published by that specific user or business:

*   **Column Grid Footprints**:
    *   **Desktop Layout**: Renders content with a center-aligned width of exactly `820px`. The remaining `320px` width houses the Right Sidebar utility card column. Gap spacing: `24px`.
    *   **Tablet / Mobile**: Fully responsive layouts scaling to `100%` container widths with zero side margins.
*   **Visual Elements**: Consumes identical `PostCard` architectures defined in the Home Feed system (using pure 1:1 square media displays, integrated commerce elements, and action drawers).

---

## 9. INTEGRATED DESKTOP RIGHT SIDEBAR (320px)

Only visible on desktop viewports (`≥1024px`) to show personalized recommendations.

*   **Chassis Bounds**: Fixed width exactly `320px`. Top sticky offset margin: `120px` to match header heights.
*   **Sub-Module Stack**:
    *   **Suggested Profiles Panel**: Quick lists displaying alternative local sellers with `Follow` buttons (height: `36px`).
    *   **Trending Categories**: Tickers showing user search trends (e.g., "#WholesaleClothing", "#KarwanBazar").
    *   **Popular Product Rails**: Vertical grid stacks displaying trending commerce card options.

---

## 10. MOBILE FLOATING ACTION MATRIX (SAFE-ZONE COMPLIANT)

Ensures that mobile users can execute high-priority actions immediately, prioritizing finger touch zones over all background elements.

```
┌─────────────────────────────────────────────────────────────┐
│ MOBILE STICKY FOOTER (Height: 64px, safe-area-inset padding)│
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ │
│ │  Follow    │ │  Message   │ │    Call    │ │   Order    │ │
│ └────────────┘ └────────────┘ └────────────┘ └────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

*   **Placement Strategy**: Fixed position pinned to absolute screen-bottom boundaries (`fixed bottom-0`).
*   **Ergonomic Height**: Exactly `64px` in vertical layout + system safe margins integration: `pb-[env(safe-area-inset-bottom)]`.
*   **Structure & Hitboxes**: 4 equal container tabs (`Follow`, `Message`, `Call`, `Order`) displaying vector outlines + sub-text tags. Interactive touchpoints exceed size `44px` x `44px`.

---

## 11. USER CONVERSION TUNNELS & PATHWAYS

The interface is optimized to drive actions from first impression down to final transaction completion:

```
[User visits Profile]
         │
         ▼
[Inspects Trust Badges & Metrics Row]
         │
         ▼
[Filters via Tab selections] (Products / Capacity / Services)
         │
         ├──────────────────────────┼──────────────────────────┐
         ▼ (Products)               ▼ (Capacity)               ▼ (Services)
[Taps Product Item Card]    [Taps Request Quote]       [Taps Book Appointment]
         │                          │                          │
         ▼ (Instant Bottom-Sheet)   ▼ (Modal Overlay Target)   ▼ (Interactive Calendar)
[1-Tap Purchase / Checkout] [Completes Bulk B2B form]  [Reserves Date Slot]
```

By enforcing these physical specifications, Paikar Mart maintains aesthetic alignment and high density across all device viewports.
