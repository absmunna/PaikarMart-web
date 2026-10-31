import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Loader2, CheckCircle2, Lock, Smartphone, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatBDT } from '@/lib/format';
import { toast } from 'sonner';
import { safeBack } from '@/lib/navigation';
import { buildApiUrl } from '@/core/config/api';

export const SandboxGatewayPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const provider = (searchParams.get('provider') || 'bkash').toLowerCase();
  const orderId = searchParams.get('orderId') || `PM-${Math.floor(100000 + Math.random() * 900000)}`;
  const amount = Number(searchParams.get('amount')) || 1500;
  const tx = searchParams.get('tx') || `${provider.toUpperCase()}-TX-${Date.now()}`;

  const isBkash = provider === 'bkash';
  const themeColor = isBkash ? '#e2136e' : '#f37021';
  const providerName = isBkash ? 'bKash Payment Gateway' : 'Nagad Direct Gateway';
  const providerNameBn = isBkash ? 'বিকাশ পেমেন্ট' : 'নগদ পেমেন্ট';

  const [step, setStep] = useState<'phone' | 'otp' | 'pin' | 'success'>('phone');
  const [phone, setPhone] = useState('01711223344');
  const [otp, setOtp] = useState('123456');
  const [pin, setPin] = useState('12345');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 11) {
      toast.error('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('otp');
      toast.info('ওটিপি কোড পাঠানো হয়েছে: 123456');
    }, 600);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      toast.error('ওটিপি কোড দিন');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('pin');
    }, 500);
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) {
      toast.error('পিন নম্বর দিন');
      return;
    }
    setIsProcessing(true);

    try {
      // Call backend verify endpoint
      await fetch(buildApiUrl('/payment/verify'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: tx,
          providerName: provider,
        }),
      }).catch(() => {});

      setIsProcessing(false);
      setStep('success');
      toast.success(`${providerNameBn} সম্পন্ন হয়েছে!`);
      
      // Auto return after 2 seconds
      setTimeout(() => {
        navigate('/cart', { state: { paymentSuccess: true, orderId, tx } });
      }, 2000);
    } catch {
      setIsProcessing(false);
      setStep('success');
      setTimeout(() => {
        navigate('/cart');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col items-center justify-center p-4">
      {/* Top Notice */}
      <div className="max-w-md w-full mb-4 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs px-4 py-2.5 rounded-2xl flex items-center justify-between">
        <span className="font-bold">🔒 Sandbox Simulator Mode</span>
        <span className="text-[10px] uppercase font-mono opacity-80">Test Gateway</span>
      </div>

      <div className="max-w-md w-full bg-[#0d1017] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {/* Gateway Header */}
        <div 
          className="p-6 text-white text-center relative"
          style={{ backgroundColor: themeColor }}
        >
          <button
            onClick={() => safeBack(navigate, '/checkout')}
            className="absolute left-4 top-4 p-2 rounded-xl bg-black/20 hover:bg-black/30 transition-colors text-white cursor-pointer"
            title="ফিরে যান"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <h1 className="text-xl font-black uppercase tracking-tight">{providerName}</h1>
          <p className="text-xs text-white/80 mt-1 font-medium">Merchant: Paikar Mart Super App</p>
          
          <div className="mt-4 bg-black/20 backdrop-blur-md rounded-2xl py-2.5 px-4 inline-block">
            <span className="text-[10px] uppercase tracking-wider block opacity-80">মোট প্রদেয় মূল্য</span>
            <span className="text-xl font-black font-mono">{formatBDT(amount)}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          <div className="text-xs text-zinc-400 mb-6 flex justify-between border-b border-white/5 pb-3">
            <span>ইনভয়েস নম্বর: <strong className="text-white font-mono">{orderId}</strong></span>
            <span>ট্রানজ্যাকশন আইডি: <strong className="text-white font-mono text-[10px]">{tx.slice(0, 14)}...</strong></span>
          </div>

          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  আপনার {providerNameBn} একাউন্ট নম্বর
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-3.5 text-sm font-mono text-white focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <p className="text-[10px] text-zinc-500 mt-1.5">ডেমো টেস্টের জন্য যেকোনো নম্বর ব্যবহার করা যাবে।</p>
              </div>

              <Button
                type="submit"
                disabled={isProcessing}
                style={{ backgroundColor: themeColor }}
                className="w-full h-12 rounded-2xl text-white font-black text-xs uppercase tracking-wider shadow-lg"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'পরবর্তী ধাপ (Next)'}
              </Button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-cyan-400" />
                  ভেরিফিকেশন কোড (OTP)
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-3.5 text-center text-lg font-mono tracking-widest text-white focus:outline-none focus:border-cyan-400"
                />
                <p className="text-[10px] text-zinc-500 mt-1.5 text-center">টেস্ট কোড: <strong>123456</strong></p>
              </div>

              <Button
                type="submit"
                disabled={isProcessing}
                style={{ backgroundColor: themeColor }}
                className="w-full h-12 rounded-2xl text-white font-black text-xs uppercase tracking-wider shadow-lg"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'কোড কনফার্ম করুন'}
              </Button>
            </form>
          )}

          {step === 'pin' && (
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  {providerNameBn} পিন কোড (PIN)
                </label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="•••••"
                  maxLength={5}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-3.5 text-center text-xl font-mono tracking-widest text-white focus:outline-none focus:border-cyan-400"
                />
                <p className="text-[10px] text-zinc-500 mt-1.5 text-center">টেস্ট পিন: <strong>12345</strong></p>
              </div>

              <Button
                type="submit"
                disabled={isProcessing}
                style={{ backgroundColor: themeColor }}
                className="w-full h-12 rounded-2xl text-white font-black text-xs uppercase tracking-wider shadow-lg"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'পেমেন্ট সম্পন্ন করুন'}
              </Button>
            </form>
          )}

          {step === 'success' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-white">পেমেন্ট সফলভাবে গৃহীত হয়েছে!</h3>
              <p className="text-xs text-zinc-400">এসক্রো ব্যালেন্স সিকিউর করা হয়েছে। ধন্যবাদ।</p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            256-bit Encrypted Settlement Engine
          </div>
        </div>
      </div>
    </div>
  );
};
