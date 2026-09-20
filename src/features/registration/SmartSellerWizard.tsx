import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Wrench, 
  Truck, 
  MapPin, 
  Factory, 
  Monitor, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Store,
  Upload,
  ShieldCheck,
  Wallet,
  Clock,
  Utensils,
  Pill,
  Smartphone,
  LayoutGrid,
  Search,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/features/auth/AuthContext';
import { useAppStore } from '@/modules/app/appStore';
import { useSeller } from '@modules/seller';
import { BusinessType, BusinessTypeOption, SellerRegistrationState } from './types';
import { BDAddressSelector, AddressDetails } from '@/components/common/BDAddressSelector';
import { toast } from 'sonner';

const BUSINESS_TYPES: BusinessTypeOption[] = [
  { 
    id: 'physical', 
    label: 'Physical Products', 
    labelBn: 'ভৌত পণ্য', 
    icon: ShoppingBag, 
    description: 'Sell electronics, clothing, etc.',
    descriptionBn: 'ইলেকট্রনিক্স, পোশাক ইত্যাদি বিক্রি করুন'
  },
  { 
    id: 'services', 
    label: 'Services', 
    labelBn: 'সার্ভিস', 
    icon: Wrench, 
    description: 'Electrician, Doctor, Tutor, etc.',
    descriptionBn: 'ইলেকট্রিশিয়ান, ডাক্তার, গৃহশিক্ষক ইত্যাদি'
  },
  { 
    id: 'logistics', 
    label: 'Logistics', 
    labelBn: 'লজিস্টিকস', 
    icon: Truck, 
    description: 'Delivery, Ride-share, Transport',
    descriptionBn: 'ডেলিভারি, রাইড-শেয়ার, পরিবহন'
  },
  { 
    id: 'local_shop', 
    label: 'Local Shop', 
    labelBn: 'লোকাল শপ', 
    icon: MapPin, 
    description: 'Grocery, Pharmacy, Restaurant',
    descriptionBn: 'মুদি দোকান, ফার্মেসী, রেস্টুরেন্ট'
  },
  { 
    id: 'wholesale', 
    label: 'Wholesale', 
    labelBn: 'হোলসেল', 
    icon: Factory, 
    description: 'B2B, Bulk Selling, Manufacturer',
    descriptionBn: 'বিটুবি, পাইকারি বিক্রি, উৎপাদনকারী'
  },
  { 
    id: 'digital', 
    label: 'Digital Products', 
    labelBn: 'ডিজিটাল পণ্য', 
    icon: Monitor, 
    description: 'Software, E-books, Courses',
    descriptionBn: 'সফটওয়্যার, ই-বুক, কোর্স'
  }
];

const CATEGORIES: Record<BusinessType, { id: string; label: string; labelBn: string; icon: any }[]> = {
  local_shop: [
    { id: 'grocery', label: 'Grocery', labelBn: 'মুদি বাজার', icon: ShoppingBag },
    { id: 'restaurant', label: 'Restaurant', labelBn: 'রেস্টুরেন্ট', icon: Utensils },
    { id: 'pharmacy', label: 'Pharmacy', labelBn: 'ফার্মেসী', icon: Pill },
    { id: 'electronics', label: 'Electronics', labelBn: 'ইলেকট্রনিক্স', icon: Smartphone },
    { id: 'stationery', label: 'Stationery', labelBn: 'স্টেশনারী', icon: LayoutGrid },
  ],
  services: [
    { id: 'electrician', label: 'Electrician', labelBn: 'ইলেকট্রিশিয়ান', icon: Wrench },
    { id: 'doctor', label: 'Doctor', labelBn: 'ডাক্তার', icon: ShieldCheck },
    { id: 'tutor', label: 'Tutor', labelBn: 'শিক্ষক', icon: Monitor },
  ],
  physical: [
    { id: 'fashion', label: 'Fashion', labelBn: 'ফ্যাশন', icon: ShoppingBag },
    { id: 'gadgets', label: 'Gadgets', labelBn: 'গ্যাজেট', icon: Smartphone },
  ],
  logistics: [
    { id: 'delivery', label: 'Delivery', labelBn: 'ডেলিভারি', icon: Truck },
    { id: 'ride', label: 'Ride-share', labelBn: 'রাইড-শেয়ার', icon: Truck },
  ],
  wholesale: [
    { id: 'factory', label: 'Factory', labelBn: 'ফ্যাক্টরি', icon: Factory },
    { id: 'trader', label: 'Bulk Trader', labelBn: 'পাইকারি বিক্রেতা', icon: ShoppingBag },
  ],
  digital: [
    { id: 'software', label: 'Software', labelBn: 'সফটওয়্যার', icon: Monitor },
    { id: 'course', label: 'Courses', labelBn: 'কোর্স', icon: Monitor },
  ]
};

export const SmartSellerWizard: React.FC = () => {
  const { user, promoteToSeller } = useAuth();
  const { becomeSeller, updateProfile } = useSeller();
  const { lang: storeLang } = useAppStore();
  const lang = (storeLang as string).toLowerCase();
  const [state, setState] = useState<SellerRegistrationState>({
    step: 1,
    selectedTypes: [],
    categories: [],
    basicInfo: {
      storeName: '',
      businessName: '',
      ownerName: user?.fullName || user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
    },
    location: {
      address: '',
      deliveryRadius: 5,
    },
    deliveryMethods: [],
    storeSetup: {
      description: '',
    },
    paymentSetup: {
      method: 'wallet',
    },
    verification: {
      status: 'unverified',
      documents: [],
    },
  });

  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const nextStep = () => setState(s => ({ ...s, step: s.step + 1 }));
  const prevStep = () => setState(s => ({ ...s, step: Math.max(1, s.step - 1) }));

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Determine type mapping
    let mappedType: 'retail' | 'wholesale' | 'service' = 'retail';
    if (state.selectedTypes.includes('wholesale')) {
      mappedType = 'wholesale';
    } else if (state.selectedTypes.includes('services')) {
      mappedType = 'service';
    }

    // Call Auth Context promoteToSeller to transition user object in session
    promoteToSeller(
      state.basicInfo.storeName,
      mappedType,
      state.location.address
    );

    // Call Seller Context to update profile state
    updateProfile({
      shopName: state.basicInfo.storeName,
      tagline: state.storeSetup.description || 'Verified PaikarMart Seller',
      type: mappedType,
      location: state.location.address,
      contactEmail: state.basicInfo.email,
      contactPhone: state.basicInfo.phone,
      physicalAddress: state.location.address,
      tradeLicense: state.basicInfo.businessName || '',
    });
    
    becomeSeller();

    setLoading(false);
    setCompleted(true);
    toast.success(lang === 'bn' ? 'রেজিস্ট্রেশন সফল হয়েছে!' : 'Registration successful!');
  };

  if (completed) {
    return <SuccessView storeName={state.basicInfo.storeName} />;
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 pb-32">
      <div className="max-w-xl mx-auto">
        {/* Progress bar */}
        <div className="flex gap-1 mb-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1 flex-1 rounded-full transition-all duration-500",
                state.step > i ? "bg-cyan-400" : "bg-white/10"
              )} 
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={state.step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {renderStep(state, setState, nextStep, prevStep, handleSubmit, loading)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

function renderStep(
  state: SellerRegistrationState, 
  setState: React.Dispatch<React.SetStateAction<SellerRegistrationState>>,
  next: () => void,
  back: () => void,
  submit: () => void,
  loading: boolean
) {
  const { lang: storeLang } = useAppStore();
  const lang = (storeLang as string).toLowerCase();

  switch (state.step) {
    case 1:
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-black">{lang === 'bn' ? 'আপনি কি বিক্রি করতে চান?' : 'What do you want to sell?'}</h1>
            <p className="text-zinc-400 text-sm">{lang === 'bn' ? 'এক বা একাধিক নির্বাচন করুন' : 'Select one or more options'}</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {BUSINESS_TYPES.map(type => {
              const isSelected = state.selectedTypes.includes(type.id);
              return (
                <button
                  key={type.id}
                  onClick={() => {
                    const newTypes = isSelected 
                      ? state.selectedTypes.filter(t => t !== type.id)
                      : [...state.selectedTypes, type.id];
                    setState(s => ({ ...s, selectedTypes: newTypes }));
                  }}
                  className={cn(
                    "flex items-center gap-4 p-5 rounded-2xl border transition-all text-left group",
                    isSelected 
                      ? "bg-cyan-400/10 border-cyan-400 ring-1 ring-cyan-400" 
                      : "bg-zinc-900 border-white/5 hover:border-white/20"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                    isSelected ? "bg-cyan-400 text-black" : "bg-zinc-800 text-zinc-400 group-hover:text-white"
                  )}>
                    <type.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm">{lang === 'bn' ? type.labelBn : type.label}</h3>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">{lang === 'bn' ? type.descriptionBn : type.description}</p>
                  </div>
                  {isSelected && <CheckCircle2 className="text-cyan-400" size={20} />}
                </button>
              );
            })}
          </div>
          <button
            disabled={state.selectedTypes.length === 0}
            onClick={next}
            className="w-full py-4 bg-cyan-400 text-black font-black rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale transition-all mt-4"
          >
            {lang === 'bn' ? 'পরবর্তী' : 'Next'} <ChevronRight size={18} />
          </button>
        </div>
      );

    case 2:
      // Step 2: Category
      const relevantCategories = state.selectedTypes.flatMap(type => CATEGORIES[type] || []);
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-black">{lang === 'bn' ? 'ক্যাটাগরি নির্বাচন করুন' : 'Select Categories'}</h1>
            <p className="text-zinc-400 text-sm">{lang === 'bn' ? 'আপনার ব্যবসা কোন ক্যাটাগরিতে পড়ে?' : 'Which category best fits your business?'}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {relevantCategories.map(cat => {
              const isSelected = state.categories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    const newCats = isSelected 
                      ? state.categories.filter(c => c !== cat.id)
                      : [...state.categories, cat.id];
                    setState(s => ({ ...s, categories: newCats }));
                  }}
                  className={cn(
                    "flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all text-center",
                    isSelected 
                      ? "bg-cyan-400/10 border-cyan-400 ring-1 ring-cyan-400" 
                      : "bg-zinc-900 border-white/5 hover:border-white/20"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    isSelected ? "bg-cyan-400 text-black" : "bg-zinc-800 text-zinc-400"
                  )}>
                    <cat.icon size={20} />
                  </div>
                  <span className="text-xs font-bold">{lang === 'bn' ? cat.labelBn : cat.label}</span>
                </button>
              );
            })}
          </div>
          <div className="flex gap-3">
            <button onClick={back} className="flex-1 py-4 bg-zinc-900 text-white font-bold rounded-2xl border border-white/10 hover:bg-zinc-800">
              {lang === 'bn' ? 'পিছনে' : 'Back'}
            </button>
            <button
              disabled={state.categories.length === 0}
              onClick={next}
              className="flex-[2] py-4 bg-cyan-400 text-black font-black rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {lang === 'bn' ? 'পরবর্তী' : 'Next'} <ChevronRight size={18} />
            </button>
          </div>
        </div>
      );

    case 3:
      // Basic Info
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-black">{lang === 'bn' ? 'প্রাথমিক তথ্য' : 'Basic Information'}</h1>
            <p className="text-zinc-400 text-sm">{lang === 'bn' ? 'আপনার স্টোর এবং ব্যবসার তথ্য দিন' : 'Tell us about your store and business'}</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Store Name</label>
              <input 
                type="text"
                placeholder="e.g. Munna Pharmacy"
                value={state.basicInfo.storeName}
                onChange={e => setState(s => ({ ...s, basicInfo: { ...s.basicInfo, storeName: e.target.value } }))}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 focus:border-cyan-400 outline-none transition-all font-bold"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Legal Business Name (Optional)</label>
              <input 
                type="text"
                placeholder="e.g. Munna Enterprise Ltd."
                value={state.basicInfo.businessName}
                onChange={e => setState(s => ({ ...s, basicInfo: { ...s.basicInfo, businessName: e.target.value } }))}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 focus:border-cyan-400 outline-none transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1.5 opacity-50">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Owner Name</label>
                <input readOnly value={state.basicInfo.ownerName} className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 cursor-not-allowed" />
              </div>
              <div className="space-y-1.5 opacity-50">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Phone</label>
                <input readOnly value={state.basicInfo.phone} className="w-full bg-zinc-900 border border-white/5 rounded-xl p-4 cursor-not-allowed" />
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={back} className="flex-1 py-4 bg-zinc-900 text-white font-bold rounded-2xl border border-white/10">
              {lang === 'bn' ? 'পিছনে' : 'Back'}
            </button>
            <button
              disabled={!state.basicInfo.storeName}
              onClick={next}
              className="flex-[2] py-4 bg-cyan-400 text-black font-black rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {lang === 'bn' ? 'পরবর্তী' : 'Next'} <ChevronRight size={18} />
            </button>
          </div>
        </div>
      );

    case 4:
      // Location
      const isLocal = state.selectedTypes.includes('local_shop');
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-black">{lang === 'bn' ? 'স্টোর লোকেশন' : 'Store Location'}</h1>
            <p className="text-zinc-400 text-sm">{lang === 'bn' ? 'আপনার ব্যবসা কোথায় অবস্থিত?' : 'Where is your business located?'}</p>
          </div>
          <div className="space-y-6">
            <BDAddressSelector 
              onChange={(details: AddressDetails) => {
                const formatted = [details.area, details.upazila, details.district, details.division].filter(Boolean).join(', ');
                setState(s => ({ ...s, location: { ...s.location, address: formatted } }));
              }}
            />
            
            {isLocal && (
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Delivery Radius (KM)</label>
                  <span className="text-cyan-400 font-black text-xs">{state.location.deliveryRadius} km</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="20" 
                  value={state.location.deliveryRadius}
                  onChange={e => setState(s => ({ ...s, location: { ...s.location, deliveryRadius: parseInt(e.target.value) } }))}
                  className="w-full accent-cyan-400"
                />
                <p className="text-[10px] text-zinc-500 italic">{lang === 'bn' ? '* লোকাল শপের জন্য এটি ডেলিভারি এলাকা নির্ধারণ করবে' : '* This defines your delivery coverage for local shop orders'}</p>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={back} className="flex-1 py-4 bg-zinc-900 text-white font-bold rounded-2xl border border-white/10">
              {lang === 'bn' ? 'পিছনে' : 'Back'}
            </button>
            <button
              disabled={!state.location.address}
              onClick={next}
              className="flex-[2] py-4 bg-cyan-400 text-black font-black rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {lang === 'bn' ? 'পরবর্তী' : 'Next'} <ChevronRight size={18} />
            </button>
          </div>
        </div>
      );

    case 5:
      // Delivery
      const deliveryOptions = [
        { id: 'pickup', label: 'Pickup Only', icon: MapPin },
        { id: 'self', label: 'Self Delivery', icon: Truck },
        { id: 'paikarmart', label: 'PaikarMart Delivery', icon: Truck },
        { id: 'courier', label: 'Third-party Courier', icon: Truck },
      ];
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-black">{lang === 'bn' ? 'ডেলিভারি পদ্ধতি' : 'Delivery Method'}</h1>
            <p className="text-zinc-400 text-sm">{lang === 'bn' ? 'আপনি কিভাবে পণ্য পাঠাতে চান?' : 'How will you fulfill orders?'}</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {deliveryOptions.map(opt => {
              const isSelected = state.deliveryMethods.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    const newOpts = isSelected 
                      ? state.deliveryMethods.filter(o => o !== opt.id)
                      : [...state.deliveryMethods, opt.id];
                    setState(s => ({ ...s, deliveryMethods: newOpts }));
                  }}
                  className={cn(
                    "flex items-center gap-4 p-5 rounded-2xl border transition-all text-left",
                    isSelected 
                      ? "bg-cyan-400/10 border-cyan-400" 
                      : "bg-zinc-900 border-white/5"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    isSelected ? "bg-cyan-400 text-black" : "bg-zinc-800 text-zinc-400"
                  )}>
                    <opt.icon size={20} />
                  </div>
                  <span className="flex-1 font-bold">{opt.label}</span>
                  {isSelected && <CheckCircle2 size={18} className="text-cyan-400" />}
                </button>
              );
            })}
          </div>
          <div className="flex gap-3">
            <button onClick={back} className="flex-1 py-4 bg-zinc-900 text-white font-bold rounded-2xl border border-white/10">
              {lang === 'bn' ? 'পিছনে' : 'Back'}
            </button>
            <button
              disabled={state.deliveryMethods.length === 0}
              onClick={next}
              className="flex-[2] py-4 bg-cyan-400 text-black font-black rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {lang === 'bn' ? 'পরবর্তী' : 'Next'} <ChevronRight size={18} />
            </button>
          </div>
        </div>
      );

    case 6:
      // Store Setup
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-black">{lang === 'bn' ? 'স্টোর সেটআপ' : 'Store Setup'}</h1>
            <p className="text-zinc-400 text-sm">{lang === 'bn' ? 'লোগো এবং বর্ণনা যোগ করুন (ঐচ্ছিক)' : 'Add logo and description (Optional)'}</p>
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-3xl bg-zinc-900 border border-dashed border-white/20 flex flex-col items-center justify-center gap-1 group cursor-pointer hover:border-cyan-400/50 transition-all">
                <Upload size={20} className="text-zinc-500 group-hover:text-cyan-400" />
                <span className="text-[8px] font-black uppercase text-zinc-600 group-hover:text-zinc-400 tracking-widest">Logo</span>
              </div>
              <div className="flex-1 h-24 rounded-3xl bg-zinc-900 border border-dashed border-white/20 flex flex-col items-center justify-center gap-1 group cursor-pointer hover:border-cyan-400/50 transition-all">
                <Upload size={20} className="text-zinc-500 group-hover:text-cyan-400" />
                <span className="text-[8px] font-black uppercase text-zinc-600 group-hover:text-zinc-400 tracking-widest">Banner</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Description</label>
              <textarea 
                placeholder="Describe your business..."
                value={state.storeSetup.description}
                onChange={e => setState(s => ({ ...s, storeSetup: { ...s.storeSetup, description: e.target.value } }))}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 focus:border-cyan-400 outline-none min-h-[120px] transition-all"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={back} className="flex-1 py-4 bg-zinc-900 text-white font-bold rounded-2xl border border-white/10">
              {lang === 'bn' ? 'পিছনে' : 'Back'}
            </button>
            <button
              onClick={next}
              className="flex-[2] py-4 bg-cyan-400 text-black font-black rounded-2xl flex items-center justify-center gap-2"
            >
              {state.storeSetup.description ? (lang === 'bn' ? 'পরবর্তী' : 'Next') : (lang === 'bn' ? 'এড়িয়ে যান' : 'Skip & Continue')} <ChevronRight size={18} />
            </button>
          </div>
        </div>
      );

    case 7:
      // Payment
      const paymentMethods = [
        { id: 'wallet', label: 'Wallet Only (Default)', icon: Wallet, desc: 'Use internal PaikarMart wallet for earnings' },
        { id: 'mobile', label: 'Mobile Banking', icon: Smartphone, desc: 'Connect bKash or Nagad' },
        { id: 'bank', label: 'Add Bank Account', icon: Store, desc: 'Direct bank transfer' },
        { id: 'later', label: 'Setup Later', icon: Clock, desc: 'You can add this from settings' },
      ];
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-black">{lang === 'bn' ? 'পেমেন্ট সেটআপ' : 'Payment Setup'}</h1>
            <p className="text-zinc-400 text-sm">{lang === 'bn' ? 'পেমেন্ট গ্রহণের পদ্ধতি নির্বাচন করুন' : 'How would you like to receive payments?'}</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {paymentMethods.map(pm => {
              const isSelected = state.paymentSetup.method === pm.id;
              return (
                <button
                  key={pm.id}
                  onClick={() => setState(s => ({ ...s, paymentSetup: { ...s.paymentSetup, method: pm.id as any } }))}
                  className={cn(
                    "flex items-start gap-4 p-5 rounded-2xl border transition-all text-left",
                    isSelected 
                      ? "bg-cyan-400/10 border-cyan-400" 
                      : "bg-zinc-900 border-white/5"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center mt-0.5",
                    isSelected ? "bg-cyan-400 text-black" : "bg-zinc-800 text-zinc-400"
                  )}>
                    <pm.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm">{pm.label}</h3>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">{pm.desc}</p>
                  </div>
                  {isSelected && <CheckCircle2 size={18} className="text-cyan-400" />}
                </button>
              );
            })}
          </div>
          <div className="flex gap-3">
            <button onClick={back} className="flex-1 py-4 bg-zinc-900 text-white font-bold rounded-2xl border border-white/10">
              {lang === 'bn' ? 'পিছনে' : 'Back'}
            </button>
            <button
              onClick={next}
              className="flex-[2] py-4 bg-cyan-400 text-black font-black rounded-2xl flex items-center justify-center gap-2"
            >
              {lang === 'bn' ? 'পরবর্তী' : 'Next'} <ChevronRight size={18} />
            </button>
          </div>
        </div>
      );

    case 8:
      // Verification
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-black">{lang === 'bn' ? 'ভেরিফিকেশন' : 'Verification'}</h1>
            <p className="text-zinc-400 text-sm">{lang === 'bn' ? 'আপনার ব্যবসা ভেরিফাই করুন (ঐচ্ছিক)' : 'Verify your business (Optional)'}</p>
          </div>
          <div className="p-8 rounded-3xl bg-zinc-900 border border-dashed border-white/20 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mx-auto text-cyan-400">
              <ShieldCheck size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold">{lang === 'bn' ? 'ট্রাস্ট ব্যাজ পান' : 'Get Your Trust Badge'}</h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed">
                {lang === 'bn' 
                  ? 'NID বা ট্রেড লাইসেন্স আপলোড করে আজই ভেরিফাইড সেলার হন' 
                  : 'Upload NID or Trade License to become a verified seller today'}
              </p>
            </div>
            <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
              {lang === 'bn' ? 'ডকুমেন্ট আপলোড করুন' : 'Upload Documents'}
            </button>
          </div>
          <div className="flex gap-3">
            <button onClick={back} className="flex-1 py-4 bg-zinc-900 text-white font-bold rounded-2xl border border-white/10">
              {lang === 'bn' ? 'পিছনে' : 'Back'}
            </button>
            <button
              onClick={submit}
              disabled={loading}
              className="flex-[2] py-4 bg-cyan-400 text-black font-black rounded-2xl flex items-center justify-center gap-2 shadow-[0_8px_32px_rgba(34,211,238,0.2)]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  {lang === 'bn' ? 'প্রসেসিং...' : 'Processing...'}
                </div>
              ) : (
                <>
                  {lang === 'bn' ? 'রেজিস্ট্রেশন সম্পন্ন করুন' : 'Complete Registration'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
          <p className="text-center text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
            {lang === 'bn' ? 'আপনি পরে ড্যাশবোর্ড থেকেও ভেরিফাই করতে পারবেন' : 'You can also verify later from your dashboard'}
          </p>
        </div>
      );

    default:
      return null;
  }
}

function SuccessView({ storeName }: { storeName: string }) {
  const { lang: storeLang } = useAppStore();
  const lang = (storeLang as string).toLowerCase();
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-sm w-full text-center space-y-8"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-400 blur-3xl opacity-20 animate-pulse" />
          <div className="relative w-24 h-24 rounded-full bg-cyan-400 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(34,211,238,0.4)]">
            <CheckCircle2 size={48} className="text-black" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-black">{lang === 'bn' ? 'অভিনন্দন!' : 'Congratulations!'}</h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            {lang === 'bn' 
              ? `${storeName} এখন পাইকার মার্টে লাইভ। আপনার সেলার যাত্রা শুরু হোক!` 
              : `${storeName} is now live on PaikarMart. Let your seller journey begin!`}
          </p>
        </div>

        <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 text-left space-y-4">
          <h3 className="text-[10px] font-black uppercase text-cyan-400 tracking-widest">Setup Checklist</h3>
          <div className="space-y-3">
            {[
              { label: 'Store Created', done: true },
              { label: 'Upload Logo', done: false },
              { label: 'Add First Product', done: false },
              { label: 'Verify Identity', done: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                {item.done ? (
                  <CheckCircle2 size={16} className="text-cyan-400" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-white/10" />
                )}
                <span className={cn("text-xs font-bold", item.done ? "text-white" : "text-zinc-500")}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={() => window.location.href = '/seller/dashboard'}
          className="w-full py-5 bg-white text-black font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all"
        >
          {lang === 'bn' ? 'সেলার ড্যাশবোর্ডে যান' : 'Go to Seller Central'}
        </button>
      </motion.div>
    </div>
  );
}
