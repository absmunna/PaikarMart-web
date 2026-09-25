# PAIKARMART — SERVICE MARKETPLACE UX ARCHITECTURE
*(Phase 8.7 - Complete Skillization, Booking, and Service-Job Monitoring Experience)*

This document defines the pixel-level visual layout, component architectures, booking engines, provider profile metrics, service job tracking timelines, and conversion pathways for the **Service Marketplace Hub** of Paikar Mart.

---

## 1. STRUCTURAL TOPOLOGY (DESKTOP @1280px)

The architecture utilizes a dedicated Service-Discovery-to-Execution ecosystem.

- **Workspace**: Centered `1280px` container.
- **Column Layout**:
  - **Left Sidebar**: `280px` (Hierarchical Service Classification Engine)
  - **Center Grid**: `720px` (Service Listing & Discovery Feed)
  - **Right Sidebar**: `280px` (Deep Filtering & Provider Highlight Engine)
- **Column Gap**: `32px`

---

## 2. LAYOUT & RESPONSIVE WIREFRAMES

### A. Desktop Workspace Layout (≥1024px)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🔧 SERVICE MARKETPLACE ARCHITECTURE                                          │
├───────────┬──────────────────────────────────────────────┬──────────────────┤
│           │ [ 220px FEATURED SERVICE CAMPAIGN ]          │                  │
│ LEFT NAV  │ ──────────────────────────────────────────── │ RIGHT FILTER     │
│ [280px]   │                                              │ PANEL [280px]    │
│           │ [ ProviderCard Lot (100% W) ]                │ ┌──────────────┐ │
│ [Cats]    │ [ ProviderCard Lot (100% W) ]                │ │ Price Range  │ │
│           │ [ ProviderCard Lot (100% W) ] — Gap 16px     │ │ Rating       │ │
│           │ [ ProviderCard Lot (100% W) ]                │ │ [Verified]   │ │
│           │                                              │ └──────────────┘ │
│           │                                              │                  │
│           │                                              │ PROVIDER HIGHLIGHTS
└───────────┴──────────────────────────────────────────────┴──────────────────┘
```

### B. Mobile Touch Targets (320px – 767px)
- **Single column stack** for listings.
- **Sticky Bottom UI (`72px`)**: Persists `[Book Now] | [Message] | [Call]`.
- **Safe Area Padding**: `pb-[env(safe-area-inset-bottom)]`.

---

## 3. UI SPECIFICATIONS

### I. Service Listing Card (Grid Item)
- **Padding**: `16px`, **Radius**: `16px`, **Border**: `1px solid var(--pm-border)`.
- **Layout**: 
  - **Left**: `64x64px` circular provider avatar `border-2 border-cyan-400`.
  - **Center**: Title (18px Bold), Provider Name (14px), Rating Stars, Job Count, Price Per Hour Label.
  - **Right**: Secondary Action Button (View Profile, Book Now — Height `44px`, Radius `12px`).

### II. Booking System Panel (Service Detail)
- **Sticky Position**: `Right Column` on Desktop. 
- **Booking Engine**:
  - **Date Container**: Visual calendar picker overlay.
  - **Time Slots**: Micro-grid of rounded pills.
  - **CTAs**: Primary `BOOK NOW` (Height `56px`, Radius `16px`, color: `var(--pm-accent)`).

### III. Job Tracking Timeline
- **Vertical Pipeline**:
  - `Requested` → `Accepted` → `In Progress` → `Completed` → `Reviewed`.
  - **Accent**: All active timeline segments utilize `#22d3ee` (Cyan-400).
  - **Visuals**: Animated step completion rings.

---

## 4. CONVERSION FLOW MAP

The marketplace utilizes a path optimized for trust-based high-value skill transactions.

**[SERVICE DISCOVERY (Category Nav)]**
       │
       ▼
**[PROVIDER TRUST FEED / FILTERING]**
       │
       ▼ (Conversion Bridge)
**[SERVICE DETAIL / PORTFOLIO PAGE]**
       │
       ▼
**[BOOKING PANEL (Real-time availability)]**
       │
       ▼
**[PAYMENT -> LIVE JOB TRACKING]**

---

## 5. TECHNICAL UX RULES

- **Real-Time Availability**: Provider booking slots sync across sessions using Redis/WebSockets to ensure zero collision.
- **Optimistic UI**: Actions like "Book" or "Message" provide immediate success-states while back-end verification confirms state.
- **Provider Trust Badge**: Tiered badge system (Verified, Pro, Gold) rendered as vector SVG rings around avatars.
- **Pixel-Precision**: Strict 8px grid alignment for input boxes and button padding. No hardcoded colors; CSS variables only.
