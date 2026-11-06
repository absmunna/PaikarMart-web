import { SellerTypeConfig } from '../types';

export const MARKETPLACE_SELLER_TYPES: SellerTypeConfig[] = [
  {
    id: 'wholesaler',
    labelEn: 'Wholesale Merchant',
    labelBn: 'পাইকারি আড়তদার ও ডিলার',
    descriptionEn: 'Bulk distributor supplying retail shops and rural markets with tiered wholesale pricing.',
    descriptionBn: 'আড়ত ও পাইকারি মার্কেট থেকে খুচরা দোকানদারদের কাছে বাল্ক লটে পণ্য সরবরাহকারী।',
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    iconName: 'Boxes',
    features: ['ন্যূনতম অর্ডার (MOQ) নির্ধারণ', 'বাল্ক টায়ার প্রাইসিং', 'চালান ও মেমো জেনারেশন', 'ক্রেডিট ও বাকি ট্র্যাকিং'],
    requiresKYC: true,
    targetPortal: 'wholesale'
  },
  {
    id: 'factory',
    labelEn: 'Factory & Manufacturer',
    labelBn: 'গার্মেন্টস ও শিল্প কারখানা',
    descriptionEn: 'Direct producer of apparel, plastics, packaging and industrial goods.',
    descriptionBn: 'পোশাক, প্লাস্টিক, প্যাকেজিং এবং বিভিন্ন পণ্য সরাসরি উৎপাদনকারী ইন্ডাস্ট্রি ও মিল।',
    badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    iconName: 'Factory',
    features: ['কারখানা ডিরেক্টরি প্রোফাইল', 'সরাসরি আরএফকিউ (RFQ) কোটেশন', 'কাস্টম স্যাম্পল বুকিং', 'এক্সপোর্ট কোয়ালিটি লট'],
    requiresKYC: true,
    targetPortal: 'wholesale'
  },
  {
    id: 'importer',
    labelEn: 'Direct Importer',
    labelBn: 'আমদানিকারক',
    descriptionEn: 'International container importer distributing electronics, machinery & cosmetics.',
    descriptionBn: 'চীন, ভারত ও আন্তর্জাতিক বাজার থেকে সরাসরি পণ্য এনে পাইকারি সরবরাহকারী।',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    iconName: 'Globe',
    features: ['এলসি ও কন্টেইনার ডিলস', 'ইনভয়েস ভেরিফিকেশন', 'ডিস্ট্রিবিউটর নিয়োগ', 'আগমনি পণ্যের প্রি-অর্ডার'],
    requiresKYC: true,
    targetPortal: 'wholesale'
  },
  {
    id: 'exporter',
    labelEn: 'Export Merchant',
    labelBn: 'রপ্তানিকারক',
    descriptionEn: 'Global supplier exporting jute, RMG, leather and agricultural produce.',
    descriptionBn: 'পাটজাত পণ্য, চামড়া ও তৈরি পোশাক বৈশ্বিক ক্রেতাদের কাছে সরবরাহকারী।',
    badgeColor: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    iconName: 'Plane',
    features: ['আন্তর্জাতিক বায়ার লিড', 'কমপ্লায়েন্স সার্টিফিকেশন', 'বহিঃবাণিজ্য ডাটাবেজ', 'কার্গো বুকিং ইন্টিগ্রেশন'],
    requiresKYC: true,
    targetPortal: 'wholesale'
  },
  {
    id: 'brand_seller',
    labelEn: 'Official Brand Shop',
    labelBn: 'অফিসিয়াল ব্র্যান্ড শপ',
    descriptionEn: 'Verified original brand flagship store with 100% authentic warranty.',
    descriptionBn: '১০০% অরিজিনাল পণ্য ও অফিসিয়াল ওয়ারেন্টি সম্পন্ন ব্র্যান্ড আউটলেট।',
    badgeColor: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20',
    iconName: 'ShieldCheck',
    features: ['ব্র্যান্ড ভেরিফাইড ব্লু ব্যাজ', 'কাস্টম ব্র্যান্ড পেজ', 'এক্সক্লুসিভ ক্যাম্পেইন লঞ্চ', 'অফিসিয়াল ওয়ারেন্টি ট্র্যাকিং'],
    requiresKYC: true,
    targetPortal: 'brand-shops'
  },
  {
    id: 'retail_seller',
    labelEn: 'Retail Shop & E-Commerce',
    labelBn: 'খুচরা অনলাইন বিক্রেতা',
    descriptionEn: 'Online merchant selling single-piece consumer goods to end customers.',
    descriptionBn: 'সাধারণ ক্রেতাদের কাছে খুচরা বা একক পিস পণ্য বিক্রয়কারী অনলাইন স্টোর।',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    iconName: 'ShoppingBag',
    features: ['বাই নাও ও সহজ কার্ট', 'ক্যাশ অন ডেলিভারি (COD)', 'কুপন ও ডিসকাউন্ট অফার', 'সহজ রিটার্ন পলিসি'],
    requiresKYC: true,
    targetPortal: 'retail'
  },
  {
    id: 'dropship_supplier',
    labelEn: 'Dropship Supplier',
    labelBn: 'ড্রপশিপিং সাপ্লায়ার',
    descriptionEn: 'Warehouse supplier providing white-label order fulfillment for resellers.',
    descriptionBn: 'রিসেলারদের জন্য পুঁজিমুক্ত পণ্য সরবরাহ ও ডিরেক্ট কুরিয়ার হ্যান্ডলিং হাব।',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    iconName: 'Package',
    features: ['জিরো ইনভেন্টরি ক্যাটালগ', 'স্বয়ংক্রিয় অর্ডার পাসিং', 'প্রফিট মার্জিন কন্ট্রোল', 'হোয়াইট লেবেল শিপিং'],
    requiresKYC: true,
    targetPortal: 'dropship'
  },
  {
    id: 'digital_seller',
    labelEn: 'Digital Product Creator',
    labelBn: 'ডিজিটাল সেলার ও সফটওয়্যার',
    descriptionEn: 'Creator distributing software, licenses, eBooks, graphics and tools.',
    descriptionBn: 'সফটওয়্যার লাইসেন্স, ই-বুক, কোড ও ডিজিটাল সামগ্রী বিক্রয়কারী।',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    iconName: 'Laptop',
    features: ['ইনস্ট্যান্ট ডিজিটাল ডাউনলোড', 'লাইসেন্স কি জেনারেটর', 'গিট ও কোড অ্যাক্সেস', 'অনলাইন ডকুমেন্টেশন'],
    requiresKYC: false,
    targetPortal: 'digital'
  }
];
