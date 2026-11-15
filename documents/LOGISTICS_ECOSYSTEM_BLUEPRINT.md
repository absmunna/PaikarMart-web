# Logistics, Ride-Share, Courier & Order Lifecycle Ecosystem Blueprint

This blueprint defines the clean, non-hardcoded redesign of PaikarMart's Logistics Ecosystem—synthesizing the business logic planned in the ZIP archive (`commercial/logistics.allocation.service.ts`, `hyperlocal.engine.service.ts`, `logistics.service.ts`, `MASTER_PLAN.md`) into our clean **Feature-First Monorepo** without UI monoliths or fake client-side logic.

---

## 1. Legacy Problems Eliminated (ZIP Audit Findings)

| Legacy Mock Pattern (ZIP) | Clean Production Redesign (Target Blueprint) |
| :--- | :--- |
| Single 2,543-line `LogisticsHome.tsx` mixing Food, Ride, Truck, Rent, Emergency, Fleet & Wallet | **4 focused Sub-Portals** inside `portals/transit-logistics/` backed by shared `features/logistics/` |
| Hardcoded surge (`+25%`/`+35%`), multi-stop (`+40%`), and truck fares inside React components | Centralized **Backend Tariff & Quote Engine** (`POST /api/logistics/quote`) |
| Fake `OTP === '1234'` and browser `window.prompt()` dialogs | Server-generated OTP & **3-Step POD Verification** (`POST /api/logistics/shipments/:orderId/verify-pod`) |
| Duplicate Food/Grocery cart inside Logistics page | Hyperlocal **5km Geofence & ETA Engine** powering `Marketplace` / `Services` / `Orders` directly |
| Disconnected Ride vs Order vs Escrow states | Unified **Order ↔ ShipmentWaybill ↔ RiderAssignment ↔ Escrow** lifecycle |

---

## 2. Clean 4-Sub-Portal Architecture (`portals/transit-logistics`)

The Transit & Logistics Hub (`/portal/transit`) presents an app-style **Compact Mode Switcher** with 4 role-aware sub-views:

### Sub-Portal 1: Ride & Instant Fleet (`RideFleetView`)
* **Scope:** Instant Bike rides, Sedan/Car, Microbus XL, and 24/7 Emergency Ambulance.
* **User Flow:**
  1. Select saved address or GPS current coordinates + Drop-off point.
  2. Choose Passenger count or Emergency priority.
  3. System fetches `POST /api/logistics/quote` returning recommended vehicle class, distance (`km`), ETA (`min`), and itemized BDT (`৳`) fare.
  4. Dispatch nearest available online rider/driver (`POST /api/logistics/rides`) and enter live trip tracking mode.

### Sub-Portal 2: Courier, Parcel & Multi-Stop (`ParcelCourierView`)
* **Scope:** Doorstep Express Parcel, Same-Day Van, and Nationwide Courier (`PaikarForce`, `Steadfast`, `Pathao`, `RedX`).
* **Capabilities:**
  * Weight (`kg`) & package volume (`small` | `medium` | `large`) selector.
  * **Multi-Stop Routing:** Add up to 3 intermediate drop-offs (`A → B → C → D`).
  * **Now vs Scheduled / B2B Recurring:** Immediate dispatch or scheduled date/time slot (with configurable advance booking discount) plus Daily/Weekly recurring B2B delivery subscriptions.
  * Generates official **Waybill Tracking ID** (`TRK-PM-...`) and 4-digit **Delivery OTP**, synced directly into `Orders Hub`.

### Sub-Portal 3: B2B Cargo, Truck & Rentals (`CargoFreightView`)
* **Scope:** 1-Ton Pickup, 3–5 Ton Covered Truck for wholesale/factory pallets, plus Daily/Trip Vehicle Rentals (`Toyota Premio`, `Noah Microbus`, `Pickup`).
* **Cross-Portal Hook:** When a buyer checks out heavy MOQ cargo in `Wholesale Hub`, a quick action transfers route & tonnage directly into this booking sheet.

### Sub-Portal 4: Fleet & Rider Partner Console (`FleetPartnerConsole` — Role-Gated)
* **Scope:** Accessible to users with `rideshare_driver`, `vendor`, or `admin` capabilities.
* **Capabilities:**
  * **Online / Offline GPS Availability Toggle** (`PATCH /api/logistics/fleet/:vehicleId/availability`).
  * **Vehicle Registry:** Add/manage vehicles with Bangladesh plate format (`DHAKA-METRO-XX-XXXX`), capacity, and verification docs (NO `window.prompt()` — clean modal form).
  * **Active Assignment Queue & 3-Step POD Pad:** Capture delivery photo proof, collect recipient canvas signature, and verify recipient's 4-digit OTP against backend before closing delivery.
  * **Maintenance & Trip Earnings Ledger:** Fuel logs and completed trip payouts linked to Wallet.

---

## 3. Backend Rule, Geofence & Allocation Engine (`apps/backend/logistics/`)

All pricing, matching, and verification rules live strictly on the server:

### A. Distance & Hyperlocal Geofencing (`distanceEngine.ts`)
* **Haversine Formula:** Calculates exact great-circle distance (`km`) between `[lat1, lng1]` and `[lat2, lng2]`.
* **5km Store Geofencing (`POST /api/logistics/geofence-check`):**
  * Checks whether buyer coordinates fall within store `serviceRadiusKm`.
  * **Hyperlocal Fee Rule:** `Base ৳40 + (Math.max(0, distanceKm - 2) × ৳12)`.
  * **ETA Rule:** `store.prepMinutes + Math.max(5, Math.ceil(distanceKm × 3.5))` minutes.

### B. Config-Driven Quote Engine (`tariffConfig.ts` + `POST /api/logistics/quote`)
* Eliminates hardcoded React math. Server computes quote breakdown:
  * `baseFare` + `(distanceKm × perKmRate)` + `(extraWeightKg × perKgRate)`
  * `multiStopFee`: configurable multiplier per extra drop stop
  * `surgeMultiplier`: Weather (`rainy`) and Peak Traffic (`rush_hour`) modifiers controlled server-side
  * `scheduledDiscount`: Advance slot discount (e.g., 5%) when `dispatchType === 'scheduled'`

### C. Unified Order ↔ Shipment ↔ POD ↔ Escrow State Machine
1. **Order Created (`POST /api/orders`):**
   * Supports `X-Idempotency-Key` to prevent duplicate orders.
   * Auto-creates a `ShipmentWaybill` with unique `trackingId` and server-generated 4-digit `deliveryOtp`.
   * Holds buyer payment in `Escrow` (unless COD).
2. **Vendor Dispatch & Rider Allocation (`PATCH /api/orders/:id/status` & `/api/logistics/shipments/:orderId/assign-courier`):**
   * Status flows cleanly: `confirmed → preparing → in_transit → out_for_delivery → delivered` (or `return_requested → returned`).
   * Every status transition automatically appends a timestamped courier checkpoint.
3. **Proof of Delivery Verification (`POST /api/logistics/shipments/:orderId/verify-pod`):**
   * Validates recipient `otp` (+ optional `photoUrl` and `signatureDataUrl`).
   * Marks Shipment & Order as `delivered` and signals **Escrow Release** to vendor/rider wallets.
4. **Reverse Logistics (`POST /api/logistics/returns`):**
   * Allows buyers in `Orders Hub` to initiate damaged/wrong-item return pickup, creating a reverse waybill assigned to a courier partner.

---

## 4. Target Backend Endpoints Summary

* `POST /api/logistics/quote` — Live distance, ETA & itemized `৳` fare calculation
* `POST /api/logistics/geofence-check` — Hyperlocal store radius & delivery fee check
* `GET /api/logistics/vehicles/nearby` — Filter online vehicles by coordinates & mode
* `GET /api/logistics/rides` & `POST /api/logistics/rides` — Ride, freight & courier dispatch requests
* `GET /api/logistics/shipments` & `GET /api/logistics/shipments/:orderId` — Waybill & checkpoint tracking
* `POST /api/logistics/shipments/:orderId/assign-courier` — Assign `PaikarForce`/`Steadfast`/`Pathao`/`RedX` or local rider
* `POST /api/logistics/shipments/:orderId/checkpoint` — Append transit checkpoint
* `POST /api/logistics/shipments/:orderId/verify-pod` — Server-validated OTP + POD completion
* `POST /api/logistics/returns` — Reverse logistics return pickup ticket
* `GET/POST/PATCH /api/logistics/fleet` — Rider/Fleet partner vehicle registry & GPS online toggle
