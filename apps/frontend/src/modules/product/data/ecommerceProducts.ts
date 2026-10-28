export interface EcommerceProduct {
  id: string;
  asin?: string;
  name: string;
  title?: string;
  category: "wholesale" | "retail" | "fashion" | "electronics" | "grocery" | "pharmacy" | "dropship";
  price: number;
  originalPrice?: number;
  discount?: number;
  moq?: number;
  unit?: string;
  image: string;
  images?: string[];
  description?: string;
  sellerName: string;
  sellerLocation: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  stock: number;
  variants?: string[];
  colors?: string[];
}

export const ECOMMERCE_PRODUCTS: EcommerceProduct[] = [
  // ─── Wholesale / B2B ───
  {
    id: "wh-1",
    asin: "PASIN-B08WH01",
    name: "এক্সপোর্ট কোয়ালিটি কটন ড্রপ-শোল্ডার টি-শার্ট লট",
    title: "এক্সপোর্ট কোয়ালিটি কটন ড্রপ-শোল্ডার টি-শার্ট লট (১৮০ GSM)",
    category: "wholesale",
    price: 180,
    originalPrice: 250,
    discount: 28,
    moq: 50,
    unit: "পিস",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80"
    ],
    description: "১০০% প্রিমিয়াম কম্বড রিংস্পান কটন (১৮০ GSM) দিয়ে তৈরি এক্সপোর্ট কোয়ালিটি ওভারসাইজড ড্রপ-শোল্ডার টি-শার্ট। নিখুঁত স্টিচিং, রিয়্যাক্টিভ ডাই এবং দীর্ঘস্থায়ী কালার গ্যারান্টি। পাইকারি বিক্রেতা ও ব্র্যান্ড উদ্যোক্তাদের জন্য আদর্শ।",
    sellerName: "আহসান টেক্সটাইল ও গার্মেন্টস",
    sellerLocation: "টঙ্গী, গাজীপুর",
    isVerified: true,
    rating: 4.8,
    reviewCount: 142,
    stock: 5000,
    variants: ["M (38)", "L (40)", "XL (42)", "XXL (44)"],
    colors: ["Black", "White", "Navy Blue", "Olive Green", "Maroon"]
  },
  {
    id: "wh-2",
    asin: "PASIN-B08WH02",
    name: "জেনুইন লেদার প্রিমিয়াম মানিব্যাগ পাইকারি লট",
    title: "জেনুইন লেদার প্রিমিয়াম মানিব্যাগ পাইকারি লট (হস্তনির্মিত)",
    category: "wholesale",
    price: 320,
    originalPrice: 450,
    discount: 29,
    moq: 20,
    unit: "পিস",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80"
    ],
    description: "হাজারীবাগের ট্যানারি গ্রেড এ খাঁটি গরুর চামড়া দিয়ে তৈরি প্রিমিয়াম লেদার মানিব্যাগ। মাল্টিপল কার্ড স্লট, ফুল কয়েন পকেট এবং ডাবল কারেন্সি চেম্বার। রিটেল শপ বা কর্পোরেট গিফটিংয়ের জন্য সেরা পাইকারি ডিল।",
    sellerName: "রয়্যাল লেদার ক্রাফট",
    sellerLocation: "হাজারীবাগ, ঢাকা",
    isVerified: true,
    rating: 4.7,
    reviewCount: 89,
    stock: 800,
    variants: ["Standard Bi-fold", "Slim Tri-fold"],
    colors: ["Deep Brown", "Classic Black", "Tan Brown"]
  },
  {
    id: "wh-3",
    asin: "PASIN-B08WH03",
    name: "সোলার প্যানেল ৩৩০W ইন্ডাস্ট্রিয়াল এনার্জি প্যাক",
    title: "সোলার প্যানেল ৩৩০W ইন্ডাস্ট্রিয়াল মনোক্রিস্টালাইন এনার্জি প্যাক",
    category: "wholesale",
    price: 12500,
    originalPrice: 15000,
    discount: 16,
    moq: 5,
    unit: "ইউনিট",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80",
      "https://images.unsplash.com/photo-1508873696983-2df5293cb325?w=800&q=80"
    ],
    description: "উচ্চ ক্ষমতাসম্পন্ন ৩৩০ ওয়াট মনোক্রিস্টালাইন সোলার প্যানেল। কারখানা, খামার ও বাণিজ্যিক ভবনের সৌর বিদ্যুৎ উৎপাদনের জন্য নির্ভরযোগ্য ও ২৫ বছরের এফিশিয়েন্সি ওয়ারেন্টিযুক্ত।",
    sellerName: "গ্রীন পাওয়ার টেকনোলজিস",
    sellerLocation: "মতিঝিল, ঢাকা",
    isVerified: true,
    rating: 4.9,
    reviewCount: 38,
    stock: 120,
    variants: ["330W Mono", "350W Bi-facial"]
  },

  // ─── Retail ───
  {
    id: "ret-1",
    asin: "PASIN-B08RET01",
    name: "দিনাজপুরের সুগন্ধি কাটারিভোগ চাল (প্রিমিয়াম)",
    title: "দিনাজপুরের ঐতিহ্যবাহী সুগন্ধি কাটারিভোগ চাল (প্রিমিয়াম গ্রেড)",
    category: "retail",
    price: 135,
    originalPrice: 155,
    discount: 13,
    unit: "কেজি",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80"
    ],
    description: "দিনাজপুরের উর্বর পলিমটিতে উৎপাদিত আসল সুগন্ধি কাটারিভোগ চাল। পোলাও, বিরিয়ানি ও পায়েসের জন্য অনন্য স্বাদ ও নজরকাড়া সুবাস। ১০০% পলিশ ও কেমিক্যালমুক্ত ফ্রেশ চাল।",
    sellerName: "নর্থ বেঙ্গল এগ্রো ট্রেডার্স",
    sellerLocation: "দিনাজপুর সদর",
    isVerified: true,
    rating: 4.9,
    reviewCount: 310,
    stock: 2500,
    variants: ["5 KG Sack", "10 KG Sack", "25 KG Bag"]
  },
  {
    id: "ret-2",
    asin: "PASIN-B08RET02",
    name: "টাঙ্গাইল ট্র্যাডিশনাল হ্যান্ডলুম তাঁতের সুতি শাড়ি",
    title: "টাঙ্গাইল ট্র্যাডিশনাল হ্যান্ডলুম জামদানি মোটিফ সুতি শাড়ি",
    category: "retail",
    price: 1850,
    originalPrice: 2400,
    discount: 23,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80"
    ],
    description: "টাঙ্গাইলের ঐতিহ্যবাহী দক্ষ তাঁতিদের হাতে বোনা খাঁটি সুতি শাড়ি। আরামদায়ক সফট ফেব্রিক, দৃষ্টিনন্দন পাড় ও আঁচলের ক্লাসিক ডিজাইন। যেকোনো ঘরোয়া বা আনুষ্ঠানিক আয়োজনে মানানসই।",
    sellerName: "ঐতিহ্য শাড়ি সম্ভার",
    sellerLocation: "বাজিতপুর, টাঙ্গাইল",
    isVerified: true,
    rating: 4.8,
    reviewCount: 94,
    stock: 45,
    colors: ["Red & Gold", "Navy & Silver", "Emerald Green", "Mustard Yellow"]
  },
  {
    id: "ret-3",
    asin: "PASIN-B08RET03",
    name: "খাঁটি কাঠের ঘানির সরিষার তেল (১ লিটার কাচের বোতল)",
    title: "খাঁটি কাঠের ঘানির প্রথম চাপ সরিষার তেল (১ লিটার)",
    category: "retail",
    price: 360,
    originalPrice: 420,
    discount: 14,
    unit: "বোতল",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80"
    ],
    description: "দেশি মাঘী সরিষা থেকে কাঠের ঘানিতে ভাঙানো ১০০% খাঁটি ঝাঁঝালো সরিষার তেল। কোনো রাসায়নিক বা ভেজাল মিশ্রণ ছাড়া ন্যাচারাল ফিল্টারড। ভর্তা, রান্না ও স্বাস্থ্যের জন্য অতুলনীয়।",
    sellerName: "খাঁটি ফুড প্রোডাক্টস",
    sellerLocation: "বাঘা, রাজশাহী",
    isVerified: true,
    rating: 4.9,
    reviewCount: 220,
    stock: 350,
    variants: ["1 Litre Glass Bottle", "2 Litre Canister", "5 Litre Family Jar"]
  },

  // ─── Fashion ───
  {
    id: "fsh-1",
    asin: "PASIN-B08FSH01",
    name: "প্রিমিয়াম লিনেন কটন কাবলি সেট (এলিগ্যান্ট কালেকশন)",
    title: "প্রিমিয়াম লিনেন কটন কাবলি সেট উইথ পায়জামা",
    category: "fashion",
    price: 2450,
    originalPrice: 3200,
    discount: 23,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e16?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4b4e16?w=800&q=80"
    ],
    description: "ক্লাসিক ডিজাইনের প্রিমিয়াম লিনেন কটন কাবলি ও ম্যাচিং পায়জামা সেট। দৃষ্টিনন্দন বোতাম, ফিটিং কাটিং ও প্রিমিয়াম ফিনিশিং যা জুমার নামাজ, ঈদ ও উৎসবের জন্য পারফেক্ট।",
    sellerName: "আল-আমিন ফ্যাশন হাউজ",
    sellerLocation: "এলিফ্যান্ট রোড, ঢাকা",
    isVerified: true,
    rating: 4.7,
    reviewCount: 178,
    stock: 65,
    variants: ["Size 40", "Size 42", "Size 44", "Size 46"],
    colors: ["Off-White", "Midnight Black", "Steel Grey", "Sky Blue"]
  },
  {
    id: "fsh-2",
    asin: "PASIN-B08FSH02",
    name: "আল্ট্রা-কমফোর্ট স্লিম ফিট ডেনিম জিন্স",
    title: "আল্ট্রা-কমফোর্ট স্ট্রেচেবল স্লিম ফিট ডেনিম জিন্স",
    category: "fashion",
    price: 1150,
    originalPrice: 1550,
    discount: 25,
    image: "https://images.unsplash.com/photo-1542272604-780c96856592?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1542272604-780c96856592?w=800&q=80"
    ],
    description: "১২.৫ আউন্স হেভি ডেনিম ফ্যাব্রিক, হালকা স্ট্রেচ এবং দীর্ঘস্থায়ী রিভেটেড স্টিচিং। ফ্যাশনেবল ডার্ক ফেডেড ওয়াশ ও প্রিমিয়াম ব্রাস জিপার।",
    sellerName: "ডেনিম ওয়ার্ল্ড বিডি",
    sellerLocation: "মিরপুর-১০, ঢাকা",
    isVerified: true,
    rating: 4.6,
    reviewCount: 88,
    stock: 120,
    variants: ["30", "32", "34", "36", "38"],
    colors: ["Dark Navy Fade", "Light Washed Blue", "Charcoal Black"]
  },
  {
    id: "fsh-3",
    asin: "PASIN-B08FSH03",
    name: "দুবাই প্রিমিয়াম চেরি জর্জেট এমব্রয়ডারি আবায়া",
    title: "দুবাই প্রিমিয়াম চেরি জর্জেট এমব্রয়ডারি ডিজাইনার আবায়া",
    category: "fashion",
    price: 3200,
    originalPrice: 4000,
    discount: 20,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80"
    ],
    description: "দুবাই থেকে আমদানিকৃত অরজিনাল চেরি জর্জেট কাপড়ে নিখুঁত হ্যান্ড এমব্রয়ডারি ও স্টোন ওয়ার্ক সম্বলিত প্রিমিয়াম আবায়া বোরকা। ম্যাচিং হিজাব সাথে অন্তর্ভুক্ত।",
    sellerName: "হিজাব ও আবায়া লাউঞ্জ",
    sellerLocation: "বসুন্ধরা সিটি, ঢাকা",
    isVerified: true,
    rating: 4.9,
    reviewCount: 145,
    stock: 40,
    variants: ["52 Inch", "54 Inch", "56 Inch"],
    colors: ["Classic Black", "Coffee Mocca", "Plum Purple"]
  },

  // ─── Electronics ───
  {
    id: "el-1",
    asin: "PASIN-B08ELEC01",
    name: "Samsung Galaxy A55 5G (8GB/128GB Official)",
    title: "Samsung Galaxy A55 5G (Awesome Iceblue, 8GB RAM, 128GB Storage)",
    category: "electronics",
    price: 44999,
    originalPrice: 49999,
    discount: 10,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80"
    ],
    description: "সুপার অ্যামোলেড ১২০Hz ডিসপ্লে, ফ্ল্যাগশিপ এক্সিনস প্রসেসর, ৫০ মেগাপিক্সেল অপটিক্যাল ইমেজ স্ট্যাবিলাইজার ট্রিপল ক্যামেরা এবং ৫০০০mAh ব্যাটারি। ১ বছরের অফিশিয়াল ওয়ারেন্টি।",
    sellerName: "গ্যাজেট প্ল্যানেট বাংলাদেশ",
    sellerLocation: "যমুনা ফিউচার পার্ক, ঢাকা",
    isVerified: true,
    rating: 4.8,
    reviewCount: 260,
    stock: 18,
    variants: ["8GB/128GB", "12GB/256GB"],
    colors: ["Awesome Iceblue", "Awesome Navy", "Awesome Lilac"]
  },
  {
    id: "el-2",
    asin: "PASIN-B08ELEC02",
    name: "ANC ট্রু ওয়্যারলেস স্টেরিও ব্লুটুথ ইয়ারবাডস",
    title: "অ্যাক্টিভ নয়েজ ক্যান্সেলেশন (ANC) ট্রু ওয়্যারলেস স্টেরিও বাডস প্রো",
    category: "electronics",
    price: 2199,
    originalPrice: 2999,
    discount: 27,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80"
    ],
    description: "৩৫dB অ্যাক্টিভ নয়েজ ক্যান্সেলেশন, ট্রান্সপারেন্সি মোড, ডিপ বেস সাউন্ড ড্রাইভার এবং কেস সহ ৩৬ ঘণ্টার প্লেব্যাক ব্যাকআপ। IPX5 পানি ও ঘাম প্রতিরোধী।",
    sellerName: "সাউন্ডটেক বাংলাদেশ",
    sellerLocation: "মোতালেব প্লাজা, ঢাকা",
    isVerified: true,
    rating: 4.7,
    reviewCount: 184,
    stock: 90,
    colors: ["Matte Black", "Pearl White"]
  },
  {
    id: "el-3",
    asin: "PASIN-B08ELEC03",
    name: "Smart Watch Ultra AMOLED ডিসপ্লে ও কলিং",
    title: "Smart Watch Ultra 2.02 Inch HD AMOLED ডিসপ্লে ব্লুটুথ কলিং ঘড়ি",
    category: "electronics",
    price: 2850,
    originalPrice: 3800,
    discount: 25,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80"
    ],
    description: "টাইটানিয়াম অ্যালয় ফ্রেম, অলওয়েজ অন ডিসপ্লে, হার্ট রেট ও SpO2 হেলথ সেন্সর, ওয়্যারলেস ফাস্ট চার্জিং এবং রিসিভ/কল করার সম্পূর্ণ সুবিধা। দুটি স্ট্র্যাপ ফ্রি।",
    sellerName: "ডিজিটাল হাব বিডি",
    sellerLocation: "নিউ মার্কেট, ঢাকা",
    isVerified: true,
    rating: 4.6,
    reviewCount: 112,
    stock: 55,
    colors: ["Titanium Silver & Orange", "Midnight Black"]
  },

  // ─── Grocery ───
  {
    id: "gr-1",
    asin: "PASIN-B08GROC01",
    name: "পদ্মা নদীর রূপালী ইলিশ (তাজা বরফ ছাড়া, ১.২ কেজি)",
    title: "পদ্মা নদীর আসল রূপালী ইলিশ মাছ (১.২ কেজি সাইজ, তাজা)",
    category: "grocery",
    price: 1650,
    originalPrice: 2000,
    discount: 17,
    unit: "পিস",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"
    ],
    description: "চাঁদপুরের পদ্মা নদী থেকে সরাসরি সংগৃহীত তাজা রূপালী ইলিশ। কোনো মেডিসিন বা বরফ ছাড়া সরাসরি কোল্ড-চেইন সাপ্লাইয়ের মাধ্যমে দ্রুত ডেলিভারি নিশ্চিত।",
    sellerName: "চাঁদপুর ইলিশ আড়ৎ",
    sellerLocation: "কারওয়ান বাজার, ঢাকা",
    isVerified: true,
    rating: 4.9,
    reviewCount: 420,
    stock: 80,
    variants: ["1.0 KG - 1.1 KG", "1.2 KG - 1.3 KG", "1.5 KG Large"]
  },
  {
    id: "gr-2",
    asin: "PASIN-B08GROC02",
    name: "সুন্দরবনের প্রাকৃতিক খাঁটি খলিশা ফুলের মধু",
    title: "সুন্দরবনের প্রাকৃতিক ১০০% খাঁটি খলিশা ফুলের মধু (১ কেজি কাচের জার)",
    category: "grocery",
    price: 950,
    originalPrice: 1200,
    discount: 21,
    unit: "কেজি",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80"
    ],
    description: "মৌয়ালদের মাধ্যমে সুন্দরবনের গভীর অরণ্য থেকে সরাসরি সংগৃহীত খলিশা ফুলের মধু। কোনো হিটিং বা ভেজাল প্রসেসিং ছাড়া একদম প্রাকৃতিক কাঁচা মধু।",
    sellerName: "বনশ্রী অর্গানিক ফুডস",
    sellerLocation: "দাকোপ, খুলনা",
    isVerified: true,
    rating: 4.9,
    reviewCount: 195,
    stock: 140,
    variants: ["500g Jar", "1 KG Jar", "2 KG Value Pack"]
  },
  {
    id: "gr-3",
    asin: "PASIN-B08GROC03",
    name: "পাবনার ঐতিহ্যবাহী স্পেশাল গাওয়া ঘি (১ কেজি জার)",
    title: "পাবনার ঈশ্বরদীর ঐতিহ্যবাহী খাঁটি দানাদার গাওয়া ঘি",
    category: "grocery",
    price: 1450,
    originalPrice: 1750,
    discount: 17,
    unit: "জার",
    image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80"
    ],
    description: "খাঁটি দেশি গাভীর ননী থেকে প্রস্তুতকৃত দানাদার সুগন্ধি গাওয়া ঘি। গরম ভাত, বিরিয়ানি ও সেহেরি-ইফতারের খাবারে দেবে অতুলনীয় স্বাদ ও ঘ্রাণ।",
    sellerName: "ঈশ্বরদী ডেইরি অ্যান্ড ফুডস",
    sellerLocation: "ঈশ্বরদী, পাবনা",
    isVerified: true,
    rating: 4.8,
    reviewCount: 160,
    stock: 60,
    variants: ["500g Glass Jar", "1 KG Glass Jar"]
  },

  // ─── Pharmacy ───
  {
    id: "ph-1",
    asin: "PASIN-B08PHARM01",
    name: "অটোমেটিক ডিজিটাল ডিজিটাল ব্লাড প্রেসার মনিটর",
    title: "অটোমেটিক ডিজিটাল আপার আর্ম ব্লাড প্রেসার মনিটর (বিপি মেশিন)",
    category: "pharmacy",
    price: 1750,
    originalPrice: 2300,
    discount: 24,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80"
    ],
    description: "সহজে ঘরে বসে রক্তচাপ এবং নাড়ির স্পন্দন মাপার ডিজিটাল বিপি মেশিন। মেমোরি স্টোরেজ, লার্জ ব্যাকলিট এলসিডি ডিসপ্লে ও ৩ বছরের রিপ্লেসমেন্ট গ্যারান্টি।",
    sellerName: "মেডিলাইফ হেলথ ফার্মা",
    sellerLocation: "পান্থপথ, ঢাকা",
    isVerified: true,
    rating: 4.8,
    reviewCount: 88,
    stock: 45,
    variants: ["Standard Cuff (22-32cm)", "Large Wide-range Cuff (22-42cm)"]
  },
  {
    id: "ph-2",
    asin: "PASIN-B08PHARM02",
    name: "ওমেগা-৩ ট্রিপল স্ট্রেন্থ ফিশ অয়েল ক্যাপসুল (৬০টি)",
    title: "ওমেগা-৩ ট্রিপল স্ট্রেন্থ ফিশ অয়েল ১০০০mg সফটজেল (৬০ ক্যাপসুল)",
    category: "pharmacy",
    price: 1350,
    originalPrice: 1700,
    discount: 20,
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800&q=80"
    ],
    description: "হৃদযন্ত্র, মস্তিষ্ক এবং চোখের স্বাস্থ্যের জন্য জরুরি EPA ও DHA সমৃদ্ধ ট্রিপল স্ট্রেন্থ ওমেগা-৩ সাপ্লিমেন্ট। পারদ ও ভারী ধাতুমুক্ত মলিকুলারলি ডিস্টিল্ড।",
    sellerName: "হেলথ প্লাস ফার্মেসি",
    sellerLocation: "গুলশান-১, ঢাকা",
    isVerified: true,
    rating: 4.7,
    reviewCount: 76,
    stock: 110,
    variants: ["60 Softgels Bottle", "120 Softgels Value Pack"]
  },
  {
    id: "ph-3",
    asin: "PASIN-B08PHARM03",
    name: "ডিজিটাল গ্লুকোমিটার সুগার টেস্ট কিট ও ২৫ স্ট্রিপস",
    title: "ডিজিটাল রক্তের সুগার মাপার গ্লুকোমিটার কমপ্লিট কিট উইথ ২৫ স্ট্রিপস",
    category: "pharmacy",
    price: 2100,
    originalPrice: 2600,
    discount: 19,
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=80"
    ],
    description: "মাত্র ৫ সেকেন্ডে নিখুঁত ফলাফল প্রদানকারী নির্ভরযোগ্য ডিজিটাল গ্লুকোমিটার। ল্যান্সিং ডিভাইস, ২৫টি টেস্ট স্ট্রিপ এবং অ্যালকোহল প্যাড অন্তর্ভুক্ত। লাইফটাইম ওয়ারেন্টি।",
    sellerName: "স্কয়ার ডায়াগনস্টিক অ্যান্ড সাপ্লাই",
    sellerLocation: "ধানমন্ডি, ঢাকা",
    isVerified: true,
    rating: 4.9,
    reviewCount: 132,
    stock: 50
  },

  // ─── Dropship ───
  {
    id: "dr-1",
    asin: "PASIN-B08DROP01",
    name: "ইউএসবি রিচার্জেবল পোর্টেবল স্মুদি ও জুস ব্লেন্ডার",
    title: "ইউএসবি রিচার্জেবল ৬-ব্লেড পোর্টেবল পার্সোনাল জুসার ও স্মুদি ব্লেন্ডার",
    category: "dropship",
    price: 950,
    originalPrice: 1450,
    discount: 34,
    image: "https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=800&q=80"
    ],
    description: "অফিস, জিম কিংবা ভ্রমণের জন্য দারুণ উপযোগী রিচার্জেবল পোর্টেবল ব্লেন্ডার। ৬টি স্টেইনলেস স্টিল ব্লেড এবং ৪০০০mAh রিচার্জেবল ব্যাটারি।",
    sellerName: "ড্রপশিপ এক্সপ্রেস বিডি",
    sellerLocation: "উত্তরা, ঢাকা",
    isVerified: true,
    rating: 4.6,
    reviewCount: 215,
    stock: 150,
    colors: ["Sky Blue", "Sakura Pink", "Mint Green"]
  },
  {
    id: "dr-2",
    asin: "PASIN-B08DROP02",
    name: "মিনি ব্লুটুথ পকেট থার্মাল ফটো ও লেবেল প্রিন্টার",
    title: "মিনি ওয়্যারলেস পকেট থার্মাল ব্লুটুথ প্রিন্টার (কালি বিহীন)",
    category: "dropship",
    price: 1650,
    originalPrice: 2350,
    discount: 30,
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&q=80"
    ],
    description: "কালি ছাড়াই স্মার্টফোন থেকে যেকোনো ছবি, মেমো, বারকোড কিংবা লেবেল প্রিন্ট করুন সহজে। কমপ্যাক্ট সাইজ এবং ৫টি ফ্রি থার্মাল পেপার রোল সহ।",
    sellerName: "গ্যাজেট ড্রপ বাংলাদেশ",
    sellerLocation: "বনানী, ঢাকা",
    isVerified: true,
    rating: 4.7,
    reviewCount: 95,
    stock: 80,
    colors: ["Pastel Pink", "Pastel Cyan"]
  },
  {
    id: "dr-3",
    asin: "PASIN-B08DROP03",
    name: "মাল্টিফাংশনাল অ্যান্টি-থেফট ল্যাপটপ ব্যাকপ্যাক",
    title: "ওয়াটারপ্রুফ মাল্টিফাংশনাল অ্যান্টি-থেফট ১৫.৬ ইঞ্চি ল্যাপটপ ব্যাকপ্যাক",
    category: "dropship",
    price: 1450,
    originalPrice: 2100,
    discount: 31,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"
    ],
    description: "ল্যাপটপ ও গ্যাজেট বহনের জন্য প্রিমিয়াম অ্যান্টি-থেফট পাসওয়ার্ড লক, এক্সটার্নাল ইউএসবি চার্জিং পোর্ট ও ওয়াটার-রেপেলেন্ট ফ্যাব্রিকযুক্ত স্মার্ট ব্যাকপ্যাক।",
    sellerName: "ড্রপকার্ট ফ্যাশন অ্যান্ড টেক",
    sellerLocation: "চকবাজার, ঢাকা",
    isVerified: true,
    rating: 4.5,
    reviewCount: 140,
    stock: 200,
    colors: ["Space Grey", "Carbon Black"]
  },
];
