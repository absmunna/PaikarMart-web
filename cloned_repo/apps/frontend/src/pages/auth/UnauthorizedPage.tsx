import React from 'react';
import { ShieldAlert, ArrowLeft, Home, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { safeBack } from '@/lib/navigation';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] flex items-center justify-center p-6 text-center select-none">
      <div className="max-w-md w-full p-8 sm:p-10 rounded-[36px] bg-[var(--pm-surface)] border border-white/10 space-y-6 shadow-2xl">
        <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto animate-pulse">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            অ্যাক্সেস সংরক্ষিত (Access Denied)
          </h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            এই পোর্টাল বা ম্যানেজমেন্ট ককপিটটি শুধুমাত্র সুপার অ্যাডমিন বা অনুমোদিত পিকে শপ স্টাফদের জন্য সংরক্ষিত। আপনার বর্তমান অ্যাকাউন্টে পর্যাপ্ত অনুমতি নেই।
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Link
            to="/auth/login"
            className="w-full py-3.5 rounded-2xl bg-[var(--pm-accent)] hover:opacity-95 text-white font-black text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>অন্য অ্যাকাউন্টে লগইন করুন</span>
          </Link>

          <button
            onClick={() => safeBack(navigate, '/')}
            className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-300 font-bold text-xs transition-all border border-white/5 flex items-center justify-center gap-2 cursor-pointer"
            title="ফিরে যান"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>পূর্ববর্তী পেজে ফিরে যান</span>
          </button>

          <Link
            to="/"
            className="w-full py-2.5 text-zinc-500 hover:text-white font-bold text-[11px] transition-colors flex items-center justify-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>হোমে যান</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
