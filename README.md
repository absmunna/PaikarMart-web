# 🛒 Paikar Mart - Multi-vendor Social Commerce Super App

Paikar Mart is a multi-vendor Social Commerce and B2B/B2C Super App designed for Bangladesh. It seamlessly bridges physical wholesalers, factory mills, retailers, local neighborhood shops, on-demand services, logistics, and social commerce feeds into a single unified platform.

---

## 🔒 Security Notice (Env & Secrets)
> **CRITICAL**: Never push your `.env` file or any credentials to GitHub.
> All sensitive keys (`DATABASE_URL`, `JWT_SECRET`, `VITE_SUPABASE_ANON_KEY`, `GEMINI_API_KEY`, etc.) are pre-configured in `.gitignore`.
> To run the app, copy `.env.example` to `.env` and fill in your values locally or in your deployment dashboard (e.g. Railway, Vercel, Render).

```bash
cp .env.example .env
```

---

## 🚀 Key Features & Hub Architecture

1. **Marketplace Hub (B2C & PK Store)**:
   - Modern social commerce feed with product reels, flash deals, and buyer demand boards.
   - Curated store collections with coin cashback rewards.
2. **Wholesale & Factory Direct Hub (B2B)**:
   - Direct factory mill-gate rates, tiered MOQ pricing, and bulk RFQ (Request for Quotation).
3. **Services Hub**:
   - Home repairs, AC servicing, electrical, plumbing, and IT services with interactive slot booking.
4. **Logistics & Fleet Hub**:
   - Multi-modal transport (cargo trucks, parcel bikes, private car rentals, emergency ambulances) with live distance and fare calculation.
5. **Local Hub (Nearby Shops)**:
   - Real-time location-based discovery (grocery, pharmacy, restaurants) with 20–30 minute local delivery.
6. **Unified Merchant Central (Seller Portal)**:
   - Complete multi-role business dashboard for retailers, wholesalers, service providers, and riders.
7. **Universal Checkout & Escrow**:
   - Supports Cash on Delivery (COD), bKash, Nagad, Card, and PaikarMart Wallet with 100% buyer protection.

---

## 🏗️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Zustand |
| **Backend API** | Node.js, Express, TypeScript, tsx, esbuild |
| **Database & ORM** | PostgreSQL (hosted on Supabase / Railway), Prisma ORM |
| **Authentication** | JWT (Dual Access/Refresh tokens), Role-based Access Control (RBAC) |
| **Deployment** | Vercel (Frontend SPA) / Railway or Render (Full-Stack / Backend) |

---

## 📂 Project Structure

```text
paikar-mart/
├── .env.example         # Template for environment variables (safe for Git)
├── .gitignore           # Hardened security rules (ignores all .env and secret files)
├── backend/             # Express.js API server & modules
│   ├── api/             # API route handlers & routers
│   ├── config/          # Database (Prisma), Redis, and environment configs
│   ├── middleware/      # Security (Helmet, CORS, Rate Limit, Auth, Sanitization)
│   ├── modules/         # Domain-driven backend modules (auth, products, orders, etc.)
│   └── server.ts        # Express entry point with Vite middleware in dev
├── prisma/              # Prisma schema & migration files
│   └── schema.prisma    # PostgreSQL database models
├── src/                 # React Frontend Application
│   ├── components/      # Reusable UI & layout components (Navbar, Cart, Drawers, etc.)
│   ├── features/        # High-level features (Checkout, Registration, Auth, etc.)
│   ├── layouts/         # RootLayout with desktop 3-zone contract & responsive viewport
│   ├── modules/         # State management stores (Cart, Wallet, Auth, Location, etc.)
│   ├── pages/           # Application views (Home, Feed, ProductDetails, Checkout, etc.)
│   ├── portals/         # Dedicated business portals (B2B, B2C, Services, Ride, Nearby, Seller)
│   └── routes/          # React Router v7 routes
├── package.json         # Node.js dependencies & scripts
├── vite.config.ts       # Vite configuration with Tailwind CSS v4 plugin
├── vercel.json          # Vercel SPA routing configuration
└── railway.toml         # Railway deployment build and start configuration
```

---

## 💻 Local Development Setup

### 1. Prerequisites
- **Node.js** >= 18.0.0
- **npm** or **pnpm**
- **PostgreSQL** database (Local, Supabase, or Railway)

### 2. Installation
```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate
```

### 3. Environment Setup
```bash
cp .env.example .env
```
Open `.env` and configure your database and API settings.

### 4. Run Development Server
```bash
# Starts Express backend and Vite frontend together on port 3000
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Production Build & Deployment

### Production Build
```bash
npm run build
```
This builds both the Vite frontend into `dist/` and bundles `backend/server.ts` into `dist/server.cjs`.

### Production Start
```bash
npm start
```

### Deploying to Railway (Full-Stack Node.js)
1. Push your repository to GitHub.
2. Link your GitHub repository in Railway.
3. Add your environment variables (`DATABASE_URL`, `JWT_SECRET`, etc.) in the Railway Dashboard.
4. Railway will automatically detect `railway.toml` or `package.json` and deploy.

### Deploying Frontend to Vercel
1. Link your repository in Vercel.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set `VITE_API_BASE_URL` to point to your live backend URL.

---

## 📤 Pushing to GitHub (Step-by-Step)

To initialize and push this codebase to a new GitHub repository:

```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Verify ignored files (ensure .env is NOT tracked)
git status

# 3. Stage all clean project files
git add .

# 4. Commit changes
git commit -m "feat: initial commit of Paikar Mart fullstack application"

# 5. Set default branch to main
git branch -M main

# 6. Add your GitHub remote repository URL
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git

# 7. Push to GitHub
git push -u origin main
```

---

## 📄 License & Notes
- Developed for **Paikar Mart** Super App ecosystem.
- Designed and optimized for both desktop browsers and mobile touch screens.
