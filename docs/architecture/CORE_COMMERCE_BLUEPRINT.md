# CORE COMMERCE BLUEPRINT - PAIKAR MART

This blueprint provides the architectural and user-experience framework for the core commerce portals.

---

## 1. Retail Portal (B2C)
**A. Portal Mission**: High-velocity B2C consumer retail commerce.
**B. Guest Experience**: View catalog, browse deals, filter products. Cannot add to cart, checkout, or track orders.
**C. Seller Experience**: Retail merchants, boutique shops.
**D. Required Homepage Sections**:
1. Global Search/Portal Banner
2. Flash Deals (Timer-bound)
3. Categories (Icon Grid)
4. Trending Products
5. Just For You (Personalized if logged in, Popular if guest)
**E. Required Cards**: Retail Product Card (Price, Badge), Featured Deal Card.
**F. Required Feeds**: Trending, Daily Offers, Best Sellers.
**G. Required Storefront**: Retail Shop Profile.
**H. Search & Filter**: Price range, category, brand, rating.
**I. Missing Components**: Retail-specific promotional banner module.
**J. Reusable Existing**: Product card, Category grid.

---

## 2. B2B Portal (Wholesale/Industrial)
**A. Portal Mission**: Bridge between factories/wholesalers and retailers, focused on bulk trade.
**B. Guest Experience**: View bulk product catalogs, factory profiles. Cannot view bulk-tier pricing, RFQ, or chat.
**C. Seller Experience**: Manufacturers, Distributors, Importers.
**D. Required Homepage Sections**:
1. Wholesale Market Banner
2. RFQ Quick Start
3. Featured Industries (Aggregator)
4. Bulk Deals Feed
**E. Required Cards**: Wholesale Product Card (MOQ, Price Tier), Factory Card.
**F. Required Feeds**: Industrial Spotlight, Latest Wholesale, Bulk Trends.
**G. Required Storefront**: Factory/Supplier Profile, Wholesaler Shop.
**H. Search & Filter**: Price tiers, MOQ thresholds, Material/Spec filters.
**I. Missing Components**: RFQ Submission Wizard, Tiered pricing tables.
**J. Reusable Existing**: Product Card, Store Card.

---

## 3. Services Portal
**A. Portal Mission**: Booking and provisioning professional/local services.
**B. Guest Experience**: Browse providers and services. Cannot book or make payments.
**C. Seller Experience**: Individual service providers, service agencies.
**D. Required Homepage Sections**:
1. Service Search Bar
2. Top Services (Hotlist)
3. Nearby Proximity/Urgent Services
4. Categories (Repair, Home, Pro)
**E. Required Cards**: Provider Card (Reviews/Rating), Service Card (Price range).
**F. Required Feeds**: Featured Providers, Urgent Assistance, Popular Services.
**G. Required Storefront**: Service Provider Profile.
**H. Search & Filter**: Skill/Category, Availability, Location/Radius.
**I. Missing Components**: Interactive Booking Calendar/Slot Picker.
**J. Reusable Existing**: Service Card, Rating widget.

---

## 4. Nearby Portal (Local Commerce)
**A. Portal Mission**: Hyper-local commerce with physical store engagement.
**B. Guest Experience**: View active shops within a radius, store status. Cannot order for delivery or click-and-collect.
**C. Seller Experience**: Physical shop owners (grocery, pharmacy, cafes).
**D. Required Homepage Sections**:
1. Map/ListView Toggle
2. Shops Open Near You
3. Hyper-local Deals
4. Essential Categories (Pharmacy, Grocery)
**E. Required Cards**: Local Store Card (Distance, Status), Flash Deal Alert.
**F. Required Feeds**: Nearby Deals, Popular Local Shops, Essential Services.
**G. Required Storefront**: Shop Profile (Address/Map/Opening Times).
**H. Search & Filter**: Distance, Store Category, Status (Open/Closed).
**I. Missing Components**: Live Map integration for discovery, Distance-based sorting logic.
**J. Reusable Existing**: Store Card, Category grid.

---

## 5. PK Shop Portal (Premium/Curated)
**A. Portal Mission**: PaikarMart owned and curated premium experience.
**B. Guest Experience**: Browse curated items, editorial content. Cannot checkout.
**C. Seller Experience**: Internal curators, verified premium sellers.
**D. Required Homepage Sections**:
1. Curated Editorial Hero
2. Trend Drops
3. Exclusive Collections
4. Brand Features
**E. Required Cards**: Premium Product Card (Elevated design, Badge), Editorial/Lookbook Card.
**F. Required Feeds**: Editorial Picks, Curated Drops, Style Trends.
**G. Required Storefront**: Premium/Collection Gallery Profile.
**H. Search & Filter**: Collection/Style, Curation Type.
**I. Missing Components**: High-fidelity editorial/lookbook components.
**J. Reusable Existing**: Product Card.
