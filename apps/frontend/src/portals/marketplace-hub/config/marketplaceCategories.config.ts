import { MarketplaceCategory } from '../types';

export const MARKETPLACE_CATEGORIES: MarketplaceCategory[] = [
  {
    id: 'fashion',
    slug: 'fashion-apparel',
    nameEn: 'Apparel & Garments',
    nameBn: 'পোশাক ও টেক্সটাইল',
    descriptionEn: 'Export surplus, knitwear, sarees, panjabis and fabrics direct from wholesale markets.',
    descriptionBn: 'কেরানীগঞ্জ, ইসলামপুর ও কারখানা থেকে পাইকারি ও খুচরা তৈরি পোশাক ও থান কাপড়।',
    iconName: 'Shirt',
    color: 'text-indigo-400',
    bgGradient: 'from-indigo-500/20 to-blue-600/10',
    featured: true,
    targetSellerTypes: ['wholesaler', 'factory', 'brand_seller', 'retail_seller', 'exporter'],
    subcategories: [
      { id: 'f-1', slug: 'mens-tshirts', nameEn: "Men's T-Shirts & Polos", nameBn: 'টি-শার্ট ও পোলো শার্ট', moqRequired: false },
      { id: 'f-2', slug: 'traditional-panjabi', nameEn: 'Executive Panjabi & Pajama', nameBn: 'প্রিমিয়াম পাঞ্জাবি ও পায়জামা', moqRequired: false },
      { id: 'f-3', slug: 'sarees-ethnic', nameEn: 'Jamdani, Silk & Cotton Sarees', nameBn: 'জামদানি ও সুতি শাড়ি', moqRequired: false },
      { id: 'f-4', slug: 'denim-jeans', nameEn: 'Denim Pants & Twill Chinos', nameBn: 'ডেনিম ও টুইল প্যান্ট', moqRequired: false },
      { id: 'f-5', slug: 'wholesale-knitwear-lots', nameEn: 'Factory Export Surplus Lots', nameBn: 'গার্মেন্টস এক্সপোর্ট কোয়ালিটি লট', moqRequired: true },
      { id: 'f-6', slug: 'fabrics-yarns', nameEn: 'Fabrics, Yarns & Voile Lots', nameBn: 'থান কাপড় ও সুতা', moqRequired: true },
      { id: 'f-7', slug: 'kids-wear', nameEn: 'Kids & Baby Clothing', nameBn: 'শিশুদের পোশাক', moqRequired: false }
    ]
  },
  {
    id: 'electronics',
    slug: 'electronics-gadgets',
    nameEn: 'Electronics & Gadgets',
    nameBn: 'ইলেকট্রনিক্স ও গ্যাজেট',
    descriptionEn: 'Smartphones, chargers, audio gear, smart watches and bulk components from importers.',
    descriptionBn: 'স্টেডিয়াম মার্কেট ও মোতালেব প্লাজার আমদানিকৃত গ্যাজেট, চার্জার ও গ্যাজেট সামগ্রী।',
    iconName: 'Smartphone',
    color: 'text-cyan-400',
    bgGradient: 'from-cyan-500/20 to-teal-600/10',
    featured: true,
    targetSellerTypes: ['importer', 'wholesaler', 'brand_seller', 'retail_seller', 'dropship_supplier'],
    subcategories: [
      { id: 'e-1', slug: 'chargers-cables', nameEn: 'Fast Chargers & Data Cables', nameBn: 'ফাস্ট চার্জার ও ডেটা কেবল', moqRequired: false },
      { id: 'e-2', slug: 'smart-watches', nameEn: 'Smart Watches & Bands', nameBn: 'স্মার্ট ওয়াচ ও ব্যান্ড', moqRequired: false },
      { id: 'e-3', slug: 'bluetooth-audio', nameEn: 'Earbuds & Portable Speakers', nameBn: 'ব্লুটুথ ইয়ারবাডস ও স্পিকার', moqRequired: false },
      { id: 'e-4', slug: 'power-banks', nameEn: 'High Capacity Power Banks', nameBn: 'পাওয়ার ব্যাংক', moqRequired: false },
      { id: 'e-5', slug: 'mobile-accessories-bulk', nameEn: 'Wholesale Screen Protectors & Cases', nameBn: 'পাইকারি মোবাইল কেসিং ও গ্লাস', moqRequired: true },
      { id: 'e-6', slug: 'solar-lighting', nameEn: 'Solar Panels & LED Lighting', nameBn: 'সোলার ও এলইডি লাইটিং', moqRequired: false }
    ]
  },
  {
    id: 'grocery-agri',
    slug: 'grocery-agriculture',
    nameEn: 'Grocery & Agro Products',
    nameBn: 'খাদ্য, আড়ত ও কৃষি পণ্য',
    descriptionEn: 'Direct farm produce, rice sacks, pure cold-pressed oils and spices from Khatunganj & Karwan Bazar.',
    descriptionBn: 'কারওয়ান বাজার ও খাতুনগঞ্জের আড়ত থেকে তাজা খাদ্যশস্য, খাঁটি তেল, ডাল ও পাইকারি মশলা।',
    iconName: 'Wheat',
    color: 'text-amber-400',
    bgGradient: 'from-amber-500/20 to-orange-600/10',
    featured: true,
    targetSellerTypes: ['wholesaler', 'factory', 'retail_seller', 'exporter'],
    subcategories: [
      { id: 'g-1', slug: 'bulk-rice', nameEn: 'Miniket, Nazirshail & Aromatic Rice (50kg)', nameBn: '৫০ কেজি বস্তা চাল (মিনিকেট ও নাজিরশাইল)', moqRequired: true },
      { id: 'g-2', slug: 'mustard-oil-ghee', nameEn: 'Cold-Pressed Mustard Oil & Pure Ghee', nameBn: 'ঘানি ভাঙা সরিষার তেল ও খাঁটি ঘি', moqRequired: false },
      { id: 'g-3', slug: 'natural-honey', nameEn: 'Sundarbans & Organic Raw Honey', nameBn: 'সুন্দরবনের প্রাকৃতিক মধু', moqRequired: false },
      { id: 'g-4', slug: 'dry-fish-shutki', nameEn: 'Cox’s Bazar Dry Fish (Shutki)', nameBn: 'কক্সবাজারের সামুদ্রিক শুঁটকি', moqRequired: false },
      { id: 'g-5', slug: 'whole-spices', nameEn: 'Cardamom, Cumin & Spices Wholesale Lots', nameBn: 'আস্ত এলাচ, জিরা ও গরম মশলা লট', moqRequired: true },
      { id: 'g-6', slug: 'organic-tea', nameEn: 'Sylhet Special CTC & Green Tea', nameBn: 'সিলেটের স্পেশাল চা পাতা', moqRequired: false }
    ]
  },
  {
    id: 'machinery-industrial',
    slug: 'machinery-industrial',
    nameEn: 'Machinery & Hardware',
    nameBn: 'যন্ত্রপাতি ও শিল্প সরঞ্জাম',
    descriptionEn: 'Garment sewing machines, packaging equipment, power tools and spare parts from importers.',
    descriptionBn: 'ধোলাইখাল ও নবাবপুর রোডের মেশিনারি, প্যাকেজিং সরঞ্জাম ও ইন্ডাস্ট্রিয়াল টুলস।',
    iconName: 'Wrench',
    color: 'text-slate-300',
    bgGradient: 'from-slate-500/20 to-zinc-700/10',
    featured: false,
    targetSellerTypes: ['importer', 'wholesaler', 'factory'],
    subcategories: [
      { id: 'm-1', slug: 'garment-sewing', nameEn: 'Industrial Sewing Machines & Motors', nameBn: 'গার্মেন্টস সেলাই মেশিন ও মোটর', moqRequired: false },
      { id: 'm-2', slug: 'packaging-materials', nameEn: 'Poly Bags, Bubble Wrap & Carton Bulk', nameBn: 'পলি ব্যাগ ও কার্টন প্যাকেজিং', moqRequired: true },
      { id: 'm-3', slug: 'power-tools', nameEn: 'Drills, Grinders & Hand Tools', nameBn: 'ড্রিল মেশিন ও পাওয়ার টুলস', moqRequired: false },
      { id: 'm-4', slug: 'industrial-raw-materials', nameEn: 'Plastic Granules & Chemical Compounds', nameBn: 'প্লাস্টিক দানা ও রাসায়নিক কাঁচামাল', moqRequired: true }
    ]
  },
  {
    id: 'handicrafts-home',
    slug: 'home-handicrafts',
    nameEn: 'Home Textiles & Crafts',
    nameBn: 'গৃহসজ্জা ও নকশী হস্তশিল্প',
    descriptionEn: 'Nakshi Kantha, jute bags, pottery, home linen and wooden craft items direct from artisans.',
    descriptionBn: 'হাতের কাজের নকশী কাঁথা, পাটজাত পরিবেশবান্ধব ব্যাগ, মৃৎশিল্প ও হোম টেক্সটাইল।',
    iconName: 'Home',
    color: 'text-emerald-400',
    bgGradient: 'from-emerald-500/20 to-teal-600/10',
    featured: true,
    targetSellerTypes: ['factory', 'wholesaler', 'brand_seller', 'retail_seller', 'exporter'],
    subcategories: [
      { id: 'h-1', slug: 'nakshi-kantha', nameEn: 'Traditional Hand-Stitched Nakshi Kantha', nameBn: 'হাতের কাজের নকশী কাঁথা', moqRequired: false },
      { id: 'h-2', slug: 'jute-diversified', nameEn: 'Export Quality Jute Bags & Floor Mats', nameBn: 'রপ্তানিমুখী পাটের ব্যাগ ও ম্যাট', moqRequired: false },
      { id: 'h-3', slug: 'bed-sheets-curtains', nameEn: 'Cotton Bed Covers & Living Curtains', nameBn: 'হোম বেড কভার ও পর্দা সেট', moqRequired: false },
      { id: 'h-4', slug: 'clay-ceramics', nameEn: 'Clay Pottery & Tableware Ceramics', nameBn: 'মাটির তৈজসপত্র ও সিরামিকস', moqRequired: false }
    ]
  },
  {
    id: 'beauty-personal',
    slug: 'beauty-personal-care',
    nameEn: 'Beauty & Personal Care',
    nameBn: 'প্রসাধন ও রূপচর্চা',
    descriptionEn: 'Natural skincare, herbal hair oils, attar, perfumes and salon equipment wholesale.',
    descriptionBn: 'অর্গানিক স্কিনকেয়ার, খাঁটি ভেষজ তেল, আতর ও পার্লারের পাইকারি সামগ্রী।',
    iconName: 'Sparkles',
    color: 'text-pink-400',
    bgGradient: 'from-pink-500/20 to-rose-600/10',
    featured: false,
    targetSellerTypes: ['importer', 'brand_seller', 'wholesaler', 'retail_seller'],
    subcategories: [
      { id: 'b-1', slug: 'organic-skincare', nameEn: 'Herbal Face Washes & Creams', nameBn: 'অর্গানিক ফেসওয়াশ ও ক্রিম', moqRequired: false },
      { id: 'b-2', slug: 'attar-fragrances', nameEn: 'Pure Arabic Attar & Non-Alcoholic Fragrances', nameBn: 'খাঁটি এরাবিক আতর ও সুগন্ধি', moqRequired: false },
      { id: 'b-3', slug: 'salon-supplies-bulk', nameEn: 'Professional Salon Kits & Equipment', nameBn: 'পার্লার ও সেলুন সামগ্রী', moqRequired: true }
    ]
  },
  {
    id: 'auto-parts',
    slug: 'automotive-parts',
    nameEn: 'Automotive & Parts',
    nameBn: 'মোটর ও গাড়ির যন্ত্রাংশ',
    descriptionEn: 'Bike accessories, engine lubricants, electric bike batteries and vehicle spare parts.',
    descriptionBn: 'মোটরসাইকেলের যন্ত্রাংশ, ইঞ্জিন অয়েল ও ই-বাইক ব্যাটারি।',
    iconName: 'Car',
    color: 'text-rose-400',
    bgGradient: 'from-rose-500/20 to-red-600/10',
    featured: false,
    targetSellerTypes: ['importer', 'wholesaler', 'retail_seller'],
    subcategories: [
      { id: 'a-1', slug: 'motorcycle-helmets-gear', nameEn: 'Helmets, Gloves & Safety Gear', nameBn: 'হেলমেট ও সেফটি গিয়ার', moqRequired: false },
      { id: 'a-2', slug: 'engine-oils', nameEn: 'Synthetic & Mineral Engine Lubricants', nameBn: 'ইঞ্জিন অয়েল ও লুব্রিকেন্ট', moqRequired: false },
      { id: 'a-3', slug: 'ev-batteries', nameEn: 'Lithium & Lead-Acid E-Bike Batteries', nameBn: 'ই-বাইক লিথিয়াম ব্যাটারি', moqRequired: false }
    ]
  },
  {
    id: 'digital-software',
    slug: 'digital-goods',
    nameEn: 'Digital Goods & Software',
    nameBn: 'ডিজিটাল সামগ্রী ও কোড',
    descriptionEn: 'Business software, POS licenses, e-commerce templates, eBooks and design graphics.',
    descriptionBn: 'ব্যবসায়িক পিওএস সফটওয়্যার, ওয়েবসাইট টেমপ্লেট ও শিক্ষণীয় ই-বুক।',
    iconName: 'Code',
    color: 'text-violet-400',
    bgGradient: 'from-violet-500/20 to-purple-600/10',
    featured: false,
    targetSellerTypes: ['digital_seller'],
    subcategories: [
      { id: 'd-1', slug: 'pos-inventory-software', nameEn: 'Store Management & Billing Software', nameBn: 'দোকানের হিসাব ও পিওএস সফটওয়্যার', moqRequired: false },
      { id: 'd-2', slug: 'website-templates', nameEn: 'React, Next.js & Shopify Theme Templates', nameBn: 'ওয়েবসাইট ও ই-কমার্স টেমপ্লেট', moqRequired: false },
      { id: 'd-3', slug: 'ebooks-business-guides', nameEn: 'Import/Export & Business Law PDF Guides', nameBn: 'ব্যবসা ও ট্যাক্স সংক্রান্ত ই-বুক', moqRequired: false }
    ]
  }
];
