# PaikarMart — Deployment Infrastructure & Cross-Platform Master Guide
> **Scope:** Free-tier cloud infrastructure, secure backend & database management (Supabase, Render, GitHub, Google Cloud), and multi-platform update strategies (Web, PWA, Android, iOS, Desktop).

---

## 🌐 1. Free-Tier Cloud Infrastructure & Hosting Stack
To run and scale PaikarMart efficiently with minimal initial cost, the following combination of industry-standard free tiers and managed cloud services is recommended:

* **Database (PostgreSQL):** **Supabase (Free Tier)** or **Neon DB (Free Tier)**. Provides a fully managed PostgreSQL database with automatic backups, connection pooling, and SSL encryption.
* **Backend & API Hosting:** **Render (Free/Hobby Tier)** or **Google Cloud Run**. Runs our Node.js/Express (`server.ts`) backend container securely with environment variable injection.
* **Version Control & CI/CD:** **GitHub**. Centralized repository hosting automated with GitHub Actions for linting, building, and seamless auto-deployments to Render or Cloud Run.
* **Frontend Hosting:** **AI Studio Build Preview & Vercel/Netlify**. High-performance static edge caching for the Vite React frontend.

---

## 🔒 2. Database Security & Control Strategy
Controlling and securing your database without exposing sensitive credentials requires strict adherence to architectural rules:

1. **Environment Variable Shielding:** Never commit `.env` files or database connection strings (`DATABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) to GitHub. Inject them directly into Render/Cloud Run environment settings.
2. **Prisma ORM Boundary:** All database queries flow through the server-side Prisma client (`backend/config/database.ts`). The browser never talks directly to the database; it communicates exclusively via secure `/api/*` endpoints authenticated with JWT tokens.
3. **SSL/TLS Enforcement:** Always append `?sslmode=require` to your PostgreSQL connection string to encrypt data in transit.

---

## 🚀 3. Step-by-Step Deployment Workflow
### Step 1: GitHub Repository Setup
* Push your PaikarMart codebase to a private/public GitHub repository.
* Ensure `.env` is listed in `.gitignore`.

### Step 2: Supabase Database Setup
* Create a free project on [Supabase](https://supabase.com).
* Retrieve your PostgreSQL Connection URI (Pooling connection string).

### Step 3: Render / Cloud Run Backend Deployment
* Connect your GitHub repository to [Render](https://render.com) (or deploy via Cloud Run).
* Set Build Command: `npm run build`
* Set Start Command: `npm start`
* Add Environment Variables: `DATABASE_URL`, `PORT=3000`, `NODE_ENV=production`, `JWT_SECRET`.

---

## 📱 4. Cross-Platform App Updates (Web, Android, iOS, PC)
PaikarMart is architected as a Progressive Web App (PWA) and Responsive Super App, allowing seamless updates across all devices without requiring manual app store re-submissions for every minor bug fix:

* **Web & PWA (Instant Updates):** 
  * Users on mobile browsers (Chrome/Safari) or desktop can "Install PaikarMart" directly from the browser. 
  * Whenever you deploy a new backend or frontend build, users receive the update instantly upon refreshing or via Service Worker background sync.
* **Android & iOS (Mobile App Wrappers):**
  * To publish on Google Play Store and Apple App Store, wrap the web app using **Capacitor (Ionic)** or **React Native WebView**.
  * Native shell points directly to your live URL (`https://www.paikarmart.com`). Future UI/UX updates deployed on the server update the mobile apps automatically without publishing new binaries to app stores.
* **Desktop PC Apps (Windows / Mac / Linux):**
  * Bundled via **Electron** or accessed via desktop PWA shortcuts in Chrome/Edge, maintaining 100% feature parity with the web version.
