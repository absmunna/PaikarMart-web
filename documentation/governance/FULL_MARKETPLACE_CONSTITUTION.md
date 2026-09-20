# PAIKARMART — FULL MARKETPLACE CORE CONSTITUTION
*(Phase 5.1 - Marketplace Core System)*

This constitution governs the complete marketplace backend infrastructure. It ensures that marketplace actions (orders, products, inventory) are securely integrated with the Social Commerce Engine via asynchronous Event Bus signals.

---

## 1. MARKETPLACE ARCHITECTURE (ISOLATED CORE)

The Marketplace subsystem is built as a highly decoupled, state-driven set of services. It operates exclusively on pre-defined marketplace models (`Product`, `Order`, `Inventory`), ensuring the social and feed layers remain independent of transactional details.

---

## 2. KEY MODULES & RESPONSIBILITIES

### A. Product Lifecycle System
*   **Operations**: Creation, Update, Activation/Deactivation.
*   **Event Hooks**: Emits `PRODUCT_CREATED`, `PRODUCT_UPDATED` to alert the Social/Search layers for index reconciliation.

### B. Seller Business Engine
*   **Storefronts**: Manages business profile state and identity verification.
*   **Analytics**: Tracks seller product performance segregated from public social virality analytics.

### C. Unified Inventory System
*   **Tracking**: Centralized stock ledger monitoring SKU-level availability.
*   **Integrity**: Prevents over-selling with atomic database lock transactions.

---

## 3. INTEGRATION EVENTS (BUS-ONLY COMMUNICATION)

Communication back to the Social/Virality layers is strictly conducted via the Event Bus:

| Event Name | Emit Conditions | Social Layer Impact |
| :--- | :--- | :--- |
| `PRODUCT_ADDED` | New inventory available. | Triggers potential promotional Feed entry creation. |
| `ORDER_CONFIRMED` | Sale finalized. | Increases engagement velocity for Virality Engine. |
| `ORDER_SHIPPED` | Logistic state transition. | Triggers "On its way" social notification. |
| `ORDER_DELIVERED` | Fulfillment. | Triggers merchant review request interaction. |

---

## 4. ARCHITECTURAL BOUNDARIES
*   **NO Social Dependencies**: Marketplace controllers MUST treat the Social Layer as an event subscriber.
*   **Polymorphic Actions**: Any transactional action MUST pass an `event` context payload to ensure downstream social analytics correctly attribute conversion signals to referring `ContentItem` handles.
