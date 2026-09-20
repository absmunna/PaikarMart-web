import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SellerKPI {
  totalSales: number;
  totalOrders: number;
  conversionRate: number;
  pendingOrders: number;
  refundRate: number;
  stockAlerts: number;
}

export interface SellerProduct {
  id: string;
  title: string;
  price: number;
  wholesalePrice?: number;
  image: string;
  stock: number;
  views: number;
  sales: number;
  conversion: number;
  isBoosted: boolean;
  status: 'active' | 'paused' | 'out_of_stock';
}

export interface SellerOrder {
  id: string;
  buyerName: string;
  amount: number;
  status: 'new' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  createdAt: string;
  itemCount: number;
}

export interface SellerAIInsight {
  id: string;
  type: 'trending' | 'price_demand' | 'refund_risk' | 'suggestion';
  message: string;
  ctaLabel: string;
  ctaAction: string;
}

export interface SellerBid {
  id: string;
  demandId: string;
  demandTitle: string;
  amount: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  message: string;
}

interface SellerDashboardState {
  kpis: SellerKPI;
  products: SellerProduct[];
  orders: SellerOrder[];
  bids: SellerBid[];
  insights: SellerAIInsight[];
  isLoading: boolean;
  
  setKPIs: (kpis: SellerKPI) => void;
  setProducts: (products: SellerProduct[]) => void;
  setOrders: (orders: SellerOrder[]) => void;
  setBids: (bids: SellerBid[]) => void;
  setInsights: (insights: SellerAIInsight[]) => void;
  setLoading: (loading: boolean) => void;
  
  addProduct: (product: SellerProduct) => void;
  updateProduct: (id: string, updates: Partial<SellerProduct>) => void;
  deleteProduct: (id: string) => void;
  updateOrder: (id: string, status: SellerOrder['status']) => void;
}

export const useSellerDashboardStore = create<SellerDashboardState>()(
  persist(
    (set) => ({
      kpis: {
        totalSales: 0,
        totalOrders: 0,
        conversionRate: 0,
        pendingOrders: 0,
        refundRate: 0,
        stockAlerts: 0,
      },
      products: [],
      orders: [],
      bids: [],
      insights: [],
      isLoading: false,

      setKPIs: (kpis) => set({ kpis }),
      setProducts: (products) => set({ products }),
      setOrders: (orders) => set({ orders }),
      setBids: (bids) => set({ bids }),
      setInsights: (insights) => set({ insights }),
      setLoading: (loading) => set({ isLoading: loading }),

      addProduct: (product) => set((state) => ({
        products: [product, ...state.products]
      })),

      updateProduct: (id, updates) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
      })),
      
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id)
      })),
      
      updateOrder: (id, status) => set((state) => ({
        orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
      })),
    }),
    {
      name: 'pm-seller-dashboard-v1',
    }
  )
);
