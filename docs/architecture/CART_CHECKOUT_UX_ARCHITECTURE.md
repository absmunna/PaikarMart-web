# PAIKARMART — CART & CHECKOUT UX ARCHITECTURE
*(Phase 8.4 - Complete Sourcing Cart & Settlement Experience Architecture)*

This document outlines the exact, pixel-specification ready visual hierarchy, component systems, cascading checkout flows, interactive state maps, and error recovery channels for the **Cart & Checkout Workspace** in Paikar Mart Bangladesh.

No Figma or secondary screen guides are needed; developers can implement direct production links from these layout vectors.

---

## 1. CART SYSTEM COMPONENT ARCHITECTURE & COMPONENT TREE

The Cart within the Paikar Mart social commerce pipeline is unified. It polymorphs to support standard B2C Products, B2B wholesale listings, on-site services, demand-side proposals, and third-party logistics bookings in a unified view.

### Component Dependency Tree
```
[CartPage Chassis Layer] (Width: Auto, bg-[#04070f] dark cosmic theme)
 ├── [Workspace Header] (Height: 64px, back action, dynamic section titles)
 ├── [AnimatePresence Workspace Switcher] (Controlled modes: "cart" | "checkout" | "success")
 │
 ├── [MODE "cart"] -> 12 Column Grid (Width 1280px, Padding 32px, Column Gap 32px)
 │    ├── [Left: List Section (8 Columns, Width: 100%)]
 │    │    ├── [Active Inventory Status Banner] (Total count, quick clear trigger action)
 │    │    └── [Polymorphic Cart Item Cards] (Width: 100%, Padding: 20px, Radius: 16px)
 │    │         ├── [Media Box] (AspectRatio 1:1, Size: 120x120px)
 │    │         ├── [Details Module (Gap: 16px)] (Vendor specialization tag, Title @ 18px Bold, variant info)
 │    │         ├── [Stepping Stepper Widget (Width: 120px, Height: 40px)] (Buttons: - / +)
 │    │         ├── [Subtotal Counter (24px Bold, JetBrains Mono font Stream)]
 │    │         └── [Delete Action Anchor] (Trash icon relative positioned)
 │    │
 │    └── [Right: Sticky Summary Card (4 Columns, Width: 360px, StickyTop: 120px, Padding: 24px, Radius: 20px)]
 │         ├── [Dynamic Coupon Input Area] (PAIKAR500 validation, apply CTA)
 │         ├── [Base Breakdown Details (Base value, 5% VAT Bangladesh Compliance, Estimated Freight fee, discounts)]
 │         ├── [Consolidated Gross Ledger Total (Typography: 28px font, Weight: 900)]
 │         └── [Interactive Primary Action Button (Height: 56px, Radius: 16px, bg-cyan-400 font-extrabold)]
 │
 ├── [MODE "checkout"] -> 12 Column Grid
 │    ├── [Left: Multi-Step Wizards Drawer (8 columns)]
 │    │    ├── [Progress Line Indicator Segment] (Steps: 1: Address | 2: Logistics | 3: Settle | 4: Secure Review)
 │    │    │
 │    │    ├── [Step 1 View: Address Container (Padding 20px, Height: Auto, Radius: 20px)]
 │    │    │    └── [Inputs Row] (Name, Phone (+880), Division, District, Area Upazila Cascading select, ZIP, Address text)
 │    │    │
 │    │    ├── [Step 2 View: Logistics Selection (Padding 20px, Option Cards Height: 72px, Radius: 16px)]
 │    │    │    └── [Options] (Standard Delivery, Express next-day, local Warehouse Pickup, B2B Container Freight Truck)
 │    │    │
 │    │    ├── [Step 3 View: Settlement Engine (Padding 20px, Gateway Option Cards Height: 80px, Radius: 16px)]
 │    │    │    └── [Options] (Cash on Delivery, Mobile banking bKash/Nagad, card SSL Commerz, Super Wallet credits)
 │    │    │
 │    │    └── [Step 4 View: Verification Board (Padding 20px, Confirmation Trigger Button Height: 56px, Radius: 16px)]
 │    │
 │    └── [Right: Sticky Settlement Summary Card (4 Columns, Width: 360px)]
 │         └── [Active Bill Overview] (Reflects delivery options and real-time ledger cost)
 │
 └── [MODE "success"] -> Central Card Wrapper (Width: Max 576px, Centered, Padding 24px, Radius: 24px)
      ├── [Success Spring Ring Animation Anchor] (CheckCircle icon container)
      ├── [ID Status Tag & Estimated transit delivery times table]
      └── [Navigation CTA deck (Cargo Tracking Map link, Continue Sourcing button)]
```

---

## 2. WIREFRAME LAYOUT VECTORS

### A. Desktop Viewport Blueprint (≥1024px)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🛒 PAIKARMART TRADING WORKSPACE — CART                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  LEFT SOURCING SECTION (8 Columns)           RIGHT SUMMARY BAR (4 Columns)  │
│ ┌──────────────────────────────────────────┐ ┌────────────────────────────┐ │
│ │ active summary: 4 lines inside catalog   │ │  Apply Corporate Coupon    │ │
│ ├──────────────────────────────────────────┤ │  [ PAIKAR500     ] [Apply] │ │
│ │                                          │ ├────────────────────────────┤ │
│ │  ITEM CARD LOT (Radius: 16px, Padding 20)│ │  Consolidated Bill Summary │ │
│ │  ┌─────────┐  Samsung F15 (B2C)          │ │  Base Value:      ৳114,000 │ │
│ │  │ 120x120 │  Vendor: Samsung BD         │ │  Statutory VAT:     ৳5,700 │ │
│ │  │  IMAG   │  Variant: 128GB Indigo Blue │ │  Transit Freight:     ৳100 │ │
│ │  │  1:1    │  [ Low Stock Badge ]        │ │  ------------------------- │ │
│ │  └─────────┘                             │ │  Total due:       ৳119,800 │ │
│ │  Stepper: [-]  1  [+]  Price: ৳18,500    │ │  (28px JetBrains Font Bold)│ │
│ ├──────────────────────────────────────────┤ ├────────────────────────────┤ │
│ │                                          │ │                            │ │
│ │  ITEM CARD LOT (Wholesale Bulk Lot)      │ │  [  PROCEED TO SETTLEMENT ]│ │
│ │  ┌─────────┐  Premium Polo Cotton Lots   │ │     (Height: 56px, Rad 16) │ │
│ │  │ 120x120 │  Vendor: Tex-Gear Factory   │ │                            │ │
│ │  │  IMAG   │  [ MOQ 1 Lot Verified ]     │ └────────────────────────────┘ │
│ │  │  1:1    │                             │                                │
│ │  └─────────┘  Stepper: [-]  1  [+]   Price: ৳65,000                      │ │
│ └──────────────────────────────────────────┘                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

### B. Tablet Viewport Layout Adapter (768px – 1023px)
*   Container: `720px` centered.
*   The Desktop 2-column grid collapses into a single vertical stack.
*   **Media Box**: Resizes to `100x100px` to save vertical scroll space.
*   **Order Summary**: Repositioned below the main item cart card array at `100%` width with responsive margins (`mt-8`).

### C. Mobile Touch Targets Grid (320px – 767px)
*   Padding bounds: `16px` (`p-4`), Card radius downscales to `12px` (`rounded-xl`).
*   **Interactive Target Hitbox**: Minimum `44px` x `44px` on quantity step buttons `+`/`-`, dropdown selection slots, and payment selectors.
*   **Bottom Sticky Strip Layout**: Height `72px` with a fixed padding frame `pb-[env(safe-area-inset-bottom)]`. Shows total price on left column (`৳119,800` at 18px), and active `Checkout` button on right (`50%` flex width).

---

## 3. CHECKOUT STEP-BY-STEP PROGRESSION

The checkout experience features a single-page interactive state machine that updates optimistically to prevent page reloads during processing.

```
       [ STEP 01: Address ]
               │
               ▼ (Requires: Name, valid contact, cascading city/upazila values)
       [ STEP 02: Logistics Route ]
               │
               ▼ (Pre-calculates precise freight fee onto current summary card)
       [ STEP 03: Sourcing Settlement ]
               │
               ▼ (Cash on Delivery / bKash wallet / Card SSL Commerz / Super Wallet)
       [ STEP 04: Verify Block ]
               │
               ▼ (Presents detailed ledger breakdown with government statutory rules)
     ┌───────────────────────────────────┐
     │ Success secured order confirmation│
     └───────────────────────────────────┘
```

---

## 4. INTEGRATED PAYMENT METHOD SPECIFICATIONS

Settlement adapters utilize visual cards defined with **height 80px and padding 16px**.

1.  **Mobile Wallets (bKash / Nagad)**:
    *   **Loop**: Triggers mobile wizard layout. Includes on-screen secure input fields for PIN and SMS OTP (using mock loops on developmental states to ensure robust flow, transitioning inline).
    *   **Visual cues**: Official service colors are rendered (`#e2136e` for bKash, `#f37021` for Nagad) to maintain high brand recognition.
2.  **Paikar Super Wallet**:
    *   **Authentication**: Reads state wallet stores `bdtBalance`. Instantly deducts credits on successful confirmation, displaying current balance deductions in a live interface loop.
3.  **Cash on Delivery**:
    *   **Assurance**: Injects standard cargo inspection guarantee badges to build user trust.

---

## 5. ROBUST ERROR RECOVERY STATES

To prevent abandonment during high-friction states, Paikar Mart implements contextual callouts and recoveries directly within the Cart and Settlement drawers.

| Failure Event | UI Component Action | On-Screen Help / Recovery CTA |
| :--- | :--- | :--- |
| **Out of Stock item** | Item Row color dims to `#0f1322` and opacity `50%`. Quantity stepper changes into warning badge. | *"Remove item from cart or substitute with equivalent verified vendor alternatives instantly."* |
| **Price fluctuation** | Injects high contrast notice banner styled with orange indicators inside cart drawer. | *"Manufacturer updated catalog rates. Tap to confirm adjusted pricing before checking out."* |
| **Logistics unavailable**| Disables proceed button for designated district cascading area. | *"Standard postal service is unavailable for your upazila. Select flatbed Logistics Carriers or pickup hubs."* |
| **Payment failed** | Payment block turns red; overlay warning triggers. | *"Auth code invalid or credit limit exceeded. Click here to instantly switch to Cash on Delivery."* |

---

## 6. USER CONVERSION CONSTRAINTS & OPTIMAL TRADING RULES

1.  **Strict Local Persistence (Auto-Save)**: Sourcing Cart states are persisted inside `pm-cart-storage` (using Zustand storage middleware) in real-time. Closing the app or refreshing doesn't lose items inside the pipeline.
2.  **Price Break Indicators**: In-cart wholesale item indicators automatically reflect MOQ thresholds. If the quantity drops below threshold bounds, warnings trigger to prevent invalid checkout submissions.
3.  **Government VAT Labeling**: To adhere strictly to Bangladesh digital trading guidelines, tax details express an explicit breakdown *(VAT 5% — value-added government tax)* to provide clear transparency.
