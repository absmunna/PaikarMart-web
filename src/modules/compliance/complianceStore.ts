import { create } from 'zustand';
import axios from 'axios';

// Get API URL from env variables
const API_BASE = '/api/v1/compliance';

export interface CategoryConfig {
  id: string;
  slug: string;
  name: string;
  nameBn: string;
  defaultCommission: number;
  paymentReleaseRule: string;
  deliveryBy: string;
  moqEnabled: boolean;
  returnWindowDays: number;
  requiresKyc: boolean;
  isActive: boolean;
}

export interface SellerProfile {
  id: string;
  userId: string;
  storeName: string;
  storeLogo?: string;
  storeBanner?: string;
  sellerType: string;
  nidNumber?: string;
  tradeLicenseNo?: string;
  businessPhone?: string;
  division?: string;
  district?: string;
  upazila?: string;
  addressDetails?: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  verificationBadge: 'bronze' | 'silver' | 'gold' | 'platinum';
  moderatorNote?: string;
  commissionRate: number;
  rawDocuments: string[];
}

export interface RefundSLA {
  id: string;
  orderId: string;
  userId: string;
  sellerId: string;
  reason: string;
  amount: number;
  escrowStatus: 'held' | 'released' | 'refunded';
  slaDeadline: string;
  currentStatus: 'submitted' | 'seller_accepted' | 'admin_review' | 'resolved' | 'declined';
  moderatorNotes?: string;
  createdAt: string;
}

export interface Complaint {
  id: string;
  userId: string;
  targetSellerId?: string;
  orderId?: string;
  subject: string;
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'rejected';
  resolutionNote?: string;
  createdAt: string;
  user?: { name: string; email: string };
}

interface ComplianceState {
  categories: CategoryConfig[];
  sellers: SellerProfile[];
  refunds: RefundSLA[];
  complaints: Complaint[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchCategories: () => Promise<void>;
  updateCategory: (id: string, updates: Partial<CategoryConfig>) => Promise<void>;
  fetchSellerProfile: () => Promise<SellerProfile | null>;
  submitKyc: (kycData: Partial<SellerProfile>) => Promise<void>;
  fetchAllSellers: () => Promise<void>;
  verifySeller: (userId: string, status: 'approved' | 'rejected', badge?: 'bronze' | 'silver' | 'gold' | 'platinum', note?: string) => Promise<void>;
  fetchRefunds: () => Promise<void>;
  submitRefund: (refundData: { orderId: string; sellerId: string; reason: string; amount: number }) => Promise<void>;
  updateRefundStatus: (id: string, status: RefundSLA['currentStatus'], note?: string) => Promise<void>;
  fetchComplaints: () => Promise<void>;
  submitComplaint: (complaintData: { targetSellerId?: string; orderId?: string; subject: string; description: string }) => Promise<void>;
  resolveComplaint: (id: string, status: Complaint['status'], note?: string) => Promise<void>;
}

// Simulated data to fall back if server endpoints are slow or unreachable
const INITIAL_CATEGORIES: CategoryConfig[] = [
  { id: 'ctg-wholesale', slug: 'wholesale', name: 'Wholesale (B2B Bulk)', nameBn: 'পাইকারি বাজার (B2B)', defaultCommission: 5, paymentReleaseRule: 'delivery_plus_3days', deliveryBy: 'seller', moqEnabled: true, returnWindowDays: 14, requiresKyc: true, isActive: true },
  { id: 'ctg-retail', slug: 'retail', name: 'Retail Marketplace', nameBn: 'খুচরা মার্কেটপ্লেস (B2C)', defaultCommission: 10, paymentReleaseRule: 'delivery_plus_7days', deliveryBy: 'platform', moqEnabled: false, returnWindowDays: 7, requiresKyc: true, isActive: true },
  { id: 'ctg-digital', slug: 'digital', name: 'Digital Goods & Subscriptions', nameBn: 'ডিজিটাল পণ্য ও লাইসেন্স', defaultCommission: 15, paymentReleaseRule: 'instant', deliveryBy: 'platform', moqEnabled: false, returnWindowDays: 0, requiresKyc: true, isActive: true },
  { id: 'ctg-service', slug: 'service', name: 'Milestone Freelance & Gigs', nameBn: 'ফ্রিল্যান্সিং ও গিগস সেবা', defaultCommission: 8, paymentReleaseRule: 'milestone_approved', deliveryBy: 'seller', moqEnabled: false, returnWindowDays: 3, requiresKyc: true, isActive: true },
  { id: 'ctg-nearby', slug: 'nearby', name: 'Nearby Shops (Location)', nameBn: 'निकटस्थ দোকান ও রিটেইল', defaultCommission: 3, paymentReleaseRule: 'instant_on_pickup', deliveryBy: 'customer_pickup', moqEnabled: false, returnWindowDays: 2, requiresKyc: true, isActive: true }
];

const INITIAL_SELLERS: SellerProfile[] = [
  {
    id: 'sp-demo',
    userId: 'usr-seller',
    storeName: 'Dhaka Wholesale Trading',
    sellerType: 'wholesale',
    nidNumber: '1994265673234',
    tradeLicenseNo: 'TR-2026-87989',
    businessPhone: '+8801700000000',
    division: 'Dhaka',
    district: 'Dhaka',
    upazila: 'Keraniganj',
    addressDetails: "East Aganagar, Wholesale garments lane 2",
    verificationStatus: 'pending',
    verificationBadge: 'bronze',
    commissionRate: 5,
    rawDocuments: []
  }
];

export const useComplianceStore = create<ComplianceState>((set, get) => ({
  categories: INITIAL_CATEGORIES,
  sellers: INITIAL_SELLERS,
  refunds: [
    { id: 'sla-001', orderId: 'ORD-9843', userId: 'usr-buyer', sellerId: 'usr-seller', reason: 'অর্ডারকৃত সাইজ মিলেনি', amount: 12000, escrowStatus: 'held', slaDeadline: new Date(Date.now() + 5 * 24 * 3600 * 1000).toLocaleDateString(), currentStatus: 'submitted', createdAt: new Date().toLocaleDateString() }
  ],
  complaints: [
    { id: 'comp-001', userId: 'usr-buyer', targetSellerId: 'usr-seller', orderId: 'ORD-9843', subject: 'দেরিতে ডেলিভারী', description: 'নির্দিষ্ট সময়ের ৫ দিন পার হবার পরেও মার্চেন্ট ডেলিভারী সম্পন্ন করেনি। ফোন রিসিভ করছে না।', status: 'pending', createdAt: new Date().toLocaleDateString() }
  ],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${API_BASE}/categories`);
      if (res.data && res.data.length > 0) {
        set({ categories: res.data, error: null });
      }
    } catch (e) {
      console.warn('Backend categories connection not ready, using simulated guidelines config');
    } finally {
      set({ loading: false });
    }
  },

  updateCategory: async (id, updates) => {
    set((state) => ({
      categories: state.categories.map(c => c.id === id ? { ...c, ...updates } as CategoryConfig : c)
    }));
    try {
      await axios.put(`${API_BASE}/categories/${id}`, updates);
    } catch (e) {
      console.warn('API error during category config push, local state updated');
    }
  },

  fetchSellerProfile: async () => {
    try {
      const res = await axios.get(`${API_BASE}/seller/profile`);
      return res.data;
    } catch (e) {
      // Find within mock state
      return get().sellers.find(s => s.userId === 'usr-seller') || null;
    }
  },

  submitKyc: async (kycData) => {
    set({ loading: true });
    try {
      const res = await axios.post(`${API_BASE}/seller/profile`, kycData);
      const updatedProfile = res.data.profile;
      set((state) => {
        const index = state.sellers.findIndex(s => s.userId === updatedProfile.userId);
        const updatedList = [...state.sellers];
        if (index >= 0) {
          updatedList[index] = updatedProfile;
        } else {
          updatedList.push(updatedProfile);
        }
        return { sellers: updatedList };
      });
    } catch (e) {
      // Direct mock update
      set((state) => {
        const existing = state.sellers.find(s => s.userId === 'usr-seller') || INITIAL_SELLERS[0];
        const updatedProfile = { ...existing, ...kycData, verificationStatus: 'pending' as const };
        return {
          sellers: state.sellers.map(s => s.userId === 'usr-seller' ? updatedProfile : s)
        };
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchAllSellers: async () => {
    // Standard mock or loading
    set({ loading: true });
    try {
      const res = await axios.get(`${API_BASE}/sellers`);
      if (res.data) {
        set({ sellers: res.data });
      }
    } catch (e) {
      // fallback
    } finally {
      set({ loading: false });
    }
  },

  verifySeller: async (userId, status, badge = 'bronze', note = '') => {
    set((state) => ({
      sellers: state.sellers.map(s => s.userId === userId ? { ...s, verificationStatus: status, verificationBadge: badge, moderatorNote: note } as SellerProfile : s)
    }));
    try {
      await axios.post(`${API_BASE}/seller/verify`, { userId, status, badge, note });
    } catch (e) {
      console.warn('Verify API bypassed, state updated');
    }
  },

  fetchRefunds: async () => {
    try {
      const res = await axios.get(`${API_BASE}/refunds`);
      if (res.data) set({ refunds: res.data });
    } catch (e) {
      // fallback status
    }
  },

  submitRefund: async (refundData) => {
    set({ loading: true });
    try {
      const res = await axios.post(`${API_BASE}/refunds`, refundData);
      if (res.data.refund) {
        set((state) => ({ refunds: [res.data.refund, ...state.refunds] }));
      }
    } catch (e) {
      // mock insert
      const newSLA: RefundSLA = {
        id: `sla-${Date.now()}`,
        orderId: refundData.orderId,
        userId: 'usr-buyer',
        sellerId: refundData.sellerId,
        reason: refundData.reason,
        amount: refundData.amount,
        escrowStatus: 'held',
        slaDeadline: new Date(Date.now() + 7 * 24 * 3600 * 1000).toLocaleDateString(),
        currentStatus: 'submitted',
        createdAt: new Date().toLocaleDateString()
      };
      set((state) => ({ refunds: [newSLA, ...state.refunds] }));
    } finally {
      set({ loading: false });
    }
  },

  updateRefundStatus: async (id, status, note = '') => {
    set((state) => ({
      refunds: state.refunds.map(r => r.id === id ? { ...r, currentStatus: status, moderatorNotes: note, escrowStatus: status === 'resolved' ? 'refunded' : status === 'declined' ? 'released' : 'held' } as RefundSLA : r)
    }));
  },

  fetchComplaints: async () => {
    try {
      const res = await axios.get(`${API_BASE}/complaints`);
      if (res.data) set({ complaints: res.data });
    } catch (e) {
      // fallback status
    }
  },

  submitComplaint: async (complaintData) => {
    set({ loading: true });
    try {
      const res = await axios.post(`${API_BASE}/complaints`, complaintData);
      if (res.data.complaint) {
        set((state) => ({ complaints: [res.data.complaint, ...state.complaints] }));
      }
    } catch (e) {
      const newComplaint: Complaint = {
        id: `cpl-${Date.now()}`,
        userId: 'usr-buyer',
        targetSellerId: complaintData.targetSellerId,
        orderId: complaintData.orderId,
        subject: complaintData.subject,
        description: complaintData.description,
        status: 'pending',
        createdAt: new Date().toLocaleDateString()
      };
      set((state) => ({ complaints: [newComplaint, ...state.complaints] }));
    } finally {
      set({ loading: false });
    }
  },

  resolveComplaint: async (id, status, note = '') => {
    set((state) => ({
      complaints: state.complaints.map(c => c.id === id ? { ...c, status, resolutionNote: note } as Complaint : c)
    }));
  }
}));
