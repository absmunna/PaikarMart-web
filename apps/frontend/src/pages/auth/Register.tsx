import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Mail, Lock, ArrowRight, Loader2,
  ArrowLeft, ShieldCheck, Shield, Smartphone, Eye, EyeOff
} from 'lucide-react';
import { useAuth } from '@/modules/auth';
import { OtpInput } from "@/components/ui/OtpInput";
import { toast } from 'sonner';
import { cn } from "@/lib/utils";

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+880');
  const [verificationMethod, setVerificationMethod] = useState<'email' | 'phone'>('email');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validation state
  const [identifierError, setIdentifierError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<0 | 1 | 2 | 3>(0);

  // Verification step state
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [otp, setOtp] = useState('');

  const navigate = useNavigate();
  const { registerUser, sendVerification, verifyVerification } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) { setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে'); return; }
    if (password !== confirmPassword) { setError('পাসওয়ার্ড মেলেনি'); return; }
    if (!agreeTerms) { setError('শর্তাবলী মেনে নেওয়া বাধ্যতামূলক'); return; }

    setLoading(true);
    try {
      if (verificationMethod === 'email') {
        // 1. Email Flow: Register immediately and trigger Firebase verification
        await registerUser({
          fullName: name.trim(),
          name: name.trim(),
          email: email.trim(),
          password,
        });
        toast.success('অ্যাকাউন্ট তৈরি হয়েছে! ইমেইল চেক করুন।');
        navigate('/verify-email');
      } else {
        // 2. Phone Flow: Send OTP via backend
        const method = `${countryCode}${phone}`;
        await sendVerification(method.trim());
        setStep('verify');
        toast.success('কোড পাঠানো হয়েছে!');
      }
    } catch (err: any) {
      setError(err?.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Phone Flow: Verify OTP and then register
      const method = `${countryCode}${phone}`;
      await verifyVerification(method.trim(), otp);

      await registerUser({
        fullName: name.trim(),
        name: name.trim(),
        phone: `${countryCode}${phone.trim()}`,
        password,
      });

      toast.success('অ্যাকাউন্ট তৈরি হয়েছে!');
      navigate('/');
    } catch (err: any) {
      setError(err?.message || 'ভেরিফিকেশন ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-[var(--pm-card)] border border-[var(--pm-border)] rounded-2xl py-3 pl-11 pr-4 text-sm text-[var(--pm-text)] placeholder:text-[var(--pm-text-muted)] focus:border-[var(--pm-accent)] focus:ring-2 focus:ring-[var(--pm-accent)]/20 outline-none font-medium transition-all disabled:opacity-40";

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-[var(--pm-bg)] selection:bg-[var(--pm-accent)] selection:text-white relative overflow-hidden">
      {/* ambient accent glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[420px] h-[240px] bg-[var(--pm-accent)]/10 blur-[100px] rounded-full" />

      {/* Top bar */}
      <div className="w-full max-w-[400px] mb-3 flex items-center justify-between relative z-10">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--pm-text-muted)] hover:text-[var(--pm-accent)] transition-colors py-1.5 px-3 rounded-full bg-[var(--pm-card)] border border-[var(--pm-border)]">
          <ArrowLeft className="w-3.5 h-3.5" />
          লগইনে ফিরুন
        </Link>
        <span className="text-[11px] font-bold text-[var(--pm-text-muted)] flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--pm-success)]" />
          নিরাপদ রেজিস্ট্রেশন
        </span>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="w-full max-w-[400px] bg-[var(--pm-surface)] p-6 sm:p-7 rounded-3xl border border-[var(--pm-border)] shadow-2xl relative z-10">
        {/* Brand */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-[var(--pm-accent)] text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[var(--pm-accent)]/25 text-2xl font-black">
            P
          </div>
          <h1 className="text-2xl font-black text-[var(--pm-text)] tracking-tight">
            {step === 'register' ? 'অ্যাকাউন্ট খুলুন' : 'কোড নিশ্চিত করুন'}
          </h1>
          <p className="text-sm text-[var(--pm-text-muted)] font-medium mt-1">
            {step === 'register'
              ? 'এক অ্যাকাউন্টেই কেনা-বেচা, পোস্ট ও ডিমান্ড'
              : `${countryCode} ${phone} নম্বরে পাঠানো কোড দিন`}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-[var(--pm-danger)]/10 border border-[var(--pm-danger)]/25 rounded-2xl text-[var(--pm-danger)] text-xs font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--pm-danger)] shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 'register' ? (
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full name */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pm-text-muted)]" />
              <input type="text" placeholder="পুরো নাম" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
            </div>

            {/* Verify method: segmented tabs */}
            <div className="flex bg-[var(--pm-card)] border border-[var(--pm-border)] rounded-2xl p-1">
              <button
                type="button"
                onClick={() => setVerificationMethod('email')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer',
                  verificationMethod === 'email'
                    ? 'bg-[var(--pm-accent)] text-white shadow-md shadow-[var(--pm-accent)]/25'
                    : 'text-[var(--pm-text-muted)] hover:text-[var(--pm-text)]'
                )}
              >
                <Mail className="w-3.5 h-3.5" />
                ইমেইল দিয়ে
              </button>
              <button
                type="button"
                onClick={() => setVerificationMethod('phone')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer',
                  verificationMethod === 'phone'
                    ? 'bg-[var(--pm-accent)] text-white shadow-md shadow-[var(--pm-accent)]/25'
                    : 'text-[var(--pm-text-muted)] hover:text-[var(--pm-text)]'
                )}
              >
                <Smartphone className="w-3.5 h-3.5" />
                ফোন দিয়ে
              </button>
            </div>

            {/* Conditional identifier field */}
            {verificationMethod === 'email' ? (
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pm-text-muted)]" />
                <input
                  type="email"
                  placeholder="ইমেইল"
                  value={email}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEmail(val);
                    if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                      setIdentifierError('বৈধ ইমেইল দিন');
                    } else {
                      setIdentifierError(null);
                    }
                  }}
                  required
                  className={cn(inputClass, identifierError && email && "border-[var(--pm-danger)]")}
                />
                {identifierError && <p className="text-[11px] text-[var(--pm-danger)] pl-1 mt-1">{identifierError}</p>}
              </div>
            ) : (
              <div>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="bg-[var(--pm-card)] border border-[var(--pm-border)] rounded-2xl py-3 px-3 text-sm text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)] transition-all"
                  >
                    <option value="+880">+880</option>
                    <option value="+91">+91</option>
                  </select>
                  <input
                    type="tel"
                    placeholder="মোবাইল নম্বর"
                    value={phone}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPhone(val);
                      if (val && !/^\d{10}$/.test(val)) {
                        setIdentifierError('বৈধ ১০ ডিজিটের নম্বর দিন');
                      } else {
                        setIdentifierError(null);
                      }
                    }}
                    required
                    className={cn(inputClass, "flex-1 pl-4", identifierError && phone && "border-[var(--pm-danger)]")}
                  />
                </div>
                {identifierError && <p className="text-[11px] text-[var(--pm-danger)] pl-1 mt-1">{identifierError}</p>}
              </div>
            )}

            {/* Password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pm-text-muted)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="পাসওয়ার্ড"
                  value={password}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPassword(val);

                    // Strength calculation
                    let strength = 0;
                    if (val.length >= 6) strength++;
                    if (/[A-Z]/.test(val)) strength++;
                    if (/[0-9!@#$%^&*]/.test(val)) strength++;
                    setPasswordStrength(strength as any);

                    if (val && val.length < 6) {
                      setPasswordError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
                    } else {
                      setPasswordError(null);
                    }
                  }}
                  required
                  className={cn(
                    inputClass,
                    "pr-11",
                    passwordError ? "border-[var(--pm-danger)]" : password ? "border-[var(--pm-border)]" : ""
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] transition-colors p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {password && (
                <div className="flex gap-1.5 pt-2 px-1">
                  {[1, 2, 3].map((level) => (
                    <div
                      key={level}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-all duration-300",
                        passwordStrength >= level
                          ? (passwordStrength === 1 ? "bg-[var(--pm-danger)]" : passwordStrength === 2 ? "bg-amber-500" : "bg-[var(--pm-success)]")
                          : "bg-[var(--pm-border)]"
                      )}
                    />
                  ))}
                </div>
              )}
              {passwordError && <p className="text-[11px] text-[var(--pm-danger)] pl-1 mt-1">{passwordError}</p>}
            </div>

            {/* Confirm password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pm-text-muted)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="পাসওয়ার্ড নিশ্চিত করুন"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={cn(inputClass, confirmPassword && password !== confirmPassword && "border-[var(--pm-danger)]")}
                />
              </div>
              {confirmPassword && password !== confirmPassword && <p className="text-[11px] text-[var(--pm-danger)] pl-1 mt-1">পাসওয়ার্ড মেলেনি</p>}
            </div>

            {/* Terms */}
            <div className="flex items-center gap-2 ml-1 pt-0.5">
              <input
                type="checkbox"
                id="agreeTerms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded accent-[var(--pm-accent)] cursor-pointer"
              />
              <label htmlFor="agreeTerms" className="text-xs font-medium text-[var(--pm-text-muted)] cursor-pointer select-none">
                শর্তাবলী মেনে নিচ্ছি
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white font-black py-3.5 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[var(--pm-accent)]/25 text-sm active:scale-[0.98] disabled:opacity-50 mt-1"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>পরবর্তী ধাপ <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-5">
            <OtpInput value={otp} onChange={setOtp} />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white font-black py-3.5 px-4 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[var(--pm-accent)]/25 text-sm active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>অ্যাকাউন্ট তৈরি করুন <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        )}

        {/* Login link */}
        <div className="mt-6 text-center text-sm">
          <p className="text-[var(--pm-text-muted)] font-medium">
            আগে থেকেই অ্যাকাউন্ট আছে?{' '}
            <Link to="/login" className="text-[var(--pm-accent)] font-black hover:underline ml-1">
              লগইন করুন
            </Link>
          </p>
        </div>

        {/* Trust note */}
        <div className="mt-5 pt-4 border-t border-[var(--pm-border)]/60 text-center">
          <p className="text-[11px] text-[var(--pm-text-muted)] flex items-center justify-center gap-1.5 font-medium">
            <Shield className="w-3.5 h-3.5 text-[var(--pm-success)]" />
            আপনার তথ্য সুরক্ষিত থাকে
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
