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

if (!isSupabaseConfigured) {
  console.info(
    'Supabase client: Running in local/offline fallback mode. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY for direct client features.'
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder-project.supabase.co', 'placeholder-anon-key');
