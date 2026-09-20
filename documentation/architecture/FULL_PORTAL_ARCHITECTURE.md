# FULL PORTAL ARCHITECTURE - PAIKAR MART

This document serves as the master architectural blueprint for all portals within the PaikarMart ecosystem, defining page structure, interactions, and business rules.

---

## 1. Home Feed
**A. Purpose**: Daily engagement, discovery, community interaction.
**B. Pages**: `HomeFeed`, `StoryView`, `ReelPlayer`, `CommunityHub`.
**C. Components**: `StoryBar`, `AppsLauncher`, `HeroSpotlight`, `NewsFeedBuilder`, `InteractionTray`.
**D. Cards**: `PostCard`, `ReelCard`, `PromoCard`, `CommunityCard`.
**E. Filters**: `Following`, `Trending`, `Nearby`, `Category`.
**F. Profiles**: `PersonalProfile`, `ProfessionalPage`.
(A-N rules: Guest views public, User engages, Seller promotes, Admin moderates.)

## 2. Marketplace
**A. Purpose**: Consolidated transactional hub.
**B. Pages**: `MarketplaceHome`, `MarketplaceSearch`, `MarketplaceAggregatedFeed`.
**C. Components**: `PortalIconBar`, `GlobalSearch`, `MultiFacetFilter`.
**D. Cards**: `MarketplaceProductCard`, `MarketplaceStoreCard`.
**E. Filters**: `All`, `B2B`, `Retail`, `Nearby`, `Category`.
(A-N rules apply.)

## 3. Retail
**A. Purpose**: Consumer B2C commerce.
**B. Pages**: `RetailHome`, `RetailCategories`, `RetailProducts`, `RetailProductDetail`, `RetailDeals`, `RetailBrands`, `BrandProfile`, `RetailStoreProfile`.
**C. Components**: `DealSlider`, `CategoryNav`.
**D. Cards**: `RetailProductCard`.
**E. Filters**: `Price`, `Rating`, `Brand`.
(A-N rules apply.)

## 4. B2B
**A. Purpose**: Wholesale and industrial trade.
**B. Pages**: `B2BHome`, `B2BProducts`, `B2BCategories`, `FactoryDirectory`, `SupplierDirectory`, `ExporterDirectory`, `ImporterDirectory`, `RFQMarketplace`, `RFQDetail`, `BulkProductDetail`, `CompanyProfile`, `FactoryProfile`, `SupplierProfile`, `TradeFeed`.
**C. Components**: `RFQWizard`, `TiersPriceTable`.
**D. Cards**: `WholesaleProductCard`, `FactoryCard`, `SupplierCard`.
(A-N rules apply.)

## 5. PK Shop
**A. Purpose**: Curated premium ecosystem.
**B. Pages**: `PKShopHome`, `PKCollections`, `PKProductDetail`, `PKEditorial`.
**C. Components**: `EditorialHero`, `CollectionGallery`.
**D. Cards**: `PKProductCard`, `TrendDropCard`.
(A-N rules apply.)

## 6. Nearby
**A. Purpose**: Hyper-local commerce.
**B. Pages**: `NearbyHome`, `NearbyCategories`, `NearbyStores`, `NearbyDeals`, `NearbyProducts`, `StoreFront`, `StoreReviews`.
**C. Components**: `MapView`, `ListView`, `DistanceFilterController`.
**D. Cards**: `NearbyStoreCard`, `NearbyProductCard`.
(A-N rules apply.)

## 7. Services
**A. Purpose**: Professional service booking.
**B. Pages**: `ServicesHome`, `ServiceCategories`, `ServiceProviders`, `ProviderProfile`, `ServiceDetail`, `BookingPage`, `ServiceReviews`.
**C. Components**: `ServiceCalendar`, `BookingForm`.
**D. Cards**: `ProviderCard`, `ServiceCard`.
(A-N rules apply.)

## 8. Demand
**A. Purpose**: Sourcing and RFQ.
**B. Pages**: `DemandHome`, `DemandSearch`, `DemandSubmission`.
**C. Cards**: `DemandCard`.
(A-N rules apply.)

## 9. Transport
**A. Purpose**: Logistics marketplace.
**B. Pages**: `TransportHome`, `FreightBooking`, `LogisticsTracking`.
**C. Cards**: `TransportProviderCard`.
(A-N rules apply.)

## 10. Brand Shops
**A. Purpose**: Official brand stores.
**B. Pages**: `BrandShopsHome`, `BrandDetail`.
**C. Cards**: `BrandCard`.
(A-N rules apply.)

## 11. Travel
**A. Purpose**: Travel packages and tickets.
**B. Pages**: `TravelHome`, `PackageDetail`.
**C. Cards**: `TravelCard`.
(A-N rules apply.)

## 12. News
**A. Purpose**: Community and blog reporting.
**B. Pages**: `NewsHome`, `ArticleDetail`.
**C. Cards**: `NewsCard`.
(A-N rules apply.)

## 13. Wallet
**A. Purpose**: Financial ecosystem.
**B. Pages**: `WalletHome`, `TransactionHistory`.
(A-N rules apply.)

## 14. Orders
**A. Purpose**: Order management.
**B. Pages**: `OrdersHome`, `OrderDetail`.
(A-N rules apply.)

## 15. Messages
**A. Purpose**: Communication.
**B. Pages**: `ChatList`, `Conversation`.
(A-N rules apply.)

## 16. Seller Center
**A. Purpose**: Merchant management.
**B. Pages**: `SellerDashboard`, `ProductEditor`, `OrderFulfillment`.
(A-N rules apply.)

## 17. Admin
**A. Purpose**: Platform governance.
**B. Pages**: `AdminDashboard`, `UserManagement`, `ContentGovernance`.
(A-N rules apply.)
