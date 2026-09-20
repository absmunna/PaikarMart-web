import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Wallet, Truck, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWalletStore } from '@/modules/wallet/useWalletStore';
import { toast } from 'sonner';

interface UnifiedPaymentFormProps {
  amount: number;
  orderId: string;
  onSuccess: (method: string) => void;
  isBilingual?: boolean;
}

export function UnifiedPaymentForm({ amount, orderId, onSuccess, isBilingual = false }: UnifiedPaymentFormProps) {
  const { balance, processPayment } = useWalletStore();
  const [selectedMethod, setSelectedMethod] = useState<'wallet' | 'cod' | 'bkash' | 'nagad'>('wallet');
  const [isProcessing, setIsProcessing] = useState(false);

  const t = (en: string, bn: string) => isBilingual ? `${bn} (${en})` : bn;

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      if (selectedMethod === 'wallet') {
        const success = await processPayment(amount, `Order Payment #${orderId}`);
        if (!success) {
          toast.error(t('Insufficient wallet balance', 'ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই'));
          setIsProcessing(false);
          return;
        }
      }
      
      // For COD and MFS we simulate success in this unified demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(t('Payment successful!', 'পেমেন্ট সফল হয়েছে!'));
      onSuccess(selectedMethod);
    } catch (error) {
      toast.error(t('Payment failed', 'পেমেন্ট ব্যর্থ হয়েছে'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-slate-400">{t('Total Amount', 'মোট পরিমাণ')}</span>
          <span className="text-xl font-black text-white">৳{amount.toLocaleString()}</span>
        </div>

        <div className="space-y-3">
          {/* Wallet Option */}
          <button
            onClick={() => setSelectedMethod('wallet')}
            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
              selectedMethod === 'wallet' 
                ? 'bg-[var(--pm-accent)]/10 border-[var(--pm-accent)]' 
                : 'bg-white/5 border-white/5 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-3">
              <Wallet className={`w-5 h-5 ${selectedMethod === 'wallet' ? 'text-[var(--pm-accent)]' : 'text-slate-400'}`} />
              <div className="text-left">
                <p className="text-sm font-bold text-white">{t('PaikarMart Wallet', 'পাইকারমার্ট ওয়ালেট')}</p>
                <p className="text-[10px] text-slate-400">{t('Balance:', 'ব্যালেন্স:')} ৳{balance.toLocaleString()}</p>
              </div>
            </div>
            {selectedMethod === 'wallet' && <CheckCircle2 className="w-5 h-5 text-[var(--pm-accent)]" />}
          </button>

          {/* COD Option */}
          <button
            onClick={() => setSelectedMethod('cod')}
            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
              selectedMethod === 'cod' 
                ? 'bg-blue-500/10 border-blue-500' 
                : 'bg-white/5 border-white/5 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-3">
              <Truck className={`w-5 h-5 ${selectedMethod === 'cod' ? 'text-blue-400' : 'text-slate-400'}`} />
              <div className="text-left">
                <p className="text-sm font-bold text-white">{t('Cash on Delivery', 'ক্যাশ অন ডেলিভারি')}</p>
                <p className="text-[10px] text-slate-400">{t('Pay when you receive', 'পণ্য বুঝে পেয়ে মূল্য পরিশোধ করুন')}</p>
              </div>
            </div>
            {selectedMethod === 'cod' && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
          </button>

          {/* bKash / Nagad */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedMethod('bkash')}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                selectedMethod === 'bkash' ? 'bg-[#e2136e]/10 border-[#e2136e]' : 'bg-white/5 border-white/5'
              }`}
            >
              <div className="w-6 h-6 rounded-md bg-[#e2136e] flex items-center justify-center text-white font-bold text-[10px]">bK</div>
              <span className="text-xs font-bold text-white">bKash</span>
            </button>
            <button
              onClick={() => setSelectedMethod('nagad')}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                selectedMethod === 'nagad' ? 'bg-[#f37021]/10 border-[#f37021]' : 'bg-white/5 border-white/5'
              }`}
            >
              <div className="w-6 h-6 rounded-md bg-[#f37021] flex items-center justify-center text-white font-bold text-[10px]">N</div>
              <span className="text-xs font-bold text-white">Nagad</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[10px] text-slate-400 justify-center">
        <ShieldCheck className="w-4 h-4 text-cyan-400" />
        <span>{t('Secure SSL Encrypted Payment Gateways', 'এসএসএল এনক্রিপ্টেড পেমেন্ট গেটওয়ে')}</span>
      </div>

      <Button
        onClick={handlePayment}
        disabled={isProcessing}
        className={`w-full h-12 rounded-2xl font-bold text-base transition-all ${
          selectedMethod === 'wallet' ? 'bg-[var(--pm-accent)]' :
          selectedMethod === 'cod' ? 'bg-blue-600' :
          selectedMethod === 'bkash' ? 'bg-[#e2136e]' : 'bg-[#f37021]'
        } text-white shadow-lg`}
      >
        {isProcessing ? t('Processing...', 'প্রসেসিং হচ্ছে...') : t('Confirm Payment', 'পেমেন্ট নিশ্চিত করুন')}
      </Button>
    </div>
  );
}
