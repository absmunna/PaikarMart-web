import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  UserPlus, Mail, Lock, User, ArrowRight, Loader2, 
  ArrowLeft, ShieldCheck, Shield
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
    if (password.length < 6) { setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে'); return; }
    if (password !== confirmPassword) { setError('পাসওয়ার্ড মেলেনি'); return; }
    if (!agreeTerms) { setError('শর্তাবলী মেনে নেওয়া বাধ্যতামূলক'); return; }
    
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
        toast.success('অ্যাকাউন্ট তৈরি হয়েছে! ইমেইল চেক করুন।');
        navigate('/verify-email');
      } else {
        // 2. Phone Flow: Send OTP via backend
        const method = `${countryCode}${phone}`;
        await sendVerification(method.trim());
        setStep('verify');
        toast.success('কোড পাঠানো হয়েছে!');
      }
    } catch (err: any) {
      setError(err?.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে');
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

      toast.success('অ্যাকাউন্ট তৈরি হয়েছে!');
      navigate('/');
    } catch (err: any) {
      setError(err?.message || 'ভেরিফিকেশন ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-3 bg-gradient-to-b from-[var(--pm-bg)] via-[var(--pm-surface)] to-[var(--pm-bg)] selection:bg-[var(--pm-accent)] selection:text-white">
      <div className="w-full max-w-sm mb-2.5 flex items-center justify-between">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[var(--pm-text-muted)] hover:text-[var(--pm-accent)] transition-colors py-1 px-2.5 rounded-full bg-[var(--pm-surface)] border border-[var(--pm-border)] shadow-xs">
          <ArrowLeft className="w-3 h-3" />
          লগইনে ফিরুন
        </Link>
        <span className="text-[10px] font-bold text-[var(--pm-text-muted)] flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          নিরাপদ রেজিস্ট্রেশন
        </span>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm bg-[var(--pm-surface)] p-5 sm:p-6 rounded-2xl border border-[var(--pm-border)] shadow-xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-[var(--pm-accent)]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center mb-4 relative z-10">
          <div className="w-11 h-11 bg-gradient-to-tr from-[var(--pm-accent)] to-amber-500 text-white rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md shadow-[var(--pm-accent)]/20">
            <UserPlus className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-black text-[var(--pm-text)] tracking-tight">
            {step === 'register' ? 'নতুন অ্যাকাউন্ট' : 'ভেরিফিকেশন'}
          </h1>
        </div>
        
        {error && <div className="mb-3 p-2.5 bg-red-500/10 border border-red-500/25 rounded-xl text-red-500 text-[11px] font-semibold">{error}</div>}

        {step === 'register' ? (
          <form onSubmit={handleRegister} className="space-y-3 relative z-10">
            <input type="text" placeholder="পুরো নাম" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl py-2 pl-3 pr-3 text-[11px] text-[var(--pm-text)] outline-none font-medium transition-all" />
            <div className="flex gap-4 pb-2">
              <label className="flex items-center gap-2 text-[11px] font-bold text-zinc-300 cursor-pointer">
                <input type="radio" checked={verificationMethod === 'email'} onChange={() => setVerificationMethod('email')} className="accent-[var(--pm-accent)]" />
                ইমেইল দিয়ে ভেরিফাই
              </label>
              <label className="flex items-center gap-2 text-[11px] font-bold text-zinc-300 cursor-pointer">
                <input type="radio" checked={verificationMethod === 'phone'} onChange={() => setVerificationMethod('phone')} className="accent-[var(--pm-accent)]" />
                ফোন দিয়ে ভেরিফাই
              </label>
            </div>

            <div className="space-y-1">
              <input type="email" placeholder="ইমেইল" value={email} disabled={verificationMethod !== 'email'} onChange={(e) => {
                const val = e.target.value;
                setEmail(val);
                if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                  setIdentifierError('বৈধ ইমেইল দিন');
                } else {
                  setIdentifierError(null);
                }
              }} className={cn("w-full bg-[var(--pm-bg)] border rounded-xl py-2 pl-3 pr-3 text-[11px] text-[var(--pm-text)] outline-none font-medium transition-all", identifierError && email ? "border-red-500" : "border-[var(--pm-border)]")} />
            </div>
            
            <div className="space-y-1">
              <div className="flex gap-2">
                <select value={countryCode} disabled={verificationMethod !== 'phone'} onChange={(e) => setCountryCode(e.target.value)} className="bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl py-2 px-2 text-[11px] text-[var(--pm-text)] outline-none">
                  <option value="+880">+880 (BD)</option>
                  <option value="+91">+91 (IN)</option>
                </select>
                <input type="tel" placeholder="মোবাইল নম্বর" value={phone} disabled={verificationMethod !== 'phone'} onChange={(e) => {
                  const val = e.target.value;
                  setPhone(val);
                  if (val && !/^\d{10}$/.test(val)) {
                    setIdentifierError('বৈধ ১০ ডিজিটের নম্বর দিন');
                  } else {
                    setIdentifierError(null);
                  }
                }} className={cn("w-full bg-[var(--pm-bg)] border rounded-xl py-2 pl-3 pr-3 text-[11px] text-[var(--pm-text)] outline-none font-medium transition-all", identifierError && phone ? "border-red-500" : "border-[var(--pm-border)]")} />
              </div>
              {identifierError && <p className="text-[9px] text-red-500 pl-1">{identifierError}</p>}
            </div>
            
            <div className="space-y-1">
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="পাসওয়ার্ড" value={password} onChange={(e) => {
                  const val = e.target.value;
                  setPassword(val);
                  
                  // Strength calculation
                  let strength = 0;
                  if (val.length >= 6) strength++;
                  if (/[A-Z]/.test(val)) strength++;
                  if (/[0-9!@#$%^&*]/.test(val)) strength++;
                  setPasswordStrength(strength as any);

                  if (val && val.length < 6) {
                    setPasswordError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
                  } else {
                    setPasswordError(null);
                  }
                }} required className={cn("w-full bg-[var(--pm-bg)] border rounded-xl py-2 pl-3 pr-9 text-[11px] text-[var(--pm-text)] outline-none font-medium transition-all", passwordError ? "border-red-500 focus:border-red-600" : "border-[var(--pm-border)] focus:border-[var(--pm-accent)]")} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-[var(--pm-text-muted)] hover:text-[var(--pm-accent)]">
                  {showPassword ? <Mail className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                </button>
              </div>
              
              {password && (
                <div className="flex gap-1 pt-1">
                  {[1, 2, 3].map((level) => (
                    <div
                      key={level}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-all duration-300",
                        passwordStrength >= level
                          ? (passwordStrength === 1 ? "bg-red-500" : passwordStrength === 2 ? "bg-amber-500" : "bg-emerald-500")
                          : "bg-white/10"
                      )}
                    />
                  ))}
                </div>
              )}
              {passwordError && <p className="text-[9px] text-red-500 pl-1">{passwordError}</p>}
            </div>
            
            <div className="space-y-1">
              <input type={showPassword ? "text" : "password"} placeholder="পাসওয়ার্ড নিশ্চিত করুন" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className={cn("w-full bg-[var(--pm-bg)] border rounded-xl py-2 pl-3 pr-3 text-[11px] text-[var(--pm-text)] outline-none font-medium transition-all", confirmPassword && password !== confirmPassword ? "border-red-500" : "border-[var(--pm-border)]")} />
              {confirmPassword && password !== confirmPassword && <p className="text-[9px] text-red-500 pl-1">পাসওয়ার্ড মেলেনি</p>}
            </div>
            
            <div className="flex items-center gap-1.5 pt-0.5">
              <input type="checkbox" id="agreeTerms" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="w-3.5 h-3.5 rounded border-[var(--pm-border)] text-[var(--pm-accent)] focus:ring-[var(--pm-accent)] accent-[var(--pm-accent)]" />
              <label htmlFor="agreeTerms" className="text-[11px] font-medium text-[var(--pm-text-muted)] cursor-pointer select-none">শর্তাবলী মেনে নিচ্ছি</label>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[var(--pm-accent)] hover:opacity-95 text-white font-black py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[var(--pm-accent)]/20 text-[11px] mt-1 disabled:opacity-50">
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <>পরবর্তী ধাপ <ArrowRight className="w-3.5 h-3.5" /></>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-3 relative z-10">
            <OtpInput value={otp} onChange={setOtp} />
            
            <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:opacity-95 text-white font-black py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20 text-[11px] disabled:opacity-50">
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <>অ্যাকাউন্ট তৈরি করুন <ArrowRight className="w-3.5 h-3.5" /></>}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Register;
