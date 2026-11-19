# Paikar Mart — Realtime Architecture & E2E Test Matrix

## 🗺️ Data Ownership & Realtime Map

The app uses a hybrid architecture to maximize the benefits of the **Firebase Spark** and **Supabase Free** tiers.

| Feature | Provider | Role | Sync Mechanism |
| :--- | :--- | :--- | :--- |
| **Authentication** | Firebase Auth | Canonical Identity | `idToken` verification on Backend |
| **Chat / Messages** | Firestore | Canonical Realtime | `onSnapshot` (Client-side) |
| **Notifications** | Firestore | Canonical Realtime | `onSnapshot` (Client-side) |
| **Social Feed** | Firestore | Canonical Realtime | `onSnapshot` (Client-side) |
| **User Profile** | Supabase Postgres | Canonical Business | Backend-driven `/auth/sync` |
| **Wallets/Orders** | Supabase Postgres | Canonical Business | Direct API (REST) |
| **Storage Assets** | Supabase Storage | Canonical Media | Supabase Storage SDK |

### ⚡ Realtime Proof
*   **Firestore**: Extensively used via `onSnapshot` for high-frequency updates (Chat, Notifications).
*   **Supabase Realtime**: **Disabled/Unused**. All database-driven views are refreshed via REST API polling or explicit triggers to stay within the 200 concurrent connection limit of the Supabase Free tier.

---

## 🧪 E2E Test Matrix

The following test scenarios ensure the stability of the hybrid identity/data sync flow.

### 1. Identity & Synchronization
| Scenario | Action | Expected Result | Status |
| :--- | :--- | :--- | :--- |
| **New User Signup** | Google/Phone Login | Firebase Auth success → `/auth/sync` success → User & Wallet created in Postgres. | ✅ Verified |
| **Repeat Login** | Re-login same user | `/auth/sync` idempotent update → No duplicate user/wallet → Existing role preserved. | ✅ Verified |
| **Token Expiry** | Use expired ID Token | Backend returns `401 Unauthorized` → Frontend triggers re-auth. | ✅ Verified |
| **Role Spoofing** | Inject `role: admin` in body | Backend ignores body role → UID-verified database role returned. | ✅ Verified |

### 2. Resilience & Edge Cases
| Scenario | Action | Expected Result | Status |
| :--- | :--- | :--- | :--- |
| **Database Outage** | Disable `DATABASE_URL` | Backend enters "Resilient Mode" → Success message with reduced data → App remains browsable. | ✅ Verified |
| **Sync Failure** | Fail `/auth/sync` (500) | Frontend triggers exponential backoff retry (up to 3 times) → Graceful error if final fail. | ✅ Verified |
| **Email Collision** | Link email used by others | Backend returns `409 Conflict` → Frontend shows clear error to user. | ✅ Verified |

### 3. Realtime Security
| Scenario | Action | Expected Result | Status |
| :--- | :--- | :--- | :--- |
| **Chat Trespass** | Read `/chats/{id}` as non-member | Firestore Rules return `PERMISSION_DENIED`. | ✅ Verified |
| **Message Forgery** | Send message as other `senderId` | Firestore Rules return `PERMISSION_DENIED` (auth.uid check). | ✅ Verified |
| **Quota Protection** | Create chat with 50 participants | Firestore Rules return `PERMISSION_DENIED` (size limit <= 10). | ✅ Verified |

---

## 🚀 Production Launch Blockers (Audit Findings)

1.  **[RESOLVED]** Duplicate Firebase initializations causing Auth state flickers.
2.  **[RESOLVED]** Insecure custom OTP simulation enabled in production.
3.  **[RESOLVED]** Missing ownership checks in product mutation endpoints.
4.  **[MONITORING]** Supabase Free Tier Egress: Monitor large image downloads (2GB/month limit).
5.  **[MONITORING]** Firestore Spark Tier Reads: Monitor `onSnapshot` usage in high-traffic chat rooms (50k reads/day limit).
