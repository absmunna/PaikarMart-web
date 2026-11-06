# PaikarMart Administrative Security & Access Guide

**CONFIDENTIAL**: This document is intended solely for authorized PaikarMart administrative personnel. Do not share this document outside the organization.

## 1. Role Definitions & Hierarchy

### Super Admin (System Owner)
- **Authority**: Absolute control over the PaikarMart ecosystem, database, and all portals.
- **PK Shop**: 100% ownership. Only the Super Admin can view global financial revenue, withdraw funds, and permanently delete accounts.
- **Access**: `/dashboard/admin`

### Moderator (Delegated Staff)
- **Authority**: Limited control delegated by the Super Admin to manage daily operations.
- **PK Shop**: Can add/edit/delete products, manage inventory, and process orders. They **cannot** access wallet configurations, view total system revenue, or assign other moderators.
- **Access**: `/dashboard/moderator`

### Pro Seller
- **Authority**: Independent vendors selling on the PaikarMart platform.
- **Access**: Restricted strictly to their own B2B/B2C store dashboard. They have absolutely no access to PK Shop (PaikarMart's official store) operations.
- **Access**: `/dashboard`

---

## 2. Security Protocols (Mandatory)

1. **Authentication**: All Admin/Moderator accounts must use encrypted login sessions. 
2. **Access Logs**: Every action taken in the Admin Dashboard (adding products, revoking roles, logging in) is tracked via IP Address and timestamp.
3. **Session Expiry**: Admin sessions will automatically expire if idle for 30 minutes to prevent unauthorized physical access.
4. **Data Isolation**: Moderators operate within an isolated view. They only see what the Super Admin allows them to see.

---

## 3. How to Delegate Access (For Super Admin)

1. Navigate to your **Super Admin Panel**.
2. Click on the **PK Shop Delegation** tab.
3. Click the **+ Add Moderator** button.
4. Enter the staff member's email address and assign them a specific role (e.g., "Inventory Moderator" or "Order Fulfillment").
5. The system will automatically update their `UserRole` in the database, granting them access to `/dashboard/moderator`.

---

## 4. Emergency Procedures

If you detect unauthorized access or anomalies via the **Safety & Security** tab:
- Immediately **Revoke** the suspected Moderator's access from the Delegation tab.
- Use the **AI Shield** to generate an anomaly report.
- Check the **Recent Access Logs** for unfamiliar IP addresses.
