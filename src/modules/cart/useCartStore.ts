import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

export type SellerTier = 'factory' | 'wholesaler' | 'local_shop';
export type CommerceDomain = 'retail' | 'b2b' | 'food' | 'pharmacy' | 'digital' | 'service';

export interface CartItem {
  id: string;
  sourceId?: string; // For compatibility with CommerceItem
  domain?: CommerceDomain | string; // For compatibility with CommerceItem
  portal?: 'pk-shop' | 'b2c' | 'b2b' | 'service' | 'logistics';
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  coinCashback?: number;
  vendorId?: string;
  vendorName?: string;
  variantInfo?: string;
  moq?: number;
  stock?: number;
  sellerId?: string;
  sellerTier?: SellerTier;
  metadata?: Record<string, any>;
}

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
  getTotal: () => number; // Compatibility for store/useCartStore
  getDomainItems: (domain: string) => any[];
  getDominantDomain: () => CommerceDomain;
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
          const qtyToAdd = newItem.quantity || 1;
          const maxStock = newItem.stock || 99;
          
          const existingItem = state.items.find(item => item.id === id);
          let updatedItems;
          
          if (existingItem) {
            const currentQty = existingItem.quantity || 1;
            const currentStock = existingItem.stock || maxStock;
            const targetQty = currentQty + qtyToAdd;
            
            if (targetQty > currentStock) {
              toast.error(`Cannot add more than stock limit (${currentStock})`);
              return state;
            }
            
            updatedItems = state.items.map(item =>
              item.id === id 
                ? { ...item, quantity: targetQty } 
                : item
            );
            toast.success('Cart updated');
          } else {
            const itemToPush: CartItem = {
              ...newItem,
              name: newItem.name || newItem.title || 'পণ্য',
              price: Number(newItem.price) || 0,
              image: newItem.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
              quantity: qtyToAdd,
              stock: maxStock,
              portal: newItem.portal || 'b2c',
              domain: newItem.domain || (
                newItem.type === 'food' || newItem.category?.toLowerCase().includes('food') ? 'food' :
                newItem.type === 'medicine' || newItem.category?.toLowerCase().includes('pharmacy') ? 'pharmacy' :
                newItem.type === 'service' ? 'service' :
                newItem.sellerTier === 'factory' || newItem.sellerTier === 'wholesaler' ? 'b2b' :
                'retail'
              )
            };
            updatedItems = [...state.items, itemToPush];
            toast.success(`Added to cart${newItem.sellerTier ? ` for ${newItem.sellerTier}` : ''}`);
          }
          
          return { items: updatedItems };
        });
        
        emitCartEvent('CART_UPDATED', { items: get().items });
      },
      
      removeItem: (id) => {
        set((state) => {
          const nextItems = state.items.filter(item => item.id !== id);
          return { items: nextItems };
        });
        emitCartEvent('CART_UPDATED', { items: get().items });
      },
      
      updateQuantity: (id, quantity) => {
        set((state) => {
          const item = state.items.find(i => i.id === id);
          if (!item) return { items: state.items };
          
          const maxStock = item.stock || 99;
          if (quantity > maxStock) {
            toast.error(`Limited stock. Max: ${maxStock}`);
            return state;
          }
          
          const boundedQuantity = Math.max(1, Math.min(maxStock, quantity));
          
          return {
            items: state.items.map(i =>
              i.id === id ? { ...i, quantity: boundedQuantity } : i
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
        set((state) => {
          const nextItems = state.items.filter(i => i.domain !== domain);
          return { items: nextItems };
        });
        emitCartEvent('CART_UPDATED', { items: get().items });
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + (item.quantity || 1), 0);
      },
      
      getTotalCoins: () => {
        return get().items.reduce((total, item) => total + ((item.coinCashback || 0) * (item.quantity || 1)), 0);
      },
      
      getTotal: () => {
        return get().getTotalPrice();
      },
      
      getDomainItems: (domain) => {
        return get().items.filter(i => i.domain === domain);
      },
      
      getDominantDomain: () => {
        const items = get().items;
        if (items.length === 0) return 'retail';
        
        const counts: Record<string, number> = {};
        items.forEach(item => {
          const d = item.domain || 'retail';
          counts[d] = (counts[d] || 0) + (item.quantity || 1);
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
      }
    }),
    {
      name: 'pm-cart-storage-unified',
    }
  )
);

// Unified alias for Commerce Cart
export const useCommerceCartStore = useCartStore;
