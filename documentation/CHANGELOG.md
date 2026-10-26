# 📑 Paikar Mart Super App - Root Version Matrix & Changelog

This document serves as the global single-source-of-truth version tracking file for all developers and AI agents working on the Paikar Mart workspace. Refer to this matrix before starting any feature update to prevent version conflicts.

---

## 🚀 Release Matrix & Progression

| Version | Release Date | Component / Portal Affected | Description & Key Updates | Status |
| :--- | :--- | :--- | :--- | :--- |
| **v1.6.0** | May 28, 2026 | **Global Marketplace Expansion** | Implemented high-density Marketplace Portal (/marketplace) featuring Home, Search, Category, and Store pages. Integrated portal-aware navigation and a centralized cart count header. Switched to `motion/react`. | **Active** |
| **v1.5.0** | May 19, 2026 | **Portal Expansion Integration** | Integrated 4 new portal templates (Nearby Shops, Services, Ride Share, and Digital Store) from PKM-APP, linking them dynamically via AppRoutes. Added browser geolocation and Nominatim reverse-geocoding. | **Active** |
| **v1.4.0** | May 19, 2026 | **Merchant Directory (`/vendors`)** | Activated Verified Merchant & Shop Directory portal with tabs for wholesalers, retail shops, and service providers, direct tel/WhatsApp integrations, and search indexing. | **Active** |
| **v1.3.0** | May 19, 2026 | **Super Wallet (`/wallet`)** | Full-Stack Super Wallet Integration (Prisma Wallet & Transaction DB Models, backend controllers/routes, and Axios apiClient frontend binding with offline mock fallbacks). | **Active** |
| **v1.2.0** | May 18, 2026 | **B2C Marketplace (`/b2c`)** | B2C Retail Marketplace Portal Activation, responsive dark-glass UI, real-time query searching, near-me toggles, floating cart drawers, and details modals. | **Active** |
| **v1.1.0** | May 18, 2026 | **Dual-Role Facebook UI & Auth** | Dual-Role profile interface, Zustand auth store unification (Gmail test account fix), catalog demand uploads, and B2B product composer modal. | **Active** |
| **v1.0.0** | Initial | **Core Architecture & B2B** | Base architecture, React Router v7 setup, Tailwind CSS theme variables, basic B2B wholesale portal (`/wholesale`). | **Active** |

---

## 📌 Portal-Specific Documentation Index

For micro-level updates, please refer to the dedicated `.md` files in each portal directory:
*   🛍️ **B2C Retail Marketplace Portal Log**: [`src/portals/b2c/UPDATE.md`](file:///C:/Users/MD%20MUNNA/PaikarMart-web/src/portals/b2c/UPDATE.md)
*   🏢 **B2B Wholesale Portal Log**: [`src/portals/wholesale/UPDATE.md`](file:///C:/Users/MD%20MUNNA/PaikarMart-web/src/portals/wholesale/UPDATE.md)
*   💳 **Super Wallet Portal Log**: [`src/pages/WALLET_UPDATE.md`](file:///C:/Users/MD%20MUNNA/PaikarMart-web/src/pages/WALLET_UPDATE.md)
*   🏪 **Merchant Directory Portal Log**: [`src/pages/VENDORS_UPDATE.md`](file:///C:/Users/MD%20MUNNA/PaikarMart-web/src/pages/VENDORS_UPDATE.md)

---

## 🧠 Version Highlight Details

### 🛒 v1.6.0 - Global Marketplace Expansion
*   **Architecture**: Built a multi-dimensional Marketplace portal at `/marketplace` serving as a centralized aggregator for all specialized portals (Retail, Wholesale, Nearby, Services, etc.).
*   **Discovery Engines**: Developed `MarketplaceHome`, `MarketplaceSearch`, `MarketplaceCategory`, and `MarketplaceStore` pages with high-performance filtering and search capabilities.
*   **UI/UX**: Implemented `MarketplacePortalBar` for cross-portal navigation and enhanced `MarketplaceHeader` with real-time cart item tracking via Zustand.
*   **Performance**: Migrated from `framer-motion` to `motion/react` for optimized bundle size and standard compliance.

### 📱 v1.5.0 - Portal Expansion Integration
*   **Portals Added**: Integrated `/portal/nearby` (Nearby Shops), `/portal/services` (Services Marketplace), `/portal/ride` (Ride Sharing), and `/portal/digital` (Digital Store).
*   **Geolocation & Reverse-Geocoding**: Added support for coordinates detection using `navigator.geolocation` and double-fallback reverse-geocoding (Nominatim and BigDataCloud). Integrated auto-detection directly inside the main `LocationPicker` dropdown with loading animations and auto-detect feedback status.
*   **Compatibility**: Rewrote and adapted components data models to integrate with active workspace's custom typed `ProductCard` successfully.

### 🏪 v1.4.0 - Merchant & Shop Directory
*   **Frontend**: Designed and integrated a stunning glassmorphism verified shop/merchant directory at `/vendors`.
*   **Filters & Search**: Provided categorized filter tabs (All, Wholesalers, Nearby Shops, Service Providers) along with full-text search scope.
*   **Direct Connect**: Linked direct cellular tel-dialing and WhatsApp chat launcher buttons inside high-fidelity details drawer overlays.

### 💳 v1.3.0 - Super Wallet (Full-Stack)
*   **Database (Prisma)**: Added `Wallet` and `Transaction` models with relational linkages to `User`.
*   **Backend (Express)**: Created `wallet.controller.ts` and `wallet.routes.ts` providing `/api/v1/wallet` endpoints for balance fetch, add-money, send-money, and mobile recharge.
*   **Frontend**: Built a gorgeous dark-glassmorphism card UI at `/wallet` connected to `apiClient` with absolute offline resilience (seamless mock fallback if the backend is offline).

### 🛍️ v1.2.0 - B2C Retail Marketplace
*   **Layout**: Created a persistent transparent glass navbar with verified badges and back navigation.
*   **Core Pages**: Implemented `/b2c` with category chips, "Near Me" filters, a floating checkout summary tray, and high-fidelity overlay modal details.

### 👤 v1.1.0 - Facebook Profile UI & Unified Auth
*   **Profile Page**: Dual-role rendering (Buyer lists area demand posts, Seller showcases product shop and opens catalog product upload modal).
*   **Zustand Auth Store**: Merged duplicate auth stores to fix Gmail (`nirjonmunna5@gmail.com`) persistence issues.

---

> **Agent Guidelines**: Always run `npx tsc --noEmit` before proposing a release bump to ensure typescript compilation remains clean at Exit Code: 0. Update this file as the very last step of your task execution.
