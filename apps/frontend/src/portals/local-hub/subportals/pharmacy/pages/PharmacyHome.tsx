import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartPulse, Search, UploadCloud, ShieldCheck,
  Plus, Check, FileText, AlertCircle, PhoneCall, CheckCircle2
} from 'lucide-react';
import { HomeHeader } from '@/design-system/components/home/HomeHeader';
import { SubPortalNav } from '@/design-system/components/navigation/SubPortalNav';
import { ProductCard } from '@/design-system/components/ui/ProductCard';
import { useCartStore } from '@/modules/cart';

interface MedicineItem {
  id: string;
  name: string;
  generic: string;
  manufacturer: string;
  price: number;
  originalPrice: number;
  packSize: string;
  type: 'otc' | 'prescription' | 'firstaid';
  image: string;
  inStock: boolean;
}

const MEDICINE_ITEMS: MedicineItem[] = [
  {
    id: 'med_1',
    name: 'Napa Extra 500mg/65mg',
    generic: 'Paracetamol + Caffeine',
    manufacturer: 'Beximco Pharmaceuticals Ltd.',
    price: 30,
    originalPrice: 35,
    packSize: '১০টি ট্যাবলেটের ১ পাতা (Strip)',
    type: 'otc',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&fit=crop',
    inStock: true
  },
  {
    id: 'med_2',
    name: 'Sergel 20mg Capsule',
    generic: 'Esomeprazole Magnesium',
    manufacturer: 'Healthcare Pharmaceuticals Ltd.',
    price: 70,
    originalPrice: 80,
    packSize: '১০টি ক্যাপসুলের স্ট্রিপ',
    type: 'otc',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&fit=crop',
    inStock: true
  },
  {
    id: 'med_3',
    name: 'One Touch Select Plus টেস্ট স্ট্রিপস',
    generic: 'Blood Glucose Test Strips (25 pcs)',
    manufacturer: 'LifeScan Diagnostics',
    price: 1150,
    originalPrice: 1300,
    packSize: '২৫টি স্ট্রিপের প্যাক',
    type: 'firstaid',
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500&fit=crop',
    inStock: true
  },
  {
    id: 'med_4',
    name: 'Savlon Antiseptic Liquid (500ml)',
    generic: 'Chlorhexidine + Cetrimide',
    manufacturer: 'ACI Limited',
    price: 185,
    originalPrice: 200,
    packSize: '৫০০ মিলি বোতল',
    type: 'firstaid',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=500&fit=crop',
    inStock: true
  },
  {
    id: 'med_5',
    name: 'Ceevit 250mg Chewable Vitamin C',
    generic: 'Ascorbic Acid (Vitamin C)',
    manufacturer: 'Square Pharmaceuticals Ltd.',
    price: 25,
    originalPrice: 30,
    packSize: '১০টি চিবানোর ট্যাবলেট',
    type: 'otc',
    image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?w=500&fit=crop',
    inStock: true
  }
];

export const PharmacyHome: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [prescriptionUploaded, setPrescriptionUploaded] = useState(false);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  const filtered = MEDICINE_ITEMS.filter((item) => {
    if (selectedFilter !== 'all' && item.type !== selectedFilter) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && !item.generic.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleUploadPrescription = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setPrescriptionUploaded(true);
    }, 1200);
  };

  const handleAddToCart = (item: MedicineItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      portal: 'b2c',
      coinCashback: Math.floor(item.price * 0.03)
    });
    setAddedItem(item.id);
    setTimeout(() => setAddedItem(null), 1500);
  };

  return (
    <div className="w-full pb-20 space-y-6 bg-[var(--pm-bg)] min-h-screen text-[var(--pm-text)] select-none">
      <HomeHeader />
      <SubPortalNav />

      <div className="flex flex-col gap-6 w-full mx-auto px-4 max-w-7xl">
        {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-900 to-blue-900 text-white p-6 sm:p-8 shadow-xl mt-4">
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-400/30 mb-3">
            <HeartPulse className="w-3.5 h-3.5" />
            ডিজিটাল ফার্মেসি ও হেলথকেয়ার
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            ১০০% জেনুইন ওষুধ ও জরুরি স্বাস্থ্যসেবা সরঞ্জাম
          </h1>
          <p className="text-xs sm:text-sm text-cyan-100 mt-2">
            DGDA নিবন্ধিত ড্রাগ লাইসেন্স প্রাপ্ত ফার্মেসি থেকে সরাসরি দ্রুত হোম ডেলিভারি।
          </p>
        </div>
      </div>

      {/* Prescription Upload Card */}
      <div className="bg-[var(--pm-surface)] border-2 border-dashed border-cyan-500/40 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[var(--pm-text)]">
              প্রেসক্রিপশন আপলোড করে সহজে ওষুধ অর্ডার করুন
            </h3>
            <p className="text-xs text-[var(--pm-text-muted)] mt-0.5">
              প্রেসক্রিপশনের ছবি দিলে আমাদের রেজিস্টার্ড ফার্মাসিস্ট যাচাই করে ওষুধ পাঠাবেন।
            </p>
          </div>
        </div>

        <div>
          {prescriptionUploaded ? (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 font-bold text-xs border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
              প্রেসক্রিপশন গ্রহণ করা হয়েছে!
            </div>
          ) : (
            <button
              onClick={handleUploadPrescription}
              disabled={isUploading}
              className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              <UploadCloud className="w-4 h-4" />
              {isUploading ? 'আপলোড হচ্ছে...' : 'প্রেসক্রিপশন দিন'}
            </button>
          )}
        </div>
      </div>

      {/* Search & Tabs */}
      <div className="flex flex-col gap-3">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pm-text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ওষুধের নাম অথবা জেনেরিক নাম দিয়ে খুঁজুন (Napa, Sergel...)"
            className="w-full bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl py-3 pl-10 pr-4 text-xs text-[var(--pm-text)] outline-none focus:border-cyan-500 shadow-xs"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar py-1">
          {[
            { id: 'all', label: 'সব প্রোডাক্ট' },
            { id: 'otc', label: 'OTC সাধারণ ওষুধ' },
            { id: 'firstaid', label: 'ফার্স্ট এইড ও ডায়াবেটিস' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedFilter === tab.id
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-[var(--pm-surface)] text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] border border-[var(--pm-border)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Medicine Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map((item) => (
          <ProductCard
            key={item.id}
            product={{
              ...item,
              portal: 'pharmacy',
              vendorName: item.manufacturer
            }}
            onQuickAdd={handleAddToCart}
            activePortal="pharmacy"
          />
        ))}
      </div>

    </div>
    </div>
  );
};
