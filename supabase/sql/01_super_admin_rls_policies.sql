-- ============================================================================
-- Paikar Mart — Supabase RLS Guidelines & Helper Functions
-- ============================================================================

-- IMPORTANT: Paikar Mart uses Firebase Auth for identity. 
-- The standard Supabase `auth.uid()` function will return NULL because the 
-- Firebase JWT is not automatically verified by Supabase Auth.
-- Direct client-side SDK access is DISABLED for business tables by default.
-- All authorization logic lives in the Express Backend (Prisma).

-- Helper function to check for administrative roles (Internal DB use or custom bridges)
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id text)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM "User"
    WHERE "id" = user_id
      AND ("role" = 'super_admin' OR "role" = 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

