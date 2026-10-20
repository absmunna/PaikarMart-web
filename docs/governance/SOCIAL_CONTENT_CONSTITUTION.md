# PAIKARMART ECOSYSTEM — SOCIAL CONTENT CONSTITUTION
*(Phase 4.2 - Social Content Core Layer)*

This constitution governs the unified content abstraction layer for Paikar Mart. It defines how different content types (Product releases, Business Announcements, Local Services, Offers) are integrated into a single polymorphic entity called `ContentItem`.

---

## 1. POLYMORPHIC CONTENT MODEL
We enforce a one-table strategy using a unified `ContentItem` model. All high-level items in the feed are represented as a `ContentItem` rather than spawning fragmented database tables.

```text
                           +----------------------+
                           |     ContentItem      |
                           +----------+-----------+
                                      |
         +-----------------+----------+----------+-----------------+
         |                 |                     |                 |
         v                 v                     v                 v
    [ PRODUCT ]       [ BUSINESS ]           [ SERVICE ]       [ ANNOUNCEMENT ]
```

### Supported Content Types (Discriminators):
1. **PRODUCT**: Associated with standard storefront listings, B2B updates, or direct wholesale packages.
2. **BUSINESS**: General updates, factory logs, operational changes, or trade certifications from verified sellers.
3. **SERVICE**: Location-based helper slots, technical services, or contract milestones.
4. **ANNOUNCEMENT**: Platform level broadcasts or flash wholesale notifications.
5. **OFFER**: Discount campaigns, coupons, or temporary package deals.

---

## 2. POLYMORPHIC METADATA
To support type-specific attributes without violating normalization:
* Each `ContentItem` contains a standard `metadata` JSON column.
* Type-specific schemas (e.g., product link reference, discount percentages, geo-coordinates) are stored nested inside this `metadata` property.

---

## 3. EVENT LOGGING & REACTIVE ACTIONS
Every action on `ContentItem` (creation, soft-delete, promote) MUST publish an event to the Event Bus:
* `CONTENT_CREATED`: Triggers feed-algorithm indexation.
* `CONTENT_REMOVED`: Triggers immediate cache invalidation.
* `CONTENT_PROMOTED`: Temporarily boosts weighting scores.
