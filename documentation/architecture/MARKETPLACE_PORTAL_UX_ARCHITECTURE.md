# PAIKARMART — MARKETPLACE PORTAL UX ARCHITECTURE
*(Phase 8.6 - Multi-dimensional Marketplace Discovery System)*

This document specifies the pixel-level visual layout, component systems, cascading discovery flows, filter logic, and component behaviors for the **Marketplace Portal**, optimized to bridge high-volume B2B wholesale and curated B2C retail experiences.

---

## 1. STRUCTURAL TOPOLOGY (DESKTOP @1280px)

The architecture leverages a high-density, three-column discovery grid for maximum product exposure and contextual filtering, maintaining a clear separation between navigational and transactional pathways.

- **Total Workspace**: Fixed width container `1280px`, centered.
- **Column Structure**:
  - **Left Sidebar**: `280px` (Category Navigation & Discovery Depth)
  - **Center Grid**: `720px` (Marketplace Feed & Featured Discovery)
  - **Right Sidebar**: `280px` (Refinement Engine & Trending Analytics)
- **Column Gap**: `32px`

---

## 2. LAYOUT & RESPONSIVE WIREFRAMES

### A. Desktop Workspace Layout (≥1024px)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🔍 GLOBAL SEARCH (600px x 48px, Radius 16px)                                │
├───────────┬──────────────────────────────────────────────┬──────────────────┤
│           │ [ 220px Category Hero Banner ]               │                  │
│ LEFT NAV  │ ──────────────────────────────────────────── │ RIGHT FILTER     │
│ [280px]   │                                              │ PANEL [280px]    │
│           │ [Prod] [Prod] [Prod] [Prod] — 4 Col Grid     │ ┌──────────────┐ │
│ [Cats]    │ [Prod] [Prod] [Prod] [Prod] — Gap 24px       │ │ Location     │ │
│           │ [Prod] [Prod] [Prod] [Prod]                  │ │ Price Slider │ │
│           │ [Prod] [Prod] [Prod] [Prod]                  │ │ [Verified]   │ │
│           │                                              │ └──────────────┘ │
│           │                                              │                  │
│           │                                              │ TRENDING         │
└───────────┴──────────────────────────────────────────────┴──────────────────┘
```

### B. Mobile Touch Targets (320px – 767px)
- **Sticky Search**: Top-aligned, `100%` width.
- **Category Bar**: Horizontal swipeable scroll, `64px` height baseline.
- **Product Grid**: `2` column fluid stack (`Gap 16px`).
- **Bottom Navigation**: Sticky `72px` height, containing Filter/Cart/Home shortcuts (incorporating `safe-area-inset-bottom`).

---

## 3. COMPONENT HIERARCHY SPECIFICATIONS

### I. Category System Spec (Left Sidebar)
- **Item Height**: `44px`
- **Corner Radius**: `12px`
- **Interactions**: On hover, apply `bg-cyan-500/10` with `border-l-4 border-cyan-400`.
- **Logic**: Hierarchical accordion system (animated `200ms`) for subcategory depth discovery.

### II. Product Card (Marketplace Feed Spec)
- **Image**: `1:1 ratio`, `280x280px` (scales fluidly), `Border Radius: 16px`.
- **Card Padding**: `12px`.
- **Information**:
  - **Name**: `16px`, semi-bold, 2-line clamp.
  - **Price**: `20px`, bold, `text-cyan-400`.
  - **Badges**: `28px` height, glassmorphic pill background.
  - **Hover**: Subtle lift elevation (`shadow-lg`), scale `1.02`.

### III. Filter & Discovery Engines
- **System**: Instant filtered updates (React Query cache optimization).
- **Control**: Multi-select support, clear-all action anchored to the top of the filtering box.
- **Location Filter**: Geo-fencing toggle to prioritize "Nearby Shop Portal" inventory.

---

## 4. DISCOVERY & CONVERSION FLOW MAP

The Marketplace portal bridges the gap from casual browsing to transactional trust using a clear, sequential path:

**[GLOBAL SEARCH/CATEGORY ENTRY]**
       │
       ▼
**[DISCOVERY FEED (Filtering/Trending)]**
       │
       ▼ (Conversion Engine)
**[PRODUCT DETAIL / SELLER TRUST PAGE]**
       │
       ▼
**[ORDER PIPELINE / SOURCING BLOCK]**

---

## 5. SEARCH & FEED UX BEHAVIORS

- **Discovery Optimization**: Trending sections dynamically display "Fast-Moving" or "Top-Rated" flash-tags to drive impulse procurement.
- **Visual Feedback**: Skeleton screens represent all asynchronous loading states for feed updates to reduce perceived latency.
- **Optimistic UI**: Filtering applies immediately without full-page reloads, providing instant feedback on inventory availability.
