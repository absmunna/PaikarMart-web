import { create } from 'zustand';
import { B2BPost } from '../types/b2bTypes';

interface B2BFeedState {
  posts: B2BPost[];
  isLoading: boolean;
  error: string | null;
}

export const MOCK_B2B_POSTS: B2BPost[] = [
  {
    id: 'bp-101',
    authorName: 'সিলসিলা স্পিনিং অ্যান্ড উইভিং মিলস',
    authorRole: 'Factory Owner (Konabari)',
    authorLogo: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=100&auto=format&fit=crop',
    type: 'product_launch',
    title: 'নতুন লঞ্চ: এক্সপোর্ট কটন ডেনিম টুইল ফেব্রিক্স (১২ আউন্স)',
    content: 'সুসংবাদ! আমাদের গাজীপুর প্ল্যান্টে সম্পূর্ণ অটোমেটিক লুমে তৈরি ১২ আউন্সের ডেনিম ফেব্রিক্সের ফার্স্ট রান লট স্টক রেডি। ১০০% ইন্ডিকো ডাই সম্পন্ন। মিনিমাম অর্ডার ৫০ রোলস (২০০০ গজ)। কাস্টম সোর্সিং এবং ওযার্স ডাই কাস্টমাইজেশন করা যাবে। আগ্রহী পাইকার ও মার্চেন্ডাইজারগণ দ্রুত ইনবক্স করুন।',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop',
    likes: 42,
    comments: 18,
    date: '৪ ঘণ্টা আগে'
  },
  {
    id: 'bp-102',
    authorName: 'চাটগাঁ মসলা ট্রেডিং লিমিটেড',
    authorRole: 'Bulk Importer (Khatunganj)',
    authorLogo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&auto=format&fit=crop',
    type: 'bulk_offer',
    title: 'স্টক ক্লিয়ারেন্স ডিসকাউন্ট: ৪ টন শুকনো এলাচ লট আজই খালাস',
    content: 'খালাস রেডি! ভিয়েতনামি গ্রেড-১ এলাচ (Green Cardamom 8mm) এর শেষ ৪ টনের একটি লট আজই খাতুনগঞ্জ ওয়্যারহাউস থেকে ক্যাশ অন ডেলিভারি মোডে রিলিজ করা হবে। কোনো আড়তদার বা বড় আমদানিকারক ভাই একসাথে পুরো লট নিলে বিশেষ লিকুইডেশন ডিসকাউন্ট দেওয়া হবে। MOQ ৫00 কেজি!',
    image: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=600&auto=format&fit=crop',
    likes: 29,
    comments: 7,
    date: '১০ ঘণ্টা আগে'
  }
];

export const useB2BFeedStore = create<B2BFeedState>((set) => ({
  posts: MOCK_B2B_POSTS,
  isLoading: false,
  error: null,
}));
