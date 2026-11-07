# Paikar Mart - Identity & Data Sync Strategy

This document defines the synchronization flow between **Firebase Auth (Identity)** and **Supabase/PostgreSQL (Source of Truth)**.

## 🔄 The Sync Flow

1.  **Authentication**: User logs in via Firebase (Google, Phone, or Email).
2.  **ID Token**: Frontend obtains a cryptographically verified `idToken`.
3.  **Backend Sync**: Frontend calls `POST /api/v1/auth/sync` with the `idToken`.
4.  **Verification**: Backend `firebaseAuth` middleware verifies the token via Firebase Admin SDK and extracts the authoritative `uid`.
5.  **Idempotent Upsert**:
    *   If `User` doesn't exist: Create in PostgreSQL with `role: 'buyer'`.
    *   If `User` exists: Update profile fields (`fullName`, `avatarUrl`) but **KEEP** existing `role`.
    *   **Wallet**: Ensure a `Wallet` record exists with a zero balance (if new).
6.  **Session Token**: Backend issues a signed JWT (Paikar Token) for subsequent API calls.
7.  **Authority**: PostgreSQL is the authority for all business data (Roles, Wallets, Orders).

## 📊 Data Inventory

| Entity | Primary Store | Secondary Store | Logic/Authority |
| :--- | :--- | :--- | :--- |
| **Identity** | Firebase Auth | PostgreSQL (User) | Firebase UID is the Primary Key. |
| **User Roles** | **PostgreSQL** | Firestore (Mirror) | Backend-only updates for Admin/Seller roles. |
| **Wallet/Balance** | **PostgreSQL** | None | Strictly backend transactions. |
| **Orders** | **PostgreSQL** | None | Commerce lifecycle authority. |
| **Products** | **PostgreSQL** | Firestore (Legacy) | Authority moving to Postgres; Firestore used for legacy catalog. |
| **Chat/Social** | **Firestore** | None | Real-time features leverage Firestore Spark tier. |

## 🛡️ Security & Idempotency

*   **Role Preservation**: `/auth/sync` NEVER accepts a `role` from the request body. It only reads roles from the verified database record.
*   **Collision Handling**: Email/Phone collisions are handled by linking to the first verified owner.
*   **Atomic Wallet**: Wallet creation uses `upsert` or exists-check to prevent balance resets.
*   **Retry Logic**: Frontend implements exponential backoff for sync failures to ensure the session is always linked.

## 🧪 Recovery & Monitoring

*   **Failure State**: Frontend detects `syncStatus === 'failed'` and prompts the user to retry or re-login.
*   **Logs**: Backend logs sync events with `uid` but **excludes** raw ID tokens or sensitive PII.
*   **Database Outage**: App enters "Resilient Mode" if Supabase is down, allowing limited browsing but restricting commerce/auth actions.
