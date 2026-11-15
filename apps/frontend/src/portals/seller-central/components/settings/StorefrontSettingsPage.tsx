import React, { useState } from 'react';
import { Store, Camera, Tag, Mail, Phone, MapPin, Check, Image as ImageIcon } from 'lucide-react';
import { VendorCategory } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

export const StorefrontSettingsPage: React.FC = () => {
  const { language } = useLanguage();
  const [storeName, setStoreName] = useState('Urban Tech Wholesale & Retail');
  const [category, setCategory] = useState<VendorCategory>('wholesale');
  const [tagline, setTagline] = useState('Direct Importer & Factory Authorized Electronics Distributor');
  const [description, setDescription] = useState('We supply high-grade consumer electronics, smartphone accessories, and bulk wholesale pallets across Bangladesh.');
  const [helplinePhone, setHelplinePhone] = useState('+880 1911-223344');
  const [supportEmail, setSupportEmail] = useState('sales@urbantech.com.bd');
  const [storeAddress, setStoreAddress] = useState('Shop 402, Multiplan Center, Elephant Road, Dhaka');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const isBn = language === 'bn';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-lg font-black text-[var(--pm-text)]">
          {isBn ? 'দোকানের ব্র্যান্ডিং ও প্রোফাইল' : 'Storefront Profile & Branding'}
        </h3>
        <p className="text-xs text-[var(--pm-muted)]">
          {isBn 
            ? 'ক্রেতাদের কাছে আপনার দোকানের লোগো, কভার ব্যানার, পরিচিতি ও কাস্টমার হেল্পলাইন তথ্য প্রদর্শন করুন' 
            : 'Customize your merchant logo, banner, store bio, and public customer service lines'}
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-[var(--pm-success-soft)] border border-[var(--pm-success)]/30 text-[var(--pm-success)] text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 shrink-0" />
          <span>{isBn ? 'দোকানের তথ্য সফলভাবে সংরক্ষিত হয়েছে!' : 'Store profile updated successfully!'}</span>
        </div>
      )}

      {/* Store Banner & Logo Preview */}
      <div className="rounded-3xl border border-[var(--pm-border)] overflow-hidden bg-[var(--pm-card)] shadow-xs">
        <div className="h-32 sm:h-40 bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 relative flex items-center justify-center">
          <button 
            type="button"
            className="px-3 py-1.5 rounded-xl bg-black/45 hover:bg-black/65 text-white text-xs font-bold backdrop-blur-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{isBn ? 'ব্যানার পরিবর্তন করুন' : 'Change Store Banner'}</span>
          </button>
        </div>

        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-10 sm:-mt-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[var(--pm-card)] ring-4 ring-[var(--pm-card)] shadow-xl flex items-center justify-center font-black text-2xl text-[var(--pm-accent)] border border-[var(--pm-border)]">
                <Store className="w-10 h-10" />
              </div>
              <button 
                type="button"
                className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-md hover:bg-[var(--pm-accent-hover)] transition-all cursor-pointer"
                title="Change Logo"
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>

            <div className="text-center sm:text-left space-y-0.5">
              <h4 className="text-base font-black text-[var(--pm-text)]">{storeName}</h4>
              <p className="text-xs text-[var(--pm-accent)] font-semibold">{tagline}</p>
              <p className="text-[11px] text-[var(--pm-muted)] font-medium">{storeAddress}</p>
            </div>
          </div>

          <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[var(--pm-success-soft)] text-[var(--pm-success)] border border-[var(--pm-success)]/30">
            {isBn ? 'ভেরিফাইড মার্চেন্ট' : 'Verified Merchant Store'}
          </span>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--pm-text)] flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
              <span>{isBn ? 'দোকান / ব্যবসার নাম' : 'Store Trade Name'}</span>
            </label>
            <input
              type="text"
              value={storeName}
              onChange={e => setStoreName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] text-xs font-semibold focus:outline-hidden focus:border-[var(--pm-accent)]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--pm-text)] flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-purple-500" />
              <span>{isBn ? 'প্রধান ক্যাটাগরি' : 'Primary Business Category'}</span>
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as VendorCategory)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] text-xs font-semibold focus:outline-hidden focus:border-[var(--pm-accent)]"
            >
              <option value="wholesale">{isBn ? 'হোলসেল ও ডিলার (Wholesale)' : 'Wholesale Bulk Supply'}</option>
              <option value="retail">{isBn ? 'রিটেল শপ (Retail)' : 'Retail Consumer Store'}</option>
              <option value="restaurant">{isBn ? 'রেস্তোরাঁ ও ক্যাফে (Restaurant)' : 'Food & Restaurant'}</option>
              <option value="grocery">{isBn ? 'মুদি ও সুপারশপ (Grocery)' : 'Grocery & Daily Needs'}</option>
              <option value="services">{isBn ? 'অন-ডিমান্ড সার্ভিস (Services)' : 'On-Demand Repairs & Services'}</option>
              <option value="rideshare">{isBn ? 'রাইড ও লজিস্টিকস (Logistics)' : 'Ride Fleet & Transport'}</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--pm-text)] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[var(--pm-success)]" />
              <span>{isBn ? 'কাস্টমার হেল্পলাইন ফোন' : 'Customer Support Helpline'}</span>
            </label>
            <input
              type="tel"
              value={helplinePhone}
              onChange={e => setHelplinePhone(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] text-xs font-semibold focus:outline-hidden focus:border-[var(--pm-accent)]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--pm-text)] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[var(--pm-warning)]" />
              <span>{isBn ? 'সাপোর্ট ইমেইল' : 'Customer Support Email'}</span>
            </label>
            <input
              type="email"
              value={supportEmail}
              onChange={e => setSupportEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] text-xs font-semibold focus:outline-hidden focus:border-[var(--pm-accent)]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[var(--pm-text)]">
            {isBn ? 'শর্ট ট্যাগলাইন' : 'Store Tagline'}
          </label>
          <input
            type="text"
            value={tagline}
            onChange={e => setTagline(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] text-xs font-semibold focus:outline-hidden focus:border-[var(--pm-accent)]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[var(--pm-text)] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[var(--pm-danger)]" />
            <span>{isBn ? 'দোকান / ওয়্যারহাউস ঠিকানা' : 'Store & Warehouse Physical Address'}</span>
          </label>
          <input
            type="text"
            value={storeAddress}
            onChange={e => setStoreAddress(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] text-xs font-semibold focus:outline-hidden focus:border-[var(--pm-accent)]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[var(--pm-text)]">
            {isBn ? 'দোকানের পরিচিতি ও বিবরণ' : 'Store Description & Merchant Bio'}
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] text-xs font-medium focus:outline-hidden focus:border-[var(--pm-accent)]"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
          >
            {isBn ? 'দোকানের তথ্য সংরক্ষণ করুন' : 'Save Storefront Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};
