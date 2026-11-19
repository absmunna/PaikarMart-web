import React from 'react';
import { Lock, LogIn } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface AuthGuardProps {
  children: React.ReactNode;
  onOpenAuthModal?: (tab?: 'login' | 'register') => void;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, onOpenAuthModal }) => {
  const { firebaseUser, loading } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  if (loading) {
    return (
      <div className="p-6 sm:p-8 text-center text-sm text-[var(--pm-muted)]">
        {isBn ? 'সিকিউর সেশন যাচাই করা হচ্ছে…' : 'Checking secure session…'}
      </div>
    );
  }
  if (firebaseUser) return <>{children}</>;

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] text-center space-y-4 my-4 max-w-lg mx-auto shadow-sm">
      <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] flex items-center justify-center">
        <Lock className="w-6 h-6" />
      </div>
      <div className="space-y-1.5">
        <h2 className="text-lg font-black">
          {isBn ? 'লগইন প্রয়োজন' : 'Sign in required'}
        </h2>
        <p className="text-xs sm:text-sm text-[var(--pm-muted)] max-w-sm mx-auto leading-relaxed">
          {isBn
            ? 'আপনার প্রোফাইল, অর্ডার, ওয়ালেট এবং মেসেজ দেখতে অনুগ্রহ করে লগইন করুন।'
            : 'Log in to access your private profile, orders, wallet and messages.'}
        </p>
      </div>
      {onOpenAuthModal && (
        <button
          type="button"
          onClick={() => onOpenAuthModal('login')}
          className="px-6 py-2.5 rounded-2xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs sm:text-sm font-black inline-flex items-center justify-center gap-2 cursor-pointer active-scale shadow-md transition-all"
        >
          <LogIn className="w-4 h-4 shrink-0" />
          <span>{isBn ? 'লগইন করুন' : 'Sign in'}</span>
        </button>
      )}
    </div>
  );
};
