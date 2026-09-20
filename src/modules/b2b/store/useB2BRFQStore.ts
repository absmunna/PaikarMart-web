import { create } from 'zustand';
import { RFQ } from '../types/b2bTypes';

interface B2BRFQState {
  rfqs: RFQ[];
  isLoading: boolean;
  error: string | null;
  addRFQ: (rfq: RFQ) => void;
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

export const useB2BRFQStore = create<B2BRFQState>((set) => ({
  rfqs: MOCK_B2B_RFQS,
  isLoading: false,
  error: null,
  addRFQ: (rfq) => set((state) => ({ rfqs: [rfq, ...state.rfqs] })),
}));
