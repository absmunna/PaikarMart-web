# PAIKARMART — LOGISTICS CONTROL PORTAL UX ARCHITECTURE
*(Phase 8.8 - Complete Fleet, Warehouse, and Cargo Control Command Center)*

This document defines the pixel-level visual layout, component architectures, route optimization engines, real-time fleet synchronization, and critical alerting pathways for the **Logistics Control Portal** of Paikar Mart Bangladesh.

---

## 1. STRUCTURAL TOPOLOGY (DESKTOP @1280px)

The architecture utilizes a unified command-center experience for end-to-end logistics observability and execution.

- **Total Workspace**: Fixed width container `1280px`, centered.
- **Column Structure**:
  - **Left Sidebar**: `280px` (Fleet & Routes Command)
  - **Center Grid**: `720px` (Live Shipments Feed & Tactical Map)
  - **Right Sidebar**: `280px` (Control, Alerts & Optimization Analytics)
- **Column Gap**: `32px`

---

## 2. LAYOUT & RESPONSIVE WIREFRAMES

### A. Desktop Workspace Layout (≥1024px)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🚛 LOGISTICS COMMAND CONTROL CENTER                                         │
├───────────┬──────────────────────────────────────────────┬──────────────────┤
│           │ [ LIVE MAP PANEL (260px height) ]            │                  │
│ LEFT NAV  │ ──────────────────────────────────────────── │ RIGHT CONTROL    │
│ [280px]   │                                              │ PANEL [280px]    │
│           │ [ Shipment Card (100% W) ]                   │ ┌──────────────┐ │
│ [Fleet]   │ [ Shipment Card (100% W) ] — Gap 16px        │ │ Active Alerts│ │
│           │ [ Shipment Card (100% W) ]                   │ │ Delayed Ship │ │
│ [Routes]  │ [ Shipment Card (100% W) ]                   │ │ Route Optimiz│ │
│           │                                              │ └──────────────┘ │
│ [WH]      │                                              │                  │
└───────────┴──────────────────────────────────────────────┴──────────────────┘
```

### B. Mobile Touch Targets (320px – 767px)
- **Top**: Live Map (full width).
- **Center**: Vertical stack of shipment cards.
- **Bottom**: Sticky `72px` Control bar (Track, Call, Support).

---

## 3. COMPONENT HIERARCHY SPECIFICATIONS

### I. Shipment Feed Card
- **Dimensions**: `Auto` height, `100%` width.
- **Radius**: `16px`.
- **Key Data**: 
  - Shipment ID (`mono font`, `14px`, `gray-400`).
  - Origin → Destination (`bold`, `16px`).
  - Status Badge (Height `28px`, `RADIUS: 20px`, `Colors per Status`).
  - Meta: Vehicle Type, Rider Name, ETA.

### II. Live Map Panel
- **Dimensions**: `260px` height.
- **Visuals**: Real-time GPS plotting for active shipments, overlay pins for warehouse nodes.

### III. Warehouse Capacity Card
- **Dimensions**: `120px` height.
- **Indicator**: Horizontal usage progress bar (`primary` color).

---

## 4. REAL-TIME SYNCHRONIZATION & UX BEHAVIORS

- **Latency-Free Sync**: Event-driven UI updates via WebSockets; shipment status changes trigger optimistic re-sorting of feed items.
- **Contextual Visualization**: Live Map transitions from regional container-cluster view to fine-grained rider-delivery path view based on shipment selection.

---

## 5. STATUS MAPPING & EXCEPTION LOGIC

| Status Key | Accent Color   |
| :--- | :--- |
| **Packed** | `#a855f7` (Purple) |
| **Shipped** | `#06b6d4` (Cyan) |
| **In Transit** | `#3b82f6` (Blue) |
| **Out for Delivery**| `#22d3ee` (Elec. Cyan) |
| **Delivered** | `#10b981` (Green) |
| **Delayed** | `#f97316` (Orange) |
| **Failed** | `#ef4444` (Red) |

### Exception State Actions
- **Rider/Vehicle Failure**: Trigger banner with button to "Auto-Assign Substitute".
- **Warehouse Overflow**: Highlight card border in `#ef4444`, CTA to "Redivert Inbound".
- **Route Block**: Optimization suggestion appears in Right Panel.

---

## 6. DESIGN TOKENS & PIXEL SPECIFICATIONS

- **Spacing**: 8px grid system.
- **Typography Hierarchy**: JetBrains Mono for IDs (12px), Inter Bold for headers (18px).
- **Glassmorphism**: Border `1px solid rgba(255, 255, 255, 0.08)`, Background `rgba(0, 0, 0, 0.4)`.
- **Button Radius**: `12px` (Primary actions), `full` (Status badges).
