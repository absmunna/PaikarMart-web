import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_URL.includes('xyzcompany'))
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export async function checkDatabaseConnection(): Promise<string> {
  if (!supabase) {
    return 'Supabase PostgreSQL (In-Memory Fallback Mode)';
  }
  try {
    const { error } = await supabase.from('master_products').select('id').limit(1);
    if (error) {
      return `Supabase Connected (Table Notice: ${error.message})`;
    }
    return 'Supabase PostgreSQL (Live & Connected)';
  } catch (err: any) {
    return `Supabase Connection Error: ${err.message}`;
  }
}

export async function getStoredFeedPosts(fallbackPosts: any[]) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('social_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn('Supabase feed fetch fallback to memory:', e);
    }
  }
  return fallbackPosts;
}

export async function insertStoredPost(post: { content: string; mediaUrl?: string }) {
  if (supabase) {
    try {
      await supabase.from('social_posts').insert({
        content: post.content,
        media_url: post.mediaUrl || null,
        likes_count: 0,
        shares_count: 0
      });
    } catch (e) {
      console.warn('Supabase post insert fallback to memory:', e);
    }
  }
}

export async function getStoredOrders(fallbackOrders: any[]) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn('Supabase orders fetch fallback to memory:', e);
    }
  }
  return fallbackOrders;
}

export async function insertStoredOrder(order: any) {
  if (supabase) {
    try {
      await supabase.from('orders').insert({
        subtotal: order.subtotal || 0,
        total: order.total || 0,
        status: order.status || 'confirmed',
        delivery_address: order.deliveryAddress || 'Standard Delivery',
        payment_method: order.paymentMethod || 'Cash On Delivery',
        items: order.items || []
      });
    } catch (e) {
      console.warn('Supabase order insert fallback to memory:', e);
    }
  }
}
