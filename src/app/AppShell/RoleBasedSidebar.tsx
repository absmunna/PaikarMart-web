import React, { useState } from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getRoleGroup, ROLE_GROUP_META } from '@/config/roles.config';
import { useAuth } from '@/features/auth/AuthContext';
import { useSeller } from '@/modules/seller';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, User, ShoppingBag, Heart, Star, Wallet, MessageSquare, Bell, 
  Store, ShieldCheck, Users, CreditCard, Grid, Calendar, Truck, 
  Lock, Languages, Palette, Settings, HelpCircle, HeartHandshake,
  ChevronDown, ChevronUp, LogOut, PanelLeftClose, PanelLeft, ArrowLeft,
  Search, Award, Sparkles, Package
} from 'lucide-react';

interface SidebarProps {
  userRole: string;
  className?: string;
  onClose?: () => void;
  isOpen?: boolean;
  isCollapsed?: boolean;
}

const SECTIONS = [
  {
    id: 'account',
    titleEn: 'Account',
    titleBn: 'অ্যাকাউন্ট',
    roles: ['user', 'buyer', 'seller', 'business', 'admin', 'service_provider', 'guest'],
    items: [
      { id: 'overview', labelEn: 'Overview', labelBn: 'ওভারভিউ', icon: User, descEn: 'Control cockpit summary', descBn: 'ককপিট ওভারভিউ' },
      { id: 'orders', labelEn: 'My Orders', labelBn: 'আমার অর্ডার', icon: ShoppingBag, descEn: 'Track order status', descBn: 'অর্ডার ট্র্যাকিং' },
      { id: 'wishlist', labelEn: 'Wishlist', labelBn: 'পছন্দ তালিকা', icon: Heart, descEn: 'Saved items & stores', descBn: 'সংরক্ষিত সামগ্রী' },
      { id: 'reviews', labelEn: 'Reviews', labelBn: 'আমার রিভিউ', icon: Star, descEn: 'Given & pending stars', descBn: 'রেটিং ও মন্তব্য' },
      { id: 'following', labelEn: 'Following', labelBn: 'ফলো শপসমূহ', icon: Store, descEn: 'Stores & brands', descBn: 'অনুসৃত বিক্রেতা' },
    ]
  },
  {
    id: 'commerce',
    titleEn: 'Commerce',
    titleBn: 'লেনদেন',
    roles: ['user', 'buyer', 'seller', 'business', 'admin', 'service_provider', 'guest'],
    items: [
      { id: 'wallet', labelEn: 'Wallet Hub', labelBn: 'আমার ওয়ালেট', icon: Wallet, descEn: 'Balance & loyalty rewards', descBn: 'ব্যালেন্স ও কয়েন' },
      { id: 'messages', labelEn: 'Messages', labelBn: 'মেসেজ ও চ্যাট', icon: MessageSquare, descEn: 'Inbox & AI assistant', descBn: 'মেসেঞ্জার ও এআই', path: '/messages' },
      { id: 'notifications', labelEn: 'Notifications', labelBn: 'নোটিফিকেশনস', icon: Bell, descEn: 'Promos & updates', descBn: 'আপডেট ও নোটিশ', path: '/notifications' },
    ]
  },
  {
    id: 'business',
    titleEn: 'Business',
    titleBn: 'ব্যবসা ও উদ্যোগ',
    roles: ['seller', 'business', 'admin', 'service_provider'],
    items: [
      { id: 'seller-central', labelEn: 'Dashboard Overview', labelBn: 'ড্যাশবোর্ড', icon: Store, descEn: 'Business manager', descBn: 'বিক্রেতা ড্যাশবোর্ড', path: '/seller' },
      { id: 'seller-products', labelEn: 'Products', labelBn: 'প্রোডাক্টস', icon: ShoppingBag, descEn: 'Manage inventory', descBn: 'প্রোডাক্ট ও ইনভেন্টরি', path: '/seller/products' },
      { id: 'seller-orders', labelEn: 'Orders', labelBn: 'অর্ডার', icon: Package, descEn: 'Fulfillment', descBn: 'অর্ডার ট্র্যাকিং', path: '/seller/orders' },
      { id: 'my-stores', labelEn: 'My Stores', labelBn: 'আমার শপসমূহ', icon: ShoppingBag, descEn: 'Manage multiple stores', descBn: 'মাল্টি-স্টোর কন্ট্রোল' },
      { id: 'business-verification', labelEn: 'Business Verify', labelBn: 'বিজনেস ভেরিফাই', icon: ShieldCheck, descEn: 'Trade license & documents', descBn: 'ট্রেড লাইসেন্স ও ডকুমেন্টস' },
      { id: 'team-management', labelEn: 'Team Manager', labelBn: 'টিম ম্যানেজমেন্ট', icon: Users, descEn: 'Manage staff roles', descBn: 'স্টাফ ও পারমিশন' },
      { id: 'business-subscription', labelEn: 'Subscription', labelBn: 'সাবস্ক্রিপশন', icon: CreditCard, descEn: 'Billing & packages', descBn: 'প্যাকেজ ও বিলিং' },
    ]
  },
  {
    id: 'admin',
    titleEn: 'Admin Panel',
    titleBn: 'অ্যাডমিন প্যানেল',
    roles: ['admin'],
    items: [
      { id: 'user-management', labelEn: 'User Management', labelBn: 'ইউজার ম্যানেজমেন্ট', icon: Users, descEn: 'Control all accounts', descBn: 'সব ইউজার কন্ট্রোল', path: '/admin/users' },
      { id: 'portal-config', labelEn: 'Portal Config', labelBn: 'পোর্টাল সেটিংস', icon: Grid, descEn: 'Manage global portals', descBn: 'পোর্টাল ম্যানেজমেন্ট', path: '/admin/portals' },
      { id: 'system-logs', labelEn: 'System Logs', labelBn: 'সিস্টেম লগ', icon: ShieldCheck, descEn: 'Audit & error monitoring', descBn: 'সিস্টেম মনিটরিং', path: '/admin/logs' },
    ]
  },
  {
    id: 'apps-services',
    titleEn: 'Apps & Services',
    titleBn: 'পোর্টাল সমূহ',
    roles: ['user', 'buyer', 'seller', 'business', 'admin', 'service_provider', 'guest'],
    items: [
      { id: 'all-portals', labelEn: 'All Portals', labelBn: 'সব পোর্টাল', icon: Grid, descEn: 'Access super portals', descBn: 'সব সুপার সার্ভিস', path: '/portals' },
      { id: 'my-services', labelEn: 'My Services', labelBn: 'আমার সেবা', icon: Calendar, descEn: 'Bookings & requests', descBn: 'সার্ভিস ও বুকিং' },
      { id: 'logistics', labelEn: 'Logistics', labelBn: 'লজিস্টিকস ট্র্যাকিং', icon: Truck, descEn: 'Deliveries & shipping', descBn: 'কুরিয়ার ও ডেলিভারি', path: '/logistics' },
    ]
  },
  {
    id: 'system',
    titleEn: 'System',
    titleBn: 'সিস্টেম সেটিংস',
    roles: ['user', 'buyer', 'seller', 'business', 'admin', 'service_provider', 'guest'],
    items: [
      { id: 'verification', labelEn: 'Identity KYC', labelBn: 'ভেরিফিকেশন', icon: ShieldCheck, descEn: 'NID & identity verify', descBn: 'এনআইডি ও পরিচয় পত্র' },
      { id: 'security', labelEn: 'Security', labelBn: 'নিরাপত্তা সেটিংস', icon: Lock, descEn: 'Password & safety', descBn: 'পাসওয়ার্ড ও সুরক্ষা' },
      { id: 'language', labelEn: 'Language', labelBn: 'ভাষা নির্বাচন', icon: Languages, descEn: 'Bengali / English toggle', descBn: 'ভাষা পরিবর্তন' },
      { id: 'appearance', labelEn: 'Appearance', labelBn: 'রঙ ও ডিজাইন', icon: Palette, descEn: 'Personal theme config', descBn: 'থিম ও লেআউট' },
      { id: 'settings', labelEn: 'Device Settings', labelBn: 'ডিভাইস সেটিংস', icon: Settings, descEn: 'Privacy & access rules', descBn: 'গোপনীয়তা ও অনুমতি', path: '/settings' },
      { id: 'help-center', labelEn: 'Help Center', labelBn: 'সাহায্য কেন্দ্র', icon: HelpCircle, descEn: 'Guidelines & FAQs', descBn: 'জিজ্ঞাসা ও টিউটোরিয়াল', path: '/faq' },
      { id: 'support', labelEn: 'Support Desk', labelBn: 'সাপোর্ট টিকিট', icon: HeartHandshake, descEn: 'Raise service tickets', descBn: 'সহায়তা ডেস্ক ও চ্যাট' },
    ]
  }
];

export const RoleBasedSidebar: React.FC<SidebarProps> = ({ userRole, className, onClose, isOpen, isCollapsed = false }) => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const { isSeller, profile } = useSeller();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const activeTab = pathname === '/profile' ? (searchParams.get('tab') || 'overview') : '';

  // Accordion open/close states (Account & Commerce expand by default, others collapsed)
  const [accordionStates, setAccordionStates] = useState<Record<string, boolean>>({
    account: true,
    commerce: true,
    business: false,
    'apps-services': false,
    system: false,
    admin: false,
  });

  // Auto-expand relevant sections when role changes or on search
  React.useEffect(() => {
    if (isSeller || userRole === 'admin' || userRole === 'business' || userRole === 'service_provider') {
      setAccordionStates(prev => ({ ...prev, business: true }));
    }
    if (userRole === 'admin') {
      setAccordionStates(prev => ({ ...prev, admin: true }));
    }
  }, [userRole, isSeller]);

  const toggleAccordion = (sectionId: string) => {
    setAccordionStates(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleItemClick = (item: any) => {
    if (item.id === 'seller-central') {
      if (isSeller) {
        navigate('/seller');
      } else {
        navigate('/become-seller');
      }
    } else if (item.path) {
      navigate(item.path);
    } else {
      navigate(`/profile?tab=${item.id}`);
    }
    onClose?.(); // Close mobile drawer if open
  };

  const triggerCollapseToggle = () => {
    window.dispatchEvent(new CustomEvent('TOGGLE_SIDEBAR_COLLAPSE'));
  };

  // Filter sections and items dynamically based on role and search
  const isSearching = searchQuery.trim().length > 0;
  const filteredSections = SECTIONS
    .filter(section => !section.roles || section.roles.includes(userRole))
    .map(section => {
      const matchingItems = (section.items as any[]).filter(item => {
        // Apply role filter on items if they have roles
        if (item.roles && !item.roles.includes(userRole)) return false;
        
        const query = searchQuery.toLowerCase();
        return (
          item.labelEn.toLowerCase().includes(query) ||
          item.labelBn.toLowerCase().includes(query) ||
          (item.descEn && item.descEn.toLowerCase().includes(query)) ||
          (item.descBn && item.descBn.toLowerCase().includes(query))
        );
      });
      return { ...section, items: matchingItems };
    }).filter(section => section.items.length > 0);

  return (
    <div className={cn(
      "fixed left-0 top-[64px] h-[calc(100dvh-64px)] bg-[#030906]/98 backdrop-blur-xl border-r border-cyan-500/10 transition-all duration-300 z-[450] flex flex-col shadow-2xl lg:shadow-none",
      isCollapsed ? "w-[80px]" : "w-[280px]",
      isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      className
    )}>
      {/* User Identity Pill Section - Compact & styled */}
      <div className={cn(
        "p-4 border-b border-cyan-500/10 bg-[#040d07]/40 flex flex-col shrink-0 transition-all",
        isCollapsed ? "justify-center px-2" : "px-4"
      )}>
        <div className="flex items-center gap-3.5 w-full">
          <button 
            onClick={() => { navigate('/profile'); onClose?.(); }}
            className="flex items-center gap-3 w-full text-left cursor-pointer group active:scale-98"
          >
            <div className="relative shrink-0">
              <Avatar className="h-10 w-10 border border-cyan-500/30 shadow-md transition-transform group-hover:scale-105">
                <AvatarImage src={isSeller ? profile.avatarUrl : user?.avatarUrl} className="object-cover" />
                <AvatarFallback className="bg-[#051a0e] text-cyan-400 font-black text-xs">
                  {(isSeller ? profile.shopName : user?.name)?.[0] ?? "U"}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-cyan-500 border-2 border-[#030906] rounded-full shadow-lg" />
            </div>

            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-black text-white truncate leading-none group-hover:text-cyan-400 transition-colors">
                    {isSeller ? profile.shopName : (user?.name || user?.fullName || "Guest User")}
                  </p>
                  <ShieldCheck className={cn("w-3.5 h-3.5 shrink-0", isSeller ? "text-cyan-400" : "text-zinc-500")} />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    "text-[8px] border px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider leading-none",
                    ROLE_GROUP_META[getRoleGroup(userRole)].bgColor,
                    ROLE_GROUP_META[getRoleGroup(userRole)].borderColor,
                    ROLE_GROUP_META[getRoleGroup(userRole)].color
                  )}>
                    {ROLE_GROUP_META[getRoleGroup(userRole)].badge}
                  </span>
                  <span className="text-[8px] text-zinc-500 font-extrabold leading-none flex items-center gap-1">
                    <Award className="w-2.5 h-2.5 text-yellow-500/80" /> LVL 3
                  </span>
                </div>
              </div>
            )}
          </button>

          {!isCollapsed && (
            <button 
              onClick={() => onClose?.()}
              className="lg:hidden p-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-zinc-500 hover:text-white active:scale-90 transition-all cursor-pointer"
              title="Close Menu"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Profile/KYC trust progress bar */}
        {!isCollapsed && (
          <div className="mt-4 px-1 w-full">
            <div className="flex items-center justify-between text-[8px] font-black text-zinc-500 uppercase tracking-wider mb-1">
              <span className="flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
                Trust Score / ট্রাস্ট স্কোর
              </span>
              <span className="text-cyan-400">85%</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "85%" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_8px_rgba(0,230,118,0.5)]"
              />
            </div>
          </div>
        )}
      </div>

      {/* ━━━ MENUS SEARCH BAR ━━━ */}
      {!isCollapsed && (
        <div className="px-3.5 py-2.5 border-b border-cyan-500/5 shrink-0 bg-[#040c07]/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <input 
              type="text"
              placeholder="Search features... / খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#050e09] border border-white/[0.04] focus:border-cyan-500/20 focus:bg-black/40 rounded-xl pl-9 pr-8 py-2 text-[10px] font-black text-white placeholder-zinc-600 focus:outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white p-0.5 rounded-full transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Navigation list area */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3 py-3 space-y-3">
        {filteredSections.map((section) => {
          const isSectionOpen = isSearching ? true : accordionStates[section.id];
          
          return (
            <div key={section.id} className="space-y-1">
              {/* Accordion Trigger (Expanded View only, Collapsed view has a subtitle divider) */}
              {isCollapsed ? (
                <div className="w-full h-px bg-cyan-500/10 my-4" />
              ) : (
                <button
                  onClick={() => toggleAccordion(section.id)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-zinc-500 hover:text-cyan-400 transition-all text-left group hover:bg-cyan-500/[0.02]"
                >
                  <div className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2 text-zinc-500 group-hover:text-cyan-400 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/40 group-hover:bg-cyan-400 transition-all" />
                    <span>{section.titleEn}</span>
                    <span className="text-zinc-600 font-bold">/ {section.titleBn}</span>
                  </div>
                  {isSectionOpen ? (
                    <ChevronUp className="w-3.5 h-3.5 text-zinc-600 group-hover:text-cyan-400 transition-colors" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-600 group-hover:text-cyan-400 transition-colors" />
                  )}
                </button>
              )}

              {/* Items List */}
              <motion.div 
                initial={false}
                animate={{ 
                  height: isCollapsed ? "auto" : (isSectionOpen ? "auto" : 0), 
                  opacity: isCollapsed ? 1 : (isSectionOpen ? 1 : 0) 
                }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="space-y-0.5 overflow-hidden"
              >
                {section.items.map((item) => {
                  const isActive = activeTab === item.id || (!activeTab && pathname === item.path);
                  const IconComponent = item.icon;

                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ x: isCollapsed ? 0 : 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleItemClick(item)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 border text-left group relative cursor-pointer",
                        isActive
                          ? "bg-gradient-to-r from-cyan-500/15 to-cyan-500/5 text-cyan-400 border-cyan-500/30 shadow-md shadow-cyan-950/20"
                          : "text-zinc-400 hover:text-white bg-transparent border-transparent hover:bg-white/[0.015]"
                      )}
                    >
                      <IconComponent className={cn(
                        "w-4 h-4 shrink-0 transition-transform group-hover:scale-105",
                        isActive ? "text-cyan-400" : "text-zinc-500 group-hover:text-zinc-300"
                      )} />

                      {!isCollapsed ? (
                        <div className="min-w-0">
                          <span className="block text-[10px] font-extrabold uppercase leading-none tracking-tight">
                            {item.labelEn}
                          </span>
                          <span className="block text-[8px] opacity-70 font-bold mt-1 leading-none tracking-normal">
                            {item.labelBn}
                          </span>
                        </div>
                      ) : (
                        /* Beautiful tooltip for collapsed desktop mode */
                        <div className="group-hover:opacity-100 group-hover:translate-x-0 opacity-0 -translate-x-2 pointer-events-none absolute left-14 bg-[#051108]/95 backdrop-blur-md text-white border border-cyan-500/20 text-[10px] px-3.5 py-2.5 rounded-xl font-bold whitespace-nowrap z-50 transition-all shadow-2xl shadow-black/80 flex flex-col gap-0.5 text-left leading-normal">
                          <span className="text-cyan-400 font-extrabold uppercase">{item.labelEn}</span>
                          <span className="text-zinc-400 text-[9px]">{item.labelBn}</span>
                          <p className="text-[8px] text-zinc-500 font-semibold mt-1 leading-none">{item.descEn}</p>
                        </div>
                      )}
                      
                      {!isCollapsed && isActive && (
                        <span className="absolute right-3.5 flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400"></span>
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>
          );
        })}
        {isSearching && filteredSections.length === 0 && (
          <div className="text-center py-8 px-4">
            <HelpCircle className="w-8 h-8 text-zinc-700 mx-auto mb-2 animate-bounce" />
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">No matching results</p>
            <p className="text-[8px] text-zinc-600 font-bold mt-1">কোনো তথ্য খুঁজে পাওয়া যায়নি</p>
          </div>
        )}
      </div>

      {/* Logout & Panel Toggle Footing Panel */}
      <div className="p-3 border-t border-cyan-500/10 bg-[#040e08]/30 flex flex-col gap-1.5 shrink-0">
        {/* Toggle Collapse Button for Desktop */}
        <button
          onClick={triggerCollapseToggle}
          className="hidden lg:flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.02] border border-transparent transition-all cursor-pointer text-left group"
        >
          {isCollapsed ? (
            <PanelLeft className="w-4 h-4 text-cyan-400 shrink-0" />
          ) : (
            <PanelLeftClose className="w-4 h-4 text-zinc-500 shrink-0 group-hover:text-cyan-400 transition-colors" />
          )}
          {!isCollapsed && (
            <div className="min-w-0">
              <span className="block text-[10px] font-extrabold uppercase leading-none">Collapse Sidebar</span>
              <span className="block text-[8px] text-zinc-500 font-bold leading-none mt-1">মেনু হাইড করুন</span>
            </div>
          )}
        </button>

        {/* Global Sign Out Button */}
        <button
          onClick={() => {
            logout();
            navigate('/');
            onClose?.();
          }}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 border border-transparent hover:border-rose-500/10 transition-all cursor-pointer text-left"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && (
            <div className="min-w-0">
              <span className="block text-[10px] font-extrabold uppercase leading-none">Sign Out Account</span>
              <span className="block text-[8px] opacity-70 font-bold leading-none mt-1">লগ আউট করুন</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
