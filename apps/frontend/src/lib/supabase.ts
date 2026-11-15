import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase Client Adapter & PostgreSQL Schema Bridge
 * Configured for Supabase Free Tier (PostgreSQL + PostgREST + Realtime)
 * Includes local storage sync and graceful fallback for seamless development & offline access.
 */

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export const getSupabaseConfig = (): SupabaseConfig => {
  return {
    supabaseUrl: (import.meta as any).env?.VITE_SUPABASE_URL || 'https://xyzcompany.supabase.co',
    supabaseAnonKey: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'public-anon-key-placeholder',
  };
};

export const isSupabaseConfigured = (): boolean => {
  const cfg = getSupabaseConfig();
  return Boolean(cfg.supabaseUrl && !cfg.supabaseUrl.includes('xyzcompany') && cfg.supabaseAnonKey && !cfg.supabaseAnonKey.includes('placeholder'));
};

const config = getSupabaseConfig();

// Initialize Supabase Client
export const supabase: SupabaseClient = createClient(
  config.supabaseUrl,
  config.supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

// Local storage persistent fallback storage keys
const STORAGE_KEYS = {
  POSTS: 'nexsphere_posts_v1',
  COMMERCE: 'nexsphere_commerce_v1',
  ORDERS: 'nexsphere_orders_v1',
  BOOKINGS: 'nexsphere_bookings_v1',
  VENDOR: 'nexsphere_vendor_v1',
  USER: 'nexsphere_user_v1',
  NOTIFICATIONS: 'paikarmart_notifications_v1'
};

export const loadStoredData = <T>(key: keyof typeof STORAGE_KEYS, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(STORAGE_KEYS[key]);
    if (item) {
      return JSON.parse(item);
    }
  } catch (err) {
    console.warn('Failed to read from localStorage:', err);
  }
  return defaultValue;
};

export const saveStoredData = <T>(key: keyof typeof STORAGE_KEYS, value: T): void => {
  try {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
  } catch (err) {
    console.warn('Failed to write to localStorage:', err);
  }
};
