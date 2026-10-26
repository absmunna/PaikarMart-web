# PAIKARMART ECOSYSTEM — EVENT CONSTITUTION
*(Phase 3.9 - Event-Driven Architecture)*

This constitution defines the event-driven backbone of the Paikar Mart super app. To maintain strict decoupling, all business modules must communicate exclusively via the Event Bus, avoiding direct inter-module calls.

---

## 1. EVENT BUS ARCHITECTURE

We adopt an Event-First design pattern. A central `EventBus` manages publishing and subscribing to platform-wide events.

```text
  [ Producer Module ] ----(Emit)----> [ Event Bus (Redis/DB) ]
                                            |
                                            v
                                  [ Notification Processor ]
                                            |
                         +------------------+------------------+
                         |                  |                  |
                         v                  v                  v
                 [ In-App Alert ]    [ Push Service ]   [ SMS/Email ]
```

---

## 2. EVENT TYPES & REGISTRY

Every event MUST adhere to the `IPlatformEvent` interface defined in the API Constitution.

### Category: Commerce
*   `ORDER_CREATED`: Order placed.
*   `ORDER_PAID`: Payment authorized.
*   `ORDER_CANCELLED`: Order status changed to cancelled.

### Category: Payment
*   `PAYMENT_SUCCESS`: Provider callback verified.
*   `PAYMENT_FAILED`: Callback failure triggered.
*   `ESCROW_LOCKED`: Escrow funds held.
*   `ESCROW_RELEASED`: Escrow funds released to vendor.

---

## 3. NOTIFICATION ENGINE

The Notification Engine subscribes to the Event Bus and dispatches according to user preferences.

### Notification Preferences Model
*   `PUSH`: Enabled/Disabled per event type.
*   `SMS`: Enabled/Disabled per event type.
*   `EMAIL`: Enabled/Disabled per event type.

---

## 4. DESIGN PATTERNS

### A. Idempotency
Every `IPlatformEvent` must contain a unique `eventId` (`UUID`). Event handlers must check if this `eventId` has been processed before taking action.

### B. Retry & Failure Recovery
*   Handlers that fail (e.g., failed SMS gateway) attempt a back-off retry with a max of 3 attempts.
*   If all retries fail, events are pushed to a `DEAD_LETTER_QUEUE` table in the database for manual investigation.
