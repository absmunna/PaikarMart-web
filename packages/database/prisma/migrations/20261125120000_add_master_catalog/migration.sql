-- Master Catalog (PMIN) + SellerOffer — additive migration
-- Safe for live: does not alter existing Product rows beyond nullable columns

-- CreateTable MasterProduct
CREATE TABLE IF NOT EXISTS "MasterProduct" (
    "id" TEXT NOT NULL,
    "pmin" TEXT NOT NULL,
    "barcode" TEXT,
    "title" TEXT NOT NULL,
    "titleBn" TEXT,
    "brand" TEXT NOT NULL DEFAULT 'Generic',
    "category" TEXT NOT NULL,
    "categoryId" TEXT,
    "description" TEXT,
    "canonicalImages" TEXT[],
    "specifications" JSONB,
    "variantOptions" JSONB,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MasterProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable SellerOffer
CREATE TABLE IF NOT EXISTS "SellerOffer" (
    "id" TEXT NOT NULL,
    "masterProductId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "vendorId" TEXT,
    "pmin" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "originalPrice" DOUBLE PRECISION,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "moq" INTEGER NOT NULL DEFAULT 1,
    "tradeMode" TEXT NOT NULL DEFAULT 'retail',
    "wholesaleTiers" JSONB,
    "sellerPhotos" TEXT[],
    "deliveryEta" TEXT,
    "location" TEXT,
    "condition" TEXT NOT NULL DEFAULT 'New',
    "fulfillmentType" TEXT NOT NULL DEFAULT 'seller_fulfilled',
    "shippingFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isBuyBoxWinner" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SellerOffer_pkey" PRIMARY KEY ("id")
);

-- AlterTable Product (optional catalog link)
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "masterProductId" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "pmin" TEXT;

-- Indexes / uniques
CREATE UNIQUE INDEX IF NOT EXISTS "MasterProduct_pmin_key" ON "MasterProduct"("pmin");
CREATE UNIQUE INDEX IF NOT EXISTS "MasterProduct_barcode_key" ON "MasterProduct"("barcode");
CREATE INDEX IF NOT EXISTS "MasterProduct_category_idx" ON "MasterProduct"("category");
CREATE INDEX IF NOT EXISTS "MasterProduct_brand_idx" ON "MasterProduct"("brand");
CREATE INDEX IF NOT EXISTS "MasterProduct_title_idx" ON "MasterProduct"("title");

CREATE INDEX IF NOT EXISTS "SellerOffer_masterProductId_idx" ON "SellerOffer"("masterProductId");
CREATE INDEX IF NOT EXISTS "SellerOffer_sellerId_idx" ON "SellerOffer"("sellerId");
CREATE INDEX IF NOT EXISTS "SellerOffer_pmin_idx" ON "SellerOffer"("pmin");
CREATE INDEX IF NOT EXISTS "SellerOffer_isActive_isBuyBoxWinner_idx" ON "SellerOffer"("isActive", "isBuyBoxWinner");
CREATE UNIQUE INDEX IF NOT EXISTS "SellerOffer_masterProductId_sellerId_key" ON "SellerOffer"("masterProductId", "sellerId");

CREATE INDEX IF NOT EXISTS "Product_masterProductId_idx" ON "Product"("masterProductId");
CREATE INDEX IF NOT EXISTS "Product_pmin_idx" ON "Product"("pmin");

-- Foreign keys (ignore if already exist on re-run)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'SellerOffer_masterProductId_fkey'
  ) THEN
    ALTER TABLE "SellerOffer"
      ADD CONSTRAINT "SellerOffer_masterProductId_fkey"
      FOREIGN KEY ("masterProductId") REFERENCES "MasterProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'SellerOffer_sellerId_fkey'
  ) THEN
    ALTER TABLE "SellerOffer"
      ADD CONSTRAINT "SellerOffer_sellerId_fkey"
      FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'SellerOffer_vendorId_fkey'
  ) THEN
    ALTER TABLE "SellerOffer"
      ADD CONSTRAINT "SellerOffer_vendorId_fkey"
      FOREIGN KEY ("vendorId") REFERENCES "VendorProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Product_masterProductId_fkey'
  ) THEN
    ALTER TABLE "Product"
      ADD CONSTRAINT "Product_masterProductId_fkey"
      FOREIGN KEY ("masterProductId") REFERENCES "MasterProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
