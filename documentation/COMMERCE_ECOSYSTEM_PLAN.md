# PaikarMart Commerce Ecosystem - Architecture Plan

## 1. Vision: "Commerce Hub First" Architecture
Transitioning from a "Category First" to a "Commerce Hub First" architecture. Instead of treating categories (Grocery, Electronics) as top-level portals, we group them into **Hubs**. Each Hub is a complete Commerce Ecosystem with tailored business logic, while sharing a unified **Commerce Layer** (Search, Store, Checkout, Order, Wallet, Tracking, Review, Notification).

## 2. Core Hubs

### 1. Marketplace Hub
Focus: National, high-volume, standardized supply chains (Product Commerce).
- **Sub Portals**: Retail, Wholesale, Digital Products, Export/Import, Brand Store, Auction (Future)
- **Categories**: Electronics, Fashion, Grocery, Furniture, Pharmacy, Books, Sports, Beauty, Pet, Automotive

### 2. Services Hub
Focus: Digital and physical professional services.
- **Sub Portals**: Home Services, Professional Services, Freelancing, Education, Healthcare, Travel, Event Services
- **Categories**: Electrician, Plumber, AC Repair, Lawyer, Doctor, Designer, Developer, Tutor, Photographer

### 3. Logistics Hub
Focus: Fulfillment, transportation, ride-sharing, and emergency logistics.
- **Sub Portals**: Ride, Delivery, Courier, Business Transport, Truck, Rent Car, Emergency, Warehouse (Future)
- **Categories**: Bike, Car, Pickup, Truck, Food Delivery, Same Day, Courier

### 4. Local Hub
Focus: Hyperlocal commerce ecosystem with dynamic radius and GPS search.
- **Sub Portals**: Local Shops, Local Services, Local General News, Local Food, Local Pharmacy, Local Business, Community Deals
- **Categories**: Nearby Grocery, Nearby Pharmacy, Nearby Restaurant, Nearby Electronics, Nearby Furniture, Nearby Tailor

### 5. Business Hub (Future)
Focus: B2B Growth, large scale corporate procurement.
- **Sub Portals**: Manufacturers, Distributors, Importers, Exporters, Corporate Buyers, Business RFQ

### 6. Community Hub
Focus: Social commerce layer integrating content, demands, and offers across all hubs.
- **Sub Portals**: Demand, Offer, General News, Video, Live, Store Updates, Promotions

## 3. Navigation & Home Page Behavior
- **Bottom Navigation**: Home | Marketplace | Apps | Messages | Profile
- **Apps Menu**: Opens a launcher to access: Marketplace Hub, Services Hub, Logistics Hub, Local Hub, Wallet, Seller Central.
- **Home Page**: A Unified Smart Feed mixing Nearby Grocery, Trending Products, Popular Services, Flash Deals, Local Offers, Delivery Updates. Users can filter to change the Hub context.

## 4. Seller & Store Behavior
- **Dynamic Role Dashboard**: A seller's dashboard adapts based on their business type without manual role switching. (e.g., Grocery seller gets Marketplace + Local Hub; Restaurant gets Local Hub + Services Hub + Logistics).
- **Universal Store Component**: A single dynamic Store UI. Tabs adapt to the seller's nature:
  - *Default*: Products, Services, Videos, Offers, Reviews, Store
  - *Logistics*: Vehicles, Coverage, Rates, Reviews
  - *Doctor*: Services, Schedule, Reviews, About

## 5. Commerce Layer Architecture
All Hubs share the same Core Commerce Engine (Components, Stores, Logic Hooks):
- Checkout
- Order Management
- Wallet
- Payment
- Tracking
- Review
- Profile
Hubs only inject their specific business logic (e.g., Radius-based instant delivery for Local Hub vs Nationwide Courier for Marketplace Hub).
