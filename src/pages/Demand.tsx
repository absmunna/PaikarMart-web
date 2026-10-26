import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Users, Plus, X, Tag, DollarSign, Send } from 'lucide-react';
import { formatBDT } from '../lib/format';

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
  matchCount?: number;
  createdAt: string;
  author: { name: string; avatarUrl?: string };
}

const CATEGORIES = [
  { id: 'cat_grocery', name: 'নিত্যপ্রয়োজনীয় (Grocery)' },
  { id: 'cat_electronics', name: 'ইলেকট্রনিক্স (Electronics)' },
  { id: 'cat_fashion', name: 'পোশাক ও ফ্যাশন (Fashion)' },
  { id: 'cat_services', name: 'সেবাসমূহ (Services)' },
];

export default function Demand() {
  const [demands, setDemands] = useState<DemandItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    categoryId: 'cat_grocery',
    location: '',
    urgency: 'normal' as 'low' | 'normal' | 'urgent',
  });

  const fetchDemands = async () => {
    try {
      const res = await fetch('/api/v1/demands');
      if (res.ok) {
        const data = await res.json();
        setDemands(data);
      }
    } catch (e) {
      console.warn('API error, using mock fallback:', e);
      // Fallback
      setDemands([
        {
          id: 'd_1',
          title: '১০০ কেজি ফ্রেশ পালং শাক প্রয়োজন',
          description: 'প্রতিদিন ঢাকাতে ডেলিভারি দিতে পারবে এমন পাইকারি বিক্রেতা খুঁজছি। দাম আলোচনা সাপেক্ষে।',
          budget: 5000,
          currency: 'BDT',
          categoryId: 'cat_grocery',
          location: 'ঢাকা',
          urgency: 'urgent',
          status: 'open',
          matchCount: 3,
          createdAt: new Date().toISOString(),
          author: { name: 'রহিম খান', avatarUrl: '🥬' }
        },
        {
          id: 'd_2',
          title: 'স্মার্ট ওয়াচ সিরিজ ৯ (৫০ পিস)',
          description: 'আমাদের অফিসের কর্মকর্তা-কর্মচারীদের উপহার দেওয়ার জন্য ৫০ পিস গুণগতমানের স্মার্ট ওয়াচ প্রয়োজন। বাজেট সীমিত।',
          budget: 85000,
          currency: 'BDT',
          categoryId: 'cat_electronics',
          location: 'চট্টগ্রাম',
          urgency: 'normal',
          status: 'matched',
          matchCount: 5,
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          author: { name: 'সারা বুটিক', avatarUrl: '👗' }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemands();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.budget) return;

    const payload = {
      title: formData.title,
      description: formData.description,
      budget: Number(formData.budget),
      categoryId: formData.categoryId,
      location: formData.location || 'Dhaka',
      urgency: formData.urgency,
    };

    try {
      const res = await fetch('/api/v1/demands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setFormData({ title: '', description: '', budget: '', categoryId: 'cat_grocery', location: '', urgency: 'normal' });
        setOpenModal(false);
        fetchDemands();
      }
    } catch (err) {
      // Mock submit local insert
      const newDemand: DemandItem = {
        id: `d_${Date.now()}`,
        title: formData.title,
        description: formData.description,
        budget: Number(formData.budget),
        currency: 'BDT',
        categoryId: formData.categoryId,
        location: formData.location || 'ঢাকা',
        urgency: formData.urgency,
        status: 'open',
        matchCount: 0,
        createdAt: new Date().toISOString(),
        author: { name: 'ডেমো ইউজার' },
      };
      setDemands(prev => [newDemand, ...prev]);
      setFormData({ title: '', description: '', budget: '', categoryId: 'cat_grocery', location: '', urgency: 'normal' });
      setOpenModal(false);
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
      case 'normal':
        return 'bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] border border-[var(--pm-accent)]/20';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 max-w-5xl mx-auto pb-20">
      {/* Top Heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[var(--pm-text)] tracking-tight">ডিমান্ড বোর্ড (Demands)</h1>
          <p className="text-xs text-[var(--pm-text-muted)] mt-1">আপনার প্রয়োজনীয় প্রডাক্ট বা সেবার রিকোয়েস্ট পোস্ট করুন, সেলাররা যোগাযোগ করবে।</p>
        </div>
        
        <button
          onClick={() => setOpenModal(true)}
          className="bg-[var(--pm-accent)] text-white px-4 py-2 rounded-2xl text-xs font-black shadow-lg shadow-[var(--pm-accent)]/20 active:scale-95 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          রিকোয়েস্ট দিন
        </button>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map(i => (
            <div key={i} className="bg-[var(--pm-surface)] h-44 rounded-3xl animate-pulse border border-[var(--pm-border)]" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {demands.length === 0 ? (
            <div className="col-span-full py-16 text-center text-[var(--pm-text-muted)] flex flex-col items-center gap-3">
              <span className="text-4xl">🏜️</span>
              <p className="text-sm font-bold">এখনো কোনো রিকোয়েস্ট পোস্ট করা হয়নি।</p>
            </div>
          ) : (
            demands.map((demand) => (
              <Link key={demand.id} to={`/demand/${demand.id}`}>
                <div className="bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-3xl p-5 flex flex-col h-full shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-bold text-sm text-[var(--pm-text)] line-clamp-2 leading-snug">{demand.title}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase shrink-0 ${getUrgencyBadge(demand.urgency)}`}>
                      {demand.urgency === 'urgent' ? 'জরুরী' : demand.urgency === 'normal' ? 'সাধারণ' : 'ধীরগতি'}
                    </span>
                  </div>
                  
                  <p className="text-xs text-[var(--pm-text-muted)] line-clamp-2 mb-4 leading-relaxed flex-1">
                    {demand.description}
                  </p>
                  
                  <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-[var(--pm-border)]/50 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--pm-text-muted)] font-medium">বাজেট</span>
                      <span className="font-black text-[var(--pm-accent)] text-sm">{formatBDT(demand.budget)}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-[var(--pm-text-muted)] font-bold">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[var(--pm-text-muted)]" />
                        <span>
                          {new Date(demand.createdAt).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[var(--pm-text-muted)]" />
                        <span>{demand.matchCount || 0} টি ম্যাচ</span>
                      </div>
                      {demand.location && (
                        <div className="flex items-center gap-1 col-span-2">
                          <MapPin className="w-3.5 h-3.5 text-[var(--pm-text-muted)]" />
                          <span className="truncate">{demand.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {/* Modal Dialog */}
      <AnimatePresence>
        {openModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[var(--pm-surface)] border border-[var(--pm-border)] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col text-[var(--pm-text)]"
            >
              {/* Header */}
              <div className="p-4 border-b border-[var(--pm-border)] flex items-center justify-between">
                <h3 className="font-black text-sm">নতুন ডিমান্ড রিকোয়েস্ট</h3>
                <button
                  onClick={() => setOpenModal(false)}
                  className="p-1 rounded-full hover:bg-[var(--pm-surface-hover)] text-[var(--pm-text-muted)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 overflow-y-auto max-h-[75vh]">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[var(--pm-text-muted)]">রিকোয়েস্টের শিরোনাম *</label>
                  <input
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="যেমন: ৫০০ পিস কটন টি-শার্ট দরকার"
                    className="bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl px-3 py-2 text-xs text-[var(--pm-text)] focus:outline-none focus:ring-1 focus:ring-[var(--pm-accent)]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[var(--pm-text-muted)]">বিস্তারিত বিবরণ *</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="পণ্য বা সেবার ধরন, ডেলিভারির সময় এবং অন্যান্য প্রয়োজনীয় শর্তাদি লিখুন..."
                    rows={3}
                    className="w-full resize-none bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl px-3 py-2 text-xs text-[var(--pm-text)] focus:outline-none focus:ring-1 focus:ring-[var(--pm-accent)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[var(--pm-text-muted)]">বাজেট (৳ BDT) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.budget}
                      onChange={e => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="যেমন: ৫০০০"
                      className="bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl px-3 py-2 text-xs text-[var(--pm-text)] focus:outline-none focus:ring-1 focus:ring-[var(--pm-accent)]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[var(--pm-text-muted)]">ক্যাটেগরি *</label>
                    <select
                      value={formData.categoryId}
                      onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                      className="bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl px-2.5 py-2.5 text-xs text-[var(--pm-text)] focus:outline-none"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[var(--pm-text-muted)]">লোকেশন (ঐচ্ছিক)</label>
                    <input
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      placeholder="যেমন: ঢাকা, লালবাগ"
                      className="bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl px-3 py-2 text-xs text-[var(--pm-text)] focus:outline-none focus:ring-1 focus:ring-[var(--pm-accent)]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[var(--pm-text-muted)]">জরুরি অবস্থা *</label>
                    <select
                      value={formData.urgency}
                      onChange={e => setFormData({ ...formData, urgency: e.target.value as any })}
                      className="bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl px-2.5 py-2.5 text-xs text-[var(--pm-text)] focus:outline-none"
                    >
                      <option value="low">ধীরগতি (Low)</option>
                      <option value="normal">সাধারণ (Normal)</option>
                      <option value="urgent">জরুরী (Urgent)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-[var(--pm-accent)] text-white w-full py-2.5 rounded-xl text-xs font-black shadow-lg shadow-[var(--pm-accent)]/20 active:scale-95 transition-all mt-2 flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  রিকোয়েস্ট সাবমিট করুন
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
