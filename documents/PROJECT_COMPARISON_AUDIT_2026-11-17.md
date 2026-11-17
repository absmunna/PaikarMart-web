# PaikarMart দুই লোকাল প্রজেক্ট: Architecture ও Merge-Readiness Audit

**তারিখ:** 2026-11-17  
**পরিধি:** `C:\Users\munna\New folder` active project এবং `PaikarMart-web-main` local snapshot-এর repository layout, module boundaries, frontend/UI system, backend/API, auth, database/migrations, dependencies, deployment docs ও test scaffolding।  
**কাজের ধরন:** Read-only audit; application source/config পরিবর্তন করা হয়নি। এই turn-এ comparison report-টিই তৈরি হয়েছে; আগের local audit report আলাদা untracked deliverable হিসেবে আছে।

## সংক্ষিপ্ত সিদ্ধান্ত

পুরো `PaikarMart-web-main`-কে বর্তমান project-এ copy/merge করা উচিত নয়। Legacy project-এ domain service/controller বিভাজন, reusable design-system, Prisma migration history, middleware এবং security-test examples আছে—কিন্তু তার বাস্তব source-এ একাধিক parallel router, UI/module folder overlap, duplicate layout/theme implementations, পুরনো database model এবং authenticated order-status authorization gap পাওয়া গেছে। তার নিজের architecture audit-ও fragmentation উল্লেখ করে; একই snapshot-এর “Excellent/Integrated” system report সেই source evidence-এর সঙ্গে পুরোপুরি মেলে না।

বর্তমান project-ই রাখুন **canonical application/repository** হিসেবে: এর `hubs/` + `portals/` + `features/` গঠন marketplace/services hub design-এর সঙ্গে বেশি সরাসরি মেলে। Legacy থেকে নির্বাচিত pattern নিন—পুরো source tree বা schema নয়। আগে বর্তমান project-এর P0 security findings, durable data integration এবং schema/migration/testing gap ঠিক করতে হবে; তারপর সীমিত, reviewed UI/backend patterns port করা যায়।

## 1. Repository identity ও audit boundary

| বিষয় | Active workspace project | `PaikarMart-web-main` |
|---|---|---|
| অবস্থান | `C:\Users\munna\New folder` | `C:\Users\munna\New folder\PaikarMart-web-main` |
| Git অবস্থা | `master` branch, `origin/codex/root-app` tracking; remote `absmunna/PaikarMart-web` | নিজস্ব `.git` নেই; independent branch/remote/commit history যাচাই করা যায়নি |
| Active Git-এ অন্তর্ভুক্তি | বর্তমান repository-র tracked project | root [.gitignore](../.gitignore)-এ `/PaikarMart-web-main/` দিয়ে ignored; বর্তমান GitHub push/build-এ যায় না |
| আনুমানিক code footprint | আগের local audit-এ 268 tracked files | generated/dependency folder বাদ দিয়ে inventory-তে 1,054 files; frontend source 847, backend source 123 |
| Runtime evidence | আগের audit-এর lint/build/TypeScript/dependency checks pass; live server এই audit-এর সময় চালু ছিল না | `node_modules` নেই, lockfile নেই; build/test চালানো হয়নি |

এই তুলনা **দুই local snapshot-এর source comparison**—GitHub-এর latest branch-এর সঙ্গে diff নয়। `.env` secret value পড়া হয়নি।

## 2. Architecture ও modular folder structure তুলনা

| Layer | Active project | Legacy snapshot | Audit verdict |
|---|---|---|---|
| Frontend feature/page composition | `src/features/` business capability, `src/portals/` page experience, `src/hubs/` grouped entry/feed, `src/components/` shared shell | `src/app/`, `src/core/`, `src/design-system/`, `src/modules/`, `src/portals/`, `src/shared/`, `src/pages/`—কিন্তু responsibilities একাধিক layer-এ ছড়িয়ে | Active layout বেশি ছোট ও hub/portal intent-এর সঙ্গে সরাসরি aligned; legacy conceptual layering বেশি সমৃদ্ধ, বাস্তব boundary বেশি অস্পষ্ট |
| App bootstrap/routing | `main.tsx` → `App.tsx`-এ route, global state ও modal orchestration-এর বড় অংশ; একক entry হলেও App centrality বেশি | `main.tsx` → `app/App.tsx` → `app/router/AppRoutes.tsx`; এর পাশাপাশি `app/router/index.tsx`-এ আরেকটি প্রায় পূর্ণ router এবং `AppRoutes.tsx`-এর ভেতর ব্যবহৃত নয় এমন `createBrowserRouter` config আছে | Legacy-তে router source-of-truth অস্পষ্ট; active-তে router ownership বোঝা সহজ, তবে `App.tsx` অতিরিক্ত কেন্দ্রীভূত |
| Domain UI | Hub screen ও portal view আলাদা; `marketplace-hub`, `services-hub` এবং `features/marketplace` ইত্যাদি | Portal UI কিছু `portals/`, কিছু `modules/`, কিছু `pages/`, কিছু `design-system/`-এ | Active folder ownership ভালো; legacy থেকে feature services/types-এর নির্দিষ্ট pattern নেওয়া যায় |
| Backend | `apps/backend`-এ domain folders (`orders`, `catalog`, `auth`, `vendors` ইত্যাদি); অনেক জায়গায় route ও service একই folder-এ | `modules/<domain>/{routes,controller,service}`-এর পাশাপাশি `api/routes`, `api/lib`, `database`, `config`, `services` | Legacy domain layering ভালো, কিন্তু `server.ts` route mount এবং `api/routes/index.ts` parallel aggregation তৈরি করেছে |
| Shared contracts | `packages/shared` আছে, কিন্তু বর্তমান consumer/coverage অল্প; কিছু domain contract frontend-এ | `packages/shared` আছে; backend auth middleware সরাসরি frontend roles config import করে | দুই project-এই shared package boundary enforce হয়নি; legacy-তে backend→frontend compile-time coupling স্পষ্ট |
| Database | `supabase/schema.sql` canonical SQL intent; Prisma schema-ও রাখা, কিন্তু migration directory নেই এবং SQL↔Prisma parity অসম্পূর্ণ | Prisma schema + 3 Prisma migration directory; Supabase-এ schema-এর বদলে RLS setup SQL scripts | Migration discipline-এ legacy এগিয়ে; domain model freshness/fit-এ active schema এগিয়ে। একটাই canonical contract বেছে নিতে হবে |

### Legacy structure-এ সরাসরি দেখা overlap

- [AppRoutes.tsx](../PaikarMart-web-main/apps/frontend/src/app/router/AppRoutes.tsx) ও [router/index.tsx](../PaikarMart-web-main/apps/frontend/src/app/router/index.tsx) দুটিতেই route definitions ও `AppRoutes` component আছে। `main.tsx` থেকে active import `app/App.tsx` → `AppRoutes.tsx`; অন্য router file-এর ভূমিকা আলাদা করে deprecate করা নেই। `AppRoutes.tsx`-এ `createBrowserRouter` object তৈরি হয়, অথচ render path `<Routes>`; objectটি `RouterProvider` দিয়ে ব্যবহৃত হয় না।
- Legacy [PROJECT_ARCHITECTURE_AUDIT_AND_PLAN.md](../PaikarMart-web-main/PROJECT_ARCHITECTURE_AUDIT_AND_PLAN.md) বলে `main.tsx` `src/App.tsx`/`GlobalRouter` mount করে এবং `src/app/App.tsx` dead; কিন্তু বাস্তব `apps/frontend/src/main.tsx` `./app/App` import করে, সেটি `./router/AppRoutes` mount করে। অর্থাৎ audit document-এর route description snapshot-এর বর্তমান entrypoint-এর সঙ্গে stale।
- [portal.routes.tsx](../PaikarMart-web-main/apps/frontend/src/app/router/portal.routes.tsx)-এ friendly aliases/parallel URLs আছে; একই `/become-seller` route একাধিকবার declare করা হয়েছে। Route tests বা one-source route registry পাওয়া যায়নি।
- Legacy frontend-এ 847 source files-এর মধ্যে `modules` (~302), `portals` (~167), `design-system/components` (~188) পাশাপাশি আছে। Legacy-র নিজস্ব [PROJECT_ARCHITECTURE_AUDIT_AND_PLAN.md](../PaikarMart-web-main/PROJECT_ARCHITECTURE_AUDIT_AND_PLAN.md) এই folder fragmentation-কে আগেই migration concern বলেছে।
- [database/connection.ts](../PaikarMart-web-main/apps/backend/database/connection.ts) no-op DB stub; বাস্তবে [config/database.ts](../PaikarMart-web-main/apps/backend/config/database.ts) Prisma + dev mock mode দেয়। দুই connection abstraction পাশাপাশি রাখা বিভ্রান্তির ঝুঁকি।
- [api/routes/index.ts](../PaikarMart-web-main/apps/backend/api/routes/index.ts) modular ও legacy API tree দুটো assemble করে; [server.ts](../PaikarMart-web-main/apps/backend/server.ts) ওই aggregator import না করে বেশির ভাগ module route সরাসরি mount করে এবং `api/routes` থেকে কেবল কিছু utility router নেয়। কোন route set authoritative তা নির্ধারণ করা দরকার।
- Legacy-তে `modules/theme/context/ThemeContext`, `app/context/ThemeContext`, `app/providers/ThemeProvider`, `shared/hooks/useTheme`, `modules/app/hooks/useTheme` এবং core/shared theme constants—একাধিক theme access path আছে। `core/config/theme.ts` ও `shared/constants/theme.ts`-এ একই constants দেখা গেছে। সবগুলোর deletion দরকার—এমন নয়; usage graph ধরে একটি provider/hook/source-of-truth করতে হবে।
- একাধিক `BottomNav`, `Sidebar`, `PortalLayout`, `ProductCard`/button implementation আছে—যেমন `design-system/components/navigation`, `design-system/components/layout`, `shared/components/layout`, `modules/layout`, portal-specific layouts এবং `modules/product/components/ProductCard`। কিছু scoped variant বৈধ হতে পারে, কিন্তু shared shell কোনটি তা source থেকে নির্দিষ্ট নয়।

### Active project-এর architectural positives ও limits

- [MarketplaceHub.tsx](../apps/frontend/src/hubs/marketplace-hub/MarketplaceHub.tsx), [marketplacePortals.ts](../apps/frontend/src/hubs/marketplace-hub/config/marketplacePortals.ts), [ServicesHub.tsx](../apps/frontend/src/hubs/services-hub/ServicesHub.tsx), [servicePortals.ts](../apps/frontend/src/hubs/services-hub/config/servicePortals.ts) hub entry/feed ও portal registry আলাদা রাখে—future portal add করার ক্ষেত্রে এটা ভালো extension point।
- `features/`-এ inventory, auth, vendors, marketplace, AI, messaging-এর service/store/types/components আলাদা আছে; `portals/` page-level composition-এর জন্য ব্যবহৃত। এই split-টাই target architecture হিসেবে ধরে রাখা শ্রেয়।
- [App.tsx](../apps/frontend/src/App.tsx) এখনও app-wide route handling, commerce state, persistence, modal/navigation orchestration বহন করে। File বদলালে বহু hub/portal/checkout path একসাথে প্রভাবিত হয়; routing, domain state, API hydration ধাপে ধাপে আলাদা করা দরকার।
- [packages/shared/src/index.ts](../packages/shared/src/index.ts) থাকার পরও cross-app DTO/role contract সম্পূর্ণ সেখান থেকে আসছে না। Package-কে বাস্তব frontend/backend contract source বানানো দরকার, কিন্তু একবারে বড় refactor নয়।

## 3. Frontend UI, visuality ও component system

### যা code/source থেকে বলা যায়

- Legacy-তে [design-system/styles/index.css](../PaikarMart-web-main/apps/frontend/src/design-system/styles/index.css), `--pm-*` CSS variables, shared Button/Card/ProductCard/navigation primitives এবং 10টি theme stylesheet আছে। Reusable UI primitives এবং theme tokens-এর breadth বেশি।
- তবে legacy theme শুধু visual polish নয়: theme context/provider/hook একাধিক, layout/navigation variants একাধিক, এবং global design-system বনাম portal-specific component-এ ownership overlap করে। 10 theme মানেই সব page-এ contrast, typography, spacing বা responsive behavior verified—এমন নয়।
- Active project-এর [index.css](../apps/frontend/src/index.css) Tailwind v4 theme mapping ও shared CSS variables ব্যবহার করে; UI layer তুলনামূলক ছোট। Hub feed components (`HubFeedCard`) ও marketplace/service cards domain-specificভাবে সংগঠিত।
- Active project-এও product UI-র একাধিক purpose-specific card আছে—marketplace product, inventory product, wholesale product। এগুলো আলাদা business action দেখায়, তাই নাম আলাদা হওয়া নিজে duplicate bug নয়; shared visual primitives/spacing/type scale এক কিনা audit করা প্রয়োজন।

### Live visual audit-এর সীমাবদ্ধতা

এই কাজের সময়ে browser page share ছিল না এবং localhost ports 3000/4310/5173/4173 সাড়া দেয়নি। Legacy project-এ `node_modules` ও lockfile নেই। তাই mobile/desktop screenshot capture, page-by-page click-through, contrast measurement বা responsive rendering **চালানো হয়নি**। UI assessment উপরের CSS/component source ও existing docs-ভিত্তিক; visual quality-র final verdict নয়। Report-এ screenshot-এ যাচাই হয়নি—এটা স্পষ্ট সীমা হিসেবে রাখলাম।

### UI merge recommendation

Legacy design-system থেকে সরাসরি 188 component copy নয়। প্রথমে একটি ছোট canonical set নির্ধারণ করুন: tokens, typography scale, Button/Input/Card, Dialog/Sheet, Product tile, skeleton, shared page container, one mobile bottom nav/desktop sidebar. Existing active screens-এ screenshot/contrast/responsive test করে component-by-component port করুন। Theme choice আগে স্থির করুন (যেমন light/dark; অতিরিক্ত theme পরে), যাতে 10টি theme file নতুন duplication না তৈরি করে।

## 4. Backend/API ও security তুলনা

### Active project: গুরুত্বপূর্ণ পূর্ববর্তী audit findings

আগের [REPOSITORY_AUDIT_REPORT_2026-11-17.md](./REPOSITORY_AUDIT_REPORT_2026-11-17.md)-এ active code-এ নিচের release blockers/static findings নথিভুক্ত:

- **P0:** order list/detail/track/status endpoints-এ ownership/auth gap; prescription list/create-এ PII/medical data access gap; messaging thread/send-এ auth/identity spoofing; vendor KYC self-approval bypass.
- **P1:** order persistence ও DB FK/error handling, product inventory UI local-only, KYC registry memory-only, post identity/persistence, catalog unverified-store filtering/variant selection, services/rides feed replacement risk, SQL↔Prisma schema mismatch।
- Positive controls: [requireFirebaseAuth.ts](../apps/backend/middleware/requireFirebaseAuth.ts) fail-closed token verification; Firestore/Storage rules-এর default deny/ownership checks; wallet/escrow mutations persistence-ready না হওয়া পর্যন্ত fail-closed।

### Legacy project: বাস্তব source findings

- Positive: [server.ts](../PaikarMart-web-main/apps/backend/server.ts) Helmet, CORS, request sanitization, audit logging, global/targeted rate limiting, health route ও Socket.IO setup centralize করে। Backend-এ auth/order/payment/wallet/socket security test files আছে।
- **P0 — Authenticated order status tampering:** [order.routes.ts](../PaikarMart-web-main/apps/backend/modules/order/order.routes.ts) status update route-এ `requireAuth` लगায়, কিন্তু [order.controller.ts](../PaikarMart-web-main/apps/backend/modules/order/order.controller.ts)-এর `updateOrderStatus` শুধু order ID ও allowed state transition দেখে; order buyer/seller/admin-এর সঙ্গে `req.user.id` মেলে কিনা বা role অনুমোদিত কিনা যাচাই করে না। Valid signed-in account known order ID পেলে pending→processing/cancelled, processing→shipped, shipped→delivered করতে পারে; delivered হলে `paymentStatus: paid`-ও সেট হয়। Payment callback/role ownership-এর বদলে এভাবে financial/order state বদলানো release blocker।
- **P1 — Seller sales query:** একই controller-এর `getOrders` query buyerId/userId দিয়ে filter করে, sellerId দিয়ে নয়; seller-facing order list এই endpoint ব্যবহার করলে seller-এর incoming sales বাদ পড়তে পারে।
- **P1 — Guest tracking/integrity:** public `/guest-checkout` price/stock DB থেকে নেয়—ভালো—কিন্তু guest tracking token/idempotency contract দেখা যায়নি; tracking endpoint `requireAuth`-এ আবদ্ধ। Guest checkout order-এ guest phone/email notes field-এ জমা হয়। Guest order tracking চাইলে signed, scoped, expiring token প্রয়োজন; email/phone-কে bearer secret করা যাবে না। Guest stock decrement-এ `updateMany` count zero হলেও result check না করার পথ আছে—race-এ oversell/order inconsistency হতে পারে।
- **P1 — Identity key mismatch risk:** [auth.ts](../PaikarMart-web-main/apps/backend/middleware/auth.ts) raw Firebase token-এর `uid`-কেও canonical `userId` ধরে এবং `prisma.user.id` দিয়ে lookup করে। Legacy [schema.prisma](../PaikarMart-web-main/packages/database/prisma/schema.prisma)-এর `User.id` UUID default; আলাদা `authUid` column নেই। যদি client raw Firebase ID token দেয়, Firebase UID↔DB UUID mapping নিশ্চিত না করলে profile/role/order ownership mismatch হতে পারে। Server-issued JWT-তে internal UUID থাকলে আলাদা contract প্রমাণ করতে হবে; বর্তমান দুই পথ একই `id` property-তে normalize করা ঝুঁকিপূর্ণ।
- **P1/P2 — Role fallback:** `requireAuth` DB user না পেলে verified token role fallback নেয়। [rbac.ts](../PaikarMart-web-main/apps/backend/middleware/rbac.ts)-এর super-admin logic-এ valid token claim admin হলে database record-এর stale/downgraded role সেই privilege সবসময় revoke করে না। Custom claims-এর issuance/revocation policy ও DB source-of-truth স্পষ্ট করতে হবে।
- **Dev-mode boundary:** [firebaseAuth.ts](../PaikarMart-web-main/apps/backend/middleware/firebaseAuth.ts) Firebase Admin unavailable হলে non-production-এ valid Bearer header-কে dev user বানায়; [config/database.ts](../PaikarMart-web-main/apps/backend/config/database.ts) non-production mock persistence দেয়। Production `NODE_ENV=production` ছাড়া ভুল deploy config-এ এই fallback behavior অনিচ্ছাকৃত হতে পারে। `NODE_ENV`, secrets ও deployment readiness fail-closed enforce করা জরুরি।
- **Cross-layer coupling:** backend [auth.ts](../PaikarMart-web-main/apps/backend/middleware/auth.ts) frontend-এর `core/config/roles.config` import করে; roles/shared permission contract `packages/shared`-এ থাকা উচিত, frontend source backend build dependency হওয়া নয়।
- **Backend modularity caveat:** `modules/<domain>` controllers/routes structured হলেও `api/routes/*`, legacy model helpers, `database/connection.ts` no-op और `api/routes/index.ts` parallel routing tree রাখা হয়েছে। `server.ts` primary runtime; alternate route tree/unit-үүдийн consumer mapping verify না করে merge করলে একই endpoint-এর duplicate path/behavior আসতে পারে।

## 5. Database, Firebase/Supabase ও deployment

| বিষয় | Active | Legacy | তুলনামূলক সিদ্ধান্ত |
|---|---|---|---|
| Canonical schema | `supabase/schema.sql`-এ profile/private PII, Store, MasterProduct, SellerListing, service, orders, wallet/escrow-সহ richer PaikarMart model | `packages/database/prisma/schema.prisma`-এ User, VendorProfile, Product, Order, Wallet ইত্যাদি legacy model; 3 Prisma migration আছে | দুই schema একে অপরের drop-in replacement নয়। Legacy model-এ active SQL-এর MasterProduct→SellerListing model নেই; current SQL/Prisma-তেও parity gap আছে |
| Migration path | বর্তমান `packages/database/prisma/migrations` নেই; `schema.sql` একা incremental deploy history দেয় না | Prisma migrations (`20261031...`) আছে; Render-এ migration command configure আছে | Migration process-এ Legacy ভালো; target schema-তে current domain model রেখে versioned migration নেওয়া উচিত |
| RLS | `firestore.rules`, `storage.rules`, Supabase schema policies বর্তমান design-এর অংশ | Supabase scripts RLS enable করে এবং client direct access বন্ধের নীতি বলে; backend privileged DB role দিয়ে access করে | RLS scripts blind copy নয়; actual table names/role/UID contract মিলিয়ে migration test আবশ্যক |
| Firebase | Auth + Firestore/Storage rules; Spark-plan limits/environment behavior actual production project-এ verify হয়নি | Auth Admin middleware/config, Firestore rules/storage setup docs; server fallback documented | Firebase Auth identity provider রাখুন; canonical business state PostgreSQL/Supabase-এ রাখুন; Firebase-এ media/realtime সীমিত রাখুন—quota ও ownership rules একবারে verify |
| Deploy config | Root Vercel/Render/Firebase manifests; current Render blueprint-এ আগের audit অনুযায়ী server-side DB/admin env contract gap আছে | root এবং `apps/frontend`—দুই Vercel config; Render deploy migration চালাতে পারে; `.env.example`-এ DB URL/DIRECT_URL আছে | একটি repository root/deploy topology স্থির করতে হবে; overlapping deploy root config থেকে ভুল build output বাছার ঝুঁকি আছে |

Legacy Supabase `sql/`-এ RLS scripts আছে, canonical Supabase `schema.sql` নেই; table creation Prisma migrations/schema-র দায়িত্বে। Legacy Prisma User model-এ `auth_uid` অনুপস্থিত এবং current product master/seller offer schema-এর সঙ্গে সরাসরি মেলে না। Active project-এ SQL-এ 23 table বনাম Prisma-তে 21 model এবং variant/address/membership mismatch আগের audit-এ ধরা হয়েছে। Migration করার আগে table-by-table mapping ও data preservation plan দরকার।

## 6. Dependencies, reproducibility ও build evidence

- Active root [package.json](../package.json) project name `react-example`/version `0.0.0`; current repository-তে `package-lock.json` এবং `bun.lock` দুটোই আছে, package manager canonicalization স্পষ্ট নয়। Frontend/backend dependencies root-level-এ ভাগাভাগি।
- Legacy [package.json](../PaikarMart-web-main/package.json) `paikarmart-monorepo`, `pnpm@9.1.0`, `apps/*`/`packages/*` workspace ঘোষণা করে; `pnpm-workspace.yaml` আছে, কিন্তু root inventory-তে `pnpm-lock.yaml`/npm/yarn lock নেই। তাই dependency reproducibility এবং security audit lock graph দিয়ে যাচাই করা যায়নি।
- Legacy root, `apps/frontend`, `apps/backend`, `packages/database`—চার manifest-এ tool/library declarations overlap; React 18 / Vite 6 / TypeScript 5.8 frontend, backend-এর পৃথক runtime ও root-এ Prisma version। Mixed package install/hoist করলে version drift ও build resolution risk আছে।
- Current prior audit: lint, frontend production build, backend TypeScript command, declared dependency tree pass; `npm audit --audit-level=high` 0 vulnerability। Bundle-এর main JS ~1.38 MB, Firebase chunk ~592 KB; splitting warning আছে। এগুলো legacy-এর dependency evidence নয়।
- Legacy-তে 5 security test scripts/files (auth, wallet, payment, order, socket) আছে; কিন্তু `.github/workflows` নেই এবং installable dependency lock/node_modules অনুপস্থিত। Testগুলো DB state না থাকলে 503 পেতে পারে, অথচ কিছু test 200/403/404-ধরনের ফল চায়; test isolation/mock strategy review ছাড়া suite-কে passing ধরে নেওয়া যাবে না।

## 7. File classification summary

### তুলনামূলকভাবে ভালো foundation (নির্দিষ্ট responsibility-র বিচারে)

- Active: hub registry/feed separation; Firebase auth fail-closed middleware; Firestore/Storage owner/default-deny policy; domain-oriented frontend `features/`.
- Legacy: backend security middleware/rate-limit/audit scaffolding; route/controller domain split-এর কিছু উদাহরণ; Prisma migration history; backend security-test intent; design-system token/component library।

এগুলো “সম্পূর্ণ file safe/production-ready” সনদ নয়—শুধু নির্দিষ্ট pattern adopt করার সম্ভাব্য foundation।

### Bug/critical risk-সহ code (P0-first)

1. **Active P0:** order ownership/status, prescription PII, messaging auth/identity, vendor KYC self-approval — বিস্তারিত [previous audit report](./REPOSITORY_AUDIT_REPORT_2026-11-17.md)-এ।
2. **Legacy P0:** order status transition-এ authenticated user-এর ownership/role check নেই; delivered transition-এ payment paid করা যায়।
3. **Both projects:** UI state ও backend persistence boundary পুরোপুরি বাস্তব DB contract-এ পৌঁছেনি; authoritative operation/data source চিহ্নিত না করলে mock/local state production data বলে দেখাতে পারে।

### Missing / not verified

- Active: versioned SQL migration history, inventory CRUD API, durable KYC/messaging repositories, scoped guest tracking credential, full automated test/CI gate, current audit-এর screenshot-based UI checks.
- Legacy: lockfile/CI workflow; current MasterProduct/SellerListing/variant schema-এর সমতুল্য canonical normalized model; Firebase UID↔database UUID explicit column/service contract. Exact runtime behavior install/build না হওয়ায় unverified.
- দুই project: actual Firebase/Supabase hosted settings, live database/schema, storage buckets, secrets, payment provider credentials ও production role claims এই audit-এ inspect করা হয়নি।

### Duplicate/unused candidate (নিশ্চিত না হওয়া পর্যন্ত delete নয়)

- Legacy: `app/router/AppRoutes.tsx` বনাম `app/router/index.tsx`; unused `createBrowserRouter` object; theme provider/context/hook/constants variants; repeated navigation/layout/product card implementations; backend `api/routes/index.ts` বনাম `server.ts` direct mounts; `database/connection.ts` no-op adapter।
- Active: `SavedAddressesTab.tsx` বনাম `account/SavedAddressesPage.tsx`; `VendorOnboardingModal.tsx` active imports-এ পাওয়া যায়নি; `packages/database/index.ts` Prisma client import করে কিন্তু active root dependency/runtime path-এ নেই—আগের audit candidate।
- Old+new দুই project-এ একই নামে file থাকা মানে duplicate implementation হতে পারে, কিন্তু import graph/data contract না মিলিয়ে byte-level replace/copy নিরাপদ নয়।

## 8. Change-impact map

| পরিবর্তনের কেন্দ্র | সম্ভাব্য downstream impact |
|---|---|
| Active `App.tsx` / route composition | hub, portal, auth guard, cart/checkout, shared nav, modal, localStorage hydration |
| `CommerceItem`/product variant contract | mock seed, catalog mapper, product card/detail, inventory editor, seller offer, cart, checkout, order JSON, SQL/Prisma |
| User identity mapping (`Firebase uid`↔profile UUID) | auth/profile, address, reviews, posts, orders, seller/store ownership, KYC, chat, RLS |
| SQL schema / Prisma model | backend queries, catalog projections, order persistence, RLS, migration/deploy, all frontend DTO |
| Legacy route registry/auth middleware | route aliases, API versioned + legacy endpoints, RBAC, seller order state, payment status, DB ID mapping |
| Theme tokens/shared nav | every portal/hub, modal/drawer, mobile/desktop responsive shell, contrast/text hierarchy |

কোনো schema/auth/theme change একক file-only change নয়। Contract checklist ও focused regression test ছাড়া দুই tree থেকে একই নামে file overwrite করা high-risk।

## 9. দুই project-এর সেরা অংশ একত্র করার প্রস্তাব

```text
apps/
  frontend/
    src/app/                 # single bootstrap, providers, route registry, guards
    src/design-system/       # one token set + shared primitives/layout shell
    src/features/<domain>/   # domain types, API client, hooks/store, business logic
    src/hubs/<hub>/          # hub feed + portal registry/config
    src/portals/<portal>/    # route-level page composition only
    src/shared/              # cross-domain contracts/utils (small, governed)
  backend/
    src/config/ middleware/  # env, Firebase verify, rate limits, request parsing
    src/modules/<domain>/    # routes → controller → service → repository
packages/
  shared/                   # DTO/Zod contracts shared by client/server
supabase/
  migrations/               # one versioned SQL authority, RLS in reviewed migrations
```

### Selective merge plan

1. **Canonical branch/worktree:** active repository-কে source-of-truth রাখুন; `PaikarMart-web-main`-কে read-only reference/archive হিসেবে রাখুন। পুরনো folder-এ `.git` নেই, তাই branch merge/cherry-pick সম্ভব নয়; file-by-file reviewed port দরকার।
2. **Frontend:** active `hubs/` + `portals/` + `features/` বজায় রাখুন। Legacy থেকে token/component-গুলো একবারে নয়—small UI kit বেছে, active mobile/desktop screenshot ও interaction QA-র পরে আনুন। Router/provider/ThemeContext একক করুন; legacy `modules/` বা `pages/` সরাসরি copy করবেন না।
3. **Backend:** legacy middleware/test intent-কে reference ধরে active API-তে controller/service/repository boundaries নিন। Firebase UID resolution একবারে canonical করুন; `req.user.id` সর্বত্র internal profile UUID, `authUid` আলাদা verified claim mapping হবে। Role/ownership server DB-তে যাচাই হবে; client role বা token stale claim একা authority নয়।
4. **Database:** active current domain model-কে target ধরে explicit schema mapping লিখুন। Supabase SQL migration history যোগ করুন; legacy `User/Product/Order` tables blind import নয়। Prisma নেবেন কেবল তখনই, যখন runtime-এ এককভাবে ব্যবহৃত ও SQL/RLS migrations-এর সঙ্গে test করা হবে।
5. **Dependencies/deploy:** এক package manager ও lockfile নির্বাচন; duplicate root/frontend Vercel config-এর intended root নির্দিষ্ট; frontend/backend build + typecheck + security tests CI-তে চালানো। Secrets/real Firebase-Supabase project config শুধু deployment environment থেকে।
6. **Feature porting order:** P0 authorization/privacy → P1 DB/identity/order integrity → inventory/KYC/chat durable integration → hub feed contract → visual tokens/components → dead-code cleanup/performance.

## 10. Bug fix priority (approval-এর পর)

| Priority | Scope | প্রথম কাজ |
|---|---|---|
| **P0 / release blocker** | Active order/prescription/messaging/KYC; legacy order status mutation | Route-by-route auth + record ownership + role authorization; sensitive data projection; KYC approval only trusted governance; payment status only verified callback |
| **P1 / data integrity** | Both DB/auth contracts, orders, inventory, KYC, guest tracking | Firebase UID→profile mapping; server-side totals/stock; transaction/error propagation; durable repositories; guest scoped token; migration plan |
| **P1 / app integration** | Current hubs/catalog + legacy route/API overlaps | typed feed aggregation; one API route registry; preserve service/ride products; unverified listing moderation |
| **P2 / maintainability + UX** | UI duplicate layers, themes, dependencies, bundle | one router/provider/theme/navigation owner; audited token import; unused dependencies/components cleanup; code-splitting; accessibility/responsive visual tests |

## 11. Verification boundary ও next step

- Current project-এর build/lint/dependency/security-audit result আগের local audit report থেকে নেওয়া; এই turn-এ পুনরায় build/test চালানো হয়নি।
- Legacy project-এ dependency install/build/test করা হয়নি: `node_modules` নেই, lockfile নেই, browser/server ports বন্ধ। তাই কোনো legacy build pass/fail claim করা হচ্ছে না।
- Visual UI judgment source-based; screenshot comparison হয়নি। Full visual audit করতে পরে দুই version একই viewport/data-তে run করে route-by-route screenshots ও interaction tests লাগবে।
- GitHub latest branch fetch/compare করা হয়নি; legacy folder-এর নিজস্ব Git metadata-ও নেই।
- **কোনো application bug fix, merge, dependency update, database migration বা deployment change করা হয়নি।** আপনার অনুমোদনের পর প্রথমে P0 findings-এর narrow fixes ও focused security tests শুরু করা উচিত; P0 review শেষে পরের phase আলাদা অনুমোদনে এগোনো যাবে।
