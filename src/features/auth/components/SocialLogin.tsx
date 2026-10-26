import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/features/language/LanguageContext';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const SocialLogin = () => {
  const { signInWithGoogle } = useAuth();
  const { isBn } = useLanguage();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success(isBn ? "সফলভাবে লগইন করা হয়েছে!" : "Signed in successfully with Google!");
    } catch (error: any) {
      console.error(error);
      if (error.code !== 'auth/popup-closed-by-user') {
        toast.error(isBn ? "গুগল লগইন ব্যর্থ হয়েছে।" : "Failed to sign in with Google.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200 dark:border-white/10" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black">
          <span className="bg-white dark:bg-[#010804] px-4 text-zinc-400">
            {isBn ? "অথবা" : "Or continue with"}
          </span>
        </div>
      </div>
      
      <Button 
        type="button"
        variant="outline" 
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full h-12 rounded-xl gap-3 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all font-bold text-zinc-700 dark:text-zinc-300"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
              />
              <path
                fill="#FBBC05"
                d="M16.04 18.013c-1.09.618-2.347.987-3.64.987a7.063 7.063 0 0 1-5.23-2.23l-4.027 3.137C5.035 22.926 8.27 24 12 24c3.28 0 6.21-1.106 8.356-2.937l-4.316-3.05Z"
              />
              <path
                fill="#4285F4"
                d="M19.834 5.378C21.218 6.953 22 9.027 22 12c0 .644-.067 1.276-.189 1.884H12v-4.51h5.34a4.568 4.568 0 0 1-1.977 2.997l4.317 3.05c2.518-2.316 3.923-5.748 3.923-9.52 0-.34-.03-.675-.09-1.003L19.834 5.378Z"
              />
              <path
                fill="#34A853"
                d="M1.24 17.35 5.266 14.235a7.045 7.045 0 0 1 0-4.47L1.24 6.65a12.01 12.01 0 0 0 0 10.7Z"
              />
            </svg>
            <span className="text-sm">Google</span>
          </>
        )}
      </Button>
    </div>
  );
};

