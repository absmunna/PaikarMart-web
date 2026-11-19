import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutGrid, AlertCircle, Image, Store, Package, Wrench, 
  FileText, Gavel, PlaySquare, Info 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type ProfileTabKey = 
  | 'posts' 
  | 'products'
  | 'services'
  | 'demands'
  | 'bids'
  | 'content'
  | 'about' 
  | 'photos';

interface TabDef {
  key: ProfileTabKey;
  labelEn: string;
  labelBn: string;
  icon: React.ElementType;
}

interface ProfileTabsProps {
  activeTab: ProfileTabKey;
  onTabChange: (tab: ProfileTabKey) => void;
  activeRole?: string; // e.g. 'seller', 'buyer', 'rider' etc
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({
  activeTab,
  onTabChange,
  activeRole = 'user'
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Seller roles checks
  const wholesaleRoles = ['wholesale_seller', 'factory_seller', 'b2b_seller', 'exporter', 'importer', 'brand_seller', 'factory', 'wholesale'];
  const retailRoles = ['retail_seller', 'grocery_seller', 'food_seller', 'rural_seller', 'nearby_shop', 'seller'];
  const isSeller = [...wholesaleRoles, ...retailRoles, 'service_provider'].includes(activeRole);

  // Generate dynamic tabs list based on context
  const tabs = React.useMemo<TabDef[]>(() => {
    if (isSeller) {
      return [
        { key: 'products', labelEn: 'Products', labelBn: 'পণ্য', icon: Package },
        { key: 'services', labelEn: 'Services', labelBn: 'সেবা কার্যক্রম', icon: Wrench },
        { key: 'demands', labelEn: 'Demands', labelBn: 'চাহিদা সমূহ', icon: FileText },
        { key: 'bids', labelEn: 'Bids & Offers', labelBn: 'জমা দেওয়া প্রস্তাব', icon: Gavel },
        { key: 'content', labelEn: 'Media & Reels', labelBn: 'ভিডিও ও কন্টেন্ট', icon: PlaySquare },
        { key: 'about', labelEn: 'Shop Details', labelBn: 'শপ সম্পর্কে', icon: Store }
      ];
    }

    // Default Buyer tabs list
    return [
      { key: 'posts', labelEn: 'All Posts', labelBn: 'ফিড পোস্ট', icon: LayoutGrid },
      { key: 'demands', labelEn: 'My Demands', labelBn: 'আমার চাহিদা', icon: FileText },
      { key: 'bids', labelEn: 'My Offers', labelBn: 'আমার প্রস্তাব', icon: Gavel },
      { key: 'photos', labelEn: 'Photos', labelBn: 'ছবিসমূহ', icon: Image },
      { key: 'about', labelEn: 'Personal Info', labelBn: 'ব্যক্তিগত তথ্য', icon: Info }
    ];
  }, [isSeller]);

  // Handle active tab auto-correct if current tab is not in the generated list
  useEffect(() => {
    const tabKeys = tabs.map(t => t.key);
    if (!tabKeys.includes(activeTab)) {
      onTabChange(tabs[0].key);
    }
  }, [tabs, activeTab, onTabChange]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const active = el.querySelector('[data-active="true"]') as HTMLElement | null;
    if (active) {
      active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeTab]);

  return (
    <div className="sticky top-16 z-40 bg-[#010804]/85 backdrop-blur-3xl border-b border-white/5 select-none w-full">
      <div
        ref={scrollRef}
        className="flex items-center gap-2 px-4 md:px-8 overflow-x-auto scrollbar-hide w-full max-w-5xl mx-auto no-scrollbar scroll-smooth"
      >
        {tabs.map(tab => (
          <button
            key={tab.key}
            data-active={activeTab === tab.key}
            onClick={() => onTabChange(tab.key)}
            className={cn(
               'relative px-5 py-4 text-[13px] font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer flex items-center gap-2',
               activeTab === tab.key
                 ? 'text-cyan-400'
                 : 'text-zinc-400 hover:text-white',
             )}
          >
             <tab.icon className={cn("w-4 h-4", activeTab === tab.key ? "text-cyan-400" : "text-zinc-500")} />
             <div className="flex flex-col items-start leading-none">
               <span className="text-[12px]">{tab.labelEn}</span>
               <span className="text-[10px] opacity-70 font-medium">{tab.labelBn}</span>
             </div>
            {activeTab === tab.key && (
              <motion.div
                layoutId="profile-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-[3px] bg-cyan-400 rounded-t-full shadow-[0_-2px_10px_rgba(0,230,118,0.4)]"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
export default ProfileTabs;
