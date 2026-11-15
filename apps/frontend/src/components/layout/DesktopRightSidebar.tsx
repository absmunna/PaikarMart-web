import React from 'react';
import { 
  ShoppingBag, 
  ExternalLink, 
  Store, 
  Star, 
  Bike, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Order, CommerceItem, SocialPost } from '@/types';
import { AdMobBanner } from '@/components/shared/AdMobBanner';
import { TrendingTopicsWidget } from '@/components/shared/TrendingTopicsWidget';

interface DesktopRightSidebarProps {
  activeOrders: Order[];
  onOpenCart: () => void;
  featuredProducts: CommerceItem[];
  onAddToCart: (item: CommerceItem) => void;
  onOpenStorePortal: (type: any) => void;
  posts?: SocialPost[];
  onSelectTopic?: (topic: string) => void;
}

export const DesktopRightSidebar: React.FC<DesktopRightSidebarProps> = ({
  activeOrders,
  onOpenCart,
  featuredProducts,
  onAddToCart,
  onOpenStorePortal,
  posts,
  onSelectTopic,
}) => {
  return (
    <aside className="hidden xl:block w-72 2xl:w-80 shrink-0 sticky top-18 h-[calc(100vh-5rem)] overflow-y-auto space-y-4 pl-3 no-scrollbar">
      
      {/* AI Trending Topics Community Pulse Widget */}
      <TrendingTopicsWidget posts={posts} onSelectTopic={onSelectTopic} />

      {/* Google AdMob Sponsored Card */}
      <div className="space-y-1">
        <span className="text-[11px] font-bold text-[var(--pm-muted)] uppercase tracking-wider block px-1">
          Sponsored Spotlight
        </span>
        <AdMobBanner variant="supabase" />
      </div>

      {/* Live Order Tracker if any active orders exist */}
      {activeOrders.length > 0 && (
        <div className="p-4 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--pm-text)] flex items-center gap-1.5">
              <Bike className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
              <span>Active Order Status</span>
            </span>
            <span className="text-[10px] font-mono text-[var(--pm-success)] font-bold">
              {activeOrders[0].id}
            </span>
          </div>

          <p className="text-xs text-[var(--pm-muted)]">
            {activeOrders[0].items.length} item(s) being prepared. Delivery address: {activeOrders[0].deliveryAddress}
          </p>

          <button
            type="button"
            onClick={onOpenCart}
            className="w-full py-2 rounded-xl bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-border)] text-xs font-semibold text-[var(--pm-text)] flex items-center justify-center gap-1 cursor-pointer transition-colors"
          >
            <span>View Details & Receipt</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Verified Commercial Vendors */}
      <div className="p-4 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[var(--pm-text)] flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
            <span>Featured Sellers</span>
          </span>
          <span className="text-[10px] font-bold text-[var(--pm-success)]">Verified</span>
        </div>

        <div className="space-y-2.5">
          {[
            { name: 'Apex Electronics Dist.', cat: 'Wholesale B2B', rating: 4.9, sales: '1.2k orders' },
            { name: 'The Urban Artisanal Grill', cat: 'Gourmet Kitchen', rating: 4.8, sales: '3.4k orders' },
            { name: 'FixPro Diagnostics', cat: 'Certified Pro', rating: 4.95, sales: '890 visits' },
          ].map((v) => (
            <div key={v.name} className="flex items-center justify-between text-xs pt-1.5 border-t border-[var(--pm-border)]">
              <div>
                <h5 className="font-bold text-[var(--pm-text)] leading-tight">{v.name}</h5>
                <span className="text-[10px] text-[var(--pm-muted)]">{v.cat} · {v.sales}</span>
              </div>
              <div className="flex items-center gap-0.5 text-amber-500 font-mono font-bold text-[11px]">
                <Star className="w-3 h-3 fill-amber-500" />
                <span>{v.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Products Quick-Add */}
      <div className="p-4 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs space-y-3">
        <span className="text-xs font-bold text-[var(--pm-text)] flex items-center gap-1.5">
          <ShoppingBag className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
          <span>Quick Commerce Picks</span>
        </span>

        <div className="space-y-3">
          {featuredProducts.slice(0, 2).map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <img
                src={item.imageUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-xl object-cover shrink-0 bg-[var(--pm-surface)] border border-[var(--pm-border)]"
              />
              <div className="flex-1 min-w-0">
                <h5 className="text-xs font-bold text-[var(--pm-text)] truncate">{item.title}</h5>
                <p className="font-mono text-xs font-bold text-[var(--pm-accent)]">৳{item.price.toFixed(2)}</p>
                <button
                  type="button"
                  onClick={() => onAddToCart(item)}
                  className="text-[10px] font-bold text-[var(--pm-accent)] hover:underline mt-0.5 cursor-pointer"
                >
                  + Add to Bag
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </aside>
  );
};
