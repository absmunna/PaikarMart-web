# PAIKARMART ECOSYSTEM — ENGAGEMENT CONSTITUTION
*(Phase 4.4 - Engagement Core System)*

This constitution governs user engagement features (reactions, nested commentary threading, sharing metadata, and customized bookmark saves) across Paikar Mart. It ensures clean, optimized, real-time-ready interactions without bloating standard transactional tables.

---

## 1. ENGAGEMENT ENTITY DICTIONARY

All user reactions and replies target the polymorphic `ContentItem` model defined in the Content Constitution.

### A. Reaction Hub
We adopt a single toggleable database footprint mapped via `ContentReaction`.
*   **Valid Types**: `LIKE` | `LOVE` | `WOW` | `SAVE`
*   **Toggle Behavior**: Clicking the identical reaction type soft-deletes the row (`deletedAt = now()`) to instantly preserve action histories. Clicking a different reaction type replaces the state item.

### B. Threaded Modular Commentary
We manage nested structures using a self-referencing relationship `parentCommentId` inside `ContentComment`.
*   **Thread Limit**: Highly recommended 2-level presentation layer depth constraint for viewport readability.
*   **Cascade Safeguards**: Soft-deletes of a parent comment gracefully cascade-hide replies without permanently deleting database relationships.

### C. Share & Bookmark Tracking
*   **Shares**: Tracked inside `ContentShare` highlighting internal/external platforms (WA, FB, COPY_LINK) to fuel trending indexes.
*   **Bookmarks**: Bookmarks are organized inside user collections (e.g. `Favorites`, `Wholesale Deals`, `Retail Watchlist`) via `ContentBookmark`.

---

## 2. EVENT SCHEMAS (PLATFORM EVENT BUS)

Every engagement event is dispatched to the central database logging system and Event Bus:

| Event Name | Emit Conditions | Algorithm Impact |
| :--- | :--- | :--- |
| `REACTION_ADDED` | A reaction (LIKE, LOVE, WOW) is added or restored. | Medium weight boost inside feed rankings. |
| `REACTION_REMOVED` | A reaction is toggled off (soft-deleted). | Negative decay trigger on active scoring weight. |
| `COMMENT_CREATED` | A comment or threaded reply is posted. | High weight boost (signals direct active interaction). |
| `POST_SHARED` | An external platform link share or copy event occurs. | Critical exponential boost (influences viral distribution score). |
| `POST_SAVED` | A post is bookmarked into a custom collection. | High signal weight boost. |

---

## 3. SCALABILITY & N+1 MITIGATION RULES

To prevent critical performance issues during feed generation:
1.  **Denormalized Counts**: `ContentItem` holds fast aggregated fields (`likeCount` and `commentCount`). These are automatically incremented on actions using background queue processes or async database triggers.
2.  **No In-Query Joins**: Comments lists are cursor-cached and loaded completely independent of feed timelines.
