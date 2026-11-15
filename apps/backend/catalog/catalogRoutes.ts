import express from 'express';
import { supabaseAdmin } from '../services/dbService.js';

export const catalogRouter = express.Router();

const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const asStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string' && item.length > 0);
};

const mapListing = (listing: any) => {
  const product = listing.master_product || {};
  const store = listing.store || {};
  const images = asStringArray(listing.seller_real_photos);
  const canonicalImages = asStringArray(product.canonical_images);

  return {
    id: listing.id,
    masterProductId: listing.master_product_id,
    storeId: listing.store_id,
    storeName: store.store_name || 'Verified seller',
    storeHandle: store.handle || undefined,
    type: listing.trade_mode === 'wholesale' ? 'wholesale' : (store.category === 'grocery' ? 'grocery' : 'retail'),
    tradeMode: listing.trade_mode,
    title: product.title_en || product.title_bn || 'Untitled product',
    description: product.description || '',
    price: toNumber(listing.price),
    originalPrice: listing.original_price == null ? undefined : toNumber(listing.original_price),
    minWholesaleQty: toNumber(listing.min_wholesale_qty, 1),
    wholesaleTiers: Array.isArray(listing.wholesale_tiers) ? listing.wholesale_tiers : [],
    rating: toNumber(store.rating, 5),
    reviewsCount: 0,
    deliveryEta: listing.delivery_eta || '1-2 Days',
    proximityDistance: undefined,
    imageUrl: images[0] || canonicalImages[0] || '',
    sellerRealPhotos: images,
    galleryImages: [...new Set([...images, ...canonicalImages])],
    brand: product.brand || undefined,
    specifications: product.specifications || {},
    category: product.category || store.category || 'General',
    inStock: Boolean(listing.is_active) && toNumber(listing.stock_quantity) > 0,
    isOpen: store.is_open !== false,
    openingHoursLabel: store.opening_hours_label || undefined,
    prepMinutes: store.prep_minutes == null ? undefined : toNumber(store.prep_minutes),
    badge: product.is_verified ? 'Verified catalog' : undefined,
  };
};

/** Public catalog read model. Never returns seller PII or private credentials. */
catalogRouter.get('/products', async (_req, res) => {
  if (!supabaseAdmin) {
    res.json({ products: [], source: 'unconfigured' });
    return;
  }

  const { data, error } = await supabaseAdmin
    .from('seller_listings')
    .select(`
      id, master_product_id, store_id, price, original_price, stock_quantity,
      trade_mode, min_wholesale_qty, wholesale_tiers, seller_real_photos,
      delivery_eta, location, is_active,
      master_product:master_products!inner(title_en, title_bn, brand, category, description, canonical_images, specifications, is_verified),
      store:stores!inner(store_name, handle, category, rating, is_open, opening_hours_label, prep_minutes, status)
    `)
    .eq('is_active', true)
    .eq('store.status', 'active')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    console.error('Catalog read failed:', error.message);
    res.status(503).json({ products: [], source: 'error', error: 'Catalog is temporarily unavailable.' });
    return;
  }

  res.json({ products: (data || []).map(mapListing), source: 'supabase' });
});
