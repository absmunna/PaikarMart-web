import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, CreditCard, CheckCircle2, X, AlertCircle, Sparkles, Check } from 'lucide-react';
import { formatBDT } from '@/lib/format';

interface CheckoutFlowProps {
  isOpen: boolean;
  onClose: () => void;
  subtotal: number;
  vatRate?: number;
  deliveryCharge?: number;
  onConfirmOrder: (address: string, paymentMethod: string) => void;
}

export const CheckoutFlow: React.FC<CheckoutFlowProps> = ({
  isOpen,
  onClose,
  subtotal,
  vatRate = 0.05,
  deliveryCharge = 60,
  onConfirmOrder
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Address, 2: Payment, 3: Success preview/confirm
  const [address, setAddress] = useState('ঢাকা, বাংলাদেশ (Dhaka, Bangladesh)');
  const [landmark, setLandmark] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'wallet'>('bkash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const vat = subtotal * vatRate;
  const grandTotal = subtotal + vat + deliveryCharge;

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirmOrder(`${address} (${landmark})`, paymentMethod);
      setStep(1); // Reset
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 m-auto w-full max-w-lg h-fit max-h-[90vh] bg-neutral-950 border border-white/5 rounded-[2.5rem] z-55 overflow-hidden flex flex-col justify-between shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
                  এসক্রো অর্ডার সেটেলমেন্ট <span className="text-zinc-500 font-normal">| Settlement Portal</span>
                </h3>
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                  Step {step} of 3: {step === 1 ? 'Delivery Location' : step === 2 ? 'Payment Method' : 'Final Review'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Progress Indicator */}
            <div className="px-6 py-3 bg-white/[0.01] border-b border-white/5 flex items-center justify-between gap-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex-1 flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center border transition-all ${
                    step === s 
                      ? 'bg-[var(--pm-accent)] text-black border-transparent shadow shadow-orange-500/20' 
                      : step > s 
                        ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' 
                        : 'border-white/5 bg-white/[0.01] text-zinc-500'
                  }`}>
                    {step > s ? <Check className="w-3.5 h-3.5" /> : s}
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider hidden sm:inline ${
                    step === s ? 'text-white' : 'text-zinc-600'
                  }`}>
                    {s === 1 ? 'Location' : s === 2 ? 'Payment' : 'Review'}
                  </span>
                </div>
              ))}
            </div>

            {/* Steps Content Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-6 max-h-[50vh] space-y-4">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
                      ডেলিভারি ঠিকানা (Detailed Address) *
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      className="w-full p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-white focus:outline-none focus:border-white/10"
                      placeholder="জেলা, থানা, এলাকা এবং বাড়ির নম্বর উল্লেখ করুন..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                      নিকটবর্তী কোনো পরিচিত ল্যান্ডমার্ক (Landmark / Note)
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full h-12 px-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-white focus:outline-none focus:border-white/10"
                      placeholder="যেমন: মসজিদের পিছনে বা স্কুলের পাশে..."
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
                    পেমেন্ট মেথড সিলেক্ট করুন (Payment Option)
                  </label>

                  <div className="grid grid-cols-1 gap-3">
                    {/* bKash */}
                    <button
                      onClick={() => setPaymentMethod('bkash')}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                        paymentMethod === 'bkash' 
                          ? 'bg-[#e2136e]/10 border-[#e2136e]/50 text-white shadow-inner shadow-[#e2136e]/5' 
                          : 'bg-white/[0.01] border-white/5 text-zinc-400 hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-3.5 h-3.5 rounded-full border border-zinc-700 flex items-center justify-center">
                          {paymentMethod === 'bkash' && <span className="w-2 h-2 rounded-full bg-[#e2136e]" />}
                        </span>
                        <div>
                          <p className="text-xs font-black">bKash (বিকাশ)</p>
                          <p className="text-[9px] text-zinc-500 font-bold uppercase mt-0.5">instant trust automated confirmation</p>
                        </div>
                      </div>
                      <span className="text-sm font-black text-[#e2136e]">বিকাশ</span>
                    </button>

                    {/* Nagad */}
                    <button
                      onClick={() => setPaymentMethod('nagad')}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                        paymentMethod === 'nagad' 
                          ? 'bg-[#f37021]/10 border-[#f37021]/50 text-white shadow-inner shadow-[#f37021]/5' 
                          : 'bg-white/[0.01] border-white/5 text-zinc-400 hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-3.5 h-3.5 rounded-full border border-zinc-700 flex items-center justify-center">
                          {paymentMethod === 'nagad' && <span className="w-2 h-2 rounded-full bg-[#f37021]" />}
                        </span>
                        <div>
                          <p className="text-xs font-black">Nagad (নগদ)</p>
                          <p className="text-[9px] text-zinc-500 font-bold uppercase mt-0.5">zero gateway processing charges</p>
                        </div>
                      </div>
                      <span className="text-sm font-black text-[#f37021]">নগদ</span>
                    </button>

                    {/* PK Wallet */}
                    <button
                      onClick={() => setPaymentMethod('wallet')}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                        paymentMethod === 'wallet' 
                          ? 'bg-orange-500/10 border-orange-500/50 text-white' 
                          : 'bg-white/[0.01] border-white/5 text-zinc-400 hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-3.5 h-3.5 rounded-full border border-zinc-700 flex items-center justify-center">
                          {paymentMethod === 'wallet' && <span className="w-2 h-2 rounded-full bg-orange-500" />}
                        </span>
                        <div>
                          <p className="text-xs font-black">PK Wallet (পার্ক কয়েন ওয়ালেট)</p>
                          <p className="text-[9px] text-zinc-500 font-bold uppercase mt-0.5">auto debit with instant security</p>
                        </div>
                      </div>
                      <span className="text-sm font-black text-orange-400">ওয়ালেট</span>
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 border-b border-white/5 pb-2 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    বিলিং রিভিউ (Billing Overview)
                  </h4>

                  <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-2.5">
                    <div className="flex justify-between items-center text-xs text-zinc-400">
                      <span>সাবটোটাল (Subtotal)</span>
                      <span className="font-extrabold text-zinc-200">{formatBDT(subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-zinc-400">
                      <span>৫% ভ্যাট (VAT 5%)</span>
                      <span className="font-extrabold text-zinc-200">{formatBDT(vat)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-zinc-400">
                      <span>ডেলিভারি চার্জ (Delivery Charge)</span>
                      <span className="font-extrabold text-cyan-400">{formatBDT(deliveryCharge)}</span>
                    </div>
                    <div className="border-t border-white/5 pt-2 flex justify-between items-center text-xs font-black">
                      <span className="text-white">সর্বমোট বিল</span>
                      <span className="text-sm text-[var(--pm-accent)]">{formatBDT(grandTotal)}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-[10px] text-amber-500/80 leading-relaxed font-bold flex gap-2.5 items-start">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                    <div>
                      পণ্য ডেলিভারি বুঝে পাওয়ার আগে টাকা সম্পূর্ণ সুরক্ষিত থাকবে। যেকোনো প্রকার অমিল বা ডেমেজ থাকলে রিপ্লেসমেন্ট এবং রিফান্ডের জন্য আবেদন করতে পারবেন।
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions Footer */}
            <div className="p-6 border-t border-white/5 bg-neutral-950/95 flex gap-3 text-xs font-bold uppercase tracking-wider">
              {step > 1 && (
                <button
                  onClick={() => setStep((s) => (s - 1) as any)}
                  className="flex-1 h-12 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 text-white transition-all cursor-pointer"
                >
                  পূর্ববর্তী (Back)
                </button>
              )}

              {step < 3 ? (
                <button
                  onClick={() => setStep((s) => (s + 1) as any)}
                  className="flex-[2] h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-black font-black uppercase tracking-widest active:scale-95 hover:scale-[1.01] transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  পরবর্তী (Next)
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-[2] h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-black font-black uppercase tracking-widest active:scale-95 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/10"
                >
                  {isSubmitting ? (
                    <span>অর্ডার হচ্ছে...</span>
                  ) : (
                    <>
                      <span>অর্ডার প্লেস করুন (Confirm)</span>
                      <Sparkles className="w-4 h-4 animate-spin" />
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
