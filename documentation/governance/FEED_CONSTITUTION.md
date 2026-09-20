# PAIKARMART ECOSYSTEM — FEED ENGINE CONSTITUTION
*(Phase 4.3 - Feed Orchestration)*

This constitution governs the feed generation engine for Paikar Mart. To ensure maximum product and business visibility in a social-first marketplace, the feed follows a weighted hybrid prioritization model.

---

## 1. FEED ARCHITECTURE (HYBRID WEIGHTED PRIORITIZATION)

The feed engine aggregates contents from multiple sources and applies dynamic weightings.

*   **Content Sources**:
    *   `FOLLOWED_BUSINESSES`: Posts from businesses the user follows.
    *   `FOLLOWED_CATEGORIES`: High-interest product launches based on category follows.
    *   `PLATFORM_PROMOTIONS`: Sponsored B2B wholesale campaigns or premium PK Store arrivals.
    *   `ALGORITHM_DISCOVERY`: Predicted interest graph (future `ALOOP_AI` integration).

---

## 2. THE PROJECTION LAYER (FeedItem)

A strict separation between Write/Storage models (`ContentItem`) and Read models (`FeedItem`) is maintained.
*   **Write Model**: `ContentItem` handles raw transactional integrity.
*   **Read Model**: `FeedItem` is projected on-the-fly, adding computed ranking scores and temporal weight variables.

---

## 3. WEIGHTING & RANKING FORMULA

The feed ranking engine sorts content items on-the-fly:

```
Score = (SourceWeight + EngagementScore + RankBoost) / (HoursSinceCreated + 2)^1.5
```

Where:
*   `SourceWeight`:
    *   Baseline: `50`
    *   Followed user / merchant: `+200`
    *   Followed category: `+100`
*   `EngagementScore`: `(likes * 5) + (comments * 10)`
*   `RankBoost`: Promoted Content (e.g., paid wholesale bids): `+500`
*   `Decay`: Power decay `(HoursSinceCreated + 2)^1.5` prevents stale content from crowding out fresh updates.

---

## 4. FEED SECURITY & VISIBILITY GUARDS

Strict visibility layers are executed post-query and pre-projection:
*   `PUBLIC`: Accessible by all guests and logged-in accounts.
*   `FOLLOWERS_ONLY`: Filtered out completely unless the requesting user possesses an active `FollowRelationship` tracking the content author.
*   `PRIVATE`: Strictly restricted; only visible when the requesting user is the original creator.

---

## 5. DYNAMIC PAGINATION
Cursor-based pagination is implemented using raw database identifiers. Under/over-fetching is tuned dynamically at the database query boundaries to maintain lightning-fast response cycles.
