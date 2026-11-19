import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowLeft,
  Mail, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  LogOut,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBodyScrollLock } from '@/shared/hooks/useBodyScrollLock';

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
    sendEmailVerificationSignal,
    reloadUser,
    signOut, 
    loading 
  } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Keep tab & feedback messages synced whenever view opens or initialTab changes
  useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [isOpen, initialTab]);

  // Close on Escape key when view is open
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, isSubmitting, onClose]);

  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  const isBusy = isSubmitting || loading;

  const switchTab = (nextTab: 'login' | 'register' | 'forgot') => {
    setTab(nextTab);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim()) {
      setErrorMessage(isBn ? 'অনুগ্রহ করে আপনার নাম দিন' : 'Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage(isBn ? 'সঠিক ইমেইল এড্রেস দিন' : 'Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setErrorMessage(isBn ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' : 'Password must be at least 6 characters');
      return;
    }

    try {
      setIsSubmitting(true);
      await signUpWithEmail(email.trim(), password, name.trim(), 'consumer');
      setSuccessMessage(isBn ? 'একাউন্ট সফলভাবে তৈরি হয়েছে! স্বাগতম পাইকারমার্টে।' : 'Account created successfully! Welcome to PaikarMart.');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setErrorMessage(isBn ? 'এই ইমেইলটি দিয়ে ইতোমধ্যে একাউন্ট তৈরি করা আছে। লগইন করুন।' : 'An account with this email already exists. Please sign in.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMessage(isBn ? 'পাসওয়ার্ডটি খুব দুর্বল। আরও শক্তিশালী পাসওয়ার্ড দিন।' : 'Password is too weak. Please choose a stronger password.');
      } else {
        setErrorMessage(err.message || (isBn ? 'নিবন্ধন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।' : 'Registration failed. Please try again.'));
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
      setErrorMessage(isBn ? 'ইমেইল দিন' : 'Please enter your email');
      return;
    }
    if (!password) {
      setErrorMessage(isBn ? 'পাসওয়ার্ড দিন' : 'Please enter your password');
      return;
    }

    try {
      setIsSubmitting(true);
      await signInWithEmail(email.trim(), password);
      setSuccessMessage(isBn ? 'সফলভাবে লগইন হয়েছে!' : 'Signed in successfully!');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setErrorMessage(isBn ? 'ইমেইল বা পাসওয়ার্ড সঠিক নয়।' : 'Incorrect email or password.');
      } else if (err.code === 'auth/user-not-found') {
        setErrorMessage(isBn ? 'এই ইমেইলে কোনো একাউন্ট পাওয়া যায়নি। রেজিস্ট্রেশন করুন।' : 'No account found for this email. Please register.');
      } else {
        setErrorMessage(err.message || (isBn ? 'লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।' : 'Sign in failed. Please try again.'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setErrorMessage('');
      setSuccessMessage('');
      setIsSubmitting(true);
      await signInWithGoogle();
      setSuccessMessage(isBn ? 'Google-এর মাধ্যমে সফলভাবে সাইন ইন করা হয়েছে!' : 'Signed in with Google successfully!');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch {
      setErrorMessage(isBn ? 'Google Sign-In ব্যর্থ হয়েছে। আবার চেষ্টা করুন।' : 'Google Sign-In failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage(isBn ? 'সঠিক ইমেইল এড্রেস দিন' : 'Please enter a valid email address');
      return;
    }
    try {
      setIsSubmitting(true);
      await sendPasswordReset(email.trim());
      setSuccessMessage(isBn ? 'পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে।' : 'Password reset link sent to your email.');
    } catch (err: any) {
      setErrorMessage(
        err?.code === 'auth/user-not-found'
          ? (isBn ? 'এই ইমেইলে কোনো একাউন্ট পাওয়া যায়নি।' : 'No account found with this email.')
          : err?.message || (isBn ? 'রিসেট লিংক পাঠানো যায়নি।' : 'Unable to send reset link.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      setErrorMessage('');
      setSuccessMessage('');
      await signOut();
      setSuccessMessage(isBn ? 'সাইন আউট সম্পন্ন হয়েছে' : 'Signed out successfully');
    } catch {
      setErrorMessage(isBn ? 'সাইন আউট করতে সমস্যা হয়েছে' : 'Failed to sign out');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={firebaseUser ? 'Account Status' : 'Authentication'}
      className="fixed inset-0 z-50 h-[100dvh] w-full flex flex-col bg-[var(--pm-bg)] text-[var(--pm-text)] overflow-y-auto overscroll-contain animate-fade-in"
    >
      {/* Compact Top Navigation Bar */}
      <header className="sticky top-0 z-10 h-14 px-3 sm:px-6 border-b border-[var(--pm-border)] bg-[var(--pm-card)]/90 backdrop-blur-md flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="p-2 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-text)] hover:text-[var(--pm-accent)] active-scale transition-all cursor-pointer disabled:opacity-50"
            aria-label={isBn ? 'ফিরে যান' : 'Back'}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] flex items-center justify-center font-black text-sm shadow-xs">
              P
            </div>
            <span className="text-sm font-bold tracking-tight text-[var(--pm-text)]">PaikarMart</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          disabled={isBusy}
          aria-label={isBn ? 'বন্ধ করুন' : 'Close'}
          className="p-2 rounded-xl text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-surface)] transition-colors cursor-pointer disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>
      </header>

      {/* Centered Full-Page Form Viewport (Fits comfortably without scroll) */}
      <main className="flex-1 flex items-center justify-center px-3 py-3 sm:px-6 sm:py-6">
        <div className="w-full max-w-md bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-2xl sm:rounded-3xl shadow-sm p-4 sm:p-6 space-y-3.5">
          {/* Compact Standard-Size Page Heading */}
          <div className="space-y-0.5">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--pm-text)]">
              {firebaseUser
                ? (isBn ? 'অ্যাকাউন্ট স্ট্যাটাস' : 'Account Status')
                : tab === 'login'
                ? (isBn ? 'অ্যাকাউন্টে লগইন করুন' : 'Sign in to your account')
                : tab === 'forgot'
                ? (isBn ? 'পাসওয়ার্ড রিসেট করুন' : 'Reset your password')
                : (isBn ? 'নতুন অ্যাকাউন্ট তৈরি করুন' : 'Create your account')}
            </h1>
            <p className="text-xs text-[var(--pm-muted)]">
              {firebaseUser
                ? (isBn ? 'আপনি নিরাপদভাবে লগইন অবস্থায় আছেন' : 'You are currently signed in')
                : tab === 'login'
                ? (isBn ? 'ইমেইল বা Google দিয়ে প্রবেশ করুন' : 'Continue with email or Google')
                : tab === 'forgot'
                ? (isBn ? 'রিসেট লিংক পেতে ইমেইল দিন' : 'Enter your email to receive a reset link')
                : (isBn ? 'শপিং ও কমিউনিটি ফিচার আনলক করতে নিবন্ধন করুন' : 'Register to unlock orders, wallet & messaging')}
            </p>
          </div>

          {firebaseUser ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[var(--pm-accent-soft)] border border-[var(--pm-accent-border)] flex items-center gap-3.5">
                <div className="relative shrink-0">
                  <img
                    src={currentUser.avatar || firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={currentUser.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover border-2 border-[var(--pm-card)] shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[var(--pm-success)] border-2 border-[var(--pm-card)] rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-bold text-[var(--pm-text)] truncate">
                    {currentUser.name || firebaseUser.displayName}
                  </h2>
                  <p className="text-xs text-[var(--pm-muted)] truncate">{firebaseUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
                  <div className="text-[10px] font-bold text-[var(--pm-muted)] uppercase tracking-wider mb-0.5">
                    {isBn ? 'অ্যাক্সেস লেভেল' : 'Access Level'}
                  </div>
                  <div className="text-xs font-bold text-[var(--pm-accent)] uppercase">{currentUser.role || 'Consumer'}</div>
                </div>
                <div className="p-3 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
                  <div className="text-[10px] font-bold text-[var(--pm-muted)] uppercase tracking-wider mb-0.5">
                    {isBn ? 'স্ট্যাটাস' : 'Status'}
                  </div>
                  <div className="text-xs font-bold text-[var(--pm-success)] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{isBn ? 'ভেরিফায়েড' : 'Encrypted'}</span>
                  </div>
                </div>
              </div>

              {/* Email Verification Banner */}
              <div className="p-3.5 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--pm-text)]">
                    {isBn ? 'ইমেইল ভেরিফিকেশন স্ট্যাটাস' : 'Email Verification Status'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    firebaseUser.emailVerified ? 'bg-emerald-500/15 text-emerald-600' : 'bg-amber-500/15 text-amber-600'
                  }`}>
                    {firebaseUser.emailVerified ? (isBn ? 'ভেরিফাইড' : 'Verified') : (isBn ? 'অপেক্ষমাণ' : 'Pending Verification')}
                  </span>
                </div>
                {!firebaseUser.emailVerified && (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await sendEmailVerificationSignal();
                          setSuccessMessage(isBn ? 'ভেরিফিকেশন লিংক পাঠানো হয়েছে।' : 'Verification email sent successfully.');
                        } catch (err: any) {
                          setErrorMessage(err?.message || 'Failed to send verification email.');
                        }
                      }}
                      className="flex-1 py-2 px-3 bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] rounded-xl text-xs font-bold hover:bg-[var(--pm-accent-hover)] transition-colors cursor-pointer"
                    >
                      {isBn ? 'ভেরিফিকেশন ইমেইল পাঠান' : 'Send Verification Link'}
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await reloadUser();
                        setSuccessMessage(isBn ? 'স্ট্যাটাস রিফ্রেশ হয়েছে।' : 'Status refreshed.');
                      }}
                      className="py-2 px-3 bg-[var(--pm-card)] border border-[var(--pm-border)] text-[var(--pm-text)] rounded-xl text-xs font-bold hover:border-[var(--pm-accent)] transition-colors cursor-pointer"
                    >
                      {isBn ? 'রিফ্রেশ' : 'Check Status'}
                    </button>
                  </div>
                )}
              </div>

              {/* Seller Account Access Card */}
              <div className="p-3.5 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-between gap-3">
                <div className="space-y-0.5 min-w-0">
                  <div className="text-xs font-bold text-[var(--pm-text)]">
                    {isBn ? 'সেলার অ্যাকাউন্ট অ্যাক্সেস' : 'Seller & Merchant Access'}
                  </div>
                  <p className="text-[11px] text-[var(--pm-muted)] truncate">
                    {currentUser.isVendor 
                      ? (isBn ? 'আপনি একজন ভেরিফাইড মার্চেন্ট/সেলার' : 'Active Merchant Storefront Verified') 
                      : (isBn ? 'পাইকারিতে পণ্য বিক্রির জন্য সেলার KYC করুন' : 'Upgrade account to sell wholesale & B2B')}
                  </p>
                </div>
                <span className={`shrink-0 px-2.5 py-1 rounded-xl text-xs font-bold ${
                  currentUser.isVendor ? 'bg-emerald-500/15 text-emerald-600' : 'bg-[var(--pm-card)] text-[var(--pm-muted)] border border-[var(--pm-border)]'
                }`}>
                  {currentUser.isVendor ? 'Active Seller' : 'Consumer'}
                </span>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isBusy}
                  className="flex-1 py-2.5 px-4 text-xs font-bold text-[var(--pm-text)] bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-border)] rounded-xl active-scale transition-all cursor-pointer disabled:opacity-60"
                >
                  {isBn ? 'পোর্টেলে ফিরে যান' : 'Back to Portal'}
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isBusy}
                  className="py-2.5 px-4 text-xs font-bold text-[var(--pm-danger)] bg-[var(--pm-danger-soft)] hover:opacity-90 rounded-xl border border-[var(--pm-danger)]/30 flex items-center justify-center gap-2 active-scale transition-all cursor-pointer disabled:opacity-60"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                  <span>{isBn ? 'সাইন আউট' : 'Sign Out'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              {/* Tab Switcher */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-[var(--pm-surface)] rounded-xl border border-[var(--pm-border)]">
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => switchTab('login')}
                  className={`py-2 px-3 text-xs font-bold rounded-lg transition-all active-scale cursor-pointer disabled:opacity-60 ${
                    tab === 'login'
                      ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-xs'
                      : 'text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
                  }`}
                >
                  {isBn ? 'লগইন' : 'Login'}
                </button>
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => switchTab('register')}
                  className={`py-2 px-3 text-xs font-bold rounded-lg transition-all active-scale cursor-pointer disabled:opacity-60 ${
                    tab === 'register'
                      ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-xs'
                      : 'text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
                  }`}
                >
                  {isBn ? 'নিবন্ধন' : 'Register'}
                </button>
              </div>

              {/* Error / Success Alert */}
              {errorMessage && (
                <div className="p-2.5 text-xs font-semibold text-[var(--pm-danger)] bg-[var(--pm-danger-soft)] border border-[var(--pm-danger)]/30 rounded-xl flex items-center gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="leading-snug">{errorMessage}</span>
                </div>
              )}
              {successMessage && (
                <div className="p-2.5 text-xs font-semibold text-[var(--pm-success)] bg-[var(--pm-success-soft)] border border-[var(--pm-success)]/30 rounded-xl flex items-center gap-2 animate-scale-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="leading-snug">{successMessage}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={tab === 'login' ? handleLogin : tab === 'forgot' ? handlePasswordReset : handleRegister} className="space-y-3">
                {tab === 'register' && (
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-[var(--pm-muted)] ml-0.5">
                      {isBn ? 'পুরো নাম' : 'Full Name'}
                    </label>
                    <div className="relative group">
                      <UserIcon className="w-4 h-4 text-[var(--pm-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-[var(--pm-accent)] transition-colors" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={isBn ? 'তানভীর আহমেদ' : 'Tanvir Ahmed'}
                        className="w-full pl-9 pr-3.5 py-2.5 text-sm font-medium bg-[var(--pm-input)] border border-[var(--pm-border)] rounded-xl text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:outline-none focus:border-[var(--pm-accent)] focus:ring-2 focus:ring-[var(--pm-accent)]/15 transition-all"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-[var(--pm-muted)] ml-0.5">
                    {isBn ? 'ইমেইল এড্রেস' : 'Email Address'}
                  </label>
                  <div className="relative group">
                    <Mail className="w-4 h-4 text-[var(--pm-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-[var(--pm-accent)] transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@paikarmart.com"
                      className="w-full pl-9 pr-3.5 py-2.5 text-sm font-medium bg-[var(--pm-input)] border border-[var(--pm-border)] rounded-xl text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:outline-none focus:border-[var(--pm-accent)] focus:ring-2 focus:ring-[var(--pm-accent)]/15 transition-all"
                    />
                  </div>
                </div>

                {tab !== 'forgot' && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between px-0.5">
                      <label className="block text-[11px] font-semibold text-[var(--pm-muted)]">
                        {isBn ? 'পাসওয়ার্ড' : 'Password'}
                      </label>
                      {tab === 'login' && (
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => switchTab('forgot')}
                          className="text-[11px] font-semibold text-[var(--pm-accent)] hover:underline cursor-pointer disabled:opacity-60"
                        >
                          {isBn ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot password?'}
                        </button>
                      )}
                    </div>
                    <div className="relative group">
                      <Lock className="w-4 h-4 text-[var(--pm-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-[var(--pm-accent)] transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2.5 text-sm font-medium bg-[var(--pm-input)] border border-[var(--pm-border)] rounded-xl text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:outline-none focus:border-[var(--pm-accent)] focus:ring-2 focus:ring-[var(--pm-accent)]/15 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isBusy}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-surface)] transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isBusy}
                  className="w-full py-2.5 sm:py-3 px-4 text-sm font-bold text-[var(--pm-accent-fg)] bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] rounded-xl shadow-md active-scale transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {isBusy ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>
                        {tab === 'login'
                          ? (isBn ? 'লগইন করুন' : 'Sign In')
                          : tab === 'forgot'
                          ? (isBn ? 'রিসেট লিংক পাঠান' : 'Send Reset Link')
                          : (isBn ? 'একাউন্ট তৈরি করুন' : 'Create Account')}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {tab === 'forgot' && (
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => switchTab('login')}
                  className="w-full py-1.5 text-center text-xs font-semibold text-[var(--pm-muted)] hover:text-[var(--pm-accent)] cursor-pointer disabled:opacity-60"
                >
                  {isBn ? 'লগইনে ফিরে যান' : 'Back to Login'}
                </button>
              )}

              {tab !== 'forgot' && (
                <>
                  <div className="relative flex items-center py-0.5">
                    <div className="flex-grow border-t border-[var(--pm-border)]" />
                    <span className="flex-shrink mx-3 text-[10px] font-bold text-[var(--pm-muted)] uppercase tracking-wider">
                      {isBn ? 'অথবা' : 'OR'}
                    </span>
                    <div className="flex-grow border-t border-[var(--pm-border)]" />
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isBusy}
                    className="w-full py-2.5 px-4 text-xs font-bold text-[var(--pm-text)] bg-[var(--pm-surface)] border border-[var(--pm-border)] hover:bg-[var(--pm-card-hover)] rounded-xl shadow-2xs active-scale transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>{isBn ? 'Google দিয়ে সাইন ইন করুন' : 'Continue with Google'}</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
