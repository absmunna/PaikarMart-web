# 🚀 Paikar Mart - Deployment Guide (Supabase, Vercel & Render)

> **Readiness note:** Vercel + Render deployment configuration is prepared, but production is not ready until Firebase Auth/Firestore usage is migrated and the Firebase project is confirmed. The existing app still stores application data in Firebase Firestore/Storage; Supabase is not yet the sole data source.

GitHub push-এর পর CI build যাচাই করবে এবং connected Vercel/Render services deploy করবে। Supabase-এ production schema auto-sync করা হয় না।

---

## 🗄️ ধাপ ১: Supabase ডাটাবেজ সেটআপ (PostgreSQL)

1. [Supabase](https://supabase.com)-এ লগইন করে একটি নতুন প্রজেক্ট তৈরি করুন (যেমন: `paikarmart-db`)।
2. প্রজেক্টের **Project Settings** -> **Database** অপশনে যান।
3. **Connection string** সেকশনে যান:
   - **URI** মোড নির্বাচন করুন।
   - **Transaction Pooler (Port 6543)** অথবা **Session (Port 5432)** লিংকটি কপি করুন।
   - উদাহরণ: `postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true`
4. আপনার লোকাল মেশিনে একবার টেবিলগুলো তৈরি করার জন্য নিচের কমান্ডটি চালান:
   ```bash
   npm run postinstall
   ```
   Live database-এ `prisma db push` চালাবেন না। Schema migration review ও staging verification ছাড়া production database স্বয়ংক্রিয়ভাবে পরিবর্তন করবেন না।

---

## 🖥️ ধাপ ২: Render-এ ব্যাকএন্ড অটো-ডিপ্লয় (Backend API)

প্রজেক্টের রুটে `render.yaml` আছে। এটি Render-এর always-on `starter` service ব্যবহার করে; এটি paid plan, তাই Blueprint Apply করার আগে Render-এর বর্তমান খরচ দেখে নিন।

1. [Render.com](https://render.com)-এ যান এবং **New +** -> **Blueprint** নির্বাচন করুন।
2. আপনার GitHub রিপোজিটরি (`paikarmart`) সিলেক্ট করুন।
3. Render স্বয়ংক্রিয়ভাবে `render.yaml` ফাইলটি ডিটেক্ট করবে।
4. এনভায়রনমেন্ট ভ্যারিয়েবল (Environment Variables)-এ:
   - `DATABASE_URL`: আপনার Supabase থেকে প্রাপ্ত PostgreSQL Connection String দিন।
   - `CLIENT_URL`: আপনার production Vercel frontend URL দিন।
   - `CORS_ORIGINS`: অনুমোদিত production/preview frontend origin-এর comma-separated exact URL দিন; wildcard ব্যবহার করবেন না।
   - `JWT_SECRET`: Render স্বয়ংক্রিয়ভাবে একটি স্ট্রং সিক্রেট জেনারেট করবে।
5. **Apply** বাটনে ক্লিক করুন। Render ব্যাকএন্ড বিল্ড করে চালু করে দেবে (Health check endpoint: `/api/v1/health`)।

---

## 🌐 ধাপ ৩: Vercel-এ ফ্রন্টএন্ড অটো-ডিপ্লয় (Frontend SPA)

1. [Vercel.com](https://vercel.com)-এ যান এবং **Add New...** -> **Project** সিলেক্ট করুন।
2. আপনার GitHub রিপোজিটরি ইমপোর্ট করুন।
3. **Project Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: repository root (`./`), যাতে `vercel.json` ব্যবহার হয়।
   - Build ও output: `vercel.json`-এ নির্ধারিত।
   - **Output Directory**: `apps/frontend/dist`
4. **Environment Variables**:
   - `VITE_API_BASE_URL`: Render backend-এর API URL দিন (যেমন: `https://paikarmart-backend.onrender.com/api/v1`)।
   - `VITE_SUPABASE_URL` ও `VITE_SUPABASE_ANON_KEY`: browser-safe Supabase project URL ও publishable/anon key; database password বা service-role key নয়।
5. **Deploy** বাটনে ক্লিক করুন।

---

## 🔒 ধাপ ৪: GitHub সিকিউরিটি ও অটোমেটিক ডিপ্লয়মেন্ট

1. **গিট ইগনোর সিকিউরিটি**:
   - `.gitignore`-এ সব ধরণের `.env`, `*.key`, `*.pem`, `*credentials*.json` ইত্যাদি যুক্ত করা হয়েছে। ফলে ভুলবশতও কোনো গোপন পাসওয়ার্ড বা API Key গিটহাবে পুশ হবে না।
   - Firebase Firestore-এ `firestore.rules` deploy করুন। User profile-এর role/roles client থেকে পরিবর্তন করা যায় না; role শুধু trusted Firebase Auth custom claims থেকে নেওয়া হয়।
2. **GitHub Actions**:
   - CI শুধু install, frontend typecheck ও monorepo build চালায়; Supabase schema পরিবর্তন করে না।
   - Vercel ও Render-এ `main` branch connect করে auto-deploy enable করুন।
3. **অটো ডিপ্লয় পরীক্ষা**:
   - কোড পরিবর্তন করে গিটহাবে পুশ করুন:
     ```bash
     git add .
     git commit -m "feat: setup supabase, vercel and render auto deployment"
     git push origin main
     ```
   - GitHub Actions build/typecheck করবে; connected Vercel ও Render services deploy করবে।

## Production blockers

- `firebase-applet-config.json` বর্তমানে `gen-lang-client-0609196204` project নির্দেশ করে। এটি আপনার production Firebase project কি না নিশ্চিত না করে deploy করবেন না।
- Frontend-এর একাধিক service এখনও Firestore/Storage-এ data রাখে; Supabase migration এবং RLS verification সম্পন্ন হয়নি।
- Backend Firebase identity verification configure করা হয়নি। Backend password login/register, `/auth/sync`, ও OTP APIs fail-closed; frontend Firebase email/Google Auth can sign users in, but protected backend APIs will reject Firebase ID tokens until trusted server-side verification is added.
- Phone OTP delivery is not configured; the UI reports this instead of pretending that a code was sent.
- Seller signup এখন buyer account এবং pending application তৈরি করে; trusted admin approval/custom-claims workflow না হওয়া পর্যন্ত seller/admin access দেওয়া হয় না।
- Render production startup-এর জন্য reachable `DATABASE_URL` ও valid `JWT_SECRET` দরকার। CORS-এ production/preview frontend-এর exact origins দিতে হবে।
- এই repository পরিবর্তন কোনো live Vercel/Render service বা Supabase database-এ deploy/migrate করেনি।
