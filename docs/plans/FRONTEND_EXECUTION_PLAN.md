# FRONTEND EXECUTION PLAN - PAIKAR MART

This plan outlines the strictly frontend implementation strategy using existing infrastructure and components.

## 1. Core Principles
- **Reuse First**: Utilize `ProductCard`, `StoreCard`, and `FeedCard` atomic components.
- **Unified API**: All portals query existing endpoints (`/api/v1/products`, `/api/v1/vendors`, etc.) applying query params for filtering.
- **Mobile-First Utility**: Maintain strict mobile-first design system adherence.
- **Zero Backend Change**: Frontend logic handles all view-layer classification/sorting.

---

## 2. Portal Implementation Matrix

| Portal | Target Pages | API Mapping | Component Reuse |
| :--- | :--- | :--- | :--- |
| **Marketplace** | Home, Search, AggregatedFeed | `/api/v1/products`, `/api/v1/vendors` | ProductCard, StoreCard |
| **Retail** | Home, Category, Detail | `/api/v1/products?type=retail` | ProductCard |
| **B2B** | Home, FactoryDir, BulkFeed | `/api/v1/products?type=wholesale` | ProductCard, StoreCard |
| **Nearby** | NearbyHome, StoreFront | `/api/v1/products?proximity=true` | ProductCard, StoreCard |
| **Services** | ServicesHome, ProviderList | `/api/v1/vendors?type=service` | StoreCard |
| **PK Shop** | Home, Collection | `/api/v1/products?isPKStore=true` | ProductCard |
| **Orders** | OrdersHome, OrderDetail | `/api/v1/orders` | (Existing) |
| **Wallet** | WalletHome, History | `/api/v1/wallet` | (Existing) |
| **Messages** | ChatList, Conversation | `/api/v1/posts` (chat context) | FeedCard |

---

## 3. Implementation Workflow

### Sprint 1: Discovery & Aggregator
- **Marketplace Portal**: Build aggregated Discovery Hub combining all commerce streams.
- **Unified Search/Filter**: Develop faceted filter controller using shared product catalog endpoint.

### Sprint 2: Core Vertical Portals
- **Retail & B2B**: Implement vertical-specific UI wrappers using shared `ProductCard`.
- **Nearby & Services**: Enable specialized vendor filtering logic via `/api/v1/vendors`.

### Sprint 3: Curated & User Operations
- **PK Shop**: Implement premium curated UI layout.
- **Wallet & Orders**: Finalize transaction monitoring and order lifecycle tracking.
- **Messages**: Finalize chat shell.

---

## 4. Integration Plan
- **Unified UI Component**: `<ProductCard>` for all listings.
- **Unified State Management**: Zentralized store `ProductProvider` to manage cached API responses, preventing redundant network requests.
- **Navigation**: Map all portals to existing portal directory structure.
