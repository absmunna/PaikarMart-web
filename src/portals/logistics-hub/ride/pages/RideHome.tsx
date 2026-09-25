import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, ArrowLeft, MapPin, Truck, Car, Bike, Package, 
  ShieldCheck, Clock, Navigation, CheckCircle2, PhoneCall, 
  Sparkles, ArrowRight, DollarSign, Calendar, ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

type TransportMode = "bike" | "car" | "truck" | "courier" | "ambulance";

interface FleetVehicle {
  id: string;
  driverName: string;
  driverPhone: string;
  vehicleModel: string;
  vehicleNumber: string;
  mode: TransportMode;
  capacity: string;
  baseFare: number;
  perKmFare: number;
  rating: number;
  trips: number;
  currentArea: string;
  available: boolean;
  image: string;
}

const FLEET_DATA: FleetVehicle[] = [
  {
    id: "flt-01",
    driverName: "রফিকুল ইসলাম",
    driverPhone: "০১৭৮৮-১১২২৩৩",
    vehicleModel: "টাটা এইস এক্সপার্ট পিকআপ (১ টন)",
    vehicleNumber: "ঢাকা মেট্রো-ন ১১-৩৪১২",
    mode: "truck",
    capacity: "১,০০০ কেজি / ৫০ সিএফটি",
    baseFare: 1200,
    perKmFare: 55,
    rating: 4.9,
    trips: 420,
    currentArea: "তেজগাঁও কার্গো ডিপো",
    available: true,
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600"
  },
  {
    id: "flt-02",
    driverName: "কামাল হোসাইন",
    driverPhone: "০১৯১১-২২৩৩৪৪",
    vehicleModel: "আইসুজু ক্যানটার হেভি ট্রাক (৫ টন)",
    vehicleNumber: "ঢাকা মেট্রো-ট ২১-৮৯৯০",
    mode: "truck",
    capacity: "৫,০০০ কেজি / পাইকারি লোড",
    baseFare: 3500,
    perKmFare: 85,
    rating: 4.8,
    trips: 680,
    currentArea: "কেরানীগঞ্জ হোলসেল হাব",
    available: true,
    image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600"
  },
  {
    id: "flt-03",
    driverName: "তানভীর আহমেদ",
    driverPhone: "০১৮২২-৩৩৪৪৫৫",
    vehicleModel: "টয়োটা ফিল্ডার এক্স প্রিমিও",
    vehicleNumber: "ঢাকা মেট্রো-গ ৩৩-৪৫৬৭",
    mode: "car",
    capacity: "৪ জন যাত্রী + লাগেজ",
    baseFare: 400,
    perKmFare: 30,
    rating: 4.9,
    trips: 512,
    currentArea: "গুলশান-২ সার্কেল",
    available: true,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600"
  },
  {
    id: "flt-04",
    driverName: "জাহিদ হাসান",
    driverPhone: "০১৬৩৩-৪৫৫৫৬৬",
    vehicleModel: "হোন্ডা এক্স-ব্লেড ১৬০ সিসি",
    vehicleNumber: "ঢাকা মেট্রো-হ ১২-৭৮৯০",
    mode: "bike",
    capacity: "১ জন যাত্রী অথবা ১০ কেজি পার্সেল",
    baseFare: 60,
    perKmFare: 16,
    rating: 4.8,
    trips: 890,
    currentArea: "মিরপুর-১০ গোলচত্বর",
    available: true,
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600"
  },
  {
    id: "flt-05",
    driverName: "আরিফুল কবির",
    driverPhone: "০১৭৫০-৯৯৮৮৭৭",
    vehicleModel: "হাইএস আইসিইউ সাপোর্ট অ্যাম্বুলেন্স",
    vehicleNumber: "ঢাকা মেট্রো-ছ ৪৪-৫৬৭৮",
    mode: "ambulance",
    capacity: "অক্সিজেন + স্ট্রেচার + ১ সহকারী",
    baseFare: 2500,
    perKmFare: 60,
    rating: 5.0,
    trips: 340,
    currentArea: "ঢাকা মেডিকেল চত্বর",
    available: true,
    image: "https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=600"
  }
];

export default function RideHome() {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<TransportMode>("truck");
  const [pickup, setPickup] = useState("কেরানীগঞ্জ পাইকারি মার্কেট, ঢাকা");
  const [drop, setDrop] = useState("উত্তরা সেক্টর-৭, ঢাকা");
  const [cargoWeight, setCargoWeight] = useState("৫০০ কেজি");
  const [isCalculating, setIsCalculating] = useState(false);
  const [estimatedFare, setEstimatedFare] = useState<number | null>(1850);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleCalculateFare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickup || !drop) {
      toast.error("পিকআপ ও গন্তব্য উভয় ঠিকানা পূরণ করুন");
      return;
    }

    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      let fare = 350;
      if (selectedMode === "truck") fare = 1850;
      else if (selectedMode === "car") fare = 850;
      else if (selectedMode === "courier") fare = 150;
      else if (selectedMode === "ambulance") fare = 3000;
      else fare = 220;

      setEstimatedFare(fare);
      toast.success("আনুমানিক দূরত্ব: ২২ কিমি · যাত্রা সময়: প্রায় ৪৫ মিনিট");
    }, 600);
  };

  const handleBookVehicle = (vehicle: FleetVehicle) => {
    toast.success(`কল করা হচ্ছে: ${vehicle.driverName} (${vehicle.driverPhone})`);
  };

  const handleConfirmLogisticsRequest = () => {
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      toast.success("আপনার পরিবহন রিকোয়েস্ট সফলভাবে সাবমিট হয়েছে! নিকটস্থ রাইডার/ড্রাইভার অ্যাসাইন করা হচ্ছে।");
    }, 1500);
  };

  const filteredFleet = FLEET_DATA.filter((v) => v.mode === selectedMode || selectedMode === "truck");

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 text-[var(--pm-text)]">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] transition-all active:scale-95 shadow-xs"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--pm-text)]" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Truck className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">লজিস্টিক ও পরিবহন হাব</h1>
            </div>
            <p className="text-xs text-[var(--pm-text-muted)] mt-0.5">
              পাইকারি কার্গো ট্রাক · এক্সপ্রেস কুরিয়ার · রাইড শেয়ার · জরুরি অ্যাম্বুলেন্স
            </p>
          </div>
        </div>

        {/* 24/7 Dispatch Hotline */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping" />
            <div>
              <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">সরাসরি কন্ট্রোল রুম</p>
              <p className="text-xs font-black text-[var(--pm-text)]">০১৭০০-০০০০০০</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-8">
        {[
          { id: "truck" as TransportMode, label: "পণ্যবাহী ট্রাক ও পিকআপ", icon: Truck, badge: "বাল্ক কার্গো" },
          { id: "courier" as TransportMode, label: "এক্সপ্রেস কুরিয়ার", icon: Package, badge: "ডোরস্টেপ" },
          { id: "bike" as TransportMode, label: "মোটরসাইকেল রাইড", icon: Bike, badge: "দ্রুততম" },
          { id: "car" as TransportMode, label: "প্রাইভেট কার রেন্টাল", icon: Car, badge: "আরামদায়ক" },
          { id: "ambulance" as TransportMode, label: "জরুরি অ্যাম্বুলেন্স", icon: ShieldCheck, badge: "২৪/৭ জরুরি" }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedMode(item.id)}
            className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all relative ${
              selectedMode === item.id
                ? "bg-cyan-500/15 border-cyan-500 text-cyan-400 shadow-lg shadow-cyan-500/10 font-bold"
                : "bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] border-[var(--pm-border)] text-[var(--pm-text-muted)]"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <item.icon className="w-5 h-5" />
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                {item.badge}
              </span>
            </div>
            <span className="text-xs font-bold leading-tight">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Desktop 2-Column Booking Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Fare & Booking Terminal (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-[var(--pm-surface)] border border-[var(--pm-border)] shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--pm-border)]">
              <h3 className="text-base font-black text-[var(--pm-text)] flex items-center gap-2">
                <Navigation className="w-4 h-4 text-cyan-400" /> পরিবহন রিকোয়েস্ট ও ভাড়া হিসাব
              </h3>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                লাইভ ফেয়ার
              </span>
            </div>

            <form onSubmit={handleCalculateFare} className="space-y-4">
              {/* Pickup Location */}
              <div>
                <label className="block text-xs font-bold text-[var(--pm-text)] mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" /> পিকআপ লোকেশন (পণ্য তোলার স্থান) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: কেরানীগঞ্জ পাইকারি বাজার, ঢাকা"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-xl px-4 py-3 text-xs text-[var(--pm-text)] outline-none focus:border-cyan-500"
                />
              </div>

              {/* Drop-off Location */}
              <div>
                <label className="block text-xs font-bold text-[var(--pm-text)] mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" /> গন্তব্য / ডেলিভারি লোকেশন *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: উত্তরা সেক্টর-৭, ঢাকা"
                  value={drop}
                  onChange={(e) => setDrop(e.target.value)}
                  className="w-full bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-xl px-4 py-3 text-xs text-[var(--pm-text)] outline-none focus:border-emerald-500"
                />
              </div>

              {/* Cargo / Load specifications */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--pm-text)] mb-1">ওজন / ক্যাপাসিটি</label>
                  <select
                    value={cargoWeight}
                    onChange={(e) => setCargoWeight(e.target.value)}
                    className="w-full bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-xl px-3 py-2.5 text-xs text-[var(--pm-text)] outline-none focus:border-cyan-500"
                  >
                    <option value="১০০ কেজি">১০০ কেজি পর্যন্ত</option>
                    <option value="৫০০ কেজি">৫০০ কেজি (ছোট পিকআপ)</option>
                    <option value="১ টন">১ টন (বড় পিকআপ)</option>
                    <option value="৩-৫ টন">৩-৫ টন (হেভি ট্রাক)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--pm-text)] mb-1">পেমেন্ট মেথড</label>
                  <select className="w-full bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-xl px-3 py-2.5 text-xs text-[var(--pm-text)] outline-none focus:border-cyan-500">
                    <option>ডেলিভারিতে ক্যাশ (COD)</option>
                    <option>পেইকারমার্ট ওয়ালেট</option>
                    <option>বিকাশ / নগদ</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isCalculating}
                className="w-full py-3 rounded-2xl bg-[var(--pm-surface-hover)] hover:bg-[var(--pm-border)] border border-[var(--pm-border)] text-xs font-bold text-[var(--pm-text)] transition-colors flex items-center justify-center gap-2"
              >
                {isCalculating ? "ভাড়া গণনা করা হচ্ছে..." : "দূরত্ব ও আনুমানিক ভাড়া রিক্যালকুলেট"}
              </button>
            </form>

            {/* Estimated Fare Display */}
            {estimatedFare && (
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400">আনুমানিক ভাড়া (২২ কিমি)</span>
                  <span className="text-xl font-black text-[var(--pm-text)]">৳{estimatedFare.toLocaleString()}</span>
                </div>
                <div className="text-[11px] text-[var(--pm-text-muted)] space-y-1">
                  <p>• ট্রানজিট সময়: আনুমানিক ৩৫ - ৪৫ মিনিট</p>
                  <p>• পণ্য লোডিং ও আনলোডিং সহায়তা অপশনাল</p>
                  <p>• লাইভ জিপিএস ট্র্যাকিং লিঙ্ক এসএমএসে পাঠানো হবে</p>
                </div>

                <button
                  onClick={handleConfirmLogisticsRequest}
                  disabled={bookingSuccess}
                  className="w-full py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-black font-black text-xs shadow-lg shadow-cyan-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {bookingSuccess ? "রিকোয়েস্ট সাবমিট হয়েছে..." : "অবিলম্বে পিকআপ রিকোয়েস্ট নিশ্চিত করুন"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Fleet Showcase & Available Carriers (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-[var(--pm-text)]">নিকটস্থ ভেরিফাইড কার্গো ও রাইডার্স</h3>
            <span className="text-xs font-bold text-cyan-400">লাইভ আপডেট হচ্ছে</span>
          </div>

          <div className="space-y-4">
            {filteredFleet.map((vehicle) => (
              <div
                key={vehicle.id}
                className="group p-4 sm:p-5 rounded-3xl bg-[var(--pm-surface)] border border-[var(--pm-border)] hover:border-cyan-500/40 hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-black/20 shrink-0 border border-[var(--pm-border)]">
                    <img src={vehicle.image} alt={vehicle.vehicleModel} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[var(--pm-text)]">{vehicle.vehicleModel}</h4>
                      {vehicle.available && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-[var(--pm-text-muted)]">
                      ড্রাইভার: <span className="font-semibold text-[var(--pm-text)]">{vehicle.driverName}</span> · {vehicle.trips}+ ট্রিপ
                    </p>
                    <p className="text-[11px] text-cyan-400 font-medium">
                      ক্যাপাসিটি: {vehicle.capacity}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-[var(--pm-text-muted)] pt-0.5">
                      <MapPin className="w-3 h-3 text-red-400" />
                      <span>{vehicle.currentArea}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--pm-border)]/50">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-[var(--pm-text-muted)]">বেস ফেয়ার:</span>
                    <p className="text-base font-black text-[var(--pm-text)]">৳{vehicle.baseFare}</p>
                  </div>
                  <button
                    onClick={() => handleBookVehicle(vehicle)}
                    className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 hover:text-black border border-cyan-500/30 text-cyan-400 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> কল ও বুকিং
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
