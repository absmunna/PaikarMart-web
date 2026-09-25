import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, AlertCircle, Clock, MapPin, Building2, Phone, MessageCircle, Send } from 'lucide-react';

export default function DemandDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 pb-24 w-full max-w-2xl mx-auto px-4 pt-4">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] active:scale-95 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] active:scale-95 transition-all">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-[var(--pm-surface)] rounded-3xl border border-[var(--pm-border)] p-6 shadow-xl">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase">Fashion</span>
          <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-[10px] font-black uppercase flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Urgent
          </span>
        </div>

        <h1 className="text-2xl font-black leading-tight text-[var(--pm-text)] mb-4">
          ১০০০ পিস কটন টি-শার্ট দরকার (পাইকারি)
        </h1>

        <div className="grid grid-cols-2 gap-4 mb-6 pt-6 border-t border-[var(--pm-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] text-[var(--pm-text-muted)]">সময়সীমা</p>
              <p className="text-xs font-bold text-[var(--pm-text)]">৩ দিন বাকি</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] text-[var(--pm-text-muted)]">বাজেট</p>
              <p className="text-xs font-bold text-[var(--pm-text)]">৳ ১,৫০,০০০ পর্যন্ত</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-black text-[var(--pm-text)]">বিস্তারিত বিবরণ:</h3>
          <p className="text-sm text-[var(--pm-text-muted)] leading-relaxed">
            আসসালামু আলাইকুম। আমাদের ই-কমার্স স্টোরের জন্য ১০০০ পিস প্রিমিয়াম কোয়ালিটি কটন টি-শার্ট প্রয়োজন। 
            কাপড় ১৮০ জিএসএম হতে হবে। সাইজ এস, এম, এল, এক্সএল মিক্স থাকতে হবে। 
            যারা সরাসরি ম্যানুফ্যাকচারার এবং দ্রুত সরবরাহ করতে পারবেন তারা যোগাযোগ করুন।
          </p>
        </div>

        <div className="mt-8 p-4 rounded-2xl bg-zinc-50 border border-dashed border-zinc-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-zinc-200 overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tamim" alt="Author" />
            </div>
            <div>
              <p className="text-sm font-black text-zinc-900">তামীম এন্টারপ্রাইজ</p>
              <p className="text-[10px] text-zinc-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> উত্তরা, ঢাকা · ভেরিফাইড বায়ার
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-zinc-100 sm:relative sm:bg-transparent sm:border-0 sm:p-0">
        <div className="max-w-2xl mx-auto flex gap-3">
          <button className="flex-1 bg-emerald-600 text-white h-14 rounded-2xl font-black text-sm shadow-lg shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-2">
            <Send className="w-4 h-4" /> অফার জমা দিন
          </button>
          <button className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
            <MessageCircle className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
