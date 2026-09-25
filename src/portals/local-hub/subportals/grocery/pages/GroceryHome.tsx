import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, Search, Sparkles, Plus, 
  Check, ArrowRight, ShieldCheck, Truck, Scale, Filter 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/modules/cart/cartStore';

interface GroceryItem {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  unit: string;
  minOrder: string;
  wholesaleDiscount: string;
  image: string;
  vendor: string;
  inStock: boolean;
  freshBadge?: string;
}

const GROCERY_ITEMS: GroceryItem[] = [
  {
    id: 'groc_1',
    name: 'মিনিকেট প্রিমিয়াম চাল (৫০ কেজি বস্তা)',
    category: 'rice',
    price: 3450,
    originalPrice: 3800,
    unit: '৫০ কেজি বস্তা',
    minOrder: '১ বস্তা',
    wholesaleDiscount: '১০+ বস্তায় ৫% ছাড়',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&fit=crop',
    vendor: 'মদিনা রাইস এজেন্সি, কারওয়ান বাজার',
    inStock: true,
    freshBadge: 'নতুন ফসল'
  },
  {
    id: 'groc_2',
    name: 'ঘানি ভাঙা খাঁটি সরিষার তেল (৫ লিটার জার)',
    category: 'oil',
    price: 1120,
    originalPrice: 1250,
    unit: '৫ লিটার জার',
    minOrder: '১ জার',
    wholesaleDiscount: '৪ জারে ১০% ছাড়',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&fit=crop',
    vendor: 'ন্যাচারাল ওয়েল মিলস',
    inStock: true,
    freshBadge: '১০০% খাঁটি'
  },
  {
    id: 'groc_3',
    name: 'দেশি লাল মসুর ডাল (২৫ কেজি বস্তা)',
    category: 'dal',
    price: 2850,
    originalPrice: 3100,
    unit: '২৫ কেজি বস্তা',
    minOrder: '১ বস্তা',
    wholesaleDiscount: 'বাল্ক লট রেট',
    image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=500&fit=crop',
    vendor: 'সোবহান এন্টারপ্রাইজ',
    inStock: true
  },
  {
    id: 'groc_4',
    name: 'তাজা লাল আলু (৫০ কেজি বস্তা)',
    category: 'veggies',
    price: 1350,
    originalPrice: 1600,
    unit: '৫০ কেজি বস্তা',
    minOrder: '১ বস্তা',
    wholesaleDiscount: 'আড়ত রেট',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&fit=crop',
    vendor: 'রংপুর কোল্ড স্টোরেজ ডিলার',
    inStock: true,
    freshBadge: 'ফার্ম ফ্রেশ'
  },
  {
    id: 'groc_5',
    name: 'দেশি নতুন পেঁয়াজ (৪০ কেজি বস্তা)',
    category: 'veggies',
    price: 2400,
    originalPrice: 2800,
    unit: '৪০ কেজি বস্তা',
    minOrder: '১ বস্তা',
    wholesaleDiscount: 'পাইকারি রেট',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&fit=crop',
    vendor: 'পাবনা এগ্রো ফার্মস',
    inStock: true
  },
  {
    id: 'groc_6',
    name: 'চিনিকুড়া সুগন্ধি পোলাও চাল (১০ কেজি)',
    category: 'rice',
    price: 1300,
    originalPrice: 1450,
    unit: '১০ কেজি ব্যাগ',
    minOrder: '১ ব্যাগ',
    wholesaleDiscount: '৫ ব্যাগে ৭% ছাড়',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&fit=crop',
    vendor: 'দিনাজপুর অ্যারোমা রাইস',
    inStock: true,
    freshBadge: 'এক্সপোর্ট কোয়ালিটি'
  }
];

export const GroceryHome: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCat, setSelectedCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  const categories = [
    { id: 'all', label: 'সব মুদি পণ্য' },
    { id: 'rice', label: 'চাল ও শস্য' },
    { id: 'oil', label: 'তেল ও ঘি' },
    { id: 'dal', label: 'ডাল ও ডালজাত' },
    { id: 'veggies', label: 'আলু ও পেঁয়াজ' },
  ];

  const filtered = GROCERY_ITEMS.filter((item) => {
    if (selectedCat !== 'all' && item.category !== selectedCat) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleAddToCart = (item: GroceryItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      portal: 'wholesale',
      coinCashback: Math.floor(item.price * 0.02)
    });
    setAddedItem(item.id);
    setTimeout(() => setAddedItem(null), 1500);
  };

  return (
    <div className="flex flex-col gap-6 pb-24 w-full mx-auto px-4 max-w-4xl">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 sm:p-8 shadow-xl mt-4">
        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            মুদি ও নিত্যপ্রয়োজনীয় আড়ত
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            সরাসরি আড়ত থেকে পাইকারি মূল্যে চাল, ডাল ও তেল
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-2">
            দোকানদার এবং পরিবারের জন্য নির্ভরযোগ্য মান, সঠিক ওজন ও দ্রুত ডেলিভারি নিশ্চয়তা।
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Search & Categories */}
      <div className="flex flex-col gap-3">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pm-text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="চাল, ডাল, তেল বা আড়তদার খুঁজুন..."
            className="w-full bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl py-3 pl-10 pr-4 text-xs text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)] shadow-xs"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCat === cat.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-[var(--pm-surface)] text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] border border-[var(--pm-border)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--pm-surface)] rounded-2xl border border-[var(--pm-border)] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              {item.freshBadge && (
                <span className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md">
                  {item.freshBadge}
                </span>
              )}
              <span className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                মিনিমাম: {item.minOrder}
              </span>
            </div>

            <div className="p-4 flex flex-col gap-2 flex-1 justify-between">
              <div>
                <p className="text-[10px] font-semibold text-[var(--pm-text-muted)] truncate">
                  {item.vendor}
                </p>
                <h3 className="font-bold text-sm text-[var(--pm-text)] line-clamp-2 mt-0.5">
                  {item.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-600 font-bold">
                  <Scale className="w-3.5 h-3.5" />
                  {item.wholesaleDiscount}
                </div>
              </div>

              <div className="pt-2 border-t border-[var(--pm-border)]/60 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-black text-[var(--pm-text)]">
                      ৳{item.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-[var(--pm-text-muted)] line-through">
                      ৳{item.originalPrice.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[10px] text-[var(--pm-text-muted)]">{item.unit}</span>
                </div>

                <button
                  onClick={() => handleAddToCart(item)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    addedItem === item.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[var(--pm-accent)] text-white hover:bg-[var(--pm-accent)]/90 shadow-sm'
                  }`}
                >
                  {addedItem === item.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      যুক্ত হয়েছে
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      অর্ডার করুন
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
