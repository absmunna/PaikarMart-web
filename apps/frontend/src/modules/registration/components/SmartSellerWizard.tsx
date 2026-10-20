import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  ShoppingBag, Truck, MapPin, Factory, Monitor, 
  CheckCircle2, Store, Upload, ShieldCheck, 
  Wallet, Utensils, Pill, Smartphone, LayoutGrid, 
  FileText, Check, AlertCircle, Building2,
  Sparkles, Star, CreditCard, ChevronRight, RefreshCw, Eye
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

export const SmartSellerWizard: React.FC = () => {
  const { user, promoteToSeller } = useAuth();
  const { becomeSeller, updateProfile } = useSeller();
  const { lang: storeLang } = useAppStore();
  const lang = (storeLang as string || 'bn').toLowerCase();

  const [selectedCats, setSelectedCats] = useState<string[]>(['wholesale']);
  const [storeName, setStoreName] = useState('');
  const [businessName, setBusinessName] = useState('');
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

  // Derive legal documents needed based on active category selections
  const activeRequiredDocs = useMemo(() => {
    return BUSINESS_CATEGORIES.filter(cat => selectedCats.includes(cat.id))
      .flatMap(cat => cat.requiredDocs)
      .filter((doc, index, self) => self.findIndex(d => d.id === doc.id) === index); // deduplicate by doc.id
  }, [selectedCats]);

  // Compute live progress percentage
  const progressPercent = useMemo(() => {
    let score = 0;
    if (selectedCats.length > 0) score += 25;
    const completedDocs = activeRequiredDocs.filter(d => uploadedDocs[d.id]?.progress === 100);
    if (activeRequiredDocs.length > 0 && completedDocs.length === activeRequiredDocs.length) score += 25;
    if (storeName.trim().length > 2) score += 25;
    if (address.trim().length > 3) score += 25;
    return score;
  }, [selectedCats, activeRequiredDocs, uploadedDocs, storeName, address]);

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
    if (selectedCats.includes('wholesale')) {
      mappedType = 'wholesale';
    } else if (selectedCats.includes('digital_services')) {
      mappedType = 'service';
    }

    try {
      // Call Auth Context promoteToSeller
      promoteToSeller(storeName, mappedType, address);

      // Call Seller Context to update profile state
      updateProfile({
        shopName: storeName,
        tagline: description || 'Verified Social Commerce Partner',
        type: mappedType,
        location: address,
        contactEmail: email,
        contactPhone: phone,
        physicalAddress: address,
        tradeLicense: businessName || 'e-CAB Active',
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

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-6 md:py-10 pb-32 text-left">
      
      {/* Dynamic Milestones / Progress Bar */}
      <div className="mb-8 p-4 md:p-5 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-md">
        <div className="flex items-center justify-between text-xs font-bold mb-2.5">
          <span className="text-[var(--pm-text)] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[var(--pm-accent)]" />
            <span>{lang === 'bn' ? 'রেজিস্ট্রেশন সম্পূর্ণতা:' : 'Profile Readiness:'}</span>
          </span>
          <span className="text-[var(--pm-accent)] font-black tabular-nums">{progressPercent}%</span>
        </div>
        
        <div className="w-full bg-[var(--pm-bg)] h-2 rounded-full overflow-hidden border border-[var(--pm-border)]">
          <div 
            className="bg-gradient-to-r from-[var(--pm-accent)] to-[var(--pm-accent-hover)] h-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 4 Steps Checklist Indicators */}
        <div className="grid grid-cols-4 gap-2 mt-3 pt-2 text-[10px] text-[var(--pm-muted)] font-semibold border-t border-[var(--pm-border)]">
          <div className={cn("flex items-center gap-1", selectedCats.length > 0 && "text-[var(--pm-text)] font-bold")}>
            <span className={cn("w-1.5 h-1.5 rounded-full", selectedCats.length > 0 ? "bg-[var(--pm-accent)]" : "bg-[var(--pm-border)]")} />
            <span className="truncate">১. ক্যাটাগরি</span>
          </div>
          <div className={cn("flex items-center gap-1", activeRequiredDocs.every(d => uploadedDocs[d.id]?.progress === 100) && activeRequiredDocs.length > 0 && "text-[var(--pm-text)] font-bold")}>
            <span className={cn("w-1.5 h-1.5 rounded-full", activeRequiredDocs.every(d => uploadedDocs[d.id]?.progress === 100) && activeRequiredDocs.length > 0 ? "bg-[var(--pm-accent)]" : "bg-[var(--pm-border)]")} />
            <span className="truncate">২. ডকুমেন্টস</span>
          </div>
          <div className={cn("flex items-center gap-1", storeName.trim().length > 2 && "text-[var(--pm-text)] font-bold")}>
            <span className={cn("w-1.5 h-1.5 rounded-full", storeName.trim().length > 2 ? "bg-[var(--pm-accent)]" : "bg-[var(--pm-border)]")} />
            <span className="truncate">৩. স্টোর তথ্য</span>
          </div>
          <div className={cn("flex items-center gap-1", address.trim().length > 3 && "text-[var(--pm-text)] font-bold")}>
            <span className={cn("w-1.5 h-1.5 rounded-full", address.trim().length > 3 ? "bg-[var(--pm-accent)]" : "bg-[var(--pm-border)]")} />
            <span className="truncate">৪. ঠিকানা</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
        
        {/* Left Side: Category selection, Verification documents & Fulfillment (col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section 1: Business Categories Selection */}
          <div className="bg-[var(--pm-card)] border border-[var(--pm-border)] p-5 md:p-6 rounded-3xl space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-xs md:text-sm font-black text-[var(--pm-text)] uppercase tracking-wider flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-[var(--pm-accent)]" />
                <span>১. ব্যবসার ক্যাটাগরি (Business Niches)</span>
              </h3>
              <span className="text-[10px] text-[var(--pm-accent)] font-bold bg-[var(--pm-accent)]/10 px-2 py-0.5 rounded-full">
                {selectedCats.length} টি নির্বাচিত
              </span>
            </div>
            
            <p className="text-xs text-[var(--pm-muted)]">
              {lang === 'bn' 
                ? 'যে যে ক্যাটাগরিতে পণ্য বিক্রি করবেন তা সিলেক্ট করুন (একসাথে একাধিক সিলেক্ট করা যাবে):' 
                : 'Select all niches you plan to supply under on PaikarMart:'}
            </p>

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

          {/* Section 2: Mandatory Legal Document Upload area */}
          <div className="bg-[var(--pm-card)] border border-[var(--pm-border)] p-5 md:p-6 rounded-3xl space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-xs md:text-sm font-black text-[var(--pm-text)] uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>২. ভেরিফিকেশন ফাইল আপলোড (Mandatory Legal Docs)</span>
              </h3>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                {activeRequiredDocs.filter(d => uploadedDocs[d.id]?.progress === 100).length} / {activeRequiredDocs.length} আপলোড
              </span>
            </div>

            <p className="text-xs text-[var(--pm-muted)]">
              {lang === 'bn' 
                ? 'বাণিজ্যিক নিয়ম ও ক্রেতাদের আস্থা নিশ্চিত করতে নিচের ডকুমেন্টসমূহ সাবমিট করুন:' 
                : 'Upload authentic documents to receive the Verified Merchant Trust Badge:'}
            </p>

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

              {activeRequiredDocs.length === 0 && (
                <div className="p-6 text-center text-[var(--pm-muted)] border border-dashed border-[var(--pm-border)] rounded-2xl text-xs">
                  কোন ক্যাটাগরি সিলেক্ট করা নেই। দয়া করে উপরে ক্যাটাগরি সিলেক্ট করুন।
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Fulfillment & Payout Logistics */}
          <div className="bg-[var(--pm-card)] border border-[var(--pm-border)] p-5 md:p-6 rounded-3xl space-y-4 shadow-lg">
            <h3 className="text-xs md:text-sm font-black text-[var(--pm-text)] uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-[var(--pm-accent)]" />
              <span>৩. লজিস্টিকস ও আর্থিক সেটআপ (Fulfillment & Payouts)</span>
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
                          "p-3 rounded-xl border text-left cursor-pointer transition-all",
                          isSelected 
                            ? "bg-[var(--pm-surface)] border-[var(--pm-accent)] text-[var(--pm-text)]" 
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
                          "p-3 rounded-xl border text-left cursor-pointer transition-all",
                          isSelected 
                            ? "bg-[var(--pm-surface)] border-[var(--pm-accent)] text-[var(--pm-text)]" 
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

        </div>

        {/* Right Side: Store profile, Live Preview & Location (col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Shop Information Card */}
          <div className="bg-[var(--pm-card)] border border-[var(--pm-border)] p-5 md:p-6 rounded-3xl space-y-4 shadow-lg">
            <h3 className="text-xs md:text-sm font-black text-[var(--pm-text)] uppercase tracking-wider flex items-center gap-2">
              <Store className="w-4 h-4 text-[var(--pm-accent)]" />
              <span>৪. শপের তথ্য (Store Profile)</span>
            </h3>

            <div className="space-y-3.5 pt-1">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-[var(--pm-muted)] tracking-wider">
                  স্টোরের নাম (Store Name) <span className="text-[var(--pm-accent)]">*</span>
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--pm-muted)]" />
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Banani Fashion Point"
                    value={storeName}
                    onChange={e => setStoreName(e.target.value)}
                    className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl pl-10 pr-3.5 py-3 text-xs text-[var(--pm-text)] placeholder-[var(--pm-muted)]/60 focus:border-[var(--pm-accent)] focus:ring-1 focus:ring-[var(--pm-accent)]/30 outline-none font-bold transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-[var(--pm-muted)] tracking-wider">কোম্পানির আইনি নাম (ঐচ্ছিক)</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--pm-muted)]" />
                  <input 
                    type="text"
                    placeholder="e.g. Banani Apparel Ltd."
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl pl-10 pr-3.5 py-3 text-xs text-[var(--pm-text)] placeholder-[var(--pm-muted)]/60 focus:border-[var(--pm-accent)] focus:ring-1 focus:ring-[var(--pm-accent)]/30 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-[var(--pm-muted)] tracking-wider">শপের বিবরণ (Description)</label>
                <textarea 
                  placeholder="আপনার শপ বা পাইকারি কালেকশন সম্পর্কে সংক্ষেপে লিখুন..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl p-3.5 text-xs text-[var(--pm-text)] placeholder-[var(--pm-muted)]/60 focus:border-[var(--pm-accent)] focus:ring-1 focus:ring-[var(--pm-accent)]/30 outline-none min-h-[75px] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Location & Address card */}
          <div className="bg-[var(--pm-card)] border border-[var(--pm-border)] p-5 md:p-6 rounded-3xl space-y-4 shadow-lg">
            <h3 className="text-xs md:text-sm font-black text-[var(--pm-text)] uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[var(--pm-accent)]" />
              <span>৫. শপ বা গুদামের ঠিকানা (Shop Location)</span>
            </h3>

            <div className="space-y-3 pt-1">
              <BDAddressSelector 
                onChange={(details: AddressDetails) => {
                  const formatted = [details.area, details.upazila, details.district, details.division].filter(Boolean).join(', ');
                  setAddress(formatted);
                }}
              />
              
              {address && (
                <div className="p-3 bg-[var(--pm-surface)] rounded-xl border border-[var(--pm-border)] text-xs text-[var(--pm-text)]">
                  <span className="text-[10px] text-[var(--pm-muted)] font-bold block mb-1">নির্ধারিত ফুল ঠিকানা:</span>
                  {address}
                </div>
              )}
            </div>
          </div>

          {/* LIVE MERCHANT STORE PREVIEW CARD */}
          <div className="p-5 rounded-3xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-3 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--pm-border)] pb-2.5">
              <span className="text-[10px] font-black uppercase text-[var(--pm-accent)] tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> স্টোর কার্ড প্রিভিউ (Live Preview)
              </span>
              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                রেডি টু লাইভ
              </span>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-black text-[var(--pm-text)] truncate max-w-[200px]">
                    {storeName || (lang === 'bn' ? 'আপনার স্টোরের নাম' : 'Your Store Name')}
                  </h4>
                  <p className="text-[10px] text-[var(--pm-muted)] truncate">
                    {businessName || 'Verified Social Commerce Partner'}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-[var(--pm-accent)]/15 border border-[var(--pm-accent)]/30 flex items-center justify-center text-[var(--pm-accent)] shrink-0 font-black text-xs">
                  {storeName ? storeName.charAt(0).toUpperCase() : 'P'}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-[var(--pm-text)] font-semibold flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" /> ৫.০
                </span>
                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-semibold">
                  ০% কমিশন
                </span>
                <span className="text-[9px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-md font-semibold">
                  e-CAB ভেরিফাইড
                </span>
              </div>

              <div className="pt-2 border-t border-[var(--pm-border)] text-[10px] text-[var(--pm-muted)] flex items-center justify-between">
                <span className="truncate max-w-[150px]">{address || 'ঢাকা, বাংলাদেশ'}</span>
                <span className="text-[var(--pm-accent)] font-bold">{deliveryMethod === 'paikarmart' ? 'Paikar Express' : 'Self-Courier'}</span>
              </div>
            </div>
          </div>

          {/* Master Registration trigger button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-[var(--pm-accent)] to-[var(--pm-accent-hover)] text-white font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[var(--pm-accent)]/20 select-none cursor-pointer active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>প্রসেসিং হচ্ছে...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
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
