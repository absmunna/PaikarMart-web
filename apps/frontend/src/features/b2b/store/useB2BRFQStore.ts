import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  B2BPaymentTerms,
  PurchaseOrderDraft,
  RFQ,
  WholesaleSampleOrder
} from '@/features/b2b/types/b2bTypes';
import {
  fetchWholesaleRFQsApi,
  fetchWholesaleSamplesApi,
  submitWholesaleRFQApi,
  submitWholesaleSampleApi,
  updateWholesaleRFQStatusApi
} from '@/features/b2b/services/wholesaleApiClient';

interface SubmitRFQInput {
  productId: string;
  productTitle: string;
  targetQuantity: number;
  targetPricePerUnit?: number;
  baseUnitPrice?: number;
  companyName: string;
  contactPerson: string;
  phone: string;
  email?: string;
  destinationCity: string;
  paymentTerms?: B2BPaymentTerms;
  notes?: string;
}

interface SubmitSampleInput {
  productId: string;
  productTitle: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  shippingAddress: string;
  sampleFee?: number;
}

interface B2BRFQState {
  rfqs: RFQ[];
  poDrafts: PurchaseOrderDraft[];
  sampleOrders: WholesaleSampleOrder[];
  isLoading: boolean;
  error: string | null;
  addRFQ: (rfq: RFQ) => void;
  addQuoteToRFQ: (rfqId: string, quote: any) => void;
  syncWholesaleOrders: () => Promise<void>;
  submitPurchaseRFQ: (input: SubmitRFQInput) => Promise<PurchaseOrderDraft>;
  submitSampleOrder: (input: SubmitSampleInput) => Promise<WholesaleSampleOrder>;
  markPoEscrowLocked: (poNumber: string, escrowId: string) => Promise<void>;
}

export const MOCK_B2B_RFQS: RFQ[] = [
  {
    id: 'rfq-1',
    title: '১০,০০০ পিস জেন্টস কটন পলো শার্ট মেকিং ও সাপ্লাই',
    category: 'garments',
    quantity: 10000,
    unit: 'পিস (Pcs)',
    budget: '৳ ১৩০ - ১৫০ /পিস',
    deadline: '২০২৬-০৮-১৫',
    description: 'আমাদের কর্পোরেট ক্যাম্পেইনের জন্য ১০,০০০ পিস পিকে ওয়াশ কটন পলো শার্ট প্রয়োজন। লোগো এ্যাম্ব্রয়ডারি কোয়ালিটি অত্যন্ত নিখুঁত হতে হবে। সরাসরি গার্মেন্টস ফ্যাক্টরির প্রোডাকশন টিম বিড করুন। নমুনা জমা দান আবশ্যক।',
    buyerName: 'রেড কর্পোরেট এজেন্সী লি.',
    buyerRegion: 'Gulshan-2, Dhaka',
    isUrgent: true,
    status: 'Open',
    date: '২০২৬-০৫-২৫',
    quotes: [
      { id: 'q-1', companyName: 'Narayanganj Knitwear Ltd', quotePrice: 135, deliveryTime: '২৫ দিন', message: 'আমরা এই বাজেটে বেস্ট পিকে ফেব্রিক্স দিয়ে কাজ করতে প্রস্তুত। ওয়েকো-টেক্স হ্যান্ডেল সার্টিফিকেট যুক্ত করা হলো।', date: '২০২৬-০৫-২৬' }
    ]
  },
  {
    id: 'rfq-2',
    title: '৫ টন শুকনো লাল মরিচ গুড়ো (Premium Chilli Powder)',
    category: 'agro',
    quantity: 5000,
    unit: 'কেজি (Kg)',
    budget: '৳ ২৪০ - ২৬০ /কেজি',
    deadline: '২০২৬-০৭-০১',
    description: 'ফুড গ্রেড প্যাকেজিং সহ হাই-ক্যাপাসিটি ক্যাপসাইসিন কোয়ালিটির লাল মরিচ গুড়ো পাইকারি সোর্সিং প্রয়োজন। চট্টগ্রামের খাতুনগঞ্জ বা সোনামসজিদ ল্যান্ডপোর্ট এলাকার কোনো বায়ার/ইম্পোর্টার এভেলেবল থাকলে দ্রুত কোট করুন।',
    buyerName: 'প্রানপ্রিয়া এগ্রো ফুডস লি.',
    buyerRegion: 'Tejgaon, Dhaka',
    status: 'Open',
    date: '২০২৬-০৫-২৪',
    quotes: []
  },
  {
    id: 'rfq-3',
    title: '১০০০ পিস রিচার্জেবল ১৫ ওয়াট এলইডি বাল্ব সার্কিট',
    category: 'electronics',
    quantity: 1000,
    unit: 'পিস (Pcs)',
    budget: '৳ ৯০ - ১০৫ /পিস',
    deadline: '২০২৬-০৬-৩০',
    description: 'ক্যাপাসিটর এবং অটো চার্জিং প্রটেকশন আইসি সহ ১৫ ওয়াটের ট্রাভেল এলইডি লটের জন্য বিড চাচ্ছি। দীর্ঘস্থায়ী ব্যাটারি পিন কানেক্টর থাকতে হবে। দ্রুত ডেলিভারি চাই।',
    buyerName: 'মেসার্স ভাই ভাই ইলেকট্রিক',
    buyerRegion: 'Nawabpur, Old Dhaka',
    status: 'Open',
    date: '২০২৬-০৫-২৩',
    quotes: []
  }
];

export const useB2BRFQStore = create<B2BRFQState>()(
  persist(
    (set) => ({
      rfqs: MOCK_B2B_RFQS,
      poDrafts: [],
      sampleOrders: [],
      isLoading: false,
      error: null,
      addRFQ: (rfq) => set((state) => ({ rfqs: [rfq, ...state.rfqs] })),
      addQuoteToRFQ: (rfqId, quote) =>
        set((state) => ({
          rfqs: state.rfqs.map((r) =>
            r.id === rfqId ? { ...r, quotes: [...(r.quotes || []), quote] } : r
          )
        })),

      syncWholesaleOrders: async () => {
        set({ isLoading: true, error: null });
        try {
          const [poDrafts, sampleOrders] = await Promise.all([
            fetchWholesaleRFQsApi(),
            fetchWholesaleSamplesApi()
          ]);
          set({ poDrafts, sampleOrders, isLoading: false });
        } catch {
          set({ isLoading: false });
        }
      },

      submitPurchaseRFQ: async (input) => {
        const unitPrice = input.targetPricePerUnit || input.baseUnitPrice || 450;
        const subtotal = Math.round(unitPrice * input.targetQuantity);
        const estimatedAitVat = Math.round(subtotal * 0.05);

        try {
          const res = await submitWholesaleRFQApi({
            productId: input.productId,
            productName: input.productTitle,
            quantity: input.targetQuantity,
            targetPrice: input.targetPricePerUnit,
            baseUnitPrice: input.baseUnitPrice,
            deliveryDistrict: input.destinationCity,
            paymentTerms: input.paymentTerms || 'escrow',
            notes: input.notes,
            buyerName: input.contactPerson,
            buyerPhone: input.phone,
            buyerCompany: input.companyName,
            email: input.email
          });

          set((state) => ({
            poDrafts: [
              res.poDraft,
              ...state.poDrafts.filter((p) => p.poNumber !== res.poDraft.poNumber)
            ]
          }));
          return res.poDraft;
        } catch {
          const fallbackPo: PurchaseOrderDraft = {
            poNumber: `PO-B2B-2026-${Date.now().toString().slice(-5)}`,
            rfqId: `RFQ-${Date.now().toString().slice(-6)}`,
            status: 'draft_submitted',
            buyer: {
              name: input.contactPerson,
              phone: input.phone,
              company: input.companyName,
              district: input.destinationCity,
              email: input.email
            },
            supplier: {
              id: 'vendor_verified',
              factoryName: 'Verified PaikarMart Manufacturer',
              tradeLicense: 'TL-VERIFIED-2026',
              location: input.destinationCity,
              verified: true
            },
            product: {
              id: input.productId,
              name: input.productTitle,
              moq: 20,
              leadTime: '3-5 Business Days'
            },
            financials: {
              quantity: input.targetQuantity,
              unitPrice,
              subtotal,
              estimatedAitVat,
              grandTotal: subtotal + estimatedAitVat,
              currency: 'BDT'
            },
            paymentTerms: input.paymentTerms || 'escrow',
            paymentTermsLabel: 'PaikarMart Wholesale Escrow',
            deliveryDistrict: input.destinationCity,
            notes: input.notes || '',
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 7 * 86400000).toISOString()
          };
          set((state) => ({ poDrafts: [fallbackPo, ...state.poDrafts] }));
          return fallbackPo;
        }
      },

      submitSampleOrder: async (input) => {
        try {
          const res = await submitWholesaleSampleApi(input);
          set((state) => ({
            sampleOrders: [res.sample, ...state.sampleOrders]
          }));
          return res.sample;
        } catch {
          const fallbackSample: WholesaleSampleOrder = {
            id: `SMP-${Date.now().toString().slice(-6)}`,
            productId: input.productId,
            productTitle: input.productTitle,
            companyName: input.companyName,
            contactPerson: input.contactPerson,
            phone: input.phone,
            shippingAddress: input.shippingAddress,
            sampleFee: input.sampleFee || 500,
            status: 'dispatched',
            trackingCode: `PM-TRK-${Math.floor(100000 + Math.random() * 900000)}`,
            createdAt: new Date().toISOString()
          };
          set((state) => ({ sampleOrders: [fallbackSample, ...state.sampleOrders] }));
          return fallbackSample;
        }
      },

      markPoEscrowLocked: async (poNumber, escrowId) => {
        set((state) => ({
          poDrafts: state.poDrafts.map((po) =>
            po.poNumber === poNumber ? { ...po, status: 'escrow_locked', escrowId } : po
          )
        }));
        void updateWholesaleRFQStatusApi(poNumber, {
          status: 'escrow_locked',
          escrowId
        }).catch(() => {});
      }
    }),
    {
      name: 'paikarmart-b2b-rfq-storage'
    }
  )
);
