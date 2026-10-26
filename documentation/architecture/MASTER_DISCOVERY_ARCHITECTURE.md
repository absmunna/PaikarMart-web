# MASTER DISCOVERY ARCHITECTURE - PAIKAR MART

This document defines the architectural blueprint for the two primary portals governing user discovery and commerce initiation: the **Home Feed** (Discovery) and the **Marketplace** (Transaction Initiation).

---

## 1. HOME FEED (Social Discovery Engine)

**Mission**: Drive daily engagement, foster community, provide personalized content, and spark intent through social interactions and immersive discovery.

### Experiences
- **Guest Experience**: View public content, browse top-level feeds, watch viral reels, see trending products, interact with promo spotlights. Cannot perform direct engagement (like/comment/buy) requiring authentication.
- **Logged User Experience**: Personal content feed based on interaction history, social graph, and purchase behavior. Direct commerce through "Quick Buy" actions, community participation, and interaction with personal alerts.

### Structure & Content
- **Feed Sources**: Cross-portal social content, product launches, community discussions, nearby updates, news, active promos.
- **Post Types**: Product Showcase, Seller/Store Story, Community/News Update, Flash Deal Alert, Interactive Poll/Q&A.
- **Post Card Structure**: Metadata (author/store, timestamp), Content Body (media, text), Primary Action Bar (Like, Share, Comment, Save), Product/Store Attachment (with "Quick Buy" interaction).
- **Story System**: Top-positioned ephemeral updates (Seller stories, live trends, product drops).
- **Hero Spotlight**: Prime real estate for platform-wide campaigns, high-priority flash events, and key partnerships.
- **Apps Launcher**: Persistent entry to all platform portals (Marketplace, Retail, B2B, PK Shop, Nearby, Services, Transport, Travel, Demand, Brand Shops, Wallet, Orders, Messages, Seller Center, Admin, News).
- **Reels Integration**: Immersive video discovery for products, services, and wholesale showcases.
- **Review/Q&A System**: Must have Tabs: Tab 1 = Reviews, Tab 2 = Buyer Questions, Tab 3 = General Comments.
- **Action Bar**: Persistent quick-action tray for seamless engagement/initiation: Like, Comment, Cart, Buy Now, Save, Share.
- **Access Rules**: Author profile link opens Seller/Store Profile; attachment links open Product Details page.

### Required Homepage Section Order
1. **StoryBar** (Live/Ephemeral)
2. **AppsLauncher** (Portal Gateway)
3. **HeroSpotlight** (Primary Campaign/Banner)
4. **ReelsContainer** (Product/Service Discovery)
5. **Feed** (Personalized Commerce/Social Feed)
6. **CommunityModules** (Reviews/Q&A/Polls)

---

## 2. MARKETPLACE (Transactional Aggregator)

**Mission**: Serve as the consolidated transactional hub for the entire PaikarMart ecosystem, enabling seamless search and exploration across diverse commerce verticals.

### Architecture Definition
- **Guest Experience**: Full browse and search functionality across all portals (Retail, B2B, Services, Nearby, PK Shop, etc.), view store profiles and product details. Restricted from booking/purchasing.
- **Product Sources**: Aggregated data streams from:
    - **Retail (B2C)**: Standard consumer products.
    - **B2B (Wholesale)**: Institutional bulk goods/factories.
    - **Services**: Service marketplace offerings.
    - **Nearby**: Hyper-local store inventory.
    - **PK Shop**: Curated premium collections.
    - **Transport/Travel**: Logistics/ticketing bookings.
    - **Demand**: RFQ/Buyer sourcing marketplace.
- **Store Sources**: Aggregated profiles for registered merchants, factories, service providers, and brands.
- **Cross Portal Aggregation Rules**: Standardized data model (`MarketplaceProduct`, `MarketplaceStore`) used for cross-portal visibility, tagged clearly by domain origin to ensure transactional context (e.g., "Wholesale/B2B", "Nearby/Local", "B2C/Retail").

### Required Homepage Section Order
1. **PortalIconBar** (Domain Navigation/Filter Gateway)
2. **GlobalSearch** (Faceted Search Bar)
3. **CuratedAggregates** (Cross-portal Trending/Recommended)
4. **Retail Products Feed**
5. **Wholesale Products Feed**
6. **Services Feed**
7. **Digital Products Feed**
8. **Nearby Products Feed**
9. **Transport Services Feed**
10. **Travel Offers Feed**
11. **Demand Requests Feed**
12. **PK Shop Collections Feed**
13. **GlobalFooter** (Help/Support/Platform Info)

### Component Definitions
- **Product Cards**: Unified structure (Image, Title, Price with currency context, Domain Provenance Badge, Primary Action).
- **Store Cards**: Unified structure (Banner/Logo, Store Name, Rating/Verification Badge, Proximity/Domain Tag, Quick View).
- **Service Cards**: Unified structure (Service Name, Provider Name, Price Range/Review Badge, Availability Tag).
- **Factory/Company/Supplier/Wholesaler Cards**: Unified structure (Entity Name, Industry/Spec Tag, Verification Tier, MOQ/CAPACITY context). Mandated for use in Marketplace and B2B portals.

### Search & Sorting Strategy
- **Search**: Faceted/Full-text search engine index acting across all portal datasets.
- **Filters**: Dynamic faceted filtering based on selection (e.g., "Nearby" selection activates "Proximity" filter; "B2B/Wholesale" activates "MOQ/Pricing" filters).
- **Sorting**: Multi-vector relevance ranking (Popularity, Proximity, Price, Verified status, Timeliness).
