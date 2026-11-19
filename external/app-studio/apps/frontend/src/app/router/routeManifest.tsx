import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import type {
  AppNotification,
  CommerceItem,
  Order,
  PortalTab,
  PostType,
  ReactionType,
  ServiceBooking,
  SocialPost,
  TaggedProduct,
  User,
} from '@/types';
import type { PortalFilterType } from '@/features/marketplace';
import type { SettingsSectionId } from '@/portals/utilities/settings-center';
import { AuthGuard } from '@/app/guards/AuthGuard';
import { RoleGuard } from '@/app/guards/RoleGuard';
import { ROUTE_PATHS } from '@/app/router/routeIds';
import { FeedSkeleton, PortalSkeleton } from '@/design-system/components';

// Lazy-loaded Domain-Grouped Portal Modules
const SocialPortal = React.lazy(() => import('@/portals/community/social-feed').then((m) => ({ default: m.SocialPortal })));
const ExplorePortal = React.lazy(() => import('@/portals/utilities/explore').then((m) => ({ default: m.ExplorePortal })));
const MarketplaceHub = React.lazy(() => import('@/hubs/marketplace-hub').then((m) => ({ default: m.MarketplaceHub })));
const WholesalePortal = React.lazy(() => import('@/portals/marketplaces/wholesale').then((m) => ({ default: m.WholesalePortal })));
const ServicesHub = React.lazy(() => import('@/hubs/services-hub').then((m) => ({ default: m.ServicesHub })));
const CommunityHub = React.lazy(() => import('@/hubs/community-hub').then((m) => ({ default: m.CommunityHub })));
const UtilityHub = React.lazy(() => import('@/hubs/utility-hub').then((m) => ({ default: m.UtilityHub })));
const TransitPortal = React.lazy(() => import('@/portals/logistics/transit-logistics').then((m) => ({ default: m.TransitPortal })));
const CreatorPortal = React.lazy(() => import('@/portals/community/creator-studio').then((m) => ({ default: m.CreatorPortal })));
const SellerCentralPortal = React.lazy(() => import('@/portals/utilities/seller-central').then((m) => ({ default: m.SellerCentralPortal })));
const SellerInventoryPage = React.lazy(() => import('@/portals/utilities/seller-central').then((m) => ({ default: m.SellerInventoryPage })));
const ProfilePortal = React.lazy(() => import('@/portals/utilities/user-profile').then((m) => ({ default: m.ProfilePortal })));
const PublicStorefrontPage = React.lazy(() => import('@/portals/utilities/user-profile').then((m) => ({ default: m.PublicStorefrontPage })));
const NotificationsPortal = React.lazy(() => import('@/portals/utilities/notifications-center').then((m) => ({ default: m.NotificationsPortal })));
const OrdersPortal = React.lazy(() => import('@/portals/utilities/orders-hub').then((m) => ({ default: m.OrdersPortal })));
const WalletPortal = React.lazy(() => import('@/portals/utilities/wallet').then((m) => ({ default: m.WalletPortal })));
const UserGuidePortal = React.lazy(() => import('@/portals/utilities/guide').then((m) => ({ default: m.UserGuidePortal })));
const ProductDetailsLanding = React.lazy(() => import('@/portals/marketplaces/retail').then((m) => ({ default: m.ProductDetailsLanding })));
const SettingsPortal = React.lazy(() =>
  import('@/portals/utilities/settings-center').then((m) => ({ default: m.SettingsPortal }))
);
const MessagesPortal = React.lazy(() => import('@/portals/community/messages').then((m) => ({ default: m.MessagesPortal })));
const DemandBoardPortal = React.lazy(() =>
  import('@/portals/shared/demand-board').then((m) => ({ default: m.DemandBoardPortal }))
);
const NearbyRadarPortal = React.lazy(() =>
  import('@/portals/shared/nearby-radar').then((m) => ({ default: m.NearbyRadarPortal }))
);

export interface AppRouteManifestProps {
  currentTab: PortalTab;
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  posts: SocialPost[];
  filteredPosts: SocialPost[];
  commerceItems: CommerceItem[];
  orders: Order[];
  bookings: ServiceBooking[];
  notifications: AppNotification[];
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  appliedPromoCode: string;
  activePortalFilter: PortalFilterType;
  selectedSubCategory: string;
  activeCommerceChildPortalId: string;
  activeServicePortalId: string;
  activeLogisticsSubPortal: 'ride' | 'courier' | 'cargo' | 'fleet';
  initialSettingsSection: SettingsSectionId;
  setCurrentTab: (tab: PortalTab) => void;
  navigate: (to: string) => void;
  onOpenVendorModal: () => void;
  onOpenCloudGuide: () => void;
  onOpenWallet: () => void;
  onOpenNotifications: () => void;
  onOpenAuthModal: (tab?: 'login' | 'register') => void;
  onOpenSettingsPortal: (section?: SettingsSectionId) => void;
  onOpenSuperAdminModal: () => void;
  onCreatePost: (content: string, taggedProduct?: TaggedProduct, mediaUrl?: string, postType?: PostType) => void;
  onReactToPost: (postId: string, reaction: ReactionType) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onAddToCart: (product: CommerceItem, quantity?: number, isWholesale?: boolean, specialInstructions?: string) => void;
  onBuyNow: (product: CommerceItem, quantity?: number, isWholesale?: boolean, specialInstructions?: string) => void;
  onSelectVoucher: (code: string) => void;
  onOrderPlaced: (newOrder: Order) => void;
  onUpdateOrder: (updatedOrder: Order) => void;
  onReorderOrder: (newOrder: Order) => void;
  onBookService: (bookingData: Omit<ServiceBooking, 'id' | 'status'>) => void;
  onDeductBalance: (amount: number) => boolean;
  onAddNewProduct: (newProductData: Omit<CommerceItem, 'id' | 'rating' | 'reviewsCount'>) => void;
  onCreatePromoPost: (product: CommerceItem) => void;
  onMarkNotificationAsRead: (id: string) => void;
  onMarkAllNotificationsAsRead: () => void;
  onClearAllNotifications: () => void;
}

export const AppRouteManifest: React.FC<AppRouteManifestProps> = ({
  currentTab,
  currentUser,
  setCurrentUser,
  posts,
  filteredPosts,
  commerceItems,
  orders,
  bookings,
  notifications,
  searchQuery,
  setSearchQuery,
  appliedPromoCode,
  activePortalFilter,
  selectedSubCategory,
  activeCommerceChildPortalId,
  activeServicePortalId,
  activeLogisticsSubPortal,
  initialSettingsSection,
  setCurrentTab,
  navigate,
  onOpenVendorModal,
  onOpenCloudGuide,
  onOpenWallet,
  onOpenNotifications,
  onOpenAuthModal,
  onOpenSettingsPortal,
  onOpenSuperAdminModal,
  onCreatePost,
  onReactToPost,
  onAddComment,
  onAddToCart,
  onBuyNow,
  onSelectVoucher,
  onOrderPlaced,
  onUpdateOrder,
  onReorderOrder,
  onBookService,
  onDeductBalance,
  onAddNewProduct,
  onCreatePromoPost,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  onClearAllNotifications,
}) => {
  return (
    <React.Suspense fallback={currentTab === 'feed' ? <FeedSkeleton /> : <PortalSkeleton />}>
      <Routes>
        <Route path={ROUTE_PATHS.ROOT} element={<Navigate to={ROUTE_PATHS.SOCIAL} replace />} />

        <Route
          path={ROUTE_PATHS.EXPLORE}
          element={
            <ExplorePortal
              onSelectTab={setCurrentTab}
              onOpenVendorModal={onOpenVendorModal}
              onOpenCloudGuide={onOpenCloudGuide}
              onQuickSearch={(q) => setSearchQuery(q)}
              isVendor={Boolean(currentUser.vendorProfile)}
              currentUser={currentUser}
            />
          }
        />

        <Route
          path={ROUTE_PATHS.SOCIAL}
          element={
            <SocialPortal
              currentUser={currentUser}
              posts={filteredPosts}
              commerceItems={commerceItems}
              onCreatePost={onCreatePost}
              onReactToPost={onReactToPost}
              onAddComment={onAddComment}
              onAddToCart={(item) => onAddToCart(item, 1, item.type === 'wholesale')}
            />
          }
        />

        <Route
          path={ROUTE_PATHS.MARKETPLACE_HUB}
          element={
            <MarketplaceHub
              items={commerceItems}
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
              onSelectTab={setCurrentTab}
              currentUser={currentUser}
              appliedVoucherCode={appliedPromoCode}
              externalSearchQuery={searchQuery}
              externalActivePortal={activePortalFilter}
              externalSubCategory={selectedSubCategory}
              externalChildPortalId={activeCommerceChildPortalId}
              onSelectVoucher={onSelectVoucher}
              onOrderPlaced={onOrderPlaced}
            />
          }
        />

        <Route path={ROUTE_PATHS.MARKETPLACE_LEGACY} element={<Navigate to={ROUTE_PATHS.MARKETPLACE_HUB} replace />} />

        <Route
          path={ROUTE_PATHS.WHOLESALE}
          element={
            <WholesalePortal
              items={commerceItems}
              onAddToCart={onAddToCart}
              onSelectTab={setCurrentTab}
              externalSearchQuery={searchQuery}
              externalSubCategory={selectedSubCategory}
            />
          }
        />

        <Route
          path={ROUTE_PATHS.PRODUCT_DETAILS}
          element={
            <ProductDetailsLanding
              currentUser={currentUser}
              onUpdateUser={setCurrentUser}
              onOrderPlaced={onOrderPlaced}
              commerceItems={commerceItems}
              onOpenAuthModal={onOpenAuthModal}
            />
          }
        />

        <Route
          path={ROUTE_PATHS.PRODUCT_DETAILS_LEGACY}
          element={<Navigate to={ROUTE_PATHS.PRODUCT_DETAILS} replace />}
        />

        <Route
          path={ROUTE_PATHS.SERVICES_HUB}
          element={
            <ServicesHub
              items={commerceItems}
              activePortalId={activeServicePortalId}
              externalSearchQuery={searchQuery}
              externalSubCategory={selectedSubCategory}
              onBookService={onBookService}
              bookings={bookings}
              currentUser={currentUser}
              onDeductBalance={onDeductBalance}
            />
          }
        />

        <Route path={ROUTE_PATHS.SERVICES_LEGACY} element={<Navigate to={ROUTE_PATHS.SERVICES_HUB} replace />} />

        <Route
          path={ROUTE_PATHS.TRANSIT}
          element={
            <TransitPortal
              rideItems={commerceItems.filter((i) => i.type === 'rides')}
              currentUser={currentUser}
              initialSubPortal={activeLogisticsSubPortal}
            />
          }
        />

        <Route
          path={ROUTE_PATHS.CREATOR}
          element={<CreatorPortal currentUser={currentUser} onDeductBalance={onDeductBalance} />}
        />

        <Route
          path={ROUTE_PATHS.COMMUNITY_HUB}
          element={
            <CommunityHub
              currentUser={currentUser}
              posts={filteredPosts}
              commerceItems={commerceItems}
              onCreatePost={onCreatePost}
              onReactToPost={onReactToPost}
              onAddComment={onAddComment}
              onAddToCart={(item) => onAddToCart(item, 1, item.type === 'wholesale')}
              onDeductBalance={onDeductBalance}
              onSelectTab={setCurrentTab}
              onOpenVendorModal={onOpenVendorModal}
            />
          }
        />

        <Route
          path={ROUTE_PATHS.UTILITY_HUB}
          element={
            <UtilityHub
              currentUser={currentUser}
              orders={orders}
              unreadNotificationsCount={notifications.filter((n) => !n.read).length}
              onSelectTab={setCurrentTab}
              onOpenWallet={onOpenWallet}
              onOpenNotifications={onOpenNotifications}
              onOpenSettings={() => onOpenSettingsPortal('account_profile')}
              onOpenCloudGuide={onOpenCloudGuide}
            />
          }
        />

        <Route
          path={ROUTE_PATHS.SELLER_INVENTORY}
          element={
            <RoleGuard
              currentUser={currentUser}
              requiredMode="seller"
              onOpenVendorModal={onOpenVendorModal}
              onNavigateHome={() => navigate(ROUTE_PATHS.SOCIAL)}
            >
              {currentUser.vendorProfile && (
                <SellerInventoryPage
                  products={commerceItems}
                  storeId={currentUser.vendorProfile.id}
                  storeName={currentUser.vendorProfile.storeName}
                  onAddNewProduct={onAddNewProduct}
                  onCreatePromoPost={onCreatePromoPost}
                />
              )}
            </RoleGuard>
          }
        />

        <Route
          path={ROUTE_PATHS.SELLER}
          element={
            <RoleGuard
              currentUser={currentUser}
              requiredMode="seller"
              onOpenVendorModal={onOpenVendorModal}
              onNavigateHome={() => navigate(ROUTE_PATHS.SOCIAL)}
            >
              {currentUser.vendorProfile && (
                <SellerCentralPortal
                  vendorProfile={currentUser.vendorProfile}
                  currentUser={currentUser}
                  products={commerceItems}
                  bookings={bookings}
                  onAddNewProduct={onAddNewProduct}
                  onCreatePromoPost={onCreatePromoPost}
                  onOpenStoreSettings={() => onOpenSettingsPortal('vendor_store')}
                  onSelectTab={setCurrentTab}
                />
              )}
            </RoleGuard>
          }
        />

        <Route
          path={ROUTE_PATHS.PUBLIC_HANDLE}
          element={
            <PublicStorefrontPage
              commerceItems={commerceItems}
              posts={posts}
              currentUser={currentUser}
              onAddToCart={onAddToCart}
              onBookService={onBookService}
              onReact={onReactToPost}
              onAddComment={onAddComment}
              onDeductBalance={onDeductBalance}
            />
          }
        />

        <Route
          path={ROUTE_PATHS.PUBLIC_STORE}
          element={
            <PublicStorefrontPage
              commerceItems={commerceItems}
              posts={posts}
              currentUser={currentUser}
              onAddToCart={onAddToCart}
              onBookService={onBookService}
              onReact={onReactToPost}
              onAddComment={onAddComment}
              onDeductBalance={onDeductBalance}
            />
          }
        />

        <Route
          path={ROUTE_PATHS.PROFILE}
          element={
            <AuthGuard onOpenAuthModal={onOpenAuthModal}>
              <ProfilePortal
                currentUser={currentUser}
                onUpdateUser={setCurrentUser}
                posts={posts}
                orders={orders}
                bookings={bookings}
                onReact={onReactToPost}
                onAddComment={onAddComment}
                onAddToCart={onAddToCart}
                commerceItems={commerceItems}
                onOpenVendorModal={onOpenVendorModal}
                onOpenWallet={onOpenWallet}
                onUpdateOrder={onUpdateOrder}
                onSelectTab={setCurrentTab}
                onOpenSettingsPortal={onOpenSettingsPortal}
                onOpenSuperAdminModal={onOpenSuperAdminModal}
                onOpenAuthModal={onOpenAuthModal}
              />
            </AuthGuard>
          }
        />

        <Route
          path={ROUTE_PATHS.NOTIFICATIONS}
          element={
            <AuthGuard onOpenAuthModal={onOpenAuthModal}>
              <NotificationsPortal
                notifications={notifications}
                onMarkAsRead={onMarkNotificationAsRead}
                onMarkAllAsRead={onMarkAllNotificationsAsRead}
                onClearAll={onClearAllNotifications}
                onSelectTab={setCurrentTab}
                onOpenSettingsPortal={onOpenSettingsPortal}
              />
            </AuthGuard>
          }
        />

        <Route
          path={ROUTE_PATHS.ORDERS}
          element={
            <AuthGuard onOpenAuthModal={onOpenAuthModal}>
              <OrdersPortal
                currentUser={currentUser}
                orders={orders}
                onUpdateOrder={onUpdateOrder}
                onReorderOrder={onReorderOrder}
                onSelectTab={setCurrentTab}
                onOpenVendorModal={onOpenVendorModal}
              />
            </AuthGuard>
          }
        />

        <Route
          path={ROUTE_PATHS.WALLET}
          element={
            <AuthGuard onOpenAuthModal={onOpenAuthModal}>
              <WalletPortal
                currentUser={currentUser}
                onUpdateUser={setCurrentUser}
                onSelectTab={setCurrentTab}
                onOpenVendorModal={onOpenVendorModal}
              />
            </AuthGuard>
          }
        />

        <Route
          path={ROUTE_PATHS.MESSAGES}
          element={
            <AuthGuard onOpenAuthModal={onOpenAuthModal}>
              <MessagesPortal onClose={() => navigate(ROUTE_PATHS.SOCIAL)} />
            </AuthGuard>
          }
        />

        <Route
          path={ROUTE_PATHS.GUIDE}
          element={
            <UserGuidePortal
              onSelectTab={setCurrentTab}
              onOpenVendorModal={onOpenVendorModal}
              isVendor={currentUser.isVendor}
            />
          }
        />

        <Route
          path={ROUTE_PATHS.SETTINGS}
          element={
            <AuthGuard onOpenAuthModal={onOpenAuthModal}>
              <SettingsPortal
                initialSection={initialSettingsSection}
                onSelectTab={setCurrentTab}
                currentUser={currentUser}
                onUpdateUser={setCurrentUser}
                onClose={() => navigate(ROUTE_PATHS.ROOT)}
              />
            </AuthGuard>
          }
        />

        <Route
          path={ROUTE_PATHS.DEMAND}
          element={
            <DemandBoardPortal
              currentUser={currentUser}
              onSelectTab={setCurrentTab}
              onOpenVendorModal={onOpenVendorModal}
            />
          }
        />

        <Route
          path={ROUTE_PATHS.NEARBY}
          element={
            <NearbyRadarPortal
              currentUser={currentUser}
              commerceItems={commerceItems}
              onAddToCart={(item, qty, isWholesale) => onAddToCart(item, qty, isWholesale)}
              onBookService={onBookService}
              onSelectTab={setCurrentTab}
            />
          }
        />
      </Routes>
    </React.Suspense>
  );
};
