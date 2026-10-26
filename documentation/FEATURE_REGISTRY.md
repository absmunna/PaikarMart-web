# PAIKARMART ECOSYSTEM — UNIFIED FEATURE REGISTRY
*(new add - Version 1.0)*

This registry catalogs all major feature portals and operational workspaces in the Paikar Mart super app. It lists current implementation statuses, core endpoints, front-end routing mappings, and backend dependency states.

---

## 🗺️ PORTAL & WORKSPACE MAP

| Feature / Portal Name | Route Mapping | Status | Core API Hooks | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Auth Gateway** | `/auth/login` | **100% Completed** | `/api/v1/auth/login` | JWT management, register hooks, and automatic OTP setup validations. |
| **B2B Sourcing Feed** | `/` | **100% Completed** | `/api/v1/feed` | Custom stories bar, portal categorizations, dynamic search interface models. |
| **Retail Storefront B2C** | `/marketplace` | **100% Completed** | `/api/v1/products` | Standard retail customer product discovery, filter bars, detailed review displays. |
| **Multi-Vendor Cart & MOQ** | `/cart` | **100% Completed** | `/api/v1/cart` | Grouping shopping carts dynamically by vendor, checking minimal vendor MOQ values. |
| **B2B/Wholesale Portals** | `/wholesale` | **100% Completed** | `/api/v1/products?type=wholesale`| Factory direct bulk orders, pricing tires increment indicators. |
| **Seller Dashboard** | `/seller/dashboard` | **100% Completed** | `/api/v1/orders/seller` | Direct product insertions, order process status matrices, supply chain lookups. |
| **Admin Control Panel** | `/admin` | **100% Completed** | `/api/v1/orders/all` | High-level platform metrics tracking, master order tables, security overrides. |
| **Payment & Wallet Core** | `/wallet` | **100% Completed** | `/api/v1/payments/wallet` | Escrow management, auditing balance logs, manual bKash/Nagad abstraction setups. |
| **Service Marketplace** | `/services` | **In Build / Fallback**| `/api/v1/services` | On-demand local expert, technician, or assistant discovery spatial grids. |
| **Intelligent Logistics** | `/logistics` | **Pending** | `/api/v1/logistics` | Automated local delivery tracking, dispatch sheets, third party API plug. |
| **Export/Import Gateway** | `/export` | **Pending** | `/api/v1/export` | Cross-border manufacturer matching pipeline, customs compliance tracking. |
| **Aloop AI Ecosystem** | `/aloop` | **Pending** | `/api/v1/ai` | Gemini-powered local smart chat assistant, product categorization tags generator. |

---

## 🔄 EVOLUTIONARY PROTRACTED ROADMAP

1.  **Phase 4: Social Commerce Engine**:
    *   *Features*: Feed postings, commenting nodes, reels integration, direct links to shop catalogs.
2.  **Phase 5: Real-time Event System**:
    *   *Features*: Direct chat rooms (Socket.io), push alerts triggering.
3.  **Phase 6: Logistics & Delivery Integration**:
    *   *Features*: Delivery partner gateway, live GPS pinpointing tracking.
