import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, ArrowLeft, ShieldCheck, ShoppingBag, 
  PartyPopper, Home, ListTodo, Coins, Info, Lock, 
  Sparkles, Calendar, Clock, MapPin, Truck, HelpCircle, FileText, Check
} from 'lucide-react';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import { useCartStore } from '@/modules/cart';
import { useWalletStore } from '@/modules/wallet';
import { cn } from '@/lib/utils';
import { CheckoutStepper, UniversalCheckoutType } from '@/features/checkout/components/CheckoutStepper';
import { confirmOrderService, OrderConfirmationPayload } from '@/app/services/confirmOrderService';
import { formatBDT } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useOrderTrackingStore, Order as StoreOrder } from '@/modules/orders/orderTrackingStore';
import { useLanguage } from '@/features/language/LanguageContext';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isBn } = useLanguage();
  const [searchParams] = useSearchParams();

  // 1. DYNAMIC TYPE DETECTION
  // Can be passed via react-router state or query parameters (?type=wholesale, etc.)
  const checkoutType: UniversalCheckoutType = (
    location.state?.checkoutType || 
    searchParams.get('type') || 
    'retail'
  ) as UniversalCheckoutType;

  // 2. DYNAMIC ITEM INGESTION
  // If items are passed in state (e.g. from service booking, logistics booking, demand offer, direct buy now),
  // we bypass the shopping cart store and check out those items directly!
  const cartStore = useCartStore();
  
  const customItems = location.state?.items;
  const customSubtotal = location.state?.subtotal;
  const discount = location.state?.discount || 0;

  const items = customItems || cartStore.items;
  const subtotal = customSubtotal || (customItems ? customItems.reduce((acc: number, cur: any) => acc + (cur.price * (cur.quantity || 1)), 0) : cartStore.getTotalPrice());

  const [isSuccess, setIsSuccess] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState<{
    orderId: string;
    cashbackCoinsCount: number;
    total: number;
    address: string;
    paymentMethod: string;
    deliveryMethod: string;
    doubleAddresses?: { pickup: string; drop: string };
  } | null>(null);

  // standard BDT VAT is 5% as per AGENTS.md rule
  const vatAmount = Math.round(subtotal * 0.05);
  // Delivery/Logistics Base Freight
  const deliveryFee = subtotal > 15000 ? 0 : 80;

  // Early exit check
  if (items.length === 0 && !isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] gap-6 text-white text-center p-6">
        <div className="w-20 h-20 bg-cyan-950/20 border border-cyan-500/10 rounded-full flex items-center justify-center text-cyan-400 select-none">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight mb-2">
            {isBn ? "চেকআউট করার জন্য কোনো আইটেম নেই" : "No Sourcing Items for Checkout"}
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-sm leading-relaxed">
            {isBn 
              ? "চেকআউট সম্পূর্ণ করার জন্য দয়া করে কার্টে প্রোডাক্ট যোগ করুন অথবা কোনো সার্ভিস সিলেক্ট করুন।" 
              : "Please add products to your Cart or select a Service/Booking before accessing the checkout settlement terminal."}
          </p>
        </div>
        <Link to="/marketplace">
          <Button className="h-11 px-6 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-black text-xs font-bold uppercase tracking-wider cursor-pointer">
            {isBn ? "মার্কেটপ্লেসে ফিরে যান" : "Return to Marketplace"}
          </Button>
        </Link>
      </div>
    );
  }

  // Handle final secure escrow order placement
  const handleOrderCompleted = async (stepDetails: {
    address: string;
    delivery: string;
    payment: string;
    total: number;
    doubleAddresses?: { pickup: string; drop: string };
  }) => {
    const payload: OrderConfirmationPayload = {
      items,
      address: stepDetails.address,
      deliveryMethod: stepDetails.delivery,
      paymentMethod: stepDetails.payment,
      subtotal,
      deliveryFee,
      vatAmount,
      couponDiscount: (subtotal + vatAmount + deliveryFee) - stepDetails.total,
      total: stepDetails.total
    };

    try {
      const response = await confirmOrderService.confirmOrder(payload);
      if (response.success) {
        // Map activities and state timeline
        const storeStatus: any = 'ORDER_CREATED';

        const newStoreOrder: StoreOrder = {
          id: response.orderId,
          orderNo: response.orderId,
          total: stepDetails.total,
          items: items.map((itm: any) => ({
            id: itm.id,
            productTitle: itm.name,
            productImage: itm.image,
            vendorName: (itm as any).supplier || (itm as any).vendorName || "Verified Wholesaler Partner",
            unitPrice: itm.price,
            quantity: itm.quantity || 1,
            lineTotal: itm.price * (itm.quantity || 1)
          })),
          status: storeStatus,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          address: stepDetails.address,
          deliveryMethod: stepDetails.delivery,
          paymentMethod: stepDetails.payment,
          activities: [
            {
              status: storeStatus,
              timestamp: new Date().toISOString(),
              source: 'system',
              description: `Escrow secured via ${stepDetails.payment}. Sourcing dispatched.`
            }
          ],
          escrowStatus: {
            lockedAmount: stepDetails.total,
            releaseCondition: 'Delivered and inspected by buyer/warehouse crew',
            isReleased: false,
            refundEligible: true
          }
        };

        // Save order into global order store
        useOrderTrackingStore.getState().addOrder(newStoreOrder);

        // Deduct wallet balance if user co-paid via Wallet
        if (stepDetails.payment.includes('Wallet')) {
          const { balance: walletBalance, updateBalance } = useWalletStore.getState();
          const walletDeduct = Math.min(stepDetails.total, walletBalance);
          if (walletDeduct > 0) {
            updateBalance(walletDeduct, 'debit');
          }
        }

        setPlacedOrderDetails({
          orderId: response.orderId,
          cashbackCoinsCount: response.cashbackCoinsCount || Math.round(stepDetails.total * 0.01),
          total: stepDetails.total,
          address: stepDetails.address,
          paymentMethod: stepDetails.payment,
          deliveryMethod: stepDetails.delivery,
          doubleAddresses: stepDetails.doubleAddresses
        });

        setIsSuccess(true);
        // Clear shopping cart ONLY if checking out cart items (not direct custom single booking)
        if (!customItems) {
          cartStore.clearCart();
        }
        toast.success(isBn ? "অর্ডার এসক্রো হ্যান্ডশেক সম্পন্ন!" : "Order payment locked into secure Paikar escrow!");
      }
    } catch (error) {
      console.error(error);
      toast.error(isBn ? "কানেকশন ফেইল হয়েছে, পুনরায় চেষ্টা করুন" : "Handshake ledger request failed. Retrying...");
    }
  };

  // Timeline translation data based on checkout type
  const getTimelineSteps = () => {
    if (checkoutType === 'service') {
      return [
        { label: 'Booked', bn: 'বুকড', desc: 'Sourcing requested', active: true },
        { label: 'Confirmed', bn: 'কনফার্মড', desc: 'Expert allocated', active: true },
        { label: 'In Progress', bn: 'চলমান', desc: 'Operating at site', active: false },
        { label: 'Completed', bn: 'সম্পন্ন', desc: 'Checklist matched', active: false }
      ];
    }
    if (['courier', 'truck', 'rent_car'].includes(checkoutType)) {
      return [
        { label: 'Assigned', bn: 'চালক নিয়োজিত', desc: 'Pilot assigned', active: true },
        { label: 'Picked Up', bn: 'সংগৃহীত', desc: 'Cargo loaded', active: true },
        { label: 'Transit', bn: 'পরিবহন চলছে', desc: 'Route gateway active', active: false },
        { label: 'Delivered', bn: 'ডেলিভারি', desc: 'Inspection verified', active: false }
      ];
    }
    if (checkoutType === 'wholesale') {
      return [
        { label: 'RFQ Locked', bn: 'আরএফকিউ লক', desc: 'Contract registered', active: true },
        { label: 'Quote Approved', bn: 'কোটেশন মঞ্জুর', desc: 'Trade terms set', active: true },
        { label: 'Production', bn: 'উৎপাদন চলছে', desc: 'Factory line active', active: false },
        { label: 'Cargo Shipped', bn: 'কার্গো শিপড', desc: 'Transit dispatched', active: false },
        { label: 'Delivered', bn: 'ডেলিভারি', desc: 'Escrow released', active: false }
      ];
    }
    // Default Retail / Food / Digital
    return [
      { label: 'Locked', bn: 'লকড', desc: 'Escrow secured', active: true },
      { label: 'Confirmed', bn: 'কনফার্মড', desc: 'Ledger cleared', active: true },
      { label: 'Packed', bn: 'প্যাকড', desc: 'Vendor packaging', active: false },
      { label: 'Shipped', bn: 'শিপড', desc: 'Assigned to courier', active: false },
      { label: 'Delivered', bn: 'ডেলিভারি', desc: 'Fund released', active: false }
    ];
  };

  // DONE PAGE SUCCESS SCREEN
  if (isSuccess && placedOrderDetails) {
    const timeline = getTimelineSteps();
    
    return (
      <div className="min-h-[90vh] bg-[#03060d] flex items-center justify-center px-4 py-12 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-2xl p-8 rounded-[2rem] bg-[#0b101d] border border-cyan-400/20 flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
        >
          {/* Top aesthetic gradient header bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-cyan-400 to-teal-500" />
          
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-20 h-20 bg-cyan-400/10 rounded-3xl border border-cyan-400/20 flex items-center justify-center mb-6 text-cyan-400"
          >
            <CheckCircle2 className="w-11 h-11" />
          </motion.div>

          <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-[0.2em] bg-cyan-400/5 border border-cyan-400/15 px-3 py-1 rounded-full mb-3 flex items-center gap-1.5">
            <PartyPopper className="w-3.5 h-3.5 shrink-0" /> {isBn ? "এসক্রো পেমেন্ট সিকিউরড!" : "Ecosystem Escrow Secured"}
          </span>
          
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-2">
            {isBn ? "অর্ডার সফলভাবে সম্পন্ন!" : "Handshake Secured Successfully!"}
          </h2>
          <p className="text-zinc-400 text-xs max-w-md leading-relaxed mb-6">
            {isBn 
              ? "আপনার সিকিউরড পেমেন্টটি এসক্রো ব্যালেন্সে লক করা হয়েছে। পণ্য/সার্ভিস বুঝে পেয়ে সঠিকতা নিশ্চিত করার সাথে সাথে বিক্রেতার অ্যাকাউন্টে ফান্ড রিলিজ করা হবে।"
              : "Your trade value has been logged on the Paikar ledger. Funds are locked in escrow and will be released to the vendor only after physical inspection."}
          </p>

          {/* Receipt specifications block */}
          <div className="w-full p-5 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-3.5 text-left mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3.5 border-b border-white/5">
              <div>
                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Sourcing Ledger ID</span>
                <p className="font-mono text-zinc-100 font-extrabold text-xs mt-0.5">{placedOrderDetails.orderId}</p>
              </div>
              <div>
                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Final Settle Amount</span>
                <p className="font-mono text-cyan-400 font-black text-xs mt-0.5">{formatBDT(placedOrderDetails.total)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block">Address Consignee Details</span>
              {placedOrderDetails.doubleAddresses ? (
                <div className="space-y-1 text-xs">
                  <p className="text-zinc-400 font-semibold"><span className="text-[8px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 mr-1.5 font-bold">PICKUP</span>{placedOrderDetails.doubleAddresses.pickup}</p>
                  <p className="text-zinc-400 font-semibold"><span className="text-[8px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 mr-1.5 font-bold">DROP</span>{placedOrderDetails.doubleAddresses.drop}</p>
                </div>
              ) : (
                <p className="text-zinc-300 text-xs font-semibold leading-relaxed">{placedOrderDetails.address}</p>
              )}
            </div>

            {placedOrderDetails.cashbackCoinsCount > 0 && (
              <div className="flex justify-between items-center text-xs border-t border-white/5 pt-3">
                <span className="text-zinc-400 font-bold uppercase flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" /> {isBn ? "লয়্যালটি ক্যাশব্যাক রিওয়ার্ড" : "Loyalty Cashback Reward"}
                </span>
                <span className="font-bold text-amber-400">+{placedOrderDetails.cashbackCoinsCount} Coins</span>
              </div>
            )}
          </div>

          {/* DYNAMIC UNIVERSAL TRACKING TIMELINE */}
          <div className="w-full mb-8 text-left">
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-4 text-center">
              {isBn ? "লাইভ ট্র্যাকিং টাইমলাইন" : "Live Escrow Pipeline Timeline"}
            </span>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4">
              {timeline.map((item, idx) => (
                <div key={item.label} className="flex flex-row sm:flex-col items-center gap-3 flex-1 relative w-full">
                  <div className="flex items-center">
                    <div className={cn(
                      "w-6.5 h-6.5 rounded-lg border flex items-center justify-center font-bold text-[10px]",
                      item.active 
                        ? "bg-cyan-400/10 border-cyan-400/40 text-cyan-400 shadow-[0_0_10px_rgba(0,230,118,0.1)]" 
                        : "bg-zinc-900 border-white/5 text-zinc-600"
                    )}>
                      {item.active ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                    </div>
                  </div>
                  
                  <div className="text-left sm:text-center">
                    <p className={cn(
                      "text-[10px] font-black uppercase tracking-wider",
                      item.active ? "text-zinc-100" : "text-zinc-600"
                    )}>
                      {isBn ? item.bn : item.label}
                    </p>
                    <p className="text-[8.5px] text-zinc-500 font-medium leading-none mt-0.5">{item.desc}</p>
                  </div>

                  {idx < timeline.length - 1 && (
                    <div className="hidden sm:block absolute left-1/2 right-[-50%] top-3.5 h-[1px] bg-zinc-800 -z-10" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Navigation CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 w-full shrink-0">
            <Button
              onClick={() => navigate('/')}
              className="flex-1 h-12 rounded-xl bg-zinc-900 border border-white/5 hover:bg-white/5 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Home className="w-4 h-4" /> {isBn ? "হোম পেজে যান" : "Go to Feed"}
            </Button>
            <Button
              onClick={() => navigate('/orders')}
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-500 hover:to-teal-500 text-black text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/10"
            >
              <ListTodo className="w-4 h-4" /> {isBn ? "অর্ডার ট্র্যাক করুন" : "Track Order"}
            </Button>
          </div>

        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white bg-[#03060d] font-sans pb-16">
      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 py-6">
        
        {/* Navigation Breadcrumb headers */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5 select-none">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="p-2.5 bg-zinc-900/60 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-all border border-white/5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="text-left">
              <h1 className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-extrabold">
                {isBn ? "পাইকারমার্ট ইউনিভার্সাল চেকআউট ইঞ্জিন" : "PaikarMart Universal Checkout Engine"}
              </h1>
              <span className="text-base sm:text-lg font-black tracking-tight uppercase text-zinc-100">
                {checkoutType === 'wholesale' ? (isBn ? "পাইকারি অর্ডার সেটেলমেন্ট" : "Wholesale Consignment Settle") :
                 checkoutType === 'food' ? (isBn ? "ফুড অর্ডার চেকআউট" : "Express Food Delivery Checkout") :
                 checkoutType === 'service' ? (isBn ? "সার্ভিস বুকিং সেটেলমেন্ট" : "Service Booking Settle") :
                 checkoutType === 'courier' ? (isBn ? "কুরিয়ার বুকিং পোর্টাল" : "Parcel Courier Sourcing Settle") :
                 checkoutType === 'truck' ? (isBn ? "ট্রাক বুকিং এবং পরিবহন" : "Cargo Truck Logistics Settle") :
                 checkoutType === 'rent_car' ? (isBn ? "কার রেন্টাল বুকিং" : "Premium Rental Settle") :
                 checkoutType === 'digital' ? (isBn ? "ডিজিটাল প্রোডাক্ট চেকআউট" : "Digital License Settlement") :
                 checkoutType === 'deal' ? (isBn ? "ডিমান্ড অফার ডিল ক্লোজিং" : "Demand Offer Bilateral Closing") :
                 (isBn ? "চেকআউট সেটেলমেন্ট পোর্টাল" : "E-Commerce Checkout Settlement")}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> {isBn ? "নিরাপদ টার্মিনাল" : "SECURED TERMINAL"}
          </div>
        </div>

        {/* 2-Column Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Universal Stepper (8 columns) */}
          <div className="lg:col-span-8">
            <CheckoutStepper
              items={items}
              subtotal={subtotal}
              discount={discount}
              checkoutType={checkoutType}
              onOrderCompleted={handleOrderCompleted}
            />
          </div>

          {/* RIGHT: Sourcing recap block (4 columns) */}
          <div className="lg:col-span-4 lg:sticky lg:top-[120px] bg-[#0c101c]/60 border border-white/5 p-6 rounded-[2rem] flex flex-col gap-5 select-none text-left">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-xs uppercase tracking-wider text-zinc-400 font-extrabold">
                {isBn ? "অর্ডার সামারি" : "Sourcing Summary"}
              </h3>
              <span className="text-xs font-mono font-black text-cyan-400">
                {items.length} {isBn ? "আইটেম" : "lots"}
              </span>
            </div>

            {/* Ingested Sourcing items list */}
            <div className="flex flex-col gap-3.5 max-h-[220px] overflow-y-auto pr-1 no-scrollbar border-b border-white/5 pb-4">
              {items.map((itm: any) => (
                <div key={itm.id} className="flex gap-3 items-center">
                  <div className="w-[50px] h-[50px] rounded-lg border border-white/5 bg-black/40 overflow-hidden shrink-0 flex items-center justify-center">
                    <img src={itm.image} alt={itm.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-zinc-100 truncate leading-tight">{itm.name}</h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5 font-mono leading-none">
                      {itm.quantity ?? 1} pcs × {formatBDT(itm.price)}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-400 shrink-0 whitespace-nowrap">
                    {formatBDT(itm.price * (itm.quantity ?? 1))}
                  </span>
                </div>
              ))}
            </div>

            {/* Settle metrics */}
            <div className="flex flex-col gap-2 text-xs font-medium text-zinc-400 pb-1">
              <div className="flex justify-between">
                <span>{isBn ? "প্রোডাক্ট সাবটোটাল" : "Base subtotal"}</span>
                <span className="font-mono text-zinc-100 font-semibold">{formatBDT(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>{isBn ? "৫% ভ্যাট (BD VAT)" : "5% Central BD VAT"}</span>
                <span className="font-mono text-zinc-100 font-semibold">+{formatBDT(vatAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>{isBn ? "লজিস্টিকস ভাড়া" : "Estimated logistics cargo"}</span>
                <span className="font-mono text-zinc-100 font-semibold">
                  {checkoutType === 'digital' ? "FREE Email Dispatch" : formatBDT(deliveryFee)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-rose-500 font-bold">
                  <span>{isBn ? "ডিসকাউন্ট" : "Wholesale discount"}</span>
                  <span className="font-mono">-{formatBDT(discount)}</span>
                </div>
              )}
            </div>

            <div className="p-4 bg-cyan-400/5 rounded-2xl border border-cyan-400/20 flex gap-2.5 text-[10px] text-cyan-400 font-semibold leading-relaxed">
              <Lock className="w-4.5 h-4.5 shrink-0 text-cyan-400" />
              <p>{isBn ? "আপনার সিকিউরড পেমেন্টটি এসক্রো ব্যালেন্স হিসেবে থাকবে। কোনো প্রকার অমিল বা ডেমেজ থাকলে ৭ দিনের মধ্যে রিপ্লেসমেন্ট এর জন্য আবেদন করুন।" : "Transactions inside PaikarMart conform to automated escrow rules. Settle with confidence."}</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
