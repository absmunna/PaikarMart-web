# Paikar Mart - Role-Based Authentication & Verification System Architecture

এই ডকুমেন্টটি Paikar Mart সুপার অ্যাপের জন্য একটি স্কেলেবল এবং সিকিউর **Role-Based Authentication & Verification System** (RBAVS)-এর পূর্ণাঙ্গ ডিজাইন প্রস্তাবনা এবং আর্কিটেকচারাল গাইডলাইন উপস্থাপন করে। প্ল্যাটফর্মটির হাইব্রিড সোশ্যাল ও ই-কমার্স ক্যারেক্টার এবং মাল্টি-পোর্টাল এক্সপেরিয়েন্সকে সুরক্ষিত ও নিরবচ্ছিন্ন রাখাই এই সিস্টেমের মূল লক্ষ্য।

---

## ১. রোল ও বিহেভিয়ার অডিট (Role-Permission Matrix)

Paikar Mart-এ মাল্টি-পোর্টাল আর্কিটেকচার সাপোর্ট করার জন্য প্রতিটি ইউজারের একাধিক ডাইনামিক রোল থাকতে পারে। এক্সেস কন্ট্রোলকে আরো দানাদার বা গ্র্যানুলার করার জন্য আমরা **Role-Permission Matrix** প্রস্তাব করছি:

### রোল সংজ্ঞায়ন (Role Definitions)
1. **Guest (অতিথি):** সাধারণ ব্রাউজার। কোনো OTP বা অথেন্টিকেশন ছাড়া শুধুমাত্র প্রোডাক্ট ও সোশ্যাল ফিড দেখতে পারবেন।
2. **Buyer (ক্রেতা):** সাধারণ রেজিস্টার্ড ইউজার। OTP ভেরিফাইড মোবাইল নম্বর যুক্ত। পণ্য কিনতে পারবেন এবং সোশ্যাল ফিডে কমেন্ট/রিঅ্যাক্ট করতে পারবেন।
3. **Seller / Shop Owner (বিক্রেতা):** খুচরা ও পাইকারি ড্যাশবোর্ড অ্যাক্সেস করতে পারবেন। পণ্য লিস্টিং করতে পারেন।
4. **Ride-Sharer / Rider (রাইডার):** লোকাল পোর্টাল থেকে রাইড রিকোয়েস্ট এক্সেপ্ট করতে পারবেন।
5. **Service Provider / Creator (সার্ভিস প্রোভাইডার):** বাসা-বাড়ি সার্ভিস বা ডিজিটাল কনটেন্ট তৈরি/বিক্রি করতে পারবেন।
6. **Administrator / Moderator (অ্যাডমিন):** প্ল্যাটফর্ম ওভারসাইট, পোস্ট মডারেশন এবং ডকুমেন্ট ভেরিফিকেশন প্যানেল অ্যাক্সেস।

---

### Role-Permission Matrix

| মডিউল / পোর্টাল | Guest (গেস্ট) | Buyer (ক্রেতা) | Seller (সেলার) | Ride-Sharer (রাইডার) | Service Provider |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Social Daily Feed Viewing** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Product Listings Viewing** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Post Comments / Reacts** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Post Social Content / Reels**| ❌ | ✅ (Basic) | ✅ (Commercial)| ❌ | ✅ (Professional)|
| **Checkout / Buy Products** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Open Store / List Products**| ❌ | ❌ | ✅ (NID/Trade req)| ❌ | ❌ |
| **Accept Ride Bookings** | ❌ | ❌ | ❌ | ✅ (License req) | ❌ |
| **Provide Local Services** | ❌ | ❌ | ❌ | ❌ | ✅ (Address/Cert req)|
| **Dashboard Controls** | ❌ | ✅ (Customer) | ✅ (Seller Panel)| ✅ (Rider Panel) | ✅ (Provider Panel)|

---

## ২. ডায়নামিক প্রগ্রেসিভ ভেরিফিকেশন (Progressive Verification Process)

ইউজারদের অনবোর্ডিং ফ্রিকশন (Friction) কমাতে আমরা **"প্রগ্রেসিভ ভেরিফিকেশন" (Progressive Verification)** নীতি অনুসরণ করব। এর মানে হলো ক্রেতাকে শুরুতেই দীর্ঘ ফরম পূরণ করতে হবে না, কিন্তু গুরুত্বপূর্ণ স্পর্শকাতর ফিচার ব্যবহারের সময় ধাপে ধাপে তথ্য দিতে হবে।

```
[ Tier 1: Basic Buyer ] ➔ 📱 Mobile OTP (Instant Onboarding)
           │
           ├─► [ Tier 2: Verified Seller ] ➔ 🏢 Trade License + National ID (NID)
           │
           └─► [ Tier 3: Verified Rider ]  ➔ 🪪 Driving License + BRTA Vehicle Reg + Face Match NID
```

### ভেরিফিকেশন টিয়ার ও গেটকিপিং লজিক:

1. **Tier 1 (Basic Verification - Buyer / Customer)**
   * **প্রয়োজনীয় তথ্য:** সচল বাংলাদেশি মোবাইল নম্বর + SMS OTP ভেরিফিকেশন।
   * **সুবিধা:** পণ্য অর্ডার করা, সোশ্যাল ওয়ালে পোস্ট করা, মেসেজ দেওয়া।
   * **গেটকিপিং:** কোনো সরকারি ডকুমেন্টের প্রয়োজন নেই।

2. **Tier 2 (Commercial Verification - Seller / Shop)**
   * **প্রয়োজনীয় তথ্য:** জাতীয় পরিচয়পত্র (NID) নম্বর ও ছবি, ট্রেড লাইসেন্স বা স্টোর অ্যাড্রেস পিন।
   * **সুবিধা:** PK Store-এ বড় ডিল লিস্টিং, হোলসেল হাব বা মার্চেন্ট ব্যাংক অ্যাকাউন্ট কানেকশন।
   * **ব্যাজ প্রাপ্তি:** `Trusted Wholesaler` বা `Verified Merchant` ব্যাজ।

3. **Tier 3 (High-Risk Verification - Ride-Sharer / Delivery Agent)**
   * **প্রয়োজনীয় তথ্য:** NID, বৈধ ড্রাইভিং লাইসেন্স, বিআরটিএ (BRTA) রেজিস্ট্রেশন ডকুমেন্ট, এবং সেলফি ফেস ম্যাচ।
   * **সুবিধা:** ডেলিভারি ও রাইড বুকিং এক্সেপ্ট করার অনুমতি।
   * **সিকিউরিটি:** সম্পূর্ণ ভেরিফাইড না হওয়া পর্যন্ত রাইড এক্সেপ্ট্যান্স বাটন লক থাকবে।

---

## ৩. Supabase ডাটাবেস স্কিমা ও সিকিউরিটি

মাল্টি-পোর্টাল এক্সেস (একই ইউজার বায়ার এবং সেলার/রাইডার হতে পারে) নিশ্চিত করতে রিলেশনাল ডাটাবেস স্কিমা ডিজাইন নিচে দেয়া হলো:

```sql
-- ১. ইউজারদের প্রাইমারি প্রোফাইল টেবিল
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    phone_number TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ২. রোলস টেবিল (মাল্টি-রোল সাপোর্ট করে)
CREATE TABLE public.user_roles (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('buyer', 'seller', 'rider', 'service_provider', 'moderator', 'admin', 'super_admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (user_id, role)
);

-- ৩. প্রগ্রেসিভ ভেরিফিকেশন টেবিল (ডকুমেন্ট ট্র্যাক করার জন্য)
CREATE TABLE public.verifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    doc_type TEXT NOT NULL CHECK (doc_type IN ('NID', 'TRADE_LICENSE', 'DRIVING_LICENSE', 'VEHICLE_REGISTRATION')),
    doc_number TEXT NOT NULL,
    doc_image_front_url TEXT,
    doc_image_back_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewer_note TEXT,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ৪. ইউজার ট্রাস্ট ব্যাজ টেবিল
CREATE TABLE public.user_badges (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    badge_type TEXT NOT NULL CHECK (badge_type IN ('verified', 'trusted_merchant', 'pro_rider', 'top_creator')),
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (user_id, badge_type)
);
```

### Supabase Row Level Security (RLS) Rules:
```sql
-- ইউজার প্রোফাইল আর রিড-অনলি এক্সেস সবার জন্য (সোশ্যাল ফিডে প্রোফাইল দেখার জন্য)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Profiles are viewable by everyone" ON public.profiles 
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles 
    FOR UPDATE USING (auth.uid() = id);

-- ভেরিফিকেশন ডকুমেন্টস রুল (শুধুমাত্র ডকুমেন্টের মালিক ও এডমিন দেখতে পারবে)
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own verifications" ON public.verifications 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can upload their own verifications" ON public.verifications 
    FOR INSERT WITH CHECK (auth.uid() = user_id);
```

---

## ৪. ইউজার প্রোফাইল ও ব্যাজিং সিস্টেম

Mutual Trust বা ক্রেতা-বিক্রেতা ও রাইডারের মধ্যে বিশ্বাস বাড়াতে প্রোফাইলে ডায়নামিক ব্যাজ শো করা হবে:

### ব্যাজ লজিক ইমপ্লিমেন্টেশন:
* **Verified Badge (সবুজ ট্রাস্ট টিক):** Tier 1 (OTP ভেরিফাইড নম্বর) এবং NID সংযুক্ত থাকলে প্রোফাইলের নামের পাশে সবুজ টিক আসবে।
* **Trusted Brand Badge (গোল্ডেন স্টার):** যদি কোনো সেলারের রেটিং ৪.৫ এর বেশি হয় এবং অন্তত ১ বছরের সফল ট্রেড হিস্ট্রি থাকে।
* **Verified Rider (সুরক্ষিত রাইডার ব্যাজ):** শুধুমাত্র ড্রাইভিং লাইসেন্স এবং BRTA রেজিস্ট্রেশন এপ্রুভড হলে রাইডারদের নামের পাশে ভিজ্যুয়াল বাইসাইকেল/মোটরসাইকেল ট্রাস্ট ব্যাজ শো হবে।

---

## ৫. ফ্রিকশন-লেস অনবোর্ডিং ফ্লো-চার্ট (Flowchart Guide)

ক্রেতাদের ফ্রিকশন এড়াতে রেজিস্ট্রেশন ফ্লো ৩টি সহজ ধাপে সম্পন্ন হয়:

```
[ ধাপ ১: কুইক এক্সেস ]
  📱 মোবাইল নম্বর ইনপুট
        ⬇
[ ধাপ ২: ওটিপি ভেরিফিকেশন ]
  💬 এক ক্লিকে SMS OTP কোড সাবমিট
        ⬇
[ ধাপ ৩: বেসিক ইনফো ]
  👤 পুরো নাম + ৮ সংখ্যার পাসওয়ার্ড দিন ➔ 🎉 অনবোর্ডিং সম্পন্ন (Role: BUYER)
```

### বিশেষ পোর্টাল ও প্রগ্রেসিভ প্রম্পট লজিক:
যখন একজন Buyer প্রথমবার ড্যাশবোর্ড থেকে নিচের পোর্টালগুলো ব্যবহার করতে চাইবেন, তখন আমরা এই প্রগ্রেসিভ ভেরিফিকেশন প্রম্পট শো করাবো:

* **কেস এ: "আমি রাইড দিয়ে টাকা আয় করতে চাই"**
  * সিস্টেম চেক করবে: `auth.hasRole('rider')`?
  * যদি না থাকে ➔ একটি মসৃণ **Glassmorphism Drawer** শো করে ড্রাইভিং লাইসেন্স এবং বিআরটিএ ডকুমেন্টস জমা দেওয়ার অনুরোধ জানানো হবে।
  
* **কেস বি: "আমি বি-টু-বি পাইকারি স্টোর লিস্টিং করতে চাই"**
  * সিস্টেম চেক করবে: `auth.hasRole('seller')`?
  * যদি না থাকে ➔ ট্রেড লাইসেন্স ও দোকানের ফিজিক্যাল ঠিকানা ভেরিফাই করার জন্য ফর্ম প্রম্পট শো করবে।

---

## ৬. Paikar Mart আর্কিটেকচারাল কমপ্লায়েন্স

আমাদের গাইডলাইন অনুযায়ী, এই ফিচারগুলি বাস্তবায়নের সময় ফ্রন্টএন্ড এবং ব্যাকএন্ডের মডুলার আর্কিটেকচার কঠোরভাবে মেনে চলা হচ্ছে:
* **UI Primitives:** `/src/components/ui` তে গ্লাস মরফিজম কার্ড ও সুন্দর ইনপুট মডিউল ব্যবহার করা হয়েছে।
* **Domain Feature:** সমস্ত অথেন্টিকেশন লজিক `/src/features/auth` তে এবং স্টেট হ্যান্ডলিং `/src/store` এ কেন্দ্রীভূত।
* **Security Middleware:** ব্যাকএন্ডে JWT এবং প্রগ্রেসিভ রোল চেকিং নিশ্চিত করা হয়েছে।
