# PaikarMart Final Modular Monorepo Blueprint

**অবস্থা:** Proposed target architecture ও path migration plan; implementation/rename শুরু হয়নি।  
**Audit base:** বর্তমান project-এর source + `PaikarMart-web-main` snapshot; goal ও rules হিসেবে [MASTER_SPECIFICATION](./MASTER_SPECIFICATION.md), [ARCHITECTURE_AND_MODULARITY](./ARCHITECTURE_AND_MODULARITY.md), [DEVELOPMENT_STANDARDS](./DEVELOPMENT_STANDARDS.md), [DESIGN_SYSTEM_AND_UI](./DESIGN_SYSTEM_AND_UI.md), [DATABASE_AND_DEPLOYMENT](./DATABASE_AND_DEPLOYMENT.md), [USER_AND_VENDOR_GUIDE](./USER_AND_VENDOR_GUIDE.md), [LOGISTICS_ECOSYSTEM_BLUEPRINT](./LOGISTICS_ECOSYSTEM_BLUEPRINT.md) এবং দুই-project audit [PROJECT_COMPARISON_AUDIT](./PROJECT_COMPARISON_AUDIT_2026-11-17.md) পড়া হয়েছে।

## 1. Product goal ও architecture decision

PaikarMart-এর কেন্দ্রীয় goal হলো এক Firebase identity-তে social discovery, retail/B2B commerce, local service, logistics, seller/fleet work, account ও governance capability এক করা। Marketplace ও Services হলো mixed-feed hub; portal হলো সেই hub বা অন্য navigation entry থেকে খোলা পূর্ণ page; feature হলো UI-independent business/data logic; role হলো permission boundary—আলাদা user copy বা আলাদা codebase নয়।

### একাধিক document-এ যে boundary আলাদা লেখা ছিল, এই প্রস্তাবে সেটি এক করা হয়েছে

1. **একটি canonical portal page:** page component থাকবে `apps/frontend/src/portals/<portal-id>/`-এ। Hub-এর folder-এ page copy থাকবে না।
2. **Hub শুধু composition/navigation owner:** `hubs/<hub-id>/` mixed feed, portal rail, categories, registry placement ও loading/empty/error state রাখবে; portal page-কে route অনুযায়ী mount করবে।
3. **একটি portal একাধিক hub-এ থাকতে পারবে:** দ্বিতীয় hub শুধু registry placement/link যোগ করবে; component, API, schema বা page duplicate করবে না।
4. **প্রতিটি global destination-এ direct full-page route:** portal link URL বদলাবে এবং browser Back/Forward/shareable deep link কাজ করবে। Hub child নির্বাচন করলে একই hub shell-এ full content area-তে page দেখাবে। Modal/Drawer থাকবে কেবল contextual ছোট কাজের জন্য—variant picker, confirm, quick filter, ছোট wizard step ইত্যাদি।
5. **এক user, এক identity, বহু capability/store:** consumer, seller, service provider, rider/fleet, creator capability একই account-এর role/membership দিয়ে নির্ধারিত হবে। Permission check backend-এ enforce হবে; UI guard শুধু UX, security authority নয়।
6. **Shared UI বনাম business card আলাদা:** button/card/dialog/layout primitive একবার; retail, wholesale, service, inventory card-এর ব্যবসায়িক আচরণ আলাদা domain component-এ থাকবে এবং shared primitive compose করবে।
7. **Mock naming সত্য প্রকাশ করবে:** fake `CURRENT_USER` বা production seed চলবে না। Development/test fixture এবং deliberate offline fallback আলাদা folder/feature flag-এ থাকবে; rename করলেই data real হয় না।
8. **Database truth:** Firebase Auth identity; Supabase/PostgreSQL relational/business state; Firebase Storage শুধু অনুমোদিত media/realtime। SQL migration-ই canonical schema history হবে—Prisma schema আলাদা করে hand-maintained দ্বিতীয় truth হবে না। Prisma রাখা হবে কেবল বাস্তব backend runtime adopter হিসেবে যাচাই ও অনুমোদনের পর।

## 2. প্রস্তাবিত root-to-leaf target structure

নিচের নামগুলো proposed destination; এগুলো এখনো create/rename করা হয়নি। React UI page `portals/`-এ, business logic `features/`-এ, hub orchestration `hubs/`-এ থাকবে।

```text
PaikarMart/
├── package.json                         # npm workspaces + root scripts
├── package-lock.json                    # একমাত্র lockfile; bun.lock বাদ দেওয়ার আগে migration verify
├── .env.example                         # variable names/placeholder only
├── .gitignore
├── README.md
├── firebase.json                        # Hosting SPA config
├── firestore.rules                      # Firebase server/client data access policy
├── storage.rules                        # private/public media policy
├── render.yaml                          # API/full-stack runtime
├── vercel.json                          # frontend/API routing; একটিই intended config
├── apps/
│   ├── frontend/
│   │   ├── package.json
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── main.tsx
│   │       ├── index.css
│   │       ├── app/
│   │       │   ├── App.tsx                # provider + router mount; domain state নয়
│   │       │   ├── router/
│   │       │   │   ├── routeManifest.tsx  # এক route source-of-truth
│   │       │   │   ├── routeIds.ts
│   │       │   │   ├── legacyRedirects.tsx
│   │       │   │   └── routeLoaders.ts
│   │       │   ├── providers/AppProviders.tsx
│   │       │   ├── guards/
│   │       │   │   ├── RequireAuth.tsx
│   │       │   │   ├── RequirePermission.tsx
│   │       │   │   └── RequireVendorMembership.tsx
│   │       │   ├── shell/AppShell.tsx
│   │       │   └── errors/RouteErrorPage.tsx
│   │       ├── design-system/
│   │       │   ├── tokens/{colors,typography,spacing,radius}.css
│   │       │   ├── components/{Button,Card,Input,Dialog,Drawer,Toast,Skeleton}/
│   │       │   └── layouts/{PageFrame,PageHeader,ResponsiveGrid,AppNavigation}/
│   │       ├── features/
│   │       │   ├── auth/{api,components,hooks,types}/
│   │       │   ├── account/{api,components,hooks,types}/
│   │       │   ├── catalog/{api,domain,hooks,types}/
│   │       │   ├── commerce/{cart,checkout,pricing}/
│   │       │   ├── b2b/{api,components,hooks,types}/
│   │       │   ├── inventory/{api,components,hooks,types}/
│   │       │   ├── vendors/{api,onboarding,permissions,types}/
│   │       │   ├── services/{api,booking,types}/
│   │       │   ├── logistics/{api,quote,tracking,types}/
│   │       │   ├── social/{api,feed,posts,demand,types}/
│   │       │   ├── orders/{api,tracking,types}/
│   │       │   ├── wallet-escrow/{api,ledger,types}/
│   │       │   ├── messaging/{api,components,store,types}/
│   │       │   ├── notifications/{api,store,types}/
│   │       │   ├── location/{api,hooks,types}/
│   │       │   ├── search/{api,components,types}/
│   │       │   └── uploads/{api,validation,types}/
│   │       ├── hubs/
│   │       │   ├── marketplace/
│   │       │   │   ├── MarketplaceHubPage.tsx
│   │       │   │   ├── MarketplaceHubLayout.tsx
│   │       │   │   ├── registry.ts
│   │       │   │   ├── components/{PortalRail,CategoryRail,MixedProductFeed}/
│   │       │   │   └── hooks/useMarketplaceFeed.ts
│   │       │   ├── services/
│   │       │   │   ├── ServicesHubPage.tsx
│   │       │   │   ├── ServicesHubLayout.tsx
│   │       │   │   ├── registry.ts
│   │       │   │   ├── components/{PortalRail,CategoryRail,MixedServiceFeed}/
│   │       │   │   └── hooks/useServicesFeed.ts
│   │       │   ├── community/{CommunityHubPage,registry.ts}
│   │       │   └── shared/{PortalOutlet,HubFeedCard,HubFeedItem.types.ts}
│   │       ├── portals/
│   │       │   ├── social-feed/pages/SocialFeedPage.tsx
│   │       │   ├── explore/pages/ExplorePage.tsx
│   │       │   ├── marketplace/
│   │       │   │   ├── retail/pages/RetailPortalPage.tsx
│   │       │   │   ├── wholesale/pages/WholesalePortalPage.tsx
│   │       │   │   ├── grocery/pages/GroceryPortalPage.tsx
│   │       │   │   ├── pharmacy/pages/PharmacyPortalPage.tsx
│   │       │   │   ├── brand-shops/pages/BrandShopsPage.tsx
│   │       │   │   ├── digital/pages/DigitalGoodsPage.tsx
│   │       │   │   └── product/pages/ProductDetailsPage.tsx
│   │       │   ├── services/
│   │       │   │   ├── local-services/pages/LocalServicesPage.tsx
│   │       │   │   ├── food-delivery/pages/FoodDeliveryPage.tsx
│   │       │   │   └── travel/pages/TravelAndStaysPage.tsx
│   │       │   ├── logistics/
│   │       │   │   ├── ride/pages/RidePage.tsx
│   │       │   │   ├── transport/pages/TransportPage.tsx
│   │       │   │   ├── rent-cargo/pages/RentAndCargoPage.tsx
│   │       │   │   ├── emergency/pages/EmergencyPage.tsx
│   │       │   │   └── fleet/pages/FleetPartnerPage.tsx
│   │       │   ├── orders/pages/{OrdersPage,OrderDetailsPage,GuestOrderTrackerPage}.tsx
│   │       │   ├── seller-central/
│   │       │   │   ├── pages/{SellerHomePage,InventoryPage,ListingEditorPage,SalesOrdersPage}.tsx
│   │       │   │   ├── pages/settings/{StorefrontPage,StoreHoursPage,PayoutPage,FulfillmentPage}.tsx
│   │       │   │   └── components/{StoreSwitcher,VendorOnboardingWizard}.tsx
│   │       │   ├── account/
│   │       │   │   ├── profile/pages/{ProfilePage,PublicStorefrontPage,AddressesPage}.tsx
│   │       │   │   ├── settings/pages/{PreferencesPage,SecurityPage,NotificationsPage}.tsx
│   │       │   │   └── auth/pages/{LoginPage,RegisterPage,PasswordResetPage}.tsx
│   │       │   ├── wallet/pages/WalletPage.tsx
│   │       │   ├── messages/pages/MessagesPage.tsx
│   │       │   ├── notifications/pages/NotificationsPage.tsx
│   │       │   ├── creator/pages/CreatorStudioPage.tsx
│   │       │   ├── governance/pages/{AdminPage,KycReviewPage,CatalogReviewPage}.tsx
│   │       │   ├── guide/pages/GuidePage.tsx
│   │       │   └── not-found/pages/NotFoundPage.tsx
│   │       ├── shared/{constants,hooks,utils}/  # cross-domain only; API DTO নয়
│   │       ├── dev/fixtures/                    # dev/test only; production import নিষিদ্ধ
│   │       └── assets/
│   └── backend/
│       ├── package.json
│       ├── server.ts                           # deployment entry path স্থির রাখুন
│       ├── config/{env,firebaseAdmin,supabaseAdmin}.ts
│       ├── middleware/{requireAuth,requirePermission,rateLimit,errorHandler}.ts
│       ├── modules/
│       │   ├── auth/{routes,controller,service,repository,schemas,tests}/
│       │   ├── profile/{routes,controller,service,repository,schemas,tests}/
│       │   ├── catalog/{routes,controller,service,repository,schemas,tests}/
│       │   ├── vendors/{routes,controller,service,repository,schemas,tests}/
│       │   ├── inventory/{routes,controller,service,repository,schemas,tests}/
│       │   ├── orders/{routes,controller,service,repository,schemas,tests}/
│       │   ├── b2b/{routes,controller,service,repository,schemas,tests}/
│       │   ├── services/{routes,controller,service,repository,schemas,tests}/
│       │   ├── logistics/{routes,controller,service,repository,schemas,tests}/
│       │   ├── social/{routes,controller,service,repository,schemas,tests}/
│       │   ├── messaging/{routes,controller,service,repository,schemas,tests}/
│       │   ├── notifications/{routes,controller,service,repository,schemas,tests}/
│       │   ├── wallet/{routes,controller,service,repository,schemas,tests}/
│       │   ├── escrow/{routes,controller,service,repository,schemas,tests}/
│       │   └── governance/{routes,controller,service,repository,schemas,tests}/
│       └── tests/{integration,security}/
├── packages/
│   ├── shared/
│   │   ├── package.json
│   │   └── src/{auth,permissions,commerce,services,logistics,orders,api,index}.ts
│   └── database/
│       ├── package.json
│       └── src/database.types.ts              # generated from Supabase schema; no duplicate hand schema
├── supabase/
│   ├── migrations/                             # ordered canonical SQL + RLS changes
│   ├── seed.dev.sql                            # explicit local/dev only, no real customer data
│   └── config.toml
└── documents/                                  # specs, guides, runbooks, audit records
```

`package.json` root-এ npm workspaces (`apps/*`, `packages/*`) ও root orchestration scripts রাখা হবে; app manifests শুধু package-owned dependency ঘোষণা করবে। Root-এ একটি lockfile থাকবে। এই package-manager/workspace পরিবর্তন deployment config update না করে করা যাবে না; তাই এটি path-migration-এর আলাদা gated step।

## 3. Hub, portal, route ও deep-link contract

### Ownership map

| Concern | একমাত্র owner | কী রাখবে |
|---|---|---|
| URL/guard/layout selection | `frontend/src/app/router/routeManifest.tsx` | exact route, alias redirects, auth/permission wrappers, not-found |
| Mixed-feed surface | `frontend/src/hubs/<hub>/` | feed query, feed states, child portal rail, hub-level filter |
| Full portal page | `frontend/src/portals/<portal-id>/` | standalone page UI, portal-specific sections/actions |
| Reusable business logic | `frontend/src/features/<domain>/` | API client, data types, hooks/stores, selectors, validation |
| Shared primitive | `frontend/src/design-system/` | Button, Card, Dialog, Drawer, page spacing, typography/token |
| Role/DTO contract | `packages/shared/src/` | role IDs, permission keys, API request/response schemas, domain enums |
| Authorization/data mutation | `backend/modules/<domain>/` | Firebase identity mapping, permission/owner check, DB transaction |

### Registry shape

Hub registry-তে React page-এর দ্বিতীয় copy বা business logic থাকবে না। One central portal definition page ও capability জানাবে; hub placement শুধু সেটি কোথায় দেখাবে তা জানাবে:

```ts
// PortalDefinition: one owner for one page component
{ id: 'ride', page: lazy(() => import('@/portals/logistics/ride/pages/RidePage')),
  permissions: ['logistics:book'], categorySet: 'ride', feedKinds: ['ride', 'offer'] }

// Hub placement: references id; never copies page implementation
{ hubId: 'services', portalId: 'ride', order: 4, labelKey: 'portal.ride' }
```

একটি portal অন্য hub-এও দেখাতে হলে দ্বিতীয় `HubPortalPlacement` record হবে, নতুন page component নয়। উদাহরণ: Ride page থাকবে শুধু `portals/logistics/ride/RidePage.tsx`-এ; Services hub rail থেকে `/hub/services/ride`-এ একই page খুলবে; প্রয়োজন হলে logistics-focused directory থেকেও একই `portalId` link হবে। Source entity-র feed card-এ শুধু `entityType + entityId` reference যাবে—দ্বিতীয় mock product/service object নয়।

### Canonical page routes

| Route | Full page/content owner | Access |
|---|---|---|
| `/portal/social` | `portals/social-feed/pages/SocialFeedPage` | read public; post/reaction requires auth |
| `/portal/explore` | `portals/explore/pages/ExplorePage` | public |
| `/hub/marketplace` | `hubs/marketplace/MarketplaceHubPage` mixed feed | public |
| `/hub/marketplace/:portalId` | registry-selected marketplace portal full content inside same hub shell | public; RFQ action auth + vendor permissions as needed |
| `/hub/marketplace/product/:productId` | `portals/marketplace/product/pages/ProductDetailsPage` | public read; cart/checkout rules apply |
| `/hub/services` | `hubs/services/ServicesHubPage` mixed feed | public |
| `/hub/services/:portalId` | registry-selected local service, food, travel or logistics page | public read; booking requires auth |
| `/portal/orders`, `/portal/orders/:orderId` | orders list/detail pages | auth + record ownership |
| `/portal/orders/track/:guestToken` | `GuestOrderTrackerPage` | signed, scoped, expiring guest token |
| `/portal/seller/stores/:storeId/*` | seller-central pages | auth + active membership + permission for that store |
| `/portal/profile`, `/u/:handle`, `/store/:storeId` | private profile / public storefront pages | owner-auth vs zero-PII public projection |
| `/portal/messages`, `/portal/wallet`, `/portal/notifications` | independent full-page destinations | auth; backend scopes by identity |
| `/settings/preferences` | preferences page | public preferences if safe |
| `/settings/security` | account security page | auth |
| `/governance/*` | admin/KYC/catalog moderation pages | server-verified governance permission |
| `/login`, `/register`, `/forgot-password` | independent auth pages | public |
| `/checkout` | checkout page/flow | guest or auth according to checkout policy |

`/portal/marketplace`, `/portal/services`, `/portal/wholesale`, `/portal/transit`, current aliases ও পুরনো link first-party redirect হিসেবে থাকবে। `product/:id`-এর মতো specific path generic `:portalId` route-এর আগে resolve হবে। Portal button হবে router `Link`/navigation helper, শুধু transient local `setState` নয়; hub rail selection URL/back/share state-ও sync করবে।

### Page বনাম modal rule

- Dedicated route: bottom/side navigation, portal entry, product/store profile, orders & detail, inventory/listing editor, account pages, seller settings, messages, wallet, governance, auth, checkout destinations.
- Contextual dialog/drawer: product variant/quantity picker, quick add-to-cart confirmation, location selector, short RFQ/booking step, destructive confirmation, small notification preview.
- একই full page-কে modal ও route দু’ভাবে render করতে হলে দুই shell-এ reuse করা হবে; duplicate business state/API call তৈরি করা যাবে না। Product detail-এ inline quick-buy flow থাকলে সেটি বজায় থাকবে; সব CTA-কে নতুন route বানানো হবে না।

## 4. Role-based folder, page ও permission model

Role folder বানিয়ে একই product/order/profile component copy করা হবে না। Page owner domain অনুযায়ী; route guard permission অনুযায়ী। `1 Firebase UID → 1 profile`; এক profile-এর বহু store membership/business role সম্ভব।

| Actor/capability | Page roots | Guard/authority |
|---|---|---|
| Guest / consumer | hubs, public product/store, social read, explore, guest checkout/tracker | guest token checkout/order tracking-এর জন্য scoped; private profile/order নয় |
| Signed-in consumer | profile, saved addresses, orders, messages, wallet, settings security, post/booking/order actions | verified Firebase UID → `profiles.auth_uid` mapping; object owner check |
| Retail merchant / wholesaler | Seller Central inventory, listings, own store, sales, RFQ, payout/settings | `vendor_memberships` + storeId + approved KYC + per-action permission; client role flag যথেষ্ট নয় |
| Service provider / creator | service offers/slots বা creator publishing page | corresponding active business membership/permission; consumer capability বজায় থাকে |
| Rider / fleet owner | Fleet Partner page, assigned jobs, vehicle/availability/POD | verified driver/fleet membership; assignment-scoped reads and transitions |
| Moderator / admin / super-admin | governance, catalog/KYC review, disputes | server-side DB/RBAC claim + audit; UI-only route guard নয় |

Role/permission strings current frontend `types/index.ts`-এ, legacy frontend `core/config/roles.config`-এ এবং backend auth-এ ছড়িয়ে আছে। Target canonical enums/permission keys `packages/shared/src/auth.ts` ও `permissions.ts`-এ; backend frontend source import করবে না। PII, order, money, role/KYC access backend + Supabase policy-তে independently verified হবে।

## 5. Current project-এর source → target path migration map

এটি high-impact implementation path map—file existence দেখে “সব 80–90% reusable” ধরে নেওয়া হয়নি। Exact component usage/import graph, API payload এবং screenshot check migration-এর আগে তৈরি হবে।

| Existing path | Target path / action |
|---|---|
| [apps/frontend/src/App.tsx](../apps/frontend/src/App.tsx) | সরাসরি rename নয়: route table → `src/app/router/routeManifest.tsx`; root/provider → `src/app/App.tsx`; shell/nav orchestration → `src/app/shell/AppShell.tsx`; commerce/auth/domain state নিজ feature store-এ। |
| [apps/frontend/src/main.tsx](../apps/frontend/src/main.tsx) | entrypoint থাকে; `AppProviders`/`App` mount only। |
| `apps/frontend/src/components/layout/*` | one shell owner `design-system/layouts`/`app/shell`: keep chosen `TopNavbar`, `BottomNav`, `DesktopLeftNav`, `DesktopRightSidebar`, `SidebarDrawer`; `UnifiedSidebar`-এর duplicate duties usage audit-এর পরে merge/retire। |
| `apps/frontend/src/components/shared/*` | generic UI → design-system; LocationPicker → `features/location`; ErrorBoundary/Skeleton/ScrollToTop → app/design-system। Deployment/admin/business-specific modal global shared নয়। |
| `apps/frontend/src/contexts/*` | এক `AppProviders` ও theme/language/location/settings provider owner; auth provider `features/auth`; provider duplicate তৈরি নয়। |
| `apps/frontend/src/types/index.ts` | shared API/domain types → `packages/shared/src/*`; component-only UI types → owner feature/portal-এর `types.ts`। এক giant `index.ts` নয়। |
| `apps/frontend/src/lib/firebase.ts` | client public Firebase config → `features/auth/firebaseClient.ts`; Firebase Admin শুধু backend config-এ। |
| `apps/frontend/src/lib/supabase.ts` | public browser client/helper → `app/config/supabasePublicClient.ts` অথবা প্রয়োজনমতো feature API; service-role admin client কখনো frontend-এ নয়। |
| `apps/frontend/src/lib/masterCatalog.ts` | pure catalog selector/domain logic → `features/catalog/domain/`; demo arrays → `src/dev/fixtures/catalog.fixtures.ts`; API client → `features/catalog/api/`. |
| `apps/frontend/src/data/portalsData.ts` | current portal label/navigation data → typed portal/hub registry; routes-এর দ্বিতীয় source হবে না। |
| `apps/frontend/src/data/bangladeshLocations.ts` | `features/location/data/bangladeshLocations.ts`। |
| `apps/frontend/src/hubs/marketplace-hub/*` | নামের `-hub` suffix বাদ দিয়ে `src/hubs/marketplace/*`; `MarketplaceHub.tsx` wrapper নয়, real hub page/layout/feed/registry compose করবে। |
| `apps/frontend/src/hubs/services-hub/*` | `src/hubs/services/*`; `servicePortals.ts` placement data-তে বদলাবে, each entry-র `entryRoute` same hub path নয়—portal ID path resolver হবে। |
| `apps/frontend/src/hubs/shared/*` | `src/hubs/shared`-এ এক feed card contract; feed item-এ `{entityType, entityId}`; card action owner page/API-তে। |
| `apps/frontend/src/portals/marketplace/pages/CommercePortal.tsx` | `portals/marketplace/retail/pages/RetailPortalPage.tsx`; hub feed-এর duplicate variant হলে hub mixed feed থেকে source নেবে। |
| `apps/frontend/src/portals/marketplace/pages/ProductDetailsLanding.tsx` | `portals/marketplace/product/pages/ProductDetailsPage.tsx`; seller/variant/stock data catalog feature API থেকে। |
| `apps/frontend/src/portals/wholesale-hub/pages/WholesalePortal.tsx` | `portals/marketplace/wholesale/pages/WholesalePortalPage.tsx`; RFQ/tier pricing logic `features/b2b`-এ। |
| `apps/frontend/src/portals/services-hub/pages/NearbyServicesPortal.tsx` | `portals/services/local-services/pages/LocalServicesPage.tsx`; booking/radius/data calls `features/services`/`features/location`-এ। |
| `apps/frontend/src/portals/transit-logistics/*` | canonical page branches `portals/logistics/{ride,transport,rent-cargo,emergency,fleet}`; quote/tracking/state `features/logistics`-এ। Transit compatibility URL redirect। |
| `apps/frontend/src/portals/seller-central/*` + `features/inventory/*` + `features/vendors/*` | route/page seller-central-এ; listing CRUD `features/inventory`; membership/KYC/store `features/vendors`; seller types একাধিক store membership-এ। |
| `apps/frontend/src/portals/user-profile/*` + `features/auth/services/authProfileApi.ts` | owner profile, address, public storefront আলাদা route/page but one `features/account` API; address duplicate page consolidate হবে। |
| `apps/frontend/src/portals/social-feed/*` + `features/messaging/*` | social page/component owner `portals/social-feed`; feed/action/data `features/social`; message route নতুন `portals/messages/pages/MessagesPage.tsx`; AI chat adapter `features/messaging`। |
| `apps/frontend/src/portals/orders-hub/*`, `wallet/*`, `notifications-center/*` | dedicated page roots একই domain name-এ; shared history/store `features/orders`, `features/wallet-escrow`, `features/notifications`। Guest tracker independent child route। |
| [apps/backend/server.ts](../apps/backend/server.ts) | deploy entry path স্থির; শুধু middleware setup ও এক route registry mount করবে। |
| `apps/backend/{auth,catalog,orders,retail,vendors,wallet,escrow,logistics,messaging,wholesale}/*` | `apps/backend/modules/<domain>/{routes,controller,service,repository,schemas,tests}` vertical slices; এক file-এ route + DB + business rule নয়। |
| `apps/backend/services/dbService.ts` | `modules/<owner>/repository/`-তে persistence operations; shared database client শুধু backend config। |
| `packages/shared/src/index.ts` | public exports-সহ ছোট domain files; frontend/backend common schemas, roles, permissions, DTO। |
| `packages/database/prisma/schema.prisma` | SQL schema-র সঙ্গে parity audit ছাড়া আর feature যোগ নয়; target canonical versioned SQL migration + generated TS DB types। |
| `supabase/schema.sql` | existing schema-কে baseline হিসেবে versioned `supabase/migrations/<timestamp>_*.sql`-এ আনা; live DB data migration আলাদা approved task। |

## 6. Legacy snapshot থেকে বাছাই করে নেওয়ার map

| Legacy path family | Target treatment |
|---|---|
| `apps/frontend/src/design-system/**` | Button/Input/Card/dialog/nav/theme tokens-এর selected pattern audit করে `apps/frontend/src/design-system/`-এ port; 10 theme ও duplicate nav/layout একসাথে copy নয়। |
| `apps/frontend/src/modules/<domain>/**` | headless API/store/selector উপযোগী হলে matching `features/<domain>/**`-এ port; page-জাতীয় UI হলে `portals/<canonical-portal>/pages/`-এ; একই code দু জায়গায় নয়। |
| `apps/frontend/src/portals/marketplace-hub/{retail,wholesale,grocery,pharmacy,brand-shops,digital}/**` | missing portal screen/unique validated sections হলে current canonical portal folder-এ compare-and-compose; `local-hub/subportals/grocery` ও duplicate `marketplace`/`wholesale` screens থেকে একটি implementation নির্বাচন। |
| `apps/frontend/src/portals/{services-hub,logistics-hub,local-hub}/**` | owner page target হবে services/logistics portal; hubs-এ শুধু registry/link; logistics subportal behavior এক জায়গা। |
| `apps/frontend/src/modules/portals/**`, `src/pages/**`, `src/app/router/{AppRoutes,index}.tsx` | route/page alternatives; active behavior ও import graph compare করে canonical route থেকে প্রয়োজনীয় UI/logic আনুন; route file সরাসরি copy নয়। |
| `apps/frontend/src/modules/{auth,profile,seller,product,orders,wallet,feed,chat,logistics}/**` | domain behavior contract ধরে targeted port; `modules` folder root-এ রেখে parallel feature module তৈরি করা যাবে না। |
| `apps/backend/modules/<domain>/{routes,controller}.ts` | service/repository boundaries ও security test intent reference; active backend API/DB contract-এর সঙ্গে মিলিয়ে selected implementation only। |
| `apps/backend/api/routes/**`, `database/connection.ts`, duplicate auth middlewares | parallel route/db/auth abstraction target-এ নয়; unique endpoint/middleware behavior identify করে canonical backend module-এ port। |
| `packages/database/prisma/schema.prisma` ও 3 migration | history ও design reference; current Supabase schema-র table/identity model mapping ছাড়া copy নয়। |
| root `render.yaml`, root + `apps/frontend/vercel.json`, `supabase/sql/**` | intended deploy root/RLS behavior validate করে একটি target config/migration path; duplicate config choose না করে normalize। |

Legacy project-এ 1,054 non-generated file পাওয়া মানেই 1,054 reusable implementation নয়। `PROJECT_ARCHITECTURE_AUDIT_AND_PLAN.md`-এর source entrypoint-সংক্রান্ত claim বাস্তব `main.tsx`-এর সঙ্গে মেলে না; প্রতিটি candidate file usage graph ও runtime contract দিয়ে validate করতে হবে।

## 7. Shared, dedicated, similar-business component classification

| Classification | Canonical owner | Reuse rule |
|---|---|---|
| App shell/navigation | `design-system/layouts` + one `AppShell` | one mobile BottomNav, one desktop navigation set, one SidebarDrawer; mobile/desktop responsive variant একই shell contract |
| UI primitives | `design-system/components` | domain-neutral props; business state/API import নয় |
| Mixed-feed tile | `hubs/shared/HubFeedCard` | polymorphic type switch by `entityType`; uses correct feature-specific card body, one source entity |
| Product card family | `features/catalog/components` base + marketplace/wholesale/inventory compositions | retail Buy/Add actions, wholesale MOQ/RFQ, seller inventory Edit/Stock different component compositions; giant prop-heavy universal card নয় |
| Store/profile | `portals/account/profile` view + `features/account` API | own profile/PublicStorefront is same data projection with owner/public permissions; no SellerStorefront/PublicStorefront copies |
| Address editor | `portals/account/profile/pages/AddressesPage` + account feature | settings only links/routes to same address page; SavedAddressesTab + SavedAddressesPage duplicate behavior eliminate |
| Messaging | one `features/messaging` transport/store and one full `portals/messages` page | quick chat can use same conversation view in drawer; no second message state/data set |
| Orders/tracking | `features/orders` + `portals/orders-hub` | buyer/seller/guest tabs have role/ownership-specific projections on same order entities |
| Vendor workspace | `features/vendors` membership/store selector + `portals/seller-central` | role-specific dashboard section but shared product/store/order entity; multiple store types do not fork seller account code |
| Portal entry/category rail | hub’s rail using registries | categories owned by active portal definition; no duplicate hardcoded arrays in page and hub |
| Full PageHeader/Back | `design-system/layouts/PageHeader` | one contextual back action only on nested pages; root hub/page shows no fake duplicate back controls |

“Same look” component shared; “same word” business process shared only when validation/permissions/data contract same. e.g., Retail Add to Cart is not Wholesale RFQ; public Store details is not Seller Central editing.

## 8. Mock, seed ও demo file naming/rehome plan

নিচের কাজ rename-only নয়—fixture এবং business logic আলাদা করতে হবে। Fake consumer identity production path থেকে সরাতে হবে।

| Existing file/data | Target name/path | Required treatment |
|---|---|---|
| `apps/frontend/src/data/mockData.ts` (`CURRENT_USER`, commerce, stories, posts, orders, rides, notifications) | `apps/frontend/src/dev/fixtures/{commerce,stories,social,orders,logistics,notifications}.fixtures.ts` | giant mixed file split; `CURRENT_USER` fixture delete, `AuthContext`/profile API থেকে verified user; fixtures শুধুই dev/test import boundary। |
| `apps/frontend/src/lib/masterCatalog.ts` | logic → `features/catalog/domain/`; arrays → `src/dev/fixtures/catalog.fixtures.ts` | `INITIAL_MASTER_*` copy/mock arrays এক shared catalog fixture source; actual product query API-first। |
| `features/messaging/data/initialMessagingData.ts` | `features/messaging/testing/messaging.fixtures.ts` | production `features/messaging/index.ts` থেকে fixture export নয়; demo conversation real inbox-এ দেখানো যাবে না। |
| `features/b2b/store/useB2BRFQStore.ts`-এর `MOCK_B2B_RFQS` | `features/b2b/testing/rfq.fixtures.ts` | fixture store test-এ inject; production RFQ state API-backed। |
| `apps/backend/wholesale/wholesaleRoutes.ts`-এর `SEED_B2B_PRODUCTS` | `apps/backend/modules/b2b/testing/wholesale.fixtures.ts` | endpoint থেকে hardcoded fallback বাদ; explicit local-only fixture provider ছাড়া API mock response দেবে না। |
| `portals/super-admin/SuperAdminControlModal.tsx`-এর `INITIAL_MANAGED_ADMINS` | rename নয়—remove static admin list; governance API | admin identity/permission কখনো demo data থেকে নয়। |
| legacy `apps/frontend/src/core/lib/seedData.ts` | port নয় | Firestore empty দেখে seed product write করে; live user login-এর পরে fake seller/product লেখা যাবে না। Test seed only disposable emulator/DB-তে। |
| legacy `modules/news/data/mockNewsData.ts`, `modules/profile/data/mockData.ts`, backend `MOCK_SOCIAL_POSTS`/`MOCK_COMMERCE_PRODUCTS`, wholesale seeds | no production port; optional matching `*.fixtures.ts` | localized demo story দরকার হলে test/dev fixtures; personal PII, real-looking reviews, fake inventory বা real backend fallback নয়। |

`fixtures` filename, folder import policy ও build check-এ explicit development/test-only restriction থাকবে। API fail হলে user-facing error/offline state দেখাবে; fake order, balance, KYC status বা identity দিয়ে “success” দেখাবে না।

## 9. Backend, database ও cross-app path rules

- `routes → controller → service → repository → Supabase/Postgres` dependency direction। Controller HTTP parsing/response; service business rule; repository queries/transaction; schema validator request boundary।
- Backend auth middleware verified Firebase UID resolve করে canonical `profiles.id`; request-এর `userId`, `role`, `sellerId` বা UI payload permission source নয়। Store membership/record ownership query transaction-এ enforce হবে।
- `packages/shared`-এ `AppRole`, `BusinessRole`, `Permission`, `HubId`, `PortalId`, API DTO/Zod schema; React components/React.lazy imports shared package-এ prohibited।
- `supabase/migrations/` SQL canonical; generated `database.types.ts` build artifact/source update workflow-ით sync. New table, policy, index, enum migration same PR/task-এ. Prisma model hand-edit parallel authority নয়.
- Firestore/Storage private uploads owner-bound; Firebase Storage upload URL/metadata backend/user authorization rules test; private KYC docs public bucket-এ নয়.
- Provider SDK (Firebase/Supabase/Gemini/payment) adapters `features/<domain>/api` এবং `backend/config/modules`-এ; React UI direct privileged database write করবে না.
- Root npm workspace path alias (`@/`) frontend source-এর মধ্যে; backend `@backend` alias শুধু backend-local. Cross-app relative import নিষিদ্ধ।

## 10. Filename, folder ও import conventions

- Folder `kebab-case`: `seller-central`, `rent-cargo`; React component/page `PascalCase.tsx`: `InventoryPage.tsx`; hook `useX.ts`; pure service/repository `camelCase.ts`; types `<domain>.types.ts` বা `types.ts` owner folder-এর ভেতর।
- File name behavior বলে: `mockData.ts`, `helpers.ts`, `common.ts`, `Main.tsx`, `NewPage.tsx` avoid; `offlineCatalog.fixtures.ts`, `orderRepository.ts`, `MarketplaceHubPage.tsx` prefer.
- `index.ts` কেবল module public API/barrel; circular/opaque deep export এড়াবে। Feature থেকে অন্য feature-এর `internal/*` import নয়।
- `pages/`-এর file route component; `components/` reusable view; `features/` domain logic; `data/` immutable config/localized assets/fixtures with precise owner. `utils/` global dumping ground নয়।
- Every portal registry entry unique `portalId`, valid `hubId`, canonical component/route, visible state, role permission, feed kinds; hub-specific placement unique by `(hubId, portalId)`.
- প্রতিটি page-এর title/description, loading/error/empty state, responsive PageFrame, route-aware Back policy, keyboard/accessibility labels এবং direct URL support থাকবে।

## 11. Ordered migration plan (small PR/change slices)

1. **Freeze this blueprint:** route/portal/role/schema owners approve; update existing spec docs only after structure decisions fixed.
2. **Build path/usage graph:** `rg` import scan + route inventory + dependency graph; each file labelled `keep`, `move`, `merge`, `fixture`, `retire`, `do-not-port`; assets checksum/attribution check. No bulk copy.
3. **P0 security first in current paths:** order/prescription/messaging/KYC auth findings from [repository audit](./REPOSITORY_AUDIT_REPORT_2026-11-17.md); add tests before moving those modules.
4. **Normalize contracts:** roles/permissions/HubFeedItem/domain DTO to `packages/shared`; remove backend→frontend imports; define one Supabase/Firebase authority and versioned migrations.
5. **Introduce single route registry + app shell:** make direct routes and aliases resolve; each page direct open/back/refresh works; old URLs redirect.
6. **Migrate one domain at a time:** start catalog/marketplace then services/logistics then seller/orders/account; move files and update imports atomically, keep thin adapters only while callers migrate.
7. **Portal registry migration:** stable page components in `portals/`; hubs reference portal IDs; same portal may appear in multiple hubs with one page/API/state.
8. **Deduplicate shared UI:** screenshot-test a component before selecting canonical implementation; replace duplicate nav/theme/address/message/storefront in separate slices; delete only after `rg` confirms zero consumers.
9. **Fixture rehome/real-data gate:** split `mockData.ts`; remove fake auth/profile/admin/financial success; enable dev fixtures only via `import.meta.env.DEV` or test injection; backend fixture provider only under explicit non-production environment.
10. **Monorepo/deploy normalization:** choose npm workspace and sole root lock; update Vercel/Render/Firebase roots, scripts, server static path. Keep secrets out of client bundle.
11. **Verification gate per slice:** frontend build/lint, backend typecheck, security+domain tests, DB migration validation, route deep-link tests, mobile+desktop screenshots and keyboard/tap/accessibility smoke. Never treat compile alone as production proof.

## 12. Approval boundary / what is not done

- This document is the proposed destination and path/name mapping. It does not move, rename, delete or create application source folders/files.
- Exact list for every one of the two projects' ~1,000 source/assets files is intentionally not inferred from filenames. Before execution, imports/references/route use must classify each candidate; static/media files are mapped by owner and checksum separately.
- No mocks were renamed in this design phase; names above are target paths.
- No hosted Firebase/Supabase schema, live account or deployment was accessed/changed. `PaikarMart-web-main` remains a Git-ignored read-only local snapshot.
- After blueprint approval, first deliverable should be a machine-checkable per-file migration manifest (source path → target path → decision → importers/routes → tests), then only approved slices are changed.
