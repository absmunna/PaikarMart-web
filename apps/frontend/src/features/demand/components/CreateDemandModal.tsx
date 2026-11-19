import React, { useState } from 'react';
import {
  X,
  PlusCircle,
  ShoppingBag,
  Wrench,
  Truck,
  CheckCircle2,
  MapPin,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { DemandRequest } from '@/features/demand/types/demandTypes';
import { User } from '@/types';

interface CreateDemandModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  initialDomain?: 'products' | 'services' | 'logistics';
  onAddDemand: (newDemand: DemandRequest) => void;
}

export const CreateDemandModal: React.FC<CreateDemandModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  initialDomain = 'products',
  onAddDemand
}) => {
  const [domain, setDomain] = useState<'products' | 'services' | 'logistics'>(initialDomain);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('Pieces');
  const [targetBudgetBdt, setTargetBudgetBdt] = useState('');
  const [locationCity, setLocationCity] = useState(currentUser.location?.split(',')[0]?.trim() || 'Dhaka');
  const [locationArea, setLocationArea] = useState(currentUser.location || 'Dhanmondi, Dhaka');
  const [urgency, setUrgency] = useState<'urgent' | 'standard' | 'flexible'>('urgent');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetBudgetBdt) return;

    const newDemand: DemandRequest = {
      id: `dem_${Date.now()}`,
      buyerId: currentUser.id,
      buyerName: currentUser.name || 'Verified Buyer',
      buyerAvatar: currentUser.avatar,
      domain,
      title: title.trim(),
      description: description.trim() || title.trim(),
      category: category || (domain === 'products' ? 'General Merchandise' : domain === 'services' ? 'On-Demand Service' : 'Cargo Transport'),
      quantity: quantity ? parseInt(quantity, 10) : undefined,
      unit: quantity ? unit : undefined,
      targetBudgetBdt: parseFloat(targetBudgetBdt) || 0,
      locationCity,
      locationArea,
      urgency,
      status: 'open',
      quotesCount: 0,
      createdAt: 'Just now',
    };

    onAddDemand(newDemand);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[var(--pm-border)] bg-[var(--pm-surface)]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--pm-text)]">চাহিদা বা ডিমান্ড পোস্ট করুন</h3>
              <p className="text-[11px] text-[var(--pm-muted)]">সেলার ও প্রোভাইডারদের কাছ থেকে সরাসরি কোটেশন পান</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[var(--pm-card-hover)] text-[var(--pm-muted)] cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {isSuccess ? (
            <div className="py-12 text-center space-y-3 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-black text-[var(--pm-text)]">ডিমান্ড পোস্ট সফল হয়েছে!</h4>
              <p className="text-xs text-[var(--pm-muted)]">আপনার চাহিদা সংশ্লিষ্ট বিক্রেতা ও সার্ভিস প্রোভাইডারদের কাছে পৌঁছে গেছে।</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Domain Selector */}
              <div>
                <label className="text-xs font-bold text-[var(--pm-text)] mb-2 block">
                  কিসের চাহিদা প্রয়োজন?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDomain('products')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      domain === 'products'
                        ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : 'border-[var(--pm-border)] bg-[var(--pm-surface)] text-[var(--pm-muted)]'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>পণ্য (Products)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDomain('services')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      domain === 'services'
                        ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400'
                        : 'border-[var(--pm-border)] bg-[var(--pm-surface)] text-[var(--pm-muted)]'
                    }`}
                  >
                    <Wrench className="w-4 h-4" />
                    <span>সার্ভিস (Services)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDomain('logistics')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      domain === 'logistics'
                        ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'border-[var(--pm-border)] bg-[var(--pm-surface)] text-[var(--pm-muted)]'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span>লজিস্টিকস / রাইড</span>
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-bold text-[var(--pm-text)] mb-1 block">
                  চাহিদার শিরোনাম (সংক্ষেপে কী দরকার?) *
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    domain === 'products'
                      ? 'উদা: ৫০ পিস কটন শার্ট বা ১০ বস্তা মিনিকেট চাল'
                      : domain === 'services'
                      ? 'উদা: ধানমন্ডিতে জরুরি এসি গ্যাস রিফিল'
                      : 'উদা: কাওরান বাজার থেকে টঙ্গী ৩ টন পিকআপ'
                  }
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-xs text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-[var(--pm-text)] mb-1 block">
                  বিস্তারিত বিবরণ
                </label>
                <textarea
                  rows={2}
                  placeholder="নির্দিষ্ট কোয়ালিটি, সাইজ বা কোনো স্পেসিফিকেশন থাকলে লিখুন..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-xs text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)] resize-none"
                />
              </div>

              {/* Budget & Quantity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[var(--pm-text)] mb-1 block">
                    টার্গেট বাজেট (৳) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="৳ 5,000"
                    value={targetBudgetBdt}
                    onChange={(e) => setTargetBudgetBdt(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-xs font-mono font-bold text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]"
                  />
                </div>

                {domain !== 'services' ? (
                  <div>
                    <label className="text-xs font-bold text-[var(--pm-text)] mb-1 block">
                      পরিমাণ ও ইউনিট
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="number"
                        placeholder="Qty"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-1/2 px-3 py-2.5 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-xs text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]"
                      />
                      <input
                        type="text"
                        placeholder="পিস/কেজি"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="w-1/2 px-3 py-2.5 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-xs text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-bold text-[var(--pm-text)] mb-1 block">
                      জরুরিতা (Urgency)
                    </label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-xs text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)] cursor-pointer"
                    >
                      <option value="urgent">জরুরি (আজকের মধ্যে)</option>
                      <option value="standard">স্ট্যান্ডার্ড (১-২ দিন)</option>
                      <option value="flexible">ফ্লেক্সিবল (সুবিধাজনক সময়)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="text-xs font-bold text-[var(--pm-text)] mb-1 block">
                  লোকেশন বা ঠিকানা
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-[var(--pm-accent)] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={locationArea}
                    onChange={(e) => setLocationArea(e.target.value)}
                    placeholder="এলাকা বা বাজারের নাম (যেমন: মিরপুর ১০, ঢাকা)"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-xs text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold cursor-pointer active-scale transition-colors shadow-md"
                >
                  ডিমান্ড লাইভ পোস্ট করুন
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
