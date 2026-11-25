# PaikarMart — Master Catalog (PMIN) Design

## Goal
Amazon-style **1 Master Product : N Seller Offers** so free-tier Postgres stays small:
- One canonical title/brand/specs/images
- Many sellers attach price/stock without duplicating catalog text
- Images = Storage URLs only (never DB blobs)

## Models (Step 1 — schema only)

| Model | Role |
|---|---|
| `MasterProduct` | Canonical catalog row. Unique `pmin` (e.g. `PMIN-B08X9J4M12`) |
| `SellerOffer` | Seller-owned price/stock/MOQ/wholesale against a master |
| `Product` | **Legacy** direct listing. Optional `masterProductId` / `pmin` for gradual link |

## PMIN code
Format: `PMIN-B` + 10 alphanumeric (Amazon ASIN-like).
Generated on backend only — clients never invent trusted codes.

## Buy-Box (Step 2+)
Among `SellerOffer` where `isActive = true` for a `pmin`:
1. Prefer lowest `price` with `stock > 0`
2. Tie-break: verified vendor, lower `shippingFee`, newer offer
3. Mark winner `isBuyBoxWinner = true` (others false)

## What is NOT in DB
- Image/file binary → Supabase Storage + `FileAsset`
- Chat/feed realtime → Firestore
- Role elevation → Backend promote endpoints only

## Migration safety
- Step 1 is **additive** (new tables + optional columns on `Product`)
- Existing carts/orders on legacy `Product` keep working
- No data rewrite required to deploy schema

## Apply to Supabase (when ready)
```bash
# From monorepo root (needs DIRECT_URL for migrate)
cd packages/database
npx prisma migrate dev --name add_master_catalog
# or production:
npx prisma migrate deploy
```

Or paste generated SQL in Supabase SQL Editor (see migration folder after generate).

## Next steps
- **Step 2**: Backend module `catalog` — create master, attach offer, list by pmin, buy-box
- **Step 3**: Wire sell flow to prefer master+offer
- **Step 4**: Frontend catalog search by PMIN / multi-seller compare UI
