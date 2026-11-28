/**
 * Shared product-detail catalog loader.
 * Order: backend /catalog/pmin → Firestore catalogService → ecommerce mock.
 */
import { catalogApi } from './catalogApi';
import { catalogService, type MasterProduct, type SellerOffer } from '@/modules/product/services/catalogService';
import { ECOMMERCE_PRODUCTS } from '@/modules/product';

export type CatalogDetailResult = {
  master: MasterProduct;
  offers: SellerOffer[];
  source: 'api' | 'firestore' | 'mock';
};

export async function loadProductCatalogDetail(id: string): Promise<CatalogDetailResult | null> {
  if (!id) return null;

  // 1) Backend master catalog
  try {
    const res = await catalogApi.getByPmin(id);
    if (res?.ok && res.master) {
      const master = res.master;
      const mappedMaster: MasterProduct = {
        pmin: master.pmin,
        name: master.title,
        description: master.description || '',
        category: master.category,
        brand: master.brand || 'PaikarMart',
        images: master.canonicalImages?.length ? master.canonicalImages : [],
        createdBy: 'api',
        createdAt: null,
      };
      const offers = (res.offers || []).map(
        (o: any) =>
          ({
            id: o.id,
            pmin: master.pmin,
            sellerId: o.seller?.id || o.sellerId || 'seller',
            sellerName:
              o.vendor?.shopName || o.seller?.fullName || o.seller?.name || 'Seller',
            sellerRating: 4.5,
            sellerReviewCount: 0,
            sellerLocation: o.location || o.vendor?.location || 'Bangladesh',
            sellerVerified: Boolean(o.vendor?.isVerified),
            sellerSku: o.id?.slice(0, 10) || 'SKU',
            condition: (o.condition as any) || 'New',
            price: Number(o.price) || 0,
            originalPrice: o.originalPrice != null ? Number(o.originalPrice) : undefined,
            stock: Number(o.stock) || 0,
            moq: Number(o.moq) || 1,
            unit: 'pcs',
            fulfillmentType:
              String(o.fulfillmentType || '').toLowerCase().includes('paikar') ||
              String(o.fulfillmentType || '').toUpperCase() === 'FBP'
                ? 'paikar_express'
                : 'seller_fulfilled',
            shippingFee: Number(o.shippingFee) || 0,
            dispatchTimeDays: 2,
            isBuyBoxWinner: Boolean(o.isBuyBoxWinner),
            isActive: true,
            createdAt: null,
          }) as SellerOffer
      );
      return { master: mappedMaster, offers, source: 'api' };
    }
  } catch (e) {
    console.warn('[loadProductCatalogDetail] API failed:', e);
  }

  // 2) Firestore legacy
  try {
    const master = await catalogService.getMasterProduct(id);
    if (master) {
      const productOffers = await catalogService.getOffersForProduct(id);
      return { master, offers: productOffers, source: 'firestore' };
    }
  } catch (e) {
    console.warn('[loadProductCatalogDetail] Firestore failed:', e);
  }

  // 3) Mock
  const mock = ECOMMERCE_PRODUCTS.find((p) => p.id === id || p.asin === id);
  if (!mock) return null;

  return {
    source: 'mock',
    master: {
      pmin: mock.asin || `PMIN-${mock.id}`,
      name: mock.name,
      description: mock.description || '',
      category: mock.category,
      brand: (mock as any).brand || 'PaikarMart',
      images: mock.images || [mock.image],
      createdBy: 'system',
      createdAt: null,
    },
    offers: [
      {
        id: 'off-mock',
        pmin: mock.asin || `PMIN-${mock.id}`,
        sellerId: 'store-1',
        sellerName: mock.sellerName,
        sellerRating: mock.rating || 5,
        sellerReviewCount: mock.reviewCount || 10,
        sellerLocation: mock.sellerLocation,
        sellerVerified: mock.isVerified ?? true,
        sellerSku: 'MOCK-SKU',
        condition: 'New',
        price: mock.price,
        originalPrice: mock.originalPrice,
        discount: mock.discount,
        stock: mock.stock,
        moq: mock.moq || 1,
        unit: mock.unit || 'pcs',
        fulfillmentType: 'paikar_express',
        shippingFee: 0,
        dispatchTimeDays: 1,
        isBuyBoxWinner: true,
        isActive: true,
        createdAt: null,
      } as any,
    ],
  };
}
