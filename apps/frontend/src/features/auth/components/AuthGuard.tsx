import React from 'react';
import { Lock, LogIn } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  onOpenAuthModal?: (tab?: 'login' | 'register') => void;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, onOpenAuthModal }) => {
  const { firebaseUser, loading } = useAuth();
  if (loading) return <div className="p-8 text-center text-sm text-[var(--pm-muted)]">Checking secure session…</div>;
  if (firebaseUser) return <>{children}</>;
  return (
    <div className="p-8 rounded-3xl bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] text-center space-y-4 my-4">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] flex items-center justify-center"><Lock className="w-6 h-6" /></div>
      <h2 className="text-lg font-bold">Sign in required</h2>
      <p className="text-xs text-[var(--pm-muted)]">Log in to access your private profile, orders, wallet and messages.</p>
      <button type="button" onClick={() => onOpenAuthModal?.('login')} className="px-5 py-2.5 rounded-xl bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] text-xs font-bold inline-flex items-center gap-2 cursor-pointer"><LogIn className="w-4 h-4" /> Sign in</button>
    </div>
  );
};
