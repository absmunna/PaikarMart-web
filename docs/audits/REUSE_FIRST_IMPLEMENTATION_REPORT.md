# REUSE FIRST IMPLEMENTATION REPORT - PAIKAR MART

This audit assesses the current codebase (Prisma Schema, API, Components) to determine immediate reusability, minimizing the need for new database or API structures.

---

## 1. Core Commerce State (Highly Reusable)
- **Database (Prisma)**:
    - User/Seller Models: Robust (Handles Retail, Wholesale, Factory, etc.)
    - Product Model: Highly reusable. Already has `type` (retail, wholesale, b2b), `isPKStore`, `stock`, `price`, `images`.
    - Order Model: Universal structure (Buyer, Seller, Items, VAT, Shipping).
    - Content/Post/Feed: Rich models (`Post`, `ContentItem`, `ContentComment`) ready for any portal feed.
    - Wallet: Full transaction system existing.
- **API Endpoints**:
    - `/api/v1/products`: Can be extended with query params for category/type filtering for all commerce portals.
    - `/api/v1/vendors`: Handles stores. Easily adaptable for Factory/Supplier/Service Provider profiles.
    - `/api/v1/posts`: Foundation for all Feed discovery modules.

## 2. Immediate Reuse Candidates (Pages/Components)
- **ProductCard**: Use for *all* commerce portals (just consume different props).
- **StoreCard**: Adaptable for Factory/Supplier/Service Provider cards.
- **Faceted Search/Filter**: Current `/products` endpoint logic should be centralized and expanded for faceted filtering to power the Marketplace home.

## 3. High Priority Reuse Strategy
- **Portals**:
    - *Retail/Marketplace*: Use shared `/api/v1/products` endpoints.
    - *B2B*: Reuse Product + Vendor endpoints; just map factory profiles to `SellerProfile` model attributes in the frontend logic.
    - *Nearby*: Use existing `@index` filters on Product (`district`, `upazila`) for proximity.
- **Components**:
    - Atomic components (`ProductCard`, `Button`, `Input`) are ready. No new atomic UI needed.

## 4. Implementation Gap (To be Extended, NOT Created from Scratch)
- **Missing Pages**: Infrastructure defined (`RetailHome`, etc.), but pages need directory scaffolding (scaffolding only).
- **API Extension**: Extend existing endpoints (e.g., add `?portal=nearby` query param) instead of creating new `/api/v1/nearby/products`.
- **Portal logic**: Add portal-specific `filter` logic in the frontend `services` instead of altering DB models.

## 5. Conclusion
- **Reuse (80%)**: We can build 80% of the portal requirements leveraging existing User/Product/Order/Post models.
- **Extend (15%)**: Extend API querying logic and frontend filters.
- **Create (5%)**: New page scaffolding + some UI wrappers.

**Recommendation**: Proceed with page building by consuming existing endpoints with expanded query parameters.
