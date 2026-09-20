# PAIKARMART — SELLER DASHBOARD UX ARCHITECTURE
*(Phase 8.9 - Complete Business Operating System)*

This document defines the pixel-level visual layout, component architectures, KPI visualization engines, order orchestration, and AI-driven intelligence pathways for the **PaikarMart Seller Dashboard** — a comprehensive Business Operating System.

---

## 1. STRUCTURAL TOPOLOGY (DESKTOP @1280px)

- **Total Workspace**: Fixed width container `1280px` (or fluid-constrained), centered.
- **Three-Column Grid**:
  - **Left Sidebar**: `260px` (Functional Navigation Hub)
  - **Center Content**: `760px` (Operative Work Area & KPI Analysis)
  - **Right Sidebar**: `260px` (Intelligence Matrix, Alerts & Quick Actions)
- **Column Gap**: `32px`

---

## 2. LAYOUT & RESPONSIVE WIREFRAMES

### A. Desktop Workspace Layout (≥1024px)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏪 [Store Name] [Badge] [Active Status] | [ Search Bar 420x40 ] | [Bell] [Av]│
├───────────┬──────────────────────────────────────────────┬──────────────────┤
│ LEFT NAV  │ [ KPI GRID - 4 Column Layout ]               │ RIGHT PANEL      │
│ [260px]   │ ──────────────────────────────────────────── │ [260px]          │
│           │ [ Hybrid Sales Chart Area (Radius 20px)    ] │ ┌──────────────┐ │
│ [List]    │                                              │ │ AI Insight   │ │
│           │ [ Product Management Table (Full Width)    ] │ │ [Alerts]     │ │
│ [List]    │                                              │ │ [QuickActn]  │ │
│           │ [ Inventory Module ]                         │ └──────────────┘ │
│           │                                              │                  │
└───────────┴──────────────────────────────────────────────┴──────────────────┘
```

### B. Mobile Touch Targets (320px – 767px)
- **Top**: Sticky Header (KPI scroll horizontal, bottom nav).
- **Center**: Vertical stack of Workcard modules.

---

## 3. PIXEL-LEVEL UI SPECIFICATIONS

### I. Navigation System
- **Items**: `Height 44px`, `Radius 12px`.
- **Active State**: `bg(cyan-500, 0.1)`, `border-l-4 border-cyan-400`.

### II. Top Header Search Bar
- **Dimensions**: `420px x 40px`.
- **Radius**: `16px`.
- **Border**: `1px solid var(--pm-border)` (Glassmorphic).

### III. Dashboard Overview (KPI Grid)
- **Card**: `Height 110px`, `Radius 16px`, `Padding 16px`.
- **Typo**: Key metrics at `24px` Bold, Unit/Label at `12px` Muted.

### IV. Hybrid Sales Chart
- **Dimensions**: `Height 280px`, `Radius 20px`.
- **Style**: Line + Bar hybrid chart (Recharts).

---

## 4. INTELLIGENCE & ALERT SYSTEMS

### The AI Insights Panel (Right Sidebar)
- **Architecture**: A context-aware notification engine that parses live transaction streams.
- **Cards**: `Padding 12px`, `Radius 12px`.
- **Interactions**: AI-triggered "One-tap-fix" buttons (e.g., "Add Stock" -> modal opens to edit inventory).

### Alert Logic
- **Critical Alerts**: Red border flash, urgent sound cue (muteable).
- **Status Indicators (Tables)**:
  - High Selling: `bg-emerald-500/10` text `emerald-400`.
  - Low Stock: `bg-rose-500/10` text `rose-400`.

---

## 5. OPERATIONAL FLOWS

1.  **Traffic Management**: View Analytics -> Deep Dive -> Marketing Campaign.
2.  **Order Pipeline**: List Order -> Accept -> Pack -> Label Generation -> Handover.
3.  **Stock Orchestration**: Low Stock Alert -> Reorder Trigger -> Inventory Update.

---

## 6. DESIGN TOKENS

- **Spacing**: Strict 8px grid (8, 16, 24, 32, 48, 64).
- **Glassmorphism**: Border `1px solid rgba(255, 255, 255, 0.08)`, Background `rgba(0, 0, 0, 0.4)`.
- **Button Tokens**: `Height 44px`, `Radius 12px`.
- **No Hardcoded Colors**: Use `var(--pm-bg)`, `var(--pm-accent)`, etc.
