# PAIKARMART ECOSYSTEM — PLATFORM INTELLIGENCE CONSTITUTION
*(Phase 5.2 - Intelligence & Platform Orchestration)*

This constitution governs the cross-domain system-wide observability layer. It enables Paikar Mart to analyze platform-wide trends, system health, and cross-domain product/commerce performance by observing all Event Bus telemetry.

---

## 1. INTELLIGENCE AGGREGATION ENGINE

The Intelligence Layer subscribes to *all* domain Event Bus signals. It is an strictly observational, read-heavy subsystem built on top of event streaming.

*   **Observability Pipeline**: Captures throughput (events/min), event distribution (Social vs Commerce), and failure rates.
*   **Decoupled Intelligence**: No module logic relies on intelligence metrics for execution. Metrics are strictly for analytics, dashboards, and system-wide visibility.

---

## 2. CROSS-DOMAIN IMPACT LOGIC

The engine reconstructs the relationship between seemingly unrelated domains:
*   **Commerce Impact**: How much do viral `ContentItem` updates relate to `ORDER_CREATED` event frequency?
*   **Signal Strength**: How effectively does product metadata influence Feed ranking?

---

## 3. GLOBAL ORCHESTRATION PRIORITIES
*(System-wide ranking signal tuning)*

1.  **Transactional Integrity**: Orders are the highest priority signal.
2.  **Viral Content**: High engagement content is promoted.
3.  **Merchant Performance**: Active sellers are prioritized over inactive storefronts in feed sorting.

This layer provides "system weather reports" for admins, providing a real-time, high-level picture of user activity, transactional velocity, and current hot-spots.
