import React from 'react';
import { 
  X, 
  Package, 
  UtensilsCrossed, 
  Wrench, 
  Car, 
  ShoppingBag, 
  Sparkles, 
  Store, 
  Cloud, 
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Users,
  Layers
} from 'lucide-react';
import { PortalTab } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface SuperAppHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: PortalTab) => void;
  onOpenVendorModal: () => void;
  onOpenCloudGuide: () => void;
  isVendor: boolean;
}

export const SuperAppHubModal: React.FC<SuperAppHubModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onOpenVendorModal,
  onOpenCloudGuide,
  isVendor,
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  if (!isOpen) return null;

  const modules = [
    {
      id: 'commerce',
      tab: 'commerce' as PortalTab,
      title: isBn ? 'মার্কেটপ্লেস হাব' : 'Marketplace Hub',
      tagline: isBn
        ? 'রিটেইল, গ্রোসারি, ফার্মেসি, ব্র্যান্ড শপ ও ডিজিটাল পণ্যের সমন্বিত মার্কেট।'
        : 'Mixed feed of retail shopping, grocery, pharmacy, brand shops, and flash deals.',
      icon: ShoppingBag,
      badge: isBn ? 'রিটেইল ও হাব' : 'Hub & B2C',
      accentColor: 'from-blue-600/20 to-indigo-600/10 text-blue-600 dark:text-blue-400',
      actionLabel: isBn ? 'মার্কেটপ্লেস খুলুন' : 'Open Marketplace'
    },
    {
      id: 'wholesale',
      tab: 'wholesale' as PortalTab,
      title: isBn ? 'হোলসেল হাব (B2B)' : 'Wholesale Hub (B2B)',
      tagline: isBn
        ? 'সরাসরি ফ্যাক্টরি রেট, MOQ ভলিউম স্ল্যাব, RFQ দরপত্র ও বাল্ক ফ্রেইট।'
        : 'Direct factory rates, MOQ volume slabs, custom RFQ negotiation, and pallet freight.',
      icon: Package,
      badge: isBn ? 'ফ্যাক্টরি ও MOQ' : 'Factory Direct',
      accentColor: 'from-emerald-600/20 to-teal-600/10 text-emerald-600 dark:text-emerald-400',
      actionLabel: isBn ? 'হোলসেল হাবে যান' : 'Enter Wholesale'
    },
    {
      id: 'services',
      tab: 'services' as PortalTab,
      title: isBn ? 'সার্ভিসেস হাব' : 'Services Hub',
      tagline: isBn
        ? 'লোকাল টেকনিশিয়ান, ফুড ডেলিভারি, হোটেল বুকিং ও হাইপারলোকাল সেবা।'
        : 'Book AC repair, plumbers, electricians, salons, food delivery, and stays near you.',
      icon: Wrench,
      badge: isBn ? 'লোকাল সেবা' : 'Nearest First',
      accentColor: 'from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400',
      actionLabel: isBn ? 'সার্ভিস বুক করুন' : 'Explore Services'
    },
    {
      id: 'rides',
      tab: 'rides' as PortalTab,
      title: isBn ? 'ট্রানজিট ও লজিস্টিকস' : 'Transit & Logistics',
      tagline: isBn
        ? 'ইনস্ট্যান্ট বাইক রাইড, পার্সেল কুরিয়ার ওয়েবিল, কার্গো ট্রাক ও রেন্টাল।'
        : 'Instant Bike riders, Rent-a-car, Truck hire, and Inter-city Couriers.',
      icon: Car,
      badge: isBn ? 'রাইড ও কুরিয়ার' : 'Transit & Cargo',
      accentColor: 'from-sky-500/20 to-blue-500/10 text-sky-600 dark:text-sky-400',
      actionLabel: isBn ? 'লজিস্টিকস খুলুন' : 'Open Transit'
    },
    {
      id: 'creator',
      tab: 'creator' as PortalTab,
      title: isBn ? 'ক্রিয়েটর স্টুডিও' : 'Creator Studio',
      tagline: isBn
        ? 'শর্ট ভিডিও, লাইভ কমার্স, টিউটোরিয়াল ও প্রিমিয়াম ক্রিয়েটর কনটেন্ট।'
        : 'Paid premium video content, tutorials, live commerce, and ad-supported streams.',
      icon: Sparkles,
      badge: isBn ? 'ভিডিও ও স্টুডিও' : 'Video & OTT',
      accentColor: 'from-purple-500/20 to-pink-500/10 text-purple-600 dark:text-purple-400',
      actionLabel: isBn ? 'স্টুডিও দেখুন' : 'Explore Studio'
    },
    {
      id: 'community-hub',
      tab: 'community-hub' as PortalTab,
      title: isBn ? 'কমিউনিটি হাব' : 'Community Hub',
      tagline: isBn
        ? 'সোশ্যাল ফিড, ডিমান্ড বোর্ড (RFQ), ক্রিয়েটর রিলস ও ট্রেড চ্যাট একসাথে।'
        : 'Social feed, buyer RFQ demands, creator reels, and direct trade chats together.',
      icon: Users,
      badge: isBn ? 'সোশ্যাল ও ডিমান্ড' : 'Hub & Social',
      accentColor: 'from-pink-500/20 to-rose-500/10 text-pink-600 dark:text-pink-400',
      actionLabel: isBn ? 'কমিউনিটি খুলুন' : 'Open Community'
    },
    {
      id: 'utility-hub',
      tab: 'utility-hub' as PortalTab,
      title: isBn ? 'ইউটিলিটি হাব' : 'Utility Hub',
      tagline: isBn
        ? 'অর্ডার, এসক্রো ওয়ালেট, সেলার সেন্ট্রাল, প্রোফাইল ও সেটিংস ককপিট।'
        : 'Orders cockpit, BDT escrow wallet, Seller Central, notifications, and settings.',
      icon: Layers,
      badge: isBn ? 'টুলস ও অ্যাকাউন্ট' : 'Cockpit Hub',
      accentColor: 'from-slate-500/20 to-indigo-500/10 text-slate-700 dark:text-slate-300',
      actionLabel: isBn ? 'ইউটিলিটি খুলুন' : 'Open Utility'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-3xl p-5 sm:p-7 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-[var(--pm-border)]">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--pm-accent)] uppercase tracking-wider mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>{isBn ? 'অমনিচ্যানেল সুপার অ্যাপ' : 'Omnichannel Super App'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--pm-text)]">
              {isBn ? 'সুপার অ্যাপ পোর্টালসমূহ' : 'Super App Hub Portals'}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--pm-muted)] mt-1">
              {isBn
                ? 'সোশ্যাল কমার্স, হোলসেল B2B, সার্ভিস হাব ও ট্রানজিট লজিস্টিকসে এক ক্লিকে সুইচ করুন।'
                : 'Switch seamlessly across marketplace, wholesale B2B, services hub, creator studio, and logistics.'}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Super App Hub"
            className="p-2 rounded-full text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-surface)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Commercial Portals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 my-6">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                onClick={() => {
                  onSelectTab(mod.tab);
                  onClose();
                }}
                className="group relative p-5 rounded-3xl border border-[var(--pm-border)] bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] hover:border-[var(--pm-accent)] hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between active:scale-[0.98]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br shadow-sm ${mod.accentColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--pm-muted)] bg-[var(--pm-card)] border border-[var(--pm-border)] px-2 py-0.5 rounded-md">
                      {mod.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-[var(--pm-text)] group-hover:text-[var(--pm-accent)] transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-[var(--pm-muted)] mt-2 leading-relaxed">
                    {mod.tagline}
                  </p>
                </div>

                <div className="pt-5 flex items-center justify-between text-xs font-black uppercase tracking-wider text-[var(--pm-accent)] group-hover:translate-x-1 transition-transform">
                  <span>{mod.actionLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner Actions: Seller Central & Cloud Infrastructure */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 border-t border-[var(--pm-border)]">
          
          {/* Seller Central */}
          <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[var(--pm-success-soft)] text-[var(--pm-success)]">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[var(--pm-text)] flex items-center gap-1.5">
                  <span>{isBn ? 'সেলার সেন্ট্রাল' : 'Seller Central'}</span>
                  {isVendor && <CheckCircle2 className="w-3.5 h-3.5 text-[var(--pm-success)]" />}
                </h4>
                <p className="text-xs text-[var(--pm-muted)]">
                  {isVendor
                    ? isBn ? 'লাইভ ইনভেন্টরি ও অর্ডার পরিচালনা করুন' : 'Manage your live inventory & orders'
                    : isBn ? '৪-ধাপের KYC ভেরিফিকেশন ও স্টোর চালু করুন' : '4-step compliance registration & KYC verification'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                if (isVendor) {
                  onSelectTab('vendor-dash');
                } else {
                  onOpenVendorModal();
                }
              }}
              className="px-3.5 py-1.5 rounded-lg bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-semibold shrink-0 transition-colors cursor-pointer"
            >
              {isVendor ? (isBn ? 'ড্যাশবোর্ড' : 'Open Console') : (isBn ? 'স্টোর খুলুন' : 'Register Store')}
            </button>
          </div>

          {/* Cloud Architecture Guide */}
          <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[var(--pm-accent-soft)] text-[var(--pm-accent)]">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[var(--pm-text)]">
                  Render + Vercel + Supabase
                </h4>
                <p className="text-xs text-[var(--pm-muted)]">
                  Free plan monorepo configuration & SQL schema
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenCloudGuide();
              }}
              className="px-3.5 py-1.5 rounded-lg bg-[var(--pm-card)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-border)] text-[var(--pm-text)] text-xs font-semibold shrink-0 transition-colors cursor-pointer"
            >
              View Config
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
