# PaikarMart — Auth, Login & Registration Architectural Plan
> **Document Status:** Active Specification & Audit Master  
> **Target System:** User & Seller Authentication, Login & Registration Subsystem  
> **Market Context:** Bangladesh First (Dual-Language BN + EN Support)  

---

## 📐 1. UI/UX & Architectural Design Overview (ডিজাইন আর্কিটেকচার)

PaikarMart-এর Authentication এবং Onboarding ব্যবস্থাটি ক্রেতা (Buyer/Customer) এবং বিক্রেতা (Merchant/Vendor)-দের জন্য আলাদা কিন্তু সুসংগঠিতভাবে ডিজাইন করা হয়েছে:

### 🎨 Visual Identity & Styling Principles
* **Theme & Canvas:** জামদানি প্যাটার্নের সূক্ষ্ম ব্যাকগ্রাউন্ড ওভারলে সহ PaikarMart-এর প্রাইমারি ব্র্যান্ড কালার গ্রীন (`#00a859`), গ্লাস-মর্ফিজম ড্রপ-শ্যাডো, এবং ডার্ক/লাইট মোড সাপোর্ট।
* **Responsive Layout:** মোবাইল ও ডেসটপ ডিভাইসে মসৃণ ব্যবহারের জন্য ৪৪ পিক্সেল প্লাস টাচ টার্গেট এবং রেসপন্সিভ গ্রিড।
* **Bilingual Support:** সকল হেডার, লেবেল, হেল্পার টেক্সট ও এরর মেসেজে বাংলা ও ইংরেজি উভয় ভাষার স্পষ্ট উপস্থাপন।

### 👤 Customer Onboarding Stream (`/auth/register`)
* **লক্ষ্য:** সাধারণ ক্রেতাদের ১ মিনিটের মধ্যে প্ল্যাটফর্মে যুক্ত করা।
* **ইনপুট ফিল্ডস:** নাম (Full Name), মোবাইল নম্বর (BD Format: `01XXXXXXXXX`), ইমেইল (ঐচ্ছিক), এবং পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)।
* **রোল নির্ধারণ:** স্বয়ংক্রিয়ভাবে `buyer` রোল এবং `customer` RoleGroup প্রদান করে।
* **স্বয়ংক্রিয় পারমিশন:** কেনাকাটা (`CAN_BUY`), প্রোডাক্ট ব্রাউজিং (`CAN_BROWSE`), এবং রিভিউ প্রদান (`CAN_REVIEW`)।

### 🛍️ Smart Seller Registration Wizard (`/auth/wizard`)
* **লক্ষ্য:** সকল শ্রেণির বিক্রেতাদের জন্য একটি একক মাল্টি-স্টেপ স্মার্ট উইজার্ড।
* **স্টেপ ১ (Identity Setup):** বেসিক অ্যাকাউন্ট তথ্য (নাম, ফোন, পাসওয়ার্ড)।
* **স্টেপ ২ (Persona Selection):**
  * 🏪 **Retail Seller:** খুচরা বিক্রেতা
  * 📦 **Wholesale / B2B:** পাইকারি বিক্রেতা
  * 🏭 **Factory / Manufacturer:** কারখানা ও প্রস্তুতকারক
  * 🌾 **Rural Merchant:** গ্রামীণ ও কৃষি উদ্যোক্তা
  * 🏍️ **Delivery Rider:** লজিস্টিকস ও ডেলিভারি পার্টনার
  * 🛠️ **Service Provider:** সেবাদাতা
* **স্টেপ ৩ (Business & KYC Setup):** শপের নাম, BD Address Selector (বিভাগ ➔ জেলা ➔ উপজেলা ➔ এলাকা ➔ জিপ কোড), NID/ট্রেড লাইসেন্স নম্বর, এবং বিকাশ/নগদ/ব্যাংক পেমেন্ট ডিটেইলস।
* **রোল নির্ধারণ:** নির্ধারিত ক্যাটাগরি রোল (যেমন `retail_seller`, `factory_seller`, `rider`) এবং `vendor` RoleGroup বরাদ্দ করা।

### 🔑 Unified Login Portal (`/auth/login`)
* **ফ্লেক্সিবল ইনপুট:** মোবাইল নম্বর (`01XXXXXXXXX`) অথবা ইমেইল দিয়ে পাসওয়ার্ডের মাধ্যমে লগইন।
* **সোশ্যাল সাইন-ইন:** গুগল সাইন-ইন সাপোর্ট।
* **ডেমো অ্যাকাউন্ট স্যুইচার:** ডেভেলপমেন্ট ও টেস্টের জন্য দ্রুত লগইন করার অপশন।

### 🔐 Security & Session Specifications (সেশন ও সিকিউরিটি)
* **JWT & Token Storage:** টোকেন ভিত্তিক পারসিস্টেন্স (`paikarmart_token` ও `paikarmart_user` স্পেসিফিকেশন) এবং HTTP Bearer হেডার সিকিউরিটি।
* **SMS OTP Gateway Readiness:** বাংলাদেশ এসএমএস গেটওয়ে (Greenweb/SSL Wireless) সাপোর্ট সংহতকরণের জন্য ফোন ভেরিফিকেশন আর্কিটেকচার।
* **Role-Based Post-Auth Redirection:**
  * `customer` RoleGroup ➔ পূর্বের পেজ (`from`) অথবা মূল হোমপেজ (`/`)
  * `vendor` RoleGroup ➔ সেলার ড্যাশবোর্ড (`/seller-central`)
  * `admin` RoleGroup ➔ অ্যাডমিন গভর্ন্যান্স সেন্টার (`/admin`)
* **Quick AuthModal / Pop-up Overlay:** পপ-আপ মোডাল সাপোর্ট যাতে প্রোডাক্ট কেনাকাটা বা উইশলিস্টের সময়ে পুরো পেজ রিলোড ছাড়া দ্রুত লগইন করা যায়।

---

## 🔍 2. Hard Audit & Identified Issues (বর্তমান সমস্যা ও ত্রুটিসমূহ)

কোডবেস অডিট করে নিচের ৬টি মূল সমস্যা ও অসামঞ্জস্যতা চিহ্নিত করা হয়েছে:

### ❌ Issue 1: কাস্টমার রেজিস্ট্রেশন রুট বাইপাস
* **ঘটনা:** `routeConfig.ts`-এ `/auth/register` রুটটি কাস্টমার রেজিস্টার পেজের (`register.tsx`) বদলে `RegistrationWizard.tsx` (মার্চেন্ট উইজার্ড)-এর সাথে পয়েন্ট করা ছিল।
* **ফলাফল:** সাধারণ ক্রেতারা অ্যাকাউন্ট খুলতে চাইলে ভুলবশত সেলার ভেরিফিকেশন উইজার্ডে চলে যেত।

### ❌ Issue 2: ডুপ্লিকেট সেলার উইজার্ড কোডবেস (Rule 1 & Rule 4 Violation)
* **ঘটনা:** প্রজেক্টে দুটি বিশালাকার ডুপ্লিকেট উইজার্ড ফাইল রয়েছে:
  1. `src/pages/auth/RegistrationWizard.tsx` (১২৮২ লাইন)
  2. `src/features/registration/SmartSellerWizard.tsx` (৭২৬ লাইন)
* **ফলাফল:** একই ফর্ম ও স্টেট লজিক দুটি ভিন্ন ফাইলে ডুপ্লিকেট হয়ে আছে যা কোডবেসের বিশ্বস্ততা নষ্ট করে।

### ❌ Issue 3: `from` রিডাইরেক্ট ইউআরএল মিসিং
* **ঘটনা:** চেকআউট (`/checkout`) বা অর্ডার পেজ থেকে রেজিস্টার করলে রেজিস্ট্রেশন শেষে ইউজারকে সরাসরি মূল হোমপেজে (`/`) পাঠিয়ে দেওয়া হয়।
* **ফলাফল:** ইউজারকে আবার কষ্ট করে চেকআউট পেজে ম্যানুয়ালি ফিরে আসতে হয়।

### ❌ Issue 4: অটোরিডাইরেক্ট লজিক মিসিং
* **ঘটনা:** `login.tsx`-এ ইউজার আগে থেকে লগইন করা থাকলে অটোরিডাইরেক্ট করা হয়, কিন্তু `register.tsx` ফর্মে লগইন করা ইউজার গেলেও ফর্ম খোলা থাকে।

### ❌ Issue 5: সোশ্যাল লগইন অপশন অসামঞ্জস্যতা
* **ঘটনা:** লগইন পেজে `SocialLogin` (Google OAuth) থাকলেও রেজিস্ট্রেশন ফর্মে সোশ্যাল রেজিস্ট্রেশন বোতাম অনুপস্থিত।

### ❌ Issue 6: ইনপুট ভ্যালিডেশন বৈষম্য
* **ঘটনা:** লগইন ফর্মে ফোন ও ইমেইল সমানভাবে গ্রহণযোগ্য হলেও কাস্টমার রেজিস্ট্রেশন ফর্মে ফোন নম্বর বাংলাদেশি ফরম্যাটে নির্দিষ্ট করা, যা আন্তর্জাতিক কাস্টমারদের আটকে দেয়।

---

## 🛠️ 3. Problem Solving Architecture & Plan (সমাধানের প্ল্যান)

কোনো ডুপ্লিকেট ফাইল না রেখে এবং সিস্টেমে সমস্যা তৈরি না করে ১-বাই-১ সমাধানের রূপরেখা:

```
+-----------------------------------------------------------------------+
|                       PaikarMart Auth Ecosystem                       |
+-----------------------------------------------------------------------+
                                    |
          +-------------------------+-------------------------+
          |                                                   |
   /auth/login                                         /auth/register
(Unified Login)                                    (Customer Sign-Up)
   - Phone / Email Identifier                         - Quick 2-Step Form
   - Password / Google OAuth                          - Social Register
   - Retains ?from= Redirect                          - Retains ?from= Redirect
          |                                                   |
          +-------------------------+-------------------------+
                                    |
                             /auth/wizard
                      (Smart Merchant Wizard)
          - Single Source of Truth (@features/registration)
          - 6 Seller Personas (Retail, Wholesale, Factory, Rural, Rider, Service)
          - BD Address Selector & KYC Verification
```

### 📋 Phase 1: Route Standardization & Clean Redirection
1. `src/app/AppShell/routeConfig.ts`-এ রুটগুলো সুনির্দিষ্ট করা:
   * `/auth/login` ➔ `src/pages/auth/login.tsx`
   * `/auth/register` ➔ `src/pages/auth/register.tsx`
   * `/auth/wizard` ➔ `src/features/registration/SmartSellerWizard.tsx`
2. ডুপ্লিকেট রুট ফাইলসমূহকে (`seller-register.tsx`, `factory-register.tsx`, ইত্যাদি) সরাসরি `/auth/wizard?type=...` এ ক্লিন রিডাইরেক্ট দেওয়া।

### 📋 Phase 2: Consolidation to Single Source of Truth
1. `RegistrationWizard.tsx`-এর প্রয়োজনীয় ফিচারসমূহ `src/features/registration/SmartSellerWizard.tsx` ফাইলে মার্জ করা।
2. ডুপ্লিকেট ফাইল অপসারণ করে একটি সুনির্দিষ্ট **Single Source of Truth** উইজার্ড নিশ্চিত করা।

### 📋 Phase 3: UX & State Harmonization
1. **Redirect Memory:** রেজিস্ট্রেশন সফল হওয়ার পর `from` ইউআরএল চেক করে সেখানে ফেরত পাঠানোর লজিক যুক্ত করা।
2. **Role-Based Post-Login Landing:** ইউজার রোল অনুযায়ী সঠিক ড্যাশবোর্ডে পাঠানো (`customer` ➔ `from`/`/`, `vendor` ➔ `/seller-central`, `admin` ➔ `/admin`)।
3. **Auth State Check:** রেজিস্টার পেজে ঢুকলে ইউজার ইতিমধ্যেই লগইন করা থাকলে স্বয়ংক্রিয়ভাবে অটোরিডাইরেক্ট করা।
4. **Social Register Integration:** `register.tsx` ফর্মে `SocialLogin` কম্পোনেন্ট যুক্ত করা।
5. **Quick AuthModal & OTP Readiness:** ইন-লাইন পপ-আপ লগইন মোডাল নিশ্চিতকরণ এবং বাংলাদেশ এসএমএস গেটওয়ের (OTP) কানেক্টর রেডি রাখা।

### 📋 Phase 4: Verification & Automated Auditing
1. `npm run lint` ও `tsc --noEmit` চালিয়ে কোনো সিনট্যাক্স বা টাইপ এরর নেই তা নিশ্চিত করা।
2. কাস্টমার রেজিস্ট্রেশন এবং সেলার উইজার্ড রেজিস্ট্রেশন উভয় ক্ষেত্রেই সঠিক `roleGroup` (`customer` / `vendor`) এবং JWT টোকেন ইস্যু হচ্ছে কিনা টেস্ট করা।

---

> **Note:** এই ডকুমেন্টেশন ফাইলটি `documentation/AUTH_LOGIN_REGISTER_PLAN.md` হিসেবে সংরক্ষণ করা হলো।
