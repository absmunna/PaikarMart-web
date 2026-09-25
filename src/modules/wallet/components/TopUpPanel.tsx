import React, { useState } from 'react';
import { useWalletStore } from '../useWalletStore';
import { useLanguage } from "@/features/language/LanguageContext";
import { PaymentGatewayBridge, PaymentMethod } from '../services/PaymentGatewayBridge';
import { Phone, CreditCard, Check, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export const TopUpPanel: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { updateBalance, addTransaction } = useWalletStore();
  const { isBn } = useLanguage();
  const [method, setMethod] = useState<string>('bkash');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const TOP_UP_METHODS = [
    { id: 'bkash', label: isBn ? 'বিকাশ (bKash)' : 'bKash', icon: Phone, color: 'text-[#e2136e]', sub: isBn ? 'মোবাইল ব্যাংকিং' : 'Mobile Banking' },
    { id: 'nagad', label: isBn ? 'নগদ (Nagad)' : 'Nagad', icon: Phone, color: 'text-[#f37021]', sub: isBn ? 'মোবাইল ব্যাংকিং' : 'Mobile Banking' },
    { id: 'card', label: isBn ? 'কার্ড (Card)' : 'Card', icon: CreditCard, color: 'text-[var(--pm-accent)]', sub: isBn ? 'ভিসা / মাস্টারকার্ড' : 'Visa/Mastercard' },
  ];

  const QUICK_AMOUNTS = [500, 1000, 2000, 5000];

  const handleTopUp = async () => {
    const val = Number(amount);
    if (!val || val <= 0) {
      toast.error(isBn ? "সঠিক পরিমাণ প্রবেশ করান" : "Enter a valid amount");
      return;
    }

    setIsLoading(true);
    try {
      const response = await PaymentGatewayBridge.initiatePayment({
        amount: val,
        method: method as PaymentMethod
      });

      if (response.success) {
        updateBalance(val, 'credit');
        addTransaction({
          type: 'credit',
          amount: val,
          label: isBn ? 'ওয়ালেট টপ আপ' : 'Wallet Top Up',
          sublabel: isBn ? `${method.toUpperCase()} এর মাধ্যমে · ${response.transactionId}` : `Via ${method.toUpperCase()} · ${response.transactionId}`,
          status: 'success'
        });
        toast.success(isBn ? `৳${val} আপনার ওয়ালেটে যোগ করা হয়েছে!` : `৳${val} added to your wallet!`);
        onSuccess?.();
      }
    } catch (err) {
      toast.error(isBn ? "পেমেন্ট ব্যর্থ হয়েছে" : "Payment failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest block mb-3">
          {isBn ? "পেমেন্ট পদ্ধতি নির্বাচন করুন" : "Select Payment Method"}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {TOP_UP_METHODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={cn(
                "p-3 rounded-2xl border transition-all text-left flex items-center gap-3 cursor-pointer",
                method === m.id ? "bg-white/10 border-white/20 shadow-lg" : "bg-white/5 border-white/5 opacity-60 hover:opacity-100"
              )}
            >
              <div className={cn("w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center", m.color)}>
                <m.icon size={20} />
              </div>
              <div>
                <p className="text-[12px] font-bold text-white">{m.label}</p>
                <p className="text-[8px] text-zinc-500">{m.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest block mb-2">
          {isBn ? "টাকার পরিমাণ (৳)" : "Amount (৳)"}
        </label>
        <input 
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-2xl font-black text-white outline-none focus:border-white/20 transition-all"
        />
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
          {QUICK_AMOUNTS.map(qa => (
            <button 
              key={qa} 
              onClick={() => setAmount(qa.toString())}
              className={cn(
                "px-4 py-2 rounded-xl text-[11px] font-black border whitespace-nowrap transition-all cursor-pointer",
                amount === qa.toString() ? "bg-white text-black border-white" : "bg-white/5 border-white/5 text-zinc-400"
              )}
            >
              ৳{qa}
            </button>
          ))}
        </div>
      </div>

      <Button 
        onClick={handleTopUp}
        disabled={!amount || isLoading}
        className="w-full h-14 bg-white text-black font-black text-sm rounded-2xl hover:bg-zinc-200 gap-2 cursor-pointer"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            {isBn ? "সুরক্ষিত পেমেন্ট গেটওয়েতে রিডাইরেক্ট করা হচ্ছে..." : "Redirecting to Gateway..."}
          </>
        ) : (isBn ? `টপ আপ ৳${amount || '0'}` : `Top Up ৳${amount || '0'}`)}
      </Button>
    </div>
  );
};
