import React from 'react';
import { 
  Building2, ShoppingBag, Star, MapPin, Wrench, 
  Monitor, Car, Wallet, Store, HeartPulse, Laptop, 
  ChevronRight, Sparkles, ShieldCheck 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface PortalHub {
  id: string;
  name: string;
  banglaTitle: string;
  desc: string;
  href: string;
  color: string;
  icon: React.ElementType;
  badge?: string;
}

const ALL_PORTALS: PortalHub[] = [
  {
    id: 'wholesale',
    name: 'Wholesale B2B',
    banglaTitle: 'পাইকারি আড়ত বাজার',
    desc: 'কারওয়ান বাজার ও চকবাজারের সরাসরি বাল্ক রেট ও আড়তদার নেটওয়ার্ক',
    href: '/wholesale',
    color: 'from-blue-600 to-indigo-700',
    icon: Building2,
    badge: 'B2B বাল্ক'
  },
  {
    id: 'b2c',
    name: 'Retail Market',
    banglaTitle: 'খুচরা মার্কেটপ্লেস',
    desc: 'সরাসরি ভেরিফাইড বিক্রেতাদের থেকে একক পণ্য কেনাকাটা',
    href: '/b2c',
    color: 'from-orange-500 to-pink-600',
    icon: ShoppingBag,
    badge: 'খুচরা'
  },
  {
    id: 'pk-shop',
    name: 'PK Store',
    banglaTitle: 'পিকে এক্সক্লুসিভ স্টোর',
    desc: 'খাঁটি মধু, ঘানি সরিষার তেল, নকশী কাঁথা ও প্রিমিয়াম ক্যাশব্যাক',
    href: '/pk-shop',
    color: 'from-purple-600 to-indigo-800',
    icon: Star,
    badge: 'কয়েন ক্যাশব্যাক'
  },
  {
    id: 'grocery',
    name: 'Grocery Hub',
    banglaTitle: 'মুদি ও খাদ্যশস্য আড়ত',
    desc: 'চাল, ডাল, সরিষার তেল, আলু ও পেঁয়াজের পাইকারি বস্তা ও লট',
    href: '/portal/grocery',
    color: 'from-emerald-600 to-teal-800',
    icon: Store,
    badge: 'নতুন'
  },
  {
    id: 'pharmacy',
    name: 'Digital Pharmacy',
    banglaTitle: 'ফার্মেসি ও হেলথকেয়ার',
    desc: 'প্রেসক্রিপশন আপলোড ও ১০০% আসল ওষুধ ও ফার্স্ট এইড দ্রুত ডেলিভারি',
    href: '/portal/pharmacy',
    color: 'from-cyan-600 to-blue-700',
    icon: HeartPulse,
    badge: 'নতুন'
  },
  {
    id: 'electronics',
    name: 'Electronics & Tech',
    banglaTitle: 'ইলেকট্রনিক্স ও গ্যাজেটস',
    desc: 'স্মার্টওয়াচ, ইয়ারবাডস, পাওয়ার ব্যাংক এর পাইকারি লট ও ওয়ারেন্টি',
    href: '/portal/electronics',
    color: 'from-violet-600 to-purple-800',
    icon: Laptop,
    badge: 'নতুন'
  },
  {
    id: 'nearby',
    name: 'Nearby Shops',
    banglaTitle: 'এলাকার দোকানদার',
    desc: 'আপনার আশেপাশের লোকাল দোকান থেকে ৩০ মিনিটে দ্রুত ডেলিভারি',
    href: '/portal/nearby',
    color: 'from-rose-500 to-red-600',
    icon: MapPin
  },
  {
    id: 'services',
    name: 'Services Hub',
    banglaTitle: 'সার্ভিসেস ও মেরামত',
    desc: 'এসি মেকানিক, ইলেক্ট্রিশিয়ান, প্লাম্বার ও অন-ডিমান্ড টেকনিশিয়ান',
    href: '/portal/services',
    color: 'from-amber-500 to-orange-600',
    icon: Wrench
  },
  {
    id: 'digital',
    name: 'Digital Solutions',
    banglaTitle: 'ডিজিটাল সার্ভিস ও সফটওয়্যার',
    desc: 'দোকানের ইনভেন্টরি ম্যানেজমেন্ট, POS ও ডিজিটাল হিসাব খাতা',
    href: '/portal/digital',
    color: 'from-indigo-600 to-blue-800',
    icon: Monitor
  },
  {
    id: 'ride',
    name: 'Ride & Parcel',
    banglaTitle: 'রাইড ও পার্সেল লজিস্টিকস',
    desc: 'মালামাল পরিবহনের পিকআপ ভ্যান, কাভার্ড ভ্যান ও বাইক পার্সেল',
    href: '/portal/ride',
    color: 'from-stone-600 to-stone-800',
    icon: Car
  },
  {
    id: 'wallet',
    name: 'PK Wallet',
    banglaTitle: 'পাইকার মার্ট ওয়ালেট',
    desc: 'ব্যালেন্স ট্র্যাকিং, রিচার্জ, এসক্রো ট্রানজেকশন ও পিকে কয়েন রিডিম',
    href: '/wallet',
    color: 'from-teal-600 to-emerald-700',
    icon: Wallet
  },
  {
    id: 'vendors',
    name: 'Vendors Directory',
    banglaTitle: 'ভেরিফাইড বিক্রেতা ডিরেক্টরি',
    desc: 'সমগ্র বাংলাদেশের বিশ্বস্ত আড়তদার ও ডিলারদের সাথে সরাসরি যোগাযোগ',
    href: '/vendors',
    color: 'from-sky-600 to-blue-800',
    icon: ShieldCheck
  }
];

export const HubPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 pb-28 w-full mx-auto px-4 max-w-5xl mt-4">
      {/* Header Banner */}
      <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--pm-accent)]/10 text-[var(--pm-accent)] text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            সুপার অ্যাপ পোর্টাল হাব (Super App Hub)
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--pm-text)] tracking-tight">
            পাইকার মার্টের সকল পোর্টাল ও সেবা
          </h1>
          <p className="text-xs sm:text-sm text-[var(--pm-text-muted)] mt-2 leading-relaxed">
            পাইকারি আড়ত, খুচরা কেনাকাটা, মুদি ও নিত্যপ্রয়োজনীয় পণ্য, ফার্মেসি, ইলেকট্রনিক্স এবং লজিস্টিকস সার্ভিস — সবকিছু এক ছাতার নিচে।
          </p>
        </div>
      </div>

      {/* Grid of Portals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALL_PORTALS.map((portal) => (
          <motion.div
            key={portal.id}
            whileHover={{ y: -3 }}
            onClick={() => navigate(portal.href)}
            className="bg-[var(--pm-surface)] border border-[var(--pm-border)] hover:border-[var(--pm-accent)]/40 rounded-3xl p-5 cursor-pointer shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${portal.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                  <portal.icon className="w-6 h-6" />
                </div>
                {portal.badge && (
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-[var(--pm-accent)]/10 text-[var(--pm-accent)] border border-[var(--pm-accent)]/20">
                    {portal.badge}
                  </span>
                )}
              </div>

              <h3 className="font-black text-base text-[var(--pm-text)] group-hover:text-[var(--pm-accent)] transition-colors">
                {portal.banglaTitle}
              </h3>
              <p className="text-[11px] font-semibold text-[var(--pm-accent)] mt-0.5">
                {portal.name}
              </p>
              <p className="text-xs text-[var(--pm-text-muted)] mt-2 leading-relaxed line-clamp-2">
                {portal.desc}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-[var(--pm-border)]/50 flex items-center justify-between text-xs font-bold text-[var(--pm-accent)]">
              <span>পোর্টালে প্রবেশ করুন</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HubPage;
