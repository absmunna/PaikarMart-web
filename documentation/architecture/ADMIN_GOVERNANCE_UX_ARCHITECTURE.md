# PAIKARMART — ADMIN & GOVERNANCE COMMAND CENTER UX ARCHITECTURE
*(Phase 8.10 - Complete System Control & AI Governance OS)*

This document defines the pixel-level visual layout, component architectures, AI-driven risk monitoring engine, and governance control pathways for the **PaikarMart Admin & Governance Hub**. This serves as the ultimate command center for platform stability and multi-vendor social commerce regulation.

---

## 1. STRUCTURAL TOPOLOGY (DESKTOP @1280px)

The architecture is designed for rapid observability and high-criticality task execution, emphasizing instant identification of systemic risks over raw data density.

- **Total Workspace**: Fixed width container `1280px` (or fluid-constrained), centered.
- **Three-Column Command Grid**:
  - **Left Sidebar**: `280px` (Governance Nav Hub)
  - **Center Content**: `760px` (System KPI & Monitoring Work Area)
  - **Right Sidebar**: `280px` (AI-Driven Risk Engine & Action Matrix)
- **Column Gap**: `32px`

---

## 2. LAYOUT & RESPONSIVE WIREFRAMES

### A. Desktop Workspace Layout (≥1024px)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🛑 [Health Indicator] | [User Live Count] | [ Search Bar 420x40 ] | [Admin]│
├───────────┬──────────────────────────────────────────────┬──────────────────┤
│ LEFT NAV  │ [ KPI GRID - 4 Column Layout ]               │ RIGHT PANEL      │
│ [280px]   │ ──────────────────────────────────────────── │ [280px]          │
│           │ [ Real-time System Event Map (Radius 20px) ] │ ┌──────────────┐ │
│ [List]    │                                              │ │ AI Risk Alert│ │
│           │ [ Moderator / Content Control Table       ]  │ │ [QuickActions] │ │
│ [List]    │                                              │ │ [Audit Trail]│ │
│           │ [ Escrow & Financial Control Panel        ]  │ └──────────────┘ │
│           │                                              │                  │
└───────────┴──────────────────────────────────────────────┴──────────────────┘
```

### B. Mobile Touch Targets (320px – 767px)
- **Top**: Critical Alerts & System Health Status.
- **Center**: Vertical stack of actionable Governance Cards.
- **Bottom**: Fixed `72px` Sticky Action Panel (Critical Approval/Block triggers).

---

## 3. PIXEL-LEVEL UI SPECIFICATIONS

### I. Navigation Hub
- **Item Height**: `44px`.
- **Corner Radius**: `12px`.
- **Active State (Red Alert)**: `bg(rose-500, 0.1)`, `border-l-4 border-rose-500`.

### II. System Header
- **Search Bar**: `420px x 40px`, `Radius 16px`, `Glassmorphic`.
- **Status Indicator**: Global `Pulse` icon (🟢 Normal, 🟡 Warning, 🔴 Critical).

### III. Dashboard Overview (KPI Grid)
- **Card**: `Height 110px`, `Radius 16px`, `Padding 16px`.
- **Typo**: Key metrics at `24px` Bold, Unit/Label at `12px` Muted.

---

## 4. AI GOVERNANCE & FRAUD RISK
- **Architecture**: A context-aware intelligence matrix, ingesting platform-wide event streams (ordering logs, content signals, payment velocity).
- **Cards**: `Padding 16px`, `Radius 16px`.
- **Severity Color System**:
  - `Low (Yellow)`: `#ca8a04`
  - `Medium (Orange)`: `#ea580c`
  - `High (Red)`: `#dc2626`
  - `Critical (Deep Red)`: `#991b1b` (Flashing pulse animation).

---

## 5. OPERATIONAL GOVERNANCE FLOWS

1.  **Detection**: AI Governance Engine flags anomalous order/payment velocity.
2.  **Analysis**: AI provides heuristic context (e.g., "User account age inconsistency").
3.  **Review**: Admin inspects flagged user/post/transaction via high-density dashboards.
4.  **Governance Action**: Admin execution via quick-action button (Block, Suspend, Escrow Hold).
5.  **Audit**: Every action is immutably logged in the `System Logs` feed.

---

## 6. DESIGN TOKENS
- **Spacing**: Strict 8px grid (8, 16, 24, 32, 48, 64).
- **Glassmorphism**: Border `1px solid rgba(255, 255, 255, 0.08)`, Background `rgba(0, 0, 0, 0.4)`.
- **Button Tokens**: `Height 44px`, `Radius 12px`.
- **Color Usage**: Maintain strict use of semantic CSS variables (`var(--pm-bg)`, `var(--pm-accent)`, `var(--pm-border)`).
