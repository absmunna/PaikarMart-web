# PAIKARMART — ORDER TRACKING UX ARCHITECTURE
*(Phase 8.5 - Complete Real-Time Sourcing & Logistics Tracking Experience)*

This document defines the pixel-level visual layout, component architectures, timeline systems, interactive SVG mock map coordinates, rider cards, status code streams, and exception handling paths for the **Order Tracking and Cargo Monitoring Hub** of Paikar Mart Bangladesh.

---

## 1. TIMELINE COMPONENT GRAPH & DOM FLOW

The order tracking layout adapts across all viewports to display real-time statuses like standard Marketplace Orders, B2B wholesale freight, service provider allocations, or cross-border factory shipments.

### Timeline Layout Node Flow
```
[OrderTracking Chassis] (Width: 100%, Min-height: 100dvh, bg-[#04070f] (Dark Cosmic Neutral))
 └── [Sticky Header Segment] (Height: 80-120px, Glassmorphism, Padding: 24px, Radius: 20px)
      ├── [ID Badge Block] (Typography: 16px Mono, Cyan-400 font highlight)
      ├── [Live Status Badge] (Height: 32px, Dynamic coloring following tracking standard states)
      ├── [Expected Delivery Estimate counter]
      └── [Service Portal Mode Flag] (Retail | Wholesale | Service | Factory | Logistics)
 
 └── [Two-Column Workspace Layout (≥1024px Grid)] (Width: 1280px Grid, ColGap: 32px)
      │
      ├── [LEFT SIDEBAR COLUMN (8 Columns Wide - Cargo Progress)]
      │    └── [Active Steps Stack (Timeline Node Array)]
      │         ├── [Vertical Guideline Track] (width: 2px, default: bg-white/5, active: bg-cyan-400)
      │         └── [Timeline Cards Class (Height: Auto, Padding: 20px, Radius: 16px)]
      │              ├── [Point Node Bulb (24px Circle)]
      │              │    ├── Green indicator (Completed)
      │              │    ├── Cyan/Cyan Glow ring (Active / In Transit)
      │              │    └── Muted gray indicator (Pending)
      │              ├── [Typography Block]
      │              │    ├── Node title: "Out For Delivery" (16px, font-medium)
      │              │    └── Real-time Timestamp (14px Mono)
      │              └── [Metadata Location Tag] (e.g., "Moghbazar Logistics Hub")
      │
      └── [RIGHT SIDEBAR COLUMN (4 Columns Wide - Sticky Tracker @ 360px)]
           ├── [Interactive Map Simulation Module (Height: 220px, Radius: 16px, Glass border)]
           │    └── [SVG Live Routing Vectors / GPS Hub dots / animated pulsing dispatchers]
           ├── [Rider / Pilot Card Module (Padding: 16px, Height: Auto, Radius: 16px)]
           │    ├── [Profile Photo Frame] (Radius 100%, 64x64px)
           │    ├── [Pilot Details Block] (Name, Active Rating, Carrier Class e.g. "Three-Wheeler Van")
           │    └── [Communications Deck] (Call Hero Btn + Instant Messenger LinkBtn)
           └── [Static Itemized Order Bill Ledger (Radius: 20px, Padding: 20px)]
```

---

## 2. RESPONSIVE WIREFRAME DESIGN VECTORS

### A. Desktop Workspace Layout (≥1024px, Grid 12)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🚛 PAIKARMART TRADING WORKSPACE — LOGISTICS TRACKER                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  LEFT SOURCING TIMELINE (8 Columns)          RIGHT STICKY CORES (4 Columns) │
│ ┌──────────────────────────────────────────┐ ┌────────────────────────────┐ │
│ │  LIVE TRADING HEADER                     │ │ [ LIVE MAP CANVAS MOCK ]   │ │
│ │  Order ID: PK-2026-BD55 (Mono 16px)      │ │                            │ │
│ │  Transit Status: IN TRANSIT (Cyan 32px)  │ │   O [Dispatch Depot]       │ │
│ │  Mode: Wholesale Bulk Sourcing           │ │    \                           │ │
│ │  ETA: 48 Hours Remaining                 │ │     ·--> o [Rider Marker]      │ │
│ ├──────────────────────────────────────────┤ │           \                │ │
│ │                                          │ │            ▼               │ │
│ │  TIMELINE TRACK (Width 2px, Cyan)        │ │            X [Customer]    │ │
│ │                                          │ ├────────────────────────────┤ │
│ │  [*] STEP 1: ORDER PLACED (Green circle)  │ │  PILOT COORDINATOR CARD   │ │
│ │      At: 2026-05-26 10:14 AM             │ │  ┌───────┐  Sufian Cargo   │ │
│ │                                          │ │  │ 64x64 │  Rating: 4.9 ★  │ │
│ │  [*] STEP 2: PACKED (Green circle)        │ │  │ AVATAR│  Van License # │ │
│ │      At: 2026-05-26 02:30 PM             │ │  └───────┘  DHAKA-HA-4211  │ │
│ │                                          │ │  [ Call Pilot ] [ Chat ]   │ │
│ │  [o] STEP 3: IN TRANSIT (Glow Cyan ring) │ ├────────────────────────────┤ │
│ │      At: 2026-05-26 08:45 PM             │ │  LOT COMPLIANCE BILL ITEM│ │
│ │      Loc: Dhaka Central Hub Hub          │ │  Premium Polo Cotton Lots │ │
│ │                                          │ │  Value: ৳65,000            │ │
│ │  [ ] STEP 4: OUT FOR DELIVERY (Muted)     │ └────────────────────────────┘ │
│ └──────────────────────────────────────────┘                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

### B. Tablet Adaptability (768px – 1023px)
*   **Grid Constraint**: Redundant sidebar elements collapse into a vertical stack layout.
*   **Layout Flow**: Structural components flex to full-width (`w-full`) displaying the Interactive Map Card on top of the progression index, and timeline steps below.
*   **Media Box**: Resizes to `100x100px` to maintain fluid layout margins.

### C. Mobile Touch Targets Grid (320px – 767px)
*   **Timeline Accordion Switch**: Steps collapse into a simplified accordion layout to reduce scroll fatigue. Tap targets span a minimum of `48px` x `48px`.
*   **Sticky Anchor Panel (Height: 72px)**: Persists at the absolute bottom of the mobile viewport, offering quick call-to-action triggers:
    *   **Call/Support Deck** (Pill trigger)
    *   **Track Rider Hub** (Brings dynamic floating map sheet forward)
    *   **Share Logistics Receipt** (Native trigger target)
*   **Safe Area Padding**: Explicitly bounded via `pb-[env(safe-area-inset-bottom)]`.

---

## 3. LIVE MAP NAVIGATION SPECIFICATIONS
*   **Sizing**: 220px Height block framed with a translucent container `bg-[#0b0f19]/80 border border-white/10`.
*   **SVG Markers**: Features coordinates for start, active carrier location, and customer endpoint.
*   **Dynamic Pulsing Ring Effect**: Animation cycles at `1.8s` with a custom ripple `animate-ping` vector ring colored in `#22d3ee` (Cyan) to represent real-time coordinate updates.

---

## 4. PILOT/RIDER CARD DESIGN SPECIFICATIONS

Each rider card contains precise visual controls for secure on-site delivery communications.

```
+─────────────────────────────────────────────+
| Rider Profile: Sufian Cargo                 |
| Avatar: 64x64px, Object-Cover, border: 2px  |
| Details: Delivery Expert · ⭐ 4.9           |
| Vehicle: Covered Pickup (DHAKA-METRO-1142)  |
+─────────────────────────────────────────────+
| [ CALL DISPATCHER ]   |   [ PRIVATE CHAT ]  |
| H: 44px, bg-cyan-400  |   H: 44px, Glassm.  |
+─────────────────────────────────────────────+
```

---

## 5. REAL-TIME LOGISTICS UPDATE UX FLOWS

An optimistic, event-driven state mechanism updates current step markers dynamically. Use visual transition animations so status changes are clear.

```
       [ INCOMING STATE UPDATE EVENT via Socket/API ]
                            │
                            ▼
           [ Identify Current Status Key ]
         (e.g., transitions "Packed" -> "In Transit")
                            │
                            ├───────────────────────────────────────┐
                            ▼                                       ▼
       [ Scroll container to Active Node Card ]        [ Update SVG Map Coordinate Pilot ]
       (duration: 400ms, timing: cubic-bezier)         (interpolated tween path update)
                            │                                       │
                            └───────────────────┬───────────────────┘
                                                ▼
                                    [ Complete UI State Sync ]
```

---

## 6. COLOR & METRIC PALETTE SYSTEM

Statuses are mapped to distinct, highly accessible state colors:

| Status Key | Primary Accent Color | Background Badge Style | Icon |
| :--- | :--- | :--- | :--- |
| **Placed** | `#94a3b8` (Slate-400) | `bg-slate-500/10 border-slate-500/20` | `ShoppingBag` |
| **Processing**| `#3b82f6` (Blue-500) | `bg-blue-500/10 border-blue-500/20` | `Clock` |
| **Packed** | `#a855f7` (Purple-500) | `bg-purple-500/10 border-purple-500/20` | `Package` |
| **Shipped** | `#06b6d4` (Cyan-500) | `bg-cyan-500/10 border-cyan-500/20` | `Truck` |
| **In Transit**| `#22d3ee` (Cyan-400) | `bg-cyan-500/15 ring-2 ring-cyan-400/35` | `Sparkles` |
| **Delivered** | `#10b981` (Emerald-500) | `bg-emerald-500/10 border-emerald-500/20` | `CheckCircle2` |
| **Cancelled** | `#ef4444` (Red-500) | `bg-red-500/10 border-red-500/20` | `XCircle` |

---

## 7. EXCEPTION STATE ACTIONS & ESCAPE CHANNELS

If transport exceptions occur, action cards guide the buyer through next steps:

### A. Delayed Order
*   **Trigger**: ETA breaches thresholds by 120 minutes.
*   **Visual state**: Notice box displays with soft orange background (`#b45309`).
*   **Action**: *"Mayer Doa Logistics is experiencing heavy traffic near Tongi. Route coordinates recalculated. Support Hotline connected instantly."*

### B. Rider Not Assigned
*   **Trigger**: Initial order in "processing" state prior to pilot dispatch allocation.
*   **Visual state**: Muted pulse with placeholder icons.
*   **Action**: *"Factory is finishing lot carton arrangements. Cargo pilots dispatching within next hour."*

### C. Payment Pending
*   **Trigger**: Unsecured or delayed bKash/Nagad verification sequences.
*   **Visual state**: Heavy flashing red indicators around payment panel.
*   **Action**: *"Transactions require secure handshake verification. Tap here to complete your bKash Mobile Gateway Settlement."*

### D. Delivery Failed / Returned
*   **Trigger**: Consignee unreachable or address error flag triggered by dispatchers.
*   **Visual state**: Status displays bright red indicators.
*   **Action**: *"Consignee mobile sequence did not complete. Pilot has returned lot cargo to Mirpur Central Depot. Click to Reschedule."*

---

## 8. INTEGRATED VISUAL MODES

1.  **Retail (B2C)**: Displays standard cargo identifiers like "Delivery Package Parcel".
2.  **Wholesale (B2B)**: UI transitions labels to display bulk parameters: "Total Lots", "Freight Carrier Allocation", "Manufacturer Source".
3.  **Services**: Changes labels to: "Assigned Engineer", "Installation Equipment Kit".
4.  **Factory Shipments**: Focuses labels around export logistics parameters: "Customs Clearing Port", "Feeder Cargo Hub".
5.  **Logistics Mode**: Displays specific dispatch carrier vehicle coordinates and registration details.
