import React, { useState } from 'react';
import { useWalletStore } from '../useWalletStore';
import { useLanguage } from "@/features/language/LanguageContext";
import { PaymentGatewayBridge, PaymentMethod } from '../services/PaymentGatewayBridge';
import { Phone, Building2, CreditCard, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export const WithdrawalRequest: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { balance, updateBalance, addTransaction } = useWalletStore();
  const { isBn } = useLanguage();
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const WITHDRAW_METHODS = [
    { id: 'bkash', label: isBn ? 'বিকাশ (bKash)' : 'bKash', icon: Phone, color: 'text-pink-400', sub: isBn ? 'তাৎক্ষণিক থেকে ২৪ ঘণ্টা' : 'Instant to 24 hours' },
    { id: 'nagad', label: isBn ? 'নগদ (Nagad)' : 'Nagad', icon: Phone, color: 'text-orange-400', sub: isBn ? 'তাৎক্ষণিক থেকে ২৪ ঘণ্টা' : 'Instant to 24 hours' },
    { id: 'bank', label: isBn ? 'ব্যাংক ট্রান্সফার' : 'Bank Transfer', icon: Building2, color: 'text-blue-400', sub: isBn ? '১ থেকে ৩ কার্যদিবস' : '1 to 3 business days' },
  ];

  const handleWithdraw = async () => {
    const val = Number(amount);
    if (isNaN(val) || val <= 0) {
      toast.error(isBn ? "সঠিক পরিমাণ প্রবেশ করান" : "Enter a valid amount");
      return;
    }
    if (val > balance) {
      toast.error(isBn ? "আপনার পর্যাপ্ত ব্যালেন্স নেই" : "Insufficient balance");
      return;
    }
    if (!account) {
      toast.error(isBn ? "অ্যাকাউন্ট বা মোবাইল নম্বর দিন" : "Account number required");
      return;
    }

    // Mobile validation for MFS methods
    if (method === 'bkash' || method === 'nagad') {
      const BD_PHONE_RE = /^01[3-9]\d{8}$/;
      if (!BD_PHONE_RE.test(account)) {
        toast.error(isBn ? "অনুগ্রহ করে সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)" : "Please enter a valid Bangladeshi mobile number (e.g., 017XXXXXXXX)");
        return;
      }
    }

    setIsLoading(true);
    try {
      const response = await PaymentGatewayBridge.initiateWithdrawal({
        amount: val,
        method: method as PaymentMethod
      });

      if (response.success) {
        updateBalance(val, 'debit');
        addTransaction({
          type: 'debit',
          amount: val,
          label: isBn ? 'টাকা উত্তোলন' : 'Fund Withdrawal',
          sublabel: isBn ? `${method.toUpperCase()} এ স্থানান্তর (${account})` : `To ${method.toUpperCase()} (${account})`,
          status: 'pending'
        });
        toast.success(isBn ? `৳${val} উত্তোলনের অনুরোধ পাঠানো হয়েছে!` : `৳${val} withdrawal requested!`);
        onSuccess?.();
      }
    } catch (err) {
      toast.error(isBn ? "উত্তোলন প্রক্রিয়া ব্যর্থ হয়েছে" : "Failed to process withdrawal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in">
          <h3 className="text-white font-black text-sm">
            {isBn ? "উত্তোলন মাধ্যম নির্বাচন করুন" : "Select Method"}
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {WITHDRAW_METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => { setMethod(m.id); setStep(2); }}
                className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center", m.color)}>
                    <m.icon size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-white">{m.label}</p>
                    <p className="text-[10px] text-zinc-500 font-medium">{m.sub}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-black text-sm">
              {isBn ? `${method.toUpperCase()} এর মাধ্যমে উত্তোলন` : `Withdraw via ${method.toUpperCase()}`}
            </h3>
            <button onClick={() => setStep(1)} className="text-[10px] text-zinc-500 font-black uppercase underline cursor-pointer">
              {isBn ? "পরিবর্তন করুন" : "Change"}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest block mb-2">
                {isBn ? "অ্যাকাউন্ট বা মোবাইল নম্বর" : "Account Number / Phone"}
              </label>
              <input 
                value={account}
                onChange={e => setAccount(e.target.value)}
                placeholder={method === 'bank' ? "Bank account number..." : "01XXXXXXXXX"}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-white/20 transition-all"
              />
            </div>

            <div>
              <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest block mb-2">
                {isBn ? "টাকার পরিমাণ (৳)" : "Amount (৳)"}
              </label>
              <div className="relative">
                <input 
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-2xl font-black text-white outline-none focus:border-white/20 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-zinc-600">BDT</span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-2">
                {isBn ? "ব্যবহারযোগ্য:" : "Available:"} ৳{balance.toLocaleString()}
              </p>
            </div>

            <Button 
              onClick={handleWithdraw}
              disabled={!amount || !account || isLoading}
              className="w-full h-14 bg-white text-black font-black text-sm rounded-2xl hover:bg-zinc-200 transition-all cursor-pointer"
            >
              {isLoading ? (isBn ? "প্রক্রিয়াধীন..." : "Processing...") : (isBn ? "উত্তোলন নিশ্চিত করুন" : "Confirm Withdrawal")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
