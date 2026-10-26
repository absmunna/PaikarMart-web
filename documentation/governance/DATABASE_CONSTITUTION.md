# PAIKARMART ECOSYSTEM — DATABASE CONSTITUTION & DEEPLY OPTIMIZED PHYSICAL SCHEMA
*(new add - Version 1.0)*

This constitution defines the absolute, production-ready, standardized PostgreSQL database structure of the Paikar Mart multi-vendor social commerce super app. It ensures maximum compliance with high-performance B2B transactions, secure financial auditability, future-proof microservices decoupling patterns, dynamic social media engagement scaling (feed/chat), and logistics partitioning.

---

## 1. ER DIAGRAM STRUCTURE (LOGICAL MODULE NODES)

```text
                                  +-------------------+
                                  |    Role system    |
                                  +---------+---------+
                                            |
                                            | 1:N
                                            v
  +------------------+  1:1       +---------+---------+        1:1       +------------------+
  | Business Profile <------------+       Users       +------------------>   User Wallet    |
  +--------+---------+            +----+----+----+----+                  +--------+---------+
           |                           |    |    |                                |
           | 1:N                       |    |    | 1:N                            | 1:N
           v                           |    |    v                                v
  +--------+---------+                 |    | +--+---------------+       +--------+---------+
  |     Products     |                 |    | |  Feed Posts      |       |  Wallet Ledger   |
  +--------+---------+                 |    | +--+----+----------+       +------------------+
           |                           |    |         | 1:N
           | 1:N                       |    |         v
           v                           |    | +-------+-----------+
  +--------+---------+                 |    | | Comments/Reactions|
  |   Order Items    |                 |    | +-------------------+
  +--------+---------+                 |    |
           ^                           |    | 1:N (Sender/Receiver)
           | 1:N                       |    v
  +--------+---------+  1:1            |  +-+-----------------+
  |      Orders      +-----------------+  |    Direct Messages|
  +--------+---------+                    +-------------------+
           |
           | 1:1
           v
  +--------+---------+  1:1       +-------------------+
  |  Escrow Hold     <------------+    Transactions   |
  +------------------+            +-------------------+
```

---

## 2. COMPREHENSIVE PHYSICAL TABLE REGISTRY

All primary keys use cryptographically sound high-entropy **UUIDv4** types to guarantee zero sequential enumeration attacks and seamless cross-partition offline creation. Every table supports soft-deletion models (`deleted_at`) and audit stamps to guarantee strict immutability traces.

### MODULE A: CORE AUTH & IDENTITY SUITE

#### 1. `users`
Represents the primary authenticated identity records. Supports buyers, sellers, admins, and support operators.
*   `id`: `UUID` (Primary Key, Defaults to `gen_random_uuid()`)
*   `phone`: `VARCHAR(16)` (Unique, Indexed, Bangladesh local format e.g. `+88017...`)
*   `email`: `VARCHAR(255)` (Unique, Nullable, Case-insensitive verification)
*   `full_name`: `VARCHAR(128)` (Not Null)
*   `password_hash`: `VARCHAR(255)` (Not Null, Argon2id storage representation)
*   `avatar_url`: `TEXT` (Nullable)
*   `status`: `VARCHAR(32)` (Default `'active'`. Values: `'active'`, `'suspended'`, `'pending_verification'`)
*   `is_verified`: `BOOLEAN` (Default `false`)
*   `created_at`: `TIMESTAMPTZ` (Default `NOW()`)
*   `updated_at`: `TIMESTAMPTZ` (Default `NOW()`)
*   `deleted_at`: `TIMESTAMPTZ` (Nullable, Soft deletion marker)

#### 2. `roles`
System-defined custom security scopes.
*   `id`: `UUID` (Primary Key)
*   `name`: `VARCHAR(64)` (Unique. e.g., `'buyer'`, `'seller'`, `'admin'`, `'nearby_shop'`, `'service_provider'`)
*   `description`: `TEXT`
*   `created_at`: `TIMESTAMPTZ` (Default `NOW()`)

#### 3. `user_role_relations`
*   `user_id`: `UUID` (Foreign Key -> `users(id)`, Cascade On Delete)
*   `role_id`: `UUID` (Foreign Key -> `roles(id)`, Cascade On Delete)
*   *Composite Primary Key*: `(user_id, role_id)`

#### 4. `business_profiles`
Critical for verified Wholesale Merchants, Retail Storefronts, and Local Nearby Shops.
*   `id`: `UUID` (Primary Key)
*   `user_id`: `UUID` (Unique, Foreign Key -> `users(id)`, Cascade On Delete)
*   `shop_name`: `VARCHAR(255)` (Not Null)
*   `trade_license_no`: `VARCHAR(128)` (Unique, Nullable)
*   `trade_license_url`: `TEXT` (Nullable, S3 File Pointer)
*   `nid_no`: `VARCHAR(64)` (Unique, Nullable)
*   `nid_front_url`: `TEXT` (Nullable)
*   `nid_back_url`: `TEXT` (Nullable)
*   `division`: `VARCHAR(64)` (Not Null)
*   `district`: `VARCHAR(64)` (Not Null)
*   `upazila`: `VARCHAR(64)` (Not Null)
*   `coordinates`: `GEOMETRY(Point, 4326)` (Spatially indexed using PostGIS for physical location matching)
*   `verification_tier`: `VARCHAR(32)` (Default `'bronze'`. Values: `'bronze'`, `'silver_pro'`, `'gold_platinum'`)
*   `created_at`: `TIMESTAMPTZ` (Default `NOW()`)
*   `updated_at`: `TIMESTAMPTZ` (Default `NOW()`)

---

### MODULE B: COMMERCE & SOURCING PLATFORM

#### 5. `categories`
Hierarchical catalog nodes matching dynamic physical markets.
*   `id`: `UUID` (Primary Key)
*   `parent_id`: `UUID` (Nullable, Foreign Key -> `categories(id)`)
*   `name_bn`: `VARCHAR(128)` (Not Null)
*   `name_en`: `VARCHAR(128)` (Not Null)
*   `slug`: `VARCHAR(128)` (Unique, Indexed)
*   `icon_url`: `TEXT`

#### 6. `products`
*   `id`: `UUID` (Primary Key)
*   `seller_id`: `UUID` (Foreign Key -> `users(id)`, Cascade Restrict)
*   `category_id`: `UUID` (Foreign Key -> `categories(id)`, Restrict)
*   `title_bn`: `VARCHAR(255)` (Not Null)
*   `title_en`: `VARCHAR(255)` (Not Null)
*   `description_bn`: `TEXT` (Nullable)
*   `description_en`: `TEXT` (Nullable)
*   `price`: `NUMERIC(12, 2)` (Not Null, Wholesale or Retail unit target representation)
*   `original_price`: `NUMERIC(12, 2)` (Nullable, Stems discount calculations)
*   `stock`: `INTEGER` (Default `0`)
*   `min_order_qty`: `INTEGER` (Default `1`, Critical for B2B MOQ checks)
*   `unit`: `VARCHAR(32)` (Default `'pcs'`. e.g. `'kg'`, `'carton'`, `'lot'`)
*   `is_active`: `BOOLEAN` (Default `true`)
*   `is_pk_store`: `BOOLEAN` (Default `false`, Flag for premium items)
*   `type`: `VARCHAR(32)` (Default `'retail'`. Values: `'retail'`, `'wholesale'`, `'digital'`)
*   `images`: `JSONB` (Array of secure CDN image links)
*   `rating_avg`: `NUMERIC(3, 2)` (Default `0.00`)
*   `reviews_count`: `INTEGER` (Default `0`)
*   `created_at`: `TIMESTAMPTZ` (Default `NOW()`)
*   `updated_at`: `TIMESTAMPTZ` (Default `NOW()`)
*   `deleted_at`: `TIMESTAMPTZ` (Nullable)

#### 7. `orders`
*   `id`: `UUID` (Primary Key)
*   `order_no`: `VARCHAR(64)` (Unique, Highly readable, Indexed e.g., `PM-2026-X7281A`)
*   `buyer_id`: `UUID` (Foreign Key -> `users(id)`, Restrict)
*   `seller_id`: `UUID` (Foreign Key -> `users(id)`, Restrict)
*   `subtotal`: `NUMERIC(12, 2)` (Not Null)
*   `vat_amount`: `NUMERIC(12, 2)` (Default `0.00`)
*   `shipping_fee`: `NUMERIC(12, 2)` (Default `0.00`)
*   `total`: `NUMERIC(12, 2)` (Not Null)
*   `status`: `VARCHAR(32)` (Default `'pending'`. Values: `'pending'`, `'processing'`, `'shipped'`, `'delivered'`, `'cancelled'`)
*   `payment_status`: `VARCHAR(32)` (Default `'unpaid'`. Values: `'unpaid'`, `'authorized'`, `'holding_escrow'`, `'released'`, `'refund_triggered'`)
*   `payment_method`: `VARCHAR(32)` (Default `'cod'`. Values: `'bkash'`, `'nagad'`, `'wallet'`, `'bank_transfer'`, `'cod'`)
*   `delivery_address`: `TEXT` (Not Null)
*   `delivery_district`: `VARCHAR(64)` (Not Null)
*   `notes`: `TEXT` (Nullable)
*   `created_at`: `TIMESTAMPTZ` (Default `NOW()`)
*   `updated_at`: `TIMESTAMPTZ` (Default `NOW()`)

#### 8. `order_items`
*   `id`: `UUID` (Primary Key)
*   `order_id`: `UUID` (Foreign Key -> `orders(id)`, On Delete Cascade)
*   `product_id`: `UUID` (Foreign Key -> `products(id)`, On Delete Restrict)
*   `title`: `VARCHAR(255)` (Snapshot at creation)
*   `price`: `NUMERIC(12, 2)` (Snapshot at creation)
*   `qty`: `INTEGER` (Not Null)

---

### MODULE C: FINTECH, ESCROW & WALLET SYSTEM

#### 9. `wallets`
*   `id`: `UUID` (Primary Key)
*   `owner_id`: `UUID` (Unique, Foreign Key -> `users(id)`, Restrict)
*   `balance`: `NUMERIC(14, 2)` (Default `0.00`, Supports dynamic double-entry consistency safeguards)
*   `currency`: `VARCHAR(8)` (Default `'BDT'`)
*   `updated_at`: `TIMESTAMPTZ` (Default `NOW()`)

#### 10. `wallet_ledgers`
Maintains triple-entry auditable ledger state integrity. Absolutely immutable.
*   `id`: `UUID` (Primary Key)
*   `wallet_id`: `UUID` (Foreign Key -> `wallets(id)`, Restrict)
*   `type`: `VARCHAR(16)` (Values: `'credit'`, `'debit'`)
*   `amount`: `NUMERIC(12, 2)` (Not Null)
*   `prev_balance`: `NUMERIC(14, 2)` (Not Null, Double check audit consistency)
*   `new_balance`: `NUMERIC(14, 2)` (Not Null)
*   `reference`: `VARCHAR(128)` (e.g., `'order_payout_PM-1748'`, `'cash_in_bkash'`)
*   `created_at`: `TIMESTAMPTZ` (Default `NOW()`)

#### 11. `transactions`
External payment tracing database matrix.
*   `id`: `UUID` (Primary Key)
*   `user_id`: `UUID` (Foreign Key -> `users(id)`, Restrict)
*   `order_id`: `UUID` (Nullable, Foreign Key -> `orders(id)`, Restrict)
*   `amount`: `NUMERIC(12, 2)` (Not Null)
*   `status`: `VARCHAR(32)` (Values: `'pending'`, `'success'`, `'failed'`)
*   `gateway`: `VARCHAR(64)` (e.g. `'bkash'`, `'nagad'`, `'sslcommerz'`)
*   `gateway_txn_id`: `VARCHAR(128)` (Unique, Indexed)
*   `ipn_raw`: `JSONB` (Stores raw provider verification callbacks)
*   `created_at`: `TIMESTAMPTZ` (Default `NOW()`)

#### 12. `escrows`
Strict physical proof escrow locks.
*   `id`: `UUID` (Primary Key)
*   `order_id`: `UUID` (Unique, Foreign Key -> `orders(id)`, Restrict)
*   `amount`: `NUMERIC(12, 2)` (Not Null)
*   `status`: `VARCHAR(32)` (Default `'held'`. Values: `'held'`, `'released'`, `'refunded'`)
*   `release_conditions`: `JSONB` (Proof flags e.g. `{"approved_by_buyer": true, "gps_match": true}`)
*   `release_at`: `TIMESTAMPTZ` (Nullable)
*   `created_at`: `TIMESTAMPTZ` (Default `NOW()`)
*   `updated_at`: `TIMESTAMPTZ` (Default `NOW()`)

---

### MODULE D: SOCIAL PORTAL SUITE (FEED, CHAT, NOTIFICATION)

#### 13. `posts`
*   `id`: `UUID` (Primary Key)
*   `author_id`: `UUID` (Foreign Key -> `users(id)`, Cascade)
*   `content`: `TEXT` (Nullable)
*   `media_urls`: `JSONB` (Array of images or reels link pointers)
*   `likes_count`: `INTEGER` (Default `0`)
*   `comments_count`: `INTEGER` (Default `0`)
*   `created_at`: `TIMESTAMPTZ` (Default `NOW()`)
*   `deleted_at`: `TIMESTAMPTZ` (Nullable)

#### 14. `comments`
*   `id`: `UUID` (Primary Key)
*   `post_id`: `UUID` (Foreign Key -> `posts(id)`, On Delete Cascade)
*   `user_id`: `UUID` (Foreign Key -> `users(id)`, On Delete Cascade)
*   `body`: `TEXT` (Not Null)
*   `created_at`: `TIMESTAMPTZ` (Default `NOW()`)

#### 15. `post_likes`
*   `post_id`: `UUID` (Foreign Key -> `posts(id)`, On Delete Cascade)
*   `user_id`: `UUID` (Foreign Key -> `users(id)`, On Delete Cascade)
*   *Composite Primary Key*: `(post_id, user_id)`

#### 16. `user_followers`
*   `follower_id`: `UUID` (Foreign Key -> `users(id)`, On Delete Cascade)
*   `following_id`: `UUID` (Foreign Key -> `users(id)`, On Delete Cascade)
*   *Composite Primary Key*: `(follower_id, following_id)`

#### 17. `messages`
*   `id`: `UUID` (Primary Key)
*   `sender_id`: `UUID` (Foreign Key -> `users(id)`, Restrict)
*   `recipient_id`: `UUID` (Foreign Key -> `users(id)`, Restrict)
*   `chat_room_id`: `VARCHAR(128)` (Indexed. e.g. `'roomId-user1-user2'`)
*   `content`: `TEXT` (Not Null)
*   `is_read`: `BOOLEAN` (Default `false`)
*   `created_at`: `TIMESTAMPTZ` (Default `NOW()`)

#### 18. `notifications`
*   `id`: `UUID` (Primary Key)
*   `user_id`: `UUID` (Foreign Key -> `users(id)`, On Delete Cascade)
*   `type`: `VARCHAR(64)` (e.g., `'order'`, `'chat'`, `'system'`, `'wallet'`)
*   `title`: `VARCHAR(255)` (Not Null)
*   `body`: `TEXT` (Not Null)
*   `is_read`: `BOOLEAN` (Default `false`)
*   `created_at`: `TIMESTAMPTZ` (Default `NOW()`)

---

## 3. RELATIONSHIPS & CASCADE CONSTRAINTS

To maintain database consistency and ensure safe transaction rules, we employ the **Strict Preservation of History** design pattern:
*   `users` to `wallets` / `orders` / `escroas`: **ON DELETE RESTRICT**. An account with business traces, pending escrow balances, or order payouts must never be completely hard-deleted.
*   `orders` to `order_items`: **ON DELETE CASCADE**. If an entire order collection is purged inside pre-auth or dev fallback phases, clean downstream lines immediately.
*   `posts` to `comments` / `likes`: **ON DELETE CASCADE**. Social metadata correlates strictly to the thread root's state.

---

## 4. DEEP INDEX STRATEGY

```sql
-- 1. High Velocity Search on Products and Case-insensitive Matching
CREATE INDEX idx_products_title_trgm ON products USING gin (title_en gin_trgm_ops, title_bn gin_trgm_ops);

-- 2. Geospatial Spatial Queries for Nearby Shop Matching (Bangladeshi local store discovery)
CREATE INDEX idx_business_profiles_location ON business_profiles USING gist (coordinates);

-- 3. Composite Indexes for Instant Direct Messaging Routing
CREATE INDEX idx_messages_room_created ON messages (chat_room_id, created_at DESC);

-- 4. Fast Retrieval of Unread Alerts Segmented by User
CREATE INDEX idx_notifications_unread_user ON notifications (user_id) WHERE is_read = false;

-- 5. Strict Unique Reference validation on IPN callbacks from MFS providers
CREATE UNIQUE INDEX idx_txn_gateway_unique ON transactions (gateway, gateway_txn_id);
```

---

## 5. PARTITIONING STRATEGY FOR LARGE SCALE DATASETS

As Paikar Mart targets high scaling rates (multi-million users and millions of monthly B2B purchase lines), high-throughput tables are physically partitioned to keep memory pressure minimal and index scopes lightning-fast.

### Partition Pattern: Range Partitioning by `created_at`
Applies to: **`orders`**, **`wallet_ledgers`**, **`transactions`**, **`messages`**, and **`notifications`**

```sql
-- Conceptual DDL of a Partitioned Orders Base Table
CREATE TABLE orders (
    id UUID NOT NULL,
    order_no VARCHAR(64) NOT NULL,
    buyer_id UUID NOT NULL,
    seller_id UUID NOT NULL,
    total NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Year-Month physical tables mapping partition pools
CREATE TABLE orders_2026_05 PARTITION OF orders
    FOR VALUES FROM ('2026-05-01 00:00:00+00') TO ('2026-06-01 00:00:00+00');
```

---

## 6. ENTERPRISE SCALING & REPLICATION SPECIFICATIONS

1.  **Read/Write Segregation (CQRS Ready)**:
    *   **Master Node**: Strictly serves write transactions, ledger computations, dynamic order initiation operations.
    *   **Replica Pool**: Continuous real-time read replication feeds elastic search parameters, consumer browsing catalogs, social posts streams, and merchant reviews analytics.
2.  **Highly Scalable Connection Pooling**:
    *   Integrates **PgBouncer** or **Supabase Supavisor** in `Transaction Mode` (max connections 5,000 to keep the microservice worker layer isolated from running out of pooled handles).
3.  **Auditing Rigidity**:
    *   DB level triggers mirror modifications to `wallets` and `escrows` directly onto `wallet_ledgers` to maintain a zero-compromise physical trail of Bangladeshi Taka transfers, fully complying with Bangladesh Bank and ICT Division e-commerce guidelines.
