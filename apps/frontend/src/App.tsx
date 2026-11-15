import React, { useState, useEffect } from 'react';
import { 
  PortalTab, 
  User, 
  SocialPost, 
  CommerceItem, 
  CartItem, 
  Order, 
  ServiceBooking, 
  ReactionType, 
  TaggedProduct, 
  VendorProfile,
  PostType,
  AppNotification
} from '@/types';
import { 
  CURRENT_USER, 
  INITIAL_POSTS, 
  INITIAL_COMMERCE_ITEMS, 
  INITIAL_STORIES,
  INITIAL_NOTIFICATIONS,
  INITIAL_ORDERS
} from '@/data/mockData';
import { loadStoredData, saveStoredData } from '@/lib/supabase';

import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

// Layout & Shared Components
import { TopNavbar } from '@/components/layout/TopNavbar';
import { BottomNav } from '@/components/layout/BottomNav';
import { DesktopLeftNav } from '@/components/layout/DesktopLeftNav';
import { DesktopRightSidebar } from '@/components/layout/DesktopRightSidebar';
import { SuperAppHubModal } from '@/components/layout/SuperAppHubModal';
import { AdMobBanner } from '@/components/shared/AdMobBanner';
import { DeploymentGuideModal } from '@/components/shared/DeploymentGuideModal';
import { SidebarDrawer } from '@/components/layout/SidebarDrawer';
import { LocationPickerModal } from '@/components/shared/LocationPickerModal';
import { AuthGuard, AuthPortalModal, RoleGuard } from '@/features/auth';
import { ScrollToTop } from '@/components/shared/ScrollToTop';

// Portal Modules (Lazy Loaded)
const SocialPortal = React.lazy(() => import('@/portals/social-feed').then(m => ({ default: m.SocialPortal })));
const ExplorePortal = React.lazy(() => import('@/portals/explore').then(m => ({ default: m.ExplorePortal })));
const MarketplaceHub = React.lazy(() => import('@/hubs/marketplace-hub').then(m => ({ default: m.MarketplaceHub })));
const WholesalePortal = React.lazy(() => import('@/portals/wholesale-hub').then(m => ({ default: m.WholesalePortal })));
const ServicesHub = React.lazy(() => import('@/hubs/services-hub').then(m => ({ default: m.ServicesHub })));
const TransitPortal = React.lazy(() => import('@/portals/transit-logistics').then(m => ({ default: m.TransitPortal })));
const CreatorPortal = React.lazy(() => import('@/portals/creator-studio').then(m => ({ default: m.CreatorPortal })));
const SellerCentralPortal = React.lazy(() => import('@/portals/seller-central').then(m => ({ default: m.SellerCentralPortal })));
const SellerInventoryPage = React.lazy(() => import('@/portals/seller-central').then(m => ({ default: m.SellerInventoryPage })));
const ProfilePortal = React.lazy(() => import('@/portals/user-profile').then(m => ({ default: m.ProfilePortal })));
const PublicStorefrontPage = React.lazy(() => import('@/portals/user-profile').then(m => ({ default: m.PublicStorefrontPage })));
const NotificationsPortal = React.lazy(() => import('@/portals/notifications-center').then(m => ({ default: m.NotificationsPortal })));
const OrdersPortal = React.lazy(() => import('@/portals/orders-hub').then(m => ({ default: m.OrdersPortal })));
const WalletPortal = React.lazy(() => import('@/portals/wallet').then(m => ({ default: m.WalletPortal })));
const UserGuidePortal = React.lazy(() => import('@/portals/guide').then(m => ({ default: m.UserGuidePortal })));

const ProductDetailsLanding = React.lazy(() => import('@/portals/marketplace').then(m => ({ default: m.ProductDetailsLanding })));

import { CartCheckoutDrawer, CategoryBar } from '@/features/marketplace';
import { WalletModal } from '@/portals/wallet';
import { NotificationsModal } from '@/portals/notifications-center';
import { MessagingCenterModal } from '@/features/messaging';
import { SuperAdminControlModal } from '@/portals/super-admin';

import { MultiRoleOnboardingModal } from '@/portals/seller-central/components/MultiRoleOnboardingModal';
import { PortalSkeleton, FeedSkeleton } from '@/components/shared/SkeletonLoaders';

// Centralized Settings & Contexts (Themes, Language, Location Radar)
import { AppProviders, useTheme, useLanguage, useLocationSettings, useSettings, useAuth } from '@/contexts';
import { SettingsModal, SettingsPortal as UnifiedSettingsPortal, SettingsSectionId } from '@/portals/settings-center';

function AppInner() {
  const { isDark, toggleTheme } = useTheme();
  const { openSettings } = useSettings();
  const { activeLocation, setManualLocation } = useLocationSettings();
  const { language, t } = useLanguage();
  const isBn = language === 'bn';
  const { currentUser, setCurrentUser } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  // Navigation & Modal States derived from Route
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);

  const currentTab = React.useMemo(() => {
    const path = location.pathname;
    if (path === '/' || path.startsWith('/portal/social')) return 'feed';
    if (path.startsWith('/portal/explore')) return 'explore';
    if (path.startsWith('/portal/marketplace') || path.startsWith('/hub/marketplace')) return 'commerce';
    if (path.startsWith('/portal/wholesale')) return 'wholesale';
    if (path.startsWith('/portal/services') || path.startsWith('/hub/services')) return 'services';
    if (path.startsWith('/portal/transit')) return 'rides';
    if (path.startsWith('/portal/creator')) return 'creator';
    if (path.startsWith('/portal/seller')) return 'vendor-dash';
    if (path.startsWith('/portal/profile')) return 'profile';
    if (path.startsWith('/portal/notifications')) return 'notifications';
    if (path.startsWith('/portal/orders')) return 'orders';
    if (path.startsWith('/portal/wallet')) return 'wallet';
    if (path.startsWith('/portal/messages')) return 'messages';
    if (path.startsWith('/portal/guide')) return 'guide';
    if (path.startsWith('/settings')) return 'settings';
    return 'feed';
  }, [location.pathname]);

  const setCurrentTab = (tab: PortalTab) => {
    const routeMap: Record<PortalTab, string> = {
      'feed': '/portal/social',
      'explore': '/portal/explore',
      'hub': '/portal/explore',
      'commerce': '/hub/marketplace',
      'wholesale': '/portal/wholesale',
      'services': '/hub/services',
      'rides': '/portal/transit',
      'creator': '/portal/creator',
      'vendor-dash': '/portal/seller',
      'profile': '/portal/profile',
      'notifications': '/portal/notifications',
      'settings': '/settings',
      'orders': '/portal/orders',
      'wallet': '/portal/wallet',
      'messages': '/portal/messages',
      'guide': '/portal/guide',
    };
    navigate(routeMap[tab] || '/portal/social');
  };

  const [initialSettingsSection, setInitialSettingsSection] = useState<SettingsSectionId>('account_profile');
  const [isHubOpen, setIsHubOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [isCloudGuideOpen, setIsCloudGuideOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSuperAdminModalOpen, setIsSuperAdminModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [activePortalFilter, setActivePortalFilter] = useState<'all' | 'retail' | 'wholesale' | 'nearby' | 'services' | 'demand' | 'used'>('all');
  const [activeLogisticsSubPortal, setActiveLogisticsSubPortal] = useState<'ride' | 'courier' | 'cargo' | 'fleet'>('ride');
  const [activeServicePortalId, setActiveServicePortalId] = useState('all');

  const handleCategoryBarPortalSwitch = (portal: 'all' | 'retail' | 'wholesale' | 'nearby' | 'services' | 'demand' | 'used') => {
    setActivePortalFilter(portal);
    if (portal === 'wholesale') {
      setCurrentTab('wholesale');
    } else if (portal === 'retail' || portal === 'demand' || portal === 'used') {
      setCurrentTab('commerce');
    } else if (portal === 'nearby' || portal === 'services') {
      setCurrentTab('services');
    } else if (portal === 'all') {
      setCurrentTab('commerce');
    }
  };

  const handleOpenAuthModal = (tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleOpenSettingsPortal = (section: SettingsSectionId = 'account_profile') => {
    setInitialSettingsSection(section);
    navigate('/settings');
  };

  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  // Core Data States (hydrated from localStorage or mock defaults)
  const [posts, setPosts] = useState<SocialPost[]>(() => 
    loadStoredData('POSTS', INITIAL_POSTS)
  );

  const [commerceItems, setCommerceItems] = useState<CommerceItem[]>(() => 
    loadStoredData('COMMERCE', INITIAL_COMMERCE_ITEMS)
  );

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  const [orders, setOrders] = useState<Order[]>(() => 
    loadStoredData('ORDERS', INITIAL_ORDERS)
  );

  const [bookings, setBookings] = useState<ServiceBooking[]>(() => 
    loadStoredData('BOOKINGS', [])
  );

  const [notifications, setNotifications] = useState<AppNotification[]>(() => 
    loadStoredData('NOTIFICATIONS', INITIAL_NOTIFICATIONS)
  );

  // Sync to local storage
  useEffect(() => {
    saveStoredData('POSTS', posts);
  }, [posts]);

  useEffect(() => {
    saveStoredData('COMMERCE', commerceItems);
  }, [commerceItems]);

  useEffect(() => {
    saveStoredData('ORDERS', orders);
  }, [orders]);

  useEffect(() => {
    saveStoredData('BOOKINGS', bookings);
  }, [bookings]);

  useEffect(() => {
    saveStoredData('USER', currentUser);
  }, [currentUser]);

  useEffect(() => {
    saveStoredData('NOTIFICATIONS', notifications);
  }, [notifications]);

  // Notification Handlers & Helpers
  const addNotification = (
    type: AppNotification['type'],
    title: string,
    message: string,
    actionTab?: PortalTab,
    avatar?: string
  ) => {
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      type,
      title,
      message,
      timestamp: 'Just now',
      read: false,
      actionTab,
      avatar
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  // Handlers for Social Feed
  const handleCreatePost = (content: string, taggedProduct?: TaggedProduct, mediaUrl?: string, postType: PostType = 'regular') => {
    const newPost: SocialPost = {
      id: `post_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorHandle: currentUser.handle,
      authorAvatar: currentUser.avatar,
      authorVerified: currentUser.isVendor,
      timestamp: 'Just now',
      content,
      mediaUrl,
      postType,
      taggedProduct,
      reactionsCount: { like: 0, love: 0, care: 0 },
      sharesCount: 0,
      comments: []
    };

    setPosts([newPost, ...posts]);
    addNotification(
      'social',
      'Post Published 💬',
      'Your update was shared with the PaikarMart community feed.',
      'feed',
      currentUser.avatar
    );
  };

  const handleReactToPost = (postId: string, reaction: ReactionType) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;

      const currentRx = p.userReaction;
      const isSame = currentRx === reaction;
      const nextRx = isSame ? undefined : reaction;

      const counts = { ...p.reactionsCount };
      if (currentRx && counts[currentRx as keyof typeof counts] !== undefined) {
        counts[currentRx as keyof typeof counts] = Math.max(0, counts[currentRx as keyof typeof counts] - 1);
      }
      if (nextRx && counts[nextRx as keyof typeof counts] !== undefined) {
        counts[nextRx as keyof typeof counts] = counts[nextRx as keyof typeof counts] + 1;
      }

      return {
        ...p,
        userReaction: nextRx,
        reactionsCount: counts
      };
    }));
  };

  const handleAddComment = (postId: string, commentText: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;

      const newComment = {
        id: `c_${Date.now()}`,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatar,
        content: commentText,
        timestamp: 'Just now',
        likes: 0
      };

      return {
        ...p,
        comments: [...p.comments, newComment]
      };
    }));
  };

  // Cart & Commerce Handlers
  const handleAddToCart = (
    product: CommerceItem, 
    quantity = 1, 
    isWholesale = false, 
    specialInstructions?: string
  ) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.isWholesale === isWholesale);
      if (existing) {
        return prev.map(i => 
          i.product.id === product.id && i.isWholesale === isWholesale
            ? { ...i, quantity: i.quantity + quantity, specialInstructions: specialInstructions || i.specialInstructions }
            : i
        );
      }
      return [...prev, { product, quantity, isWholesale, specialInstructions }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    setCartItems(prev => {
      const item = prev.find(i => i.product.id === productId);
      if (!item) return prev;

      if (quantity <= 0) {
        return prev.filter(i => i.product.id !== productId);
      }

      // Respect MOQ for wholesale
      if (item.isWholesale) {
        const moq = item.product.minWholesaleQty || 20;
        if (quantity < moq) {
          // If trying to go below MOQ via decrement, we remove it? 
          // Or just snap to MOQ. Let's snap to MOQ for now, 
          // and let the user use the trash icon to remove.
          quantity = moq;
        }
      }

      return prev.map(i => 
        i.product.id === productId ? { ...i, quantity } : i
      );
    });
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOrderPlaced = (newOrder: Order) => {
    setOrders([newOrder, ...orders]);
    addNotification(
      'order',
      'Order Confirmed! 📦',
      `Order #${newOrder.id} (৳${newOrder.total.toLocaleString()}) has been processed with Courier Tracking.`,
      'orders'
    );
    navigate('/portal/orders');
  };

  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };

  // Booking Handler for Services
  const handleBookService = (bookingData: Omit<ServiceBooking, 'id' | 'status'>) => {
    const newBooking: ServiceBooking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'scheduled',
      ...bookingData
    };
    setBookings([newBooking, ...bookings]);
    addNotification(
      'booking',
      'Service Booked! 🔧',
      `Booked ${bookingData.serviceTitle} with ${bookingData.providerName} for ${bookingData.date}.`,
      'services'
    );
  };

  // Vendor Onboarding & Management Handlers
  const handleCompleteVendorOnboarding = (profile: VendorProfile) => {
    const isApproved = profile.kycStatus ? profile.kycStatus === 'approved' : profile.verified;
    setCurrentUser(prev => ({
      ...prev,
      role: isApproved && prev.role === 'consumer' ? 'vendor' : prev.role,
      isVendor: isApproved,
      kycStatus: profile.kycStatus || (isApproved ? 'approved' : 'submitted'),
      trustLevel: profile.trustLevel || (isApproved ? 5 : 4),
      vendorProfile: profile
    }));
    addNotification(
      'system',
      isApproved ? 'Seller Central Activated' : 'Merchant KYC Submitted',
      isApproved
        ? `${profile.storeName} is verified and ready for listings & payouts.`
        : `${profile.storeName} application is queued for governance verification.`,
      'vendor-dash'
    );
    setCurrentTab('vendor-dash');
  };

  const handleAddNewProduct = (newProductData: Omit<CommerceItem, 'id' | 'rating' | 'reviewsCount'>) => {
    const newItem: CommerceItem = {
      id: `prod_${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      ...newProductData
    };
    setCommerceItems([newItem, ...commerceItems]);
  };

  const handleCreatePromoPost = (product: CommerceItem) => {
    const promoContent = `Special merchant announcement from ${product.storeName}! Check out our featured ${product.title} now available in our store portal. Tap below to buy or reserve:`;
    
    handleCreatePost(promoContent, {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.imageUrl,
      category: product.category,
      storeName: product.storeName,
      type: product.type
    }, product.imageUrl);

    setCurrentTab('feed');
  };

  // Balance deduction for Creator Hub tips/unlocks
  const handleDeductBalance = (amount: number): boolean => {
    void amount;
    addNotification(
      'system',
      'Payments unavailable',
      'Wallet payments are paused until the secure payment service is configured.',
      'feed'
    );
    return false;
  };

  // Filtered posts based on top search bar
  const filteredPosts = posts.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.content.toLowerCase().includes(q) ||
      p.authorName.toLowerCase().includes(q) ||
      p.taggedProduct?.title.toLowerCase().includes(q) ||
      p.taggedProduct?.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen max-w-full overflow-x-clip bg-[var(--pm-bg)] text-[var(--pm-text)] flex flex-col selection:bg-[var(--pm-accent)] selection:text-[var(--pm-accent-fg)] transition-colors">
      
      {/* Google Maps Quota Exhaustion Warning Banner */}
      {quotaExceeded && (
        <div className="bg-[var(--pm-warning-soft)] border-b border-[var(--pm-warning)]/30 text-[var(--pm-text)] px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-[var(--pm-accent)] hover:opacity-80"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* 1. Facebook-Style Sticky Top Navigation Bar */}
      <TopNavbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenHub={() => setCurrentTab('explore')}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWallet={() => setIsWalletOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onUpdateLocation={(newLocation, coords) => {
          setCurrentUser(prev => ({
            ...prev,
            location: newLocation,
            coordinates: coords
          }));
          addNotification(
            'system',
            'Live Location Updated 📍',
            `Radar and delivery location set to: ${newLocation}`,
            'feed'
          );
        }}
        unreadNotificationsCount={notifications.filter(n => !n.read).length}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onOpenVendorModal={() => setIsVendorModalOpen(true)}
        onOpenCloudGuide={() => setIsCloudGuideOpen(true)}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        currentUser={currentUser}
        isDarkMode={isDark}
        onToggleDarkMode={toggleTheme}
        onOpenSettings={() => handleOpenSettingsPortal('account_profile')}
        onOpenSuperAdminModal={() => setIsSuperAdminModalOpen(true)}
        onOpenAuthModal={handleOpenAuthModal}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        commerceItems={commerceItems}
        posts={posts}
      />

      {/* 2. Main Viewport: 3-Column Facebook Layout (Routing managed inside Center Column) */}
      <div className="max-w-7xl mx-auto w-full max-w-full px-3 sm:px-4 lg:px-6 pt-3 pb-24 md:pb-8 flex-1 flex justify-center gap-4 lg:gap-6 overflow-x-clip">
          <ScrollToTop />
          
          {/* Left Column (Desktop Shortcuts & Portal Switcher) */}
          <DesktopLeftNav
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            currentUser={currentUser}
            onOpenVendorModal={() => setIsVendorModalOpen(true)}
            onOpenCloudGuide={() => setIsCloudGuideOpen(true)}
            onOpenHub={() => setCurrentTab('explore')}
            onOpenWallet={() => setIsWalletOpen(true)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onOpenSettings={() => handleOpenSettingsPortal('account_profile')}
            onOpenSettingsPortal={handleOpenSettingsPortal}
            onOpenSuperAdminModal={() => setIsSuperAdminModalOpen(true)}
            onOpenCart={() => setIsCartOpen(true)}
            cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            unreadNotificationsCount={notifications.filter(n => !n.read).length}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
            onOpenAuthModal={handleOpenAuthModal}
            onQuickFilter={(query, targetTab) => {
              if (targetTab) setCurrentTab(targetTab);
              if (query) setSearchQuery(query);
            }}
          />

          {/* Center Primary Feed / Portal Viewport */}
          <main className="w-full max-w-2xl flex-1 space-y-6 pb-12">
            
            {/* Master 3-Tier Category Bar available across core portals */}
            {['wholesale', 'services', 'rides'].includes(currentTab) && (
              <CategoryBar
                isBn={isBn}
                activePortal={activePortalFilter}
                selectedSubCategory={selectedSubCategory}
                initialPillar={
                  currentTab === 'rides'
                    ? 'services-logistics-hub'
                    : currentTab === 'services'
                    ? 'services-hub'
                    : 'all'
                }
                onPortalSwitch={handleCategoryBarPortalSwitch}
                onSubCategorySelect={setSelectedSubCategory}
                onSearchFilter={(kw) => setSearchQuery(kw)}
                onSelectTab={setCurrentTab}
                onMainTileSelect={(tile) => {
                  if (currentTab === 'services' && tile.id.startsWith('service-')) {
                    setActiveServicePortalId(tile.id.replace(/^service-/, '').replace(/-home$/, ''));
                  }
                  if (tile.id === 's-ride-home' || tile.id === 's-emergency-home') {
                    setActiveLogisticsSubPortal('ride');
                  } else if (tile.id === 's-transport-home') {
                    setActiveLogisticsSubPortal('courier');
                  } else if (tile.id === 's-rent-home') {
                    setActiveLogisticsSubPortal('cargo');
                  }
                }}
              />
            )}

            {/* Active Portal Header indicator if switched away from feed */}
            {currentTab !== 'feed' && !location.pathname.includes('/product/') && !location.pathname.startsWith('/settings') && (
              <div className="flex items-center justify-between px-1 animate-fadeIn">
                <span className="text-xs font-black text-[var(--pm-muted)] uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--pm-accent)] animate-pulse" />
                  {currentTab.replace('-', ' ')}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (window.history.length > 1) navigate(-1);
                    else navigate('/portal/social');
                  }}
                  aria-label={isBn ? 'আগের পেজে ফিরে যান' : 'Go back to previous page'}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-bold text-[var(--pm-accent)] hover:bg-[var(--pm-accent-soft)] transition-colors cursor-pointer"
                >
                  <span aria-hidden="true">←</span>
                  <span>{isBn ? 'ফিরে যান' : 'Back'}</span>
                </button>
              </div>
            )}

          <React.Suspense fallback={currentTab === 'feed' ? <FeedSkeleton /> : <PortalSkeleton />}>
            <Routes>
              {/* Redirect root to social feed */}
              <Route path="/" element={<Navigate to="/portal/social" replace />} />

              {/* EXPLORE PORTAL (Super Hub Center Point) */}
              <Route path="/portal/explore" element={
                <ExplorePortal
                  onSelectTab={setCurrentTab}
                  onOpenVendorModal={() => setIsVendorModalOpen(true)}
                  onOpenCloudGuide={() => setIsCloudGuideOpen(true)}
                  onQuickSearch={(q) => setSearchQuery(q)}
                  isVendor={Boolean(currentUser.vendorProfile)}
                  currentUser={currentUser}
                />
              } />

              {/* VIEW 1: Facebook Social Community Feed */}
              <Route path="/portal/social" element={
                <SocialPortal
                  currentUser={currentUser}
                  posts={filteredPosts}
                  commerceItems={commerceItems}
                  onCreatePost={handleCreatePost}
                  onReactToPost={handleReactToPost}
                  onAddComment={handleAddComment}
                  onAddToCart={(item) => handleAddToCart(item, 1, item.type === 'wholesale')}
                />
              } />

              {/* VIEW 2: Retail Marketplace Portal (B2C) */}
              <Route path="/hub/marketplace" element={
                <MarketplaceHub
                  // Marketplace Hub starts with a mixed discovery feed. Child portal
                  // buttons apply the domain-specific filters inside CommercePortal.
                  items={commerceItems}
                  onAddToCart={handleAddToCart}
                  onSelectTab={setCurrentTab}
                  currentUser={currentUser}
                  appliedVoucherCode={appliedPromoCode}
                  externalSearchQuery={searchQuery}
                  onSelectVoucher={(code) => {
                    setAppliedPromoCode(code);
                    if (cartItems.length > 0) {
                      setIsCartOpen(true);
                    } else {
                      addNotification(
                        'system',
                        'Voucher Applied to Checkout',
                        `Promo code ${code} copied and saved for your next bag checkout.`,
                        'commerce'
                      );
                    }
                  }}
                  onOrderPlaced={handleOrderPlaced}
                />
              } />

              {/* Legacy marketplace URL remains supported while Hub is canonical. */}
              <Route path="/portal/marketplace" element={<Navigate to="/hub/marketplace" replace />} />

              {/* VIEW 2.1: Wholesale Hub Portal (B2B) */}
              <Route path="/portal/wholesale" element={
                <WholesalePortal
                  items={commerceItems}
                  onAddToCart={handleAddToCart}
                  onSelectTab={setCurrentTab}
                />
              } />

              <Route path="/hub/marketplace/product/:id" element={
                <ProductDetailsLanding
                  currentUser={currentUser}
                  onUpdateUser={setCurrentUser}
                  onOrderPlaced={handleOrderPlaced}
                  commerceItems={commerceItems}
                />
              } />

              <Route path="/portal/marketplace/product/:id" element={<Navigate to="/hub/marketplace/product/:id" replace />} />

              {/* VIEW 4: Nearby Services & Technician Bookings (Flat Proximity) */}
              <Route path="/hub/services" element={
                <ServicesHub
                  items={commerceItems}
                  activePortalId={activeServicePortalId}
                  onBookService={handleBookService}
                  bookings={bookings}
                  currentUser={currentUser}
                  onDeductBalance={handleDeductBalance}
                />
              } />

              <Route path="/portal/services" element={<Navigate to="/hub/services" replace />} />

              {/* VIEW 5: Ride Sharing & Express Transit (Logistics Hub) */}
              <Route path="/portal/transit" element={
                <TransitPortal 
                  rideItems={commerceItems.filter(i => i.type === 'rides')}
                  currentUser={currentUser}
                  initialSubPortal={activeLogisticsSubPortal}
                />
              } />

              {/* VIEW 6: Content Creator Hub & Google AdMob (OTT Mode Ready) */}
              <Route path="/portal/creator" element={
                <CreatorPortal
                  currentUser={currentUser}
                  onDeductBalance={handleDeductBalance}
                />
              } />

              {/* VIEW 7: Seller Central & Multi-Role Business Portal (Role & KYC Guarded) */}
              <Route path="/portal/seller/inventory" element={
                <RoleGuard
                  currentUser={currentUser}
                  requiredMode="seller"
                  onOpenVendorModal={() => setIsVendorModalOpen(true)}
                  onNavigateHome={() => navigate('/portal/social')}
                >
                  {currentUser.vendorProfile && (
                    <SellerInventoryPage
                      products={commerceItems}
                      storeId={currentUser.vendorProfile.id}
                      storeName={currentUser.vendorProfile.storeName}
                      onAddNewProduct={handleAddNewProduct}
                      onCreatePromoPost={handleCreatePromoPost}
                    />
                  )}
                </RoleGuard>
              } />

              <Route path="/portal/seller" element={
                <RoleGuard
                  currentUser={currentUser}
                  requiredMode="seller"
                  onOpenVendorModal={() => setIsVendorModalOpen(true)}
                  onNavigateHome={() => navigate('/portal/social')}
                >
                  {currentUser.vendorProfile && (
                    <SellerCentralPortal
                      vendorProfile={currentUser.vendorProfile}
                      currentUser={currentUser}
                      products={commerceItems}
                      bookings={bookings}
                      onAddNewProduct={handleAddNewProduct}
                      onCreatePromoPost={handleCreatePromoPost}
                      onOpenStoreSettings={() => handleOpenSettingsPortal('vendor_store')}
                      onSelectTab={setCurrentTab}
                    />
                  )}
                </RoleGuard>
              } />

              {/* Unified Single @handle Public Profile & Storefront View */}
              <Route path="/u/:handle" element={
                <PublicStorefrontPage
                  commerceItems={commerceItems}
                  posts={posts}
                  currentUser={currentUser}
                  onAddToCart={handleAddToCart}
                  onBookService={handleBookService}
                  onReact={handleReactToPost}
                  onAddComment={handleAddComment}
                  onDeductBalance={handleDeductBalance}
                />
              } />
              <Route path="/store/:storeId" element={
                <PublicStorefrontPage
                  commerceItems={commerceItems}
                  posts={posts}
                  currentUser={currentUser}
                  onAddToCart={handleAddToCart}
                  onBookService={handleBookService}
                  onReact={handleReactToPost}
                  onAddComment={handleAddComment}
                  onDeductBalance={handleDeductBalance}
                />
              } />

              {/* VIEW 8: User Account Profile Portal */}
              <Route path="/portal/profile" element={
                <AuthGuard onOpenAuthModal={handleOpenAuthModal}><ProfilePortal
                  currentUser={currentUser}
                  onUpdateUser={setCurrentUser}
                  posts={posts}
                  orders={orders}
                  bookings={bookings}
                  onReact={handleReactToPost}
                  onAddComment={handleAddComment}
                  onAddToCart={handleAddToCart}
                  commerceItems={commerceItems}
                  onOpenVendorModal={() => setIsVendorModalOpen(true)}
                  onOpenWallet={() => setIsWalletOpen(true)}
                  onUpdateOrder={handleUpdateOrder}
                  onSelectTab={setCurrentTab}
                  onOpenSettingsPortal={handleOpenSettingsPortal}
                  onOpenSuperAdminModal={() => setIsSuperAdminModalOpen(true)}
                  onOpenAuthModal={handleOpenAuthModal}
                /></AuthGuard>
              } />

              {/* VIEW 9: Full Notification Center Page */}
              <Route path="/portal/notifications" element={
                <AuthGuard onOpenAuthModal={handleOpenAuthModal}><NotificationsPortal
                  notifications={notifications}
                  onMarkAsRead={handleMarkNotificationAsRead}
                  onMarkAllAsRead={handleMarkAllNotificationsAsRead}
                  onClearAll={handleClearAllNotifications}
                  onSelectTab={setCurrentTab}
                  onOpenSettingsPortal={handleOpenSettingsPortal}
                /></AuthGuard>
              } />

              {/* VIEW 10: Unified Orders Portal */}
              <Route path="/portal/orders" element={
                <AuthGuard onOpenAuthModal={handleOpenAuthModal}><OrdersPortal
                  currentUser={currentUser}
                  orders={orders}
                  onUpdateOrder={handleUpdateOrder}
                  onReorderOrder={(newOrder) => {
                    setOrders(prev => [newOrder, ...prev]);
                    addNotification(
                      'order',
                      'Reorder Placed! 📦',
                      `Order #${newOrder.id} (৳${newOrder.total.toLocaleString()}) queued for dispatch.`,
                      'orders'
                    );
                  }}
                  onSelectTab={setCurrentTab}
                  onOpenVendorModal={() => setIsVendorModalOpen(true)}
                /></AuthGuard>
              } />

              {/* VIEW 11: Wallet Portal */}
              <Route path="/portal/wallet" element={
                <AuthGuard onOpenAuthModal={handleOpenAuthModal}><WalletPortal
                  currentUser={currentUser}
                  onUpdateUser={setCurrentUser}
                  onSelectTab={setCurrentTab}
                  onOpenVendorModal={() => setIsVendorModalOpen(true)}
                /></AuthGuard>
              } />

              {/* VIEW 12: Full Screen Messaging Portal */}
              <Route path="/portal/messages" element={
                <AuthGuard onOpenAuthModal={handleOpenAuthModal}><MessagingCenterModal
                  isOpen={true}
                  onClose={() => navigate('/portal/social')}
                  isFullScreen={true}
                /></AuthGuard>
              } />

              {/* VIEW 13: User & Vendor Guide */}
              <Route path="/portal/guide" element={
                <UserGuidePortal
                  onSelectTab={setCurrentTab}
                  onOpenVendorModal={() => setIsVendorModalOpen(true)}
                  isVendor={currentUser.isVendor}
                />
              } />

              {/* Unified Settings Portal */}
              <Route path="/settings" element={
                <UnifiedSettingsPortal
                  initialSection={initialSettingsSection}
                  onSelectTab={setCurrentTab}
                  currentUser={currentUser}
                  onUpdateUser={setCurrentUser}
                  onClose={() => navigate('/')}
                />
              } />
            </Routes>
          </React.Suspense>

        </main>

        {/* Right Column (Desktop Sponsored, Cart Widget, Verified Sellers, AI Trending Topics) */}
        <DesktopRightSidebar
          activeOrders={orders}
          onOpenCart={() => setIsCartOpen(true)}
          featuredProducts={commerceItems}
          onAddToCart={(item) => handleAddToCart(item, 1, item.type === 'wholesale')}
          onOpenStorePortal={(type) => setCurrentTab(type)}
          posts={posts}
          onSelectTopic={(topic) => setSearchQuery(topic)}
        />

      </div>

      {/* 3. Mobile Bottom App Bar (Thumb-zone navigation) */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenHub={() => setCurrentTab('explore')}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        currentUser={currentUser}
      />

      {/* 4. Full-Screen Super App Portal Hub Modal */}
      <SuperAppHubModal
        isOpen={isHubOpen}
        onClose={() => setIsHubOpen(false)}
        onSelectTab={setCurrentTab}
        onOpenVendorModal={() => setIsVendorModalOpen(true)}
        onOpenCloudGuide={() => setIsCloudGuideOpen(true)}
        isVendor={currentUser.isVendor}
      />

      {/* 5. Multi-Role Multi-Capability 5-Step KYC Onboarding Modal */}
      <MultiRoleOnboardingModal
        isOpen={isVendorModalOpen}
        onClose={() => setIsVendorModalOpen(false)}
        applicantId={currentUser.id}
        onCompleteOnboarding={handleCompleteVendorOnboarding}
      />

      {/* 6. Unified Cart & Checkout Slide-Over Drawer */}
      <CartCheckoutDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onOrderPlaced={handleOrderPlaced}
        currentUser={currentUser}
        initialPromoCode={appliedPromoCode}
      />

      {/* 7. Multi-Cloud Deployment Guide (Render + Vercel + Supabase + Firebase) */}
      <DeploymentGuideModal
        isOpen={isCloudGuideOpen}
        onClose={() => setIsCloudGuideOpen(false)}
      />

      {/* 8. Facebook-Style Advanced Menu Sidebar Drawer */}
      <SidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentUser={currentUser}
        onSelectTab={setCurrentTab}
        onOpenVendorModal={() => setIsVendorModalOpen(true)}
        onOpenCloudGuide={() => setIsCloudGuideOpen(true)}
        onOpenWallet={() => setIsWalletOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSettings={() => handleOpenSettingsPortal('account_profile')}
        onOpenSettingsPortal={handleOpenSettingsPortal}
        onOpenSuperAdminModal={() => setIsSuperAdminModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        unreadNotificationsCount={notifications.filter(n => !n.read).length}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenAuthModal={handleOpenAuthModal}
        onQuickFilter={(query, targetTab) => {
          if (targetTab) setCurrentTab(targetTab);
          if (query) setSearchQuery(query);
        }}
        isDarkMode={isDark}
        onToggleDarkMode={toggleTheme}
      />

      {/* 10. Real-Time Notifications Center */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationAsRead}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onClearAll={handleClearAllNotifications}
        onSelectTab={setCurrentTab}
      />

      {/* 11. Google Maps Location Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={activeLocation || currentUser.location}
        onSelectLocation={(newLoc, coords) => {
          setManualLocation(newLoc, coords);
          setCurrentUser(prev => ({ ...prev, location: newLoc, coordinates: coords }));
        }}
      />

      {/* 12. Centralized Modular Settings Modal (Theme, Language, Location Radar) */}
      <SettingsModal
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
      />

      {/* 13. Global Messaging Center Modal */}
      <MessagingCenterModal
        isOpen={isMessagingOpen}
        onClose={() => setIsMessagingOpen(false)}
      />

      {/* 14. Developer Restricted Super Admin Control Center Modal */}
      <SuperAdminControlModal
        isOpen={isSuperAdminModalOpen}
        onClose={() => setIsSuperAdminModalOpen(false)}
        onUpdateUserRole={(targetUserId, newRole) => {
          setCurrentUser(prev => prev.id === targetUserId ? { ...prev, role: newRole } : prev);
        }}
      />

      {/* 15. Real Auth Portal Modal (Email/Password & Google Sign In) */}
      <AuthPortalModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
      />

      {/* 16. Quick Wallet & Escrow Modal */}
      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        currentUser={currentUser}
        onUpdateUser={setCurrentUser}
      />

    </div>
  );
}

export default function App() {
  return (
    <AppProviders>
      <AppInner />
    </AppProviders>
  );
}
