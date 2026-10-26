import React, { useState } from 'react';
import { useWalletStore } from '../useWalletStore';
import { useLanguage } from "@/features/language/LanguageContext";
import { Send, Check, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export const SendMoneyPanel: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { balance, updateBalance, addTransaction } = useWalletStore();
  const { isBn } = useLanguage();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    const val = Number(amount);
    if (isNaN(val) || val <= 0) {
      toast.error(isBn ? "সঠিক পরিমাণ প্রবেশ করান" : "Enter a valid amount");
      return;
    }
    if (val > balance) {
      toast.error(isBn ? "আপনার পর্যাপ্ত ব্যালেন্স নেই" : "Insufficient balance");
      return;
    }
    if (!recipient) {
      toast.error(isBn ? "প্রাপকের আইডি বা ফোন নম্বর দিন" : "Recipient required");
      return;
    }

    // BD Phone validation if it looks like a phone number
    const isPhoneNumber = /^\d+$/.test(recipient);
    if (isPhoneNumber) {
      const BD_PHONE_RE = /^01[3-9]\d{8}$/;
      if (!BD_PHONE_RE.test(recipient)) {
        toast.error(isBn ? "অনুগ্রহ করে সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)" : "Please enter a valid Bangladeshi mobile number (e.g., 017XXXXXXXX)");
        return;
      }
    }

    setIsLoading(true);
    // Simulate P2P transfer
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    updateBalance(val, 'debit');
    addTransaction({
      type: 'debit',
      amount: val,
      label: isBn ? 'টাকা পাঠানো হয়েছে' : 'Send Money',
      sublabel: isBn ? `প্রাপক: ${recipient}` : `To: ${recipient}`,
      status: 'success'
    });
    
    toast.success(isBn ? `৳${val} সফলভাবে পাঠানো হয়েছে!` : `৳${val} sent successfully!`);
    setIsLoading(false);
    onSuccess?.();
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest block mb-2">
          {isBn ? "প্রাপকের আইডি বা মোবাইল নম্বর" : "Recipient ID or Phone"}
        </label>
        <div className="relative">
          <input 
            value={recipient}
            onChange={e => setRecipient(e.target.value)}
            placeholder="PM-XX-XXXX or 01XXXXXXXXX"
            className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 pl-11 text-white text-sm outline-none focus:border-white/20 transition-all"
          />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
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
        <p className="text-[10px] text-zinc-500 mt-2">
          {isBn ? "সর্বোচ্চ ব্যালেন্স:" : "Maximum:"} ৳{balance.toLocaleString()}
        </p>
      </div>

      <Button 
        onClick={handleSend}
        disabled={!amount || !recipient || isLoading}
        className="w-full h-14 bg-orange-500 text-white font-black text-sm rounded-2xl hover:bg-orange-600 shadow-lg shadow-orange-500/20 cursor-pointer transition-all"
      >
        {isLoading ? (isBn ? "পাঠানো হচ্ছে..." : "Processing...") : (isBn ? "এখনই টাকা পাঠান" : "Send Money Now")}
      </Button>

      <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
        <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
          {isBn ? "প্রাপক তাৎক্ষণিকভাবে তাদের পাইকার মার্ট ওয়ালেটে টাকা পেয়ে যাবেন। কোনো অতিরিক্ত চার্জ ছাড়াই টাকা পাঠানো যাবে।" : "Recipient will receive the funds instantly in their Paikar Mart wallet. No transaction fees applied for peer-to-peer transfers."}
        </p>
      </div>
    </div>
  );
};
