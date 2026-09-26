# 💳 Super Wallet Portal - Update Log

This document tracks all developer updates, financial ledger structures, and full-stack API integrations inside the Super Wallet Portal (`/wallet`).

---

## 📅 Last Update: May 19, 2026 (v1.3.0)

### 🚀 Key Features Implemented
1.  **Full-Stack Database Persistence (Prisma & PostgreSQL)**:
    *   Designed and generated relational `Wallet` and `Transaction` DB models in Supabase.
2.  **Robust Express Backend REST APIs (`/api/v1/wallet`)**:
    *   **GET `/`**: Pulls the active user's current bank balance, coins, and ledger. Creates or seeds initial BBDT balances if no wallet exists.
    *   **POST `/add-money`**: Securely increments the database balance and adds inflow records.
    *   **POST `/send-money`**: Verifies balance sufficiency, decrements values, and records outflows.
    *   **POST `/recharge`**: Deducts funds and tracks recharge details mapped to operators (GP, Robi, Airtel, etc.).
3.  **Offline Resilience & Fallback Integrity**:
    *   The frontend uses standard Axios API binding via `apiClient`.
    *   **Crucial Rule**: In local development where the server might be offline, the frontend catches fetch errors and gracefully falls back to client-side react state updates. The UI never crashes and remains 100% interactive for immediate mock demonstration.

---

## 📂 Portal Structure & Route Mapping

*   **Router Path**: Registered under `/wallet/*` in `src/routes/AppRoutes.tsx`.
*   **Core Page Component**: Located in [`src/pages/WalletPage.tsx`](file:///C:/Users/MD%20MUNNA/PaikarMart-web/src/pages/WalletPage.tsx).
*   **Express Backend Route**: Located in [`backend/modules/wallet/wallet.routes.ts`](file:///C:/Users/MD%20MUNNA/PaikarMart-web/backend/modules/wallet/wallet.routes.ts).
*   **Express Backend Controller**: Located in [`backend/modules/wallet/wallet.controller.ts`](file:///C:/Users/MD%20MUNNA/PaikarMart-web/backend/modules/wallet/wallet.controller.ts).

---

## 🧠 Future Enhancements Roadmap
*   **Loyalty Points Conversion API**: Create a database transition pathway to deduct loyalty coins (`coins`) and credit active wallet balance (`balance`) inside the Prisma transaction scope.
*   **bKash Merchant Pay Checkout Integration**: Hook up real merchant gateway APIs to replace demo mock cash-ins with SMS OTP checkouts.
