-- ============================================================================
-- Paikar Mart — Enable Row Level Security (RLS) on All Tables
-- Locking down database so anon/authenticated keys cannot read/write directly.
-- The Express backend connects with the Prisma database role (bypassing RLS).
-- ============================================================================

-- Core Tables
ALTER TABLE IF EXISTS "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "VendorProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "CartItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Wallet" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Transaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Notification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Escrow" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "FileAsset" ENABLE ROW LEVEL SECURITY;

-- Note: NO policies are created for anon or authenticated roles.
-- This ensures that any direct client-side Supabase SDK query is restricted by default.
-- Business logic and authorization MUST be handled by the Express backend, 
-- which connects with a privileged role bypassing RLS.

