# PaikarMart — Role-Specific Dashboard Architecture
> **Scope:** Detailed layout and functional modules for CEO, Seller Central, Logistics, and Customer Portals.

---

## 📊 1. Dashboard Layout Specifications

Each portal and role is greeted by a dedicated, single-source-of-truth dashboard designed for high-density usability and instant clarity.

### 👑 A. CEO & Admin Governance Dashboard (`/admin`)
* **Financial Overview Cards:** Live GMV ticker, net platform commission earnings, active payout requests.
* **Vendor Verification Queue:** Pending KYC documents (Trade License, NID, Bank info) with one-click approval/rejection.
* **Platform Health & Logs:** API response times, database query metrics, and error rates.

### 🏪 B. Seller Central Dashboard (`/seller-central`)
* **Social Commerce Studio:** Quick post creator with product tagging for the PaikarMart main feed.
* **Order Management Pipeline:** Kanban or list view of New ➔ Processing ➔ Shipped ➔ Delivered orders.
* **Wallet & Payouts:** Integrated balance overview (`useWalletStore`) with bKash/Nagad withdrawal requests.

### 🏍️ C. Logistics & Rider Portal (`/logistics`)
* **Dispatch Radar:** Nearby order notifications with estimated pickup and drop-off distances.
* **Active Delivery View:** Turn-by-turn navigation map and recipient OTP verification input.

### 👤 D. Customer Portal & Social Feed (`/` & `/messages`)
* **Social Discovery:** StoryBar, PortalIconBar, and interactive feed posts.
* **Unified Messaging (`/messages`):** Integrated chat combining buyer-seller conversations and Aloop AI assistant.
