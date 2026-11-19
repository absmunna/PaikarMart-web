# PaikarMart Web · Production Deployment Guide (Firebase Hosting + Render + Supabase + Firebase Auth)

This document outlines the exact architecture and step-by-step deployment instructions to run **PaikarMart Web** with:
- **Frontend**: Firebase Hosting (Free Tier)
- **Backend**: Render Free Web Service (`paikarmart-backend`)
- **Database**: Supabase PostgreSQL (`SUPABASE_URL`, `SUPABASE_ANON_KEY`)
- **Authentication**: Firebase Auth (Google Sign-In + Email/Password + Email Verification)

---

## 1. Architecture & Services Sync Matrix

| Component | Target Platform | Configuration & Secret Keys Required |
| :--- | :--- | :--- |
| **Frontend UI (Vite SPA)** | **Firebase Hosting** | `firebase.json` (`apps/frontend/dist`), `VITE_API_BASE_URL=https://paikarmart-backend.onrender.com` |
| **Backend API (Node.js Express)** | **Render Web Service** | `render.yaml`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `FIREBASE_PROJECT_ID` |
| **Database & Persistence** | **Supabase PostgreSQL** | `SUPABASE_URL`, `SUPABASE_ANON_KEY`, Drizzle ORM migrations (`src/db/*`) |
| **Authentication & KYC** | **Firebase Auth & Firestore** | `firebase-applet-config.json`, Google Cloud Project credentials |

---

## 2. Step-by-Step Deployment Instructions

### Step 1: Backend Deployment on Render
1. Connect your GitHub repository (`main` branch) to **Render** (or use `render.yaml`).
2. Set the build & start commands:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server.js`
3. Configure Environment Variables on Render:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `SUPABASE_URL`: Your Supabase Project URL
   - `SUPABASE_ANON_KEY`: Your Supabase Anon Public Key
   - `FIREBASE_PROJECT_ID`: Your Firebase Project ID
   - `GEMINI_API_KEY`: (Optional) For AI auditor / assistant features

### Step 2: Frontend Deployment on Firebase Hosting
1. Install Firebase CLI locally if not already installed:
   ```bash
   npm install -g firebase-tools
   firebase login
   ```
2. Build the frontend for production with the Render backend API base URL:
   ```bash
   export VITE_API_BASE_URL=https://paikarmart-backend.onrender.com
   npm run build
   ```
3. Deploy hosting rules and static files to Firebase:
   ```bash
   firebase deploy --only hosting
   ```
   *(Ensure `firebase.json` points public directory to `apps/frontend/dist`)*

### Step 3: Database & Auth Sync Verification
1. **Supabase SQL**: Ensure tables (`vendors`, `kyc_applications`, `escrows`, `wallets`, `messages`) are migrated and active on Supabase.
2. **Firebase Auth**: In the Firebase Console (Authentication > Sign-in method), ensure **Google** and **Email/Password** are enabled.
3. **End-to-End Test**:
   - Register a new account with email/password or Google sign-in.
   - Verify email address using the email verification button in the Auth modal.
   - Upgrade to a Seller/Merchant account via KYC onboarding.
   - Test B2B wholesale orders, escrow release, and live service bookings.
