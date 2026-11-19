import { createClient } from '@supabase/supabase-js';
import { backendEnv } from './env.js';

const hasValidSupabaseUrl = Boolean(
  backendEnv.supabaseUrl && !backendEnv.supabaseUrl.includes('xyzcompany')
);

export const supabase =
  hasValidSupabaseUrl && backendEnv.supabaseAnonKey
    ? createClient(backendEnv.supabaseUrl, backendEnv.supabaseAnonKey)
    : null;

/** Server-only client for Firebase-verified profile synchronization & authoritative reads. */
export const supabaseAdmin =
  hasValidSupabaseUrl && backendEnv.supabaseServiceRoleKey
    ? createClient(backendEnv.supabaseUrl, backendEnv.supabaseServiceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;
