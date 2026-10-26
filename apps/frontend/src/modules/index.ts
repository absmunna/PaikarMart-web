// Core Modules Barrel Export
export * as authModule from './auth';
export * as cartModule from './cart';
export * as walletModule from './wallet';
export * as ordersModule from './orders';
export * as productModule from './product';
export * as b2bModule from './b2b';
export * as locationModule from './location';
export * as notificationModule from './notification';
export * as searchModule from './search';
export * as adminModule from './admin';
export * as profileModule from './profile';
export * as reviewsModule from './reviews';
export * as wishlistModule from './wishlist';
export * as dealsModule from './deals';

// Direct store re-exports for convenience
export { useCartStore } from './cart';
export { useWalletStore } from './wallet';
export { useOrderStore } from './orders';
export { useLocationStore } from './location';
export { useNotificationStore } from './notification';
export { useSearchStore } from './search';
