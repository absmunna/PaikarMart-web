# PaikarMart — Social Commerce & Platform Governance Master Plan
> **Document Status:** Active Enterprise Master Specification  
> **Ecosystem Paradigm:** Bangladesh Super App + Social Commerce (Facebook-Style Social Graph + Multi-Vendor Super Portal + B2B Wholesale)  
> **Target Audience:** CEO, System Architects, Security Engineers, and Core Developers  

---

## 🌐 1. Introduction & Social Commerce Paradigm (সোশ্যাল কমার্স রূপরেখা)

PaikarMart is architected as an advanced **Bangladesh Super App and Social Commerce Ecosystem**. Drawing structural inspiration from modern social commerce giants (such as Facebook’s social graph, feeds, marketplace, and shops), PaikarMart blends social discovery with transactional depth across 12+ specialized portals (E-commerce, Groceries, Logistics, B2B, Pharmacy, Real Estate, etc.).

This master plan establishes the definitive blueprint for **Role-Based Access Control (RBAC), CEO Governance, Security Hardening, Dashboard Architecture, and Production Build Processes** without altering or disrupting the existing stable foundation.

---

## 👥 2. Role-Based Access Control (RBAC) & Permission Matrix

PaikarMart enforces a strict 7-tier trust and role hierarchy to govern buyer, seller, logistics, and administrative actions.

### 🛡️ Core Roles & Access Levels

| Role Identifier | Role Group | Primary Purpose | Key Permissions & Capabilities |
| :--- | :--- | :--- | :--- |
| **`super_admin` / CEO** | `admin` | Supreme platform ownership & governance | Full access to all portals, database auditing, fee structures, financial ledgers, system overrides, and ban/suspend powers. |
| **`admin` / Manager** | `admin` | Day-to-day platform operations | Content moderation, dispute resolution, KYC verification approval, vendor payout approvals. |
| **`retail_seller`** | `vendor` | B2C storefront & digital shop owner | Manage products, fulfill retail orders, run social posts, view customer chats. |
| **`factory_seller` / B2B** | `vendor` | Wholesale, bulk manufacturing & B2B | Bulk pricing tiers, B2B RFQs (Request for Quotations), factory showroom management. |
| **`rider` / Logistics** | `logistics` | Delivery, transport & fulfillment partner | Accept delivery dispatches, live GPS tracking updates, COD cash collection logs. |
| **`service_provider`** | `service` | Professional services & local trades | Bookings management, service portfolio display, client communication. |
| **`buyer` / Customer** | `customer` | End-consumer, social shopper & community | Feed browsing, social posting, liking/sharing, cart checkout, order tracking, review writing. |

---

## 📊 3. Role-Specific Dashboard Architecture (ড্যাশবোর্ড ডিজাইন)

Each role is greeted by a tailored, single-source-of-truth dashboard upon successful authentication:

### 👑 A. CEO & Super Admin Dashboard (`/admin`)
* **Financial Ledger & Analytics:** Real-time GMV (Gross Merchandise Value), commission collection (5% default platform fee), and transaction volume.
* **Vendor KYC & Governance Control:** One-click review of Trade Licenses, NID verification, and trust badge promotion (Levels 1 to 7).
* **Content & Safety Moderation:** Flagged social posts, scam prevention alerts, and user banhammer tools.

### 🏪 B. Seller Central (`/seller-central`)
* **Social Commerce Feed Integration:** Ability to publish shoppable video/photo posts directly to the PaikarMart feed with tagged products.
* **Order & Inventory Command Center:** Live status tracking (Pending ➔ Processing ➔ Shipped ➔ Delivered), stock alerts, and bulk CSV upload.
* **Earnings & Payouts:** Integrated wallet (`useWalletStore`) showing available balance, bKash/Nagad payout requests, and sales reports.

### 🏍️ C. Logistics & Rider Portal (`/logistics`)
* **Dispatch Radar:** Real-time map & list of available pickup orders within the rider's zone.
* **Delivery Execution:** Step-by-step navigation, recipient OTP verification on delivery, and COD collection ledger.

### 👤 D. Customer Portal & Feed (`/` & `/messages`)
* **Social Discovery:** StoryBar, PortalIconBar, and personalized social feed (posts, reviews, live streaming).
* **Unified Messaging (`/messages`):** Real-time chat connecting buyers directly with sellers and AI assistant (Aloop AI).

---

## 🔒 4. Security & Anti-Spam Architecture (নিরাপত্তা ও অ্যান্টি-স্প্যাম সিস্টেম)

To protect PaikarMart from cyber attacks, bot spam, and data breaches, the following security layers are mandated:

### 🛡️ A. Authentication & Session Security
* **JWT & Bearer Tokens:** Secure token issuance with explicit expiration times. Client stores tokens securely (`paikarmart_token` and `paikarmart_user`).
* **Password Hashing:** Bcrypt encryption with high salt rounds for all user passwords.

### 🚫 B. Bot & Spam Prevention (Social Commerce Safeguards)
* **Rate Limiting:** Strict request throttling on sensitive endpoints:
  * Authentication (Login/Register): Max 10 requests per minute per IP.
  * Write Operations (Posts/Comments/Cart): Max 30 requests per minute.
  * General API: Max 200 requests per minute.
* **Content Moderation Filters:** Automated keyword and image heuristics to detect fraudulent product listings, scam links, and abusive chat messages.

### 🌐 C. Network & CORS Hardening
* **Production CORS:** Strict whitelist origin configuration (`https://www.paikarmart.com` and authorized subdomains) — wildcard (`*`) strictly forbidden in production.
* **Security Headers:** Helmet.js middleware enforcing Content Security Policy (CSP), X-Frame-Options, and X-Content-Type-Options.

---

## 📦 5. Production Build & Deployment Pipeline (বিল্ড ও ডিপ্লয়মেন্ট প্রসেস)

PaikarMart relies on a robust Full-Stack Express + Vite build pipeline designed for high-availability Cloud Run containers:

```
[TypeScript Source] ➔ [Vite Frontend Build (dist/)] 
                   ➔ [esbuild Backend Bundling (dist/server.cjs)] 
                   ➔ [Cloud Run Deployment (Port 3000)]
```

### 📋 Mandatory Build Commands (`package.json`)
* **Development:** `npm run dev` (boots `tsx server.ts` with hot reloading & Vite middleware).
* **Production Build:** `npm run build` (runs Vite static build + esbuild server bundle into `dist/server.cjs`).
* **Production Start:** `npm start` (runs `node dist/server.cjs` binding to port 3000).

---

## 🎯 6. Conclusion & Compliance

This master plan ensures that PaikarMart operates with enterprise-grade stability, social commerce virality, and strict security compliance. All future feature additions must align with these constitutional guidelines.
