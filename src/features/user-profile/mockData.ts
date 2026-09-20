import type { SocialProfile, FeedItem } from './types';

export const MOCK_SELLER_PROFILE: SocialProfile = {
  id: 'seller',
  name: 'রহমান সুজ ও ফুটওয়্যার',
  username: '01712345678',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  role: 'seller',
  isVerified: true,
  bio: 'মেড ইন বাংলাদেশ জুতা ও স্যান্ডেলের নির্ভরযোগ্য পাইকারি বিক্রেতা ও প্রস্তুতকারক।',
  location: 'ঢাকা মেট্রো, বাংলাদেশ',
  joinedAt: 'June 2024'
};

export const MOCK_BUYER_PROFILE: SocialProfile = {
  id: 'buyer',
  name: 'তানভীর আহমেদ',
  username: '01912345678',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  role: 'buyer',
  isVerified: false,
  bio: 'রিটেইলার ও ব্যবসায়ী। নতুন কালেকশনের জুতা ও গ্যাজেট খুঁজছি।',
  location: 'চট্টগ্রাম, বাংলাদেশ',
  joinedAt: 'January 2025'
};

export const MOCK_FEED_ITEMS: FeedItem[] = [
  {
    id: 'f1',
    type: 'post',
    content: 'নতুন ঈদ কালেকশন এখন পাইকারি রেটে আমাদের শপে উপলব্ধ! সরাসরি কারখানার দরে বুকিং করুন।',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600',
    timestamp: '২ ঘণ্টা আগে',
    likes: 45,
    comments: 12
  },
  {
    id: 'f2',
    type: 'photo',
    content: 'আমাদের কারখানায় চামড়া দিয়ে বেল্ট তৈরির নতুন ব্যাচ প্রস্তুত হচ্ছে।',
    imageUrl: 'https://images.unsplash.com/photo-1624222247344-550fb8ec5519?w=600',
    timestamp: '১ দিন আগে',
    likes: 84,
    comments: 3
  },
  {
    id: 'f3',
    type: 'product',
    content: 'প্রিমিয়াম লেদার ওয়ালেট - পাইকারি মূল্য মাত্র ৩৫০ টাকা। ন্যূনতম এমওকিউ (MOQ) ৫০ পিস।',
    timestamp: '২ দিন আগে',
    likes: 120,
    comments: 28,
    product: {
      id: 'p-wallet',
      title: 'প্রিমিয়াম চামড়ার ওয়ালেট / Premium Leather Wallet',
      price: 350,
      imageUrl: 'https://images.unsplash.com/photo-1627124793731-f7a77449369f?w=300',
      category: 'চামড়ার সামগ্রী / Leather Items'
    }
  },
  {
    id: 'f4',
    type: 'product',
    content: 'রপ্তানি কোয়ালিটি উইন্টার গ্লাভস / এক্সপোর্ট কুয়ালিটি হাতমোজা। ১০০% উল সুতা দিয়ে বোনা।',
    timestamp: '৩ দিন আগে',
    likes: 56,
    comments: 8,
    product: {
      id: 'p-gloves',
      title: 'উইন্টার গ্লাভস / হাতমোজা / Export Winter Gloves',
      price: 150,
      imageUrl: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300',
      category: 'হাতমোজা / Gloves'
    }
  },
  {
    id: 'f5',
    type: 'product',
    content: 'আভিজাত্য জর্জেট সিল্ক শাড়ি - ট্র্যাডিশনাল টাঙ্গাইল কারিগরদের নিখুঁত বুনন। চমৎকার উৎসব কালার।',
    timestamp: '৪ দিন আগে',
    likes: 198,
    comments: 41,
    product: {
      id: 'p-saree',
      title: 'আভিজাত্য সিল্ক শাড়ি / Pure Silk Saree',
      price: 4500,
      imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300',
      category: 'সিল্ক শাড়ি / Silk Saree'
    }
  },
  {
    id: 'f6',
    type: 'product',
    content: 'জেনুইন কাউহাইড লেদার এক্সিকিউティブ ডাবল স্ট্র্যাপ জুতা। ফরমাল পোশাকের সঙ্গে মানানসই।',
    timestamp: '৫ দিন আগে',
    likes: 112,
    comments: 19,
    product: {
      id: 'p-shoes',
      title: 'চামড়ার জুতা / Executive Leather Shoes',
      price: 1850,
      imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300',
      category: 'চামড়ার জুতা / Leather Shoes'
    }
  }
];

export function filterFeedByTab(feedDatabase: FeedItem[], activeTab: string): FeedItem[] {
  if (activeTab === 'posts') {
    return feedDatabase.filter(item => item.type === 'post' || item.type === 'product');
  }
  if (activeTab === 'photos') {
    return feedDatabase.filter(item => item.type === 'photo' || !!item.imageUrl);
  }
  return feedDatabase;
}
