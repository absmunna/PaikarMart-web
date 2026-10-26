import { Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Feed from '@/pages/Feed';
import ProductDetails from '@/portals/marketplace-hub/marketplace/pages/ProductDetailsView';
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import { UnauthorizedPage } from '@/pages/auth/UnauthorizedPage';
import Demand from '@/pages/Demand';
import { DemandDetail } from '@/pages/DemandDetail';
import Reels from '@/pages/Reels';
import { ProfilePage } from '@/modules/profile';
import { PortalHubPage } from '@/modules/portals';
import { SearchPage } from '@/pages/SearchPage';
import Notifications from '@/modules/notification/pages/notifications';
import ChatList from '@/portals/messages/pages/ChatList';
import ChatDetail from '@/portals/messages/pages/ChatDetail';
import CartPage from '@/modules/cart/pages/CartPage';
import VideoHub from '@/portals/video/VideoHub';
import { HubPage } from '@/pages/HubPage';
import { NewsPage } from '@/modules/news/pages/NewsPage';
import {
  TermsPage, PrivacyPolicyPage, ECommercePolicyPage,
  SellerRulesPage, FAQPage, QNAPage, ContactPage
} from '@/pages/legal';

export const publicRoutes = (
  <>
    <Route path="/" element={<Home />} />
    <Route path="/feed" element={<Feed />} />
    <Route path="/product/:id" element={<ProductDetails />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/auth/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/auth/register" element={<Register />} />
    <Route path="/unauthorized" element={<UnauthorizedPage />} />
    <Route path="/demand" element={<Demand />} />
    <Route path="/demand/:id" element={<DemandDetail />} />
    <Route path="/reels" element={<Reels />} />
    <Route path="/video" element={<VideoHub />} />
    <Route path="/video/*" element={<VideoHub />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/profile/:id" element={<ProfilePage />} />
    <Route path="/u/:id" element={<ProfilePage />} />
    <Route path="/vendors/:id" element={<ProfilePage />} />
    <Route path="/store/:id" element={<ProfilePage />} />
    <Route path="/store/:slug" element={<ProfilePage />} />
    <Route path="/shop/:id" element={<ProfilePage />} />
    <Route path="/news" element={<NewsPage />} />
    <Route path="/news/*" element={<NewsPage />} />
    <Route path="/search" element={<SearchPage />} />
    <Route path="/notifications" element={<Notifications />} />
    <Route path="/messages" element={<ChatList />} />
    <Route path="/messages/:id" element={<ChatDetail />} />
    <Route path="/apps" element={<HubPage />} />
    <Route path="/portals" element={<HubPage />} />
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
