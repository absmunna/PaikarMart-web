import React from 'react';
import {
  X,
  Package,
  Wrench,
  Car,
  ShoppingBag,
  Sparkles,
  Store,
  ArrowRight,
  Zap,
  Users,
  Layers,
  Heart,
  MapPin,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface SuperAppHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  isVendor?: boolean;
}

const MODULES = [
  {
    id: 'commerce',
    path: '/market',
    title: 'মার্কেটপ্লেস হাব',
    titleEn: 'Marketplace Hub',
    tagline: 'রিটেইল, গ্রোসারি, ফার্মেসি, ব্র্যান্ড শপ ও ডিজিটাল পণ্য।',
    icon: ShoppingBag,
    badge: 'Hub & B2C',
    accent: 'from-blue-600/20 to-indigo-600/10 text-blue-600 dark:text-blue-400',
  },
  {
    id: 'wholesale',
    path: '/marketplace',
    title: 'হোলসেল হাব (B2B)',
    titleEn: 'Wholesale Hub (B2B)',
    tagline: 'ফ্যাক্টরি রেট, MOQ, RFQ ও বাল্ক ফ্রেইট।',
    icon: Package,
    badge: 'Factory Direct',
    accent: 'from-emerald-600/20 to-teal-600/10 text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'services',
    path: '/services',
    title: 'সার্ভিসেস হাব',
    titleEn: 'Services Hub',
    tagline: 'লোকাল টেকনিশিয়ান, ফুড, হোটেল ও হাইপারলোকাল সেবা।',
    icon: Wrench,
    badge: 'Nearest First',
    accent: 'from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'rides',
    path: '/logistics',
    title: 'ট্রানজিট ও লজিস্টিকস',
    titleEn: 'Transit & Logistics',
    tagline: 'বাইক রাইড, পার্সেল কুরিয়ার, কার্গো ট্রাক ও রেন্টাল।',
    icon: Car,
    badge: 'Transit & Cargo',
    accent: 'from-sky-500/20 to-blue-500/10 text-sky-600 dark:text-sky-400',
  },
  {
    id: 'local',
    path: '/local',
    title: 'নিয়ারবাই শপ',
    titleEn: 'Nearby Shops',
    tagline: 'কাছের দোকান, লোকাল ডিল ও ম্যাপ ভিউ।',
    icon: MapPin,
    badge: 'Nearby',
    accent: 'from-pink-500/20 to-rose-500/10 text-pink-600 dark:text-pink-400',
  },
  {
    id: 'video',
    path: '/video',
    title: 'ক্রিয়েটর / ভিডিও',
    titleEn: 'Creator Studio',
    tagline: 'শর্ট ভিডিও, রিলস ও ক্রিয়েটর কনটেন্ট।',
    icon: Sparkles,
    badge: 'Video & OTT',
    accent: 'from-purple-500/20 to-pink-500/10 text-purple-600 dark:text-purple-400',
  },
  {
    id: 'community',
    path: '/',
    title: 'কমিউনিটি / ফিড',
    titleEn: 'Community Hub',
    tagline: 'সোশ্যাল ফিড, ডিমান্ড বোর্ড ও ট্রেড চ্যাট।',
    icon: Users,
    badge: 'Social',
    accent: 'from-pink-500/20 to-rose-500/10 text-pink-600 dark:text-pink-400',
  },
  {
    id: 'orders',
    path: '/orders',
    title: 'অর্ডার ও ওয়ালেট',
    titleEn: 'Orders & Wallet',
    tagline: 'অর্ডার ট্র্যাকিং, PK Wallet ও সেটিংস।',
    icon: Layers,
    badge: 'Utility',
    accent: 'from-slate-500/20 to-indigo-500/10 text-slate-700 dark:text-slate-300',
  },
  {
    id: 'wishlist',
    path: '/wishlist',
    title: 'উইশলিস্ট',
    titleEn: 'Wishlist',
    tagline: 'পছন্দের পণ্য সংরক্ষণ ও পরে কেনাকাটা।',
    icon: Heart,
    badge: 'Saved',
    accent: 'from-rose-500/20 to-pink-500/10 text-rose-600 dark:text-rose-400',
  },
] as const;

/**
 * Version-2 Super App Hub modal — portal switcher grid.
 */
export function SuperAppHubModal({ isOpen, onClose, isVendor = false }: SuperAppHubModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const go = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-card text-card-foreground border border-border rounded-3xl p-5 sm:p-7 shadow-2xl">
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-border">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Omnichannel Super App</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">সুপার অ্যাপ পোর্টালসমূহ</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              মার্কেটপ্লেস, হোলসেল B2B, সার্ভিস, লজিস্টিকস ও ক্রিয়েটর — এক ক্লিকে সুইচ।
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Super App Hub"
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 my-6">
          {MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => go(mod.path)}
                className="group relative p-5 rounded-3xl border border-border bg-muted/40 hover:bg-muted hover:border-primary hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between active:scale-[0.98]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn('p-3 rounded-2xl bg-gradient-to-br shadow-sm', mod.accent)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-background border border-border px-2 py-0.5 rounded-md">
                      {mod.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-black group-hover:text-primary transition-colors">{mod.title}</h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{mod.tagline}</p>
                </div>
                <div className="pt-5 flex items-center justify-between text-xs font-black uppercase tracking-wider text-primary group-hover:translate-x-1 transition-transform">
                  <span>খুলুন</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-border">
          <div className="p-4 rounded-2xl bg-muted/40 border border-border flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-600">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold">সেলার সেন্ট্রাল</h4>
                <p className="text-xs text-muted-foreground">
                  {isVendor ? 'লাইভ ইনভেন্টরি ও অর্ডার পরিচালনা' : 'স্টোর রেজিস্ট্রেশন ও KYC'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => go(isVendor ? '/seller' : '/seller')}
              className="px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shrink-0"
            >
              {isVendor ? 'ড্যাশবোর্ড' : 'স্টোর খুলুন'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuperAppHubModal;
