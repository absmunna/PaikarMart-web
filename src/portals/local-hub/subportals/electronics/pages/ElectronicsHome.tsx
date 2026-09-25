import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Laptop, Search, Sparkles, Plus, 
  Check, ShieldAlert, Cpu, Zap, Headphones, Watch 
} from 'lucide-react';
import { useCartStore } from '@/modules/cart/cartStore';

interface ElectronicItem {
  id: string;
  name: string;
  category: 'smartwatch' | 'audio' | 'accessories' | 'chargers';
  price: number;
  originalPrice: number;
  wholesalePrice: number;
  moq: number;
  image: string;
  specs: string;
  warranty: string;
  inStock: boolean;
}

const ELECTRONICS_ITEMS: ElectronicItem[] = [
  {
    id: 'elec_1',
    name: 'Smart Watch Series 9 AMOLED (HD Bluetooth Calling)',
    category: 'smartwatch',
    price: 2450,
    originalPrice: 3200,
    wholesalePrice: 1850,
    moq: 10,
    image: 'https://images.unsplash.com/photo-1546868871-70c122467d9b?w=500&fit=crop',
    specs: '2.02" AMOLED • 7 Days Battery • IP68 Waterproof',
    warranty: '১ বছরের ব্র্যান্ড ওয়ারেন্টি',
    inStock: true
  },
  {
    id: 'elec_2',
    name: 'Pro Wireless ANC Earbuds (Deep Bass Stereo)',
    category: 'audio',
    price: 1550,
    originalPrice: 2100,
    wholesalePrice: 1100,
    moq: 15,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&fit=crop',
    specs: 'Active Noise Cancelling • 32h Playtime • Type-C',
    warranty: '৬ মাসের রিপ্লেসমেন্ট গ্যারান্টি',
    inStock: true
  },
  {
    id: 'elec_3',
    name: '20000mAh 22.5W Fast Charging Power Bank',
    category: 'accessories',
    price: 1850,
    originalPrice: 2400,
    wholesalePrice: 1350,
    moq: 10,
    image: 'https://images.unsplash.com/photo-1609592424364-444ffc186987?w=500&fit=crop',
    specs: 'PD + QC 3.0 • LED Digital Display • Triple Output',
    warranty: '১ বছরের ওয়ারেন্টি',
    inStock: true
  },
  {
    id: 'elec_4',
    name: '65W GaN Ultra-Fast Dual Port Adapter',
    category: 'chargers',
    price: 1250,
    originalPrice: 1650,
    wholesalePrice: 890,
    moq: 20,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&fit=crop',
    specs: 'GaN Technology • Laptop & Phone Compatible',
    warranty: '১ বছরের ওয়ারেন্টি',
    inStock: true
  }
];

export const ElectronicsHome: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  const filtered = ELECTRONICS_ITEMS.filter((item) => {
    if (selectedCat !== 'all' && item.category !== selectedCat) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleAddToCart = (item: ElectronicItem, isWholesale = false) => {
    const finalPrice = isWholesale ? item.wholesalePrice : item.price;
    addItem({
      id: `${item.id}_${isWholesale ? 'ws' : 'ret'}`,
      name: `${item.name} (${isWholesale ? 'পাইকারি লট' : 'খুচরা'})`,
      price: finalPrice,
      image: item.image,
      portal: isWholesale ? 'wholesale' : 'b2c',
      coinCashback: Math.floor(finalPrice * 0.02)
    });
    setAddedItem(item.id);
    setTimeout(() => setAddedItem(null), 1500);
  };

  return (
    <div className="flex flex-col gap-6 pb-24 w-full mx-auto px-4 max-w-4xl">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-900 to-indigo-950 text-white p-6 sm:p-8 shadow-xl mt-4">
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-bold border border-violet-400/30 mb-3">
            <Zap className="w-3.5 h-3.5" />
            পাইকারি ইলেকট্রনিক্স ও গ্যাজেটস
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            স্টেডিয়াম মার্কেট ও মোতালেব প্লাজার সরাসরি পাইকারি রেট
          </h1>
          <p className="text-xs sm:text-sm text-violet-200 mt-2">
            দোকানিদের জন্য পাইকারি লট বুকিং এবং ক্রেতাদের জন্য জেনুইন ব্র্যান্ড ওয়ারেন্টি।
          </p>
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
            placeholder="স্মার্টওয়াচ, ইয়ারবাডস, পাওয়ার ব্যাংক বা চার্জার খুঁজুন..."
            className="w-full bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl py-3 pl-10 pr-4 text-xs text-[var(--pm-text)] outline-none focus:border-violet-500 shadow-xs"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar py-1">
          {[
            { id: 'all', label: 'সব গ্যাজেট' },
            { id: 'smartwatch', label: 'স্মার্টওয়াচ' },
            { id: 'audio', label: 'অডিও ও ইয়ারবাডস' },
            { id: 'accessories', label: 'পাওয়ার ব্যাংক' },
            { id: 'chargers', label: 'চার্জার ও ক্যাবল' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCat(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCat === tab.id
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'bg-[var(--pm-surface)] text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] border border-[var(--pm-border)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--pm-surface)] rounded-2xl border border-[var(--pm-border)] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                {item.warranty}
              </div>
            </div>

            <div className="p-4 flex flex-col gap-2 flex-1 justify-between">
              <div>
                <h3 className="font-bold text-sm text-[var(--pm-text)] line-clamp-1">{item.name}</h3>
                <p className="text-[11px] text-[var(--pm-text-muted)] mt-1">{item.specs}</p>
              </div>

              {/* Dual Price Box: Retail vs Wholesale */}
              <div className="grid grid-cols-2 gap-2 bg-[var(--pm-bg)] p-3 rounded-xl border border-[var(--pm-border)]">
                <div>
                  <span className="text-[10px] font-bold text-[var(--pm-text-muted)] block">খুচরা মূল্য:</span>
                  <span className="text-sm font-black text-[var(--pm-text)]">৳{item.price.toLocaleString()}</span>
                  <span className="text-[10px] text-[var(--pm-text-muted)] line-through ml-1">৳{item.originalPrice.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-violet-600 block">পাইকারি লট (মিনিমাম {item.moq}টি):</span>
                  <span className="text-sm font-black text-violet-600">৳{item.wholesalePrice.toLocaleString()} /পিস</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleAddToCart(item, false)}
                  className="flex-1 py-2.5 bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] text-[var(--pm-text)] hover:text-[var(--pm-accent)] rounded-xl text-xs font-bold transition-all text-center"
                >
                  ১ পিস কিনুন
                </button>
                <button
                  onClick={() => handleAddToCart(item, true)}
                  className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm text-center flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  পাইকারি লট বুক
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
