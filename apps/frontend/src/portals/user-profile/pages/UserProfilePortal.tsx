import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { isGovernanceRole, normalizeHandle } from '@paikarmart/shared';
import { 
  User as UserType, 
  SocialPost, 
  Order, 
  ServiceBooking,
  OrderReview
} from '@/types';
import { 
  MapPin, 
  ShieldCheck, 
  Store, 
  Edit3, 
  Package, 
  Clock, 
  Star, 
  Heart, 
  Settings, 
  DollarSign, 
  CheckCircle2, 
  ShoppingBag, 
  Wrench, 
  Camera,
  Truck,
  ChevronDown,
  ChevronUp,
  Eye,
  Navigation,
  LogIn,
  LogOut,
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import { FeedPostCard } from '@/portals/social-feed/components/FeedPostCard';
import { OrderTrackingStepper } from '@/portals/user-profile/components/OrderTrackingStepper';
import { OrderReviewModal } from '@/portals/user-profile/components/OrderReviewModal';
import { SpendingAnalyticsDashboard } from '@/portals/user-profile/components/SpendingAnalyticsDashboard';
import { SavedAddressesTab } from '@/portals/user-profile/components/SavedAddressesTab';
import { useSettings } from '@/contexts/SettingsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/features/auth';
import { updateProfile as updateFirebaseProfile, updateUserProfileToFirestore, uploadProfileAvatar } from '@/lib/firebase';
import { PortalTab } from '@/types';
import { SettingsSectionId } from '@/portals/settings-center';
import { OrdersPortal as UnifiedOrdersPortal } from '@/portals/orders-hub';
import { BarChart2 } from 'lucide-react';

interface UserProfilePortalProps {
  currentUser: UserType;
  onUpdateUser: (updatedUser: UserType) => void;
  posts: SocialPost[];
  orders: Order[];
  bookings: ServiceBooking[];
  onReact: (postId: string, reaction: any) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onAddToCart: (item: any) => void;
  commerceItems: any[];
  onOpenVendorModal: () => void;
  onOpenWallet: () => void;
  onUpdateOrder?: (updatedOrder: Order) => void;
  onSelectTab?: (tab: PortalTab) => void;
  onOpenSettingsPortal?: (section?: SettingsSectionId) => void;
  onOpenSuperAdminModal?: () => void;
  onOpenAuthModal?: (tab?: 'login' | 'register') => void;
}

export const UserProfilePortal: React.FC<UserProfilePortalProps> = ({
  currentUser,
  onUpdateUser,
  posts,
  orders,
  bookings,
  onReact,
  onAddComment,
  onAddToCart,
  commerceItems,
  onOpenVendorModal,
  onOpenWallet,
  onUpdateOrder,
  onSelectTab,
  onOpenSettingsPortal,
  onOpenSuperAdminModal,
  onOpenAuthModal,
}) => {
  const { openSettings } = useSettings();
  const { t, language } = useLanguage();
  const { firebaseUser, signInWithGoogle, signOut: firebaseSignOut, loading: authLoading } = useAuth();
  const isBn = language === 'bn';
  const isDeveloperOrSuperAdmin = isGovernanceRole(currentUser.role);

  const [activeTab, setActiveTab] = useState<'analytics' | 'posts' | 'orders' | 'bookings' | 'saved'>('analytics');
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [location, setLocation] = useState(currentUser.location);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [profileSaveError, setProfileSaveError] = useState<string | null>(null);
  
  // Tracking expand state for orders - active orders expanded by default
  const [expandedTrackingOrders, setExpandedTrackingOrders] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    orders.forEach(o => {
      if (o.status === 'in_transit' || o.status === 'preparing') {
        initial[o.id] = true;
      }
    });
    return initial;
  });

  const [orderFilter, setOrderFilter] = useState<'all' | 'active' | 'delivered'>('all');
  const [reviewingOrder, setReviewingOrder] = useState<Order | null>(null);

  const toggleTracking = (orderId: string) => {
    setExpandedTrackingOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handleSaveOrderReview = (orderId: string, review: OrderReview) => {
    if (onUpdateOrder) {
      const orderToUpdate = orders.find(o => o.id === orderId);
      if (orderToUpdate) {
        onUpdateOrder({
          ...orderToUpdate,
          review
        });
      }
    }
  };

  const filteredOrders = orders.filter(order => {
    if (orderFilter === 'active') return order.status !== 'delivered';
    if (orderFilter === 'delivered') return order.status === 'delivered';
    return true;
  });

  const userPosts = posts.filter(p => p.authorId === currentUser.id || p.authorName === currentUser.name);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaveError(null);

    let nextAvatar = avatar;
    try {
      if (avatarFile && firebaseUser) {
        nextAvatar = (await uploadProfileAvatar(avatarFile, firebaseUser.uid)) || avatar;
      }

      if (firebaseUser) {
        await updateFirebaseProfile(firebaseUser, {
          displayName: name,
          ...(nextAvatar ? { photoURL: nextAvatar } : {}),
        });
        await updateUserProfileToFirestore({
          id: firebaseUser.uid,
          email: firebaseUser.email || currentUser.email || '',
          name,
          handle: currentUser.handle,
          role: currentUser.role,
          avatar: nextAvatar,
          location,
          emailVerified: firebaseUser.emailVerified,
        });
      }

      onUpdateUser({
      ...currentUser,
      name,
      location,
      avatar: nextAvatar,
      });
      setAvatar(nextAvatar);
      setAvatarFile(null);
      setIsEditing(false);
    } catch (error) {
      setProfileSaveError(error instanceof Error ? error.message : 'Profile update failed.');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn pb-24">
      
      {/* Cover Banner & Avatar Header */}
      <div className="bg-[var(--pm-card)] border border-[var(--pm-border)] rounded-3xl overflow-hidden shadow-sm">
        <div className="h-32 sm:h-56 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 -mt-12 sm:-mt-20">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover ring-4 ring-[var(--pm-card)] shadow-xl bg-[var(--pm-card)]"
              />
              <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] flex items-center justify-center ring-2 ring-[var(--pm-card)] shadow-md">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="text-center sm:text-left space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-[var(--pm-text)]">
                  {currentUser.name}
                </h1>
                {currentUser.isVendor && (
                  <span className="px-2 py-0.5 rounded-lg bg-[var(--pm-success-soft)] text-[var(--pm-success)] text-[10px] font-black uppercase tracking-wider">
                    Verified Vendor
                  </span>
                )}
                {isDeveloperOrSuperAdmin && (
                  <span className="px-2.5 py-0.5 rounded-lg bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] border border-[var(--pm-accent-border)] text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    Super Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--pm-muted)] font-medium">
                {currentUser.handle || '@alexrivera'} · {currentUser.location} · Trust Level {currentUser.trustLevel ?? (currentUser.isVendor ? 5 : 2)}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 pt-0.5">
                {firebaseUser ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--pm-success)] bg-[var(--pm-success-soft)] px-2 py-0.5 rounded-full border border-[var(--pm-success)]/30">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Firebase: {firebaseUser.email || 'Authenticated'}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--pm-warning)] bg-[var(--pm-warning-soft)] px-2 py-0.5 rounded-full border border-[var(--pm-warning)]/30">
                    <span>Firebase Auth Active</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center flex-wrap gap-1.5 sm:gap-2">
            {firebaseUser ? (
              <button
                onClick={() => firebaseSignOut()}
                disabled={authLoading}
                className="px-3 py-1.5 rounded-xl bg-[var(--pm-danger-soft)] hover:opacity-90 text-[var(--pm-danger)] border border-[var(--pm-danger)]/30 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                title="Sign out from Firebase Auth"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isBn ? 'লগআউট' : 'Sign Out'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuthModal ? onOpenAuthModal('login') : signInWithGoogle()}
                  disabled={authLoading}
                  className="px-3.5 py-2 rounded-2xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                  title="Sign in with Email or Google"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{isBn ? 'লগইন করুন' : 'Sign In'}</span>
                </button>

                <button
                  onClick={() => onOpenAuthModal ? onOpenAuthModal('register') : signInWithGoogle()}
                  disabled={authLoading}
                  className="px-3.5 py-2 rounded-2xl bg-[var(--pm-success)] hover:opacity-90 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                  title="Create new PaikarMart account"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{isBn ? 'নতুন একাউন্ট' : 'Register'}</span>
                </button>
              </div>
            )}

            {isDeveloperOrSuperAdmin && onOpenSuperAdminModal && (
              <button
                onClick={onOpenSuperAdminModal}
                className="px-3.5 py-2 rounded-2xl bg-[var(--pm-accent-soft)] hover:bg-[var(--pm-card-hover)] text-[var(--pm-accent)] border border-[var(--pm-accent-border)] font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
                title="Open Super Admin & Developer Control Center"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Super Admin Center</span>
              </button>
            )}

            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-2xl bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-border)] text-[var(--pm-text)] font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>

            <button
              onClick={() => {
                if (onOpenSettingsPortal) {
                  onOpenSettingsPortal('account_profile');
                } else if (onSelectTab) {
                  onSelectTab('settings');
                } else {
                  openSettings();
                }
              }}
              className="px-3.5 py-2 rounded-2xl bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-border)] text-[var(--pm-text)] font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              title="Settings (Account, Security, Theme, Language)"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{t.nav.settings}</span>
            </button>

            {currentUser.isVendor ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectTab && onSelectTab('vendor-dash')}
                  className="px-4 py-2 rounded-2xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Seller Central</span>
                </button>
                <Link
                  to={`/u/${encodeURIComponent(normalizeHandle(currentUser.vendorProfile?.handle || currentUser.vendorProfile?.storeName || currentUser.handle || currentUser.name))}`}
                  className="px-3.5 py-2 rounded-2xl bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-border)] text-[var(--pm-text)] font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Public @handle</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to={`/u/${encodeURIComponent(normalizeHandle(currentUser.handle || currentUser.name))}`}
                  className="px-3.5 py-2 rounded-2xl bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-border)] text-[var(--pm-text)] font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Public @handle</span>
                </Link>
                <button
                  onClick={onOpenVendorModal}
                  className="px-4 py-2 rounded-2xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md cursor-pointer"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Become Seller</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Wallet & Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        <div 
          onClick={onOpenWallet}
          className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs space-y-1 cursor-pointer hover:border-[var(--pm-accent)] transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--pm-muted)] group-hover:text-[var(--pm-accent)]">Wallet Balance</span>
            <span className="text-[10px] font-bold text-[var(--pm-accent)] bg-[var(--pm-accent-soft)] px-1.5 py-0.5 rounded-md">Manage</span>
          </div>
          <p className="text-xl sm:text-2xl font-mono tabular-nums font-black text-[var(--pm-text)]">
            ৳{currentUser.balance.toLocaleString()}
          </p>
        </div>
        <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--pm-muted)]">Total Orders</span>
          <p className="text-xl sm:text-2xl font-mono font-black text-[var(--pm-text)]">{orders.length}</p>
        </div>
        <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--pm-muted)]">Service Bookings</span>
          <p className="text-xl sm:text-2xl font-mono font-black text-[var(--pm-text)]">{bookings.length}</p>
        </div>
        <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--pm-muted)]">Account Type</span>
          <p className="text-xl sm:text-2xl font-bold text-[var(--pm-accent)] capitalize">{currentUser.role}</p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-[var(--pm-border)] pb-2">
        {[
          { id: 'analytics', label: isBn ? 'ব্যয় ও অর্ডার অ্যানালিটিক্স 📊' : 'Spending & Order Analytics 📊' },
          { id: 'orders', label: isBn ? `আমার অর্ডারগুলো (${orders.length})` : `My Orders (${orders.length})` },
          { id: 'posts', label: isBn ? 'আমার পোস্ট ও কাজ' : 'My Posts & Activity' },
          { id: 'bookings', label: isBn ? `সার্ভিস বুকিং (${bookings.length})` : `Service Bookings (${bookings.length})` },
          { id: 'saved', label: isBn ? 'ডেলিভারি ঠিকানা' : 'Delivery Addresses' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 sm:px-5 py-2 rounded-xl sm:rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-md'
                : 'bg-[var(--pm-card)] border border-[var(--pm-border)] text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content 1: Recharts Spending & Order History Analytics */}
      {activeTab === 'analytics' && (
        <SpendingAnalyticsDashboard orders={orders} />
      )}

      {/* Tab Content */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {userPosts.length > 0 ? (
            userPosts.map(post => (
              <FeedPostCard
                key={post.id}
                post={post}
                currentUser={currentUser}
                onReact={onReact}
                onAddComment={onAddComment}
                onAddToCart={onAddToCart}
                commerceItems={commerceItems}
              />
            ))
          ) : (
            <div className="bg-[var(--pm-card)] border border-[var(--pm-border)] rounded-3xl p-12 text-center space-y-3">
              <p className="text-[var(--pm-muted)] text-sm font-medium">You haven&apos;t posted anything to the social feed yet.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <UnifiedOrdersPortal
          currentUser={currentUser}
          orders={orders}
          onUpdateOrder={onUpdateOrder || (() => {})}
          onSelectTab={onSelectTab || (() => {})}
          onOpenVendorModal={onOpenVendorModal}
        />
      )}

      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {bookings.length > 0 ? (
            bookings.map(booking => (
              <div key={booking.id} className="bg-[var(--pm-card)] border border-[var(--pm-border)] rounded-3xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-[var(--pm-border)] pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[var(--pm-success)]">Booking #{booking.id}</span>
                    <h4 className="text-sm font-bold text-[var(--pm-text)]">{booking.serviceTitle}</h4>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] text-xs font-bold uppercase">
                    {booking.status}
                  </span>
                </div>
                <div className="text-xs text-[var(--pm-muted)] space-y-1">
                  <p>Provider: <strong className="text-[var(--pm-text)]">{booking.providerName}</strong></p>
                  <p>Schedule: <strong className="text-[var(--pm-text)]">{booking.date} · {booking.timeSlot}</strong></p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[var(--pm-card)] border border-[var(--pm-border)] rounded-3xl p-12 text-center space-y-3">
              <Wrench className="w-10 h-10 text-[var(--pm-muted)] mx-auto" />
              <p className="text-[var(--pm-muted)] text-sm font-medium">No service bookings yet. Explore Nearby Services!</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'saved' && (
        <SavedAddressesTab 
          currentUser={currentUser} 
          onUpdateUser={onUpdateUser} 
        />
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
          <form onSubmit={handleSaveProfile} className="bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--pm-border)]">
              <h3 className="text-base font-bold text-[var(--pm-text)]">Edit Profile</h3>
              <button type="button" onClick={() => setIsEditing(false)} className="text-[var(--pm-muted)] hover:text-[var(--pm-text)] cursor-pointer">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[var(--pm-text)] block mb-1">Display Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-xs text-[var(--pm-text)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--pm-text)] block mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-xs text-[var(--pm-text)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--pm-text)] block mb-1">Profile Photo</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-xs text-[var(--pm-text)] border border-[var(--pm-border)] file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--pm-accent-soft)] file:px-2 file:py-1 file:text-xs file:font-bold"
                />
                <p className="mt-1 text-[10px] text-[var(--pm-muted)]">JPG, PNG বা WebP · Firebase Storage configured থাকলে cloud-এ সংরক্ষিত হবে</p>
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--pm-text)] block mb-1">Avatar Image URL (fallback)</label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-xs text-[var(--pm-text)] border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none"
                />
              </div>
            </div>

            {profileSaveError && (
              <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-500">
                {profileSaveError}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Order Review Modal */}
      {reviewingOrder && (
        <OrderReviewModal
          order={reviewingOrder}
          isOpen={!!reviewingOrder}
          onClose={() => setReviewingOrder(null)}
          onSubmitReview={handleSaveOrderReview}
          initialReview={reviewingOrder.review}
        />
      )}

    </div>
  );
};
