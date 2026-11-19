import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, KeyRound, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/modules/auth';
import { toast } from 'sonner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { sendPasswordReset } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (sendPasswordReset) {
        await sendPasswordReset(email.trim());
      }
      setSuccess(true);
      toast.success('পাসওয়ার্ড রিসেট ইমেইল পাঠানো হয়েছে!');
    } catch (err: any) {
      const msg = err?.message || 'পাসওয়ার্ড রিসেট করতে সমস্যা হয়েছে। সঠিক ইমেইল দিন।';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-b from-[var(--pm-bg)] via-[var(--pm-surface)] to-[var(--pm-bg)]">
      <div className="w-full max-w-md mb-4 flex items-center justify-between">
        <Link 
          to="/login" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--pm-text-muted)] hover:text-[var(--pm-accent)] transition-colors py-1.5 px-3 rounded-full bg-[var(--pm-surface)] border border-[var(--pm-border)] shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          লগইনে ফিরুন
        </Link>
        <span className="text-[11px] font-bold text-[var(--pm-text-muted)] flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          নিরাপদ রিকভারি
        </span>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[var(--pm-surface)] p-6 sm:p-8 rounded-3xl border border-[var(--pm-border)] shadow-xl relative overflow-hidden backdrop-blur-md"
      >
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-[var(--pm-accent)]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center mb-6 relative z-10">
          <div className="w-14 h-14 bg-gradient-to-tr from-[var(--pm-accent)] to-amber-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[var(--pm-accent)]/20">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-[var(--pm-text)] tracking-tight">পাসওয়ার্ড ভুলে গেছেন?</h1>
          <p className="text-xs text-[var(--pm-text-muted)] font-medium mt-1 max-w-[280px] mx-auto">
            আপনার নিবন্ধিত ইমেইল ঠিকানা দিন, আমরা পাসওয়ার্ড রিসেট করার নিরাপদ লিংক পাঠাবো।
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-500 text-xs font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="text-center py-4 space-y-3">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              পাসওয়ার্ড রিসেট লিংক সফলভাবে পাঠানো হয়েছে! দয়া করে আপনার ইমেইল ইনবক্স চেক করুন।
            </div>
            <Link
              to="/login"
              className="inline-block w-full py-3 bg-[var(--pm-accent)] text-white font-black rounded-2xl text-xs text-center shadow-md shadow-[var(--pm-accent)]/20 hover:opacity-95 transition-all"
            >
              লগইন পেজে ফিরে যান
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--pm-text-secondary)] block ml-1">ইমেইল ঠিকানা</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pm-text-muted)]" />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl py-3 pl-10 pr-4 text-xs text-[var(--pm-text)] focus:border-[var(--pm-accent)] outline-none font-medium transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--pm-accent)] hover:opacity-95 text-white font-black py-3 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[var(--pm-accent)]/20 text-xs disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'রিসেট লিংক পাঠান'
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
