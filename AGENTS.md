# Paikar Mart - Development Guidelines & Security Notes

This file serves as a persistent brain and instruction set for AI agents working on the Paikar Mart Super App.

## 🌟 App Identity
- **Name**: Paikar Mart
- **Type**: Multi-vendor Social Commerce Super App
- **Market**: Bangladesh
- **Core Goal**: A seamless bridge between physical wholesalers, retailers, standard e-commerce, and premium curated products (PK Store).

## 🏗️ Architecture Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS v4, Zustand, Framer Motion, React Router v7. Hosted/Deployed on Vercel or similar.
- **Backend**: Node.js, Express, Prisma ORM. Hosted on Railway (or similar).
- **Database**: PostgreSQL (hosted on Supabase).

## 🔐 Security & Access Control
- **Authentication**: JWT-based access and refresh tokens.
  - Endpoints: `/api/v1/auth/login`, `/api/v1/auth/register`, `/api/v1/auth/forgot-password`.
- **Guards**: `AuthGuard` (login required) and `RoleGuard` (verifies array of allowed roles).
- **Roles**: `buyer`, `seller`, `admin`, `super_admin`, `moderator`, `nearby_shop`, `service_provider`, etc.
- **Dev Mode Fallback**: During development, if `DATABASE_URL` is not provided, the API controllers simulate successful responses (e.g. creating in-memory mock tokens or dummy IDs) so the UI doesn't crash permanently. This must be replaced/cleaned up when deploying to production with a real DB.
- **NEVER** expose the `VITE_SUPABASE_ANON_KEY`, `JWT_SECRET`, or `DATABASE_URL` in the client bundle. Use server-side where necessary, or restrict Supabase access with Row Level Security (RLS).

## 📌 Development Rules
1. **Never mock data for user requests** without a fallback to real APIs (we currently use Axios to hit the Express backend on `VITE_API_BASE_URL`).
2. **Theming**: Use the CSS variables defined in globals.css (e.g., `var(--pm-bg)`, `var(--pm-accent)`). Never hardcode colors like `#ff6b00`.
3. **Icons**: Use `lucide-react` exclusively.
4. **Mobile First**: Design for max-width `480px` on mobile, horizontally centered on desktop with surrounding gradients/sidebars.
5. **No Blind Full-File Overwrites**: Use targeted edits or `multi_edit_file` to keep safe boundaries. Do not break existing features.
6. **Feature Portals**: 
    - Completed: B2B Dashboard basics, Auth, Seller/Admin Dashboards.
    - Pending (404/Coming Soon mapped): B2C, Wallet, PK Store (frontend done, routing hidden for now or behind construction walls), etc. Map unfinished routes to the `NotFound` (Coming Soon) page.

## 🚀 Deployment & Updates
- **Frontend (Vercel)**: Push to GitHub `main` or specific branch. Keep VITE_API_BASE_URL pointing to the Railway production URL.
- **Backend (Railway)**: Push `backend/` folder to Railway. Configure Postgres from Supabase via `DATABASE_URL` and set `JWT_SECRET`.
- Prisma requires `npx prisma generate` to build client models (done in postinstall). `npx prisma db push` or `prisma migrate deploy` is needed to schema match the Supabase DB.

## 🛠️ Still In Build (Pending Architecture)
Refer to `IN_BUILD_FEATURES.md` for the roadmap.
