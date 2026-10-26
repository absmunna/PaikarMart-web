# PAIKARMART MASTER GLOBAL CONSTITUTION — PHASE 2: COMMERCE CORE

This document outlines the architectural specifications and development guidelines for Phase 2 (Commerce Core) of the PaikarMart Super Ecosystem.

---

## 🎯 PHASE 2 OBJECTIVE

Build and scale a resilient, multi-role, business-centric commerce engine that supports:
1. **Product Marketplace**: Retail and Wholesale listings, unified pricing structures, MOQ thresholds, and live inventory control.
2. **Business Storefronts**: Seller, Factory, and Shop catalogs mapped strictly to business profiles (never directly to individual users).
3. **Ecosystem Cart**: Multi-vendor partitioned shopping carts with automatic group-by-merchant mechanics.
4. **Ecosystem Order Pipeline**: Multi-vendor split routing with independent state lifecycles.
5. **Double-entry Review System**: Multi-layered ratings and comments for products and business listings.

---

## ❌ STRICT BOUNDARIES (DO NOT BREAK)

- **Rule 1: No Service / Logistics / Export modules yet** (Commerce Core exclusive).
- **Rule 2: Multi-Role Session Compatibility**: No hardcoding customer-only or seller-only constraints. Every component, schema parameter, and API handler must assume a user accounts registry with potential overlapping roles.
- **Rule 3: Unified Product Paradigm**: A single product entry must seamlessly handle both retail prices and wholesale tier pricing + MOQs.
- **Rule 4: Multi-Tenant Ledger Compatibility**: Financial state changes must record order triggers as ledger events to pave the way smoothly for Phase 3 (Payment + Escrow System).

---

## 📊 DATA & ENTITY SCHEMAS

### Product Entity
- `id` (String UUID)
- `businessId` (String UUID -> references `BusinessProfile`)
- `name` (String)
- `description` (String)
- `images` (String[])
- `retailPrice` (Decimal)
- `wholesalePrice` (Decimal, Optional)
- `moq` (Int, Default 1)
- `stock` (Int)
- `categoryId` (String UUID)
- `status` (Enum: DRAFT, ACTIVE, ARCHIVED)

### Order Entity
- `id` (String UUID)
- `buyerId` (String UUID -> references `User`)
- `businessId` (String UUID -> references `BusinessProfile`)
- `items` (Json Array of snapshot entries including product details, unit price, quantity)
- `totalAmount` (Decimal)
- `status` (Enum: CREATED, PENDING_PAYMENT, PAID, PROCESSING, COMPLETED, CANCELLED)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

---

## 🔌 PHASE 2 CORNERSTONE API HANDLERS

### Products `/api/v1/products`
- `GET /` — List products (with optional multi-faceted search filter queries)
- `GET /:id` — Detailed individual product specs
- `POST /` — Add new product (Requires active Business Profile ownership verify)
- `PATCH /:id` — Target update fields (requires authorization)
- `DELETE /:id` — Safe archiving delete triggers

### Orders `/api/v1/orders`
- `POST /` — Create multi-vendor separated sub-orders
- `GET /` — Fetch authenticated user order histories (Buyer/Seller dashboards)
- `GET /:id` — Retrieve localized tracking snapshots

### Cart `/api/v1/cart`
- `POST /add` — Add to device or account-synchronized local state bucket
- `GET /` — Fetch parsed totals with merchant splitting checks
- `DELETE /item` — Clear products references

---
*Maintained under strict instruction by the PaikarMart System Architect Agent.*
