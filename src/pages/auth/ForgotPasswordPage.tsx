import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/features/language/LanguageContext";
import { useAuth } from "@/context/AuthContext";
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
  const [method, setMethod] = useState<"link" | "otp">("link");
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

  const jamdaniBg = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z M30 15 L45 30 L30 45 L15 30 Z M30 25 L35 30 L30 35 L25 30 Z' fill='%23FF7A00' fill-opacity='0.035' fill-rule='evenodd'/%3E%3C/svg%3E";

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 relative bg-[#0f111a]" 
      style={{ backgroundImage: `url("${jamdaniBg}")`, backgroundAttachment: 'fixed' }}
    >
      <div className="absolute top-20 right-0 -m-20 w-80 h-80 bg-[#FF7A00]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 left-0 -m-20 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[420px] relative">
        <Link 
          to="/auth" 
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6 relative z-10 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {isBn ? "লগইন পেজে ফিরে যান" : "Back to login"}
        </Link>

        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-[#FF7A00]/20 to-[#FF7A00]/10 border border-[#FF7A00]/30 mb-4 shadow-[0_0_24px_rgba(255,122,0,0.15)]">
            <KeyRound className="h-8 w-8 text-[#FF7A00]" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            {isBn ? "পাসওয়ার্ড উদ্ধার" : "Reset Password"}
          </h1>
          <p className="text-sm text-gray-400 mt-2 leading-relaxed font-medium">
            {isBn ? "আপনার ইমেইল দিয়ে পাসওয়ার্ড রিসেট লিংক গ্রহণ করুন।" : "Enter your email to receive a password reset link."}
          </p>
        </div>

        <div className="rounded-3xl border border-white/5 bg-[#141624] p-8 text-center space-y-8 shadow-2xl relative z-10">
          {sent ? (
            <div className="text-center space-y-6">
              <div className="p-6 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/20 text-[#FF7A00] text-sm font-medium">
                {isBn ? "আপনার ইনবক্স চেক করুন! আমরা একটি রিসেট লিংক পাঠিয়েছি।" : "Check your inbox! We've sent you a password reset link."}
              </div>
              <button
                onClick={() => setSent(false)}
                className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-bold transition-all border border-white/5"
              >
                {isBn ? "আবার চেষ্টা করুন" : "Try again with another email"}
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-6 text-left" noValidate>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 ml-1">
                  {isBn ? "ইমেল ঠিকানা" : "Email Address"}
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailErr(null); }}
                    onBlur={() => setEmailErr(validateEmail(email))}
                    placeholder="example@mail.com"
                    className={cn(
                      "w-full pl-12 pr-4 py-4 bg-[#0f111a] border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00] transition-all text-white placeholder:text-gray-600",
                      emailErr && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                    )}
                  />
                </div>
                {emailErr && (
                  <p className="flex items-center gap-1.5 text-xs text-rose-500 mt-1.5 font-medium ml-1">
                    <AlertCircle className="h-4 w-4 shrink-0" />{emailErr}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full flex items-center justify-center gap-2 bg-[#FF7A00] hover:bg-[#e06b00] text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-[#FF7A00]/10 group disabled:opacity-50"
              >
                {busy ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {isBn ? "রিসেট লিঙ্ক পাঠান" : "Send Reset Link"}
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
