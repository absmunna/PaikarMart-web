# PAIKARMART ECOSYSTEM — API GATEWAY & SECURITY CONSTITUTION
*(new add - Version 1.0)*

This constitution governs all backend routing design patterns, security frameworks, authorization policies, rate-limiting rules, audit procedures, and event-driven notifications across the entire Paikar Mart Super App ecosystem. All current and future modules must fully adhere to these architectural laws to prevent API fragmentation and guarantee enterprise-grade durability.

---

## 1. DYNAMIC API ROUTE MATRIX (VERSIONED ROUTING SUITE)

To maintain absolute structure and prevent routing chaos, every endpoint in the Paikar Mart ecosystem must strictly follow the prefix `/api/v1/`. Plural nouns are enforced for resource-oriented RESTful resource interfaces.

```text
                                  +-------------------+
                                  |   API Gateway     |
                                  |   (Proxy/Check)   |
                                  +---------+---------+
                                            |
                         +------------------+------------------+
                         |                  |                  |
                         v                  v                  v
                 +-------+-------+  +-------+-------+  +-------+-------+
                 | /api/v1/auth  |  |/api/v1/orders |  | /api/v1/feed  |
                 +---------------+  +---------------+  +---------------+
```

### 🔐 1. Authentication Suite (`/api/v1/auth`)
*   `POST /api/v1/auth/register` : Client or merchant registration (validates role context).
*   `POST /api/v1/auth/login` : Phone/password credential matching. Returns short-lived access JWT + rotate refresh token.
*   `POST /api/v1/auth/refresh` : Generates dynamic new token session while invalidating the old refresh token.
*   `POST /api/v1/auth/otp/send` : Generates session-locked SMS OTP verification code.
*   `POST /api/v1/auth/otp/verify` : Authenticates physical phone number binding.
*   `POST /api/v1/auth/logout` : Revokes refresh tokens and updates user session tracking.

### 👥 2. User & Identity Profile Manager (`/api/v1/users`)
*   `GET /api/v1/users/me` : Retrieve contextual authenticated profile dashboard parameters.
*   `PATCH /api/v1/users/profile` : Updates specific safe profile parameters (name, avatar, default delivery address).
*   `GET /api/v1/users/notifications` : Pageable history log of personalized push, order, and social notifications.

### 🏢 3. Enterprise Business Verification Suite (`/api/v1/businesses`)
*   `POST /api/v1/businesses/apply` : Submits verification documents (Trade License, NID, geo-coordinates, shop name).
*   `GET /api/v1/businesses/profile/:id` : Public profile storefront mapping details.
*   `PATCH /api/v1/businesses/profile` : Vendor updates shop operational settings (hours, default shipping configurations).

### 📦 4. Multi-Vendor Commerce Catalog (`/api/v1/products`)
*   `GET /api/v1/products` : Filtered product catalog lookup (supports `category`, `portal`, `type`, `search` indexing).
*   `GET /api/v1/products/:id` : Detailed view query (including seller attributes, active feedback and reviews).
*   `POST /api/v1/products` : Installs a new merchant inventory item (**Seller Role Required**).
*   `PATCH /api/v1/products/:id` : Adjusts specific inventory points or pricing configurations.
*   `DELETE /api/v1/products/:id` : Involves standardized soft-deletion to preserve historic transaction metrics.

### 🛒 5. Transaction & Sourcing Gateway (`/api/v1/orders`)
*   `GET /api/v1/orders` : Buyer lookup of active/completed packages (grouped dynamically by vendor boundaries).
*   `GET /api/v1/orders/seller` : Seller dashboard orders pipeline filtered contextually (**Seller Role Required**).
*   `POST /api/v1/orders` : Process checkout. Groups basket items by seller bounds, validates MOQ, issues split orders.
*   `PATCH /api/v1/orders/:id/status` : Modifies physical order pipeline (validates strict state machine progression).

### 💳 6. Payment, Ledger & Escrow Core (`/api/v1/payments`)
*   `POST /api/v1/payments/initiate` : Prepares provider payloads, registers payment token matching.
*   `POST /api/v1/payments/verify` : Validates bKash/Nagad execution parameters via background platform triggers.
*   `POST /api/v1/payments/callback` : Secure MFS IPN webhook matching validator.
*   `GET /api/v1/payments/wallet` : Query active balance and chronologically structured audit log entries.

### 🛠️ 7. Dynamic Service Marketplace (`/api/v1/services`)
*   `GET /api/v1/services` : Query nearby specialized service listings spatially.
*   `POST /api/v1/services/request` : Creates a specialized work-order request directly with a nearby provider.
*   `PATCH /api/v1/services/request/:id/status` : Tracks physical implementation checkpoints.

### 📣 8. Social Portal Suite (`/api/v1/feed`)
*   `GET /api/v1/feed` : Unified social commerce algorithmic feed (merges posts, commercial reels, hot B2B sourcing briefs).
*   `POST /api/v1/feed/posts` : Creates post media entries with multi-vendor contextual product links.
*   `POST /api/v1/feed/posts/:id/comments` : Post thread conversation contributions.
*   `POST /api/v1/feed/posts/:id/like` : Interacts directly with specific feed points.

### 🚚 9. Intelligent Logistics & Fulfilment Module (`/api/v1/logistics`)
*   `POST /api/v1/logistics/shipments` : Prepares shipping labels, aggregates drop-off logistics metadata.
*   `GET /api/v1/logistics/tracking/:id` : Pulls precise movement milestones.

---

## 2. CLIENT & SERVER SESSION TRANSACTION RULES (JWT & ROTATION)

To achieve strict system decoupling and enterprise-scale robustness, tokens must utilize cryptographic asymmetric signatures (**RS256** standard) or fast, validated symmetric structures (**HS256** matching private hardware configurations).

```text
  [ Client ]               [ API Gateway ]                 [ Auth Database ]
      |                           |                                |
      | 1. POST /auth/login       |                                |
      +-------------------------->|                                |
      |                           | Verify passwords & roles       |
      |                           +------------------------------->|
      |                           |                                |
      | 2. Short JWT + Refresh    |                                |
      |<--------------------------+                                |
      |                           |                                |
```

### Core Token Constraints:
1.  **Access Token JWT (Bearer Structure)**:
    *   **Lifespan**: 15 minutes.
    *   **Contents**: `userId`, `roles[]`, `permissions[]`, `tenantId`, `deviceContext`.
    *   *Self-Contained Verification*: Routers verify access tokens *in-memory* without contacting the core DB to optimize performance.

2.  **Refresh Token (Opaque Rotation Strategy - 7 Days Lifespan)**:
    *   Stored securely inside httpOnly, secure, sameSite cookies.
    *   **Automatic Reuse Detection**: If a compromised refresh token is reused, the auth system immediately invalidates the entire session lineage, logging a high-priority security alert.

---

## 3. DECLARATIVE ROLE-BASED ACCESS CONTROL (RBAC) MIDDLEWARE

All protected routers consume unified authorization wrappers. Permissions are computed from the user's role mappings contextually.

```ts
import { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    roles: string[];
    permissions: string[];
  };
}

export const requirePermission = (requiredPermission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userPermissions = req.user?.permissions || [];
    
    if (!userPermissions.includes(requiredPermission)) {
      return res.status(403).json({
        error: "Forbidden",
        message: `Missing required scope: ${requiredPermission}`,
        timestamp: new Date().toISOString()
      });
    }
    
    next();
  };
};
```

*Example Usage in product routes (`product.routes.ts`):*
```ts
router.post(
  "/products", 
  requirePermission("CAN_PUBLISH_PRODUCTS"), 
  addProduct
);
```

---

## 4. MULTI-TIER PLATFORM RATE-LIMITING CONFIGURATIONS

Using Redis-backed token buckets, requests are checked directly at the edge to mitigate malicious brute force operations, DDoS attempts, and scraper saturation.

| Dynamic Rate Tier | Limit Bounds | Window | Target Paths |
| :--- | :--- | :--- | :--- |
| **Identity Core (Auth)** | 5 requests | 1 minute | `/api/v1/auth/login`, `/api/v1/auth/otp/*` |
| **Dynamic Write Core** | 30 requests | 1 minute | `POST /api/v1/orders`, `POST /api/v1/feed/*` |
| **Catalog Browsing** | 120 requests | 1 minute | `GET /api/v1/products`, `GET /api/v1/feed` |
| **Universal Limit** | 60 requests | 1 minute | Default rules fallback across all other routes |

---

## 5. REUSABLE SCHEMATIC VALIDATION LAYERS

To keep database lines sanitized and prevent injection attacks, all payload states are evaluated using **Zod** schema interfaces before they reach controller layers.

```ts
import { z } from "zod";

export const CreateOrderSchema = z.object({
  deliveryAddress: z.string().min(10, "Minimum address validation fails"),
  deliveryDistrict: z.string().min(3, "District is mandatory"),
  paymentMethod: z.enum(["cod", "bkash", "nagad", "wallet"]),
  termsAccepted: z.boolean().refine(val => val === true, "Must accept e-commerce platform terms"),
  items: z.array(z.object({
    productId: z.string().uuid("Invalid physical product reference"),
    qty: z.number().int().min(1, "Minimum quantity order bound violation")
  })).min(1, "Sourcing basket must contain elements")
});
```

---

## 6. TRANSACTION AUDITING & WEBHOOK SECURITY

1.  **Idempotency Locks**:
    *   Mutating endpoints must accept a unique `X-Idempotency-Key` header.
    *   Saves response results in standard cache (Redis, 24 hr TTL). Subsequent requests instantly replay the cached results, ensuring safe transmission loops.
2.  **IPN Webhook Validation Architecture**:
    *   All external incoming webhooks (bKash, Nagad, SSL Commerz) must undergo strict payload signature checking.
    *   Verify merchant secrets, replay windows, and origin-authenticated server IP ranges to block fraudulent balance triggers.

---

## 7. EVENT-DRIVEN NOTIFICATION DISPATCH BUS

To decouple operational services, dynamic workflows trigger events via a unified platform Event Bus (utilizing Redis Pub/Sub, RabbitMQ, or database queue buffers).

```text
  [ Order Module ] ---> (Event: ORDER_PENDING) ---> [ Gateway Event Bus ]
                                                            |
                       +------------------------------------+------------------------------------+
                       v                                    v                                    v
            [ In-App Alert dispatch ]             [ Push Service ]                     [ SMS Gateway ]
```

```ts
export interface IPlatformEvent {
  eventId: string;
  topic: 'order' | 'billing' | 'social' | 'system';
  name: string;
  recipientId: string;
  payload: Record<string, any>;
  timestamp: string;
}

export const emitPlatformEvent = async (event: IPlatformEvent) => {
  // Dispatches events reliably across asynchronous notification listeners
  console.log(`[Event Bus Emit] Topic: ${event.topic} | Name: ${event.name}`);
};
```

This clean integration pattern guarantees that adding complex modules like **Logistics** or **Service Marketplace** does not require hardcoding custom SMS or push logic directly within order calculators.
