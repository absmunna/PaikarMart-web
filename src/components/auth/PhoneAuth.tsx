import React, { useState, useEffect } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { Phone, ArrowRight, Loader2, Edit2 } from "lucide-react";

declare global {
  interface Window {
    recaptchaVerifier: any;
    grecaptcha: any;
  }
}

export default function PhoneAuth() {
  const [step, setStep] = useState<"input" | "otp">("input");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
      });
    }
  }, []);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const appVerifier = window.recaptchaVerifier;
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+88${phoneNumber.startsWith('0') ? '' : '0'}${phoneNumber}`;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setStep("otp");
    } catch (err: any) {
      console.error(err);
      setError("Failed to send OTP. Please check your number format.");
      if (window.recaptchaVerifier && window.grecaptcha) {
        window.recaptchaVerifier.render().then((widgetId: any) => {
          window.grecaptcha.reset(widgetId);
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) return;
    
    setError("");
    setLoading(true);
    
    try {
      await confirmationResult.confirm(otp);
    } catch (err: any) {
      console.error(err);
      setError("Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "otp") {
    return (
      <form onSubmit={handleVerifyOTP} className="flex flex-col gap-10">
        {error && (
          <div className="bg-rose-500/10 text-rose-500 p-4 rounded-2xl text-sm border border-rose-500/20 font-medium animate-shake text-center">
            {error}
          </div>
        )}

        <div className="text-center">
          <div className="bg-[#FF7A00]/10 text-[#FF7A00] px-4 py-2 rounded-full inline-flex items-center gap-2 text-sm font-bold mb-6 border border-[#FF7A00]/20">
            {phoneNumber}
            <button 
              type="button" 
              onClick={() => { setStep("input"); setOtp(""); setError(""); }}
              className="p-1 hover:bg-[#FF7A00]/20 rounded-full transition-colors"
            >
              <Edit2 className="h-3 w-3" />
            </button>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Verify Code</h2>
          <p className="text-sm text-gray-500 mt-2 font-medium">
            We've sent a 6-digit code to your phone.
          </p>
        </div>
        
        <div className="flex justify-center">
          <input 
            type="text" 
            maxLength={6} 
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="000000"
            className="w-full max-w-[280px] text-center text-4xl tracking-[0.5em] font-mono font-black rounded-3xl border border-white/5 focus:bg-[#1a1c2e] focus:border-[#FF7A00] focus:ring-4 focus:ring-[#FF7A00]/5 outline-none transition-all bg-[#141624] p-8 text-white placeholder:text-gray-800"
            required
            autoFocus
          />
        </div>

        <button 
          type="submit" 
          disabled={loading || otp.length !== 6}
          className="w-full bg-[#FF7A00] text-white rounded-2xl py-4 font-bold text-base hover:bg-[#e06b00] transition-all shadow-xl shadow-[#FF7A00]/10 disabled:opacity-50 flex items-center justify-center gap-2 group"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Verify & Sign In
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
        
        <p className="text-center text-sm font-medium text-gray-500">
          Didn't receive the code?{" "}
          <button type="button" className="font-bold text-[#FF7A00] hover:text-[#e06b00] transition-colors">
            Resend
          </button>
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-8">
      {error && (
        <div className="bg-rose-500/10 text-rose-500 p-4 rounded-2xl text-sm border border-rose-500/20 font-medium animate-shake text-center">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
        <div className="flex gap-3">
          <div className="bg-[#141624] border border-white/5 rounded-2xl px-5 flex items-center justify-center text-white font-black text-base shadow-lg shrink-0">
            +880
          </div>
          <div className="relative group flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-500 group-focus-within:text-[#FF7A00] transition-colors" />
            </div>
            <input 
              type="tel" 
              placeholder="17XX-XXXXXX" 
              required 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[#141624] border border-white/5 rounded-2xl outline-none focus:border-[#FF7A00] focus:ring-4 focus:ring-[#FF7A00]/5 transition-all font-bold text-white placeholder:text-gray-600 shadow-lg"
            />
          </div>
        </div>
        <p className="text-[10px] text-gray-600 ml-1 font-bold uppercase tracking-wider italic">Example: 1712345678</p>
      </div>
      
      <div id="recaptcha-container"></div>

      <button 
        type="submit" 
        disabled={loading || !phoneNumber}
        className="w-full bg-[#FF7A00] text-white rounded-2xl py-4 font-bold text-base hover:bg-[#e06b00] transition-all shadow-xl shadow-[#FF7A00]/10 flex items-center justify-center gap-2 disabled:opacity-50 group"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            Continue 
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
}
