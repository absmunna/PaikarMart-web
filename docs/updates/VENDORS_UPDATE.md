# 🏪 Merchant & Shop Directory Portal - Update Log

This document tracks all developer updates, categorized filter systems, and direct communication integrations inside the Merchant & Shop Directory Portal (`/vendors`).

---

## 📅 Last Update: May 19, 2026 (v1.4.0)

### 🚀 Key Features Implemented
1.  **Stunning Glassmorphism Merchant List**:
    *   Designed a high-fidelity list structure showcasing Marchant avatars, verified trust checkmarks, rating statistics, trust score percentages, and total active listings count.
2.  **Horizontal Tab Categorization**:
    *   One-click tabs to switch categories seamlessly:
        *   **সব মার্চেন্ট (All)**
        *   **পাইকারি আড়তদার (Wholesalers / B2B)**
        *   **নিকটবর্তী দোকান (Nearby Retail Shops)**
        *   **সার্ভিস প্রোভাইডার (Service Providers)**
3.  **Real-Time Full-Text Search Scope**:
    *   Character-by-character search matches names, geographic locations (e.g. Karwan Bazar, Uttara), or categories.
4.  **High-Fidelity Overlay Details Drawer**:
    *   Clicking any card smoothly glides a detailed profile card from the bottom containing detailed reviews, supply limits, active listings count, and rating scores.
5.  **Direct Dial & Chat Connectors**:
    *   **Call Button**: Triggered cellular tel-linkage dialer (`tel:${phone}`) to call wholesalers immediately.
    *   **WhatsApp Chat Launchers**: Connects users to vendor WhatsApp numbers instantly.

---

## 📂 Portal Structure & Route Mapping

*   **Router Path**: Registered under `/vendors` in `src/routes/AppRoutes.tsx`.
*   **Core Page Component**: Located in [`src/pages/VendorsPage.tsx`](file:///C:/Users/MD%20MUNNA/PaikarMart-web/src/pages/VendorsPage.tsx).
*   **Navigation Entry Point**: Embedded in [`src/components/navigation/MobileMenu.tsx`](file:///C:/Users/MD%20MUNNA/PaikarMart-web/src/components/navigation/MobileMenu.tsx).

---

## 🧠 Future Enhancements Roadmap
*   **Live Vendor Location Mapping**: Integrate Mapbox or Google Maps API to let buyers visually spot physical wholesalers on an interactive geographic map.
*   **Active WhatsApp Messaging Templates**: Autogenerate bulk query templates (e.g., "Hello, I am interested in your wholesale Rice listings...") when buyers launch WhatsApp chat redirects.
