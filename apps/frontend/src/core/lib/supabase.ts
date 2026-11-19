import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isValidUrl = (url: string) => {
  try {
    return Boolean(url && typeof url === 'string' && (url.startsWith('https://') || url.startsWith('http://')) && !url.includes('placeholder') && new URL(url));
  } catch {
    return false;
  }
};

export const isSupabaseConfigured = isValidUrl(supabaseUrl) && Boolean(supabaseAnonKey);

if (!isSupabaseConfigured && typeof window !== 'undefined') {
  console.warn(
    '⚠️ Supabase client: Not configured. Direct direct database access via Supabase SDK is disabled. ' +
    'This is expected if you are relying solely on the backend API.'
  );
}

// Create client only if configured, otherwise export a proxy that throws descriptive errors
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new Proxy({} as any, {
      get: () => {
        throw new Error(
          'Supabase client accessed but not configured. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
        );
      },
    });

