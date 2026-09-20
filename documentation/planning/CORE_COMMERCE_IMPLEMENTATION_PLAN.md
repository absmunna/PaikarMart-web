# CORE COMMERCE IMPLEMENTATION PLAN - PAIKAR MART

This plan outlines the staged implementation for the five core commerce portals based on the established master architecture.

---

## 1. Retail Portal (B2C)
- **Folder Structure**: `/src/portals/retail`
- **Pages**: `RetailHome`, `RetailProductDetail`, `RetailDeals`
- **Components**: `RetailDealsCarousel`, `CategoryGrid`, `RetailProductList`
- **Reusable**: `ProductCard`, `CategoryGrid`
- **API Dependencies**: `/api/v1/retail/products`, `/api/v1/retail/deals`
- **Missing Components**: Retail promotional banner module.
- **Feed/Marketplace/Home Integration**: Injected into Marketplace; promoted via Home Feed.

## 2. B2B Portal (Wholesale/Industrial)
- **Folder Structure**: `/src/portals/b2b` (Rename/Integrate `wholesale` here)
- **Pages**: `B2BHome`, `BulkProductDetail`, `FactoryProfile`, `RFQSubmission`
- **Components**: `WholesaleProductList`, `FactoryCard`, `RFQWizard`
- **Reusable**: `ProductCard`, `FactoryCard` (New)
- **API Dependencies**: `/api/v1/b2b/products`, `/api/v1/b2b/factories`, `/api/v1/b2b/rfq`
- **Missing Components**: RFQ Wizard, Tiered pricing tables.
- **Feed/Marketplace/Home Integration**: Injected into Marketplace; high-visibility industrial spotlight in Home Feed.

## 3. Services Portal
- **Folder Structure**: `/src/portals/services`
- **Pages**: `ServicesHome`, `ServiceDetail`, `BookingPage`
- **Components**: `ServiceList`, `ProviderCard`, `BookingCalendar`
- **Reusable**: `ServiceCard` (New), `RatingWidget`
- **API Dependencies**: `/api/v1/services`, `/api/v1/services/booking`
- **Missing Components**: Interactive calendar/slot picker.
- **Feed/Marketplace/Home Integration**: Injected into Marketplace; Featured providers in Home Feed.

## 4. Nearby Portal (Local Commerce)
- **Folder Structure**: `/src/portals/nearby`
- **Pages**: `NearbyHome`, `StoreFront`
- **Components**: `NearbyStoreList`, `NearbyDealsFeed`, `StoreMap`
- **Reusable**: `StoreCard` (New), `CategoryGrid`
- **API Dependencies**: `/api/v1/nearby/stores`, `/api/v1/nearby/deals`
- **Missing Components**: Map integration, distance sorting logic.
- **Feed/Marketplace/Home Integration**: Injected into Marketplace; "Nearby" widget for Home Feed.

## 5. PK Shop Portal (Premium/Curated)
- **Folder Structure**: `/src/portals/pk-shop`
- **Pages**: `PKShopHome`, `CollectionDetail`
- **Components**: `CuratedEditorialBanner`, `TrendDropList`
- **Reusable**: `ProductCard` (Premium variant), `EditorialCard` (New)
- **API Dependencies**: `/api/v1/pkshop/collections`, `/api/v1/pkshop/products`
- **Missing Components**: High-fidelity lookbook component.
- **Feed/Marketplace/Home Integration**: Injected into Marketplace; editorial drops in Home Feed.
