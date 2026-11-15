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
  CheckCircle2
} from 'lucide-react';
import { PortalTab } from '@/types';

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
  if (!isOpen) return null;

  const modules = [
    {
      id: 'commerce',
      tab: 'commerce' as PortalTab,
      title: 'Retail Marketplace (B2C)',
      tagline: 'Hyperlocal & brand shopping with flash deals, instant cart, and fast home delivery.',
      icon: ShoppingBag,
      badge: 'Retail Direct',
      accentColor: 'from-blue-600/20 to-indigo-600/10 text-blue-600 dark:text-blue-400',
      actionLabel: 'Shop Retail'
    },
    {
      id: 'wholesale',
      tab: 'wholesale' as PortalTab,
      title: 'B2B Wholesale Hub (পাইকারি)',
      tagline: 'Direct factory rates, MOQ volume slabs, custom RFQ negotiation, and pallet freight.',
      icon: Package,
      badge: 'Factory Direct',
      accentColor: 'from-emerald-600/20 to-teal-600/10 text-emerald-600 dark:text-emerald-400',
      actionLabel: 'Enter Wholesale'
    },
    {
      id: 'services',
      tab: 'services' as PortalTab,
      title: 'Nearby Services & Repairs',
      tagline: 'Book AC repair, plumbers, electricians, salons, and hotels in your area.',
      icon: Wrench,
      badge: 'Nearest First',
      accentColor: 'from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400',
      actionLabel: 'Book Service'
    },
    {
      id: 'rides',
      tab: 'rides' as PortalTab,
      title: 'Logistics & Ride Share',
      tagline: 'Instant Bike riders, Rent-a-car, Truck hire, and Inter-city Couriers.',
      icon: Car,
      badge: 'Transit & Cargo',
      accentColor: 'from-sky-500/20 to-blue-500/10 text-sky-600 dark:text-sky-400',
      actionLabel: 'Request Logistics'
    },
    {
      id: 'creator',
      tab: 'creator' as PortalTab,
      title: 'Creator OTT Hub',
      tagline: 'Paid premium video content, tutorials, and ad-supported blog network.',
      icon: Sparkles,
      badge: 'Video & OTT',
      accentColor: 'from-purple-500/20 to-pink-500/10 text-purple-600 dark:text-purple-400',
      actionLabel: 'Explore Content'
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
              <span>Omnichannel Super App</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--pm-text)]">
              One-Stop Commercial Portals
            </h2>
            <p className="text-xs sm:text-sm text-[var(--pm-muted)] mt-1">
              Switch seamlessly across social commerce, wholesale B2B, food delivery, and gig services.
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

        {/* Bottom Banner Actions: Vendor Registration & Cloud Infrastructure */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 border-t border-[var(--pm-border)]">
          
          {/* Vendor Portal */}
          <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[var(--pm-success-soft)] text-[var(--pm-success)]">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[var(--pm-text)] flex items-center gap-1.5">
                  <span>Merchant & Vendor Central</span>
                  {isVendor && <CheckCircle2 className="w-3.5 h-3.5 text-[var(--pm-success)]" />}
                </h4>
                <p className="text-xs text-[var(--pm-muted)]">
                  {isVendor ? 'Manage your live inventory & orders' : '4-step compliance registration & tax verification'}
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
              {isVendor ? 'Dashboard' : 'Register Store'}
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
