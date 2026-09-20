import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/features/auth/AuthContext";
import { useLanguage } from "@/features/language/LanguageContext";
import { SocialLogin } from "@/features/auth/components/SocialLogin";
import { toast } from "sonner";
import {
  User, Phone, Mail, Lock, Eye, EyeOff, Loader2,
  ArrowRight, CheckCircle2, UserPlus, AlertCircle, ArrowLeft, Store
} from "lucide-react";
import { cn } from "@/lib/utils";

const BENEFITS = [
  { en: "Track orders in real time",      bn: "রিয়েল টাইমে অর্ডার ট্র্যাক করুন" },
  { en: "Earn PK Coin on every purchase", bn: "প্রতিটি কেনাকাটায় PK কয়েন জিতুন" },
  { en: "Post demands & get quotes",      bn: "ডিমান্ড পোস্ট করুন ও কোটেশন পান" },
  { en: "Access wholesale prices",        bn: "পাইকারি দামে পণ্য কিনুন" },
];

const BD_PHONE_RE = /^01[3-9]\d{8}$/;
const PW_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

function validatePhone(v: string) {
  if (!v) return "মোবাইল নম্বর দিন";
  if (!BD_PHONE_RE.test(v.replace(/\s|-/g, ""))) return "সঠিক ১১ সংখ্যার বাংলাদেশি নম্বর দিন (01XXXXXXXXX)";
  return null;
}

function validatePassword(v: string) {
  if (v.length < 8) return "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে";
  if (!PW_RE.test(v)) return "পাসওয়ার্ডে অক্ষর ও সংখ্যা উভয়ই থাকতে হবে";
  return null;
}

function strengthLevel(v: string): number {
  let s = 0;
  if (v.length >= 8) s++;
  if (/[A-Z]/.test(v)) s++;
  if (/\d/.test(v)) s++;
  if (/[^A-Za-z\d]/.test(v)) s++;
  return s;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const { isBn } = useLanguage();

  const searchParams = new URLSearchParams(location.search);
  let rawFrom = searchParams.get('from') || '/';
  if (rawFrom.startsWith('/auth')) rawFrom = '/';
  const from = rawFrom;

  // Redirect if already authenticated
  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [auth.isAuthenticated, navigate, from]);

  const [form, setForm] = useState({ fullName: "", phone: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [busy, setBusy] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  const validate = () => {
    const e: Record<string, string | null> = {
      phone: validatePhone(form.phone),
      password: validatePassword(form.password),
      fullName: form.fullName.trim().length < 2 ? "পুরো নাম দিন" : null,
    };
    setErrors(e);
    return !Object.values(e).some(Boolean);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!termsChecked) {
      toast.error(isBn ? "শর্তাবলী ও গোপনীয়তা নীতিতে সম্মত হতে হবে" : "Please accept the Terms & Privacy Policy");
      return;
    }
    setBusy(true);
    try {
      await auth.registerUser(form);
      toast.success(isBn ? "অ্যাকাউন্ট তৈরি হয়েছে!" : "Account created successfully!");
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(isBn ? "রেজিস্ট্রেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।" : "Registration failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const strength = strengthLevel(form.password);
  const strengthColor = ["bg-gray-200 dark:bg-white/10", "bg-rose-500", "bg-amber-500", "bg-[#00a859]/80", "bg-[#00a859]"];

  const jamdaniBg = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z M30 15 L45 30 L30 45 L15 30 Z M30 25 L35 30 L30 35 L25 30 Z' fill='%2300a859' fill-opacity='0.035' fill-rule='evenodd'/%3E%3C/svg%3E";

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 relative bg-zinc-50 dark:bg-[#010804]" 
      style={{ backgroundImage: `url("${jamdaniBg}")`, backgroundAttachment: 'fixed' }}
    >
      <div className="absolute top-20 right-0 -m-20 w-80 h-80 bg-[#00a859]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 left-0 -m-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[440px] relative">
        <Link 
          to="/auth/login" 
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors mb-6 relative z-10 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {isBn ? "ফিরে যান" : "Go back"}
        </Link>

        <div className="text-center mb-6 relative z-10">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-[1.5rem] bg-gradient-to-br from-[#00a859]/20 to-blue-600/20 border border-[#00a859]/30 mb-4 shadow-[0_0_24px_rgba(0,168,89,0.15)] animate-bounce-slow">
            <UserPlus className="h-8 w-8 text-[#00a859]" />
          </div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            {isBn ? "নতুন অ্যাকাউন্ট খুলুন" : "Create your account"}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
            {isBn ? "PaikarMart-এ যোগ দিন বিনামূল্যে" : "Join PaikarMart for free"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-6 relative z-10">
          {BENEFITS.map((b, i) => (
            <div key={i} className="flex items-start gap-2.5 p-3 rounded-[1.25rem] bg-white/80 dark:bg-zinc-950/40 border border-gray-250/20 dark:border-white/5 backdrop-blur-md shadow-sm">
              <CheckCircle2 className="h-4.5 w-4.5 text-[#00a859] shrink-0 mt-0.5" />
              <span className="text-xs text-zinc-700 dark:text-zinc-300 leading-tight font-medium">{isBn ? b.bn : b.en}</span>
            </div>
          ))}
        </div>

        <div className="rounded-[2rem] border border-gray-200/50 dark:border-white/10 bg-white/80 dark:bg-black/40 backdrop-blur-xl shadow-[0_12px_45px_rgba(0,168,89,0.06)] p-6 relative z-10">
          <form onSubmit={submit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                {isBn ? "পুরো নাম" : "Full Name"}
              </Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 pointer-events-none" />
                <Input
                  value={form.fullName}
                  onChange={set("fullName")}
                  placeholder={isBn ? "আপনার পুরো নাম" : "Your full name"}
                  className={cn(
                    "pl-11 h-13 rounded-xl bg-white/90 dark:bg-zinc-950/40 border-gray-200 dark:border-white/10 focus:border-[#00a859] focus:ring-2 focus:ring-[#00a859]/20 transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 text-base shadow-sm", 
                    errors.fullName && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                  )}
                />
              </div>
              {errors.fullName && <p className="flex items-center gap-1.5 text-xs text-rose-500 mt-1.5 font-medium animate-fade-in"><AlertCircle className="h-4 w-4 shrink-0" />{errors.fullName}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                {isBn ? "মোবাইল নম্বর" : "Phone Number"}
              </Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 pointer-events-none" />
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={set("phone")}
                  maxLength={11}
                  placeholder={isBn ? "০১XXXXXXXXX" : "01XXXXXXXXX"}
                  className={cn(
                    "pl-11 h-13 rounded-xl bg-white/90 dark:bg-zinc-950/40 border-gray-200 dark:border-white/10 focus:border-[#00a859] focus:ring-2 focus:ring-[#00a859]/20 transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 text-base shadow-sm", 
                    errors.phone && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                  )}
                />
              </div>
              {errors.phone && <p className="flex items-center gap-1.5 text-xs text-rose-500 mt-1.5 font-medium animate-fade-in"><AlertCircle className="h-4 w-4 shrink-0" />{errors.phone}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                {isBn ? "ইমেইল (ঐচ্ছিক)" : "Email (optional)"}
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 pointer-events-none" />
                <Input
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder={isBn ? "আপনার ইমেইল" : "your@email.com"}
                  className="pl-11 h-13 rounded-xl bg-white/90 dark:bg-zinc-950/40 border-gray-200 dark:border-white/10 focus:border-[#00a859] focus:ring-2 focus:ring-[#00a859]/20 transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 text-base shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                {isBn ? "পাসওয়ার্ড" : "Password"}
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 pointer-events-none" />
                <Input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  placeholder={isBn ? "কমপক্ষে ৮ অক্ষর, অক্ষর+সংখ্যা" : "Min 8 chars, letters + numbers"}
                  className={cn(
                    "pl-11 pr-11 h-13 rounded-xl bg-white/90 dark:bg-zinc-950/40 border-gray-200 dark:border-white/10 focus:border-[#00a859] focus:ring-2 focus:ring-[#00a859]/20 transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 text-base shadow-sm", 
                    errors.password && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                  )}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPass((v) => !v)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-650 dark:hover:text-white transition-colors cursor-pointer"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {form.password.length > 0 && (
                <div className="flex gap-1.5 mt-2">
                  {[1,2,3,4].map((n) => (
                    <div key={n} className={cn("h-1.5 flex-1 rounded-full transition-colors", strength >= n ? strengthColor[strength] : "bg-gray-200 dark:bg-white/10")} />
                  ))}
                </div>
              )}
              {errors.password && <p className="flex items-center gap-1.5 text-xs text-rose-500 mt-1.5 font-medium animate-fade-in"><AlertCircle className="h-4 w-4 shrink-0" />{errors.password}</p>}
            </div>

            <div className="flex items-start gap-3 pt-2.5 pb-1">
              <Checkbox
                id="terms"
                checked={termsChecked}
                onCheckedChange={(v) => setTermsChecked(!!v)}
                className="mt-0.5 border-gray-300 dark:border-white/20 data-[state=checked]:bg-[#00a859] data-[state=checked]:border-[#00a859] cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed cursor-pointer select-none">
                {isBn
                  ? <>আমি PaikarMart-এর <Link to="/terms" className="text-[#00a859] hover:underline font-bold">শর্তাবলী</Link>, <Link to="/refund-policy" className="text-[#00a859] hover:underline font-bold">রিফান্ড নীতি</Link> ও <Link to="/privacy" className="text-[#00a859] hover:underline font-bold">গোপনীয়তা নীতি</Link> পড়েছি এবং সম্মত আছি।</>
                  : <>I have read and agree to PaikarMart's <Link to="/terms" className="text-[#00a859] hover:underline font-bold">Terms of Service</Link>, <Link to="/refund-policy" className="text-[#00a859] hover:underline font-bold">Refund Policy</Link> & <Link to="/privacy" className="text-[#00a859] hover:underline font-bold">Privacy Policy</Link>.</>
                }
              </label>
            </div>

            <Button
              type="submit"
              disabled={busy}
              className="w-full h-13 rounded-xl text-base font-bold bg-gradient-to-r from-[#00a859] to-cyan-600 hover:opacity-95 border-0 shadow-[0_6px_20px_rgba(0,168,89,0.25)] hover:shadow-[0_8px_24px_rgba(0,168,89,0.35)] transition-all duration-300 mt-4 text-white cursor-pointer active:scale-[0.99]"
            >
              {busy
                ? <><Loader2 className="h-5 w-5 animate-spin mr-2" />{isBn ? "তৈরি হচ্ছে…" : "Creating…"}</>
                : <>{isBn ? "অ্যাকাউন্ট তৈরি করুন" : "Create Account"} <ArrowRight className="h-5 w-5 ml-2" /></>
              }
            </Button>

            <div className="pt-2">
              <SocialLogin />
            </div>
          </form>
        </div>

        {/* Vendor & Merchant Registration Link */}
        <div className="mt-4 relative z-10">
          <Link 
            to="/auth/wizard" 
            className="flex items-center justify-between p-4 rounded-[1.25rem] bg-emerald-50/80 dark:bg-emerald-950/20 hover:bg-emerald-100/80 dark:hover:bg-emerald-950/30 border border-emerald-500/20 dark:border-emerald-500/20 backdrop-blur-md transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                <Store className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {isBn ? "মার্চেন্ট বা বিক্রেতা হিসেবে যোগ দিন" : "Register as Vendor / Merchant"}
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  {isBn ? "হোলসেলার, ফ্যাক্টরি মালিক, বা খুচরা বিক্রেতা" : "Wholesale, Factory, Retailer, Rider & Services"}
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="mt-6 text-center space-y-3 relative z-10 animate-fade-in">
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            {isBn ? "আগেই অ্যাকাউন্ট আছে? " : "Already have an account? "}
            <Link to="/auth/login" className="text-[#00a859] hover:text-[#00a859]/80 transition-colors font-bold hover:underline">
              {isBn ? "লগইন করুন" : "Sign in"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
