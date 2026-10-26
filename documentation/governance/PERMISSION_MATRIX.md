# PAIKARMART ECOSYSTEM — ROLE & PERMISSION MATRIX
*(new add - Version 1.0)*

This document specifies the authoritative security scopes and action permissions across all target roles in the Paikar Mart multi-vendor super app. It ensures strict compliance with our platform gateway authentication and access policies.

---

## 🔑 STATIC ASSIGNEE ROLES DEFINED

1.  **buyer**: Standard consumers purchasing on retail, looking for nearby services, or ordering B2B samples.
2.  **seller**: Direct wholesale partners, factories, and retail shop owners listing inventories.
3.  **nearby_shop**: Verified brick-and-mortar storefronts offering instantaneous local delivery and nearby services.
4.  **service_provider**: Technicians or service agents accepting specialized contract work-orders.
5.  **admin**: Internal system operators responsible for checking business applications and manual balances.
6.  **super_admin**: Full-spectrum database permission sets and security policy settings.

---

## 🎯 PERMISSION TO RELATION MATRIX Map

Below is the exhaustive matrix of fine-grained application permission strings paired against target system roles:

| Access Permission Name | buyer | seller | nearby_shop | service_provider | admin | super_admin | REST Endpoint Scope Protected |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **CAN_PURCHASE** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | `POST /api/v1/orders` |
| **CAN_SELL** | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | `POST /api/v1/products` |
| **CAN_MANUFACTURE** | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | `POST /api/v1/products` (Wholesale types) |
| **CAN_PROVIDE_SERVICE** | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | `POST /api/v1/services` |
| **CAN_APPROVE_BUSINESS**| ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | `PATCH /api/v1/businesses/approve` |
| **CAN_VIEW_METRICS** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | `GET /api/v1/orders/all` |
| **CAN_MANAGE_ESCROWS** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | `POST /api/v1/escrow/release` |
| **CAN_OVERRIDE_POLICIES**| ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | Entire Database Pipeline |

---

## 🛡️ POLICY ENFORCEMENT PROTOCOLS

1.  **Server-Side Guards**: All REST APIs enforce permissions at the route controller interface using standard middleware guards. Client-side hiding is only for positive UX and MUST be validated server-side.
2.  **Dev Fallback State**: In dev sandbox modes or offline environments, session builders must attach proper credentials (defaults to standard `buyer` or mock `seller` profiles in-memory) to facilitate fluid local testing without constant auth roundtrips.
