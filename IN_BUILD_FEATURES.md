# Paikar Mart - Pending Features & Roadmap

The following packages are currently pending development or integration to achieve full production readiness:

## Package 6: Portal Expansion
- [x] Unified UI Architecture (Implemented `HomeHeader` & `PortalIconBar` globally)
- [x] Super App Hub Page (Implemented 10-portal grid with Squircle styling)
- [x] Navigation Finalization (Bottom Nav with Apps/Messages sync)
- [ ] B2C Retail Portal (Full backend integration and frontend components)
- [x] Wallet Dashboard (Real balance tracking, transaction history, Add/Send/Recharge API integration)
- [ ] PK Store (Link with real product data with PK Coin cashbacks)

## Package 7: Feed & Interaction
- [x] Social Feed UI Improvement (`CreatePostComposer` + Refined Layout)
- [ ] Live Social Feed Backend (Real database posts, comments, likes)
- [ ] Real-time Chat (Socket.io integration for user-to-seller communication)
- [ ] Notifications System (In-app Bell + Push Notifications via FCM or similar)

## Package 8: Payment Gateway Integration
- [ ] bKash Integration
- [ ] Nagad Integration
- [ ] SSL Commerz (Cards/Bank)
- [ ] Order verification webhook handling

## Package 9: Backend API Finalization
- [ ] Complete Prisma Schema migrations in Supabase
- [ ] Implement robust Image Uploads (e.g. AWS S3, Cloudinary, or Supabase Storage)
- [ ] Rate limits validation and helmet security middleware
- [ ] Analytics APIs for Admin and Seller dashboards

## Package 10 & 11: Deployment & PWA
- [x] PWA Manifest and Offline Service Workers (manifest.json, custom SVG icons, sw.js, in-app install prompt)
- [ ] Deployment of Backend to Railway
- [ ] Deployment of Frontend to Vercel
- [ ] Set up complete CI/CD GitHub Actions pipeline

## Safe Mode Guidelines
If a user navigates to an unfinished route, they must hit the generic `NotFound` (Coming Soon) safety boundary built into `AppRoutes.tsx`.
