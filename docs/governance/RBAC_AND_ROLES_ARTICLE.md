# PaikarMart — Role-Based Access Control (RBAC) & Permission Matrix
> **Scope:** Granular breakdown of the 7 core roles, permission boundaries, and capability enforcement across the ecosystem.

---

## 👥 1. The 7-Tier Role Hierarchy

PaikarMart enforces strict structural boundaries across user types to prevent unauthorized privilege escalation.

| Role Identifier | Role Group | Target User Base | Primary Permissions & Capabilities |
| :--- | :--- | :--- | :--- |
| **`super_admin`** | `admin` | CEO / Platform Owners | Full system read/write, financial audits, banhammer, config overrides. |
| **`admin`** | `admin` | Operations Managers | KYC approvals, dispute resolution, content moderation. |
| **`retail_seller`** | `vendor` | B2C Storefront Owners | Product catalog management, retail order processing, social feed posting. |
| **`factory_seller`** | `vendor` | Manufacturers / B2B Wholesalers | Bulk pricing tiers, B2B RFQ quotes, showroom management. |
| **`rider`** | `logistics` | Delivery & Transport Partners | Dispatch acceptance, live GPS route navigation, COD collection logging. |
| **`service_provider`** | `service` | Local Artisans & Service Pros | Booking management, service catalog display, client chats. |
| **`buyer`** | `customer` | General Shoppers & Community | Feed browsing, social interaction, cart checkout, order tracking. |

---

## 🔐 2. Permission Enforcement & Route Guards
* **Client-Side Guards:** React Router dynamically hides or restricts navigation items based on `auth.user.roleGroup` and `auth.user.role`.
* **Server-Side Guards:** Express API middleware (`verifyToken` + `requireRole([...])`) validates JWT claims on every sensitive mutation.
