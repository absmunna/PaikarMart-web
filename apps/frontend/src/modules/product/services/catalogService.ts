import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  setDoc, 
  addDoc, 
  serverTimestamp,
  orderBy,
  limit,
  updateDoc
} from 'firebase/firestore';
import { db, auth, OperationType, handleFirestoreError } from '@/core/lib/firebase';
import { EcommerceProduct } from '../data/ecommerceProducts';

export interface MasterProduct {
  pmin: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  images: string[];
  specs?: Record<string, any>;
  createdBy: string;
  createdAt: any;
}

export interface SellerOffer {
  id: string;
  pmin: string;
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  sellerReviewCount: number;
  sellerLocation: string;
  sellerVerified: boolean;
  sellerSku: string;
  condition: "New" | "Refurbished" | "Open Box" | "Wholesale Lot";
  price: number;
  originalPrice?: number;
  discount?: number;
  stock: number;
  moq: number;
  unit: string;
  variants?: string[];
  colors?: string[];
  fulfillmentType: "paikar_express" | "seller_fulfilled";
  shippingFee: number;
  freeShippingAbove?: number;
  dispatchTimeDays: number;
  warranty?: string;
  isBuyBoxWinner: boolean;
  isActive: boolean;
  createdAt: any;
  updatedAt?: any;
}

export const catalogService = {
  // Search for a master product by PMIN
  async getMasterProduct(pmin: string): Promise<MasterProduct | null> {
    const path = `master_products/${pmin}`;
    try {
      const docRef = doc(db, 'master_products', pmin);
      const snap = await getDoc(docRef);
      return snap.exists() ? (snap.data() as MasterProduct) : null;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, path);
      return null;
    }
  },

  // Get all offers for a PMIN
  async getOffersForProduct(pmin: string): Promise<SellerOffer[]> {
    const path = 'seller_offers';
    try {
      const q = query(
        collection(db, 'seller_offers'), 
        where('pmin', '==', pmin),
        orderBy('price', 'asc')
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as SellerOffer));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
      return [];
    }
  },

  // Create a new master product entry
  async createMasterProduct(product: Omit<MasterProduct, 'createdBy' | 'createdAt'>): Promise<void> {
    const path = `master_products/${product.pmin}`;
    try {
      if (!auth.currentUser) throw new Error('Auth required');
      const docRef = doc(db, 'master_products', product.pmin);
      await setDoc(docRef, {
        ...product,
        createdBy: auth.currentUser.uid,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  },

  // Add or update a seller offer
  async upsertOffer(offer: Omit<SellerOffer, 'id' | 'sellerId' | 'createdAt' | 'isBuyBoxWinner' | 'isActive'>): Promise<string> {
    const path = 'seller_offers';
    try {
      if (!auth.currentUser) throw new Error('Auth required');
      
      // Check if offer already exists for this seller and PMIN
      const q = query(
        collection(db, 'seller_offers'),
        where('pmin', '==', offer.pmin),
        where('sellerId', '==', auth.currentUser.uid)
      );
      const existing = await getDocs(q);
      
      if (!existing.empty) {
        const docId = existing.docs[0].id;
        await updateDoc(doc(db, 'seller_offers', docId), {
          ...offer,
          updatedAt: serverTimestamp()
        });
        return docId;
      } else {
        const docRef = await addDoc(collection(db, 'seller_offers'), {
          ...offer,
          sellerId: auth.currentUser.uid,
          isBuyBoxWinner: false, 
          isActive: true,
          createdAt: serverTimestamp()
        });
        return docRef.id;
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
      throw err;
    }
  },

  // Seed database with mock products (Migration)
  async migrateMockProducts(products: EcommerceProduct[]): Promise<void> {
    if (!auth.currentUser) {
      console.info('Unauthenticated user: Skipping database catalog seeding.');
      return;
    }
    console.info('Starting migration of mock products to Master Catalog...');
    for (const p of products) {
      const pmin = p.asin || `PMIN-${p.id.toUpperCase()}`;
      
      try {
        // 1. Create Master Product
        const master: MasterProduct = {
          pmin,
          name: p.name,
          description: p.description || '',
          category: p.category,
          brand: (p as any).brand || 'PaikarMart',
          images: p.images || [p.image],
          specs: (p as any).specs || {},
          createdBy: auth.currentUser.uid,
          createdAt: serverTimestamp()
        };
        
        const masterRef = doc(db, 'master_products', pmin);
        const masterSnap = await getDoc(masterRef);
        if (!masterSnap.exists()) {
          await setDoc(masterRef, master);
        }

        // 2. Create Seller Offer
        const offer: Omit<SellerOffer, 'id'> = {
          pmin,
          sellerId: auth.currentUser.uid,
          sellerName: p.sellerName || auth.currentUser.displayName || 'Paikar Store',
          sellerRating: p.rating || 4.9,
          sellerReviewCount: p.reviewCount || 10,
          sellerLocation: p.sellerLocation || 'Dhaka',
          sellerVerified: p.isVerified ?? true,
          sellerSku: `SKU-${p.id.toUpperCase()}`,
          condition: "New",
          price: p.price,
          originalPrice: p.originalPrice,
          discount: p.discount,
          stock: p.stock,
          moq: p.moq || 1,
          unit: p.unit || 'pcs',
          variants: p.variants,
          colors: p.colors,
          fulfillmentType: "paikar_express",
          shippingFee: 0,
          dispatchTimeDays: 1,
          isBuyBoxWinner: true, 
          isActive: true,
          createdAt: serverTimestamp()
        };

        const q = query(
          collection(db, 'seller_offers'),
          where('pmin', '==', pmin),
          where('sellerId', '==', offer.sellerId)
        );
        const offerSnap = await getDocs(q);
        if (offerSnap.empty) {
          await addDoc(collection(db, 'seller_offers'), offer);
        }
      } catch (err) {
        console.warn(`Seeding skipped for ${pmin}:`, err);
      }
    }
    console.info('Migration complete.');
  }
};
