import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  ShoppingBag, Truck, MapPin, Factory, Monitor, 
  CheckCircle2, Store, Upload, ShieldCheck, 
  Wallet, Utensils, Pill, Smartphone, LayoutGrid, 
  FileText, Check, AlertCircle, Building2,
  Sparkles, Star, CreditCard, ChevronRight, RefreshCw, Eye,
  ArrowRight, ArrowLeft, Zap, FileCheck, Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/modules/auth';
import { useAppStore } from '@/modules/app';
import { useSeller } from '@modules/seller';
import { BDAddressSelector, AddressDetails } from '@/components/common/BDAddressSelector';
import { toast } from 'sonner';

// Define business category structure with associated mandatory legal documents
interface BusinessCategory {
  id: string;
  label: string;
  labelBn: string;
  icon: any;
  description: string;
  descriptionBn: string;
  requiredDocs: {
    id: string;
    name: string;
    nameBn: string;
    placeholder: string;
  }[];
}

const BUSINESS_CATEGORIES: BusinessCategory[] = [
  {
    id: 'wholesale',
    label: 'Wholesale & B2B (হোলসেল)',
    labelBn: 'হোলসেল ও বিটুবি ব্যবসা',
    icon: Factory,
    description: 'Bulk supply, factories, manufacturers',
    descriptionBn: 'পাইকারি বিক্রেতা, কারখানা, আমদানিকারক',
    requiredDocs: [
      { id: 'trade_license', name: 'Trade License', nameBn: 'ট্রেড লাইসেন্স', placeholder: 'ট্রেড লাইসেন্স PDF / ইমেজ' },
      { id: 'tin_cert', name: 'Business TIN Certificate', nameBn: 'টি আই এন সার্টিফিকেট', placeholder: 'টি আই এন কপি' }
    ]
  },
  {
    id: 'pharmacy',
    label: 'Pharmacy (ফার্মেসী)',
    labelBn: 'ফার্মেসী ও ড্রাগ স্টোর',
    icon: Pill,
    description: 'Medicines, medical supplies, healthcare',
    descriptionBn: 'ঔষধ এবং চিকিৎসা সামগ্রী বিক্রেতা',
    requiredDocs: [
      { id: 'drug_license', name: 'Drug License', nameBn: 'ড্রাগ লাইসেন্স (বাধ্যতামূলক)', placeholder: 'ড্রাগ লাইসেন্স PDF / ইমেজ' },
      { id: 'trade_license', name: 'Trade License', nameBn: 'ট্রেড লাইসেন্স', placeholder: 'ট্রেড লাইসেন্স কপি' }
    ]
  },
  {
    id: 'restaurant_food',
    label: 'Food & Groceries (খাদ্য ও রেস্টুরেন্ট)',
    labelBn: 'খাদ্য ও গ্রোসারি শপ',
    icon: Utensils,
    description: 'Restaurants, grocery shops, BSTI foods',
    descriptionBn: 'রেস্টুরেন্ট, ক্যাফে বা মুদি বাজার',
    requiredDocs: [
      { id: 'bsti_cert', name: 'BSTI / Food Safety Certificate', nameBn: 'বিএসটিআই/ফুড সেফটি লাইসেন্স', placeholder: 'ফুড সেফটি অনুমোদন সার্টিফিকেট' }
    ]
  },
  {
    id: 'electronics',
    label: 'Electronics (ইলেকট্রনিক্স)',
    labelBn: 'গ্যাজেট ও ইলেকট্রনিক্স',
    icon: Smartphone,
    description: 'Mobile, gadgets, accessories, repair',
    descriptionBn: 'স্মার্টফোন, এক্সেসরিজ বা গ্যাজেট গ্যালারি',
    requiredDocs: [
      { id: 'nid_card', name: 'Owner NID/Passport', nameBn: 'জাতীয় পরিচয়পত্র / পাসপোর্ট', placeholder: 'এনআইডি সামনের ও পিছনের অংশ' }
    ]
  },
  {
    id: 'fashion_apparel',
    label: 'Fashion & RMG (ফ্যাশন ও বুটিক)',
    labelBn: 'ফ্যাশন ও বুটিক হাউস',
    icon: ShoppingBag,
    description: 'Clothing, shoes, RMG, apparel factory',
    descriptionBn: 'বুটিক, জামাকাপড় ও তৈরি পোশাক',
    requiredDocs: [
      { id: 'nid_card', name: 'Owner NID/Passport', nameBn: 'জাতীয় পরিচয়পত্র / পাসপোর্ট', placeholder: 'এনআইডি কপি' }
    ]
  },
  {
    id: 'digital_services',
    label: 'Digital Goods & Services (সেবা ও ডিজিটাল পণ্য)',
    labelBn: 'ডিজিটাল প্রোডাক্ট ও পেশাদার সেবা',
    icon: Monitor,
    description: 'Software, courses, on-demand services',
    descriptionBn: 'অন-ডিমান্ড সেবা, কোডিং বা কোর্স কন্টেন্ট',
    requiredDocs: [
      { id: 'nid_card', name: 'National ID Card', nameBn: 'জাতীয় পরিচয়পত্র (NID)', placeholder: 'এনআইডি রঙিন কপি' }
    ]
  }
];

export interface SellerModel {
  id: 'wholesale' | 'nearby_shop' | 'brand_manufacturer' | 'rider_logistics';
  label: string;
  labelBn: string;
  subtitle: string;
  descBn: string;
  icon: any;
  badgeBn: string;
  gradient: string;
  activeBorder: string;
  defaultCategories: string[];
}

export const SELLER_MODELS: SellerModel[] = [
  {
    id: 'wholesale',
    label: 'Wholesale & Mill-Gate',
    labelBn: 'পাইকারি বিক্রেতা ও মিল-গেট',
    subtitle: 'Wholesale & Mill Hub',
    descBn: 'মিল-গেট রেটে বাল্ক সেলস, আড়ত লিস্টিং ও বড় বায়ার নেটওয়ার্ক',
    icon: Building2,
    badgeBn: 'হোলসেল ও আড়ত',
    gradient: 'from-blue-500/20 to-indigo-500/10',
    activeBorder: 'border-blue-500 shadow-blue-500/15',
    defaultCategories: ['wholesale']
  },
  {
    id: 'nearby_shop',
    label: 'Neighborhood Shop & Grocery',
    labelBn: 'লোকাল মহল্লার দোকান ও ফার্মেসি',
    subtitle: 'Neighborhood Store & Pharmacy',
    descBn: 'মহল্লার দোকান, গ্রোসারি ও ৩০ মিনিটের ইনস্ট্যান্ট লোকাল ডেলিভারি',
    icon: Store,
    badgeBn: 'লোকাল শপ',
    gradient: 'from-emerald-500/20 to-teal-500/10',
    activeBorder: 'border-emerald-500 shadow-emerald-500/15',
    defaultCategories: ['restaurant_food', 'pharmacy']
  },
  {
    id: 'brand_manufacturer',
    label: 'Direct Brand & Factory',
    labelBn: 'ব্র্যান্ড ও সরাসরি প্রস্তুতকারক',
    subtitle: 'Boutique & Factory Direct',
    descBn: 'নিজের উৎপাদিত পণ্য ও এক্সক্লুসিভ ব্র্যান্ড স্টোর তৈরি করে সারাদেশে বিক্রি',
    icon: Factory,
    badgeBn: 'ব্র্যান্ড স্টোর',
    gradient: 'from-purple-500/20 to-pink-500/10',
    activeBorder: 'border-purple-500 shadow-purple-500/15',
    defaultCategories: ['fashion_apparel', 'electronics']
  },
  {
    id: 'rider_logistics',
    label: 'Logistics & Rider Partner',
    labelBn: 'রাইডার ও লজিস্টিকস পার্টনার',
    subtitle: 'Transport & Delivery Fleet',
    descBn: 'পণ্য পরিবহন, ট্রাক ও বাইক দিয়ে পার্সেল ডেলিভারি করে কমিশন আয়',
    icon: Truck,
    badgeBn: 'লজিস্টিকস পার্টনার',
    gradient: 'from-amber-500/20 to-orange-500/10',
    activeBorder: 'border-amber-500 shadow-amber-500/15',
    defaultCategories: ['digital_services']
  }
];

export const SmartSellerWizard: React.FC = () => {
  const { user, promoteToSeller } = useAuth();
  const { becomeSeller, updateProfile } = useSeller();
  const { lang: storeLang } = useAppStore();
  const lang = (storeLang as string || 'bn').toLowerCase();

  // 4-Step Dynamic Flow
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedModel, setSelectedModel] = useState<SellerModel['id']>('wholesale');
  const [selectedCats, setSelectedCats] = useState<string[]>(['wholesale']);
  const [storeName, setStoreName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [tradeLicenseNumber, setTradeLicenseNumber] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [ownerName, setOwnerName] = useState(user?.fullName || user?.name || '');
  const [address, setAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('paikarmart');
  const [payoutMethod, setPayoutMethod] = useState('wallet');
  const [description, setDescription] = useState('');
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, { name: string; size: string; progress: number }>>({});
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Handle seller model switch and auto-recommend categories
  const handleModelSelect = (modelId: SellerModel['id']) => {
    setSelectedModel(modelId);
    const targetModel = SELLER_MODELS.find(m => m.id === modelId);
    if (targetModel) {
      setSelectedCats(targetModel.defaultCategories);
    }
  };

  // Derive legal documents needed based on active category selections
  const activeRequiredDocs = useMemo(() => {
    return BUSINESS_CATEGORIES.filter(cat => selectedCats.includes(cat.id))
      .flatMap(cat => cat.requiredDocs)
      .filter((doc, index, self) => self.findIndex(d => d.id === doc.id) === index);
  }, [selectedCats]);

  // Compute live progress percentage across all 4 steps
  const progressPercent = useMemo(() => {
    let score = 0;
    if (selectedModel) score += 25;
    if (storeName.trim().length > 2 && (phone.trim().length >= 11 || email.trim().length > 4)) score += 25;
    const completedDocs = activeRequiredDocs.filter(d => uploadedDocs[d.id]?.progress === 100);
    if (selectedCats.length > 0 && (activeRequiredDocs.length === 0 || completedDocs.length === activeRequiredDocs.length)) score += 25;
    if (address.trim().length > 3) score += 25;
    return score;
  }, [selectedModel, storeName, phone, email, selectedCats, activeRequiredDocs, uploadedDocs, address]);

  // Demo auto-fill helper for instant testing
  const handleQuickFillDemo = () => {
    setStoreName('মেসার্স রাজ্জাক পাইকারি আড়ত');
    setBusinessName('Razzak Agro & Wholesale Trading');
    setTradeLicenseNumber('TRD-DHAKA-2026-99214');
    setPhone('01712345678');
    setEmail('razzak.arat@gmail.com');
    setOwnerName('হাজী আব্দুর রাজ্জাক');
    setDescription('খাতুনগঞ্জ ও বাদামতলীর বিশ্বস্ত পাইকারি আড়ত। চাল, ডাল, তেল ও মশলা সরাসরি মিল-গেট রেটে সরবরাহ করা হয়।');
    setAddress('বাদামতলী পাইকারি ঘাট, চকবাজার, ঢাকা');
    
    // Auto-mark docs as uploaded for quick demo
    const simulated: Record<string, { name: string; size: string; progress: number }> = {};
    activeRequiredDocs.forEach(d => {
      simulated[d.id] = { name: `${d.name}_verified.pdf`, size: '1.8 MB', progress: 100 };
    });
    setUploadedDocs(simulated);
    toast.success('ডেমো তথ্য সফলভাবে পূরণ করা হয়েছে!');
  };

  const handleCategoryToggle = (catId: string) => {
    setSelectedCats(prev => {
      if (prev.includes(catId)) {
        if (prev.length === 1) {
          toast.warning(lang === 'bn' ? 'কমপক্ষে একটি ক্যাটাগরি অবশ্যই নির্বাচন করতে হবে!' : 'At least one category must be selected!');
          return prev;
        }
        return prev.filter(id => id !== catId);
      }
      return [...prev, catId];
    });
  };

  const handleSimulatedUpload = (docId: string, fileName: string) => {
    setUploadedDocs(prev => ({
      ...prev,
      [docId]: { name: fileName, size: '2.4 MB', progress: 15 }
    }));

    // Fast simulated upload progress timer
    let progress = 15;
    const interval = setInterval(() => {
      progress += 35;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        toast.success(lang === 'bn' ? `${fileName} সফলভাবে আপলোড হয়েছে!` : `${fileName} uploaded successfully!`);
      }
      setUploadedDocs(prev => {
        if (!prev[docId]) return prev;
        return {
          ...prev,
          [docId]: { ...prev[docId], progress }
        };
      });
    }, 120);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!storeName.trim()) {
      toast.error(lang === 'bn' ? 'স্টোরের নাম বাধ্যতামূলক!' : 'Store Name is required!');
      return;
    }
    if (!address) {
      toast.error(lang === 'bn' ? 'ঠিকানা নির্বাচন করুন!' : 'Please select your business address!');
      return;
    }

    // Verify all mandatory active docs are uploaded
    const missingDocs = activeRequiredDocs.filter(doc => !uploadedDocs[doc.id] || uploadedDocs[doc.id].progress < 100);
    if (missingDocs.length > 0) {
      toast.error(
        lang === 'bn' 
          ? `অনুগ্রহ করে সব বাধ্যতামূলক ডকুমেন্ট আপলোড করুন: ${missingDocs.map(d => d.nameBn).join(', ')}` 
          : `Please upload mandatory documents: ${missingDocs.map(d => d.name).join(', ')}`
      );
      return;
    }

    setLoading(true);

    let mappedType: 'retail' | 'wholesale' | 'service' = 'retail';
    if (selectedModel === 'wholesale' || selectedCats.includes('wholesale')) {
      mappedType = 'wholesale';
    } else if (selectedModel === 'rider_logistics' || selectedCats.includes('digital_services')) {
      mappedType = 'service';
    } else {
      mappedType = 'retail';
    }

    try {
      // Call Auth Context promoteToSeller
      promoteToSeller(storeName, mappedType, address);

      // Call Seller Context to update profile state
      updateProfile({
        shopName: storeName,
        tagline: description || (selectedModel === 'wholesale' ? 'পাইকারি আড়ত ও মিল-গেট' : 'ভেরিফাইড মার্চেন্ট পার্টনার'),
        type: mappedType,
        location: address,
        contactEmail: email,
        contactPhone: phone,
        physicalAddress: address,
        tradeLicense: tradeLicenseNumber || businessName || 'e-CAB Active',
      });

      becomeSeller();

      setTimeout(() => {
        setLoading(false);
        setCompleted(true);
        toast.success(lang === 'bn' ? 'মার্চেন্ট রেজিস্ট্রেশন সফলভাবে সম্পন্ন হয়েছে!' : 'Merchant registration completed successfully!');
      }, 1200);
    } catch (err) {
      setLoading(false);
      toast.error("Registration failed. Please try again.");
    }
  };

  if (completed) {
    return <SuccessView storeName={storeName} />;
  }

  const currentModelObj = SELLER_MODELS.find(m => m.id === selectedModel) || SELLER_MODELS[0];

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-6 md:py-10 pb-32 text-left">
      
      {/* Dynamic Milestones / Progress & Step Tabs Bar */}
      <div className="mb-8 p-4 md:p-6 rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-[var(--pm-accent)]/15 text-[var(--pm-accent)]">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-base sm:text-lg font-black text-[var(--pm-text)] tracking-tight">
                {lang === 'bn' ? 'ডাইনামিক মার্চেন্ট অনবোর্ডিং' : 'Dynamic Merchant Onboarding'}
              </h2>
            </div>
            <p className="text-[11px] text-[var(--pm-muted)] mt-0.5">
              {lang === 'bn' 
                ? '৪টি সহজ ধাপে আপনার ব্যবসা ও আড়ত ডিজিটাল করুন' 
                : 'Complete 4 simple steps to launch your digital store'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleQuickFillDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 text-amber-400 hover:text-amber-300 text-[11px] font-black cursor-pointer transition-all active:scale-95 shadow-xs"
              title="টেস্ট করার জন্য স্বয়ংক্রিয় ডেমো তথ্য পূরণ করুন"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              <span>ডেমো অটো-ফিল</span>
            </button>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[var(--pm-muted)] block">প্রস্তুতি</span>
              <span className="text-sm font-black text-[var(--pm-accent)] tabular-nums">{progressPercent}%</span>
            </div>
          </div>
        </div>

        {/* Live Progress Bar */}
        <div className="w-full bg-[var(--pm-bg)] h-2 rounded-full overflow-hidden border border-[var(--pm-border)] mb-4">
          <div 
            className="bg-gradient-to-r from-[var(--pm-accent)] via-amber-500 to-emerald-500 h-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 4 Interactive Step Tab Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-[var(--pm-border)]/60">
          {[
            { step: 1, title: '১. ব্যবসার মডেল', sub: currentModelObj.badgeBn, done: !!selectedModel },
            { step: 2, title: '২. স্টোর প্রোফাইল', sub: storeName ? 'নাম সম্পন্ন' : 'অপূর্ণ', done: storeName.trim().length > 2 },
            { step: 3, title: '৩. ক্যাটাগরি ও পেপারস', sub: `${selectedCats.length} টি ক্যাটাগরি`, done: selectedCats.length > 0 && activeRequiredDocs.every(d => uploadedDocs[d.id]?.progress === 100) },
            { step: 4, title: '৪. ঠিকানা ও পেমেন্ট', sub: address ? 'ঠিকানা রেডি' : 'পেন্ডিং', done: address.trim().length > 3 },
          ].map((tab) => {
            const isActive = activeStep === tab.step;
            return (
              <button
                key={tab.step}
                type="button"
                onClick={() => setActiveStep(tab.step as any)}
                className={cn(
                  "p-2.5 rounded-2xl border transition-all text-left cursor-pointer flex items-center gap-2.5",
                  isActive 
                    ? "bg-[var(--pm-surface)] border-[var(--pm-accent)] shadow-md ring-1 ring-[var(--pm-accent)]/20" 
                    : "bg-[var(--pm-bg)]/40 border-[var(--pm-border)] hover:border-[var(--pm-border)]/80"
                )}
              >
                <div className={cn(
                  "w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-black transition-colors",
                  tab.done 
                    ? "bg-emerald-500 text-white shadow-xs" 
                    : isActive 
                      ? "bg-[var(--pm-accent)] text-white shadow-xs" 
                      : "bg-[var(--pm-surface)] text-[var(--pm-muted)]"
                )}>
                  {tab.done ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : tab.step}
                </div>
                <div className="min-w-0">
                  <p className={cn("text-xs font-bold truncate", isActive ? "text-[var(--pm-text)]" : "text-[var(--pm-muted)]")}>
                    {tab.title}
                  </p>
                  <p className="text-[9px] text-[var(--pm-muted)] truncate">{tab.sub}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
        
        {/* Left Column: Active Step Form View (col-span-12 lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* ═════════ STEP 1: BUSINESS MODEL SELECTION ═════════ */}
          {activeStep === 1 && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="bg-[var(--pm-card)] border border-[var(--pm-border)] p-5 md:p-6 rounded-3xl space-y-4 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-[var(--pm-text)] uppercase tracking-wider flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[var(--pm-accent)]" />
                    <span>ধাপ ১: আপনার ব্যবসার ধরণ বা মডেল নির্বাচন করুন</span>
                  </h3>
                  <p className="text-xs text-[var(--pm-muted)] mt-1">
                    আপনার ব্যবসার ধরণ অনুযায়ী সিস্টেম স্বয়ংক্রিয়ভাবে ফিচার ও ক্যাটালগ কনফিগার করবে:
                  </p>
                </div>
                <span className="text-[10px] font-black uppercase text-[var(--pm-accent)] bg-[var(--pm-accent)]/10 px-2.5 py-1 rounded-full shrink-0">
                  {currentModelObj.badgeBn}
                </span>
              </div>

              {/* 4 Rich Seller Model Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1 select-none">
                {SELLER_MODELS.map((model) => {
                  const isSelected = selectedModel === model.id;
                  const Icon = model.icon;
                  return (
                    <div
                      key={model.id}
                      onClick={() => handleModelSelect(model.id)}
                      className={cn(
                        "p-4 rounded-2xl border-2 transition-all cursor-pointer text-left relative overflow-hidden group active:scale-[0.99]",
                        isSelected 
                          ? cn("bg-gradient-to-br", model.gradient, model.activeBorder, "shadow-lg") 
                          : "bg-[var(--pm-bg)]/60 border-[var(--pm-border)] hover:border-[var(--pm-border)]/80"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-xs",
                          isSelected 
                            ? "bg-[var(--pm-accent)] text-white" 
                            : "bg-[var(--pm-surface)] text-[var(--pm-muted)] group-hover:text-[var(--pm-text)]"
                        )}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={cn(
                          "text-[9px] font-black uppercase px-2 py-0.5 rounded-full border",
                          isSelected 
                            ? "bg-[var(--pm-accent)] text-white border-transparent" 
                            : "bg-white/5 border-[var(--pm-border)] text-[var(--pm-muted)]"
                        )}>
                          {model.badgeBn}
                        </span>
                      </div>

                      <h4 className="text-xs font-black text-[var(--pm-text)]">{model.labelBn}</h4>
                      <p className="text-[10px] text-[var(--pm-accent)] font-semibold mt-0.5">{model.subtitle}</p>
                      <p className="text-[11px] text-[var(--pm-muted)] mt-1.5 leading-relaxed">
                        {model.descBn}
                      </p>

                      <div className="mt-3 pt-2 border-t border-[var(--pm-border)]/40 flex items-center justify-between text-[10px]">
                        <span className="text-[var(--pm-muted)] font-medium">কমিশন: ০% ফ্রি</span>
                        <div className={cn(
                          "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                          isSelected ? "bg-[var(--pm-accent)] border-transparent text-white" : "border-[var(--pm-border)]"
                        )}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Step 1 Actions */}
              <div className="pt-3 border-t border-[var(--pm-border)] flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="px-5 py-2.5 rounded-2xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white text-xs font-black transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-[var(--pm-accent)]/20 active:scale-95"
                >
                  পরবর্তী ধাপ: স্টোর তথ্য <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ═════════ STEP 2: STORE PROFILE & LEGAL INFO ═════════ */}
          {activeStep === 2 && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="bg-[var(--pm-card)] border border-[var(--pm-border)] p-5 md:p-6 rounded-3xl space-y-4 shadow-xl"
            >
              <div>
                <h3 className="text-sm font-black text-[var(--pm-text)] uppercase tracking-wider flex items-center gap-2">
                  <Store className="w-4 h-4 text-[var(--pm-accent)]" />
                  <span>ধাপ ২: স্টোর ও ব্যবসায়িক প্রোফাইল তথ্য</span>
                </h3>
                <p className="text-xs text-[var(--pm-muted)] mt-1">
                  ক্রেতারা আপনার এই নাম এবং পরিচয় দেখতে পারবেন:
                </p>
              </div>

              <div className="space-y-4 pt-1">
                {/* Store Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-[var(--pm-muted)] tracking-wider block">
                    দোকান বা আড়তের নাম (Store / Arat Name) <span className="text-[var(--pm-accent)]">*</span>
                  </label>
                  <div className="relative">
                    <Store className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--pm-muted)]" />
                    <input 
                      type="text"
                      required
                      placeholder="যেমন: ভাই ভাই পাইকারি আড়ত অথবা গ্যাজেট হাব"
                      value={storeName}
                      onChange={e => setStoreName(e.target.value)}
                      className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl pl-10 pr-3.5 py-3 text-xs text-[var(--pm-text)] placeholder-[var(--pm-muted)]/60 focus:border-[var(--pm-accent)] outline-none font-bold transition-all"
                    />
                  </div>
                </div>

                {/* Legal Entity / Trade License */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-[var(--pm-muted)] tracking-wider block">
                      প্রতিষ্ঠানের আইনি নাম (Company Legal Name)
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--pm-muted)]" />
                      <input 
                        type="text"
                        placeholder="যেমন: ভাই ভাই এন্টারপ্রাইজ লিঃ"
                        value={businessName}
                        onChange={e => setBusinessName(e.target.value)}
                        className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl pl-10 pr-3.5 py-3 text-xs text-[var(--pm-text)] placeholder-[var(--pm-muted)]/60 focus:border-[var(--pm-accent)] outline-none transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-[var(--pm-muted)] tracking-wider block">
                      ট্রেড লাইসেন্স বা এনআইডি নম্বর
                    </label>
                    <div className="relative">
                      <FileCheck className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--pm-muted)]" />
                      <input 
                        type="text"
                        placeholder="যেমন: TRD-2026-XXXXX বা NID No"
                        value={tradeLicenseNumber}
                        onChange={e => setTradeLicenseNumber(e.target.value)}
                        className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl pl-10 pr-3.5 py-3 text-xs text-[var(--pm-text)] placeholder-[var(--pm-muted)]/60 focus:border-[var(--pm-accent)] outline-none transition-all font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Owner Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-[var(--pm-muted)] tracking-wider block">
                      মালিক বা কন্ট্যাক্ট পার্সনের নাম
                    </label>
                    <input 
                      type="text"
                      placeholder="পুরো নাম"
                      value={ownerName}
                      onChange={e => setOwnerName(e.target.value)}
                      className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl px-3.5 py-3 text-xs text-[var(--pm-text)] placeholder-[var(--pm-muted)]/60 focus:border-[var(--pm-accent)] outline-none font-medium transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-[var(--pm-muted)] tracking-wider block">
                      অফিসিয়াল মোবাইল নম্বর <span className="text-[var(--pm-accent)]">*</span>
                    </label>
                    <input 
                      type="tel"
                      required
                      placeholder="017XXXXXXXX"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl px-3.5 py-3 text-xs text-[var(--pm-text)] placeholder-[var(--pm-muted)]/60 focus:border-[var(--pm-accent)] outline-none font-medium transition-all"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-[var(--pm-muted)] tracking-wider block">
                    স্টোরের বিবরণ বা স্পেশালিটি (Bio)
                  </label>
                  <textarea 
                    placeholder="আপনার পণ্য সম্ভার, স্পেশাল মিল-রেট বা পাইকারি সুবিধাবলী সম্পর্কে সংক্ষেপে লিখুন..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl p-3.5 text-xs text-[var(--pm-text)] placeholder-[var(--pm-muted)]/60 focus:border-[var(--pm-accent)] outline-none min-h-[75px] transition-all"
                  />
                </div>
              </div>

              {/* Step 2 Actions */}
              <div className="pt-3 border-t border-[var(--pm-border)] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="px-4 py-2 rounded-2xl border border-[var(--pm-border)] text-xs font-bold text-[var(--pm-muted)] hover:text-[var(--pm-text)] transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> পূর্ববর্তী
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!storeName.trim()) {
                      toast.error('স্টোরের নাম প্রদান করুন!');
                      return;
                    }
                    setActiveStep(3);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white text-xs font-black transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-[var(--pm-accent)]/20 active:scale-95"
                >
                  পরবর্তী ধাপ: ক্যাটাগরি ও পেপারস <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ═════════ STEP 3: CATEGORIES & LEGAL PAPERS ═════════ */}
          {activeStep === 3 && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="space-y-6"
            >
              {/* Category Niche Selector */}
              <div className="bg-[var(--pm-card)] border border-[var(--pm-border)] p-5 md:p-6 rounded-3xl space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-[var(--pm-text)] uppercase tracking-wider flex items-center gap-2">
                      <LayoutGrid className="w-4 h-4 text-[var(--pm-accent)]" />
                      <span>ধাপ ৩: পণ্যের ক্যাটাগরি ও আইনি পেপারস</span>
                    </h3>
                    <p className="text-xs text-[var(--pm-muted)] mt-1">
                      যে যে ক্যাটাগরিতে প্রোডাক্ট লিস্টিং করবেন তা নির্বাচন করুন:
                    </p>
                  </div>
                  <span className="text-[10px] text-[var(--pm-accent)] font-bold bg-[var(--pm-accent)]/10 px-2.5 py-1 rounded-full">
                    {selectedCats.length} টি নির্বাচিত
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 select-none">
                  {BUSINESS_CATEGORIES.map(cat => {
                    const isSelected = selectedCats.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategoryToggle(cat.id)}
                        className={cn(
                          "flex items-start gap-3 p-3.5 rounded-2xl border transition-all text-left cursor-pointer group active:scale-[0.99]",
                          isSelected 
                            ? "bg-[var(--pm-surface)] border-[var(--pm-accent)] shadow-xs ring-1 ring-[var(--pm-accent)]/20" 
                            : "bg-[var(--pm-bg)]/60 border-[var(--pm-border)] hover:border-[var(--pm-muted)]/30"
                        )}
                      >
                        <div className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors mt-0.5",
                          isSelected 
                            ? "bg-[var(--pm-accent)] text-white shadow-sm" 
                            : "bg-[var(--pm-surface)] text-[var(--pm-muted)] group-hover:text-[var(--pm-text)]"
                        )}>
                          <cat.icon className="w-4.5 h-4.5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-xs font-bold text-[var(--pm-text)] truncate">{lang === 'bn' ? cat.labelBn : cat.label}</h4>
                            <div className={cn(
                              "w-4 h-4 rounded-full border flex items-center justify-center transition-all shrink-0",
                              isSelected ? "bg-[var(--pm-accent)] border-transparent text-white" : "border-[var(--pm-border)]"
                            )}>
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                          </div>
                          <p className="text-[10px] text-[var(--pm-muted)] line-clamp-1 mt-0.5">{lang === 'bn' ? cat.descriptionBn : cat.description}</p>
                          <span className="text-[9px] text-[var(--pm-muted)]/80 block mt-1">
                            {cat.requiredDocs.length} টি আবশ্যক পেপার
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mandatory Documents Upload */}
              <div className="bg-[var(--pm-card)] border border-[var(--pm-border)] p-5 md:p-6 rounded-3xl space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs md:text-sm font-black text-[var(--pm-text)] uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>আবশ্যক ডকুমেন্টস আপলোড (Mandatory Verification)</span>
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {activeRequiredDocs.filter(d => uploadedDocs[d.id]?.progress === 100).length} / {activeRequiredDocs.length} আপলোড
                  </span>
                </div>

                <div className="space-y-3 pt-1">
                  {activeRequiredDocs.map((doc) => {
                    const upload = uploadedDocs[doc.id];
                    const isComplete = upload && upload.progress === 100;

                    return (
                      <div 
                        key={doc.id}
                        className={cn(
                          "p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5",
                          isComplete 
                            ? "bg-emerald-500/5 border-emerald-500/30" 
                            : "bg-[var(--pm-bg)]/60 border-[var(--pm-border)]"
                        )}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[var(--pm-accent)] shrink-0" />
                            <h4 className="text-xs font-bold text-[var(--pm-text)]">{lang === 'bn' ? doc.nameBn : doc.name}</h4>
                            <span className="text-[9px] text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded font-bold">
                              আবশ্যক
                            </span>
                          </div>
                          <p className="text-[10px] text-[var(--pm-muted)]">{doc.placeholder}</p>
                        </div>

                        <div className="shrink-0 flex items-center gap-2.5">
                          {upload ? (
                            <div className="w-full sm:w-44 space-y-1 text-right">
                              <div className="flex items-center justify-between text-[10px] font-bold text-[var(--pm-muted)]">
                                <span className="truncate max-w-[110px]">{upload.name}</span>
                                <span className="tabular-nums">{upload.progress}%</span>
                              </div>
                              <div className="w-full bg-[var(--pm-surface)] h-1.5 rounded-full overflow-hidden border border-[var(--pm-border)]">
                                <div 
                                  className="bg-emerald-400 h-full transition-all duration-300" 
                                  style={{ width: `${upload.progress}%` }} 
                                />
                              </div>
                            </div>
                          ) : (
                            <label className="flex items-center gap-1.5 px-3 py-2 bg-[var(--pm-surface)] hover:bg-[var(--pm-surface)]/80 border border-[var(--pm-border)] rounded-xl text-[10px] font-bold uppercase tracking-wider text-[var(--pm-text)] cursor-pointer transition-all active:scale-95">
                              <Upload className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
                              <span>ফাইল আপলোড</span>
                              <input 
                                type="file" 
                                className="hidden" 
                                accept=".pdf,image/*"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) handleSimulatedUpload(doc.id, f.name);
                                }}
                              />
                            </label>
                          )}

                          {isComplete && (
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                              <label className="text-[9px] text-[var(--pm-muted)] hover:text-white underline cursor-pointer">
                                পরিবর্তন
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept=".pdf,image/*"
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) handleSimulatedUpload(doc.id, f.name);
                                  }}
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 3 Actions */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="px-4 py-2 rounded-2xl border border-[var(--pm-border)] text-xs font-bold text-[var(--pm-muted)] hover:text-[var(--pm-text)] transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> পূর্ববর্তী
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(4)}
                  className="px-5 py-2.5 rounded-2xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white text-xs font-black transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-[var(--pm-accent)]/20 active:scale-95"
                >
                  পরবর্তী ধাপ: ঠিকানা ও পেমেন্ট <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ═════════ STEP 4: LOCATION, COURIER & PAYOUT ═════════ */}
          {activeStep === 4 && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="space-y-6"
            >
              {/* Address selector card */}
              <div className="bg-[var(--pm-card)] border border-[var(--pm-border)] p-5 md:p-6 rounded-3xl space-y-4 shadow-xl">
                <div>
                  <h3 className="text-sm font-black text-[var(--pm-text)] uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[var(--pm-accent)]" />
                    <span>ধাপ ৪: শপ বা গুদামের ঠিকানা (Location)</span>
                  </h3>
                  <p className="text-xs text-[var(--pm-muted)] mt-1">
                    কুরিয়ার পার্টনাররা এখান থেকেই আপনার অর্ডারকৃত পণ্য পিকআপ করবে:
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  <BDAddressSelector 
                    onChange={(details: AddressDetails) => {
                      const formatted = [details.area, details.upazila, details.district, details.division].filter(Boolean).join(', ');
                      setAddress(formatted);
                    }}
                  />
                  
                  {address && (
                    <div className="p-3 bg-[var(--pm-surface)] rounded-2xl border border-[var(--pm-border)] text-xs text-[var(--pm-text)] flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[var(--pm-accent)] shrink-0" />
                      <div>
                        <span className="text-[10px] text-[var(--pm-muted)] font-bold block">নির্ধারিত পিকআপ ঠিকানা:</span>
                        <span className="font-semibold">{address}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Fulfillment & Payout Logistics */}
              <div className="bg-[var(--pm-card)] border border-[var(--pm-border)] p-5 md:p-6 rounded-3xl space-y-4 shadow-xl">
                <h3 className="text-xs md:text-sm font-black text-[var(--pm-text)] uppercase tracking-wider flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[var(--pm-accent)]" />
                  <span>লজিস্টিকস ও আর্থিক সেটআপ (Fulfillment & Payouts)</span>
                </h3>

                <div className="space-y-4 pt-1">
                  {/* Delivery Method Choice Cards */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-[var(--pm-muted)] tracking-wider">ডেলিভারি মেথড নির্বাচন করুন</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        { id: 'paikarmart', title: 'PaikarMart Express', desc: 'আমাদের পার্টনার কুরিয়ার পিকআপ' },
                        { id: 'self', title: 'Self-Shipment', desc: 'মার্চেন্ট নিজস্ব কুরিয়ার' },
                        { id: 'pickup', title: 'Counter Pickup', desc: 'আড়ত থেকে সরাসরি সংগ্রহ' },
                      ].map((m) => {
                        const isSelected = deliveryMethod === m.id;
                        return (
                          <div 
                            key={m.id}
                            onClick={() => setDeliveryMethod(m.id)}
                            className={cn(
                              "p-3 rounded-2xl border text-left cursor-pointer transition-all",
                              isSelected 
                                ? "bg-[var(--pm-surface)] border-[var(--pm-accent)] text-[var(--pm-text)] shadow-xs" 
                                : "bg-[var(--pm-bg)]/40 border-[var(--pm-border)] text-[var(--pm-muted)] hover:border-[var(--pm-border)]/80"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[var(--pm-text)]">{m.title}</span>
                              <span className={cn("w-3 h-3 rounded-full border", isSelected ? "bg-[var(--pm-accent)] border-transparent" : "border-[var(--pm-border)]")} />
                            </div>
                            <p className="text-[9px] text-[var(--pm-muted)] mt-1">{m.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Payout Method Choice Cards */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-[var(--pm-muted)] tracking-wider">টাকা উত্তোলনের মাধ্যম (Payout Channel)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        { id: 'wallet', title: 'Digital Wallet', desc: 'তাৎক্ষণিক ওয়ালেট ব্যালেন্স' },
                        { id: 'bkash', title: 'bKash Mobile', desc: 'সরাসরি পার্সোনাল/মার্চেন্ট নম্বর' },
                        { id: 'bank', title: 'Bank Account', desc: 'যেকোনো ব্যাংক সরাসরি EFT' },
                      ].map((p) => {
                        const isSelected = payoutMethod === p.id;
                        return (
                          <div 
                            key={p.id}
                            onClick={() => setPayoutMethod(p.id)}
                            className={cn(
                              "p-3 rounded-2xl border text-left cursor-pointer transition-all",
                              isSelected 
                                ? "bg-[var(--pm-surface)] border-[var(--pm-accent)] text-[var(--pm-text)] shadow-xs" 
                                : "bg-[var(--pm-bg)]/40 border-[var(--pm-border)] text-[var(--pm-muted)] hover:border-[var(--pm-border)]/80"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[var(--pm-text)]">{p.title}</span>
                              <span className={cn("w-3 h-3 rounded-full border", isSelected ? "bg-[var(--pm-accent)] border-transparent" : "border-[var(--pm-border)]")} />
                            </div>
                            <p className="text-[9px] text-[var(--pm-muted)] mt-1">{p.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 Actions & Final Submit */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="px-4 py-2 rounded-2xl border border-[var(--pm-border)] text-xs font-bold text-[var(--pm-muted)] hover:text-[var(--pm-text)] transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> পূর্ববর্তী
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3.5 bg-gradient-to-r from-[var(--pm-accent)] to-[var(--pm-accent-hover)] text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[var(--pm-accent)]/20 text-xs active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>প্রসেসিং হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>স্টোর চালু করুন (Launch Live Store)</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

        </div>

        {/* Right Column: Live Interactive Store Preview Card & Quick Actions (col-span-12 lg:col-span-5 sticky) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          
          {/* LIVE MERCHANT STORE PREVIEW CARD */}
          <div className="p-5 md:p-6 rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] space-y-4 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--pm-border)] pb-3">
              <span className="text-[10px] font-black uppercase text-[var(--pm-accent)] tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> লাইভ স্টোর কার্ড প্রিভিউ
              </span>
              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                লাইভ মোড
              </span>
            </div>

            {/* Model Badge */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-xl bg-[var(--pm-accent)]/15 text-[var(--pm-accent)] border border-[var(--pm-accent)]/30 flex items-center gap-1.5">
                <currentModelObj.icon className="w-3.5 h-3.5" />
                {currentModelObj.badgeBn}
              </span>
              <span className="text-[10px] text-[var(--pm-muted)] font-mono">
                {tradeLicenseNumber ? `Lic: ${tradeLicenseNumber.slice(0, 10)}...` : 'e-CAB ভেরিফাইড'}
              </span>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5 min-w-0">
                  <h4 className="text-base font-black text-[var(--pm-text)] truncate">
                    {storeName || (lang === 'bn' ? 'আপনার স্টোরের নাম' : 'Your Store Name')}
                  </h4>
                  <p className="text-[11px] text-[var(--pm-muted)] truncate">
                    {businessName || ownerName || 'Verified Social Commerce Partner'}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[var(--pm-accent)] to-amber-500 flex items-center justify-center text-white shrink-0 font-black text-sm shadow-md shadow-[var(--pm-accent)]/20">
                  {storeName ? storeName.charAt(0).toUpperCase() : 'P'}
                </div>
              </div>

              {description && (
                <p className="text-[11px] text-[var(--pm-muted)] line-clamp-2 pt-1 italic">
                  "{description}"
                </p>
              )}

              {/* Dynamic Feature Badges */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                <span className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg text-[var(--pm-text)] font-semibold flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" /> ৫.০ রেটিং
                </span>
                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-lg font-semibold">
                  ০% মেম্বারশিপ ফি
                </span>
                <span className="text-[9px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-lg font-semibold">
                  এসক্রো প্রটেকশন
                </span>
              </div>

              {/* Location & Delivery Info */}
              <div className="pt-3 border-t border-[var(--pm-border)] text-[11px] text-[var(--pm-muted)] flex items-center justify-between">
                <span className="truncate max-w-[160px] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[var(--pm-accent)] shrink-0" />
                  <span className="truncate">{address || 'ঢাকা, বাংলাদেশ'}</span>
                </span>
                <span className="text-[var(--pm-accent)] font-bold shrink-0">
                  {deliveryMethod === 'paikarmart' ? 'Paikar Express' : deliveryMethod === 'self' ? 'Self-Courier' : 'Counter Pickup'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Step Navigator / Onboarding Checklist */}
          <div className="p-5 rounded-3xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-3">
            <h4 className="text-[10px] font-black uppercase text-[var(--pm-muted)] tracking-widest">
              অনবোর্ডিং চেকলিস্ট (Setup Flow)
            </h4>
            <div className="space-y-2">
              {[
                { step: 1, label: 'ব্যবসার মডেল নির্বাচন', done: !!selectedModel },
                { step: 2, label: 'স্টোর ও মার্চেন্ট তথ্য', done: storeName.trim().length > 2 },
                { step: 3, label: 'ক্যাটাগরি ও আইনি ভেরিফিকেশন', done: selectedCats.length > 0 && activeRequiredDocs.every(d => uploadedDocs[d.id]?.progress === 100) },
                { step: 4, label: 'ঠিকানা ও আর্থিক পে-আউট', done: address.trim().length > 3 },
              ].map((item) => (
                <div
                  key={item.step}
                  onClick={() => setActiveStep(item.step as any)}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 cursor-pointer text-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {item.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center text-[9px] font-bold", activeStep === item.step ? "border-[var(--pm-accent)] text-[var(--pm-accent)]" : "border-[var(--pm-border)] text-[var(--pm-muted)]")}>
                        {item.step}
                      </div>
                    )}
                    <span className={cn("font-medium", item.done ? "text-[var(--pm-text)]" : "text-[var(--pm-muted)]")}>
                      {item.label}
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--pm-muted)]" />
                </div>
              ))}
            </div>
          </div>

          {/* Direct Submit Button if ready */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-[var(--pm-accent)] to-[var(--pm-accent-hover)] text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[var(--pm-accent)]/20 select-none cursor-pointer active:scale-[0.99] transition-all disabled:opacity-50 text-xs"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>প্রসেসিং হচ্ছে...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>স্টোর চালু করুন (Launch Live Store)</span>
              </>
            )}
          </button>

          <p className="text-center text-[10px] text-[var(--pm-muted)] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>ভুল তথ্য প্রদান করলে সেলার লাইসেন্স বাতিল হতে পারে</span>
          </p>

        </div>

      </form>
    </div>
  );
};

function SuccessView({ storeName }: { storeName: string }) {
  const { lang: storeLang } = useAppStore();
  const lang = (storeLang as string || 'bn').toLowerCase();
  return (
    <div className="min-h-[80vh] bg-[var(--pm-bg)] text-[var(--pm-text)] flex items-center justify-center p-4 select-none">
      <motion.div 
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-sm w-full text-center space-y-6"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-[var(--pm-accent)] blur-3xl opacity-20 animate-pulse" />
          <div className="relative w-20 h-20 rounded-full bg-[var(--pm-accent)] flex items-center justify-center mx-auto shadow-lg shadow-[var(--pm-accent)]/30">
            <CheckCircle2 size={40} className="text-white" />
          </div>
        </div>
        
        <div className="space-y-1.5">
          <h1 className="text-2xl md:text-3xl font-black text-[var(--pm-text)]">
            {lang === 'bn' ? 'অভিনন্দন!' : 'Congratulations!'}
          </h1>
          <p className="text-[var(--pm-muted)] text-xs md:text-sm leading-relaxed">
            {lang === 'bn' 
              ? `${storeName} এখন পাইকার মার্টে লাইভ। আপনার সেলার যাত্রা শুরু হোক!` 
              : `${storeName} is now live on PaikarMart. Let your merchant journey begin!`}
          </p>
        </div>

        <div className="bg-[var(--pm-card)] border border-[var(--pm-border)] rounded-2xl p-5 text-left space-y-3">
          <h3 className="text-[10px] font-black uppercase text-[var(--pm-accent)] tracking-widest">Setup Checklist</h3>
          <div className="space-y-2.5">
            {[
              { label: 'Unified Store Activated', done: true },
              { label: 'Mandatory Category Verification Verified', done: true },
              { label: 'Add First Inventory Listing', done: false },
              { label: 'Complete Financial Settlement Setup', done: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5">
                {item.done ? (
                  <CheckCircle2 size={15} className="text-emerald-400" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-[var(--pm-border)]" />
                )}
                <span className={cn("text-xs font-semibold", item.done ? "text-[var(--pm-text)]" : "text-[var(--pm-muted)]")}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={() => window.location.href = '/seller'}
          className="w-full py-4 bg-[var(--pm-text)] hover:opacity-90 text-[var(--pm-bg)] font-black rounded-xl uppercase tracking-widest text-xs transition-all cursor-pointer shadow-md"
        >
          {lang === 'bn' ? 'সেলার ড্যাশবোর্ডে যান' : 'Go to Seller Central'}
        </button>
      </motion.div>
    </div>
  );
}
