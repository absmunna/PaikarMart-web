import React, { useState, useEffect } from "react";
import { FolderLock, Mail, Phone, Lock, User, Loader2, ArrowRight } from "lucide-react";
import { auth } from "../../lib/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from "firebase/auth";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";

declare const grecaptcha: any;

export default function VaultLogin() {
  const [authMode, setAuthMode] = useState<"email" | "phone">("email");
  const [isLogin, setIsLogin] = useState(true);
  
  // Email state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Phone state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [otpSent, setOtpSent] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
      });
    }
  }, []);

  if (isLoading) return null;
  if (isAuthenticated) {
    return <Navigate to="/client-vault" replace />;
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate("/client-vault");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const requestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const appVerifier = window.recaptchaVerifier;
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
    } catch (err: any) {
      console.error(err);
      setError("Failed to send OTP. Check phone number format.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) return;
    
    setError("");
    setLoading(true);
    
    try {
      await confirmationResult.confirm(otp);
      navigate("/client-vault");
    } catch (err: any) {
      console.error(err);
      setError("Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f111a] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.15),transparent)] pointer-events-none"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="h-20 w-20 bg-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-600/20 rotate-3">
            <FolderLock className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">ClientVault</h1>
          <p className="text-gray-500 mt-2 font-medium">Secure business file access.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-10 border border-gray-100">
          <div className="flex gap-2 mb-8 p-1.5 bg-gray-100 rounded-2xl">
            <button
              type="button"
              onClick={() => { setAuthMode("email"); setError(""); }}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${authMode === "email" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              <Mail className="h-4 w-4" /> Email
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode("phone"); setError(""); setOtpSent(false); }}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${authMode === "phone" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              <Phone className="h-4 w-4" /> Phone
            </button>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-sm mb-6 border border-rose-100 font-medium animate-shake">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {authMode === "email" ? (
              <motion.form 
                key="email"
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                onSubmit={handleEmailSubmit} 
                className="space-y-5"
              >
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                    </div>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 bg-gray-50 transition-all font-medium"
                      placeholder="Email Address"
                    />
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                    </div>
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 bg-gray-50 transition-all font-medium"
                      placeholder="Password"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gray-900 text-white rounded-2xl py-4 font-bold hover:bg-black transition-all mt-4 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (isLogin ? "Sign In" : "Create Account")}
                </button>

                <div className="text-center">
                  <button 
                    type="button"
                    onClick={() => { setIsLogin(!isLogin); setError(""); }} 
                    className="text-sm text-blue-600 hover:underline font-bold"
                  >
                    {isLogin ? "Need an account? Create one" : "Already have an account? Sign In"}
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div 
                key="phone"
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
              >
                {!otpSent ? (
                  <form onSubmit={requestOTP} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 ml-1 uppercase tracking-wider">Phone Number</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                        </div>
                        <input 
                          type="tel" 
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 bg-gray-50 transition-all font-bold"
                          placeholder="+88017XXXXXXXX"
                        />
                      </div>
                    </div>
                    
                    <div id="recaptcha-container"></div>

                    <button 
                      type="submit" 
                      disabled={loading || !phoneNumber}
                      className="w-full bg-blue-600 text-white rounded-2xl py-4 font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Continue <ArrowRight className="h-5 w-5" /></>}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={verifyOTP} className="space-y-6">
                    <div className="text-center">
                      <div className="bg-green-50 text-green-700 px-4 py-2 rounded-full inline-flex items-center gap-2 text-sm font-bold border border-green-100 mb-6">
                        {phoneNumber}
                        <button type="button" onClick={() => setOtpSent(false)} className="p-1 hover:bg-green-200 rounded-full">
                          <Edit2 className="h-3 w-3" />
                        </button>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Verify OTP</h3>
                      <p className="text-sm text-gray-500">Enter the 6-digit code sent to your phone.</p>
                    </div>

                    <input 
                      type="text" 
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full py-6 rounded-3xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 bg-gray-50 text-center tracking-[0.5em] text-3xl font-black font-mono shadow-sm"
                      placeholder="000000"
                      maxLength={6}
                      autoFocus
                    />

                    <button 
                      type="submit" 
                      disabled={loading || otp.length !== 6}
                      className="w-full bg-gray-900 text-white rounded-2xl py-4 font-bold hover:bg-black transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify & Access Vault"}
                    </button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Edit2({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );
}


// Ensure TypeScript knows about window.recaptchaVerifier
declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

