# PAIKARMART ECOSYSTEM — MARKETPLACE INTEGRATION CONSTITUTION
*(Phase 5.0 - Marketplace Integration Core)*

This constitution defines how social content (Feed/Content/Virality) bridges to transaction-led marketplace actions (Orders, Cart, Services). It ensures that viral social interaction can transition seamlessly into verified purchases.

---

## 1. MARKETPLACE BRIDGE LAYER

We utilize the `ContentItem.metadata` JSON schema to maintain link interoperability without bloating static database structures.

*   **COMMERCE_TYPE_MAP**:
    *   `PRODUCT`: Links to `Product` via `metadata.resourceId`.
    *   `SERVICE`: Links to `Service` via `metadata.resourceId`.
    *   `BUSINESS`: Links to `SellerProfile` via `metadata.resourceId`.

## 2. COMMERCE ACTION PIPELINE

Bridging actions MUST trigger the state machine from content context to checkout:

1.  **Intent Detection**: Frontend detects interaction with a product-linked `ContentItem`.
2.  **Commerce Hook**: The Bridge Controller validates commerce resource existence.
3.  **Action Initiation**: Cart/Order initialization is triggered via existing commerce modules (`/api/v1/cart`, `/api/v1/order`).

## 3. EVENT-DRIVEN TRANSACTION FLOW

The bridge relies on the central Event Bus to broadcast transaction state changes back to the Social Layer:

| Event Name | Emit Conditions | Social Layer Impact |
| :--- | :--- | :--- |
| `ORDER_CREATED` | Marketplace order initialized from content context. | Triggers conversion analytics update. |
| `ORDER_COMPLETED` | Successful transaction fulfillment. | Triggers merchant follow-up / review prompt. |

---

## 4. CONVERSION TRACKING

Every commerce bridge event (`ORDER_CREATED`) carries a `referrerContentId` payload. This allows Paikar Mart to:
*   Attribute sales to specific viral posts.
*   Feed back conversation performance into the `ViralityIndex` system as a premium conversion signal.
