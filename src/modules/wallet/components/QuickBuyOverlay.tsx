import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ChevronRight, ShieldCheck, Wallet, X, Zap } from 'lucide-react';
import { cn } from '@lib/utils';
import { formatBDT } from '@lib/format';
import { Button } from '@ui/button';
import { useWalletStore } from '../useWalletStore';
import { PaymentGatewayBridge, PaymentMethod } from '../services/PaymentGatewayBridge';
import { toast } from 'sonner';
import { apiClient } from '@/modules/app/api/client/axiosInstance';

interface QuickBuyOverlayProps {
  product: {
    id: string;
    title: string;
    price: number;
    image?: string;
  };
  onClose: () => void;
}

export const QuickBuyOverlay: React.FC<QuickBuyOverlayProps> = ({ product, onClose }) => {
  const { balance } = useWalletStore();
  const [step, setStep] = useState<'options' | 'confirm'>('options');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'bkash' | 'nagad'>('wallet');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = async () => {
    setIsProcessing(true);
    
    try {
      if (paymentMethod === 'wallet') {
        if (balance < product.price) {
          toast.error("Insufficient wallet balance. Please top up or use bKash.");
          setIsProcessing(false);
          return;
        }

        // Call backend to create escrow order via wallet
        const response = await apiClient.post(`/orders`, {
          sellerId: 'demo-seller-id', // In real app, from product
          paymentMethod: 'wallet',
          items: [
            { productId: product.id, quantity: 1, price: product.price }
          ]
        });

        if (response.data) {
          toast.success("Order placed successfully! Funds held in escrow.");
          onClose();
        }
      } else {
        // External Gateway
        const response = await PaymentGatewayBridge.initiatePayment({
          amount: product.price,
          method: paymentMethod as PaymentMethod,
          reference: `REEL-${product.id}-${Date.now()}`
        });

        if (response.success) {
          if (response.redirectUrl) {
            // window.location.href = response.redirectUrl;
            toast.info("Simulation: Redirecting to payment gateway...");
          }
          onClose();
        } else {
          toast.error(response.error || "Payment failed");
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to process order");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute inset-x-0 bottom-0 z-50 bg-zinc-950/40 backdrop-blur-3xl border-t border-white/10 rounded-t-[40px] p-8 pb-14 shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.5)]"
      onClick={e => e.stopPropagation()}
    >
      {/* Decorative Handle */}
      <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden shadow-inner">
             {product.image ? (
               <img src={product.image} className="w-full h-full object-cover" />
             ) : (
               <ShoppingBag className="w-6 h-6 text-white/40" />
             )}
          </div>
          <div className="space-y-0.5">
            <h4 className="text-white font-black text-base tracking-tight line-clamp-1">{product.title}</h4>
            <div className="flex items-center gap-2">
              <p className="text-violet-400 font-black text-lg tracking-tight">{formatBDT(product.price)}</p>
              <div className="px-2 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/20 text-[8px] font-black text-violet-400 uppercase tracking-widest">
                Special Price
              </div>
            </div>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-white/70" />
        </button>
      </div>

      {step === 'options' && (
        <div className="space-y-3">
          <button 
            onClick={() => setPaymentMethod('wallet')}
            className={cn(
              "w-full p-4 rounded-2xl flex items-center justify-between border transition-all",
              paymentMethod === 'wallet' ? "bg-white/10 border-white/20" : "bg-white/5 border-white/5 opacity-60"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400">
                <Wallet size={18} />
              </div>
              <div className="text-left">
                <p className="text-[12px] font-bold text-white">PaikarPay Wallet</p>
                <p className="text-[10px] text-zinc-500">Balance: {formatBDT(balance)}</p>
              </div>
            </div>
            {paymentMethod === 'wallet' && <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center"><ChevronRight size={12} className="text-white" /></div>}
          </button>

          <button 
            onClick={() => setPaymentMethod('bkash')}
            className={cn(
              "w-full p-4 rounded-2xl flex items-center justify-between border transition-all",
              paymentMethod === 'bkash' ? "bg-white/10 border-white/20" : "bg-white/5 border-white/5 opacity-60"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400 font-black text-[9px]">bKash</div>
              <div className="text-left">
                <p className="text-[12px] font-bold text-white">Mobile Banking</p>
                <p className="text-[10px] text-zinc-500">Fast & Secure Checkout</p>
              </div>
            </div>
            {paymentMethod === 'bkash' && <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center"><ChevronRight size={12} className="text-white" /></div>}
          </button>

          <div className="flex items-center gap-2 px-1 pt-2">
            <ShieldCheck size={14} className="text-cyan-500" />
            <p className="text-[10px] text-zinc-500 font-medium tracking-tight">Funds held in secure Escrow until delivery.</p>
          </div>

          <Button 
            onClick={() => setStep('confirm')}
            className="w-full h-14 bg-white text-black font-black text-sm rounded-2xl mt-4 hover:bg-zinc-200 transition-all border-none"
          >
            Proceed to Buy
          </Button>
        </div>
      )}

      {step === 'confirm' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Confirm Payment</p>
            <p className="text-2xl font-black text-white">{formatBDT(product.price)}</p>
            <p className="text-[10px] text-violet-400 mt-1 uppercase font-bold">via {paymentMethod.toUpperCase()}</p>
          </div>

          <div className="flex items-center gap-3 text-left p-3">
             <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
               <Zap className="w-4 h-4 text-amber-500" />
             </div>
             <p className="text-[10px] text-zinc-400 leading-normal">
               One tap checkout enabled. Funds will be deducted immediately and held in escrow for your protection.
             </p>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setStep('options')}
              className="flex-1 h-14 bg-transparent border-white/10 text-white font-black hover:bg-white/5 rounded-2xl"
            >
              Back
            </Button>
            <Button 
              onClick={handlePurchase}
              disabled={isProcessing}
              className="flex-[2] h-14 bg-violet-600 hover:bg-violet-500 text-white font-black rounded-2xl border-none"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <Zap className="w-4 h-4 text-white/50" />
                  </motion.div>
                  Processing...
                </span>
              ) : 'Pay Now'}
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
