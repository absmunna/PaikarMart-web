import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { useLanguage } from "@/features/language/LanguageContext";
import { Sparkles, ArrowLeft, UserPlus, ArrowRight } from "lucide-react";
import { PhoneLoginForm } from "@/features/auth/components/PhoneLoginForm";
import { SocialLogin } from "@/features/auth/components/SocialLogin";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const { isBn } = useLanguage();

  const searchParams = new URLSearchParams(location.search);
  let rawFrom = searchParams.get('from') || '/';
  if (rawFrom.startsWith('/auth')) rawFrom = '/';
  const from = rawFrom;

  // Redirect if already authenticated with role-aware default landing
  useEffect(() => {
    if (auth.isAuthenticated) {
      if (from === '/') {
        const roleGroup = auth.user?.roleGroup || auth.roleGroup;
        const role = auth.user?.role || auth.role;
        if (roleGroup === 'vendor' || role === 'seller' || role === 'retail_seller' || role === 'factory_seller') {
          navigate('/seller-central', { replace: true });
          return;
        }
        if (roleGroup === 'admin' || role === 'admin' || role === 'super_admin') {
          navigate('/admin', { replace: true });
          return;
        }
      }
      navigate(from, { replace: true });
    }
  }, [auth.isAuthenticated, auth.user, auth.roleGroup, auth.role, navigate, from]);

  const jamdaniBg = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z M30 15 L45 30 L30 45 L15 30 Z M30 25 L35 30 L30 35 L25 30 Z' fill='%2300a859' fill-opacity='0.035' fill-rule='evenodd'/%3E%3C/svg%3E";

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 relative bg-zinc-50 dark:bg-[#010804]" 
      style={{ backgroundImage: `url("${jamdaniBg}")`, backgroundAttachment: 'fixed' }}
    >
      <div className="absolute top-0 right-0 -m-12 w-80 h-80 bg-[#00a859]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -m-12 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[420px] relative">
        {from !== '/' && (
          <button onClick={() => navigate(from)} className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            {isBn ? "ফিরে যান" : "Go back"}
          </button>
        )}

        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-[1.5rem] bg-gradient-to-br from-[#00a859]/20 to-cyan-600/20 border border-[#00a859]/30 mb-4 shadow-[0_0_24px_rgba(0,168,89,0.15)] animate-bounce-slow">
            <Sparkles className="h-8 w-8 text-[#00a859]" />
          </div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            {isBn ? "পুনরায় স্বাগতম!" : "Welcome back!"}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
            {isBn ? "আপনার PaikarMart অ্যাকাউন্টে লগইন করুন" : "Sign in to your PaikarMart account"}
          </p>
        </div>

        <div className="rounded-[2rem] border border-gray-200/50 dark:border-white/10 bg-white/80 dark:bg-black/40 backdrop-blur-xl shadow-[0_12px_45px_rgba(0,168,89,0.06)] p-6 relative z-10">
          <div className="space-y-6">
            <PhoneLoginForm />
            
            <div className="flex items-center justify-end">
              <Link to="/auth/forgot-password" className="text-xs text-[#00a859] hover:text-[#00a859]/85 hover:underline transition-colors font-bold">
                {isBn ? "পাসওয়ার্ড ভুলে গেছেন?" : "Forgot password?"}
              </Link>
            </div>

            <SocialLogin />
          </div>
        </div>

        <div className="mt-8 relative z-10">
          <Link to="/auth/register" className="flex items-center justify-between p-4.5 rounded-[1.25rem] bg-white/70 dark:bg-white/5 hover:bg-white/95 dark:hover:bg-white/10 border border-gray-200/50 dark:border-white/5 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
             <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-[#00a859]/10 text-[#00a859] transition-transform duration-350 group-hover:scale-105">
                   <UserPlus className="w-5.5 h-5.5" />
                </div>
                <div className="text-left">
                   <h4 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-[#00a859] transition-colors">{isBn ? "নতুন অ্যাকাউন্ট খুলুন" : "Create Account"}</h4>
                   <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{isBn ? "নতুন ব্যবহারকারীদের জন্য" : "For new users"}</p>
                </div>
             </div>
             <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-[#00a859] group-hover:translate-x-1.5 transition-all duration-300" />
          </Link>
        </div>
      </div>
    </div>
  );
}
