import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Wallet, ArrowDownLeft, ArrowUpRight, History, ShieldCheck,
  Send, Plus, Repeat, X, Check, ChevronRight, Copy,
  TrendingUp, BadgeCheck, Eye, EyeOff, Sparkles, QrCode,
  CreditCard, Phone, Building2, AlertCircle
} from "lucide-react";
import { useWalletStore, WalletOverview, EscrowPanel, WithdrawalRequest, TopUpPanel, SendMoneyPanel } from "@/modules/wallet";
import { useAuth } from "@/features/auth/AuthContext";
import { useLanguage } from "@/features/language/LanguageContext";
import { StoryBar } from "@shared/StoryBar";
import { CategoryNavBar } from "@shared/CategoryNavBar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Transaction = {
  id: string; type: "credit" | "debit"; amount: number;
  label: string; sublabel: string; time: string; status: "success" | "pending" | "failed";
};

type ModalType = 'topup' | 'send' | 'withdraw' | null;

export function WalletDashboard() {
  const { balance, coins, transactions, updateBalance, addTransaction, isLoading } = useWalletStore();
  const { user } = useAuth();
  const { isBn } = useLanguage();
  
  const isSeller = user?.roles?.some(role => ['seller', 'admin', 'super_admin'].includes(role));
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] pb-28 pt-16">
      <section className="pt-3"><StoryBar context="wallet" /></section>
      <div className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-[var(--pm-border)]/40 px-4">
        <CategoryNavBar context="wallet" />
      </div>

      <div className="px-4 mt-4">
        {isSeller && (
          <div className="mb-6 animate-in fade-in">
            <EscrowPanel items={[
              { id: '1', orderId: 'ORD-772', amount: 15400, status: 'held', releaseDate: isBn ? '১৫ জুন, ২০২৬' : 'June 15, 2026' },
              { id: '2', orderId: 'ORD-769', amount: 2500, status: 'released', releaseDate: isBn ? 'আজ' : 'Today' },
            ]} />
          </div>
        )}

        <WalletOverview onAction={(type) => setActiveModal(type)} />
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[900] bg-black/70 backdrop-blur-sm flex items-end justify-center" 
            onClick={e => e.target === e.currentTarget && setActiveModal(null)}
          >
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }} 
              transition={{ type: "spring", damping: 28 }} 
              className="w-full max-w-[500px] bg-[var(--pm-bg)] border-t border-white/10 rounded-t-3xl p-5"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-black text-white">
                  {activeModal === 'topup' 
                    ? (isBn ? "টাকা যোগ করুন (Cash In)" : "Add Money") 
                    : activeModal === 'send' 
                      ? (isBn ? "টাকা পাঠান (Send Money)" : "Send Money") 
                      : (isBn ? "টাকা উত্তোলন করুন (Withdraw)" : "Withdraw")}
                </h3>
                <button onClick={() => setActiveModal(null)} className="cursor-pointer">
                  <X className="w-5 h-5 text-zinc-400 hover:text-white transition-colors" />
                </button>
              </div>

              {activeModal === 'topup' && (
                <TopUpPanel onSuccess={() => setActiveModal(null)} />
              )}

              {activeModal === 'send' && (
                <SendMoneyPanel onSuccess={() => setActiveModal(null)} />
              )}

              {activeModal === 'withdraw' && (
                <WithdrawalRequest onSuccess={() => setActiveModal(null)} />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
