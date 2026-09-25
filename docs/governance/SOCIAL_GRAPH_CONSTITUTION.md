# PAIKARMART ECOSYSTEM — SOCIAL GRAPH CONSTITUTION
*(Phase 4.1 - Polymorphic Graph Architecture)*

This constitution governs the unified social graph of Paikar Mart. To ensure maximum flexibility for feed algorithms and discovery, all relationships are managed via a single generic graph structure.

---

## 1. POLYMORPHIC GRAPH PHILOSOPHY
We employ a unified `FollowRelationship` model. Instead of creating distinct tables for User-User, User-Business, or User-Category follows, we use a single structure with a discriminator (`targetType`).

| Source (Follower) | Target (Followed) | Target Type |
| :--- | :--- | :--- |
| User | User | `USER` |
| User | Business | `BUSINESS` |
| User | Category | `CATEGORY` |

---

## 2. SCHEMA INTEGRITY
The `FollowRelationship` table employs a composite unique index on `(followerId, targetId, targetType)` to prevent redundant follow operations and ensures idempotent operations at the DB level.

## 3. EVENT-DRIVEN SOCIAL
Every successful `follow` operation MUST emit a `FOLLOW_CREATED` event to the `PlatformEventBus`, triggering downstream notifications (e.g., "User X started following your business") and recommendation graph updates.
