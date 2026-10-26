import { lazy } from 'react';
import { AppRole } from '@/config/roles.config';

export type UserRole = AppRole;

export interface RouteItem {
  path: string;
  component: any;
  roles: UserRole[];
  isPublic?: boolean;
}

// Social Profile
const UserProfilePage = lazy(() => import('@/features/user-profile/UserProfilePage').then(m => ({ default: m.UserProfilePage })));

const PortalComingSoon = lazy(() => import('@/pages/PortalComingSoon').then(m => ({ default: m.default })));

// Public Pages
const Home = lazy(() => import('@/pages/Home').then(m => ({ default: m.default })));
const MarketplaceHome = lazy(() => import('@/portals/marketplace-hub/marketplace/pages/MarketplaceHome').then(m => ({ default: m.default })));
const MarketplaceSearch = PortalComingSoon;
const MarketplaceCategory = lazy(() => import('@/portals/marketplace-hub/marketplace/pages/MarketplaceCategory').then(m => ({ default: m.MarketplaceCategoryPage })));
const MarketplaceStore = PortalComingSoon;
const ProductDetail = lazy(() => import('@/portals/marketplace-hub/marketplace/pages/product-detail').then(m => ({ default: m.default })));
const Vendors = lazy(() => import('@/portals/marketplace-hub/marketplace/pages/vendors').then(m => ({ default: m.default })));
const VendorDetail = lazy(() => import('@/portals/marketplace-hub/marketplace/pages/vendor-detail').then(m => ({ default: m.default })));
const Categories = lazy(() => import('@/portals/marketplace-hub/marketplace/pages/categories').then(m => ({ default: m.default })));
const Local = lazy(() => import('@/portals/local-hub/subportals/nearby/pages/NearbyHome').then(m => ({ default: m.default })));
const Tracking = lazy(() => import('@/portals/orders/pages/OrderDetailPage').then(m => ({ default: m.default })));
const Reels = PortalComingSoon;
const Demand = lazy(() => import('@/portals/community-hub/demand/pages/DemandHome').then(m => ({ default: m.default })));
const SearchPage = PortalComingSoon;
const CreatePost = lazy(() => import('@/features/posts/pages/CreatePost').then(m => ({ default: m.default })));
const Wishlist = lazy(() => import('@/features/wishlist/pages/wishlist').then(m => ({ default: m.default })));

// Service Portals
const Services = PortalComingSoon;
const ProviderOnboarding = PortalComingSoon;
const ServiceEscrow = PortalComingSoon;
const Transport = lazy(() => import('@/portals/logistics-hub/transport/pages/TransportHome').then(m => ({ default: m.default })));
const DigitalServices = lazy(() => import('@/portals/marketplace-hub/digital/pages/DigitalProductsHome').then(m => ({ default: m.default })));
const Travel = lazy(() => import('@/portals/services-hub/travel/pages/TravelHome').then(m => ({ default: m.default })));
const Portals = lazy(() => import('@/pages/apps/PortalsPage').then(m => ({ default: m.default })));
const PKStore = PortalComingSoon;
const Dropship = PortalComingSoon;
const DropshipStore = lazy(() => import('@/portals/marketplace-hub/dropship/pages/DropshipStore').then(m => ({ default: m.default })));
const News = PortalComingSoon;
const ChatList = lazy(() => import('@/portals/messages/pages/ChatList').then(m => ({ default: m.default })));
const ChatDetail = lazy(() => import('@/portals/messages/pages/ChatDetail').then(m => ({ default: m.default })));
const B2C = lazy(() => import('@/portals/marketplace-hub/retail/pages/B2CHome').then(m => ({ default: m.B2CHome })));
const B2B = lazy(() => import('@/portals/business-hub/b2b/pages/B2BHub').then(m => ({ default: m.default })));
const Grocery = lazy(() => import('@/portals/local-hub/subportals/grocery/pages/GroceryHome').then(m => ({ default: m.GroceryHome })));
const Pharmacy = lazy(() => import('@/portals/local-hub/subportals/pharmacy/pages/PharmacyHome').then(m => ({ default: m.PharmacyHome })));
const Food = PortalComingSoon;
const Wholesale = PortalComingSoon;
const Export = lazy(() => import('@/portals/business-hub/b2b/pages/export/ExportHome').then(m => ({ default: m.ExportHome })));
const Ride = lazy(() => import('@/portals/logistics-hub/ride/pages/RideHome').then(m => ({ default: m.RideHome })));
const Rent = lazy(() => import('@/portals/logistics-hub/rent/pages/RentHome').then(m => ({ default: m.default })));
const Emergency = lazy(() => import('@/portals/logistics-hub/emergency/pages/EmergencyHome').then(m => ({ default: m.default })));
const OfferPortal = lazy(() => import('@/portals/community-hub/offer/pages/OfferHome').then(m => ({ default: m.default })));
const LivePortal = lazy(() => import('@/portals/community-hub/live/pages/LiveHome').then(m => ({ default: m.default })));
const HotelPortal = PortalComingSoon;
const JobsPortal = PortalComingSoon;
const AgriculturePortal = PortalComingSoon;
const RealEstatePortal = PortalComingSoon;
const HealthcarePortal = PortalComingSoon;
const EducationPortal = PortalComingSoon;
const FinancePortal = PortalComingSoon;
const EventsPortal = PortalComingSoon;
const AutoPortal = lazy(() => import('@/portals/marketplace-hub/auto/pages/AutoHome').then(m => ({ default: m.default })));
const ElectronicsPortal = PortalComingSoon;
const FashionPortal = PortalComingSoon;
const TelecomPortal = PortalComingSoon;
const WorkspacePortal = PortalComingSoon;

// Auth
const Login = lazy(() => import('@/pages/auth/login').then(m => ({ default: m.default })));
const Register = lazy(() => import('@/pages/auth/register').then(m => ({ default: m.default })));
const RegistrationWizard = lazy(() => import('@/pages/auth/RegistrationWizard').then(m => ({ default: m.default })));
const SellerRegister = lazy(() => import('@/pages/auth/seller-register').then(m => ({ default: m.default })));
const FactoryRegisterAuth = lazy(() => import('@/pages/auth/factory-register').then(m => ({ default: m.default })));
const WholesaleRegister = lazy(() => import('@/pages/auth/wholesale-register').then(m => ({ default: m.default })));
const RuralRegister = lazy(() => import('@/pages/auth/rural-register').then(m => ({ default: m.default })));
const ForgotPassword = lazy(() => import('@/pages/auth/forgot-password').then(m => ({ default: m.default })));
const VendorOnboarding = lazy(() => import('@/portals/seller-central/pages/onboarding').then(m => ({ default: m.default })));

// Private / Identity
// Profile is handled by SocialProfilePage
const Cart = lazy(() => import('@/features/cart/pages/CartPage').then(m => ({ default: m.CartPage })));
const Checkout = lazy(() => import('@/features/checkout/pages/advanced/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const Orders = lazy(() => import('@/portals/orders/pages/OrdersHome').then(m => ({ default: m.default })));
const Wallet = lazy(() => import('@/portals/wallet/pages/WalletDashboard').then(m => ({ default: m.WalletDashboard })));
const Notifications = lazy(() => import('@/features/notifications/pages/notifications').then(m => ({ default: m.default })));
const OrderHistory = lazy(() => import('@/portals/orders/pages/OrderHistoryPage').then(m => ({ default: m.default })));

// Logistics
const Logistics = lazy(() => import('@/portals/logistics-hub/logistics/pages/LogisticsHome').then(m => ({ default: m.default })));

// Demand Details
const DemandDetail = lazy(() => import('@/portals/community-hub/demand/pages/DemandDetailPage').then(m => ({ default: m.default })));

// Static policy & help pages
const FAQPage = lazy(() => import('@/pages/FAQPage').then(m => ({ default: m.default })));
const TermsPage = lazy(() => import('@/pages/TermsPage').then(m => ({ default: m.default })));
const ContactPage = lazy(() => import('@/pages/ContactPage').then(m => ({ default: m.default })));
const BecomeSellerPage = lazy(() => import('@/portals/seller-central/pages/BecomeSellerPage').then(m => ({ default: m.default })));
const SellerRulesPage = lazy(() => import('@/pages/SellerRulesPage').then(m => ({ default: m.default })));
const QNAPage = lazy(() => import('@/pages/QNAPage').then(m => ({ default: m.default })));
const Settings = lazy(() => import('@/pages/settings').then(m => ({ default: m.default })));
const ProductComments = lazy(() => import('@/portals/marketplace-hub/marketplace/pages/product-comments').then(m => ({ default: m.default })));

// Seller
const SellerDashboard = lazy(() => import('@/portals/seller-central/pages/Dashboard').then(m => ({ default: m.default })));

// Admin
const AdminGovernance = lazy(() => import('@/portals/admin/pages/dashboards/AdminDashboard').then(m => ({ default: m.AdminDashboard })));

// Brand Shops & PK Shop
const BrandShops = lazy(() => import('@/portals/marketplace-hub/brand-shops/pages/BrandShopsHome').then(m => ({ default: m.default })));

// Factory Portal
const FactoryHome = PortalComingSoon;
const FactoryRegister = PortalComingSoon;

// Export sub-pages
const ExportMarketplace = PortalComingSoon;
const ExportFactoryDetail = lazy(() => import('@/portals/business-hub/b2b/pages/export/FactoryDetailPage').then(m => ({ default: m.default })));

// Wholesale manage
const WholesaleManage = PortalComingSoon;

// Digital Products
const DigitalProducts = lazy(() => import('@/portals/marketplace-hub/digital/pages/DigitalProductsHome').then(m => ({ default: m.default })));

// Video
const VideoLibrary = PortalComingSoon;
const VideoDetail = PortalComingSoon;
const VideoPackage = PortalComingSoon;

// Order Detail
const OrderDetail = lazy(() => import('@/portals/orders/pages/OrderDetailPage').then(m => ({ default: m.default })));


export const ROUTES: RouteItem[] = [
  { path: '/', component: Home, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/marketplace', component: MarketplaceHome, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/marketplace/search', component: MarketplaceSearch, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/marketplace/category/:slug', component: MarketplaceCategory, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/marketplace/store/:id', component: MarketplaceStore, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/marketplace/product/:id', component: ProductDetail, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/marketplace/product/:id/comments', component: ProductComments, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/vendors', component: Vendors, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/vendors/:id', component: VendorDetail, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/categories', component: Categories, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/local', component: Local, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/reels', component: Reels, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/demand', component: Demand, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/search', component: SearchPage, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/create', component: CreatePost, roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: false },
  { path: '/pk-store', component: PKStore, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/dropship', component: Dropship, roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: false },
  { path: '/dropship/store/:id', component: DropshipStore, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/news', component: News, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/messages', component: ChatList, roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: false },
  { path: '/messages/:conversationId', component: ChatDetail, roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: false },
  { path: '/retail', component: B2C, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/b2b', component: B2B, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/grocery', component: Grocery, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/pharmacy', component: Pharmacy, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/food', component: Food, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/wholesale', component: Wholesale, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/export', component: Export, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/ride', component: Ride, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/rent', component: Rent, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/emergency', component: Emergency, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/offer', component: OfferPortal, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/live', component: LivePortal, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/hotel', component: HotelPortal, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/jobs', component: JobsPortal, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/agriculture', component: AgriculturePortal, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/real-estate', component: RealEstatePortal, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/healthcare', component: HealthcarePortal, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/education', component: EducationPortal, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/finance', component: FinancePortal, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/events', component: EventsPortal, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/auto', component: AutoPortal, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/electronics', component: ElectronicsPortal, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/fashion', component: FashionPortal, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/telecom', component: TelecomPortal, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/brand-shops', component: BrandShops, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/pk-shop', component: PKStore, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/export/marketplace', component: ExportMarketplace, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/export/factory/:id', component: ExportFactoryDetail, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/digital-products', component: DigitalProducts, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/video', component: VideoLibrary, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/video/:id', component: VideoDetail, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/video/package/:id', component: VideoPackage, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/services', component: Services, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/services/onboarding', component: ProviderOnboarding, roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider'] },
  { path: '/services/escrow/:orderId', component: ServiceEscrow, roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider'] },
  { path: '/transport', component: Transport, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/digital-services', component: DigitalServices, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/travel', component: Travel, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/portals', component: Portals, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/workspace', component: WorkspacePortal, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  
  { path: '/auth/login', component: Login, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/auth/register', component: Register, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/auth/wizard', component: RegistrationWizard, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/auth/seller-register', component: SellerRegister, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/auth/factory-register', component: FactoryRegisterAuth, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/auth/wholesale-register', component: WholesaleRegister, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/auth/rural-register', component: RuralRegister, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/auth/forgot-password', component: ForgotPassword, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/seller/onboarding', component: VendorOnboarding, roles: ['seller', 'business', 'admin'], isPublic: false },
  
  { path: '/profile', component: UserProfilePage, roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider'] },
  { path: '/u/:userId', component: UserProfilePage, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/u', component: UserProfilePage, roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider'] },
  { path: '/cart', component: Cart, roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider'] },
  { path: '/checkout', component: Checkout, roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider'] },
  { path: '/orders', component: Orders, roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider'] },
  { path: '/order-history', component: OrderHistory, roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider'] },
  { path: '/orders/track/:orderId', component: Tracking, roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider'] },
  { path: '/wallet', component: Wallet, roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider'] },
  { path: '/wishlist', component: Wishlist, roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/notifications', component: Notifications, roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider'] },
  { path: '/orders/:id', component: OrderDetail, roles: ['buyer', 'user', 'seller', 'business', 'admin', 'service_provider'] },
  
  // Logistics
  { path: '/logistics', component: Logistics, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  
  // Demands
  { path: '/demand/:id', component: DemandDetail, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  
  // Static utility pages
  { path: '/faq', component: FAQPage, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/terms', component: TermsPage, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/contact', component: ContactPage, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/become-seller', component: BecomeSellerPage, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/seller-rules', component: SellerRulesPage, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/qna', component: QNAPage, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  { path: '/settings', component: Settings, roles: ['buyer', 'guest', 'user', 'seller', 'business', 'admin', 'service_provider'], isPublic: true },
  
  { path: '/wholesale/manage', component: WholesaleManage, roles: ['seller', 'business', 'admin'] },
  { path: '/factory', component: FactoryHome, roles: ['seller', 'business', 'admin'] },
  { path: '/factory/register', component: FactoryRegister, roles: ['seller', 'business', 'admin'] },

  { path: '/seller/*', component: SellerDashboard, roles: ['seller', 'business', 'admin'] },
  { path: '/admin/*', component: AdminGovernance, roles: ['admin'] },
];
