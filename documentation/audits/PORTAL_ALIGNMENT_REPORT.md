# PORTAL ARCHITECTURE ALIGNMENT REPORT - PAIKAR MART

This report evaluates current portal implementations against the defined PaikarMart vision.

---

## 1. Marketplace (Vision: All commerce items)
1. **Current**: Partially implemented as a generic catalog.
2. **Expected**: Aggregation hub for all products across portals.
3. **Missing**: Cross-portal aggregate product feed.
4. **Placement**: Correct.
5. **Feeds**: Missing aggregated trending products.
6. **Cards**: Missing composite product cards.
7. **Storefronts**: Needs global storefront aggregator.
8. **Search/Filter**: Missing multi-dimensional faceted search (e.g., filter by portal origin, category, price, seller).
9. **Guest UX Gap**: Lacks comprehensive view of platform offerings.

## 2. Retail (Vision: B2C products)
1. **Current**: B2C modules exist in `modules/retail-b2c`.
2. **Expected**: Pure B2C transaction engine.
3. **Missing**: Dedicated retail-specific landing page.
4. **Placement**: Needs to be its own portal.
5. **Feeds**: Missing consumer trends.
6. **Cards**: Needs retail-specific discount cards.
7. **Storefronts**: None.
8. **Search/Filter**: Needs retail-specific filters.
9. **Guest UX Gap**: Inconsistent experience compared to marketplace.

## 3. B2B (Vision: Factories, wholesale, RFQ)
1. **Current**: `portals/b2b` and `portals/wholesale`.
2. **Expected**: Unified B2B wholesale platform.
3. **Missing**: Unified RFQ management, factory profiles.
4. **Placement**: Consolidate `b2b` and `wholesale` portals.
5. **Feeds**: Missing bulk trade alerts.
6. **Cards**: Missing supplier verification badges.
7. **Storefronts**: Missing factory storefronts.
8. **Search/Filter**: Missing bulk unit filters.
9. **Guest UX Gap**: Needs B2B-specific landing.

## 4. PK Shop (Vision: Curated ecosystem)
1. **Current**: `portals/pk-shop` and `portals/pk-store`.
2. **Expected**: Premium branded PaikarMart curated experience.
3. **Missing**: Unified curation engine.
4. **Placement**: Consolidate into one portal.
5. **Feeds**: Missing curated drops.
6. **Cards**: Missing premium badges.
7. **Storefronts**: Needs dedicated curated shop.
8. **Search/Filter**: Missing style/curation-based filters.
9. **Guest UX Gap**: Needs premium branding focus.

## 5. Brand Shop (Vision: Own brand seller)
1. **Current**: `portals/brand-shops`.
2. **Expected**: Aggregator for all brand-specific storefronts.
3. **Missing**: Enhanced brand storefront features.
4. **Placement**: Correct.
5. **Feeds**: Missing new brand launches.
6. **Cards**: Needs brand logo-centric cards.
7. **Storefronts**: Correct.
8. **Search/Filter**: Needs brand-level filtering.
9. **Guest UX Gap**: Needs a search-by-brand navigation.

## 6. Local News (Vision: News/Blog)
1. **Current**: `portals/news`.
2. **Expected**: Public reporting and community blog.
3. **Missing**: Integrated feed from social feeds.
4. **Placement**: Correct.
5. **Feeds**: Missing local community highlights.
6. **Cards**: Needs blog-card layout.
7. **Storefronts**: None.
8. **Search/Filter**: Needs topic-based filters.
9. **Guest UX Gap**: Needs clearer engagement (like/share).

## 7. Services (Vision: Service marketplace)
1. **Current**: `portals/services`.
2. **Expected**: Pure service booking engine.
3. **Missing**: Appointment management.
4. **Placement**: Correct.
5. **Feeds**: Missing featured services.
6. **Cards**: Missing provider credential cards.
7. **Storefronts**: Needs provider storefronts.
8. **Search/Filter**: Needs skill/location-based filters.
9. **Guest UX Gap**: Limited booking visibility.

## 8. Transport (Vision: Logistics/Ride marketplace)
1. **Current**: `portals/ride`.
2. **Expected**: Unified logistics portal.
3. **Missing**: Freight booking.
4. **Placement**: Need to consolidate ride/logistics.
5. **Feeds**: Missing real-time transport stats.
6. **Cards**: Needs driver/vehicle cards.
7. **Storefronts**: None.
8. **Search/Filter**: Needs route-based filters.
9. **Guest UX Gap**: Needs immediate ride availability.

## 9. Travel (Vision: Travel marketplace)
1. **Current**: Not implemented.
2. **Expected**: Ticket/package travel portal.
3. **Missing**: Everything.
4. **Placement**: Create `portals/travel`.
5. **Feeds**: Missing curated trips.
6. **Cards**: Needs travel package cards.
7. **Storefronts**: Needs tour provider profiles.
8. **Search/Filter**: Needs destination filters.
9. **Guest UX Gap**: Non-existent.

## 10. Nearby (Vision: Local commerce)
1. **Current**: `portals/nearby`.
2. **Expected**: Local store commerce.
3. **Missing**: Hyper-local inventory view.
4. **Placement**: Correct.
5. **Feeds**: Missing nearby deals.
6. **Cards**: Missing shop proximity cards.
7. **Storefronts**: Needs local seller storefronts.
8. **Search/Filter**: Needs distance-based filtering.
9. **Guest UX Gap**: Needs map-based store discovery.

## 11. Demand (Vision: RFQ/Sourcing)
1. **Current**: Missing specialized portal; scattered functionality.
2. **Expected**: Unified sourcing/RFQ platform.
3. **Missing**: Everything.
4. **Placement**: Create `portals/demand`.
5. **Feeds**: Missing request feeds.
6. **Cards**: Needs demand-item cards.
7. **Storefronts**: None.
8. **Search/Filter**: Needs category-based filters.
9. **Guest UX Gap**: Non-existent.

---

## IMPLEMENTATION PRIORITY ORDER
1. **Marketplace** (Crucial for platform discovery)
2. **Nearby** (Hyper-local engagement driver)
3. **B2B** (Strategic revenue driver)
4. **Services** (High-margin ecosystem)
5. **PK Shop** (Branding and premium experience)
6. **Demand** (Essential for seller-side fulfillment)
7. **Retail** (Core consumer business)
8. **Brand Shop** (Vendor support)
9. **Transport** (Logistics fulfillment)
10. **Local News** (Engagement layer)
11. **Travel** (Future expansion)
