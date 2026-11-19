import React, { useState } from 'react';
import { Truck, MapPin, Clock, PackageCheck, Shield, Check, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const FulfillmentSettingsPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [insideCityCharge, setInsideCityCharge] = useState('60');
  const [outsideCityCharge, setOutsideCityCharge] = useState('130');
  const [expressDeliveryCharge, setExpressDeliveryCharge] = useState('180');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('2500');
  const [freeShippingEnabled, setFreeShippingEnabled] = useState(true);

  // Logistics methods
  const [enableInHouseFleet, setEnableInHouseFleet] = useState(true);
  const [enableStorePickup, setEnableStorePickup] = useState(true);
  const [preferredCourier, setPreferredCourier] = useState('steadfast');
  const [leadTimeHours, setLeadTimeHours] = useState('4');
  const [maxDeliveryRadiusKm, setMaxDeliveryRadiusKm] = useState('25');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-lg font-black text-[var(--pm-text)]">
          {isBn ? 'ডেলিভারি ও লজিস্টিকস সেটিংস' : 'Delivery & Fulfillment Logistics'}
        </h3>
        <p className="text-xs text-[var(--pm-muted)]">
          {isBn
            ? 'শিপিং চার্জ, ফ্রি ডেলিভারি অফার, কুরিয়ার পার্টনার এবং অর্ডার প্রিপারেশন সময় নির্ধারণ করুন'
            : 'Configure shipping rates, delivery radius, 3rd party couriers, and dispatch lead times'}
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-[var(--pm-success-soft)] border border-[var(--pm-success)]/30 text-[var(--pm-success)] text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 shrink-0" />
          <span>{isBn ? 'ডেলিভারি সেটিংস সফলভাবে আপডেট হয়েছে!' : 'Fulfillment preferences saved successfully!'}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shipping Rates */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs space-y-4">
          <h4 className="text-xs font-black text-[var(--pm-text)] uppercase tracking-wider flex items-center gap-2">
            <Truck className="w-4 h-4 text-[var(--pm-accent)]" />
            {isBn ? 'স্ট্যান্ডার্ড ডেলিভারি ফি' : 'Standard Shipping Rates'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-[var(--pm-text)] block mb-1">
                {isBn ? 'শহরের ভেতরে (Inside City)' : 'Inside Metro/City (৳)'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-bold text-[var(--pm-muted)]">৳</span>
                <input
                  type="number"
                  value={insideCityCharge}
                  onChange={(e) => setInsideCityCharge(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] text-xs font-bold focus:border-[var(--pm-accent)] focus:outline-hidden"
                />
              </div>
              <p className="text-[10px] text-[var(--pm-muted)] mt-1">{isBn ? '২৪-৪৮ ঘণ্টার মধ্যে ডেলিভারি' : 'Regular 24-48h dispatch'}</p>
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--pm-text)] block mb-1">
                {isBn ? 'শহরের বাইরে (Outside City)' : 'Outside City / Nationwide (৳)'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-bold text-[var(--pm-muted)]">৳</span>
                <input
                  type="number"
                  value={outsideCityCharge}
                  onChange={(e) => setOutsideCityCharge(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] text-xs font-bold focus:border-[var(--pm-accent)] focus:outline-hidden"
                />
              </div>
              <p className="text-[10px] text-[var(--pm-muted)] mt-1">{isBn ? '২-৪ দিনের মধ্যে ডেলিভারি' : 'Nationwide 2-4 days'}</p>
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--pm-text)] block mb-1">
                {isBn ? 'এক্সপ্রেস আর্জেন্ট ডেলিভারি' : 'Express Rapid Delivery (৳)'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-bold text-[var(--pm-muted)]">৳</span>
                <input
                  type="number"
                  value={expressDeliveryCharge}
                  onChange={(e) => setExpressDeliveryCharge(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] text-xs font-bold focus:border-[var(--pm-accent)] focus:outline-hidden"
                />
              </div>
              <p className="text-[10px] text-[var(--pm-muted)] mt-1">{isBn ? '২-৪ ঘণ্টার মধ্যে সেম-ডে' : 'Same-day urgent 2-4 hours'}</p>
            </div>
          </div>

          {/* Free Shipping Tier */}
          <div className="pt-4 border-t border-[var(--pm-border)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[var(--pm-text)]">
                  {isBn ? 'ফ্রি ডেলিভারি অফার সক্রিয় করুন' : 'Free Shipping for Orders Over'}
                </p>
                <p className="text-[11px] text-[var(--pm-muted)]">
                  {isBn ? 'ক্রেতা নির্দিষ্ট টাকার বেশি অর্ডার করলে ডেলিভারি চার্জ সম্পূর্ণ ফ্রি' : 'Encourages higher order value by waiving shipping fee'}
                </p>
              </div>
              <input
                type="checkbox"
                checked={freeShippingEnabled}
                onChange={(e) => setFreeShippingEnabled(e.target.checked)}
                className="w-5 h-5 accent-[var(--pm-accent)] rounded-sm cursor-pointer"
              />
            </div>

            {freeShippingEnabled && (
              <div className="mt-3 flex items-center gap-3">
                <span className="text-xs font-bold text-[var(--pm-text)]">
                  {isBn ? 'অর্ডারের ন্যূনতম মূল্য:' : 'Minimum Cart Threshold:'}
                </span>
                <div className="relative w-36">
                  <span className="absolute left-3 top-2 text-xs font-bold text-[var(--pm-muted)]">৳</span>
                  <input
                    type="number"
                    value={freeShippingThreshold}
                    onChange={(e) => setFreeShippingThreshold(e.target.value)}
                    className="w-full pl-7 pr-3 py-1.5 rounded-xl border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] text-xs font-bold focus:border-[var(--pm-accent)] focus:outline-hidden"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Courier & Logistics Setup */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs space-y-4">
          <h4 className="text-xs font-black text-[var(--pm-text)] uppercase tracking-wider flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-[var(--pm-success)]" />
            {isBn ? 'কুরিয়ার পার্টনার ও পিকআপ সেটিংস' : 'Logistics Partner & Pickup Options'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[var(--pm-text)] block mb-1">
                {isBn ? 'প্রাথমিক কুরিয়ার ইন্টিগ্রেশন' : 'Primary Integrated Courier'}
              </label>
              <select
                value={preferredCourier}
                onChange={(e) => setPreferredCourier(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] text-xs focus:border-[var(--pm-accent)] focus:outline-hidden"
              >
                <option value="steadfast">Steadfast Courier (Auto Consignment API)</option>
                <option value="pathao">Pathao Courier (On-Demand Rider)</option>
                <option value="redx">RedX Logistics</option>
                <option value="paperfly">Paperfly Nationwide</option>
                <option value="ecourier">eCourier Express</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--pm-text)] block mb-1">
                {isBn ? 'অর্ডার প্রিপারেশন সময় (ঘণ্টা)' : 'Order Handling & Packing Lead Time'}
              </label>
              <select
                value={leadTimeHours}
                onChange={(e) => setLeadTimeHours(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] text-xs focus:border-[var(--pm-accent)] focus:outline-hidden"
              >
                <option value="1">1 Hour (Super Fast / Ready stock)</option>
                <option value="4">4 Hours (Same Day Dispatch)</option>
                <option value="12">12 Hours (Next Morning Dispatch)</option>
                <option value="24">24 Hours (Next Day Handling)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] cursor-pointer">
              <input
                type="checkbox"
                checked={enableInHouseFleet}
                onChange={(e) => setEnableInHouseFleet(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[var(--pm-accent)] rounded-sm"
              />
              <div className="text-xs">
                <span className="font-bold text-[var(--pm-text)] block">
                  {isBn ? 'দোকানের নিজস্ব ডেলিভারি রাইডার' : 'Own In-House Delivery Riders'}
                </span>
                <span className="text-[11px] text-[var(--pm-muted)]">
                  {isBn ? 'কাছাকাছি দূরত্বের জন্য নিজস্ব স্টাফ দ্বারা সরাসরি ডেলিভারি' : 'Use own delivery personnel for local neighborhood drops'}
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] cursor-pointer">
              <input
                type="checkbox"
                checked={enableStorePickup}
                onChange={(e) => setEnableStorePickup(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[var(--pm-accent)] rounded-sm"
              />
              <div className="text-xs">
                <span className="font-bold text-[var(--pm-text)] block">
                  {isBn ? 'দোকান থেকে সরাসরি পিকআপ (Click & Collect)' : 'Customer In-Store Pickup'}
                </span>
                <span className="text-[11px] text-[var(--pm-muted)]">
                  {isBn ? 'ক্রেতা সরাসরি আউটলেট থেকে পণ্য সংগ্রহ করতে পারবেন' : 'Allow buyers to collect paid orders directly at outlet'}
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            {isBn ? 'লজিস্টিকস সেটিংস সংরক্ষণ করুন' : 'Save Delivery Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};
