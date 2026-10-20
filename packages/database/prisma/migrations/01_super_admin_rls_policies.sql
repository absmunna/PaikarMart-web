-- =========================================================================
-- Supabase Row Level Security (RLS) Policies for Super Admin Console
-- Tables: platform_settings, payout_requests, system_logs, user_role_permissions
-- Enforces: Only authenticated users whose auth.uid() corresponds to a Super Admin
-- =========================================================================

-- Helper function to check if the current requesting session belongs to a Super Admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM "User"
    WHERE id = auth.uid()::text
      AND (role::text IN ('admin', 'super_admin', 'SUPER_ADMIN') OR email = 'abs.munna1@gmail.com')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. platform_settings
CREATE TABLE IF NOT EXISTS platform_settings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_by TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Super Admin platform_settings select policy" ON platform_settings;
CREATE POLICY "Super Admin platform_settings select policy"
  ON platform_settings
  FOR SELECT
  TO authenticated
  USING (is_super_admin());

DROP POLICY IF EXISTS "Super Admin platform_settings modify policy" ON platform_settings;
CREATE POLICY "Super Admin platform_settings modify policy"
  ON platform_settings
  FOR ALL
  TO authenticated
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- 2. payout_requests
CREATE TABLE IF NOT EXISTS payout_requests (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  seller_id TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'BDT',
  method TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  processed_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE payout_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Super Admin payout_requests policy" ON payout_requests;
CREATE POLICY "Super Admin payout_requests policy"
  ON payout_requests
  FOR ALL
  TO authenticated
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- 3. system_logs
CREATE TABLE IF NOT EXISTS system_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  level TEXT DEFAULT 'INFO',
  message TEXT NOT NULL,
  metadata JSONB,
  user_id TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Super Admin system_logs policy" ON system_logs;
CREATE POLICY "Super Admin system_logs policy"
  ON system_logs
  FOR ALL
  TO authenticated
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- 4. user_role_permissions
CREATE TABLE IF NOT EXISTS user_role_permissions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL,
  granted_by TEXT,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES "User"(id) ON DELETE CASCADE
);

ALTER TABLE user_role_permissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Super Admin user_role_permissions policy" ON user_role_permissions;
CREATE POLICY "Super Admin user_role_permissions policy"
  ON user_role_permissions
  FOR ALL
  TO authenticated
  USING (is_super_admin())
  WITH CHECK (is_super_admin());
