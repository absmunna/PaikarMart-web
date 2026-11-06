-- ============================================================================
-- Paikar Mart — Enable Row Level Security (RLS) on All Tables
-- Locking down database so anon/authenticated keys cannot read/write directly.
-- The Express backend connects with the Prisma database role (bypassing RLS).
-- ============================================================================

-- Core Tables
ALTER TABLE IF EXISTS "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Wallet" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Transaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "SellerStore" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "DigitalAsset" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "LicenseKey" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Notification" ENABLE ROW LEVEL SECURITY;

-- Social & Content Tables
ALTER TABLE IF EXISTS "Post" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Comment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Story" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Review" ENABLE ROW LEVEL SECURITY;

-- Commerce & Hub Tables
ALTER TABLE IF EXISTS "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Vendor" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Address" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Escrow" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Demand" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "B2BRFQ" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Logistics" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "MasterProduct" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "SellerOffer" ENABLE ROW LEVEL SECURITY;

-- Note: NO policies are created for anon or authenticated roles.
-- This ensures that any direct client-side Supabase query is restricted.
