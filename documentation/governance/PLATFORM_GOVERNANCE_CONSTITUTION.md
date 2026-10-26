# PAIKARMART ECOSYSTEM — PLATFORM GOVERNANCE & CONTROL CONSTITUTION
*(Phase 5.3 - Governance & Abuse Prevention)*

This constitution governs the centralized platform governance, risk detection, and abuse prevention layer. It enforces safety and integrity by asynchronously evaluating all platform signals.

---

## 1. POLICY ENGINE & RISK DETECTION
The Policy Engine monitors all activity flowing through the Event Bus. It is an exclusively reactive control system, capable of flagging, restricting, or initiating administrative review workflows.

*   **Rule Set**: Defines thresholds for spam detection (e.g., event frequency), marketplace fraud indicators (e.g., rapid price matching), and social abuse metrics.
*   **Anomaly Scoring**: A real-time risk score is attached to user activity.

---

## 2. MODERATION PIPELINE
When a policy violation (e.g., `POLICY_VIOLATION_DETECTED`) occurs, the Governance System triggers:
1.  **Automated Flagging**: Signals added to `FlaggedContent` for queue processing.
2.  **Restricted State**: Temporary system-level soft-blocks on problematic content/users.
3.  **Admin Review**: A dedicated API controller interface managing the queue.

---

## 3. GOVERNANCE PRINCIPLES
1.  **Isolation**: Governance actions NEVER inject logic directly into business modules. All control happens via Event Bus signal reaction (e.g., `EMIT: BLOCK_USER_SESSION`).
2.  **Transparency**: All moderation actions create an audit trail in `ViolationLog`.
3.  **Admin Supremacy**: Automated actions can be overridden or finalized by human admins via the moderation interface.
