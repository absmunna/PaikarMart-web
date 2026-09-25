# PAIKARMART ECOSYSTEM — VIRALITY & SIGNAL AGGREGATION CONSTITUTION
*(Phase 4.5 - Virality & Feed Feedback Loop)*

This constitution governs the conversion of micro-engagement behaviors into structured ranking signals. By compiling real-time interaction logs asynchronously, this layer feeds high-priority signals back into the Feed Orchestration Engine without introducing ML complexity or blocking core operations.

---

## 1. SIGNAL WEIGHTS DICTIONARY

Every interaction on a `ContentItem` carries a proportional signal weight reflecting the intent depth of the customer or trader.

| Signal Action | Weight Factor | Data Reference | Product Relevance |
| :--- | :--- | :--- | :--- |
| **Reaction** (LIKE / LOVE / WOW) | `5.0` | `ContentReaction` | General affinity indicator. |
| **Modular Commentary** | `10.0` | `ContentComment` | Thread discussion signal. |
| **Collection Save** | `15.0` | `ContentBookmark` | Purchase consideration signal. |
| **Link / Platform Sharing** | `25.0` | `ContentShare` | Viral threshold accelerator. |

---

## 2. DETERMINISTIC VIRALITY SCORE FORMULA

To calculate content velocity and trending indexes objectively, the Virality Engine executes:

$$\text{Vel} = \frac{\text{Total Engagement Score}}{\text{Hours Since Created}}$$

$$\text{Virality Index} = \text{Vel} \times \left(1.0 + (\text{Share Count} \times 0.4)\right)$$

Where:
*   `Total Engagement Score` is computed dynamically as:
    $$\text{Score} = (\text{reactions} \times 5) + (\text{comments} \times 10) + (\text{bookmarks} \times 15) + (\text{shares} \times 25)$$
*   **Share Count Multiplier** yields exponential virality boosts, placing organic merchant shares at the peak of the promotion algorithm.

---

## 3. FEED BACKLOOP MECHANICS

The Feed Orchestration Engine is kept completely decoupled from analytics tables:
1.  **Event-Driven Recalculation**: Subscriptions handle the compilation of metrics asynchronously, preserving instant write speeds for users.
2.  **Ranking Integration**: Validating a feed assemblies query requests `ContentAnalytics` model connections. If active, the `viralityIndex` boosts the ranking priority by a factor of 15:
    $$\text{Feed Rank Score} = \frac{\text{SourceWeight} + \text{EngagementScore} + (\text{ViralityIndex} \times 15) + \text{RankBoost}}{(\text{Hours} + 2)^{1.5}}$$

This maintains a pristine architectural separation of write paths (Content storage) and read paths (optimized Feed assembly projections).
