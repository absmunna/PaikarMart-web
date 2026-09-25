# IMPLEMENTATION SEQUENCE - PAIKAR MART

This document defines the ordered sequence of development stages based on infrastructure dependencies.

---

## Sprint 1: Foundation & Core Governance
*Focus: Auth, Shared UI, Core Modules, Base Architecture.*
- Refactor duplicate portals (`pk-shop`/`pk-store`, `b2b`/`wholesale`).
- Implement unified `GlobalSidebar` and navigation infrastructure based on updated portal list.
- Finalize core Prisma database models for `Product`, `User`, `Store`, `Order`.
- Build shared atomic components: `ProductCard`, `StoreCard`, `SearchPanel`.

## Sprint 2: Core Commerce Discovery
*Focus: Marketplace, Retail, Nearby.*
- Implement `Marketplace` core (Search, Faceted Filter).
- Refactor `Retail` portal (Pages, B2C logic).
- Refactor `Nearby` portal (Proximity logic, Map integration).
- Implement `Marketplace` aggregated feeds.

## Sprint 3: Expert & B2B Ecosystem
*Focus: B2B, Services, PK Shop.*
- Implement `B2B` comprehensive platform (RFQ, Factory profiles).
- Implement `Services` booking system.
- Implement `PK Shop` premium/curated features.
- Integrate `demand` sourcing portal basics.

## Sprint 4: Advanced Services & Platform Ops
*Focus: Demand, Transport, Travel, Wallet, Orders, Messages.*
- Integrate full `Demand` matching/sourcing flow.
- Implement `Transport` and `Travel` logistics/booking portals.
- Build internal financial ecosystem (`Wallet`).
- Implement comprehensive `Order` tracking and `Messages` (BusinessInbox).
