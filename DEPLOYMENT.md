# 🚀 Paikar Mart - Deployment Guide (Supabase, Vercel & Render)

পাইকার মার্ট (Paikar Mart) প্রজেক্টটি GitHub-এ পুশ করার সাথে সাথে যেন **Supabase (Database)**, **Render (Backend)** এবং **Vercel (Frontend)**-এ স্বয়ংক্রিয়ভাবে (Auto-Deploy) লাইভ হয়ে যায়, তার জন্য প্রয়োজনীয় সমস্ত কনফিগারেশন প্রস্তুত করা হয়েছে।

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
   DATABASE_URL="আপনার_কপিকৃত_SUPABASE_URL" npm run postinstall && cd packages/database && npx prisma db push
   ```
   *(অথবা GitHub Actions-এ `DATABASE_URL` সিক্রেট যোগ করলে পুশ করার সাথে সাথে অটো সিঙ্ক হবে!)*

---

## 🖥️ ধাপ ২: Render-এ ব্যাকএন্ড অটো-ডিপ্লয় (Backend API)

প্রজেক্টের রুটে `render.yaml` কনফিগার করা আছে, যার ফলে রেন্ডারে ১-ক্লিকে অটো সেটআপ হবে:

1. [Render.com](https://render.com)-এ যান এবং **New +** -> **Blueprint** নির্বাচন করুন (অথবা **Web Service**)।
2. আপনার GitHub রিপোজিটরি সিলেক্ট করুন।
3. **Build & Start Commands** (Blueprint ব্যবহার করলে স্বয়ংক্রিয়ভাবে সেট হয়ে যাবে):
   - **Build Command**: `npm install && cd packages/database && npx --yes prisma generate && cd ../../apps/backend && npm run build`
   - **Start Command**: `node apps/backend/dist/server.js`
   - **Health Check Path**: `/api/v1/health`
4. **Environment Variables (এনভায়রনমেন্ট ভ্যারিয়েবলস)** - কোন কি কোথায় পাবেন:
   - `DATABASE_URL`: Supabase -> Project Settings -> Database -> Connection string (URI) -> Transaction Pooler (Port 6543)
     - ফরম্যাট: `postgresql://postgres.svhckgdpbfasmuzcekrd:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true`
     *(পাসওয়ার্ডে স্পেশাল ক্যারেক্টার থাকলে তা percent-encode করতে হবে)*
   - `DIRECT_URL`: Supabase -> Project Settings -> Database -> Connection string (URI) -> Direct Connection (Port 5432)
     - ফরম্যাট: `postgresql://postgres:[YOUR-PASSWORD]@db.svhckgdpbfasmuzcekrd.supabase.co:5432/postgres`
   - `CLIENT_URL`: `https://paikarmart.com`
     *(আপনার নিজস্ব ডোমেইন `https://paikarmart.com` দিবেন। ব্যাকএন্ডের CORS স্বয়ংক্রিয়ভাবে `https://paikarmart.vercel.app` এবং `https://paikarmart.com` উভয়কেই অনুমতি দেয়)*
   - `CORS_ORIGINS`: `https://paikarmart.com,https://www.paikarmart.com,https://paikarmart.vercel.app`
   - `JWT_SECRET`: Render Blueprint স্বয়ংক্রিয়ভাবে স্ট্রং সিক্রেট তৈরি করবে (অথবা যেকোনো ৩২+ অক্ষরের সিক্রেট কি)
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
5. **Apply** বাটনে ক্লিক করুন। Render ব্যাকএন্ড বিল্ড করে চালু করে দেবে (Health check endpoint: `/api/v1/health`)।

---

## 🌐 ধাপ ৩: Vercel-এ ফ্রন্টএন্ড অটো-ডিপ্লয় (Frontend SPA)

1. [Vercel.com](https://vercel.com)-এ যান এবং **Add New...** -> **Project** সিলেক্ট করুন।
2. আপনার GitHub রিপোজিটরি ইমপোর্ট করুন।
3. **Project Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (রুট থেকে হলে `vercel.json` স্বয়ংক্রিয়ভাবে হ্যান্ডেল করবে)
   - **Build Command**: `cd packages/database && npx --yes prisma generate && cd ../../apps/frontend && npm run build`
   - **Output Directory**: `apps/frontend/dist`
4. **Environment Variables**:
   - `VITE_API_BASE_URL`: রেন্ডার ব্যাকএন্ডের লাইভ URL + `/api/v1` দিন (যেমন: `https://paikarmart-backend.onrender.com/api/v1`)
   - `VITE_SUPABASE_URL`: `https://svhckgdpbfasmuzcekrd.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: Supabase Dashboard -> Project Settings -> API -> Project API Keys -> `anon` `public` কি-টি কপি করে এখানে পেস্ট করুন।
5. **Domains**:
   - Vercel প্রজেক্টের **Settings** -> **Domains**-এ গিয়ে আপনার কাস্টম ডোমেইন `paikarmart.com` ও `www.paikarmart.com` অ্যাড করুন।
6. **Deploy** বাটনে ক্লিক করুন।

---

## 🔒 ধাপ ৪: GitHub সিকিউরিটি ও অটোমেটিক ডিপ্লয়মেন্ট

1. **গিট ইগনোর সিকিউরিটি**:
   - `.gitignore`-এ সব ধরণের `.env`, `*.key`, `*.pem`, `*credentials*.json` ইত্যাদি যুক্ত করা হয়েছে। ফলে ভুলবশতও কোনো গোপন পাসওয়ার্ড বা API Key গিটহাবে পুশ হবে না।
2. **GitHub Actions Secrets**:
   - আপনার রিপোজিটরির **Settings** -> **Secrets and variables** -> **Actions**-এ গিয়ে:
     - `DATABASE_URL`: আপনার Supabase কানেকশন স্ট্রিং সেট করুন।
3. **অটো ডিপ্লয় পরীক্ষা**:
   - কোড পরিবর্তন করে গিটহাবে পুশ করুন:
     ```bash
     git add .
     git commit -m "feat: setup supabase, vercel and render auto deployment"
     git push origin main
     ```
   - GitHub Actions বিল্ড ও টাইপচেক ভ্যালিডেট করবে।
   - Vercel এবং Render তাৎক্ষণিকভাবে নতুন বিল্ড অটোমেটিক ডিপ্লয় করবে!
