import { MarketplacePortalConfig } from '../types';

export const MARKETPLACE_PORTALS: MarketplacePortalConfig[] = [
  {
    id: 'wholesale',
    nameEn: 'Wholesale B2B Trade',
    nameBn: 'পাইকারি আড়ত ও বিটুবি',
    taglineEn: 'Direct factory & importer pricing for bulk purchases and business supply',
    taglineBn: 'কারখানা ও আড়তদারদের থেকে সরাসরি ন্যূনতম অর্ডারে পাইকারি ক্রয়',
    route: '/wholesale',
    iconName: 'Boxes',
    accentColor: 'from-indigo-600 to-blue-700',
    allowedSellers: ['wholesaler', 'factory', 'importer', 'exporter'],
    badge: 'B2B Wholesale'
  },
  {
    id: 'retail',
    nameEn: 'Retail Marketplace',
    nameBn: 'খুচরা মার্কেটপ্লেস',
    taglineEn: 'Discover millions of consumer products with instant Buy Now and Cash on Delivery',
    taglineBn: 'একক পিস কেনাকাটায় দ্রুত ডেলিভারি ও নিরাপদ পেমেন্ট',
    route: '/b2c',
    iconName: 'ShoppingBag',
    accentColor: 'from-blue-600 to-cyan-700',
    allowedSellers: ['retail_seller', 'wholesaler', 'brand_seller'],
    badge: 'B2C Retail'
  },
  {
    id: 'pk-shop',
    nameEn: 'PK Store Official',
    nameBn: 'পিকে স্টোর অফিসিয়াল',
    taglineEn: 'PaikarMart verified premium authentic goods, 100% lab-tested and certified',
    taglineBn: 'পাইকারমার্ট নিজস্ব তত্ত্বাবধানে সংগৃহীত প্রিমিয়াম কোয়ালিটি পণ্য',
    route: '/pk-store',
    iconName: 'Sparkles',
    accentColor: 'from-amber-500 to-orange-600',
    allowedSellers: ['brand_seller'],
    badge: 'PK Exclusive'
  },
  {
    id: 'brand-shops',
    nameEn: 'Official Brand Showrooms',
    nameBn: 'ব্র্যান্ড শোরুম',
    taglineEn: 'Authentic flagship brand outlets with manufacturer warranties and support',
    taglineBn: 'দেশি-বিদেশি শীর্ষ ব্র্যান্ডের অফিসিয়াল পণ্য ও ওয়ারেন্টি সুবিধা',
    route: '/brands',
    iconName: 'Tag',
    accentColor: 'from-fuchsia-600 to-pink-700',
    allowedSellers: ['brand_seller'],
    badge: 'Official Store'
  },
  {
    id: 'dropship',
    nameEn: 'Zero-Capital Dropship Hub',
    nameBn: 'ড্রপশিপিং নেটওয়ার্ক',
    taglineEn: 'Sell without inventory. Direct courier fulfillment to your customers across Bangladesh',
    taglineBn: 'বিনা পুঁজিতে পণ্য বিক্রি করুন, ডেলিভারি ও প্যাকেজিং হ্যান্ডল করবে সাপ্লায়ার',
    route: '/dropship',
    iconName: 'Package',
    accentColor: 'from-emerald-600 to-teal-700',
    allowedSellers: ['dropship_supplier'],
    badge: 'Reseller Hub'
  },
  {
    id: 'digital',
    nameEn: 'Digital Goods & Software',
    nameBn: 'ডিজিটাল মার্কেটপ্লেস',
    taglineEn: 'Instant access to software licenses, templates, eBooks and digital tools',
    taglineBn: 'সফটওয়্যার, ই-বুক, কোড ও বিজনেস টেমপ্লেট তাৎক্ষণিক ডাউনলোড',
    route: '/digital',
    iconName: 'Laptop',
    accentColor: 'from-violet-600 to-purple-700',
    allowedSellers: ['digital_seller'],
    badge: 'Instant Delivery'
  },
  {
    id: 'auto',
    nameEn: 'Auto & Industrial Machinery',
    nameBn: 'অটোমোবাইল ও হেভি মেশিনারি',
    taglineEn: 'Vehicles, bikes, commercial transport and factory equipment trading',
    taglineBn: 'মোটরযান, মোটরসাইকেল ও শিল্প কারখানার ভারী যন্ত্রপাতি',
    route: '/auto',
    iconName: 'Car',
    accentColor: 'from-rose-600 to-red-700',
    allowedSellers: ['importer', 'wholesaler'],
    badge: 'Heavy Commerce'
  }
];
