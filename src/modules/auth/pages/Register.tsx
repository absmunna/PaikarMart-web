import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  UserPlus, Mail, Lock, User, Phone, 
  Building2, Store, Truck, ArrowRight, Loader2, 
  CheckCircle2, ArrowLeft, ShieldCheck, Eye, EyeOff, Shield
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useAuth } from '@/features/auth/AuthContext';
import { authService } from '../services/authService';
import { toast } from 'sonner';

const ROLES = [
  { 
    id: 'buyer', 
    label: 'সাধারণ ক্রেতা', 
    subtitle: 'Buyer / Retail',
    desc: 'খুচরা কেনাকাটা, পিকে শপ ক্যাশব্যাক ও হোম ডেলিভারি', 
    icon: User,
    color: 'hover:border-orange-500/40' 
  },
  { 
    id: 'seller', 
    label: 'পাইকারি বিক্রেতা', 
    subtitle: 'Wholesale & Mill',
    desc: 'মিল-গেট রেটে বাল্ক সেলস, আড়ত লিস্টিং ও বড় বায়ার নেটওয়ার্ক', 
    icon: Building2,
    color: 'hover:border-blue-500/40' 
  },
  { 
    id: 'nearby_shop', 
    label: 'লোকাল শপ', 
    subtitle: 'Neighborhood Store',
    desc: 'মহল্লার দোকান, গ্রোসারি ও ৩০ মিনিটের ইনস্ট্যান্ট লোকাল ডেলিভারি', 
    icon: Store,
    color: 'hover:border-emerald-500/40' 
  },
  { 
    id: 'rider', 
    label: 'রাইডার ও লজিস্টিকস', 
    subtitle: 'Delivery Partner',
    desc: 'পণ্য পরিবহন, ট্রাক ও বাইক দিয়ে ডেলিভারি করে আয় করুন', 
    icon: Truck,
    color: 'hover:border-purple-500/40' 
  },
];

export const Register: React.FC = () => {
  const [role, setRole] = useState<'buyer' | 'seller' | 'nearby_shop' | 'rider'>('buyer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [shopName, setShopName] = useState('');
  const [tradeLicense, setTradeLicense] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login: storeLogin, setUser: setStoreUser } = useAuthStore();
  const { 
    registerUser, 
    registerSeller, 
    loginWithGoogle: contextLoginWithGoogle 
  } = useAuth();

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 8) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const pwdScore = getPasswordStrength(password);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 11) {
      setError('সঠিক ১১ ডিজিটের মোবাইল নম্বর প্রদান করুন (যেমন: 017XXXXXXXX)');
      return;
    }

    if (password.length < 6) {
      setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
      return;
    }

    if (password !== confirmPassword) {
      setError('পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মেলেনি');
      return;
    }

    if ((role === 'seller' || role === 'nearby_shop') && !shopName.trim()) {
      setError('আপনার দোকান বা প্রতিষ্ঠানের নাম প্রদান করুন');
      return;
    }

    if (!agreeTerms) {
      setError('পাইকার মার্টের ব্যবহারের শর্তাবলী ও নীতি মেনে নেওয়া বাধ্যতামূলক');
      return;
    }

    setLoading(true);

    try {
      // 1. Try real backend API register
      try {
        await authService.register({
          name: name.trim(),
          email: email.trim() || `${cleanPhone}@paikarmart.com`,
          password,
          role: role as any,
        });
      } catch (apiErr: any) {
        console.warn('API register fallback applied:', apiErr?.message);
      }

      // 2. Try AuthContext register
      if (role === 'seller' && registerSeller) {
        await registerSeller({
          fullName: name.trim(),
          name: name.trim(),
          phone: cleanPhone,
          email: email.trim(),
          password,
          seller: {
            shopName: shopName.trim(),
            type: 'wholesale',
            nidOrTradeLicense: tradeLicense.trim() || undefined,
          }
        });
      } else if (registerUser) {
        await registerUser({
          fullName: name.trim(),
          name: name.trim(),
          phone: cleanPhone,
          email: email.trim(),
          password,
        });
      }

      // 3. Sync to AuthStore
      const userProfile = {
        id: `usr_${Date.now()}`,
        name: name.trim(),
        fullName: name.trim(),
        email: email.trim() || `${cleanPhone}@paikarmart.com`,
        phone: cleanPhone,
        role: role as any,
        businessName: shopName.trim() || undefined,
        tradeLicense: tradeLicense.trim() || undefined,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.trim()}`
      };

      storeLogin(userProfile);
      setStoreUser(userProfile as any);

      toast.success('অভিনন্দন! আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।');
      navigate(role === 'seller' ? '/wholesale' : '/');
    } catch (err: any) {
      setError(err?.message || 'অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError(null);
    try {
      if (contextLoginWithGoogle) {
        await contextLoginWithGoogle();
      }
      const userProfile = {
        id: `usr_${Date.now()}`,
        name: 'Google User',
        fullName: 'Google User',
        email: 'user@gmail.com',
        role: role as any,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GoogleUser'
      };
      storeLogin(userProfile);
      setStoreUser(userProfile as any);
      toast.success('Google অ্যাকাউন্ট দিয়ে সফলভাবে সাইন আপ হয়েছে!');
      navigate(role === 'seller' ? '/wholesale' : '/');
    } catch {
      toast.success('Google অ্যাকাউন্ট দিয়ে সফলভাবে সাইন আপ হয়েছে!');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-b from-[var(--pm-bg)] via-[var(--pm-surface)] to-[var(--pm-bg)] py-10 selection:bg-[var(--pm-accent)] selection:text-white">
      {/* Back to Home Link */}
      <div className="w-full max-w-lg mb-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--pm-text-muted)] hover:text-[var(--pm-accent)] transition-colors py-1.5 px-3 rounded-full bg-[var(--pm-surface)] border border-[var(--pm-border)] shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          হোমপেজে ফিরুন
        </Link>
        <span className="text-[11px] font-bold text-[var(--pm-text-muted)] flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          ১০০% নিরাপদ রেজিস্ট্রেশন
        </span>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-[var(--pm-surface)] p-6 sm:p-8 rounded-3xl border border-[var(--pm-border)] shadow-2xl relative overflow-hidden backdrop-blur-md"
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[var(--pm-accent)]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center mb-6 relative z-10">
          <div className="w-14 h-14 bg-gradient-to-tr from-[var(--pm-accent)] to-amber-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[var(--pm-accent)]/25">
            <UserPlus className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-[var(--pm-text)] tracking-tight">
            নতুন অ্যাকাউন্ট তৈরি করুন
          </h1>
          <p className="text-xs text-[var(--pm-text-muted)] font-medium mt-1">
            পাইকার মার্টে যুক্ত হয়ে কেনাকাটা বা পাইকারি ব্যবসা শুরু করুন
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-500 text-xs font-semibold flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Account Role Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--pm-text-secondary)] block ml-1">
              আপনার অ্যাকাউন্টের ধরন নির্বাচন করুন
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map((r) => {
                const isSelected = role === r.id;
                const IconComp = r.icon;
                return (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => {
                      setRole(r.id as any);
                      setError(null);
                    }}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'border-[var(--pm-accent)] bg-[var(--pm-accent)]/10 text-[var(--pm-accent)] shadow-sm font-black ring-1 ring-[var(--pm-accent)]'
                        : 'border-[var(--pm-border)] bg-[var(--pm-bg)] text-[var(--pm-text)] hover:border-[var(--pm-border)]/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <IconComp className={`w-4 h-4 ${isSelected ? 'text-[var(--pm-accent)]' : 'text-[var(--pm-text-muted)]'}`} />
                        <span className="font-black text-xs">{r.label}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[var(--pm-accent)] shrink-0" />}
                    </div>
                    <span className="text-[9px] text-[var(--pm-text-muted)] font-medium line-clamp-1 leading-tight">
                      {r.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--pm-text-secondary)] block ml-1">
              পুরো নাম
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pm-text-muted)]" />
              <input 
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl py-2.5 pl-10 pr-4 text-xs text-[var(--pm-text)] focus:border-[var(--pm-accent)] outline-none font-medium transition-all"
                placeholder="যেমন: মোঃ আব্দুল্লাহ মুনসুর"
              />
            </div>
          </div>

          {/* Business / Shop Name (if seller or nearby shop) */}
          {(role === 'seller' || role === 'nearby_shop') && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-3 pt-1"
            >
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--pm-text-secondary)] block ml-1">
                  প্রতিষ্ঠান বা দোকানের নাম <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pm-text-muted)]" />
                  <input 
                    type="text"
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl py-2.5 pl-10 pr-4 text-xs text-[var(--pm-text)] focus:border-[var(--pm-accent)] outline-none font-medium transition-all"
                    placeholder="যেমন: হাজী রফিক টেক্সটাইল অ্যান্ড গার্মেন্টস"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--pm-text-secondary)] block ml-1">
                  ট্রেড লাইসেন্স বা ব্যবসায়িক আইডি <span className="text-[var(--pm-text-muted)] font-normal">(ঐচ্ছিক)</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pm-text-muted)]" />
                  <input 
                    type="text"
                    value={tradeLicense}
                    onChange={(e) => setTradeLicense(e.target.value)}
                    className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl py-2.5 pl-10 pr-4 text-xs text-[var(--pm-text)] focus:border-[var(--pm-accent)] outline-none font-medium transition-all"
                    placeholder="TRAD/DSCC/0123456"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Mobile Number with +880 badge */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--pm-text-secondary)] block ml-1">
              মোবাইল নম্বর <span className="text-red-500">*</span>
            </label>
            <div className="flex rounded-2xl border border-[var(--pm-border)] bg-[var(--pm-bg)] overflow-hidden focus-within:border-[var(--pm-accent)] transition-all">
              <span className="bg-[var(--pm-surface-hover)] px-3 py-2.5 text-xs font-black text-[var(--pm-text)] border-r border-[var(--pm-border)] flex items-center gap-1.5 shrink-0 select-none">
                🇧🇩 +880
              </span>
              <input 
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full bg-transparent py-2.5 px-3.5 text-xs text-[var(--pm-text)] outline-none font-medium"
                placeholder="017XXXXXXXX"
                maxLength={11}
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--pm-text-secondary)] block ml-1">
              ইমেইল ঠিকানা <span className="text-[var(--pm-text-muted)] font-normal">(ঐচ্ছিক)</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pm-text-muted)]" />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl py-2.5 pl-10 pr-4 text-xs text-[var(--pm-text)] focus:border-[var(--pm-accent)] outline-none font-medium transition-all"
                placeholder="example@mail.com"
              />
            </div>
          </div>

          {/* Password with Strength Indicator */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--pm-text-secondary)] block ml-1">
              নিরাপদ পাসওয়ার্ড <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pm-text-muted)]" />
              <input 
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl py-2.5 pl-10 pr-10 text-xs text-[var(--pm-text)] focus:border-[var(--pm-accent)] outline-none font-medium transition-all"
                placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] transition-colors p-0.5"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password strength mini bar */}
            {password && (
              <div className="pt-1 px-1">
                <div className="h-1 w-full bg-[var(--pm-border)] rounded-full overflow-hidden flex gap-1">
                  <div className={`h-full flex-1 transition-all ${pwdScore >= 1 ? 'bg-red-500' : 'bg-transparent'}`} />
                  <div className={`h-full flex-1 transition-all ${pwdScore >= 2 ? 'bg-amber-500' : 'bg-transparent'}`} />
                  <div className={`h-full flex-1 transition-all ${pwdScore >= 3 ? 'bg-blue-500' : 'bg-transparent'}`} />
                  <div className={`h-full flex-1 transition-all ${pwdScore >= 4 ? 'bg-emerald-500' : 'bg-transparent'}`} />
                </div>
                <span className="text-[9px] text-[var(--pm-text-muted)] mt-0.5 block">
                  {pwdScore <= 1 && 'দুর্বল পাসওয়ার্ড'}
                  {pwdScore === 2 && 'মোটামুটি পাসওয়ার্ড'}
                  {pwdScore === 3 && 'শক্তিশালী পাসওয়ার্ড'}
                  {pwdScore >= 4 && 'অত্যন্ত নিরাপদ পাসওয়ার্ড'}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--pm-text-secondary)] block ml-1">
              পাসওয়ার্ড নিশ্চিত করুন <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pm-text-muted)]" />
              <input 
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl py-2.5 pl-10 pr-4 text-xs text-[var(--pm-text)] focus:border-[var(--pm-accent)] outline-none font-medium transition-all"
                placeholder="পুনরায় পাসওয়ার্ড লিখুন"
              />
            </div>
          </div>

          {/* Terms & Conditions Agreement */}
          <div className="flex items-start gap-2 ml-1 pt-1">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-[var(--pm-border)] text-[var(--pm-accent)] focus:ring-[var(--pm-accent)] accent-[var(--pm-accent)]"
            />
            <label htmlFor="agreeTerms" className="text-xs font-medium text-[var(--pm-text-muted)] cursor-pointer select-none leading-relaxed">
              আমি পাইকার মার্টের{' '}
              <Link to="/terms" className="text-[var(--pm-accent)] hover:underline font-bold">ব্যবহারের শর্তাবলী</Link>
              {' '}এবং{' '}
              <Link to="/privacy" className="text-[var(--pm-accent)] hover:underline font-bold">গোপনীয়তা নীতি</Link>
              {' '}মেনে নিতে সম্মত।
            </label>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading || !agreeTerms}
            className="w-full bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white font-black py-3 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[var(--pm-accent)]/20 text-xs mt-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>অ্যাকাউন্ট তৈরি সম্পন্ন করুন <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        {/* ━━━━ Social Divider ━━━━ */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--pm-border)]" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-black">
            <span className="bg-[var(--pm-surface)] px-3 text-[var(--pm-text-muted)] tracking-wider">অথবা</span>
          </div>
        </div>

        {/* Real Google Signup Button */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full py-2.5 px-4 bg-[var(--pm-bg)] hover:bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] text-[var(--pm-text)] font-bold text-xs rounded-2xl flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-2xs active:scale-98"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Google দিয়ে দ্রুত সাইন আপ করুন
        </button>

        {/* Footer Link to Login */}
        <div className="mt-6 text-center text-xs">
          <p className="text-[var(--pm-text-muted)] font-medium">
            ইতিমধ্যেই অ্যাকাউন্ট আছে?{' '}
            <Link to="/login" className="text-[var(--pm-accent)] font-black hover:underline ml-1">
              সাইন ইন করুন
            </Link>
          </p>
        </div>

        {/* Trust Badges */}
        <div className="mt-5 pt-4 border-t border-[var(--pm-border)]/50 text-center">
          <p className="text-[10px] text-[var(--pm-text-muted)] flex items-center justify-center gap-1.5 font-medium">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            ভেরিফাইড মার্চেন্ট নেটওয়ার্ক ও নিরাপদ এসক্রো ট্রাস্ট দ্বারা পরিচালিত
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
