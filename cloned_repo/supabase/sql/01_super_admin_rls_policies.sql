-- ============================================================================
-- Paikar Mart — Super Admin RLS Policies & Helper Functions
-- ============================================================================

-- Helper function to check if current Supabase auth user is a Super Admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM "User"
    WHERE "id" = auth.uid()::text
      AND ("role" = 'super_admin' OR "role" = 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
