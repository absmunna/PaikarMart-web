import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { sendEmailVerification } from 'firebase/auth';
import { toast } from 'sonner';

export const VerifyEmailPage: React.FC = () => {
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();

  const handleCheckStatus = async () => {
    setChecking(true);
    try {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          toast.success("Email verified successfully!");
          navigate("/", { replace: true });
        } else {
          toast.info("Email is not verified yet. Please check your inbox or spam folder.");
        }
      } else {
        toast.error("No active user session found.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to check email status");
    } finally {
      setChecking(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        toast.success("Verification email sent! Please check your inbox.");
      } else {
        toast.error("No user found to send verification email.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to resend verification email.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
          <Mail className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Verify Your Email / ইমেইল ভেরিফাই করুন</h2>
          <p className="mt-2 text-sm text-gray-600">
            We sent a verification link to <span className="font-semibold text-gray-800">{auth.currentUser?.email || "your email"}</span>.
            Please click the link in the email to activate your PaikarMart account.
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <button
            onClick={handleCheckStatus}
            disabled={checking}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${checking ? "animate-spin" : ""}`} />
            {checking ? "Checking..." : "I've Verified My Email / চেক করুন"}
          </button>

          <button
            onClick={handleResend}
            disabled={resending}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {resending ? "Sending..." : "Resend Verification Email / পুনঃপ্রেরণ করুন"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
