import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Package, MapPin, Truck, ShieldCheck, 
  Search, Bell, ArrowRight, CheckCircle2, 
  Clock, AlertCircle, Phone, Navigation, Car,
  ShieldAlert, Sparkles, Building, Info, Star, Check,
  ChevronRight, ArrowUpRight, HelpCircle, AlertTriangle,
  History, Bookmark, Tag, X, Wallet, CreditCard, Banknote, Bike, Zap,
  Compass, AlertOctagon, User, DollarSign, RefreshCw, Layers, Map as MapIcon, Plane, Target,
  Plus, Minus, Calendar, Smartphone, Award, FileText, Camera, UserCheck, ThumbsUp, Trash2, Store
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { StoryBar } from '@/shared/StoryBar';
import { PortalIconBar } from '@/shared/PortalIconBar';
import { toast } from 'sonner';

// Store Connections
import { useWalletStore } from '@/modules/wallet/useWalletStore';
import { useGeolocation } from '@/modules/location/useGeolocation';
import { useLocationStore } from '@/modules/location/locationStore';

// Components
import { LogisticsServiceGrid, LogisticsCategory } from '@/portals/logistics-hub/logistics/components/LogisticsServiceGrid';
import { LogisticsSearchArea } from '@/portals/logistics-hub/logistics/components/LogisticsSearchArea';
import { LogisticsVehicleSelection } from '@/portals/logistics-hub/logistics/components/LogisticsVehicleSelection';
import { UnifiedPaymentForm } from '@/components/common/UnifiedPaymentForm';
import { UnifiedDeliveryTracking } from '@/components/common/UnifiedDeliveryTracking';

// Mock Restaurants for Food Delivery Flow
const FOOD_RESTAURANTS = [
  { id: 'star_kabab', nameEn: 'Star Kabab', nameBn: 'স্টার কাবাব', rating: '4.5 ★', cuisines: 'Biryani, Kebab', img: '🍖' },
  { id: 'burger_king', nameEn: 'Burger King', nameBn: 'বার্গার কিং', rating: '4.2 ★', cuisines: 'Burgers, Fries', img: '🍔' },
  { id: 'sultans_dine', nameEn: "Sultan's Dine", nameBn: 'সুলতানস ডাইন', rating: '4.8 ★', cuisines: 'Kacchi Biryani', img: '🍚' },
];

const FOOD_ITEMS: Record<string, { id: string, nameEn: string, nameBn: string, price: number, icon: string }[]> = {
  star_kabab: [
    { id: 'sk_1', nameEn: 'Mutton Biryani', nameBn: 'খাসির বিরিয়ানি', price: 280, icon: '🍛' },
    { id: 'sk_2', nameEn: 'Chicken Roast', nameBn: 'চিকেন রোস্ট', price: 140, icon: '🍗' },
    { id: 'sk_3', nameEn: 'Special Borhani', nameBn: 'স্পেশাল বোরহানি', price: 60, icon: '🥛' },
  ],
  burger_king: [
    { id: 'bk_1', nameEn: 'Whopper Meal', nameBn: 'হোপার মিল', price: 490, icon: '🍔' },
    { id: 'bk_2', nameEn: 'Cheeseburger', nameBn: 'চিজবার্গার', price: 220, icon: '🍔' },
    { id: 'bk_3', nameEn: 'Crispy Fries', nameBn: 'ক্রিসপি ফ্রাইজ', price: 120, icon: '🍟' },
  ],
  sultans_dine: [
    { id: 'sd_1', nameEn: 'Kacchi Platter', nameBn: 'কাচ্চি প্ল্যাটার', price: 380, icon: '🍛' },
    { id: 'sd_2', nameEn: 'Shahi Jorda', nameBn: 'শাহী জর্দা', price: 90, icon: '🍨' },
  ]
};

// Rent Car fleet
const RENT_CARS = [
  { id: 'rc_1', nameEn: 'Noah Microbus', nameBn: 'নোহা মাইক্রোবাস', seats: 8, pricePerDay: 4500, driver: 'Included (চালকের ফিসহ)', rating: '4.9 ★' },
  { id: 'rc_2', nameEn: 'Toyota Premio', nameBn: 'টয়োটা প্রিমিও', seats: 4, pricePerDay: 3500, driver: 'Included (চালকের ফিসহ)', rating: '4.8 ★' },
  { id: 'rc_3', nameEn: 'Mitsubishi Pajero', nameBn: 'মিতসুবিশি পাজেরো', seats: 7, pricePerDay: 8500, driver: 'Included (চালকের ফিসহ)', rating: '4.9 ★' },
];

export default function LogisticsPortal() {
  const { detectLocation, watchLocation } = useGeolocation();
  const { city, lat, lng, isAutoDetected } = useLocationStore();
  const { balance, coins, updateBalance, addTransaction } = useWalletStore();
  
  const [activeCategory, setActiveCategory] = useState<LogisticsCategory | null>(null);
  const [isBilingual, setIsBilingual] = useState(true);
  const [pickup, setPickup] = useState('Panthapath, Dhaka');
  const [drop, setDrop] = useState('Uttara Sector 11, Dhaka');
  
  // Multi-stop Drop Locations State
  const [multiStops, setMultiStops] = useState<string[]>([]);
  const [showMultiStop, setShowMultiStop] = useState(false);
  
  // Booking State Machine
  const [bookingStep, setBookingStep] = useState<'selection' | 'custom_details' | 'vehicle' | 'payment' | 'tracking'>('selection');
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  // Scheduling State
  const [bookingMode, setBookingMode] = useState<'now' | 'schedule'>('now');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<'daily' | 'weekly'>('daily');

  // Quick Book Panel States
  const [quickBookMode, setQuickBookMode] = useState<'passenger' | 'package'>('passenger');
  const [passengerCount, setPassengerCount] = useState(1);
  const [packageWeight, setPackageWeight] = useState(2); // in kg
  const [packageSize, setPackageSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [quickBookResult, setQuickBookResult] = useState<any>(null);

  // ── Category-specific Interactive States ──
  // Rental
  const [rentType, setRentType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  // Food Delivery
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('star_kabab');
  const [foodCart, setFoodCart] = useState<Record<string, number>>({});
  
  // Courier
  const [courierZone, setCourierZone] = useState<'inside' | 'outside' | 'nationwide'>('inside');
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [weightKg, setWeightKg] = useState(1);

  // Local / Same Day Delivery
  const [packageType, setPackageType] = useState<'document' | 'parcel' | 'fragile' | 'food'>('parcel');
  const [timeSlot, setTimeSlot] = useState<'2hr' | '4hr' | 'sameday'>('sameday');

  // Emergency
  const [emergencyType, setEmergencyType] = useState<'ambulance' | 'urgent_medicine' | 'emergency_rider'>('emergency_rider');

  // Simulated Map Coordinate animation state
  const [mapProgress, setMapProgress] = useState(0);

  // POD (Proof Of Delivery) States
  const [podStep, setPodStep] = useState<'not_started' | 'photo' | 'signature' | 'otp' | 'verified'>('not_started');
  const [podPhoto, setPodPhoto] = useState<string | null>(null);
  const [podSignature, setPodSignature] = useState<string | null>(null);
  const [podOtp, setPodOtp] = useState('');
  const [podOtpSent, setPodOtpSent] = useState(false);
  const isCanvasDrawing = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Fleet management dashboard for driver-role
  const [fleetView, setFleetView] = useState<'main' | 'vehicles' | 'drivers' | 'logs'>('main');
  const [showFleetStudio, setShowFleetStudio] = useState(false);
  const [myVehicles, setMyVehicles] = useState([
    { id: 'v_1', plate: 'DHAKA-METRO-KA-1122', type: 'Truck', driver: 'Imran Khan', status: 'Active', fuel: '75%', nextService: '12 Days' },
    { id: 'v_2', plate: 'DHAKA-METRO-LA-9988', type: 'Bike', driver: 'Masud Rana', status: 'Online', fuel: '50%', nextService: '5 Days' }
  ]);

  // ── NEW STATES FOR PHASES 2, 3, AND 4 ──
  // Dynamic pricing environment modifiers
  const [weatherCondition, setWeatherCondition] = useState<'clear' | 'rainy'>('clear');
  const [trafficCongestion, setTrafficCongestion] = useState<'normal' | 'rush_hour'>('normal');

  // Logistics Wallet & Vouchers
  const [shippingCredits, setShippingCredits] = useState<number>(1500);
  const [topupInput, setTopupInput] = useState<string>('');

  // Commerce Center Tabs
  const [logisticsTab, setLogisticsTab] = useState<'providers' | 'coverage' | 'b2b' | 'returns' | 'wallet'>('providers');
  
  // Selected Storefront
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  
  // Coverage District Filter
  const [selectedDivision, setSelectedDivision] = useState<string>('Dhaka');
  const [districtSearch, setDistrictSearch] = useState<string>('');

  // B2B Corporate Bulk
  const [bulkUploadText, setBulkUploadText] = useState<string>('');
  const [b2bDeliveries, setB2bDeliveries] = useState<any[]>([
    { id: 'b2b_1', customer: 'Anika Fashion House', phone: '01712345678', location: 'Dhaka', amount: 1200, status: 'Processing', date: '2026-06-25' },
    { id: 'b2b_2', customer: 'Bhai Bhai Grocery Store', phone: '01911122233', location: 'Chittagong', amount: 850, status: 'In Transit', date: '2026-06-25' },
    { id: 'b2b_3', customer: 'Dhaka Tech Traders', phone: '01599887766', location: 'Sylhet', amount: 3100, status: 'Delivered', date: '2026-06-24' }
  ]);

  // Reverse Logistics / Returns Form
  const [returnItemName, setReturnItemName] = useState<string>('');
  const [returnReason, setReturnReason] = useState<string>('damaged');
  const [returnPickupAddress, setReturnPickupAddress] = useState<string>('');
  const [returnStatus, setReturnStatus] = useState<'idle' | 'booked' | 'transit' | 'refunded'>('idle');
  const [activeReturns, setActiveReturns] = useState<any[]>([
    { id: 'ret_101', item: 'Silk Sharee (Incorrect Color)', customer: 'Sultana K.', carrier: 'Pathao Return Unit', status: 'In Transit' }
  ]);

  // Recurring Bookings List
  const [recurringSubscriptions, setRecurringSubscriptions] = useState<any[]>([
    { id: 'sub_1', frequency: 'daily', pickupTime: '09:00 AM', route: 'Panthapath to Dhanmondi', active: true },
    { id: 'sub_2', frequency: 'weekly', pickupTime: '02:30 PM', route: 'Gulshan to Uttara', active: true }
  ]);

  // Initial location detection
  useEffect(() => {
    detectLocation();
  }, []);

  // Update pickup when auto-detected location changes
  useEffect(() => {
    if (isAutoDetected && city) {
      setPickup(city);
    }
  }, [city, isAutoDetected]);

  useEffect(() => {
    let cleanupWatch: any = null;
    if (bookingStep === 'tracking') {
      cleanupWatch = watchLocation();
      const interval = setInterval(() => {
        setMapProgress(prev => {
          if (prev >= 100) {
            setPodStep('photo'); // Auto trigger POD flow when driver arrives
            return 100;
          }
          return prev + 5;
        });
      }, 500);
      return () => {
        clearInterval(interval);
        if (typeof cleanupWatch === 'function') cleanupWatch();
        else if (cleanupWatch !== null) navigator.geolocation.clearWatch(cleanupWatch);
      };
    } else {
      setMapProgress(0);
      setPodStep('not_started');
      setPodPhoto(null);
      setPodSignature(null);
      setPodOtp('');
      setPodOtpSent(false);
    }
  }, [bookingStep]);

  const t = (en: string, bn: string) => isBilingual ? bn : en;

  const handleCategorySelect = (category: LogisticsCategory) => {
    setActiveCategory(category);
    // Determine next step
    if (category === 'rent_car' || category === 'food' || category === 'courier' || category === 'local_delivery' || category === 'same_day' || category === 'emergency') {
      setBookingStep('custom_details');
    } else {
      setBookingStep('vehicle');
    }
    toast.info(`${t('Service Mode Activated', 'সার্ভিস মোড চালু হয়েছে')}: ${category.replace('_', ' ').toUpperCase()}`);
  };

  const handleVehicleSelect = (vehicle: any) => {
    // Inject Multi stop / scheduling metadata + weather & traffic dynamic pricing
    let surchargeMultiplier = 1;
    if (weatherCondition === 'rainy') surchargeMultiplier += 0.25; // Rain Surge (+25%)
    if (trafficCongestion === 'rush_hour') surchargeMultiplier += 0.35; // Traffic Surge (+35%)
    
    const multiplier = surchargeMultiplier + (multiStops.length * 0.4); // 40% surcharge per extra stop
    const basePrice = Math.round(vehicle.price * multiplier);
    
    setSelectedVehicle({
      ...vehicle,
      price: basePrice,
      isScheduled: bookingMode === 'schedule',
      isRecurring,
      stopsCount: multiStops.length,
      weatherSurge: weatherCondition === 'rainy',
      trafficSurge: trafficCongestion === 'rush_hour',
      basePrice: vehicle.price
    });
    setBookingStep('payment');
  };

  const handlePaymentSuccess = (method: string) => {
    const newOrderId = `PM-L${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    setCurrentOrderId(newOrderId);
    setBookingStep('tracking');
    
    // Deduct from logistics wallet credits first, or fallback to user wallet store
    if (method === 'wallet') {
      if (shippingCredits >= selectedVehicle.price) {
        setShippingCredits(prev => prev - selectedVehicle.price);
        toast.success(t('Payment completed using Logistics Shipping balance!', 'লজিস্টিকস শিপিং ব্যালেন্স ব্যবহার করে পেমেন্ট সফল হয়েছে!'));
      } else if (balance >= selectedVehicle.price) {
        updateBalance(selectedVehicle.price, 'debit');
        addTransaction({
          type: 'debit',
          amount: selectedVehicle.price,
          label: t(`Logistics - ${selectedVehicle.nameEn}`, `লজিস্টিকস - ${selectedVehicle.nameBn}`),
          sublabel: t(`Booking Order ${newOrderId}`, `অর্ডার নম্বর ${newOrderId}`),
          status: 'success'
        });
        toast.success(t('Payment completed using User Account Wallet!', 'ইউজার অ্যাকাউন্ট ওয়ালেট ব্যবহার করে পেমেন্ট সফল হয়েছে!'));
      }
    } else {
      toast.success(t('Payment completed via Gateway!', 'গেটওয়ের মাধ্যমে পেমেন্ট সম্পন্ন হয়েছে!'));
    }

    // If scheduled recurring booking, save to subscriptions list
    if (bookingMode === 'schedule' && isRecurring) {
      setRecurringSubscriptions(prev => [
        ...prev,
        {
          id: `sub_${Date.now()}`,
          frequency: recurringFrequency,
          pickupTime: scheduleTime || '10:00 AM',
          route: `${pickup} to ${drop}`,
          active: true
        }
      ]);
      toast.success(t('Recurring subscription established!', 'রিকারিং ডেলিভারি সাবস্ক্রিপশন চালু হয়েছে!'));
    }

    toast.success(t('Booking Confirmed!', 'বুকিং এবং পেমেন্ট সফলভাবে সম্পন্ন হয়েছে!'));
  };

  // Quick Book Intelligence System
  const processQuickBook = () => {
    if (!pickup || !drop) {
      toast.error(t('Please enter both Pickup and Drop locations.', 'অনুগ্রহ করে পিকআপ এবং গন্তব্য স্থান উভয়ই লিখুন।'));
      return;
    }

    let recommended: LogisticsCategory = 'bike_ride';
    let labelEn = '';
    let labelBn = '';
    let reasonEn = '';
    let reasonBn = '';
    let estPrice = 120;

    if (quickBookMode === 'passenger') {
      if (passengerCount === 1) {
        recommended = 'bike_ride';
        labelEn = 'Eco Bike Ride';
        labelBn = 'ইকো বাইক রাইড';
        reasonEn = 'Fastest solo transport through city traffic.';
        reasonBn = 'শহরের ট্রাফিকের জন্য দ্রুততম একক বাহন।';
        estPrice = 90;
      } else if (passengerCount <= 4) {
        recommended = 'car_ride';
        labelEn = 'Sedan Economy Ride';
        labelBn = 'সেডান ইকোনমি রাইড';
        reasonEn = 'Comfortable sedan ride for up to 4 passengers.';
        reasonBn = '৪ জন যাত্রী পর্যন্ত আরামদায়ক সেডান রাইড।';
        estPrice = 280;
      } else {
        recommended = 'car_ride'; // Multi micro/XL
        labelEn = 'Premium microbus / SUV XL';
        labelBn = 'প্রিমিয়াম মাইক্রোবাস / এসইউভি এক্সএল';
        reasonEn = 'Spacious multi-passenger vehicle.';
        reasonBn = 'অধিক যাত্রীর জন্য বড় মাইক্রোবাস বা এসইউভি।';
        estPrice = 650;
      }
    } else {
      // Package Delivery suggestion
      if (packageWeight < 5) {
        recommended = 'local_delivery';
        labelEn = 'Instant Bike Courier';
        labelBn = 'ইন্সট্যান্ট বাইক কুরিয়ার';
        reasonEn = 'Lightweight parcel under 5kg is best handled by standard motorcycle rider.';
        reasonBn = '৫ কেজির নিচের পার্সেলের জন্য মোটরসাইকেল রাইডারই সেরা এবং দ্রুততম।';
        estPrice = 80;
      } else if (packageWeight < 20) {
        recommended = 'same_day';
        labelEn = 'Same Day Express Van';
        labelBn = 'সেম ডে এক্সপ্রেস ভ্যান';
        reasonEn = 'Medium parcel dimensions fit perfectly in same-day dispatch vans.';
        reasonBn = 'মাঝারি পার্সেল সহজে সেম-ডে ভ্যানে পরিবহনযোগ্য।';
        estPrice = 180;
      } else {
        recommended = 'truck';
        labelEn = 'Pickup / Covered Truck';
        labelBn = 'পিকআপ / কাভার্ড ট্রাক';
        reasonEn = 'Heavy cargo over 20kg requires commercial utility truck dispatch.';
        reasonBn = '২০ কেজির বেশি ভারী মালামাল পরিবহনে পিকআপ ট্রাকের প্রয়োজন।';
        estPrice = 1200;
      }
    }

    let surchargeMultiplier = 1;
    if (weatherCondition === 'rainy') surchargeMultiplier += 0.25;
    if (trafficCongestion === 'rush_hour') surchargeMultiplier += 0.35;
    const finalPrice = Math.round(estPrice * surchargeMultiplier);

    setQuickBookResult({
      category: recommended,
      nameEn: labelEn,
      nameBn: labelBn,
      reasonEn,
      reasonBn,
      price: finalPrice,
      isWeatherSurged: weatherCondition === 'rainy',
      isTrafficSurged: trafficCongestion === 'rush_hour'
    });

    toast.success(t('AI Routing Suggestions Loaded!', 'এআই রাউটিং সাজেশন প্রস্তুত!'));
  };

  const selectQuickBookResult = () => {
    if (quickBookResult) {
      handleCategorySelect(quickBookResult.category);
    }
  };

  // Calculations
  const calculatedFoodTotal = useMemo(() => {
    const items = FOOD_ITEMS[selectedRestaurant] || [];
    return items.reduce((sum, item) => sum + (foodCart[item.id] || 0) * item.price, 0);
  }, [foodCart, selectedRestaurant]);

  const calculatedCourierCharge = useMemo(() => {
    const base = courierZone === 'inside' ? 60 : courierZone === 'outside' ? 120 : 150;
    let baseCharge = base + (weightKg - 1) * 25;
    
    let multiplier = 1;
    if (weatherCondition === 'rainy') multiplier += 0.25;
    if (trafficCongestion === 'rush_hour') multiplier += 0.35;
    
    return Math.round(baseCharge * multiplier);
  }, [courierZone, weightKg, weatherCondition, trafficCongestion]);

  // Multi Stop helpers
  const addStopField = () => {
    if (multiStops.length >= 3) {
      toast.warning(t('Maximum 3 extra stops allowed.', 'সর্বোচ্চ ৩টি অতিরিক্ত স্টপ যোগ করা যাবে।'));
      return;
    }
    setMultiStops([...multiStops, '']);
  };

  const removeStopField = (index: number) => {
    setMultiStops(multiStops.filter((_, i) => i !== index));
  };

  const updateStopValue = (index: number, val: string) => {
    const next = [...multiStops];
    next[index] = val;
    setMultiStops(next);
  };

  // Signature drawing canvas helpers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isCanvasDrawing.current = true;
    draw(e);
  };

  const stopDrawing = () => {
    isCanvasDrawing.current = false;
    if (canvasRef.current) {
      setPodSignature(canvasRef.current.toDataURL());
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isCanvasDrawing.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'cyan-400';
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.beginPath();
    setPodSignature(null);
  };

  // Trigger fake OTP send
  const sendPodOtp = () => {
    setPodOtpSent(true);
    toast.info(t('OTP verification code sent to recipient phone!', 'প্রাপকের ফোনে ভেরিফিকেশন ওটিপি পাঠানো হয়েছে!'));
  };

  const verifyPodOtp = () => {
    if (podOtp === '1234' || podOtp.length >= 4) {
      setPodStep('verified');
      toast.success(t('Proof of Delivery verified successfully!', 'ডেলিভারি সফলভাবে ভেরিফাইড এবং সম্পন্ন হয়েছে!'));
    } else {
      toast.error(t('Invalid OTP code. Use 1234 as mock code.', 'ভুল ওটিপি কোড। অনুগ্রহ করে ১২৩৪ ব্যবহার করুন।'));
    }
  };

  return (
    <div className="min-h-screen text-white bg-[#03060d] pb-24">
      
      {/* ━━━ PORTAL HOMEPAGE HEADER ━━━ */}
      <section className="pt-4 px-2 space-y-1">
        <StoryBar context="logistics" />
        <PortalIconBar context="transport" />
      </section>

      <div className="w-full max-w-[1280px] mx-auto px-4 mt-6 space-y-8">
        
        {/* Banner with Premium Graphics */}
        <div className="relative p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-cyan-900/10 via-[#0b101d]/80 to-black/65 border border-white/5 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute -bottom-10 right-10 opacity-10 pointer-events-none">
            <Compass className="w-80 h-80 text-cyan-400 rotate-12" />
          </div>
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-extrabold tracking-[0.2em] text-cyan-400 bg-cyan-950/45 px-3 py-1 rounded-full border border-cyan-500/15">
                <Sparkles className="w-3.5 h-3.5" />
                PaikarMart Commerce Logistics Ecosystem
              </span>
              {isAutoDetected && (
                <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-extrabold tracking-[0.2em] text-cyan-400 bg-cyan-950/45 px-3 py-1 rounded-full border border-cyan-500/15 animate-pulse">
                  <Target className="w-3.5 h-3.5" />
                  Live Location: {city}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-none">
              Transportation <span className="text-cyan-400">&</span> <br />
              Logistics Hub
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md">
              Whether you need an instant bike ride, a delivery boy, a 10-ton freighter, or an emergency ambulance, PaikarMart covers every logistics node in Bangladesh.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button 
                onClick={() => setShowFleetStudio(!showFleetStudio)}
                className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 text-xs rounded-xl font-bold h-10 px-5"
              >
                <Layers className="w-4 h-4 mr-2" />
                {t('Fleet & Driver Studio', 'ফ্লিট ও ড্রাইভার স্টুডিও')}
              </Button>
              <Button 
                onClick={() => setIsBilingual(!isBilingual)}
                variant="outline"
                className="border-white/10 hover:bg-white/5 text-xs rounded-xl font-bold h-10 px-5 text-slate-300"
              >
                {isBilingual ? 'English labels' : 'বাংলা লেবেল'}
              </Button>
            </div>
          </div>
        </div>

        {/* ── FLEET MANAGEMENT DASHBOARD (PORTAL DRIVER STUDIO) ── */}
        <AnimatePresence>
          {showFleetStudio && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-6 rounded-3xl bg-[#090e1a]/90 border border-cyan-500/20 space-y-6 overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-cyan-400 font-extrabold">{t('Merchant Console', 'ভেন্ডর অ্যান্ড রাইডার পোর্টাল')}</span>
                    <h3 className="text-sm font-black text-white">{t('Logistics Provider Fleet Management', 'লজিস্টিকস প্রোভাইডার ফ্লিট ড্যাশবোর্ড')}</h3>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowFleetStudio(false)}
                  className="rounded-full bg-white/5 hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Fleet Sub navigation */}
              <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/5">
                {[
                  { id: 'main', label: 'Overview' },
                  { id: 'vehicles', label: 'My Vehicles (যানবাহন)' },
                  { id: 'drivers', label: 'Manage Drivers (ড্রাইভার)' },
                  { id: 'logs', label: 'Fuel & Maintenance Logs' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setFleetView(tab.id as any)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                      fleetView === tab.id ? 'bg-cyan-500 text-black' : 'bg-white/5 hover:bg-white/10 text-slate-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {fleetView === 'main' && (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Active Fleet Count', val: '2 Units', sub: 'All functional', icon: Truck, color: 'text-blue-400' },
                    { label: 'Today Earnings BDT', val: '৳4,520', sub: '3 trips complete', icon: DollarSign, color: 'text-cyan-400' },
                    { label: 'Average Trip Rating', val: '4.9 ★', sub: 'Based on 45 reviews', icon: Star, color: 'text-amber-400' },
                    { label: 'Compliance Status', val: 'NID Verified', sub: 'Trust Level 5 Approved', icon: ShieldCheck, color: 'text-purple-400' }
                  ].map((stat, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{stat.label}</span>
                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                      </div>
                      <p className="text-xl font-black text-white">{stat.val}</p>
                      <p className="text-[9px] text-slate-500">{stat.sub}</p>
                    </div>
                  ))}
                </div>
              )}

              {fleetView === 'vehicles' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">{t('My Registered Fleet', 'আমার নিবন্ধিত যানবাহন')}</h4>
                    <Button 
                      size="sm" 
                      onClick={() => {
                        const plate = prompt('Enter vehicle license plate (DHAKA-METRO-XXXX):');
                        if (plate) {
                          setMyVehicles([...myVehicles, {
                            id: `v_${Date.now()}`,
                            plate,
                            type: 'Covered Van',
                            driver: 'Pending Assignment',
                            status: 'Idle',
                            fuel: '100%',
                            nextService: '30 Days'
                          }]);
                          toast.success('New vehicle added successfully!');
                        }
                      }}
                      className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-lg"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> {t('Add Vehicle', 'নতুন যানবাহন')}
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myVehicles.map(veh => (
                      <div key={veh.id} className="p-4 rounded-2xl bg-black/30 border border-white/5 flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-black tracking-widest">{veh.type}</span>
                          <h5 className="font-mono text-sm font-black text-white">{veh.plate}</h5>
                          <p className="text-xs text-slate-400">Driver: <span className="font-bold text-slate-300">{veh.driver}</span></p>
                        </div>
                        <div className="text-right space-y-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400">{veh.status}</span>
                          <p className="text-[10px] text-slate-500">Fuel Level: {veh.fuel}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {fleetView === 'drivers' && (
                <div className="p-4 rounded-2xl bg-black/20 border border-white/5 space-y-4">
                  <h4 className="text-xs font-bold uppercase text-slate-400">Driver Compliance & Performance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">IK</div>
                        <div>
                          <p className="text-xs font-bold text-white">Imran Khan</p>
                          <p className="text-[10px] text-slate-400">Trust Badge: Verified Driver</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-cyan-400">98.5% Success</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">MR</div>
                        <div>
                          <p className="text-xs font-bold text-white">Masud Rana</p>
                          <p className="text-[10px] text-slate-400">Trust Badge: Verified Driver</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-cyan-400">99.1% Success</span>
                    </div>
                  </div>
                </div>
              )}

              {fleetView === 'logs' && (
                <div className="p-4 rounded-2xl bg-black/20 border border-white/5 space-y-3">
                  <h4 className="text-xs font-bold uppercase text-slate-400">Recent Service & Expense Log</h4>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span>Covered Van Refuel (50L)</span>
                      <span className="font-mono text-white">৳6,250</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span>Bike Engine Oil Change</span>
                      <span className="font-mono text-white">৳850</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 1. UNIFIED LOGISTICS HOME (QUICK BOOK & INTELLIGENCE) ── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Quick Booking Engine (Left 7 Columns) */}
          <div className="lg:col-span-7 p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/10 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl" />
            <div className="flex items-center gap-3 pb-2 border-b border-white/5">
              <Zap className="w-5 h-5 text-cyan-400 animate-bounce" />
              <div>
                <h3 className="text-base font-black text-white uppercase">{t('Quick Book & Smart routing', 'কুইক বুক এ্যান্ড এআই রাউটিং')}</h3>
                <p className="text-[10px] text-slate-400">{t('Instantly routing passengers & cargo across Bangladesh', 'সরাসরি পিকআপ, গন্তব্য ও টাইপ সিলেক্ট করলেই এআই সাজেস্ট করবে সেরা সার্ভিস')}</p>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
              <button
                onClick={() => {
                  setQuickBookMode('passenger');
                  setQuickBookResult(null);
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  quickBookMode === 'passenger' ? 'bg-cyan-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                {t('Passenger Trip', 'যাত্রী পরিবহন')}
              </button>
              <button
                onClick={() => {
                  setQuickBookMode('package');
                  setQuickBookResult(null);
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  quickBookMode === 'package' ? 'bg-cyan-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Package className="w-4 h-4" />
                {t('Package / Cargo', 'পার্সেল ও পণ্য')}
              </button>
            </div>

            {/* Shared Search Inputs */}
            <LogisticsSearchArea 
              pickup={pickup} 
              drop={drop} 
              setPickup={setPickup} 
              setDrop={setDrop} 
              isBilingual={isBilingual} 
            />

            {/* Custom parameters based on Passenger vs Package */}
            <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-4">
              {quickBookMode === 'passenger' ? (
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase block">{t('Passenger Count', 'যাত্রীর সংখ্যা')}</label>
                    <span className="text-[10px] text-slate-500">{t('Includes driver limits', 'চালকের আসন বাদে')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button 
                      size="icon" 
                      variant="outline"
                      onClick={() => setPassengerCount(Math.max(1, passengerCount - 1))}
                      className="w-8 h-8 rounded-lg border-white/10"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </Button>
                    <span className="text-sm font-black w-6 text-center">{passengerCount}</span>
                    <Button 
                      size="icon" 
                      variant="outline"
                      onClick={() => setPassengerCount(Math.min(8, passengerCount + 1))}
                      className="w-8 h-8 rounded-lg border-white/10"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">{t('Package Weight (Kg)', 'প্যাকেজের আনুমানিক ওজন')}</label>
                      <span className="text-xs font-black text-cyan-400">{packageWeight} Kg</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="1000" 
                      value={packageWeight}
                      onChange={e => setPackageWeight(Number(e.target.value))}
                      className="w-full accent-cyan-400"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-400 uppercase">{t('Package Size Dimensions', 'প্যাকেজের আকার বা ভলিউম')}</label>
                    <div className="flex gap-1.5">
                      {(['small', 'medium', 'large'] as const).map(size => (
                        <button
                          key={size}
                          onClick={() => setPackageSize(size)}
                          className={`px-3 py-1 text-[10px] font-bold rounded-lg border uppercase ${
                            packageSize === size ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-transparent border-white/10 text-slate-400'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* B2B Scheduling & Multi stop section inside Quick Book */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    {t('Schedule Booking', 'বুকিং শিডিউল')}
                  </label>
                  <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/10">
                    <button 
                      onClick={() => setBookingMode('now')}
                      className={`px-2 py-1 text-[9px] font-bold rounded ${bookingMode === 'now' ? 'bg-cyan-500 text-black' : 'text-slate-400'}`}
                    >
                      Now
                    </button>
                    <button 
                      onClick={() => setBookingMode('schedule')}
                      className={`px-2 py-1 text-[9px] font-bold rounded ${bookingMode === 'schedule' ? 'bg-cyan-500 text-black' : 'text-slate-400'}`}
                    >
                      Later
                    </button>
                  </div>
                </div>

                {bookingMode === 'schedule' && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2 pt-1"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="date" 
                        value={scheduleDate}
                        onChange={e => setScheduleDate(e.target.value)}
                        className="bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white"
                      />
                      <input 
                        type="time" 
                        value={scheduleTime}
                        onChange={e => setScheduleTime(e.target.value)}
                        className="bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="recurring_check" 
                        checked={isRecurring}
                        onChange={e => setIsRecurring(e.target.checked)}
                        className="rounded accent-cyan-500" 
                      />
                      <label htmlFor="recurring_check" className="text-[10px] text-slate-300">
                        {t('Set as B2B Recurring Delivery', 'B2B রিকারিং ডেলিভারি সেট করুন')}
                      </label>
                    </div>

                    {isRecurring && (
                      <div className="flex gap-2">
                        {['daily', 'weekly'].map(freq => (
                          <button
                            key={freq}
                            onClick={() => setRecurringFrequency(freq as any)}
                            className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase ${recurringFrequency === freq ? 'bg-cyan-500 text-black' : 'bg-white/5'}`}
                          >
                            {freq}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Multi Stop Toggle */}
              <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                    <MapIcon className="w-4 h-4 text-cyan-400" />
                    {t('Multi-Stop Routing', 'মাল্টি-স্টপ ড্রপ-অফ')}
                  </label>
                  <input 
                    type="checkbox" 
                    checked={showMultiStop}
                    onChange={e => {
                      setShowMultiStop(e.target.checked);
                      if (!e.target.checked) setMultiStops([]);
                    }}
                    className="rounded accent-cyan-500 h-4 w-4" 
                  />
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  {t('Deliver packages to multiple buyers or pick passengers from multiple points.', 'একই ট্রিপে একাধিক গন্তব্যে পার্সেল ড্রপ করুন বা যাত্রী পিকআপ করুন।')}
                </p>

                {showMultiStop && (
                  <div className="space-y-2 pt-2">
                    {multiStops.map((stop, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={stop}
                          placeholder={`Stop ${idx + 1} address`}
                          onChange={e => updateStopValue(idx, e.target.value)}
                          className="flex-1 bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white"
                        />
                        <button onClick={() => removeStopField(idx)} className="p-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500/40">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <Button size="sm" onClick={addStopField} className="w-full bg-white/5 border border-white/10 text-xs text-slate-300">
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Stop Point
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Environment Surcharge / Smart Pricing Controls */}
            <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black text-slate-300 uppercase flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
                  {t('Smart Dynamic Pricing & Surcharges', 'স্মার্ট ডাইনামিক প্রাইসিং ও সারচার্জ')}
                </label>
                <span className="text-[8px] bg-cyan-500/15 text-cyan-400 px-2.5 py-0.5 rounded-full uppercase font-bold tracking-widest">Active Calculator</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                {t('Toggle weather (rainy monsoon) or traffic (peak Dhanmondi rush hour) to watch prices and ETA update in real-time.', 'লাইভ আবহাওয়া (বৃষ্টি) বা ট্রাফিক (ব্যস্ত সময়) অন-অফ করে রিয়েল-টাইম প্রাইসিং এবং ইটিএ পরিবর্তনের ম্যাজিক দেখুন।')}
              </p>
              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* Weather toggle */}
                <button
                  onClick={() => {
                    setWeatherCondition(prev => prev === 'clear' ? 'rainy' : 'clear');
                    toast.info(weatherCondition === 'clear' ? t('Monsoon Rain Mode Activated! 🌧️ +25% Surge applied.', 'বৃষ্টির মোড চালু হয়েছে! 🌧️ +২৫% সারচার্জ যুক্ত হয়েছে।') : t('Weather Cleared. ☀️ Normal rates applied.', 'আবহাওয়া পরিষ্কার। ☀️ সাধারণ রেট প্রযোজ্য।'));
                  }}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    weatherCondition === 'rainy' 
                      ? 'bg-blue-500/15 border-blue-500/50 text-blue-400 shadow-lg shadow-blue-500/5' 
                      : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {weatherCondition === 'rainy' ? '🌧️ ' + t('Raining (+25%)', 'বৃষ্টি হচ্ছে (+২৫%)') : '☀️ ' + t('Clear Weather', 'পরিষ্কার আবহাওয়া')}
                </button>
                {/* Traffic toggle */}
                <button
                  onClick={() => {
                    setTrafficCongestion(prev => prev === 'normal' ? 'rush_hour' : 'normal');
                    toast.info(trafficCongestion === 'normal' ? t('Peak Rush Hour Activated! 🚗 +35% Surge applied.', 'ব্যস্ত ট্রাফিক মোড চালু হয়েছে! 🚗 +৩৫% সারচার্জ যুক্ত হয়েছে।') : t('Traffic Cleared. 🟢 Normal speed rates applied.', 'ট্রাফিক জ্যাম নেই। 🟢 সাধারণ রেট প্রযোজ্য।'));
                  }}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    trafficCongestion === 'rush_hour' 
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-400 shadow-lg shadow-amber-500/5' 
                      : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {trafficCongestion === 'rush_hour' ? '🚗 ' + t('Rush Hour (+35%)', 'অধিক ট্রাফিক (+৩৫%)') : '🟢 ' + t('Normal Traffic', 'স্বাভাবিক ট্রাফিক')}
                </button>
              </div>
            </div>

            <Button 
              onClick={processQuickBook}
              className="w-full h-14 bg-gradient-to-r from-cyan-500 to-teal-500 hover:opacity-90 text-black font-black text-xs uppercase tracking-widest rounded-2xl cursor-pointer"
            >
              {t('Scan Optimal Routing Suggestions', 'এআই রাউটিং সাজেশন্স খুঁজুন')}
            </Button>

            {/* Quick Book Suggestions Response Panel */}
            <AnimatePresence>
              {quickBookResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/35 space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2.5 items-center">
                      <div className="w-9 h-9 rounded-lg bg-cyan-500 flex items-center justify-center text-black">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-cyan-400 font-extrabold">{t('AI Optimal Route Suggestion', 'এআই রাউটিং সাজেশন')}</span>
                        <h4 className="font-bold text-white text-sm">{isBilingual ? quickBookResult.nameBn : quickBookResult.nameEn}</h4>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-black text-cyan-400">৳{quickBookResult.price}</p>
                      <span className="text-[8px] text-slate-400">{t('Estimated Fare', 'সম্ভাব্য ভাড়া')}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 bg-black/40 p-3 rounded-xl">
                    {isBilingual ? quickBookResult.reasonBn : quickBookResult.reasonEn}
                  </p>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setQuickBookResult(null)}
                      className="flex-1 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-white h-10"
                    >
                      {t('Decline', 'বাতিল')}
                    </Button>
                    <Button 
                      onClick={selectQuickBookResult}
                      className="flex-1 bg-cyan-500 hover:bg-cyan-400 rounded-xl text-xs font-bold text-black h-10"
                    >
                      {t('Book Instantly', 'এখনই বুক করুন')}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Social Commerce Logistics Feed (Right 5 Columns) */}
          <div className="lg:col-span-5 p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/10 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl animate-pulse" />
            <div className="flex items-center gap-3 pb-2 border-b border-white/5">
              <Compass className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-base font-black text-white uppercase">{t('Logistics Feed', 'লজিস্টিকস কমার্স ফিড')}</h3>
                <p className="text-[10px] text-slate-400">{t('Live empty-return deals & verified carrier postings', 'হালনাগাদ পরিবহন অফার এবং কুরিয়ার ডিলসমূহ')}</p>
              </div>
            </div>

            {/* Interactive Logistics Feed List */}
            <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1">
              {[
                { 
                  id: 'feed_1', 
                  titleEn: 'Savar to Dhanmondi Empty Return Bike', 
                  titleBn: 'সাভার থেকে ধানমন্ডি এম্পটি রিটার্ন বাইক', 
                  badgeEn: 'Nearby Courier Offers', 
                  badgeBn: 'নিকটবর্তী কুরিয়ার অফার', 
                  price: 150, 
                  descEn: 'Bike courier returning empty to base, offering lightweight parcel dispatch at 60% discount.', 
                  descBn: 'সাভার থেকে ধানমন্ডি ফেরত যাওয়ার সময় কম মূল্যে পার্সেল ডেলিভারি অফার করছেন রাইডার।',
                  verified: true,
                  role: 'rider',
                  user: 'Imran K.'
                },
                { 
                  id: 'feed_2', 
                  titleEn: 'Chittagong-Dhaka 10T covered van backhaul', 
                  titleBn: 'চট্টগ্রাম-ঢাকা ১০টি কাভার্ড ভ্যান ব্যাকহল', 
                  badgeEn: 'Truck Available', 
                  badgeBn: 'ফ্রি ট্রাক এভেইলেবল', 
                  price: 8000, 
                  descEn: 'Full size covered freighter empty container returning to Dhaka port tonight. Half standard price.', 
                  descBn: 'চট্টগ্রাম থেকে সম্পূর্ণ খালি ১০ টনের কাভার্ড ভ্যান আজ রাতে ঢাকায় ফিরবে। ভাড়া অর্ধেক।',
                  verified: true,
                  role: 'business',
                  user: 'Chittagong Fleet Co.'
                },
                { 
                  id: 'feed_3', 
                  titleEn: 'Daily food merchant pickup subscription', 
                  titleBn: 'ফুড মার্চেন্ট ডেইলি পিকআপ সাবস্ক্রিপশন', 
                  badgeEn: 'Business Transport Deals', 
                  badgeBn: 'কর্পোরেট বিজেনস ডিল', 
                  price: 3500, 
                  descEn: 'Establish recurring dispatch routes for your online kitchen with dedicated hot-bag courier.', 
                  descBn: 'অনলাইন কিচেনের জন্য ডেডিকেটেড রাইডার সাবস্ক্রিপশন ডিল। ১ মাসের রেগুলার ডেলিভারি।',
                  verified: false,
                  role: 'seller',
                  user: 'Food Hub Ltd.'
                },
                { 
                  id: 'feed_4', 
                  titleEn: 'Pathao Courier Hub - Uttara 11', 
                  titleBn: 'পাঠাও কুরিয়ার হাব - উত্তরা ১১', 
                  badgeEn: 'Verified Logistics Providers', 
                  badgeBn: 'ভেরিফাইড লজিস্টিকস প্রোভাইডার', 
                  rating: '4.9 ★', 
                  descEn: 'Official logistics drop-off point with secure warehouse storage, NID check, and cash-on-delivery handling.', 
                  descBn: 'অফিসিয়াল লজিস্টিকস হাব যেখানে রয়েছে ওয়্যারহাউস স্টোরেজ, এনআইডি চেক ও সিওডি কালেকশন।',
                  verified: true,
                  role: 'business',
                  user: 'Pathao Express'
                }
              ].map(feed => (
                <div key={feed.id} className="p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-cyan-500/30 transition-all space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[8px] font-black uppercase bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/10">
                      {isBilingual ? feed.badgeBn : feed.badgeEn}
                    </span>
                    {feed.price && (
                      <p className="text-xs font-black text-cyan-400">৳{feed.price.toLocaleString()}</p>
                    )}
                    {feed.rating && (
                      <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {feed.rating}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-white group-hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                      {isBilingual ? feed.titleBn : feed.titleEn}
                      {feed.verified && <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {isBilingual ? feed.descBn : feed.descEn}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-white/5 text-[9px] text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3 h-3 text-cyan-500" />
                      Posted by: {feed.user}
                    </span>
                    <button 
                      onClick={() => {
                        setPickup('Savar, Dhaka');
                        setDrop('Dhanmondi, Dhaka');
                        if (feed.price) {
                          handleCategorySelect('local_delivery');
                        } else {
                          handleCategorySelect('courier');
                        }
                        toast.success('Feed parameters synced to checkout!');
                      }}
                      className="text-cyan-400 font-bold hover:underline flex items-center"
                    >
                      Use Deal <ArrowRight className="w-3 h-3 ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2. SERVICES LAYER GRID */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-base font-black text-white uppercase tracking-tight">
              {t('Browse 6-Layer Service Grid', 'সব সার্ভিস এবং কাস্টম ডেলিভারি বুকিং')}
            </h2>
          </div>
          
          <LogisticsServiceGrid 
            onSelect={handleCategorySelect} 
            activeCategory={activeCategory || undefined}
            isBilingual={isBilingual}
          />
        </section>

        {/* 3. DYNAMIC INTERACTIVE CUSTOM FLOW AREA */}
        <AnimatePresence mode="wait">
          {activeCategory && bookingStep !== 'selection' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="p-6 md:p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 space-y-6 relative overflow-hidden shadow-2xl"
            >
              {/* Close Button */}
              <div className="absolute top-4 right-4 z-10">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    setActiveCategory(null);
                    setBookingStep('selection');
                    setSelectedVehicle(null);
                    setFoodCart({});
                    setMultiStops([]);
                  }}
                  className="rounded-full bg-white/5 hover:bg-white/10 w-9 h-9"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Header Title based on Category */}
              <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
                <div>
                  <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest">{activeCategory.replace('_', ' ')}</span>
                  <h3 className="text-base font-black text-white">
                    {activeCategory === 'bike_ride' && t('Bike Ride Customization', 'বাইক রাইড বুকিং')}
                    {activeCategory === 'car_ride' && t('Car Ride Customization', 'কার রাইড বুকিং')}
                    {activeCategory === 'rent_car' && t('Premium Rent A Car Portal', 'রেন্ট-এ-কার বুকিং পোর্টাল')}
                    {activeCategory === 'food' && t('Food Delivery Ordering Engine', 'ফুড ডেলিভারি বুকিং এঞ্জিন')}
                    {activeCategory === 'local_delivery' && t('Local Area Same-Day Courier', 'লোকাল এরিয়া ডেলিভারি ফর্ম')}
                    {activeCategory === 'same_day' && t('Same-Day Express Package Delivery', 'সেম ডে এক্সপ্রেস ডেলিভারি')}
                    {activeCategory === 'courier' && t('Nationwide Doorstep Courier Engine', 'দেশব্যাপী কুরিয়ার সার্ভিস')}
                    {activeCategory === 'business_transport' && t('Business Corporate Freight Service', 'কর্পোরেট লজিস্টিকস ও ফ্রেইট')}
                    {activeCategory === 'truck' && t('Heavy Truck & Covered Van Dispatcher', 'ভারী ট্রাক ও কাভার্ড ভ্যান বুকিং')}
                    {activeCategory === 'emergency' && t('Urgent Priority Emergency Services', 'জরুরি সেবা এবং লাইভ ডিসপ্যাচ')}
                  </h3>
                </div>
              </div>

              {/* ── STEP 1: CUSTOM SERVICE FLOW DETAILS ── */}
              {bookingStep === 'custom_details' && (
                <div className="space-y-6">
                  
                  {/* Category: Rent A Car */}
                  {activeCategory === 'rent_car' && (
                    <div className="space-y-6">
                      <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 max-w-sm">
                        {(['daily', 'weekly', 'monthly'] as const).map((type) => (
                          <button
                            key={type}
                            onClick={() => setRentType(type)}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all capitalize ${
                              rentType === type ? 'bg-cyan-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {t(type, type === 'daily' ? 'দৈনিক' : type === 'weekly' ? 'সাপ্তাহিক' : 'মাসিক')}
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {RENT_CARS.map((car) => (
                          <div key={car.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-white text-sm">{isBilingual ? car.nameBn : car.nameEn}</h4>
                                <span className="text-[10px] text-amber-400 flex items-center gap-1 font-bold">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  {car.rating}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-1">{car.driver}</p>
                              <p className="text-xs text-slate-300 font-medium mt-2">{car.seats} {t('Seats Available', 'আসন বিশিষ্ট')}</p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                              <div>
                                <span className="text-base font-black text-white">৳{car.pricePerDay.toLocaleString()}</span>
                                <span className="text-[9px] text-slate-500 block">/{t('Day', 'দিন')}</span>
                              </div>
                              <Button 
                                size="sm" 
                                onClick={() => handleVehicleSelect({ id: car.id, nameEn: car.nameEn, price: car.pricePerDay })}
                                className="bg-cyan-500 hover:opacity-90 text-black rounded-xl font-bold text-xs cursor-pointer"
                              >
                                {t('Reserve Now', 'বুকিং করুন')}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category: Food Delivery */}
                  {activeCategory === 'food' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {FOOD_RESTAURANTS.map((rest) => (
                          <button
                            key={rest.id}
                            onClick={() => {
                              setSelectedRestaurant(rest.id);
                              setFoodCart({});
                            }}
                            className={`p-4 rounded-2xl border text-left flex items-center gap-4 transition-all cursor-pointer ${
                              selectedRestaurant === rest.id 
                                ? 'bg-[#e2136e]/10 border-[#e2136e]' 
                                : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                            }`}
                          >
                            <span className="text-3xl">{rest.img}</span>
                            <div>
                              <h4 className="font-bold text-white text-sm">{isBilingual ? rest.nameBn : rest.nameEn}</h4>
                              <p className="text-[10px] text-slate-400 mt-0.5">{rest.cuisines}</p>
                              <span className="text-[10px] text-amber-400 font-bold">{rest.rating}</span>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Items List */}
                      <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl space-y-4">
                        <h4 className="text-xs font-extrabold uppercase text-[#e2136e] tracking-widest">
                          {t('Recommended Menu', 'জনপ্রিয় খাবারসমূহ')}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {(FOOD_ITEMS[selectedRestaurant] || []).map((item) => (
                            <div key={item.id} className="p-4 rounded-xl bg-black/20 border border-white/5 flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{item.icon}</span>
                                <div>
                                  <p className="text-xs font-bold text-white">{isBilingual ? item.nameBn : item.nameEn}</p>
                                  <p className="text-xs text-[#e2136e] font-black mt-1">৳{item.price}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="icon"
                                  className="w-7 h-7 bg-white/5 hover:bg-white/10 text-white rounded-lg cursor-pointer"
                                  onClick={() => {
                                    setFoodCart(prev => ({
                                      ...prev,
                                      [item.id]: Math.max(0, (prev[item.id] || 0) - 1)
                                    }));
                                  }}
                                >
                                  -
                                </Button>
                                <span className="text-xs font-black min-w-4 text-center">{foodCart[item.id] || 0}</span>
                                <Button
                                  size="icon"
                                  className="w-7 h-7 bg-[#e2136e] hover:opacity-90 text-white rounded-lg cursor-pointer"
                                  onClick={() => {
                                    setFoodCart(prev => ({
                                      ...prev,
                                      [item.id]: (prev[item.id] || 0) + 1
                                    }));
                                  }}
                                >
                                  +
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {calculatedFoodTotal > 0 && (
                        <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                          <div>
                            <span className="text-xs text-slate-400 block">{t('Subtotal Amount', 'মোট খাবার মূল্য')}</span>
                            <span className="text-lg font-black text-white">৳{calculatedFoodTotal.toLocaleString()}</span>
                          </div>
                          <Button 
                            onClick={() => handleVehicleSelect({ id: 'food_dispatch', nameEn: 'Express Food Delivery', price: calculatedFoodTotal + 40 })}
                            className="bg-[#e2136e] hover:opacity-90 rounded-xl font-bold px-6 h-12 cursor-pointer"
                          >
                            {t('Proceed to Checkout', 'চেকআউট-এ এগিয়ে যান')}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Category: Local Delivery & Same Day */}
                  {(activeCategory === 'local_delivery' || activeCategory === 'same_day') && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            {t('Select Package Type', 'প্যাকেজের ধরণ')}
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {(['document', 'parcel', 'fragile', 'food'] as const).map((p) => (
                              <button
                                key={p}
                                onClick={() => setPackageType(p)}
                                className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                                  packageType === p 
                                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' 
                                    : 'bg-white/[0.02] border-white/5 text-slate-300'
                                }`}
                              >
                                <span className="text-xs font-bold capitalize">{p}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {activeCategory === 'same_day' && (
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                              {t('Choose Delivery Window', 'ডেলিভারি উইন্ডো')}
                            </label>
                            <div className="grid grid-cols-1 gap-3">
                              {[
                                { id: '2hr', name: '2 Hour Express', desc: 'Instant dispatch', price: 150 },
                                { id: '4hr', name: '4 Hour Courier', desc: 'Same day dispatch', price: 110 },
                                { id: 'sameday', name: 'Standard Same Day', desc: 'Deliver by tonight', price: 60 }
                              ].map((slot) => (
                                <button
                                  key={slot.id}
                                  onClick={() => setTimeSlot(slot.id as any)}
                                  className={`p-4 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                                    timeSlot === slot.id 
                                      ? 'bg-cyan-500/10 border-cyan-500' 
                                      : 'bg-white/[0.02] border-white/5'
                                  }`}
                                >
                                  <div>
                                    <p className="text-xs font-bold text-white">{slot.name}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{slot.desc}</p>
                                  </div>
                                  <span className="text-xs font-black text-cyan-400">৳{slot.price}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-white/5 text-right">
                        <Button
                          onClick={() => setBookingStep('vehicle')}
                          className="bg-cyan-500 hover:opacity-95 text-black rounded-xl font-bold px-6 h-12 cursor-pointer"
                        >
                          {t('Select Vehicle Option', 'যানবাহন নির্বাচন করুন')}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Category: Courier */}
                  {activeCategory === 'courier' && (
                    <div className="space-y-6">
                      <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 max-w-sm">
                        {(['inside', 'outside', 'nationwide'] as const).map((zone) => (
                          <button
                            key={zone}
                            onClick={() => setCourierZone(zone)}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all capitalize cursor-pointer ${
                              courierZone === zone ? 'bg-cyan-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {t(zone, zone === 'inside' ? 'ঢাকার ভেতরে' : zone === 'outside' ? 'ঢাকার বাইরে' : 'দেশব্যাপী')}
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">{t('Sender Details', 'প্রেরকের বিবরণ')}</h4>
                          <input 
                            type="text" 
                            placeholder={t('Sender Name', 'প্রেরকের নাম')}
                            value={senderName}
                            onChange={e => setSenderName(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl bg-black/40 border border-white/10 text-sm focus:border-cyan-500 outline-none"
                          />
                          <input 
                            type="text" 
                            placeholder={t('Sender Phone', 'প্রেরকের মোবাইল নম্বর')}
                            value={senderPhone}
                            onChange={e => setSenderPhone(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl bg-black/40 border border-white/10 text-sm focus:border-cyan-500 outline-none"
                          />
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">{t('Receiver Details', 'প্রাপকের বিবরণ')}</h4>
                          <input 
                            type="text" 
                            placeholder={t('Receiver Name', 'প্রাপকের নাম')}
                            value={receiverName}
                            onChange={e => setReceiverName(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl bg-black/40 border border-white/10 text-sm focus:border-cyan-500 outline-none"
                          />
                          <input 
                            type="text" 
                            placeholder={t('Receiver Phone', 'প্রাপকের মোবাইল নম্বর')}
                            value={receiverPhone}
                            onChange={e => setReceiverPhone(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl bg-black/40 border border-white/10 text-sm focus:border-cyan-500 outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-xs font-bold text-slate-400 uppercase">{t('Package Weight (Kg)', 'প্যাকেজের ওজন (কেজি)')}</label>
                          <span className="text-sm font-black text-white">{weightKg} Kg</span>
                        </div>
                        <input 
                          type="range" 
                          min="1" 
                          max="20" 
                          value={weightKg}
                          onChange={e => setWeightKg(Number(e.target.value))}
                          className="w-full accent-cyan-500"
                        />
                      </div>

                      <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                        <div>
                          <span className="text-xs text-slate-400 block">{t('Calculated Rate', 'ক্যালকুলেটেড রেট')}</span>
                          <span className="text-lg font-black text-cyan-400">৳{calculatedCourierCharge.toLocaleString()}</span>
                        </div>
                        <Button 
                          onClick={() => handleVehicleSelect({ id: 'courier_express', nameEn: 'Express Doorstep Courier', price: calculatedCourierCharge })}
                          className="bg-cyan-500 hover:opacity-95 text-black rounded-xl font-bold px-6 h-12 cursor-pointer"
                        >
                          {t('Dispatch Parcel', 'পার্সেল বুকিং করুন')}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Category: Emergency */}
                  {activeCategory === 'emergency' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { id: 'emergency_rider', name: 'Emergency Rider', desc: 'Medicines & Documents', icon: Bike, color: 'border-rose-500/30 text-rose-400' },
                          { id: 'ambulance', name: 'Priority Ambulance', desc: 'Fast Patient Transport', icon: Car, color: 'border-red-500/30 text-red-400' },
                          { id: 'urgent_medicine', name: 'Oxygen & First-Aid', desc: 'Immediate medical delivery', icon: Package, color: 'border-orange-500/30 text-orange-400' }
                        ].map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setEmergencyType(item.id as any)}
                            className={`p-5 rounded-2xl border text-left flex flex-col gap-3 transition-all cursor-pointer ${
                              emergencyType === item.id 
                                ? 'bg-red-500/10 border-red-500' 
                                : 'bg-white/[0.02] border-white/5'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <item.icon className="w-6 h-6" />
                              <span className="text-[8px] font-bold bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full uppercase">Priority</span>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">{item.name}</p>
                              <p className="text-[10px] text-slate-400 mt-1">{item.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
                        <p className="text-xs text-red-200">
                          {t('Emergency bookings bypass queue and trigger standard highest priority dispatch nearby.', 'জরুরি বুকিং সরাসরি নিকটবর্তী রাইডারকে সর্বোচ্চ গুরুত্বের সাথে ডিসপ্যাচ করে।')}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/5 text-right">
                        <Button
                          onClick={() => handleVehicleSelect({ id: 'emergency_ambulance', nameEn: 'Immediate Dispatch Unit', price: emergencyType === 'ambulance' ? 2500 : 350 })}
                          className="bg-red-600 hover:bg-red-500 rounded-xl font-bold px-6 h-12 cursor-pointer"
                        >
                          {t('Trigger Dispatch Now', 'জরুরি ডিসপ্যাচ রিকোয়েস্ট')}
                        </Button>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* ── STEP 2: Vehicle Selection Flow ── */}
              {bookingStep === 'vehicle' && (
                <LogisticsVehicleSelection 
                  category={activeCategory} 
                  onSelect={handleVehicleSelect}
                  selectedId={selectedVehicle?.id}
                  isBilingual={isBilingual}
                />
              )}

              {/* ── STEP 3: Unified Payment Engine ── */}
              {bookingStep === 'payment' && selectedVehicle && (
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-black text-white mb-6 text-center flex items-center justify-center gap-2">
                    <Wallet className="w-5 h-5 text-cyan-400" />
                    {t('Select Payment Gateway', 'পেমেন্ট গেটওয়ে ও ভাড়া বিবরণ')}
                  </h3>

                  {/* Smart Fare Breakdown */}
                  <div className="mb-6 p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs">
                    <h4 className="font-extrabold uppercase text-slate-400 tracking-wider text-[10px] pb-1.5 border-b border-white/5 flex justify-between">
                      <span>{t('Fare Cost Breakdown', 'ভাড়ার বিস্তারিত বিবরণ')}</span>
                      <span className="text-cyan-400">{selectedVehicle.nameEn}</span>
                    </h4>
                    <div className="flex justify-between text-slate-300">
                      <span>{t('Base Price', 'মূল ভাড়া')}</span>
                      <span className="font-mono">৳{selectedVehicle.basePrice || Math.round(selectedVehicle.price * 0.6)}</span>
                    </div>
                    {selectedVehicle.weatherSurge && (
                      <div className="flex justify-between text-blue-400 font-bold">
                        <span>🌧️ {t('Rain Monsoon Surcharge (+25%)', 'বর্ষা বৃষ্টি সারচার্জ (+২৫%)')}</span>
                        <span className="font-mono">+৳{Math.round((selectedVehicle.basePrice || selectedVehicle.price * 0.6) * 0.25)}</span>
                      </div>
                    )}
                    {selectedVehicle.trafficSurge && (
                      <div className="flex justify-between text-amber-400 font-bold">
                        <span>🚗 {t('Peak Hour Traffic Surcharge (+35%)', 'ব্যস্ত সময় ট্রাফিক সারচার্জ (+৩৫%)')}</span>
                        <span className="font-mono">+৳{Math.round((selectedVehicle.basePrice || selectedVehicle.price * 0.6) * 0.35)}</span>
                      </div>
                    )}
                    {selectedVehicle.stopsCount > 0 && (
                      <div className="flex justify-between text-indigo-400 font-bold">
                        <span>📍 {t(`Multi-stop Surcharge (${selectedVehicle.stopsCount} Stops)`, `মাল্টি-স্টপ সারচার্জ (${selectedVehicle.stopsCount} স্টপ)`)}</span>
                        <span className="font-mono">+৳{Math.round((selectedVehicle.basePrice || selectedVehicle.price * 0.6) * 0.4 * selectedVehicle.stopsCount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-white/5 font-black text-white text-sm">
                      <span>{t('Total Estimated Price', 'সর্বমোট নির্ধারিত ভাড়া')}</span>
                      <span className="text-cyan-400 font-mono">৳{selectedVehicle.price}</span>
                    </div>
                  </div>
                  
                  {/* Embedded triple wallet stats */}
                  <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="border-r border-white/5">
                      <p className="text-slate-400">BDT Wallet</p>
                      <span className="font-mono text-white text-xs font-bold">৳{balance}</span>
                    </div>
                    <div className="border-r border-white/5">
                      <p className="text-slate-400">PK Coins</p>
                      <span className="font-mono text-cyan-400 text-xs font-bold">{coins} PKC</span>
                    </div>
                    <div>
                      <p className="text-slate-400">Shipping Credits</p>
                      <span className="font-mono text-blue-400 text-xs font-bold">৳{shippingCredits}</span>
                    </div>
                  </div>

                  <UnifiedPaymentForm 
                    amount={selectedVehicle.price} 
                    orderId={`PEND-${Date.now().toString(36).toUpperCase()}`} 
                    onSuccess={handlePaymentSuccess}
                    isBilingual={isBilingual}
                  />
                </div>
              )}

              {/* ── STEP 4: Live Delivery Tracking with Route Visualizer & POD ── */}
              {bookingStep === 'tracking' && currentOrderId && (
                <div className="max-w-md mx-auto space-y-6">
                  
                  {/* Route Visualizer Simulated Box */}
                  <div className="h-28 rounded-2xl bg-black/40 border border-white/5 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute left-6 right-6 h-0.5 bg-dashed bg-white/10" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 50%)', backgroundSize: '10px 2px' }} />
                    
                    {/* Start point */}
                    <div className="absolute left-6 flex flex-col items-center gap-1">
                      <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500 flex items-center justify-center text-cyan-400">
                        <MapPin className="w-3 h-3" />
                      </div>
                      <span className="text-[8px] text-slate-400">Pickup</span>
                    </div>

                    {/* Intermediate Multi-Stops */}
                    {selectedVehicle && selectedVehicle.stopsCount > 0 && Array.from({ length: selectedVehicle.stopsCount }).map((_, sIdx) => {
                      const percentagePosition = ((sIdx + 1) / (selectedVehicle.stopsCount + 1)) * 100;
                      return (
                        <div 
                          key={sIdx} 
                          className="absolute flex flex-col items-center gap-1"
                          style={{ left: `calc(1.5rem + (100% - 3rem) * ${percentagePosition / 100})`, transform: 'translateX(-50%)' }}
                        >
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center border text-[8px] font-black transition-all ${
                            mapProgress >= percentagePosition 
                              ? 'bg-blue-500/20 border-blue-400 text-blue-300 ring-2 ring-blue-500/20' 
                              : 'bg-zinc-900 border-zinc-700 text-zinc-500'
                          }`}>
                            {sIdx + 1}
                          </div>
                          <span className="text-[7px] text-slate-500 font-extrabold">Stop {sIdx + 1}</span>
                        </div>
                      );
                    })}

                    {/* Animated moving vehicle */}
                    <div 
                      className="absolute left-6 right-6 transition-all duration-300"
                      style={{ transform: `translateX(${mapProgress}%)` }}
                    >
                      <div className="w-8 h-8 rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/25 flex items-center justify-center text-black">
                        <Navigation className="w-4 h-4 rotate-90 animate-pulse" />
                      </div>
                    </div>

                    {/* End point */}
                    <div className="absolute right-6 flex flex-col items-center gap-1">
                      <div className="w-6 h-6 rounded-full bg-rose-500/20 border border-rose-500 flex items-center justify-center text-rose-400">
                        <MapPin className="w-3 h-3" />
                      </div>
                      <span className="text-[8px] text-slate-400">Drop</span>
                    </div>
                  </div>

                  <UnifiedDeliveryTracking 
                    status={mapProgress >= 100 ? "DELIVERED" : "RIDER_ASSIGNED"} 
                    orderId={currentOrderId} 
                    isBilingual={isBilingual}
                  />

                  {/* Rider / Driver Reputation card */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">MR</div>
                      <div>
                        <h4 className="text-xs font-bold text-white flex items-center gap-1">
                          Masud Rana 
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                        </h4>
                        <p className="text-[9px] text-slate-400">Reputation Score: <span className="text-cyan-400">99.1% On-Time</span></p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1 justify-end">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        4.9
                      </span>
                      <p className="text-[8px] text-slate-500">DHAKA-METRO-LA-9988</p>
                    </div>
                  </div>

                  {/* ── Proof of Delivery (POD) Interactive Section ── */}
                  {mapProgress >= 100 && podStep !== 'verified' && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-5 rounded-2xl bg-[#0b130e] border border-cyan-500/30 space-y-4"
                    >
                      <div className="flex gap-2 items-center">
                        <Award className="w-5 h-5 text-cyan-400 animate-bounce" />
                        <h4 className="text-xs font-black text-white uppercase tracking-wider">{t('Proof of Delivery (POD) Gates', 'ডেলিভারি ভেরিফিকেশন গেট')}</h4>
                      </div>

                      {podStep === 'photo' && (
                        <div className="space-y-3">
                          <p className="text-[10px] text-slate-300">
                            {t('Please simulate uploading a recipient or parcel delivery photo to proceed.', 'প্রাপক বা পার্সেলের ছবি আপলোড ভেরিফিকেশন করুন।')}
                          </p>
                          <div className="h-32 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center bg-black/40 relative overflow-hidden">
                            {podPhoto ? (
                              <img src={podPhoto} alt="POD" className="object-cover h-full w-full" referrerPolicy="no-referrer" />
                            ) : (
                              <button 
                                onClick={() => {
                                  setPodPhoto('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=300&q=80');
                                  toast.success('Simulated photo upload complete!');
                                }}
                                className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-white text-[11px]"
                              >
                                <Camera className="w-6 h-6 text-cyan-400" />
                                {t('Upload Delivery Photo', 'ডেলিভারি পিকচার আপলোড')}
                              </button>
                            )}
                          </div>
                          {podPhoto && (
                            <Button onClick={() => setPodStep('signature')} className="w-full bg-cyan-500 text-black font-bold h-10 text-xs">
                              {t('Proceed to Recipient Signature', 'স্বাক্ষর গ্রহণ ফ্লো')}
                            </Button>
                          )}
                        </div>
                      )}

                      {podStep === 'signature' && (
                        <div className="space-y-3">
                          <p className="text-[10px] text-slate-300">
                            {t('Collect recipient digital signature below:', 'প্রাপকের ডিজিটাল স্বাক্ষর গ্রহণ করুন:')}
                          </p>
                          <div className="border border-white/10 rounded-xl overflow-hidden bg-black relative">
                            <canvas 
                              ref={canvasRef}
                              width={320}
                              height={120}
                              onMouseDown={startDrawing}
                              onMouseUp={stopDrawing}
                              onMouseLeave={stopDrawing}
                              onMouseMove={draw}
                              className="w-full h-[120px] cursor-crosshair"
                            />
                            <button 
                              onClick={clearCanvas} 
                              className="absolute top-2 right-2 text-[8px] bg-white/10 px-2 py-1 rounded font-bold"
                            >
                              Clear
                            </button>
                          </div>
                          <Button 
                            onClick={() => setPodStep('otp')} 
                            disabled={!podSignature}
                            className="w-full bg-cyan-500 text-black font-bold h-10 text-xs disabled:opacity-50"
                          >
                            {t('Proceed to OTP verification', 'ওটিপি ভেরিফিকেশন ফ্লো')}
                          </Button>
                        </div>
                      )}

                      {podStep === 'otp' && (
                        <div className="space-y-3">
                          <p className="text-[10px] text-slate-300">
                            {t('Verify destination recipient via SMS secure OTP code:', 'সিকিউর এসএমএস ওটিপি কোড দিয়ে ভেরিফাই করুন:')}
                          </p>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="Enter 4-digit code"
                              value={podOtp}
                              onChange={e => setPodOtp(e.target.value)}
                              className="flex-1 bg-black border border-white/10 rounded-lg p-2 text-xs text-center font-mono tracking-widest text-white focus:border-cyan-500 outline-none"
                            />
                            {!podOtpSent ? (
                              <Button onClick={sendPodOtp} className="bg-white/5 hover:bg-white/10 text-xs h-10 px-3">
                                Send Code
                              </Button>
                            ) : (
                              <span className="text-[9px] text-cyan-400 self-center font-bold">Code sent (use 1234)</span>
                            )}
                          </div>
                          <Button onClick={verifyPodOtp} className="w-full bg-cyan-500 text-black font-bold h-10 text-xs">
                            {t('Verify OTP & Complete Delivery', 'ওটিপি ভেরিফাই করে সম্পন্ন করুন')}
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {podStep === 'verified' && (
                    <motion.div 
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center gap-3"
                    >
                      <UserCheck className="w-6 h-6 text-cyan-400 shrink-0" />
                      <div>
                        <h5 className="text-xs font-bold text-white">Recipient Verified Complete</h5>
                        <p className="text-[10px] text-slate-400">Signature and OTP match standard checkout gates.</p>
                      </div>
                    </motion.div>
                  )}

                  <div className="pt-4 border-t border-white/5 flex gap-3">
                    <Button className="flex-1 bg-white/5 border border-white/10 rounded-xl font-bold h-12 text-xs cursor-pointer">
                      <Phone className="w-4 h-4 mr-1.5 text-cyan-400" />
                      {t('Call Dispatch Hub', 'হাব বা চালককে কল দিন')}
                    </Button>
                    <Button 
                      onClick={() => {
                        setActiveCategory(null);
                        setBookingStep('selection');
                        setSelectedVehicle(null);
                        setFoodCart({});
                        setMultiStops([]);
                      }}
                      className="flex-1 bg-cyan-500 hover:opacity-95 text-black rounded-xl font-bold h-12 text-xs cursor-pointer"
                    >
                      {t('Finish & Return', 'সম্পন্ন করুন')}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── ECOSYSTEM COMMERCE & ADVANCED CENTER (Phases 2 & 4) ── */}
        <section className="p-6 md:p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400 animate-pulse" />
                Commerce Logistics Ecosystem
              </span>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                {t('Advanced Merchant Logistics Center', 'অগ্রসর মার্চেন্ট লজিস্টিকস হাব')}
              </h2>
            </div>
            {/* Quick stats */}
            <div className="flex gap-4 text-xs font-mono bg-black/40 p-3 rounded-2xl border border-white/5">
              <div className="text-center px-2">
                <span className="text-slate-400 block text-[9px] uppercase">Corporate Credit</span>
                <span className="text-cyan-400 font-black">৳{shippingCredits.toLocaleString()}</span>
              </div>
              <div className="border-l border-white/10" />
              <div className="text-center px-2">
                <span className="text-slate-400 block text-[9px] uppercase">B2B Scheduled</span>
                <span className="text-white font-black">{recurringSubscriptions.length} Jobs</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation buttons */}
          <div className="flex flex-wrap gap-2 pb-1 border-b border-white/5">
            {[
              { id: 'providers', labelEn: 'Verified Carrier Storefronts', labelBn: 'ভেরিফায়েড ক্যারিয়ার', icon: Store },
              { id: 'coverage', labelEn: 'Hub Coverage Map', labelBn: 'হাব কভারেজ ম্যাপ', icon: MapIcon },
              { id: 'b2b', labelEn: 'B2B Bulk & Scheduler', labelBn: 'বিটুবি শিডিউলার', icon: Calendar },
              { id: 'returns', labelEn: 'Reverse Logistics & Returns', labelBn: 'রিভার্স রিটার্নস', icon: RefreshCw },
              { id: 'wallet', labelEn: 'Corporate Shipping Wallet', labelBn: 'লজিস্টিকস ওয়ালেট', icon: Wallet }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setLogisticsTab(tab.id as any);
                  setSelectedProviderId(null);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  logisticsTab === tab.id 
                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20 font-black' 
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{isBilingual ? tab.labelBn : tab.labelEn}</span>
              </button>
            ))}
          </div>

          {/* TAB CONTENTS */}
          <div className="min-h-[220px]">
            {logisticsTab === 'providers' && (
              <div className="space-y-6">
                {!selectedProviderId ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                    {[
                      { id: 'pathao', name: 'Pathao Courier', descEn: 'Bangladesh premier instant on-demand cargo & parcel network.', descBn: 'অন-ডিমান্ড ও ইন্সট্যান্ট কুরিয়ারে দেশের সবচেয়ে বড় নেটওয়ার্ক।', rating: '4.8', hubs: '64 Districts', price: '৳60', speed: 'Same Day/Next Day', icon: '⚡' },
                      { id: 'paperfly', name: 'Paperfly Delivery', descEn: 'Next-gen e-commerce cargo specialized bulk delivery service.', descBn: 'ই-কমার্স বাল্ক বা বেশি পরিমাণের প্রোডাক্ট পরিবহনে পারফেক্ট ক্যারিয়ার।', rating: '4.6', hubs: 'Nationwide (4,400+ Unions)', price: '৳50', speed: '24-48 Hours', icon: '📦' },
                      { id: 'redx', name: 'RedX Logistics', descEn: 'Advanced tech-driven bulk freight & nationwide parcel supply chain.', descBn: 'দেশব্যাপী কভারেজ ও হাই-টেক কুরিয়ার এবং ফ্রেইট ডেলিভারি।', rating: '4.5', hubs: '64 Districts (All Upazilas)', price: '৳110', speed: 'Next Day', icon: '🚛' },
                      { id: 'ecourier', name: 'eCourier Corporate', descEn: 'Premium high-security priority parcel & valuable shipping handler.', descBn: 'কর্পোরেট কাস্টমারদের জন্য স্পেশাল এয়ার কার্গো ও হাই-সিকিউরড শিপিং।', rating: '4.7', hubs: 'Dhaka & Chittagong Ports', price: '৳150', speed: 'Same Day Express', icon: '🔐' }
                    ].map(provider => (
                      <div key={provider.id} className="p-5 rounded-2xl bg-black/30 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{provider.icon}</span>
                            <h4 className="font-extrabold text-white text-sm">{provider.name}</h4>
                            <span className="text-[9px] bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded font-black uppercase">Verified</span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-normal">
                            {isBilingual ? provider.descBn : provider.descEn}
                          </p>
                          <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] text-slate-500">
                            <div>📍 Hubs: <span className="text-slate-300 font-bold">{provider.hubs}</span></div>
                            <div>⏱️ Speed: <span className="text-cyan-400 font-bold">{provider.speed}</span></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between border-t border-white/5 pt-3">
                          <div className="flex items-center gap-1 bg-yellow-500/15 text-yellow-400 text-[10px] px-2 py-0.5 rounded font-black">
                            <Star className="w-3 h-3 fill-yellow-400" />
                            {provider.rating}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => setSelectedProviderId(provider.id)}
                            className="bg-white/5 hover:bg-white/10 text-[10px] border border-white/10 h-8 font-bold rounded-lg"
                          >
                            {t('Rates & Details', 'রেট ও বিবরণী')}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-black/30 border border-white/5 rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-white/5">
                      <button
                        onClick={() => setSelectedProviderId(null)}
                        className="text-[10px] text-slate-400 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                      >
                        ← {t('Back to Providers', 'ক্যারিয়ার তালিকায় ফেরত যান')}
                      </button>
                      <span className="text-[10px] font-mono text-cyan-400 uppercase font-black tracking-widest">Active Rate Matrix</span>
                    </div>
                    
                    {selectedProviderId === 'pathao' && (
                      <div className="space-y-4">
                        <h4 className="font-black text-white text-base">Pathao Courier Storefront & Service Level Agreement</h4>
                        <p className="text-xs text-slate-400">Official third-party API integration established. All rates are updated live including Bangladesh VAT rules.</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                            <span className="text-[9px] uppercase text-slate-500 font-bold font-mono">Standard Delivery</span>
                            <p className="text-lg font-mono text-white font-black pt-1">৳60 <span className="text-[10px] text-slate-400">/ 1Kg</span></p>
                            <span className="text-[9px] text-cyan-400 font-extrabold">Next-day Guaranteed</span>
                          </div>
                          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                            <span className="text-[9px] uppercase text-slate-500 font-bold font-mono">Same Day Express</span>
                            <p className="text-lg font-mono text-white font-black pt-1">৳110 <span className="text-[10px] text-slate-400">/ 1Kg</span></p>
                            <span className="text-[9px] text-cyan-400 font-extrabold">Within 6 Hours (Dhaka Metro)</span>
                          </div>
                          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                            <span className="text-[9px] uppercase text-slate-500 font-bold font-mono">Nationwide Dropoff</span>
                            <p className="text-lg font-mono text-white font-black pt-1">৳120 <span className="text-[10px] text-slate-400">/ 1Kg</span></p>
                            <span className="text-[9px] text-cyan-400 font-extrabold">48-Hour Delivery Nationwide</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {selectedProviderId !== 'pathao' && (
                      <div className="space-y-4">
                        <h4 className="font-black text-white text-base uppercase">SLA & Corporate Rates</h4>
                        <p className="text-xs text-slate-400">Verified e-commerce carrier rate sheet under 2026 super-logistics commerce contract.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300 font-mono">
                          <div className="p-3 rounded-lg bg-white/5 flex justify-between">
                            <span>0 - 1 Kg:</span>
                            <span className="text-cyan-400 font-bold">৳55</span>
                          </div>
                          <div className="p-3 rounded-lg bg-white/5 flex justify-between">
                            <span>1 - 2 Kg:</span>
                            <span className="text-cyan-400 font-bold">৳80</span>
                          </div>
                          <div className="p-3 rounded-lg bg-white/5 flex justify-between">
                            <span>2 - 5 Kg:</span>
                            <span className="text-cyan-400 font-bold">৳120</span>
                          </div>
                          <div className="p-3 rounded-lg bg-white/5 flex justify-between">
                            <span>Over 5 Kg:</span>
                            <span className="text-cyan-400 font-bold">৳220 + ৳20/Kg</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="pt-3 border-t border-white/5 flex gap-3">
                      <Button
                        onClick={() => {
                          toast.success(t('Carrier selected for next checkout dispatch!', 'পরবর্তী বুকিংয়ে এই ক্যারিয়ার ডিফল্ট হিসেবে সেট হয়েছে!'));
                          setSelectedProviderId(null);
                        }}
                        className="flex-1 bg-cyan-500 hover:opacity-95 text-black font-bold h-10 rounded-xl text-xs cursor-pointer"
                      >
                        {t('Partner with this Carrier', 'এই ক্যারিয়ারের সাথে যুক্ত হোন')}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {logisticsTab === 'coverage' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Filter Sidebar */}
                  <div className="space-y-4 p-4 rounded-2xl bg-black/30 border border-white/5">
                    <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest block">{t('Filter Division', 'বিভাগ ফিল্টার করুন')}</label>
                    <div className="flex flex-col gap-1.5">
                      {['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi'].map(div => (
                        <button
                          key={div}
                          onClick={() => setSelectedDivision(div)}
                          className={`p-2 px-3 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${
                            selectedDivision === div 
                              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' 
                              : 'bg-transparent text-slate-400 hover:text-white'
                          }`}
                        >
                          📍 {div}
                        </button>
                      ))}
                    </div>
                    
                    <div className="space-y-1.5 pt-2">
                      <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest block">{t('Search District/Area', 'জেলা/এরিয়া খুঁজুন')}</label>
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          placeholder={t('Type district name...', ' can-type জেলা বা এরিয়া...')}
                          value={districtSearch}
                          onChange={e => setDistrictSearch(e.target.value)}
                          className="w-full h-10 pl-9 pr-4 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:border-cyan-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Active Coverage Grid */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase text-slate-400 font-extrabold">{t(`Coverage Area List (${selectedDivision})`, `কভারেজ হাব তালিকা (${selectedDivision})`)}</span>
                      <span className="text-[9px] bg-cyan-500/15 text-cyan-400 px-2 py-0.5 rounded-full font-bold">Nationwide Reach 100%</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1">
                      {[
                        { division: 'Dhaka', district: 'Dhanmondi Hub', zip: '1209', agent: 'Kamrul Islam', phone: '01899123456', time: 'Same Day (6h)', hubs: '🟢 Active Hub' },
                        { division: 'Dhaka', district: 'Gulshan Prime Hub', zip: '1212', agent: 'Arifur Rahman', phone: '01712009988', time: 'Same Day (4h)', hubs: '🟢 Active Hub' },
                        { division: 'Dhaka', district: 'Mirpur Mega Hub', zip: '1216', agent: 'Zakir Hossain', phone: '01915667788', time: 'Next Day (24h)', hubs: '🟢 Active Hub' },
                        { division: 'Dhaka', district: 'Savar Regional Hub', zip: '1340', agent: 'Nazmul Huda', phone: '01511223344', time: '24-48 Hours', hubs: '🟠 Sub-Hub' },
                        { division: 'Chittagong', district: 'Halishahar Main Hub', zip: '4216', agent: 'Tanvir Alam', phone: '01300998877', time: 'Next Day', hubs: '🟢 Active Hub' },
                        { division: 'Chittagong', district: 'Agrabad Trade Hub', zip: '4100', agent: 'Imran Chowdhury', phone: '01819776655', time: 'Same Day (8h)', hubs: '🟢 Active Hub' },
                        { division: 'Sylhet', district: 'Zindabazar Hub', zip: '3100', agent: 'Saleh Ahmed', phone: '01711223300', time: 'Next Day (24h)', hubs: '🟢 Active Hub' },
                        { division: 'Rajshahi', district: 'Shaheb Bazar Hub', zip: '6000', agent: 'Mizanur Rahman', phone: '01925112233', time: 'Next Day (24h)', hubs: '🟢 Active Hub' }
                      ]
                      .filter(item => item.division === selectedDivision)
                      .filter(item => item.district.toLowerCase().includes(districtSearch.toLowerCase()))
                      .map((item, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-extrabold text-white text-xs">{item.district}</h5>
                              <span className="text-[9px] text-slate-500 font-mono">ZIP: {item.zip}</span>
                            </div>
                            <span className="text-[8px] bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded font-black uppercase">{item.hubs}</span>
                          </div>
                          <div className="mt-2 pt-2 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-400">
                            <span>Speed: <strong className="text-cyan-400">{item.time}</strong></span>
                            <span className="cursor-pointer text-slate-300 hover:text-white font-bold" onClick={() => toast.info(`Call Agent ${item.agent}: ${item.phone}`)}>📞 Contact Hub</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {logisticsTab === 'b2b' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Scheduler controls */}
                  <div className="space-y-4 p-5 rounded-2xl bg-black/30 border border-white/5 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-cyan-400" />
                        {t('Active Corporate Subscriptions', 'সক্রিয় কর্পোরেট শিডিউলার')}
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-normal">Configure automated daily/weekly shipping dispatches for your e-commerce shop without manual checkout each time.</p>
                      
                      <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 mt-3">
                        {recurringSubscriptions.map(sub => (
                          <div key={sub.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center text-xs">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] uppercase font-black tracking-widest bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded">
                                  {sub.frequency}
                                </span>
                                <span className="font-bold text-white">{sub.pickupTime}</span>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-1 truncate max-w-[200px]">{sub.route}</p>
                            </div>
                            <button
                              onClick={() => {
                                setRecurringSubscriptions(prev => prev.filter(s => s.id !== sub.id));
                                toast.success(t('Subscription canceled successfully.', 'শিডিউল সাবস্ক্রিপশন বাতিল করা হয়েছে।'));
                              }}
                              className="text-[10px] text-rose-400 hover:text-rose-300 font-extrabold cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={() => {
                        setRecurringSubscriptions(prev => [
                          ...prev,
                          { id: `sub_${Date.now()}`, frequency: 'daily', pickupTime: '11:00 AM', route: 'Banani Hub to Mirpur Sub-Hub', active: true }
                        ]);
                        toast.success(t('New simulated daily dispatch job established!', 'নতুন ডেইলি শিডিউল জব যুক্ত হয়েছে!'));
                      }}
                      className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold h-9 mt-3 cursor-pointer"
                    >
                      + Create Custom Schedule Dispatch
                    </Button>
                  </div>

                  {/* B2B Bulk Upload CSV simulation */}
                  <div className="space-y-4 p-5 rounded-2xl bg-black/30 border border-white/5 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-cyan-400" />
                        {t('B2B Bulk CSV / Text Ingestion', 'বিটুবি বাল্ক অর্ডার আপলোড')}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-normal">Paste multiple deliveries in comma-separated format (Format: Customer Name, Location, Phone, COD Amount) to dispatch instantly!</p>
                      
                      <textarea
                        rows={3}
                        placeholder="Anika Fashion, Dhanmondi, 01712345678, 1200&#10;Bhai Bhai Store, Savar, 01911122233, 850&#10;Dhaka Tech, Uttara, 01555443322, 3100"
                        value={bulkUploadText}
                        onChange={e => setBulkUploadText(e.target.value)}
                        className="w-full mt-3 p-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-slate-600 outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>

                    <div className="pt-2 flex gap-3">
                      <button
                        onClick={() => {
                          setBulkUploadText("Sultana Weaves, Gulshan, 01888990011, 4500\nPriyo Book, Mirpur, 01777223344, 1800");
                          toast.info(t('Mock CSV loaded!', 'নমুনা টেক্সট লোড করা হয়েছে!'));
                        }}
                        className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] text-slate-300 font-bold hover:bg-white/10 transition-all cursor-pointer"
                      >
                        Load Sample
                      </button>
                      <Button
                        size="sm"
                        onClick={() => {
                          if (!bulkUploadText.trim()) {
                            toast.error(t('Please enter bulk data first.', 'অনুগ্রহ করে প্রথমে বাল্ক ডেটা প্রবেশ করুন।'));
                            return;
                          }
                          const lines = bulkUploadText.split('\n').filter(l => l.trim().length > 0);
                          const newJobs = lines.map((line, idx) => {
                            const parts = line.split(',');
                            return {
                              id: `b2b_bulk_${Date.now()}_${idx}`,
                              customer: parts[0]?.trim() || 'Custom Client',
                              location: parts[1]?.trim() || 'Dhaka Metro',
                              phone: parts[2]?.trim() || '017XXXXXXXX',
                              amount: Number(parts[3]?.trim()) || 500,
                              status: 'Processing',
                              date: '2026-06-25'
                            };
                          });
                          setB2bDeliveries(prev => [...newJobs, ...prev]);
                          setBulkUploadText('');
                          toast.success(t(`Ingested ${newJobs.length} bulk deliveries successfully!`, `সফলভাবে ${newJobs.length} টি বাল্ক ডেলিভারি ডাটা প্রসেস করা হয়েছে!`));
                        }}
                        className="flex-1 bg-cyan-500 hover:opacity-95 text-black font-bold h-9 text-xs cursor-pointer"
                      >
                        ⚡ Process & Queue Bulk
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Bulk Ingested Active Delivery Board */}
                <div className="p-5 rounded-2xl bg-black/30 border border-white/5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase text-slate-400 font-extrabold tracking-wider">{t('Corporate Bulk Dispatch queue', 'কর্পোরেট বাল্ক ডেলিভারি ট্র্যাকিং কিউ')}</span>
                    <span className="text-[9px] bg-cyan-500/10 text-cyan-400 px-2.5 py-0.5 rounded-full font-bold">Live Status Feed</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 text-slate-500 text-[10px] uppercase font-black">
                          <th className="pb-2">Order ID</th>
                          <th className="pb-2">Merchant Client</th>
                          <th className="pb-2">Destination</th>
                          <th className="pb-2">COD Amount</th>
                          <th className="pb-2">Status</th>
                          <th className="pb-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {b2bDeliveries.map((job) => (
                          <tr key={job.id} className="hover:bg-white/[0.02] transition-all">
                            <td className="py-2.5 font-mono text-[10px] text-slate-400">#{job.id.substring(0, 10)}</td>
                            <td className="py-2.5 font-bold text-white">{job.customer}</td>
                            <td className="py-2.5 text-slate-300 text-[11px]">{job.location}</td>
                            <td className="py-2.5 font-mono font-bold text-cyan-400">৳{job.amount}</td>
                            <td className="py-2.5">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                job.status === 'Delivered' ? 'bg-cyan-500/15 text-cyan-400' :
                                job.status === 'In Transit' ? 'bg-blue-500/15 text-blue-400' : 'bg-amber-500/15 text-amber-400'
                              }`}>
                                {job.status}
                              </span>
                            </td>
                            <td className="py-2.5 text-right">
                              <button
                                onClick={() => {
                                  setB2bDeliveries(prev => prev.map(p => p.id === job.id ? { ...p, status: p.status === 'Processing' ? 'In Transit' : p.status === 'In Transit' ? 'Delivered' : 'Processing' } : p));
                                  toast.info(t('Simulating dispatch stage update!', 'ডেলিভারি স্টেজ পরিবর্তন সফল হয়েছে!'));
                                }}
                                className="text-[10px] text-cyan-400 hover:underline font-bold cursor-pointer"
                              >
                                Update SLA
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {logisticsTab === 'returns' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Returns request form */}
                  <div className="p-5 rounded-2xl bg-black/30 border border-white/5 space-y-4">
                    <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                      <RefreshCw className="w-4 h-4 text-rose-400" />
                      {t('File Reverse Return & Merchant Exchange', 'রিভার্স কাস্টমার রিটার্ন ফর্ম')}
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-normal">Request quick reverse carrier pickup from buyer doorstep to easily process exchange, refund, or quality evaluation.</p>
                    
                    <div className="space-y-3 pt-2">
                      <div>
                        <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block mb-1">Item Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Premium Silk Sharee or Jamdani Panjabi"
                          value={returnItemName}
                          onChange={e => setReturnItemName(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white outline-none focus:border-rose-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block mb-1">Reason for Return</label>
                          <select
                            value={returnReason}
                            onChange={e => setReturnReason(e.target.value)}
                            className="w-full h-10 px-2 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-300 outline-none focus:border-rose-500"
                          >
                            <option value="damaged">Damaged Product (ছেঁড়া/ভাঙা)</option>
                            <option value="wrong_size">Wrong Size (সাইজ মিলছে না)</option>
                            <option value="incorrect_color">Incorrect Color/Style</option>
                            <option value="customer_refused">Customer Refused Package</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block mb-1">Pickup Address</label>
                          <input
                            type="text"
                            placeholder="e.g. Road 12, Dhanmondi, Dhaka"
                            value={returnPickupAddress}
                            onChange={e => setReturnPickupAddress(e.target.value)}
                            className="w-full h-10 px-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white outline-none focus:border-rose-500"
                          />
                        </div>
                      </div>

                      <Button
                        onClick={() => {
                          if (!returnItemName || !returnPickupAddress) {
                            toast.error(t('Please complete the return item name and pickup address.', 'অনুগ্রহ করে রিটার্ন প্রোডাক্টের নাম এবং ঠিকানা পূর্ণ করুন।'));
                            return;
                          }
                          setReturnStatus('booked');
                          const newRet = {
                            id: `ret_${Date.now().toString(36).substring(2, 6).toUpperCase()}`,
                            item: returnItemName,
                            customer: 'Simulated Buyer',
                            carrier: 'Pathao Returns Division',
                            status: 'Assigned'
                          };
                          setActiveReturns(prev => [newRet, ...prev]);
                          setReturnItemName('');
                          setReturnPickupAddress('');
                          toast.success(t('Reverse Return pickup ticket generated successfully!', 'রিভার্স রিটার্ন টিকেট জেনারেট হয়েছে এবং রাইডার অ্যাসাইন করা হয়েছে!'));
                        }}
                        className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold h-10 rounded-xl text-xs cursor-pointer mt-1"
                      >
                        Request Reverse Pickup Ticket
                      </Button>
                    </div>
                  </div>

                  {/* Active Returns tracker */}
                  <div className="p-5 rounded-2xl bg-black/30 border border-white/5 space-y-4">
                    <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-rose-400" />
                      {t('Active Return Carrier Logs', 'চলতি রিভার্স রিটার্ন ট্র্যাকিং লগ')}
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-normal">Watch returns as they flow backwards into your warehouse with full automated verification checks.</p>
                    
                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                      {activeReturns.map(ret => (
                        <div key={ret.id} className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="font-mono text-[10px] text-rose-400 font-bold">Ticket: #{ret.id}</span>
                            <span className="text-[9px] bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded font-black uppercase">{ret.status}</span>
                          </div>
                          <h5 className="font-black text-white text-xs">{ret.item}</h5>
                          <div className="flex justify-between text-[10px] text-slate-500 border-t border-white/5 pt-1.5 mt-1.5">
                            <span>Carrier: <strong className="text-slate-300">{ret.carrier}</strong></span>
                            <span>Buyer: <strong className="text-slate-300">{ret.customer}</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {logisticsTab === 'wallet' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Wallet card & topup */}
                  <div className="p-5 rounded-2xl bg-black/30 border border-white/5 space-y-4">
                    <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-blue-400" />
                      {t('Merchant Logistics Wallet Balance', 'মার্চেন্ট লজিস্টিকস শিপিং ওয়ালেট')}
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-normal">Preload BDT credit with bKash/Nagad and get auto-deducted corporate rates. Get up to 10% cashbacks on bulk top-ups!</p>
                    
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-600/40 to-slate-900 border border-blue-500/20 text-white flex flex-col justify-between h-36 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl" />
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] uppercase tracking-widest text-slate-300 font-extrabold">Corporate Account</span>
                          <h5 className="font-black text-sm">PaikarMart Logistics Hub</h5>
                        </div>
                        <span className="text-xl">💳</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <span className="text-[9px] uppercase tracking-widest text-slate-300 block">Available Credits</span>
                          <span className="text-2xl font-mono font-black text-white">৳{shippingCredits.toLocaleString()}</span>
                        </div>
                        <span className="text-[10px] bg-cyan-500 text-black px-2 py-0.5 rounded font-black uppercase">Active Account</span>
                      </div>
                    </div>

                    {/* Topup interface */}
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Topup Amount (e.g. 500)"
                        value={topupInput}
                        onChange={e => setTopupInput(e.target.value)}
                        className="flex-1 h-10 px-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white outline-none focus:border-blue-500 font-mono"
                      />
                      <button
                        onClick={() => {
                          if (!topupInput || Number(topupInput) <= 0) {
                            toast.error(t('Please enter a valid amount.', 'অনুগ্রহ করে সঠিক টাকার পরিমাণ লিখুন।'));
                            return;
                          }
                          setShippingCredits(prev => prev + Number(topupInput));
                          setTopupInput('');
                          toast.success(t('Preloaded credits successfully via bKash!', 'বিকাশ-এর মাধ্যমে লজিস্টিকস শিপিং ক্রেডিট সফলভাবে লোড হয়েছে!'));
                        }}
                        className="px-4 rounded-xl bg-[#e2136e] hover:opacity-90 text-white text-xs font-black cursor-pointer"
                      >
                        bKash
                      </button>
                      <button
                        onClick={() => {
                          if (!topupInput || Number(topupInput) <= 0) {
                            toast.error(t('Please enter a valid amount.', 'অনুগ্রহ করে সঠিক টাকার পরিমাণ লিখুন।'));
                            return;
                          }
                          setShippingCredits(prev => prev + Number(topupInput));
                          setTopupInput('');
                          toast.success(t('Preloaded credits successfully via Nagad!', 'নগদ-এর মাধ্যমে লজিস্টিকস শিপিং ক্রেডিট সফলভাবে লোড হয়েছে!'));
                        }}
                        className="px-4 rounded-xl bg-[#f37021] hover:opacity-90 text-white text-xs font-black cursor-pointer"
                      >
                        Nagad
                      </button>
                    </div>
                  </div>

                  {/* Available vouchers */}
                  <div className="p-5 rounded-2xl bg-black/30 border border-white/5 space-y-4">
                    <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                      <Tag className="w-4 h-4 text-cyan-400" />
                      {t('Pre-Negotiated Corporate Discount Coupons', 'কর্পোরেট শিপিং ডিসকাউন্ট কুপন')}
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-normal">Enjoy custom discounted rates established automatically based on your high monthly package dispatches.</p>
                    
                    <div className="space-y-2 mt-2">
                      {[
                        { code: 'VIP-CARGO-500', value: '৳500 Discount on Cargo', active: true, desc: 'Applies automatically to heavy freight shipments over 150kg.' },
                        { code: 'ECOM-SHIP-FREE', value: 'First 5 Same Day Free', active: true, desc: 'Applies to any standard doorstep parcel inside Dhaka Metro.' }
                      ].map((v, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-dashed border-white/10 flex justify-between items-center hover:bg-white/10 transition-all">
                          <div>
                            <span className="font-mono text-cyan-400 font-extrabold text-xs block">{v.code}</span>
                            <span className="text-[10px] text-slate-300 font-bold block mt-0.5">{v.value}</span>
                            <p className="text-[9px] text-slate-500 mt-0.5 leading-normal">{v.desc}</p>
                          </div>
                          <button
                            onClick={() => {
                              toast.success(t(`Coupon ${v.code} applied successfully!`, `কুপন ${v.code} সফলভাবে প্রয়োগ হয়েছে!`));
                            }}
                            className="px-2.5 py-1.5 rounded bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-black font-black text-[9px] uppercase tracking-wider transition-all cursor-pointer"
                          >
                            Apply
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 4. RECENT ACTIVITY & PROMOTIONS GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <History className="w-4 h-4" />
              {t('Recent Bookings', 'সাম্প্রতিক বুকিং ও ট্রিপ')}
            </h3>
            <div className="space-y-3">
              {[
                { id: '1', label: 'Bike Ride', sub: 'Panthapath to Gulshan 1', time: '2 hours ago', icon: Bike, color: 'text-orange-400 bg-orange-500/10' },
                { id: '2', label: 'Food Delivery', sub: 'Star Kabab (Dhanmondi)', time: 'Yesterday', icon: Package, color: 'text-[#e2136e] bg-[#e2136e]/10' },
                { id: '3', label: 'Heavy Truck Booking', sub: 'Savar to Chittagong Port', time: '3 days ago', icon: Truck, color: 'text-zinc-400 bg-zinc-500/10' }
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all border border-white/5 bg-black/10">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{item.label}</p>
                      <p className="text-[10px] text-slate-400">{item.sub}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono font-medium">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Tag className="w-4 h-4" />
              {t('Promotions & Business Packages', 'প্রমোশন ও কর্পোরেট প্যাকেজ')}
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 relative overflow-hidden">
                <Zap className="absolute right-[-10px] top-[-10px] w-24 h-24 text-cyan-500/5 rotate-12" />
                <h4 className="text-xs font-black text-cyan-400 uppercase tracking-wider">Express Logistics Discount</h4>
                <p className="text-[10px] text-cyan-200/60 mt-1">Get up to ৳200 off on inter-city transport & pickup booking today.</p>
                <button 
                  onClick={() => {
                    toast.success('Coupon ALOOPEXPRESS applied!');
                  }}
                  className="mt-3 text-[10px] font-bold text-black bg-cyan-500 px-3 py-1.5 rounded-lg transition-all hover:opacity-90 cursor-pointer"
                >
                  {t('Claim Promo Code', 'কুপন সংগ্রহ করুন')}
                </button>
              </div>
            </div>
          </div>

        </section>

      </div>
    </div>
  );
}
