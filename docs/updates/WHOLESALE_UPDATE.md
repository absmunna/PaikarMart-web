# 🏢 B2B Wholesale Portal - Update Log

This document tracks all developer updates, dual-role composer structures, and wholesale state configurations inside the B2B Wholesale Portal (`/wholesale`).

---

## 📅 Last Update: May 18, 2026 (v1.1.0)

### 🚀 Key Features Implemented
1.  **Dual-Role Facebook UI Profile Integration (`Profile.tsx`)**:
    *   Designed cover and avatar banner interfaces.
    *   **Buyer view**: Lists localized area service demand requests ("আমার ডিমান্ড বোর্ড").
    *   **Seller view**: Displays professional store catalogs ("আমার প্রোডাক্ট শপ") and modifies composer box trigger to "নতুন প্রোডাক্ট আপলোড".
2.  **Spam-Free Wholesale Catalog Composer Modal**:
    *   Sellers can upload bulk products through dropdown options (product type, wholesale price range, Minimum Order Quantity (MOQ), and hub/warehouse origin location).
    *   Submitting immediately populates and displays wholesale-formatted grid catalog cards without client reload.

---

## 📂 Portal Structure & Route Mapping

*   **Router Path**: Registered under `/wholesale/*` in `src/routes/AppRoutes.tsx`.
*   **Layout Wrapper**: Located in [`src/portals/wholesale/layouts/B2BLayout.tsx`](file:///C:/Users/MD%20MUNNA/PaikarMart-web/src/portals/wholesale/layouts/B2BLayout.tsx).
*   **Wholesale Hub Page**: Located in [`src/portals/wholesale/pages/B2BHome.tsx`](file:///C:/Users/MD%20MUNNA/PaikarMart-web/src/portals/wholesale/pages/B2BHome.tsx).
*   **Profile Page Integration**: Integrated within the global profile viewport at [`src/pages/Profile.tsx`](file:///C:/Users/MD%20MUNNA/PaikarMart-web/src/pages/Profile.tsx).

---

## 🧠 Future Enhancements Roadmap
*   **Bulk Discount Tiering**: Implement multiple tier price calculations (e.g. 50+ pcs: ৳১০, 100+ pcs: ৳৮).
*   **Warehouse Location Filters**: Add geographic search scopes so wholesalers can source raw materials within exact logistical boundaries.
