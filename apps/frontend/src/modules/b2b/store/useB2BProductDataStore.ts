import { create } from 'zustand';
import { B2BProduct } from '../types/b2bTypes';

interface B2BProductState {
  products: B2BProduct[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: B2BProduct) => void;
}

export const MOCK_B2B_PRODUCTS: B2BProduct[] = [
  {
    id: 'bp-1',
    name: '১০০% সুতি জ্যাকার্ড ফেব্রিক রোল (রঙিন ডিজাইনার লট)',
    category: 'garments',
    moq: 150,
    stock: 25000,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop',
    vendorId: 'f-1',
    vendorName: 'Narayanganj Knitwear & Textile Ltd',
    isVerified: true,
    isExport: true,
    rating: 4.8,
    description: '১০০% কম্বড কাটন জ্যাকার্ড উইভিং রোল। প্রডিউসড ফর কাস্টম গার্মেন্টস এক্সপোর্ট ব্রেশার্স। চমৎকার স্থায়িত্ব এবং রং ফাঁকিহীন গ্যারান্টি।',
    specs: {
      'উপাদান (Composition)': '105% Organic Combed Cotton',
      'জিএসএম (GSM)': '180-220 GSM Premium Soft',
      'প্রস্থ (Width)': '60/62 Inches Standard Roll',
      'প্যাকেজিং (Packaging)': 'Double PVC Water-resistant Cylinder'
    },
    tierPrices: [
      { range: '150 - 499 গজ', price: 185 },
      { range: '500 - 1999 গজ', price: 172 },
      { range: '২০০০+ গজ', price: 158 }
    ]
  },
  {
    id: 'bp-2',
    name: 'এক্সপোর্ট গ্রেড সলিড হুট গোল্ডেন জুট বাইন্ডিং ব্যাগ',
    category: 'garments',
    moq: 500,
    stock: 120000,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop',
    vendorId: 'f-2',
    vendorName: 'Savar Agro-Processing Industries',
    isVerified: true,
    isExport: true,
    rating: 4.6,
    description: 'পরিবেশ বান্ধব শতভাগ জুট দিয়ে তৈরি হ্যান্ডেল সহ ভারী শপিং ব্যাগ। ইউরোপীয় মার্কেটের জন্য বিশেষভাবে ডিজাইনকৃত ক্যাচ পলিশ সম্পন্ন।',
    specs: {
      'উপাদান (Material)': 'Natural Bangladesh Grade-A Jute',
      'সাইজ (Size)': '14 x 16 x 5 inches with soft handle',
      'ক্যাপাসিটি (Capacity)': 'Holds up to 15 KG weight'
    },
    tierPrices: [
      { range: '500 - 999 পিস', price: 85 },
      { range: '1000 - 4999 পিস', price: 78 },
      { range: '৫০০০+ পিস', price: 68 }
    ]
  },
  {
    id: 'bp-3',
    name: 'স্মার্ট স্মার্ট-টেক আলট্রা ভোল্টেজ স্টেবিলাইজার PCB বোর্ড',
    category: 'electronics',
    moq: 50,
    stock: 4500,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&auto=format&fit=crop',
    vendorId: 'f-3',
    vendorName: 'Gazipur Smart-Tech Assembling Line',
    isVerified: true,
    isExport: false,
    rating: 4.7,
    description: 'হাই-ইফিসিয়েন্সি মাইক্রো চিপসেট চালিত ভোল্টেজ স্টেবিলাইজার প্রিন্টেড সার্কিট বোর্ড। ডমেস্টিক ও রিটেইল ফ্রিজ-টিভি স্টেবিলাইজারের জন্য সেরা।',
    specs: {
      'ইনপুট ভোল্টেজ (Input)': '140V - 260V range converter',
      'আউটপুট ফ্রিকোয়েন্সি (Freq)': '50Hz Smart Wave Auto Shield',
      'সুরক্ষা (Protection)': 'Short-Circuit & Over-heat Cutoff'
    },
    tierPrices: [
      { range: '50 - 199 কার্টন', price: 650 },
      { range: '200 - 499 কার্টন', price: 580 },
      { range: '৫০০+ কার্টন', price: 520 }
    ]
  },
  {
    id: 'bp-4',
    name: 'আমদানিকৃত ভিয়েতনামি গোল মরিচ লট (Black Pepper Bulk)',
    category: 'agro',
    moq: 100,
    stock: 15000,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop',
    vendorId: 's-4',
    vendorName: 'Khatunganj Trading & Spice Importers',
    isVerified: true,
    isExport: false,
    rating: 4.5,
    description: 'ভিয়েতনাম থেকে আমদানি করা বড় দানার সুগন্ধি কালো গোলমরিচ। চাটগাঁ পোর্টে কাস্টমস ছাড় পাওয়া ১০০% ক্ষতিকারক কেমিক্যালমুক্ত লট।',
    specs: {
      'উৎপত্তি (Origin)': 'Vietnam Premium Hill Reserves',
      'গ্রেড (Grade)': 'Grade A Double Washed Spices',
      'প্যাকিং (Packing)': '50 KG jute sacks with inner plastic shield'
    },
    tierPrices: [
      { range: '100 - 499 কেজি', price: 420 },
      { range: '500 - 999 কেজি', price: 395 },
      { range: '১০০০+ কেজি', price: 375 }
    ]
  },
  {
    id: 'bp-5',
    name: 'ইসলামপুরী সুতি প্রিণ্ট থান ভয়েল (ডাবল লট কাপল থ্রি-পিস রোল)',
    category: 'garments',
    moq: 200,
    stock: 8000,
    image: 'https://images.unsplash.com/photo-1524295981997-ec4f540702e5?w=400&auto=format&fit=crop',
    vendorId: 's-5',
    vendorName: 'Islampur Textile Brokerage & Fabrics',
    isVerified: false,
    isExport: false,
    rating: 4.4,
    description: 'ঐতিহ্যবাহী ইসলামপুরের জনপ্রিয় কটন ভয়েল ফেব্রিক রোলস। রিটেইল দোকানে পাইকারি কাটার জন্য এবং বুটিক ডিজাইনারদের কাস্টম মেটেরিয়াল হিসেবে আইডিয়াল।',
    specs: {
      'মেটেরিয়াল (Material)': '80% Soft Local Cotton & Polyester Blend',
      'দৈর্ঘ্য (Length)': '120 Gaz (Yards) per bundle pack'
    },
    tierPrices: [
      { range: '200 - 499 গজ', price: 120 },
      { range: '500 - 999 গজ', price: 112 },
      { range: '১০০০+ গজ', price: 95 }
    ]
  }
];

export const useB2BProductDataStore = create<B2BProductState>((set, get) => ({
  products: MOCK_B2B_PRODUCTS,
  isLoading: false,
  error: null,
  fetchProducts: async () => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    set({ products: MOCK_B2B_PRODUCTS, isLoading: false });
  },
  addProduct: (product) => set((state) => ({ products: [product, ...state.products] })),
}));
