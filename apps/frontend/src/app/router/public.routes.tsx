import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import { AuthGuard } from '@/guards/AuthGuard';
import HomePage from '@/pages/HomePage';
import MarketPage from '@/pages/MarketPage';
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import { UnauthorizedPage } from '@/pages/auth/UnauthorizedPage';

const ProductDetails = lazy(() => import('@/portals/marketplace-hub/marketplace/pages/ProductDetailsView'));
const Demand = lazy(() => import('@/pages/Demand'));
const DemandDetail = lazy(() => import('@/pages/DemandDetail').then(m => ({ default: m.DemandDetail })));
const ProfilePage = lazy(() => import('@/modules/profile').then(m => ({ default: m.ProfilePage })));
const PortalHubPage = lazy(() => import('@/modules/portals').then(m => ({ default: m.PortalHubPage })));
const SearchPage = lazy(() => import('@/pages/SearchPage').then(m => ({ default: m.SearchPage })));
const Notifications = lazy(() => import('@/modules/notification/pages/notifications'));
const NotificationSettingsPage = lazy(() => import('@/modules/notification/pages/NotificationSettingsPage').then(m => ({ default: m.NotificationSettingsPage })));
const ChatList = lazy(() => import('@/portals/messages/pages/ChatList'));
const ChatDetail = lazy(() => import('@/portals/messages/pages/ChatDetail'));
const CartPage = lazy(() => import('@/modules/cart/pages/CartPage'));
const VideoHub = lazy(() => import('@/portals/video/VideoHub'));
const ShortsViewer = lazy(() => import('@/portals/video/ShortsViewer'));
const LiveStreamView = lazy(() => import('@/portals/video/LiveStreamView'));
const CreatorChannel = lazy(() => import('@/portals/video/CreatorChannel'));
const VideoWatchView = lazy(() => import('@/portals/video/VideoWatchView'));
const HubPage = lazy(() => import('@/pages/HubPage').then(m => ({ default: m.HubPage })));
const NewsPage = lazy(() => import('@/modules/news/pages/NewsPage').then(m => ({ default: m.NewsPage })));

const TermsPage = lazy(() => import('@/pages/legal').then(m => ({ default: m.TermsPage })));
const PrivacyPolicyPage = lazy(() => import('@/pages/legal').then(m => ({ default: m.PrivacyPolicyPage })));
const ECommercePolicyPage = lazy(() => import('@/pages/legal').then(m => ({ default: m.ECommercePolicyPage })));
const SellerRulesPage = lazy(() => import('@/pages/legal').then(m => ({ default: m.SellerRulesPage })));
const FAQPage = lazy(() => import('@/pages/legal').then(m => ({ default: m.FAQPage })));
const QNAPage = lazy(() => import('@/pages/legal').then(m => ({ default: m.QNAPage })));
const ContactPage = lazy(() => import('@/pages/legal').then(m => ({ default: m.ContactPage })));

export const publicRoutes = (
  <>
    <Route path="/" element={<HomePage />} />
    <Route path="/market" element={<MarketPage />} />
    <Route path="/social" element={<HomePage />} />
    <Route path="/feed" element={<HomePage />} />
    <Route path="/product/:id" element={<ProductDetails />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/auth/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/auth/register" element={<Register />} />
    <Route path="/unauthorized" element={<UnauthorizedPage />} />
    <Route path="/demand" element={<Demand />} />
    <Route path="/demand/:id" element={<DemandDetail />} />
    <Route path="/reels" element={<ShortsViewer />} />
    <Route path="/video" element={<VideoHub />} />
    <Route path="/video/shorts" element={<ShortsViewer />} />
    <Route path="/video/live" element={<LiveStreamView />} />
    <Route path="/video/live/:id" element={<LiveStreamView />} />
    <Route path="/video/channel/:id" element={<CreatorChannel />} />
    <Route path="/video/watch/:id" element={<VideoWatchView />} />
    <Route path="/video/:id" element={<VideoWatchView />} />
    <Route path="/profile" element={<AuthGuard><ProfilePage /></AuthGuard>} />
    <Route path="/profile/:id" element={<AuthGuard><ProfilePage /></AuthGuard>} />
    <Route path="/u/:id" element={<ProfilePage />} />
    <Route path="/vendors/:id" element={<ProfilePage />} />
    <Route path="/store/:id" element={<ProfilePage />} />
    <Route path="/store/:slug" element={<ProfilePage />} />
    <Route path="/shop/:id" element={<ProfilePage />} />
    <Route path="/news" element={<NewsPage />} />
    <Route path="/news/*" element={<NewsPage />} />
    <Route path="/search" element={<SearchPage />} />
    <Route path="/notifications" element={<Notifications />} />
    <Route path="/notifications/settings" element={<NotificationSettingsPage />} />
    <Route path="/settings/notifications" element={<NotificationSettingsPage />} />
    <Route path="/messages" element={<ChatList />} />
    <Route path="/messages/:id" element={<ChatDetail />} />
    <Route path="/apps" element={<HubPage />} />
    <Route path="/portals" element={<HubPage />} />
    <Route path="/hub" element={<HubPage />} />
    <Route path="/portal-hub" element={<HubPage />} />
    <Route path="/games" element={<HubPage />} />
    <Route path="/portals/:type" element={<PortalHubPage />} />

    {/* Legal & Community Q&A Pages */}
    <Route path="/terms" element={<TermsPage />} />
    <Route path="/privacy" element={<PrivacyPolicyPage />} />
    <Route path="/ecommerce-policy" element={<ECommercePolicyPage />} />
    <Route path="/refund-policy" element={<ECommercePolicyPage />} />
    <Route path="/seller-rules" element={<SellerRulesPage />} />
    <Route path="/faq" element={<FAQPage />} />
    <Route path="/qna" element={<QNAPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/support" element={<ContactPage />} />
  </>
);
