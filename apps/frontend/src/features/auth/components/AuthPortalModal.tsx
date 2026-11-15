import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Store,
  UserCheck,
  ArrowRight,
  LogOut
  ,KeyRound
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { UserRole } from '@/types';

interface AuthPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
}

export const AuthPortalModal: React.FC<AuthPortalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login'
}) => {
  const { 
    currentUser, 
    firebaseUser, 
    signInWithGoogle, 
    signUpWithEmail, 
    signInWithEmail, 
    sendPasswordReset,
    signOut, 
    loading 
  } = useAuth();

  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('consumer');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim()) {
      setErrorMessage('অনুগ্রহ করে আপনার নাম দিন');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('সঠিক ইমেইল এড্রেস দিন');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
      return;
    }

    try {
      setIsSubmitting(true);
      await signUpWithEmail(email, password, name, selectedRole);
      setSuccessMessage('একাউন্ট সফলভাবে তৈরি হয়েছে! স্বাগতম পাইকারমার্টে।');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setErrorMessage('এই ইমেইলটি দিয়ে ইতোমধ্যে একাউন্ট তৈরি করা আছে। লগইন করুন।');
      } else if (err.code === 'auth/weak-password') {
        setErrorMessage('পাসওয়ার্ডটি খুব দুর্বল। আরও শক্তিশালী পাসওয়ার্ড দিন।');
      } else {
        setErrorMessage(err.message || 'নিবন্ধন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim()) {
      setErrorMessage('ইমেইল দিন');
      return;
    }
    if (!password) {
      setErrorMessage('পাসওয়ার্ড দিন');
      return;
    }

    try {
      setIsSubmitting(true);
      await signInWithEmail(email, password);
      setSuccessMessage('সফলভাবে লগইন হয়েছে!');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setErrorMessage('ইমেইল বা পাসওয়ার্ড সঠিক নয়।');
      } else if (err.code === 'auth/user-not-found') {
        setErrorMessage('এই ইমেইলে কোনো একাউন্ট পাওয়া যায়নি। রেজিস্ট্রেশন করুন।');
      } else {
        setErrorMessage(err.message || 'লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setErrorMessage('');
      setIsSubmitting(true);
      await signInWithGoogle();
      setSuccessMessage('Google-এর মাধ্যমে সফলভাবে সাইন ইন করা হয়েছে!');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMessage('Google Sign-In ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('সঠিক ইমেইল এড্রেস দিন');
      return;
    }
    try {
      setIsSubmitting(true);
      await sendPasswordReset(email);
      setSuccessMessage('পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে।');
    } catch (err: any) {
      setErrorMessage(err?.code === 'auth/user-not-found' ? 'এই ইমেইলে কোনো একাউন্ট পাওয়া যায়নি।' : err?.message || 'রিসেট লিংক পাঠানো যায়নি।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setSuccessMessage('সাইন আউট সম্পন্ন হয়েছে');
    } catch (err) {
      setErrorMessage('সাইন আউট করতে সমস্যা হয়েছে');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-[2.5rem] shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="relative p-8 pb-6 bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/15 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-black/15 rounded-full blur-xl" />
          
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 opacity-80 hover:opacity-100 bg-black/15 hover:bg-black/25 rounded-2xl backdrop-blur-md transition-all active-scale cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2.5 bg-black/15 rounded-2xl backdrop-blur-xl border border-white/15">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-85">Security Protocol</span>
          </div>

          <h2 className="text-3xl font-black tracking-tight leading-tight">
            {firebaseUser ? 'Account Status' : tab === 'login' ? 'Welcome Back' : tab === 'forgot' ? 'Reset Password' : 'Get Started'}
          </h2>
          <p className="text-sm opacity-80 mt-1 font-medium">
            {firebaseUser ? 'You are securely logged in' : 'Access the PaikarMart super-ecosystem'}
          </p>
        </div>

        {/* If user is already logged in */}
        {firebaseUser ? (
          <div className="p-8 space-y-6">
            <div className="p-5 rounded-[2rem] bg-[var(--pm-accent-soft)] border border-[var(--pm-accent-border)] flex items-center gap-5">
              <div className="relative">
                <img
                  src={currentUser.avatar || firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={currentUser.name}
                  className="w-16 h-16 rounded-2xl object-cover border-4 border-[var(--pm-card)] shadow-xl"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[var(--pm-success)] border-4 border-[var(--pm-card)] rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-base font-black text-[var(--pm-text)] truncate">
                    {currentUser.name || firebaseUser.displayName}
                  </h3>
                </div>
                <p className="text-xs text-[var(--pm-muted)] font-semibold truncate">{firebaseUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-[1.5rem] bg-[var(--pm-surface)] border border-[var(--pm-border)]">
                <div className="text-[10px] font-black text-[var(--pm-muted)] uppercase tracking-wider mb-1">Access Level</div>
                <div className="text-xs font-bold text-[var(--pm-accent)] uppercase">{currentUser.role || 'Consumer'}</div>
              </div>
              <div className="p-4 rounded-[1.5rem] bg-[var(--pm-surface)] border border-[var(--pm-border)]">
                <div className="text-[10px] font-black text-[var(--pm-muted)] uppercase tracking-wider mb-1">Status</div>
                <div className="text-xs font-bold text-[var(--pm-success)] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Encrypted
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-4 text-xs font-black text-[var(--pm-text)] bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-border)] rounded-2xl active-scale transition-all cursor-pointer"
              >
                পোর্টেলে ফিরে যান
              </button>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="py-4 px-6 text-xs font-black text-[var(--pm-danger)] bg-[var(--pm-danger-soft)] hover:opacity-90 rounded-2xl border border-[var(--pm-danger)]/30 flex items-center gap-2 active-scale transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> সাইন আউট
              </button>
            </div>
          </div>
        ) : (
          /* Authentication Form */
          <div className="p-8 space-y-6">
            {/* Tab Switcher */}
            <div className="grid grid-cols-2 p-1.5 bg-[var(--pm-surface)] rounded-2xl border border-[var(--pm-border)]">
              <button
                onClick={() => { setTab('login'); setErrorMessage(''); }}
                className={`py-2.5 text-xs font-black rounded-xl transition-all active-scale cursor-pointer ${
                  tab === 'login'
                    ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-md'
                    : 'text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
                }`}
              >
                লগইন
              </button>
              <button
                onClick={() => { setTab('register'); setErrorMessage(''); }}
                className={`py-2.5 text-xs font-black rounded-xl transition-all active-scale cursor-pointer ${
                  tab === 'register'
                    ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-md'
                    : 'text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
                }`}
              >
                নিবন্ধন
              </button>
            </div>

            {/* Error / Success Alert */}
            {errorMessage && (
              <div className="p-4 text-xs font-bold text-[var(--pm-danger)] bg-[var(--pm-danger-soft)] border border-[var(--pm-danger)]/30 rounded-2xl flex items-center gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 shrink-0 opacity-80" />
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="p-4 text-xs font-bold text-[var(--pm-success)] bg-[var(--pm-success-soft)] border border-[var(--pm-success)]/30 rounded-2xl flex items-center gap-3 animate-scale-in">
                <CheckCircle2 className="w-5 h-5 shrink-0 opacity-80" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={tab === 'login' ? handleLogin : tab === 'forgot' ? handlePasswordReset : handleRegister} className="space-y-4">
              {tab === 'register' && (
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-[var(--pm-muted)] uppercase tracking-widest ml-1">
                    Full Name
                  </label>
                  <div className="relative group">
                    <UserIcon className="w-4.5 h-4.5 text-[var(--pm-muted)] absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[var(--pm-accent)] transition-colors" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="তানভীর আহমেদ"
                      className="w-full pl-12 pr-5 py-3.5 text-sm font-bold bg-[var(--pm-input)] border border-[var(--pm-border)] rounded-[1.25rem] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:outline-none focus:border-[var(--pm-accent)] transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-[var(--pm-muted)] uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="w-4.5 h-4.5 text-[var(--pm-muted)] absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[var(--pm-accent)] transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@paikarmart.com"
                    className="w-full pl-12 pr-5 py-3.5 text-sm font-bold bg-[var(--pm-input)] border border-[var(--pm-border)] rounded-[1.25rem] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:outline-none focus:border-[var(--pm-accent)] transition-all"
                  />
                </div>
              </div>

              {tab === 'login' && (
                <button type="button" onClick={() => { setTab('forgot'); setErrorMessage(''); setSuccessMessage(''); }} className="text-xs font-bold text-[var(--pm-accent)] hover:underline cursor-pointer">
                  পাসওয়ার্ড ভুলে গেছেন?
                </button>
              )}

              {tab !== 'forgot' && <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-[var(--pm-muted)] uppercase tracking-widest ml-1">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="w-4.5 h-4.5 text-[var(--pm-muted)] absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[var(--pm-accent)] transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3.5 text-sm font-bold bg-[var(--pm-input)] border border-[var(--pm-border)] rounded-[1.25rem] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:outline-none focus:border-[var(--pm-accent)] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--pm-muted)] hover:text-[var(--pm-text)] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>}

              {tab === 'register' && (
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-[var(--pm-muted)] uppercase tracking-widest ml-1">
                    Select Account Tier
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('consumer')}
                      className={`p-4 text-left rounded-3xl border transition-all active-scale cursor-pointer ${
                        selectedRole === 'consumer'
                          ? 'bg-[var(--pm-accent-soft)] border-[var(--pm-accent)] ring-2 ring-[var(--pm-accent-border)]'
                          : 'bg-[var(--pm-surface)] border-[var(--pm-border)] hover:bg-[var(--pm-card-hover)]'
                      }`}
                    >
                      <UserCheck className={`w-5 h-5 mb-2 ${selectedRole === 'consumer' ? 'text-[var(--pm-accent)]' : 'text-[var(--pm-muted)]'}`} />
                      <div className={`text-xs font-black ${selectedRole === 'consumer' ? 'text-[var(--pm-accent)]' : 'text-[var(--pm-text)]'}`}>Consumer</div>
                      <div className="text-[10px] font-medium text-[var(--pm-muted)]">Shop & Order</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('vendor')}
                      className={`p-4 text-left rounded-3xl border transition-all active-scale cursor-pointer ${
                        selectedRole === 'vendor'
                          ? 'bg-[var(--pm-accent-soft)] border-[var(--pm-accent)] ring-2 ring-[var(--pm-accent-border)]'
                          : 'bg-[var(--pm-surface)] border-[var(--pm-border)] hover:bg-[var(--pm-card-hover)]'
                      }`}
                    >
                      <Store className={`w-5 h-5 mb-2 ${selectedRole === 'vendor' ? 'text-[var(--pm-accent)]' : 'text-[var(--pm-muted)]'}`} />
                      <div className={`text-xs font-black ${selectedRole === 'vendor' ? 'text-[var(--pm-accent)]' : 'text-[var(--pm-text)]'}`}>Merchant</div>
                      <div className="text-[10px] font-medium text-[var(--pm-muted)]">Bulk & Sell</div>
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 text-sm font-black text-[var(--pm-accent-fg)] bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] rounded-2xl shadow-xl active-scale transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-3 border-current/30 border-t-current rounded-full animate-spin" />
                ) : (
                  <>
                <span>{tab === 'login' ? 'Secure Access' : tab === 'forgot' ? 'Send Reset Link' : 'Create Account'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {tab === 'forgot' && (
              <button type="button" onClick={() => { setTab('login'); setErrorMessage(''); setSuccessMessage(''); }} className="w-full text-center text-xs font-bold text-[var(--pm-muted)] hover:text-[var(--pm-accent)] cursor-pointer">
                লগইনে ফিরে যান
              </button>
            )}

            {tab !== 'forgot' && <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-[var(--pm-border)]" />
              <span className="flex-shrink mx-4 text-[9px] font-black text-[var(--pm-muted)] uppercase tracking-widest">Global Auth</span>
              <div className="flex-grow border-t border-[var(--pm-border)]" />
            </div>}

            {/* Google Sign In Button */}
            {tab !== 'forgot' && <button
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 text-xs font-black text-[var(--pm-text)] bg-[var(--pm-surface)] border border-[var(--pm-border)] hover:bg-[var(--pm-card-hover)] rounded-2xl shadow-sm active-scale transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>}
          </div>
        )}
      </div>
    </div>
  );
};
