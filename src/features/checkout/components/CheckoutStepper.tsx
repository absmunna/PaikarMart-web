import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, CreditCard, MapPin, Truck, ShieldCheck, ChevronRight, 
  ShoppingBag, Globe, AlertCircle, Plus, Trash2, Edit2, Sparkles, 
  Clock, Calendar, DollarSign, Navigation, FileText, CheckCircle2, 
  Wallet, ChevronDown, Landmark, Map, Zap, Plane, Package, Car, Bike
} from 'lucide-react';
import { formatBDT } from '@/lib/format';
import { useLanguage } from "@/features/language/LanguageContext";
import { BDAddressSelector, AddressDetails } from '@/components/common/BDAddressSelector';
import { useAddressStore, SavedAddress } from '@/modules/profile';
import { useWalletStore } from '@/modules/wallet';
import { cn } from "@/lib/utils";
import { toast } from 'sonner';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category?: string;
}

export type UniversalCheckoutType = 
  | 'retail' 
  | 'wholesale' 
  | 'digital' 
  | 'service' 
  | 'food' 
  | 'courier' 
  | 'truck' 
  | 'rent_car' 
  | 'deal';

interface CheckoutStepperProps {
  items: CartItem[];
  subtotal: number;
  discount: number;
  checkoutType?: UniversalCheckoutType;
  onOrderCompleted: (details: { address: string; delivery: string; payment: string; total: number; doubleAddresses?: { pickup: string; drop: string } }) => Promise<void>;
}

// Preset saved addresses are now managed via useAddressStore

export const CheckoutStepper = ({ 
  items, 
  subtotal, 
  discount, 
  checkoutType = 'retail',
  onOrderCompleted 
}: CheckoutStepperProps) => {
  const { isBn } = useLanguage();
  const [step, setStep] = useState(0);

  // Address Book from unified store
  const { addresses: savedAddresses, addAddress } = useAddressStore();
  const [selectedAddrId, setSelectedAddrId] = useState<string>(savedAddresses[0]?.id || '');
  const [selectedDropAddrId, setSelectedDropAddrId] = useState<string>(savedAddresses[1]?.id || savedAddresses[0]?.id || ''); // for courier, rent_car, truck
  
  // Custom Address Form Visibility & State
  const [showAddForm, setShowAddForm] = useState(false);
  const [formType, setFormType] = useState<'primary' | 'drop'>('primary'); // which address slot to add to
  const [customAddressDetails, setCustomAddressDetails] = useState<AddressDetails | null>(null);
  const [isCustomAddressValid, setIsCustomAddressValid] = useState(false);
  
  // Custom address fields not covered by BDAddressSelector
  const [road, setRoad] = useState('');
  const [house, setHouse] = useState('');
  const [landmark, setLandmark] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [mapPin, setMapPin] = useState('23.7808° N, 90.4193° E'); // Default Dhaka coordinate

  // Scheduling states (for Service, Logistics, Rental)
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>('morning'); // morning, noon, afternoon, evening
  const [recurringCycle, setRecurringCycle] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
  const [stops, setStops] = useState<{ id: string; location: string }[]>([
    { id: 'stop-1', location: 'Stop A: Kawran Bazar Office' }
  ]);

  // Delivery & payment states
  const [delivery, setDelivery] = useState('standard');
  const [payment, setPayment] = useState('cash');
  const [walletToggle, setWalletToggle] = useState(false);

  // Get Wallet balance
  const { balance: walletBalance, updateBalance } = useWalletStore();

  const isB2B = checkoutType === 'wholesale' || checkoutType === 'truck' || checkoutType === 'deal';

  // Step names translation mapping
  const steps = [
    { id: 'address', label: 'Address Sourcing', bn: 'ঠিকানা নির্ধারণ', icon: MapPin },
    { id: 'delivery', label: 'Delivery & Method', bn: 'সার্ভিস ও পদ্ধতি', icon: Truck },
    { id: 'payment', label: 'Billing Payment', bn: 'বিলিং ও পেমেন্ট', icon: CreditCard },
    { id: 'review', label: 'Ecosystem Review', bn: 'রিভিউ ও কনফার্ম', icon: ShieldCheck },
  ];

  // Dynamic label based on checkoutType
  const getAddressHeaderLabel = () => {
    switch (checkoutType) {
      case 'service':
        return isBn ? "সার্ভিস গ্রহণের ঠিকানা (Service Location)" : "Service Location Address";
      case 'courier':
        return isBn ? "পার্সেল পিকআপ ও ড্রপ ঠিকানা" : "Courier Pickup & Drop Addresses";
      case 'truck':
        return isBn ? "মালপত্র লোডিং ও আনলোডিং পয়েন্ট" : "Truck Loading & Unloading Points";
      case 'rent_car':
        return isBn ? "গাড়ি পিকআপ ও ড্রপ লোকেশন" : "Rental Car Pickup & Drop Locations";
      case 'wholesale':
        return isBn ? "কন্সাইনমেন্ট ডেলিভারি বা ওয়্যারহাউজ" : "Consignment Delivery & Sourcing Address";
      default:
        return isBn ? "ডেলিভারি ঠিকানা (Delivery Address)" : "Delivery & Shipping Address";
    }
  };

  // Dynamic Delivery / Sourcing Methods
  const getDeliveryOptions = () => {
    switch (checkoutType) {
      case 'food':
        return [
          { id: 'standard', name: 'Standard Food Delivery', bn: 'সাধারণ ফুড ডেলিভারি', cost: 40, eta: '30-40 Mins', desc: 'Secure temperature-controlled delivery directly from the kitchen.' },
          { id: 'priority', name: 'Rocket Priority Delivery', bn: 'রকেট এক্সপ্রেস ফুড ডেলিভারি', cost: 80, eta: '15-25 Mins', desc: 'Direct fast-lane dispatch with dedicated rider allocation.' }
        ];
      case 'service':
        return [
          { id: 'schedule', name: 'Scheduled Expert Slot', bn: 'নির্ধারিত সময়ে সার্ভিস', cost: 100, eta: 'Chosen Date', desc: 'Verified technician arrives exactly during your selected time window.' },
          { id: 'express_service', name: 'Urgent Dispatch (under 2 hours)', bn: 'জরুরী সার্ভিস (২ ঘণ্টার মধ্যে)', cost: 250, eta: 'Within 2 Hours', desc: 'Priority on-demand emergency service deployment.' }
        ];
      case 'digital':
        return [
          { id: 'instant', name: 'Instant Email Dispatch', bn: 'ইনস্ট্যান্ট ইমেইল ডেলিভারি', cost: 0, eta: 'Within 5 mins', desc: 'Automated workspace codes and license keys delivered to your inbox.' },
          { id: 'cloud_transfer', name: 'Direct Cloud Server Setup', bn: 'সার্ভার ডিপ্লয়মেন্ট অ্যাসিস্ট্যান্স', cost: 200, eta: 'Same Day', desc: 'Expert support setup assistance and automated code provisioning.' }
        ];
      case 'courier':
        return [
          { id: 'bike', name: 'Motorbike Parcel Dispatch', bn: 'মোটরসাইকেল কুরিয়ার', cost: 60, eta: 'Same Day', desc: 'Perfect for document envelopes and light parcels up to 5kg.' },
          { id: 'car', name: 'Private Sedan Delivery', bn: 'প্রাইভেট কার কুরিয়ার', cost: 200, eta: 'Same Day', desc: 'Ideal for fragile electronics, cakes, or larger cartons up to 30kg.' },
          { id: 'express_courier', name: 'Nationwide Courier Hub', bn: 'সারাদেশে এক্সপ্রেস কুরিয়ার', cost: 130, eta: '24-48 Hours', desc: 'Inter-district shipping across corporate hub lines.' }
        ];
      case 'truck':
        return [
          { id: 'pickup_1t', name: '1.5 Ton Open Pickup', bn: '১.৫ টন ওপেন পিকআপ', cost: 1200, eta: 'Scheduled', desc: 'Affordable open truck for wholesale sourcing and furniture moving.' },
          { id: 'covered_3t', name: '3 Ton Covered Van', bn: '৩ টন কাভার্ড ভ্যান', cost: 2500, eta: 'Scheduled', desc: 'Secure, weather-shielded transport for industrial boxes.' },
          { id: 'heavy_5t', name: '5 Ton Heavy Truck', bn: '৫ টন হেভি ট্রাক', cost: 4500, eta: 'Scheduled', desc: 'Heavy-duty cargo transportation across inter-district hubs.' }
        ];
      case 'rent_car':
        return [
          { id: 'sedan_chauffeur', name: 'Sedan with Chauffeur', bn: 'ড্রাইভারসহ প্রিমিয়াম সেডান', cost: 3000, eta: 'Daily Rent', desc: 'Fully air-conditioned luxury sedan with verified professional pilot.' },
          { id: 'microbus_11', name: '11-Seater HiAce Microbus', bn: '১১ সিটের হাইএস মাইক্রোবাস', cost: 5000, eta: 'Daily Rent', desc: 'Spacious vehicle perfect for corporate retreats, family trips, or crew transportation.' }
        ];
      case 'wholesale':
        return [
          { id: 'standard_bulk', name: 'Bulk Cargo Transport', bn: 'বাল্ক কার্গো ট্রান্সপোর্ট', cost: 450, eta: '3-5 Days', desc: 'Consolidated commercial cargo shipping for heavy B2B volumes.' },
          { id: 'priority_cargo', name: 'Express Sourcing Logistics', bn: 'এক্সপ্রেস সোর্সিং লজিস্টিকস', cost: 900, eta: '24-48 Hours', desc: 'Fast-track priority warehouse dispatch and direct shipping.' },
          { id: 'self_pickup', name: 'Self Warehouse Sourcing', bn: 'নিজ দায়িত্বে সংগ্রহ (Gazipur)', cost: 0, eta: 'Instant Ready', desc: 'Collect directly from central mill warehouse with zero logistics charges.' }
        ];
      case 'deal':
        return [
          { id: 'standard_deal', name: 'Direct Settle Ship', bn: 'সরাসরি কন্টাক্ট ডেলিভারি', cost: 100, eta: 'As Per Agreement', desc: 'Items shipped according to the bilateral demand-offer deal stipulations.' }
        ];
      default: // retail
        return [
          { id: 'standard', name: 'Standard Home Delivery', bn: 'হোম ডেলিভারি', cost: 60, eta: '3-5 Days', desc: 'Secure home delivery to any division across Bangladesh.' },
          { id: 'express', name: 'Super Express Delivery', bn: 'সুপার এক্সপ্রেস ডেলিভারি', cost: 120, eta: '1-2 Days', desc: 'Fastest priority shipping with real-time tracking.' },
          { id: 'self_pickup', name: 'Warehouse Sourcing Pickup', bn: 'নিজ দায়িত্বে সংগ্রহ', cost: 0, eta: 'Instant Ready', desc: 'Collect directly from your nearest PaikarMart vendor outlet.' }
        ];
    }
  };

  const deliveryOptions = getDeliveryOptions();
  const activeDelivery = deliveryOptions.find(o => o.id === delivery) || deliveryOptions[0];

  // Automated pricing
  const subtotalWithVat = subtotal + Math.round(subtotal * 0.05);
  const finalDeliveryCost = activeDelivery ? activeDelivery.cost : 0;
  let totalPayable = subtotalWithVat - discount + finalDeliveryCost;
  if (walletToggle) {
    totalPayable = Math.max(0, totalPayable - walletBalance);
  }

  // Address lookup helper
  const getAddressString = (id: string) => {
    const addr = savedAddresses.find(a => a.id === id);
    if (!addr) return 'Custom Input Address';
    return `${addr.fullName} | Phone: ${addr.phone} | ${addr.area}, Upazila: ${addr.upazila}, District: ${addr.district}, Division: ${addr.division} [ZIP: ${addr.zipCode}] (Landmark: ${addr.landmark || 'None'})`;
  };

  // Add standard stops helper
  const addStop = () => {
    const newId = `stop-${stops.length + 1}`;
    const stopName = `Stop ${String.fromCharCode(65 + stops.length)}: New Location Point`;
    setStops([...stops, { id: newId, location: stopName }]);
    toast.success(isBn ? "নতুন স্টপ যোগ করা হয়েছে!" : "New delivery stop added!");
  };

  const removeStop = (id: string) => {
    setStops(stops.filter(s => s.id !== id));
  };

  // Save new custom address
  const handleSaveAddress = () => {
    if (!customAddressDetails || !isCustomAddressValid) {
      toast.error(isBn ? "দয়া করে সব প্রয়োজনীয় তথ্য পূরণ করুন" : "Please fill in all required cascading fields.");
      return;
    }

    addAddress({
      label: `Custom ${savedAddresses.length + 1}`,
      labelBn: `ঠিকানা ${savedAddresses.length + 1}`,
      fullName: customAddressDetails.fullName,
      phone: customAddressDetails.phone,
      division: customAddressDetails.division,
      district: customAddressDetails.district,
      upazila: customAddressDetails.upazila,
      area: customAddressDetails.area,
      zipCode: customAddressDetails.zipCode,
    });

    // Reset form states
    setShowAddForm(false);
    setRoad('');
    setHouse('');
    setLandmark('');
    setDeliveryNote('');
    toast.success(isBn ? "ঠিকানাটি সংরক্ষিত হয়েছে!" : "New address saved into your Profile book!");
  };

  // Next step navigation handler
  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Complete Order callback with standard format
      const primaryAddress = getAddressString(selectedAddrId);
      const isTwoWay = ['courier', 'truck', 'rent_car'].includes(checkoutType);
      
      const details = {
        address: primaryAddress,
        delivery: activeDelivery.id,
        payment: walletToggle ? `Wallet + ${payment}` : payment,
        total: totalPayable,
        doubleAddresses: isTwoWay ? {
          pickup: primaryAddress,
          drop: getAddressString(selectedDropAddrId)
        } : undefined
      };

      onOrderCompleted(details);
    }
  };

  const isNextDisabled = () => {
    if (step === 0) {
      // Must have valid selected addresses
      if (!selectedAddrId) return true;
      if (['courier', 'truck', 'rent_car'].includes(checkoutType) && !selectedDropAddrId) return true;
    }
    return false;
  };

  return (
    <div className="bg-[#0b101c] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl relative">
      
      {/* Dynamic Upper Accent Bar based on portal type */}
      <div className={cn(
        "h-1.5 w-full",
        checkoutType === 'wholesale' ? "bg-gradient-to-r from-cyan-500 via-cyan-500 to-teal-500" :
        checkoutType === 'food' ? "bg-gradient-to-r from-rose-500 to-orange-500" :
        checkoutType === 'service' ? "bg-gradient-to-r from-violet-500 to-fuchsia-500" :
        "bg-gradient-to-r from-cyan-400 via-cyan-400 to-cyan-400"
      )} />

      {/* 4-Step Progress Indicator */}
      <div className="flex justify-between items-center px-6 sm:px-8 py-5 bg-black/40 border-b border-white/5 select-none overflow-x-auto no-scrollbar">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isActive = i <= step;
          const isCurrent = i === step;
          return (
            <div key={s.id} className="flex items-center gap-2 shrink-0">
              <div className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300",
                isActive 
                  ? 'bg-cyan-400/10 border-cyan-400/30 text-cyan-400 shadow-[0_0_15px_rgba(0,230,118,0.15)]' 
                  : 'bg-zinc-900/60 border-white/5 text-zinc-500'
              , isCurrent && 'ring-2 ring-cyan-400/50 scale-105 bg-black/20')}>
                {i < step ? <Check className="w-4 h-4 stroke-[3]" /> : <Icon className="w-4 h-4" />}
              </div>
              <div className="flex flex-col text-left hidden sm:block">
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-wider",
                  isActive ? 'text-zinc-100 font-bold' : 'text-zinc-500'
                )}>
                  {isBn ? s.bn : s.label}
                </span>
                <span className="text-[7.5px] font-mono text-zinc-600 uppercase">Step 0{i+1}</span>
              </div>
              {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-zinc-800 mx-1 hidden sm:block" />}
            </div>
          );
        })}
      </div>

      {/* Main Form Box */}
      <div className="p-6 sm:p-8 min-h-[360px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* STEP 1: DYNAMIC ADDRESS & LOCATION SYSTEM */}
            {step === 0 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs font-black uppercase tracking-[0.15em] text-zinc-200">
                      {getAddressHeaderLabel()}
                    </h3>
                  </div>
                  
                  {!showAddForm && (
                    <button
                      onClick={() => {
                        setFormType('primary');
                        setShowAddForm(true);
                      }}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {isBn ? "নতুন ঠিকানা যোগ করুন" : "Add New Address"}
                    </button>
                  )}
                </div>

                {showAddForm ? (
                  /* Custom Address Form slide-down */
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-5 rounded-2xl bg-black/40 border border-cyan-400/20 space-y-4 text-left"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                        <Map className="w-4 h-4 text-cyan-400" />
                        {isBn ? `নতুন ঠিকানা (${formType === 'primary' ? 'পিকআপ/মূল' : 'ড্রপ/গন্তব্য'})` : `Add Address (${formType === 'primary' ? 'Primary' : 'Droppoint'})`}
                      </span>
                      <button 
                        onClick={() => setShowAddForm(false)}
                        className="text-[10px] text-zinc-500 hover:text-white uppercase font-bold"
                      >
                        {isBn ? "বাতিল" : "Cancel"}
                      </button>
                    </div>

                    <BDAddressSelector 
                      onChange={(details, isValid) => {
                        setCustomAddressDetails(details);
                        setIsCustomAddressValid(isValid);
                      }}
                    />

                    {/* Extra Location Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div>
                        <label className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">
                          {isBn ? "রাস্তা নম্বর / রোড" : "Road / Street Info"}
                        </label>
                        <input 
                          type="text" 
                          value={road}
                          onChange={(e) => setRoad(e.target.value)}
                          placeholder="e.g. Road 5A" 
                          className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-cyan-400/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">
                          {isBn ? "বাসা / ফ্ল্যাট / ওয়্যারহাউজ নং" : "House / Flat / Building Name"}
                        </label>
                        <input 
                          type="text" 
                          value={house}
                          onChange={(e) => setHouse(e.target.value)}
                          placeholder="e.g. Apartment 3B, Concord Tower" 
                          className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-cyan-400/40"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">
                          {isBn ? "নিকটবর্তী পরিচিত চিহ্ন" : "Landmark / Landmark details"}
                        </label>
                        <input 
                          type="text" 
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                          placeholder="e.g. Near Dhanmondi Lake or Pillar 12" 
                          className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-cyan-400/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">
                          {isBn ? "ডেলিভারি নোট বা বিশেষ নির্দেশ" : "Delivery Note / Sourcing Note"}
                        </label>
                        <input 
                          type="text" 
                          value={deliveryNote}
                          onChange={(e) => setDeliveryNote(e.target.value)}
                          placeholder="e.g. Keep at warehouse gate, call manager first" 
                          className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-cyan-400/40"
                        />
                      </div>
                    </div>

                    {/* Simulated Map Coordinates Selector */}
                    <div className="p-3 bg-black/50 rounded-xl border border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3">
                      <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-bold uppercase">
                        <Navigation className="w-4 h-4 text-cyan-400" />
                        <span>Map GPS Link: </span>
                        <span className="font-mono text-zinc-300 text-[9px]">{mapPin}</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          const lat = (23.7 + Math.random() * 0.1).toFixed(4);
                          const lng = (90.4 + Math.random() * 0.1).toFixed(4);
                          setMapPin(`${lat}° N, ${lng}° E`);
                          toast.success("GPS Location tagged from map pin!");
                        }}
                        className="px-3 py-1.5 bg-cyan-400/10 border border-cyan-400/30 rounded-lg text-[8px] text-cyan-400 font-black uppercase hover:bg-cyan-400/20 transition-all"
                      >
                        {isBn ? "ম্যাপ পিন আপডেট করুন" : "Set Custom Pin"}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveAddress}
                      className="w-full py-3.5 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-500 hover:to-teal-500 text-black text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all shadow-md shadow-cyan-500/10"
                    >
                      {isBn ? "অ্যাড্রেস বুকে সংরক্ষণ করুন" : "Save and Select Address"}
                    </button>
                  </motion.div>
                ) : (
                  /* Normal State: Show address card deck */
                  <div className="space-y-4">
                    
                    {/* Primary Address Deck */}
                    <div className="space-y-2 text-left">
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block">
                        {['courier', 'truck', 'rent_car'].includes(checkoutType) 
                          ? (isBn ? "১. পিকআপ / লোডিং পয়েন্ট" : "1. Pickup / Loading Location")
                          : (isBn ? "শিপিং / ডেলিভারি পয়েন্ট" : "Consignment Destination")}
                      </span>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {savedAddresses.map((addr) => (
                          <button
                            key={addr.id}
                            onClick={() => setSelectedAddrId(addr.id)}
                            className={cn(
                              "p-4 rounded-xl border text-left relative transition-all duration-300 group",
                              selectedAddrId === addr.id 
                                ? "bg-cyan-500/5 border-cyan-400/40 text-white shadow-md shadow-cyan-400/5" 
                                : "bg-black/20 border-white/5 text-zinc-400 hover:border-zinc-800"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <span className={cn(
                                "text-[9px] font-black uppercase px-2 py-0.5 rounded-full border",
                                selectedAddrId === addr.id 
                                  ? "bg-cyan-400/10 border-cyan-400/20 text-cyan-400" 
                                  : "bg-white/5 border-white/5 text-zinc-500"
                              )}>
                                {isBn ? addr.labelBn : addr.label}
                              </span>
                              <span className="text-[9px] font-mono font-bold text-zinc-500">{addr.phone}</span>
                            </div>

                            <p className="text-xs font-black text-zinc-100 mt-2">{addr.fullName}</p>
                            <p className="text-[10px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">{addr.area}, {addr.upazila}, {addr.district}</p>
                            
                            {addr.landmark && (
                              <p className="text-[9px] text-cyan-400/80 font-bold uppercase mt-1">📍 {addr.landmark}</p>
                            )}
                            
                            {selectedAddrId === addr.id && (
                              <div className="absolute right-3 top-3 w-4.5 h-4.5 rounded-full bg-cyan-400 flex items-center justify-center text-black">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Secondary Address Deck (Courier, Rent a Car, Truck) */}
                    {['courier', 'truck', 'rent_car'].includes(checkoutType) && (
                      <div className="space-y-2 pt-3 border-t border-white/5 text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block">
                            {isBn ? "২. ড্রপ-অফ / আনলোডিং পয়েন্ট" : "2. Drop-off / Unloading Destination"}
                          </span>
                          <button
                            onClick={() => {
                              setFormType('drop');
                              setShowAddForm(true);
                            }}
                            className="text-[9px] text-cyan-400 font-extrabold uppercase"
                          >
                            + {isBn ? "নতুন ড্রপ লোকেশন" : "Add Drop Address"}
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {savedAddresses.map((addr) => (
                            <button
                              key={`drop-${addr.id}`}
                              onClick={() => setSelectedDropAddrId(addr.id)}
                              className={cn(
                                "p-4 rounded-xl border text-left relative transition-all duration-300 group",
                                selectedDropAddrId === addr.id 
                                  ? "bg-cyan-500/5 border-cyan-500/40 text-white shadow-md shadow-cyan-500/5" 
                                  : "bg-black/20 border-white/5 text-zinc-400 hover:border-zinc-800"
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <span className={cn(
                                  "text-[9px] font-black uppercase px-2 py-0.5 rounded-full border",
                                  selectedDropAddrId === addr.id 
                                    ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" 
                                    : "bg-white/5 border-white/5 text-zinc-500"
                                )}>
                                  {isBn ? addr.labelBn : addr.label}
                                </span>
                                <span className="text-[9px] font-mono font-bold text-zinc-500">{addr.phone}</span>
                              </div>

                              <p className="text-xs font-black text-zinc-100 mt-2">{addr.fullName}</p>
                              <p className="text-[10px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">{addr.area}, {addr.upazila}, {addr.district}</p>
                              
                              {addr.landmark && (
                                <p className="text-[9px] text-cyan-400/80 font-bold uppercase mt-1">📍 {addr.landmark}</p>
                              )}
                              
                              {selectedDropAddrId === addr.id && (
                                <div className="absolute right-3 top-3 w-4.5 h-4.5 rounded-full bg-cyan-400 flex items-center justify-center text-black">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Logistics Hub: Multi-Stop Add-On */}
                    {['courier', 'truck'].includes(checkoutType) && (
                      <div className="pt-3 border-t border-white/5 text-left space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                            <Navigation className="w-3.5 h-3.5 text-yellow-400" />
                            {isBn ? "মাল্টি-স্টপ ডেলিভারি (ঐচ্ছিক)" : "Multi-Stop Delivery (Optional)"}
                          </span>
                          <button 
                            onClick={addStop}
                            className="px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-[8px] text-yellow-400 font-black uppercase"
                          >
                            + {isBn ? "স্টপ যোগ করুন" : "Add Stop"}
                          </button>
                        </div>
                        
                        {stops.length > 0 && (
                          <div className="space-y-1.5">
                            {stops.map((stop) => (
                              <div key={stop.id} className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                                <span className="text-[10px] font-bold text-zinc-300 font-mono">{stop.location}</span>
                                <button 
                                  onClick={() => removeStop(stop.id)}
                                  className="text-[9px] text-rose-500 uppercase font-bold"
                                >
                                  {isBn ? "মুছে ফেলুন" : "Remove"}
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                )}
              </div>
            )}

            {/* STEP 2: DYNAMIC DELIVERY & SERVICE SOURCING METHODS */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                  <Truck className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-black uppercase tracking-[0.15em] text-zinc-200">
                    {isBn ? "সার্ভিস ও শিডিউল সিলেকশন" : "Service Delivery & Scheduling Options"}
                  </h3>
                </div>

                {/* Scheduling Parameters (for Service, Logistics, Rent Car) */}
                {['service', 'truck', 'rent_car'].includes(checkoutType) && (
                  <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-4 text-left">
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block mb-1">
                      {isBn ? "তারিখ ও সময়সূচী" : "Execution Date & Sourcing Slot"}
                    </span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Date Picker */}
                      <div>
                        <label className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">
                          {isBn ? "তারিখ নির্বাচন করুন" : "Select Specific Date"}
                        </label>
                        <div className="relative">
                          <input 
                            type="date"
                            value={scheduledDate}
                            onChange={(e) => setScheduledDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-cyan-400/40 cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Hour Slots */}
                      <div>
                        <label className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">
                          {isBn ? "পছন্দের সময়" : "Select Service Time Block"}
                        </label>
                        <select
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          className="w-full bg-black/50 border border-white/5 rounded-xl px-4 py-3.5 text-xs text-white outline-none focus:border-cyan-400/40 cursor-pointer"
                        >
                          <option value="morning">{isBn ? "সকাল (০৯:০০ AM - ১২:০০ PM)" : "Morning (09:00 AM - 12:00 PM)"}</option>
                          <option value="noon">{isBn ? "দুপুর (১২:০০ PM - ০৩:০০ PM)" : "Noon (12:00 PM - 03:00 PM)"}</option>
                          <option value="afternoon">{isBn ? "বিকাল (০৩:০০ PM - ০৬:০০ PM)" : "Afternoon (03:00 PM - 06:00 PM)"}</option>
                          <option value="evening">{isBn ? "সন্ধ্যা (০৬:০০ PM - ০৯:০০ PM)" : "Evening (06:00 PM - 09:00 PM)"}</option>
                        </select>
                      </div>
                    </div>

                    {/* B2B Recurring Deliveries Trigger */}
                    {isB2B && (
                      <div className="pt-2">
                        <label className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">
                          {isBn ? "রিকারিং ডেলিভারি সাইকেল (B2B/রুটিন কার্গো)" : "Routine Recurring Sourcing (B2B)"}
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { id: 'none', label: 'One Time', bn: 'একবার' },
                            { id: 'daily', label: 'Daily', bn: 'প্রতিদিন' },
                            { id: 'weekly', label: 'Weekly', bn: 'প্রতি সপ্তাহে' },
                            { id: 'monthly', label: 'Monthly', bn: 'প্রতি মাসে' }
                          ].map((cy) => (
                            <button
                              key={cy.id}
                              type="button"
                              onClick={() => setRecurringCycle(cy.id as any)}
                              className={cn(
                                "py-2.5 rounded-lg border text-[9px] font-black uppercase tracking-wider transition-all",
                                recurringCycle === cy.id 
                                  ? "bg-cyan-500/10 border-cyan-500 text-cyan-400" 
                                  : "bg-black/30 border-white/5 text-zinc-500"
                              )}
                            >
                              {isBn ? cy.bn : cy.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Delivery Option Selection Grid */}
                <div className="grid grid-cols-1 gap-4 text-left">
                  {deliveryOptions.map((option) => (
                    <button 
                      key={option.id}
                      onClick={() => setDelivery(option.id)}
                      className={cn(
                        "p-4 rounded-xl border text-left flex items-start gap-4 transition-all duration-300 relative overflow-hidden group",
                        delivery === option.id 
                          ? "bg-cyan-500/5 border-cyan-400/40 text-white" 
                          : "bg-black/20 border-white/5 text-zinc-400 hover:border-zinc-800"
                      )}
                    >
                      <div className={cn(
                        "p-3 rounded-xl flex items-center justify-center transition-colors",
                        delivery === option.id ? "bg-cyan-400/10 text-cyan-400" : "bg-zinc-900 text-zinc-500"
                      )}>
                        {checkoutType === 'food' ? <Zap className="w-5 h-5 animate-pulse" /> : 
                         checkoutType === 'digital' ? <Globe className="w-5 h-5" /> :
                         checkoutType === 'courier' ? <Package className="w-5 h-5" /> :
                         checkoutType === 'rent_car' ? <Car className="w-5 h-5" /> :
                         checkoutType === 'truck' ? <Truck className="w-5 h-5" /> :
                         <Truck className="w-5 h-5" />}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-black uppercase tracking-tight text-zinc-100">
                            {isBn ? option.bn : option.name}
                          </p>
                          <span className="text-xs font-mono font-black text-cyan-400">
                            {option.cost === 0 ? "FREE" : `৳${option.cost}`}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">ETA: {option.eta}</p>
                        <p className="text-[10px] text-zinc-400 leading-normal mt-1 max-w-md">{option.desc}</p>
                      </div>

                      {delivery === option.id && (
                        <div className="absolute right-3 bottom-3 w-4.5 h-4.5 rounded-full bg-cyan-400 flex items-center justify-center text-black">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: UNIFIED PAYMENT ENGINE */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                  <CreditCard className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-black uppercase tracking-[0.15em] text-zinc-200">
                    {isBn ? "পেমেন্ট গেটওয়ে সেটআপ" : "Centralized Secure Payments Hub"}
                  </h3>
                </div>

                {/* Top Quick Bill details recap */}
                <div className="p-4 bg-black/40 rounded-xl border border-white/5 flex justify-between items-center text-left">
                  <div>
                    <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-500">Secured transaction value</span>
                    <h4 className="text-sm font-black text-zinc-100 uppercase tracking-tight">{isBn ? "মোট প্রদেয় বিল" : "Aggregate Bill Payable"}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-zinc-500 line-through mr-1.5 font-mono">{discount > 0 && `৳${subtotalWithVat + finalDeliveryCost}`}</span>
                    <span className="text-base font-mono font-black text-cyan-400">{formatBDT(totalPayable)}</span>
                  </div>
                </div>

                {/* Single source of truth Wallet toggle section */}
                <div className="p-4 bg-cyan-500/5 rounded-2xl border border-cyan-400/20 flex items-center justify-between text-left select-none">
                  <div className="flex gap-3 items-center">
                    <div className="w-9 h-9 rounded-xl bg-cyan-400/10 flex items-center justify-center text-cyan-400">
                      <Wallet className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white uppercase tracking-tight">{isBn ? "ওয়ালেট ব্যালেন্স ব্যবহার করুন" : "Use PaikarMart Wallet"}</p>
                      <p className="text-[9.5px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">
                        {isBn ? `বর্তমান ব্যালেন্স: ৳${walletBalance}` : `Available Ledger: ${formatBDT(walletBalance)}`}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setWalletToggle(!walletToggle);
                      toast.info(walletToggle ? "Wallet balance bypassed." : "Wallet balance applied to secure settlement!");
                    }}
                    className={cn(
                      "w-12 h-6.5 rounded-full p-0.5 transition-colors focus:outline-none",
                      walletToggle ? "bg-cyan-400" : "bg-zinc-800"
                    )}
                  >
                    <div className={cn(
                      "w-5.5 h-5.5 rounded-full bg-black shadow transition-transform",
                      walletToggle ? "translate-x-5.5" : "translate-x-0"
                    )} />
                  </button>
                </div>

                {/* Normal payment gateway buttons */}
                <div className="grid grid-cols-1 gap-3.5 text-left pt-1">
                  {[
                    { id: 'cash', label: 'Cash on Delivery / Job Settlement', bn: 'ক্যাশ অন ডেলিভারি (COD / ক্যাশ পেমেন্ট)', sub: 'Pay after successful item reception or task inspection.', color: 'border-white/5' },
                    { id: 'bkash', label: 'bKash Settle', bn: 'বিকাশ অনলাইন পেমেন্ট', sub: 'Instant escrow locking with bKash API gateway security.', color: 'border-[#e2136e]/20 hover:border-[#e2136e]/40', logo: 'বিকাশ', logoColor: 'text-[#e2136e]' },
                    { id: 'nagad', label: 'Nagad Mobile Transfer', bn: 'নগদ অনলাইন পেমেন্ট', sub: 'Zero checkout fee direct routing using Nagad business lines.', color: 'border-[#f37021]/20 hover:border-[#f37021]/40', logo: 'নগদ', logoColor: 'text-[#f37021]' },
                    { id: 'card', label: 'Cards / SSLCommerz Secure Hub', bn: 'ডেবিট বা ক্রেডিট কার্ড পেমেন্ট', sub: 'Securely processes Visa, Mastercard, and DBBL Nexus cards.', color: 'border-white/5' },
                    ...(isB2B ? [
                      { id: 'corp_billing', label: 'Corporate Contract Settle / Invoice', bn: 'কর্পোরেট বিলিং / ব্যাংক ইনভয়েস', sub: 'B2B monthly payment settlement according to trade term sheets.', color: 'border-cyan-500/20 hover:border-cyan-500/40' }
                    ] : [])
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPayment(method.id)}
                      className={cn(
                        "p-4 rounded-xl border flex justify-between items-center transition-all duration-200 text-left relative overflow-hidden",
                        payment === method.id 
                          ? "bg-zinc-900 border-cyan-400/40" 
                          : cn("bg-black/20", method.color)
                      )}
                    >
                      <div>
                        <p className={cn(
                          "text-xs font-black uppercase tracking-tight",
                          payment === method.id ? 'text-white' : 'text-zinc-300'
                        )}>
                          {isBn ? method.bn : method.label}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">{method.sub}</p>
                      </div>

                      <div className="shrink-0 flex items-center gap-3">
                        {method.logo && (
                          <span className={cn("text-xs font-black font-mono", method.logoColor)}>{method.logo}</span>
                        )}
                        <div className={cn(
                          "w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center transition-all",
                          payment === method.id 
                            ? "border-cyan-400 bg-cyan-400 text-black" 
                            : "border-zinc-700"
                        )}>
                          {payment === method.id && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: ECOSYSTEM CONSOLIDATED REVIEW */}
            {step === 3 && (
              <div className="space-y-5 text-left">
                <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-black uppercase tracking-[0.15em] text-zinc-200">
                    {isBn ? "অর্ডার ডিটেইলস ও এসক্রো রিভিউ" : "Unified Settlement Review"}
                  </h3>
                </div>

                <div className="bg-black/30 rounded-2xl border border-white/5 p-5 space-y-4 text-xs">
                  
                  {/* Address Summary */}
                  <div className="pb-4 border-b border-white/5 space-y-1.5">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block">
                      {['courier', 'truck', 'rent_car'].includes(checkoutType) ? "Logistics Route Details" : "Delivery Sourcing Target"}
                    </span>
                    
                    {['courier', 'truck', 'rent_car'].includes(checkoutType) ? (
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded bg-cyan-500/10 text-cyan-400 text-[8px] font-bold flex items-center justify-center shrink-0 mt-0.5">A</span>
                          <p className="text-zinc-200 leading-relaxed font-semibold">{getAddressString(selectedAddrId)}</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded bg-cyan-500/10 text-cyan-400 text-[8px] font-bold flex items-center justify-center shrink-0 mt-0.5">B</span>
                          <p className="text-zinc-200 leading-relaxed font-semibold">{getAddressString(selectedDropAddrId)}</p>
                        </div>
                        
                        {stops.length > 0 && (
                          <div className="pl-6 space-y-1">
                            {stops.map((st, sidx) => (
                              <p key={st.id} className="text-[10px] text-zinc-500 font-bold uppercase">📍 Stop {sidx + 1}: {st.location}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-zinc-200 leading-relaxed font-semibold">{getAddressString(selectedAddrId)}</p>
                    )}
                  </div>

                  {/* Sourcing details, dates */}
                  <div className="pb-4 border-b border-white/5 grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Service Sourcing</span>
                      <p className="font-black text-white uppercase">{activeDelivery.name}</p>
                      <p className="text-[10px] text-zinc-400 font-mono mt-0.5">ETA / Schedule: {scheduledDate ? `${scheduledDate} (${scheduledTime})` : activeDelivery.eta}</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Financial Billing</span>
                      <p className="font-black text-cyan-400 uppercase">{payment}</p>
                      {walletToggle && (
                        <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider mt-0.5">Co-paid via PK Wallet</p>
                      )}
                    </div>
                  </div>

                  {/* Item Recap Tally */}
                  <div className="pb-2">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Item Lots Ledger</span>
                    <div className="space-y-2">
                      {items.map((itm) => (
                        <div key={itm.id} className="flex justify-between items-center text-zinc-300">
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded bg-white/5 border border-white/5 text-[8px] font-mono flex items-center justify-center font-black">{itm.quantity}x</span>
                            <span className="font-bold max-w-[180px] truncate">{itm.name}</span>
                          </div>
                          <span className="font-mono text-zinc-100">{formatBDT(itm.price * itm.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Breakdown Card */}
                  <div className="pt-4 border-t border-white/5 space-y-2.5">
                    <div className="flex justify-between items-center text-xs text-zinc-400">
                      <span>Base subtotal</span>
                      <span className="font-mono text-zinc-200">{formatBDT(subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-zinc-400">
                      <span>5% Central BD VAT</span>
                      <span className="font-mono text-zinc-200">+{formatBDT(Math.round(subtotal * 0.05))}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-zinc-400">
                      <span>Logistics cargo freight</span>
                      <span className="font-mono text-cyan-400">+{formatBDT(finalDeliveryCost)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between items-center text-xs text-rose-500">
                        <span>Automated wholesale discounts</span>
                        <span className="font-mono">-{formatBDT(discount)}</span>
                      </div>
                    )}
                    {walletToggle && (
                      <div className="flex justify-between items-center text-xs text-cyan-400">
                        <span>Ledger Wallet deduction</span>
                        <span className="font-mono">-{formatBDT(Math.min(subtotalWithVat + finalDeliveryCost - discount, walletBalance))}</span>
                      </div>
                    )}
                    
                    <div className="pt-3 border-t border-white/5 flex justify-between items-end">
                      <div>
                        <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider block">Final Securing Ledger Settle</span>
                        <span className="text-[9px] text-zinc-500 leading-none">Paikar Escrow Protection Guaranteed</span>
                      </div>
                      <span className="text-lg font-mono font-black text-cyan-400">{formatBDT(totalPayable)}</span>
                    </div>
                  </div>

                </div>

                {/* Sourcing warning footer banner */}
                <div className="p-4 bg-yellow-500/5 rounded-2xl border border-yellow-500/20 text-[10px] text-yellow-400 font-bold leading-normal flex gap-3 items-start">
                  <Globe className="w-5 h-5 shrink-0 text-yellow-400 mt-0.5" />
                  <p>All items sourced within the PaikarMart super-app environment conform to legal trade laws. The cash ledger will remain locked safely inside escrow. Sourcing completed upon destination validation.</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Stepper Footer Controls */}
      <div className="px-6 sm:px-8 py-5 bg-black/40 border-t border-white/5 flex justify-between items-center select-none">
        <button 
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          {step > 0 ? (isBn ? 'পিছনে যান' : 'Back') : (isBn ? 'বাতিল' : 'Cancel')}
        </button>

        <button 
          onClick={handleNext}
          disabled={isNextDisabled()}
          className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-500 hover:to-teal-500 text-black rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_4px_25px_rgba(16,185,129,0.3)] flex items-center gap-2"
        >
          {step === steps.length - 1 
            ? (isBn ? 'অর্ডার লক করুন' : 'Lock Escrow & Place Order') 
            : (isBn ? 'পরবর্তী ধাপ' : 'Next Step')}
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
