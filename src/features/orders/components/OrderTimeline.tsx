import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Package, Truck, Home, Box, ShieldCheck, UserCheck } from 'lucide-react';
import { OrderState } from '@/modules/orders/orderTrackingStore';
import { cn } from '@/lib/utils';

interface OrderTimelineProps {
  currentStatus: OrderState;
}

const STEPS: { id: OrderState; label: string; icon: any }[] = [
  { id: 'ORDER_CREATED', label: 'Placed', icon: Package },
  { id: 'PAYMENT_CONFIRMED', label: 'Escrow', icon: ShieldCheck },
  { id: 'PACKING', label: 'Packing', icon: Box },
  { id: 'PICKED_UP', label: 'Shipped', icon: Truck },
  { id: 'OUT_FOR_DELIVERY', label: 'Courier', icon: UserCheck },
  { id: 'DELIVERED', label: 'Delivered', icon: Home },
];

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ currentStatus }) => {
  const currentIndex = STEPS.findIndex(s => s.id === currentStatus);
  const effectiveIndex = currentIndex === -1 ? 
    (currentStatus === 'READY_FOR_PICKUP' ? 2.5 : 
     currentStatus === 'IN_TRANSIT' ? 3.5 : 
     currentStatus === 'COMPLETED' ? 5.5 : 0) : currentIndex;

  return (
    <div className="w-full select-none overflow-hidden">
      {/* Desktop Horizontal View */}
      <div className="hidden md:flex items-center justify-between relative px-6 py-10">
        {/* Background Bar */}
        <div className="absolute top-1/2 left-8 right-8 h-1 bg-white/5 -translate-y-[22px] z-0 rounded-full" />
        
        {/* Animated Progress Bar */}
        <motion.div 
          className="absolute top-1/2 left-8 h-1 bg-gradient-to-r from-cyan-500 to-cyan-400 -translate-y-[22px] z-0 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.3)]"
          initial={{ width: 0 }}
          animate={{ width: `calc(${Math.min((effectiveIndex / (STEPS.length - 1)) * 100, 100)}% - 16px)` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {STEPS.map((step, idx) => {
          const isCompleted = idx <= effectiveIndex;
          const isActive = idx === Math.floor(effectiveIndex);
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center group">
              <motion.div 
                initial={false}
                animate={{ 
                  scale: isActive ? 1.2 : 1,
                  backgroundColor: isCompleted ? 'rgba(6, 182, 212, 0.1)' : 'rgba(15, 23, 42, 1)',
                  borderColor: isCompleted ? 'rgb(34, 211, 238)' : 'rgba(255, 255, 255, 0.05)'
                }}
                className={cn(
                  "w-11 h-11 rounded-2xl flex items-center justify-center border-2 transition-all duration-500",
                  isCompleted && "shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                )}
              >
                {isCompleted && !isActive && idx < effectiveIndex ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><Check className="w-5 h-5 text-cyan-400" /></motion.div>
                ) : (
                    <Icon className={cn("w-5 h-5 transition-colors", isCompleted ? "text-cyan-400" : "text-zinc-600", isActive && "animate-pulse")} />
                )}
              </motion.div>
              <div className="h-6 mt-3 flex flex-col items-center">
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-widest transition-colors duration-500",
                  isCompleted ? "text-cyan-400" : "text-zinc-600"
                )}>
                  {step.label}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="active-dot"
                    className="w-1 h-1 bg-cyan-400 rounded-full mt-1"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Vertical View */}
      <div className="flex md:hidden flex-col gap-8 py-6 px-2">
         {STEPS.map((step, idx) => {
          const isCompleted = idx <= effectiveIndex;
          const isActive = idx === Math.floor(effectiveIndex);
          const Icon = step.icon;

          return (
            <motion.div 
              key={step.id} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex gap-5 items-start relative"
            >
              {/* Connector line */}
              {idx < STEPS.length - 1 && (
                <div className="absolute left-[21px] top-11 w-0.5 h-8 z-0 bg-white/5">
                   <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: idx < effectiveIndex ? '100%' : '0' }}
                    className="w-full bg-cyan-400/50"
                    transition={{ duration: 0.5, delay: idx * 0.2 }}
                   />
                </div>
              )}
              
              <div 
                className={cn(
                  "w-11 h-11 rounded-2xl flex items-center justify-center border-2 shrink-0 z-10 transition-all duration-500",
                  isCompleted 
                    ? "bg-cyan-500/10 border-cyan-400 text-cyan-400 shadow-lg shadow-cyan-500/5" 
                    : "bg-[#0f172a] border-white/5 text-zinc-700"
                )}
              >
                 {isCompleted && !isActive && idx < effectiveIndex ? (
                    <Check className="w-5 h-5" />
                ) : (
                    <Icon className={cn("w-5 h-5", isActive && "animate-pulse")} />
                )}
              </div>

              <div className="pt-1 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={cn("text-xs font-black uppercase tracking-tight", isCompleted ? "text-white" : "text-zinc-600")}>
                      {step.label}
                  </h4>
                  {isCompleted && <span className="text-[8px] font-black text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">Done</span>}
                </div>
                {isActive && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[10px] text-zinc-500 font-bold mt-1.5 uppercase leading-none tracking-tighter"
                    >
                      Currently: <span className="text-cyan-400">{currentStatus.replace(/_/g, ' ')}</span>
                    </motion.p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
