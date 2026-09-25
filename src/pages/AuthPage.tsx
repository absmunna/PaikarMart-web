import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Mail, Phone, ShieldCheck, User, Store, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, UserRole } from '../modules/auth/authStore';

type AuthStep = 'identifier' | 'otp' | 'role_selection' | 'details';

export const AuthPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [step, setStep] = useState<AuthStep>('identifier');
  const [identifier, setIdentifier] = useState(''); // Email or Phone
  const [inputType, setInputType] = useState<'email' | 'phone' | null>(null);

  const [otp, setOtp] = useState(['', '', '', '']);
  const [role, setRole] = useState<UserRole>('buyer');

  // Loading and error states
  const [error, setError] = useState<string | null>(null);
  const [identifierLoading, setIdentifierLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [completeLoading, setCompleteLoading] = useState(false);

  // Profile Details
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [tradeLicense, setTradeLicense] = useState('');

  const handleIdentifierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;
    setError(null);
    setIdentifierLoading(true);
    try {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
      setInputType(isEmail ? 'email' : 'phone');
      await axios.post(`${import.meta.env.VITE_API_BASE_URL || '/api/v1'}/auth/request-otp`, {
        identifier,
      });
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to request OTP');
    } finally {
      setIdentifierLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 4) return;
    setError(null);
    setOtpLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL || '/api/v1'}/auth/verify-otp`, {
        identifier,
        otp: otpValue,
      });
      setStep('role_selection');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCompleteLoading(true);
    try {
      const payload: any = {
        role,
        fullName: fullName || 'Guest User',
        identifier,
        identifierType: inputType,
        businessName: role === 'seller' ? businessName : undefined,
        tradeLicense: role === 'seller' ? tradeLicense : undefined,
      };
      await axios.post(`${import.meta.env.VITE_API_BASE_URL || '/api/v1'}/auth/register`, payload, { withCredentials: true });
      // Assume backend sets httpOnly JWT cookie; update client store
      login({
        role,
        email: inputType === 'email' ? identifier : undefined,
        phone: inputType === 'phone' ? identifier : undefined,
        fullName,
        businessName: role === 'seller' ? businessName : undefined,
        tradeLicense: role === 'seller' ? tradeLicense : undefined,
      });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setCompleteLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col justify-center items-center px-4 relative overflow-hidden bg-[var(--pm-bg)]">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-[var(--pm-accent)]/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-indigo-500/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] glass rounded-3xl p-8 shadow-2xl border border-[var(--pm-border)]/50 relative z-10"
      >
        {/* Back Button for Steps */}
        {step !== 'identifier' && (
          <button
            onClick={() => {
              if (step === 'otp') setStep('identifier');
              if (step === 'role_selection') setStep('otp');
              if (step === 'details') setStep('role_selection');
            }}
            className="absolute top-6 left-6 p-2 rounded-full bg-[var(--pm-surface-hover)] text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}

        <div className="text-center mb-8 mt-2">
          <h1 className="text-3xl font-black mb-2 tracking-tight">
            <span className="text-[var(--pm-text)]">Paikar</span>
            <span className="text-[var(--pm-accent)]">Mart</span>
          </h1>
          <p className="text-[12px] font-bold text-[var(--pm-text-muted)] uppercase tracking-widest">
            {step === 'identifier' && 'Welcome to the Future'}
            {step === 'otp' && 'Verification'}
            {step === 'role_selection' && 'Choose Your Path'}
            {step === 'details' && 'Almost There'}
          </p>
        </div>

        {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}

        <AnimatePresence mode="wait">
          {step === 'identifier' && (
            <motion.form
              key="identifier"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleIdentifierSubmit}
              className="space-y-5"
            >
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--pm-text-muted)] uppercase ml-1">Phone or Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    {identifier.includes('@') ? (
                      <Mail className="w-5 h-5 text-[var(--pm-text-muted)]" />
                    ) : (
                      <Phone className="w-5 h-5 text-[var(--pm-text-muted)]" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter your phone or email..."
                    className="w-full bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-2xl py-3.5 pl-12 pr-4 text-sm text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)] transition-colors font-medium"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={!identifier || identifierLoading}
                className="w-full bg-[var(--pm-accent)] text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-[var(--pm-accent)]/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100"
              >
                {identifierLoading ? 'Processing...' : <>Continue <ArrowRight className="w-4 h-4" /></>}
              </button>
            </motion.form>
          )}

          {step === 'otp' && (
            <motion.form
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleOtpSubmit}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <ShieldCheck className="w-12 h-12 text-[var(--pm-accent)] mx-auto mb-4" />
                <p className="text-sm text-[var(--pm-text-muted)]">
                  We sent a secure code to<br />
                  <strong className="text-[var(--pm-text)]">{identifier}</strong>
                </p>
              </div>

              <div className="flex justify-center gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[idx] = e.target.value;
                      setOtp(newOtp);
                      // Auto focus next
                      if (e.target.value && idx < 3) {
                        document.getElementById(`otp-${idx + 1}`)?.focus();
                      }
                    }}
                    className="w-14 h-14 text-center text-xl font-black bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-2xl text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)] transition-colors"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={otp.join('').length < 4 || otpLoading}
                className="w-full bg-[var(--pm-accent)] text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-[var(--pm-accent)]/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {otpLoading ? 'Verifying...' : 'Verify & Proceed'}
              </button>
            </motion.form>
          )}

          {step === 'role_selection' && (
            <motion.div
              key="role_selection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <button
                onClick={() => { setRole('buyer'); setStep('details'); }}
                className="w-full p-4 rounded-2xl border-2 border-[var(--pm-border)] hover:border-[var(--pm-accent)] bg-[var(--pm-surface-hover)] transition-all flex items-center gap-4 group text-left"
              >
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--pm-text)] text-lg">Regular Buyer</h3>
                  <p className="text-xs text-[var(--pm-text-muted)]">I want to shop & buy products</p>
                </div>
              </button>

              <button
                onClick={() => { setRole('seller'); setStep('details'); }}
                className="w-full p-4 rounded-2xl border-2 border-[var(--pm-border)] hover:border-amber-500 bg-[var(--pm-surface-hover)] transition-all flex items-center gap-4 group text-left"
              >
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--pm-text)] text-lg">Pro Seller</h3>
                  <p className="text-xs text-[var(--pm-text-muted)]">I want to open a store & sell</p>
                </div>
              </button>
            </motion.div>
          )}

          {step === 'details' && (
            <motion.form
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleComplete}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--pm-text-muted)] uppercase ml-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. MD MUNNA"
                  className="w-full bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-2xl px-4 py-3 text-sm text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]"
                  required
                />
              </div>

              {role === 'seller' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--pm-text-muted)] uppercase ml-1">Business/Store Name</label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Munna Electronics"
                      className="w-full bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-2xl px-4 py-3 text-sm text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--pm-text-muted)] uppercase ml-1">Trade License Number (Optional for now)</label>
                    <input
                      type="text"
                      value={tradeLicense}
                      onChange={(e) => setTradeLicense(e.target.value)}
                      placeholder="e.g. TR-12345678"
                      className="w-full bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-2xl px-4 py-3 text-sm text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={!fullName || (role === 'seller' && !businessName) || completeLoading}
                className="w-full bg-[var(--pm-accent)] text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-[var(--pm-accent)]/20 active:scale-95 transition-all mt-4 disabled:opacity-50"
              >
                {completeLoading ? 'Registering...' : 'Complete Registration'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Footer Policy */}
        <p className="text-[10px] text-center text-[var(--pm-text-muted)] mt-6 px-4">
          By continuing, you agree to PaikarMart's <br />
          <a href="#" className="text-[var(--pm-accent)] hover:underline">Terms of Service</a> and <a href="#" className="text-[var(--pm-accent)] hover:underline">Privacy Policy</a>.
        </p>

      </motion.div>
    </div>
  );
};
