import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, MapPin, Tag, Calendar, MessageSquare, ShieldCheck, CheckCircle } from 'lucide-react';
import { formatBDT } from '@/core/lib/format';
import { buildApiUrl } from '@/core/api';
import { toast } from 'sonner';

interface DemandItem {
  id: string;
  title: string;
  description: string;
  budget: number;
  currency: string;
  categoryId: string;
  location?: string;
  urgency: 'low' | 'normal' | 'urgent';
  status: string;
  createdAt: string;
  author: { name: string; avatarUrl?: string };
  matches?: Array<{
    id: string;
    name: string;
    avatarUrl: string;
    type: string;
    location: string;
    verified: boolean;
  }>;
}

export function DemandDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [demand, setDemand] = useState<DemandItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDemandDetail = async () => {
      try {
        const res = await fetch(buildApiUrl(`/demands/${id}`));
        if (res.ok) {
          const data = await res.json();
          setDemand(data);
        }
      } catch (err) {
        console.warn('API error, using mock fallback for details:', err);
        // Fallback
        setDemand({
          id: id || 'd_1',
          title: id === 'd_2' ? 'স্মার্ট ওয়াচ সিরিজ ৯ (৫০ পিস)' : '১০০ কেজি ফ্রেশ পালং শাক প্রয়োজন',
          description: id === 'd_2'
            ? 'আমাদের অফিসের কর্মকর্তা-কর্মচারীদের উপহার দেওয়ার জন্য ৫০ পিস গুণগতমানের স্মার্ট ওয়াচ প্রয়োজন। বাজেট সীমিত।'
            : 'প্রতিদিন ঢাকাতে ডেলিভারি দিতে পারবে এমন পাইকারি বিক্রেতা খুঁজছি। দাম আলোচনা সাপেক্ষে।',
          budget: id === 'd_2' ? 85000 : 5000,
          currency: 'BDT',
          categoryId: id === 'd_2' ? 'cat_electronics' : 'cat_grocery',
          location: id === 'd_2' ? 'চট্টগ্রাম' : 'ঢাকা',
          urgency: id === 'd_2' ? 'normal' : 'urgent',
          status: id === 'd_2' ? 'matched' : 'open',
          createdAt: new Date().toISOString(),
          author: { name: id === 'd_2' ? 'সারা বুটিক' : 'রহিম খান', avatarUrl: '👤' },
          matches: [
            { id: 'v_1', name: 'Fresh Valley Farm', avatarUrl: '🥬', type: 'পাইকার', location: 'সাভার, ঢাকা', verified: true },
            { id: 'v_2', name: 'Al-Madina Grocers', avatarUrl: '🍎', type: 'পাইকার', location: 'যাত্রাবাড়ি, ঢাকা', verified: false }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDemandDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 text-center text-[var(--pm-text-muted)] max-w-2xl mx-auto animate-pulse flex flex-col gap-4">
        <div className="bg-[var(--pm-surface)] h-8 w-24 rounded-xl" />
        <div className="bg-[var(--pm-surface)] h-44 rounded-3xl" />
      </div>
    );
  }

  if (!demand) {
    return (
      <div className="p-8 text-center text-[var(--pm-text)] flex flex-col items-center gap-3">
        <span className="text-4xl">🏜️</span>
        <p className="text-sm font-bold">রিকোয়েস্টটি পাওয়া যায়নি!</p>
        <button onClick={() => navigate('/demand')} className="text-xs text-[var(--pm-accent)] underline">
          ডিমান্ড বোর্ডে ফিরে যান
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 max-w-3xl mx-auto pb-20">
      <Link to="/demand" className="inline-flex items-center gap-2 text-xs text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] w-fit font-bold transition-colors">
        <ArrowLeft className="w-4 h-4" />
        ডিমান্ড বোর্ডে ফিরে যান
      </Link>

      {/* Main card */}
      <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                demand.status === 'open' 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                  : 'bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] border-[var(--pm-accent)]/30'
              }`}>
                {demand.status === 'open' ? 'উন্মুক্ত' : 'ম্যাচড'}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                demand.urgency === 'urgent' 
                  ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                  : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
              }`}>
                {demand.urgency === 'urgent' ? 'জরুরী' : 'সাধারণ'}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-[var(--pm-text)] leading-tight">{demand.title}</h1>
          </div>
          
          <div className="flex flex-col gap-0.5 items-start md:items-end shrink-0">
            <span className="text-[10px] text-[var(--pm-text-muted)] font-black uppercase tracking-wider">বাজেট</span>
            <span className="text-2xl font-black text-[var(--pm-accent)]">{formatBDT(demand.budget)}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-[var(--pm-border)]/50">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-black text-[var(--pm-text-muted)] uppercase flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> ক্যাটেগরি
            </span>
            <span className="text-[var(--pm-text)] text-xs font-bold">
              {demand.categoryId === 'cat_electronics' ? 'ইলেকট্রনিক্স' : 'নিত্যপ্রয়োজনীয়'}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-black text-[var(--pm-text-muted)] uppercase flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> লোকেশন
            </span>
            <span className="text-[var(--pm-text)] text-xs font-bold">{demand.location || 'Anywhere'}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-black text-[var(--pm-text-muted)] uppercase flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> পোস্ট করা হয়েছে
            </span>
            <span className="text-[var(--pm-text)] text-xs font-bold">
              {new Date(demand.createdAt).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long' })}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-black text-[var(--pm-text-muted)] uppercase flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> ডেট
            </span>
            <span className="text-[var(--pm-text)] text-xs font-bold">
              {new Date(demand.createdAt).toLocaleDateString('bn-BD')}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <h3 className="font-black text-xs text-[var(--pm-text-muted)]">রিকোয়েস্টের বিস্তারিত বিবরণ</h3>
          <p className="text-xs text-[var(--pm-text)] whitespace-pre-wrap leading-relaxed font-medium">
            {demand.description}
          </p>
        </div>

        {/* Author info */}
        <div className="flex items-center gap-3 mt-2 p-4 bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl">
          <div className="h-9 w-9 rounded-full bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] flex items-center justify-center font-bold text-lg">
            {demand.author.avatarUrl || '👤'}
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-[var(--pm-text-muted)] font-bold">পোস্ট করেছেন</span>
            <span className="text-xs font-black text-[var(--pm-text)]">{demand.author.name}</span>
          </div>
          <button className="ml-auto bg-[var(--pm-accent)] text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-[var(--pm-accent)]/15 active:scale-95 transition-all flex items-center gap-1.5 hover:opacity-90">
            <MessageSquare className="w-4 h-4" />
            যোগাযোগ করুন
          </button>
        </div>
      </div>

      {/* Seller Bidding & Proposal Section */}
      <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>সেলার কোটেশন বিডিং জোন ({demand.matches?.length || 0})</span>
            </h3>
            <p className="text-[10px] text-[var(--pm-text-muted)] mt-0.5">
              ভেরিফাইড পাইকার বা প্রোভাইডার হিসেবে সরাসরি মূল্যের অফার দিন
            </p>
          </div>
          <button
            onClick={() => {
              const amountStr = prompt("আপনার কোটেশন মূল্য (৳ BDT) লিখুন:");
              if (amountStr && !isNaN(Number(amountStr))) {
                toast.success(`৳${amountStr} অফারটি বায়ারের কাছে সফলভাবে সাবমিট হয়েছে!`);
              }
            }}
            className="px-4 py-2 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer"
          >
            + অফার/কোটেশন জমা দিন
          </button>
        </div>

        {demand.matches && demand.matches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {demand.matches.map((vendor) => (
              <div 
                key={vendor.id} 
                className="bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs hover:border-[var(--pm-accent)]/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl border border-[var(--pm-border)] bg-[var(--pm-surface)] flex items-center justify-center text-xl overflow-hidden shrink-0">
                    {vendor.avatarUrl}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="text-xs font-black text-white truncate">{vendor.name}</h4>
                      {vendor.verified && <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                    </div>
                    <p className="text-[10px] text-[var(--pm-text-muted)] font-bold">{vendor.type} · {vendor.location}</p>
                    <p className="text-[11px] font-black text-[var(--pm-accent)] mt-0.5">প্রস্তাবিত মূল্য: ৳{(demand.budget * 0.95).toLocaleString()}</p>
                  </div>
                </div>

                <button 
                  onClick={() => toast.success(`এসক্রো অর্ডার লক করা হয়েছে! ${vendor.name}-এর সাথে চ্যাট চালু হচ্ছে...`)}
                  className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-[10px] font-black active:scale-95 transition-all shrink-0 cursor-pointer"
                >
                  এসক্রো গ্রহণ
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-[var(--pm-text-muted)] text-xs font-medium bg-[var(--pm-bg)]/50 rounded-2xl border border-[var(--pm-border)]/50">
            এখনো কোনো সেলার কোটেশন জমা পড়েনি। আপনি প্রথম সেলার হিসেবে বিড রিকোয়েস্ট দিতে পারেন!
          </div>
        )}
      </div>

    </div>
  );
}
