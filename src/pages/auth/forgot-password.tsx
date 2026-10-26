import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/features/language/LanguageContext";
import { useAuth } from "@/features/auth/AuthContext";
import { toast } from "sonner";
import { Mail, Loader2, ArrowRight, ShieldCheck, AlertCircle, ArrowLeft, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmailOtpLoginForm } from "@/features/auth/components/EmailOtpLoginForm";

function validateEmail(email: string): string | null {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "ইমেল ঠিকানা দিন";
  if (!re.test(email)) return "সঠিক ইমেল ঠিকানা দিন";
  return null;
}

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { isBn } = useLanguage();
  const { sendPasswordReset } = useAuth();
  const [method, setMethod] = useState<"link" | "otp">("otp");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ee = validateEmail(email);
    setEmailErr(ee);
    if (ee) return;

    setBusy(true);
    try {
      await sendPasswordReset(email.trim());
      setSent(true);
      toast.success(isBn ? "পাসওয়ার্ড রিসেট ইমেল পাঠানো হয়েছে!" : "Password reset email sent!");
    } catch (err: any) {
      console.error(err);
      toast.error(isBn ? "অনুরোধ ব্যর্থ হয়েছে। সঠিক ইমেল দিয়েছেন কি না নিশ্চিত করুন।" : "Request failed. Please ensure the email is correct.");
    } finally {
      setBusy(false);
    }
  };

  const jamdaniBg = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z M30 15 L45 30 L30 45 L15 30 Z M30 25 L35 30 L30 35 L25 30 Z' fill='%2300a859' fill-opacity='0.035' fill-rule='evenodd'/%3E%3C/svg%3E";

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 relative bg-zinc-50 dark:bg-[#010804]" 
      style={{ backgroundImage: `url("${jamdaniBg}")`, backgroundAttachment: 'fixed' }}
    >
      <div className="absolute top-20 right-0 -m-20 w-80 h-80 bg-[#00a859]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 left-0 -m-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[420px] relative">
        <Link 
          to="/auth/login" 
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors mb-6 relative z-10 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {isBn ? "লগইন পেজে ফিরে যান" : "Back to login"}
        </Link>

        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-[1.5rem] bg-gradient-to-br from-[#00a859]/20 to-cyan-600/20 border border-[#00a859]/30 mb-4 shadow-[0_0_24px_rgba(0,168,89,0.15)] animate-bounce-slow">
            <ShieldCheck className="h-8 w-8 text-[#00a859]" />
          </div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            {isBn ? "পাসওয়ার্ড উদ্ধার" : "Reset Password"}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed font-medium">
            {isBn ? "ইমেইল ওটিপি অথবা পাসওয়ার্ড রিসেট লিংকের মাধ্যমে একাউন্ট রিকভার করুন।" : "Recover your account via Email OTP code or direct reset link."}
          </p>
        </div>

        <div className="rounded-[2rem] border border-gray-200/50 dark:border-white/10 bg-white/80 dark:bg-black/40 backdrop-blur-xl shadow-[0_12px_45px_rgba(0,168,89,0.06)] p-6 relative z-10 animate-fade-in space-y-5">
          {/* Method Switcher */}
          <div className="grid grid-cols-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl gap-1 border border-gray-200/50 dark:border-white/10">
            <button
              type="button"
              onClick={() => setMethod("otp")}
              className={cn(
                "flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                method === "otp"
                  ? "bg-white dark:bg-zinc-800 text-[#00a859] shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              )}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{isBn ? "ইমেইল OTP" : "Email OTP"}</span>
            </button>
            <button
              type="button"
              onClick={() => setMethod("link")}
              className={cn(
                "flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                method === "link"
                  ? "bg-white dark:bg-zinc-800 text-[#00a859] shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              )}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{isBn ? "রিসেট লিংক" : "Reset Link"}</span>
            </button>
          </div>

          {method === "otp" ? (
            <EmailOtpLoginForm purpose="reset_password" />
          ) : (
            sent ? (
              <div className="text-center space-y-6">
                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-sm font-medium">
                  {isBn ? "আপনার ইনবক্স চেক করুন!" : "Check your inbox!"}
                </div>
                <Button
                  onClick={() => setSent(false)}
                  variant="outline"
                  className="w-full h-12 rounded-xl border-gray-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5 font-bold text-zinc-700 dark:text-zinc-200 transition-all cursor-pointer"
                >
                  {isBn ? "আবার চেষ্টা করুন" : "Try again with another email"}
                </Button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5" noValidate>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                    {isBn ? "ইমেল ঠিকানা" : "Email Address"}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 pointer-events-none" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setEmailErr(null); }}
                      onBlur={() => setEmailErr(validateEmail(email))}
                      placeholder="example@mail.com"
                      className={cn(
                        "pl-11 h-13 rounded-xl bg-white/90 dark:bg-zinc-950/40 border-gray-200 dark:border-white/10 focus:border-[#00a859] focus:ring-2 focus:ring-[#00a859]/20 transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400 text-base shadow-sm", 
                        emailErr && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                      )}
                    />
                  </div>
                  {emailErr && (
                    <p className="flex items-center gap-1.5 text-xs text-rose-500 mt-1.5 font-medium animate-fade-in">
                      <AlertCircle className="h-4 w-4 shrink-0" />{emailErr}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={busy}
                  className="w-full h-13 rounded-xl text-base font-bold bg-gradient-to-r from-[#00a859] to-cyan-600 hover:opacity-95 border-0 shadow-[0_6px_20px_rgba(0,168,89,0.25)] hover:shadow-[0_8px_24px_rgba(0,168,89,0.35)] transition-all duration-300 mt-4 text-white cursor-pointer active:scale-[0.99]"
                >
                  {busy
                    ? <><Loader2 className="h-5 w-5 animate-spin mr-2" />{isBn ? "অনুগ্রহ করে অপেক্ষা করুন..." : "Please wait..."}</>
                    : <>{isBn ? "রিসেট লিঙ্ক পাঠান" : "Send Reset Link"} <ArrowRight className="h-5 w-5 ml-2" /></>
                  }
                </Button>
              </form>
            )
          )}
        </div>
      </div>
    </div>
  );
}
