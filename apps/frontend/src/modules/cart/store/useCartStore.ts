import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { CartItem, CommerceDomain } from '../types';

interface CartStore {
  items: CartItem[];
  addItem: (item: any) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  clearDomainCart: (domain: string) => void;

  // Selectors
  getTotalPrice: () => number;
  getTotalItems: () => number;
  getTotalCoins: () => number;
  getTotal: () => number;
  getDomainItems: (domain: string) => CartItem[];
  getDominantDomain: () => CommerceDomain;
  getSellerGroups: () => Record<string, CartItem[]>;
}

// Global browser event launcher for event-driven coordination
const emitCartEvent = (eventName: string, data?: any) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(eventName, { detail: data }));
  }
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          const id = newItem.id;
          const moq = newItem.moq || 1;
          const qtyToAdd = newItem.quantity || moq;
          const maxStock = newItem.stock || 9999;

          const existingItem = state.items.find(item => item.id === id);
          let updatedItems;

          if (existingItem) {
            const currentQty = existingItem.quantity || 0;
            const targetQty = currentQty + qtyToAdd;

            if (targetQty > maxStock) {
              toast.error(`Cannot add more than stock limit (${maxStock})`);
              return state;
            }

            updatedItems = state.items.map(item =>
              item.id === id
                ? { ...item, quantity: targetQty }
                : item
            );
            toast.success('Cart updated');
          } else {
            // Apply MOQ immediately if adding first time
            const itemToPush: CartItem = {
              id: newItem.id,
              sourceId: newItem.sourceId || newItem.id,
              name: newItem.name || newItem.title || 'পণ্য',
              price: Number(newItem.price) || 0,
              originalPrice: newItem.originalPrice,
              image: newItem.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
              quantity: Math.max(qtyToAdd, moq),
              stock: maxStock,
              moq: moq,
              vendorId: newItem.vendorId || newItem.sellerId || 'unknown-vendor',
              vendorName: newItem.vendorName || newItem.storeName || 'অজ্ঞাত বিক্রেতা',
              sellerId: newItem.sellerId || newItem.vendorId || 'unknown-seller',
              sellerTier: newItem.sellerTier,
              portal: newItem.portal || 'b2c',
              domain: newItem.domain || 'retail',
              tieredPricing: newItem.tieredPricing,
              coinCashback: newItem.coinCashback,
              variantInfo: newItem.variantInfo,
              metadata: newItem.metadata
            };
            updatedItems = [...state.items, itemToPush];
            toast.success(`Added to cart (MOQ: ${moq})`);
          }

          return { items: updatedItems };
        });

        emitCartEvent('CART_UPDATED', { items: get().items });
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter(item => item.id !== id) }));
        emitCartEvent('CART_UPDATED', { items: get().items });
      },

      updateQuantity: (id, quantity) => {
        set((state) => {
          const item = state.items.find(i => i.id === id);
          if (!item) return state;

          const moq = item.moq || 1;
          const maxStock = item.stock || 9999;

          if (quantity < moq) {
            toast.error(`Minimum order quantity for this item is ${moq}`);
            return state;
          }

          if (quantity > maxStock) {
            toast.error(`Limited stock. Max: ${maxStock}`);
            return state;
          }

          return {
            items: state.items.map(i =>
              i.id === id ? { ...i, quantity } : i
            )
          };
        });

        emitCartEvent('CART_UPDATED', { items: get().items });
      },

      clearCart: () => {
        set({ items: [] });
        emitCartEvent('CART_UPDATED', { items: [] });
      },

      clearDomainCart: (domain) => {
        set((state) => ({ items: state.items.filter(i => i.domain !== domain) }));
        emitCartEvent('CART_UPDATED', { items: get().items });
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          let currentPrice = item.price;
          // Apply tiered pricing if available
          if (item.tieredPricing && item.tieredPricing.length > 0) {
            const tiers = [...item.tieredPricing].sort((a, b) => b.minQty - a.minQty);
            const applicableTier = tiers.find(t => item.quantity >= t.minQty);
            if (applicableTier) {
              currentPrice = applicableTier.price;
            }
          }
          return total + (currentPrice * item.quantity);
        }, 0);
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalCoins: () => {
        return get().items.reduce((total, item) => total + ((item.coinCashback || 0) * item.quantity), 0);
      },

      getTotal: () => get().getTotalPrice(),

      getDomainItems: (domain) => get().items.filter(i => i.domain === domain),

      getDominantDomain: () => {
        const items = get().items;
        if (items.length === 0) return 'retail';

        const counts: Record<string, number> = {};
        items.forEach(item => {
          const d = item.domain || 'retail';
          counts[d] = (counts[d] || 0) + item.quantity;
        });

        let dominant: CommerceDomain = 'retail';
        let max = 0;

        Object.entries(counts).forEach(([domain, count]) => {
          if (count > max) {
            max = count;
            dominant = domain as CommerceDomain;
          }
        });

        return dominant;
      },

      getSellerGroups: () => {
        const groups: Record<string, CartItem[]> = {};
        get().items.forEach(item => {
          const sellerName = item.vendorName || 'General';
          if (!groups[sellerName]) groups[sellerName] = [];
          groups[sellerName].push(item);
        });
        return groups;
      }
    }),
    {
      name: 'pm-cart-storage-v2',
    }
  )
);

// Unified alias for Commerce Cart
export const useCommerceCartStore = useCartStore;
