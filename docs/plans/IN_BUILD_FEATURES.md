# Paikar Mart - Pending Features & Roadmap

The following packages are currently pending development or integration to achieve full production readiness:

## Package 6: Portal Expansion
- [ ] B2C Retail Portal (Full backend integration and frontend components)
- [ ] Wallet Dashboard (Real balance tracking, transaction history)
- [ ] PK Store (Link with real product data with PK Coin cashbacks)

## Package 7: Feed & Interaction
- [ ] Live Social Feed (Posts, comments, likes, geo-fenced local feed)
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
- [ ] PWA Manifest and Offline Service Workers
- [ ] Deployment of Backend to Railway
- [ ] Deployment of Frontend to Vercel
- [ ] Set up complete CI/CD GitHub Actions pipeline

## Safe Mode Guidelines
If a user navigates to an unfinished route, they must hit the generic `NotFound` (Coming Soon) safety boundary built into `AppRoutes.tsx`.
