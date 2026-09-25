import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, ArrowLeft, Wrench, ShieldCheck, CheckCircle2, Star, 
  MapPin, Clock, Calendar, PhoneCall, Sparkles, UserCheck, ArrowRight,
  Zap, Droplets, Paintbrush, Laptop, Home, Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface ServiceItem {
  id: string;
  name: string;
  category: string;
  providerName: string;
  providerAvatar: string;
  rating: number;
  reviews: number;
  completedJobs: number;
  price: number;
  priceUnit: string;
  serviceArea: string[];
  image: string;
  verified: boolean;
  description: string;
  features: string[];
}

const SERVICES_DATA: ServiceItem[] = [
  {
    id: "srv-01",
    name: "মাস্টার এসি সার্ভিসিং ও গ্যাস চার্জিং",
    category: "এসি ও অ্যাপ্লায়েন্স",
    providerName: "কুল কেয়ার টেকনিক্যাল সলিউশনস",
    providerAvatar: "❄️",
    rating: 4.9,
    reviews: 218,
    completedJobs: 850,
    price: 850,
    priceUnit: "ইউনিট প্রতি",
    serviceArea: ["মিরপুর", "উত্তরা", "গুলশান", "ধানমন্ডি", "মোহাম্মদপুর"],
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600",
    verified: true,
    description: "দক্ষ টেকনিশিয়ান দ্বারা ইনডোর ও আউটডোর ইউনিটের ডিপ জেট ওয়াশ, গ্যাস প্রেশার চেক এবং ইলেকট্রিক্যাল কানেকশন পরিদর্শন। ৩০ দিনের সার্ভিস ওয়ারেন্টি সহ।",
    features: ["জেট প্রেশার ওয়াটার ক্লিন", "গ্যাস লিক ডিটেকশন", "৩০ দিন ওয়ারেন্টি", "জরুরি রেসপন্স"]
  },
  {
    id: "srv-02",
    name: "কমপ্লিট হোম ইলেকট্রিক্যাল ওয়্যারিং ও ফল্ট ফিক্স",
    category: "ইলেকট্রিশিয়ান",
    providerName: "পাওয়ার গার্ড ইলেকট্রিক",
    providerAvatar: "⚡",
    rating: 4.8,
    reviews: 164,
    completedJobs: 620,
    price: 500,
    priceUnit: "পরিদর্শন ফি",
    serviceArea: ["মিরপুর", "আগারগাঁও", "কাফরুল", "শ্যামলী", "পল্লবী"],
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
    verified: true,
    description: "শর্ট সার্কিট সমাধান, ডিবি বক্স সেটআপ, আইপিএস ওয়্যারিং এবং আধুনিক লাইটিং ইন্সটলেশন। দক্ষ ও লাইসেন্সপ্রাপ্ত ইলেকট্রিশিয়ান দ্বারা কাজ সম্পন্ন।",
    features: ["লাইসেন্সপ্রাপ্ত টেকনিশিয়ান", "শর্ট সার্কিট নিরাপত্তা", "জেনুইন পার্টস গ্যারান্টি"]
  },
  {
    id: "srv-03",
    name: "ডিপ হোম ক্লিনিং ও সোফা-কার্পেট শ্যাম্পু",
    category: "ক্লিনিং",
    providerName: "ক্লিন সিটি বিডি",
    providerAvatar: "✨",
    rating: 4.9,
    reviews: 312,
    completedJobs: 1250,
    price: 1500,
    priceUnit: "রুম প্রতি",
    serviceArea: ["গুলশান", "বনানী", "বারিধারা", "উত্তরা", "বসুন্ধরা"],
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600",
    verified: true,
    description: "জার্মান মেশিনারিজ ও ইকো-ফ্রেন্ডলি ক্লিনারের মাধ্যমে ফুল হোম ডাস্টলেস ক্লিনিং, কিচেন ডিগ্রীসিং এবং ওয়াশরুম স্যানিটাইজেশন।",
    features: ["অ্যান্টি-ব্যাকটেরিয়াল স্যানিটেশন", "সোফা ও ম্যাট্রেস ডিপ সাকশন", "প্রশিক্ষিত টিম"]
  },
  {
    id: "srv-04",
    name: "জরুরি প্লাম্বিং, পাইপ লিকেজ ও সেনিটারি ফিটিং",
    category: "প্লাম্বিং",
    providerName: "পাইপ মাস্টার বিডি",
    providerAvatar: "🚰",
    rating: 4.7,
    reviews: 145,
    completedJobs: 490,
    price: 450,
    priceUnit: "পরিদর্শন ফি",
    serviceArea: ["ধানমন্ডি", "লালমাটিয়া", "আজিমপুর", "মোহাম্মদপুর"],
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600",
    verified: true,
    description: "বাথরুম ও কিচেন পাইপ লিকেজ মেরামত, কমোড/বেসিন ফিটিং, ওয়াটার মোটর মেরামত ও ক্লগ ড্রেন ওপেনিং সার্ভিস।",
    features: ["৩০ মিনিটে উপস্থিতি", "উন্নত লিক ডিটেক্টর", "সকল ফিটিংসের গ্যারান্টি"]
  },
  {
    id: "srv-05",
    name: "ল্যাপটপ ও কম্পিউটার হার্ডওয়্যার রিপেয়ার",
    category: "আইটি ও ফ্রিল্যান্স",
    providerName: "টেক ল্যাব এলিফ্যান্ট রোড",
    providerAvatar: "💻",
    rating: 4.8,
    reviews: 189,
    completedJobs: 710,
    price: 600,
    priceUnit: "ডায়াগনসিস ফি",
    serviceArea: ["সারা ঢাকা ডোরস্টেপ পিকআপ"],
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600",
    verified: true,
    description: "মাদারবোর্ড চিপ-লেভেল রিপেয়ার, ডিসপ্লে রিপ্লেসমেন্ট, ডেটা রিকভারি এবং উইন্ডোজ/ম্যাক ওএস সেটআপ।",
    features: ["ডোরস্টেপ পিক ও ড্রপ", "অরিজিনাল স্পেয়ার পার্টস", "৯০ দিনের রিপেয়ার ওয়ারেন্টি"]
  },
  {
    id: "srv-06",
    name: "ইন্টেরিয়র ওয়াল পুটি ও প্রিমিয়াম পেইন্টিং",
    category: "পেইন্টিং",
    providerName: "কালার ক্রাফট ডেকোর",
    providerAvatar: "🎨",
    rating: 4.8,
    reviews: 94,
    completedJobs: 340,
    price: 18,
    priceUnit: "স্কয়ার ফিট",
    serviceArea: ["উত্তরা", "মিরপুর", "ধানমন্ডি", "মোহাম্মদপুর"],
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600",
    verified: true,
    description: "বার্জার ও এশিয়ান পেইন্টসের অথেনটিক লাক্সারি সিল্ক ও ওয়েদারকোট পেইন্টিং। পুটি স্মুদিং ও টেক্সচার ডিজাইন সার্ভিস।",
    features: ["ফ্রি সাইট মেজারমেন্ট", "ডাস্টলেস স্যান্ডিং মেশিন", "৩ বছর স্থায়িত্বের প্রতিশ্রুতি"]
  }
];

const CATEGORIES = [
  "সব সার্ভিস",
  "এসি ও অ্যাপ্লায়েন্স",
  "ইলেকট্রিশিয়ান",
  "ক্লিনিং",
  "প্লাম্বিং",
  "আইটি ও ফ্রিল্যান্স",
  "পেইন্টিং"
];

const TIME_SLOTS = [
  "সকাল ১০:০০ - দুপুর ০১:০০",
  "দুপুর ০২:০০ - বিকেল ০৫:০০",
  "সন্ধ্যা ০৬:০০ - রাত ০৯:০০"
];

export default function ServicesHome() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("সব সার্ভিস");
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingSlot, setBookingSlot] = useState(TIME_SLOTS[0]);
  const [bookingAddress, setBookingAddress] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);

  const filteredServices = useMemo(() => {
    return SERVICES_DATA.filter((srv) => {
      const matchSearch = srv.name.toLowerCase().includes(search.toLowerCase()) ||
                          srv.providerName.toLowerCase().includes(search.toLowerCase()) ||
                          srv.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === "সব সার্ভিস" || srv.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [search, activeCategory]);

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate || !bookingAddress || !bookingPhone) {
      toast.error("অনুগ্রহ করে তারিখ, ঠিকানা এবং ফোন নম্বর পূরণ করুন");
      return;
    }

    setIsBookingSuccess(true);
    setTimeout(() => {
      setIsBookingSuccess(false);
      const bookedName = selectedService?.name;
      setSelectedService(null);
      setBookingDate("");
      setBookingAddress("");
      setBookingPhone("");
      toast.success(`সফলভাবে বুকিং নিশ্চিত হয়েছে! টেকনিশিয়ান শীঘ্রই যোগাযোগ করবেন।`);
    }, 1500);
  };

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
              <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400">
                <Wrench className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">সার্ভিস হাব ও পেশাদার সেবা</h1>
            </div>
            <p className="text-xs text-[var(--pm-text-muted)] mt-0.5">
              ভেরিফাইড টেকনিশিয়ান ও সার্ভিস প্রোভাইডার · ডোরস্টেপ সাপোর্ট · ফিক্সড রেট ওয়ারেন্টি
            </p>
          </div>
        </div>

        {/* Emergency Hotline Strip */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <div>
              <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">জরুরি হেল্পলাইন</p>
              <p className="text-xs font-black text-[var(--pm-text)]">০৯৬১২-০০০০০০</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Strip */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-orange-500/20 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
            <Sparkles className="w-3.5 h-3.5" /> ১০০% ভেরিফাইড টেকনিশিয়ান গ্যারান্টি
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[var(--pm-text)]">
            বাসা বা অফিসের যেকোনো মেরামত ও সেবা, <br />
            দক্ষ প্রোভাইডারের মাধ্যমে নির্ভরযোগ্যভাবে করিয়ে নিন।
          </h2>
          <p className="text-xs sm:text-sm text-[var(--pm-text-muted)]">
            কাজ শেষ না হওয়া পর্যন্ত কোনো হিডেন চার্জ নেই। কাজের সন্তুষ্টির পরই পেমেন্ট নিশ্চিত করার সুবিধা।
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] shadow-xs">
            <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-[var(--pm-text)]">৭ দিন ফ্রি সার্ভিস ওয়ারেন্টি</p>
              <p className="text-[10px] text-[var(--pm-text-muted)]">পুনরায় সমস্যা হলে ফ্রি ফলো-আপ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Categories */}
      <div className="space-y-4 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--pm-text-muted)]" />
          <input
            type="text"
            placeholder="সার্ভিস বা কাজের ধরন দিয়ে খুঁজুন (যেমন: এসি গ্যাস চার্জিং, ইলেকট্রিক শর্ট সার্কিট)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 sm:h-14 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl pl-12 pr-4 text-sm outline-none focus:border-orange-500 shadow-sm transition-all text-[var(--pm-text)] placeholder:text-[var(--pm-text-muted)]"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border shrink-0 ${
                activeCategory === cat
                  ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20"
                  : "bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] border-[var(--pm-border)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Service Listings Grid - Responsive Desktop Multi-Column */}
      {filteredServices.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
          <Wrench className="w-12 h-12 text-[var(--pm-text-muted)] mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-bold text-[var(--pm-text)]">কোনো সার্ভিস পাওয়া যায়নি</h3>
          <p className="text-xs text-[var(--pm-text-muted)] mt-1">অন্য কি-ওয়ার্ড দিয়ে অনুসন্ধান করুন</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group bg-[var(--pm-surface)] rounded-3xl border border-[var(--pm-border)] overflow-hidden hover:border-orange-500/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image & Price Tag */}
                <div className="aspect-[16/9] w-full relative overflow-hidden bg-black/20">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-full border border-white/20">
                    {service.category}
                  </span>
                  <div className="absolute bottom-3 right-3 bg-orange-500 text-white text-xs font-black px-3 py-1 rounded-xl shadow-lg">
                    ৳{service.price} <span className="text-[9px] font-normal opacity-90">({service.priceUnit})</span>
                  </div>
                </div>

                {/* Service Details */}
                <div className="p-5 space-y-4">
                  {/* Provider Info */}
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--pm-border)]/50">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-lg">
                        {service.providerAvatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-[var(--pm-text)]">{service.providerName}</h4>
                          {service.verified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                        </div>
                        <p className="text-[10px] text-[var(--pm-text-muted)]">{service.completedJobs}+ কাজ সম্পন্ন</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-lg text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="text-xs font-black">{service.rating}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base font-bold text-[var(--pm-text)] group-hover:text-orange-400 transition-colors leading-snug mb-1.5">
                      {service.name}
                    </h3>
                    <p className="text-xs text-[var(--pm-text-muted)] line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Features checklist */}
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] text-[var(--pm-text-muted)]">
                    {service.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Service Areas */}
                  <div className="flex items-center gap-1.5 text-[11px] text-[var(--pm-text-muted)] pt-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span className="truncate">এলাকা: {service.serviceArea.join(", ")}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => setSelectedService(service)}
                  className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs transition-all shadow-md shadow-orange-500/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" /> স্লট বুক করুন (৳{service.price})
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Service Booking Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--pm-border)]">
                <div>
                  <h3 className="text-base font-black text-[var(--pm-text)]">সার্ভিস বুকিং ফর্ম</h3>
                  <p className="text-xs text-[var(--pm-text-muted)]">{selectedService.name}</p>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="p-2 text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] rounded-full hover:bg-[var(--pm-surface-hover)]"
                >
                  ✕
                </button>
              </div>

              {isBookingSuccess ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-lg font-black text-[var(--pm-text)]">বুকিং সফলভাবে সম্পন্ন হয়েছে!</h4>
                  <p className="text-xs text-[var(--pm-text-muted)]">আপনার নির্ধারিত সময়ে টেকনিশিয়ান উপস্থিত হবেন।</p>
                </div>
              ) : (
                <form onSubmit={handleConfirmBooking} className="space-y-4">
                  {/* Price Summary Banner */}
                  <div className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-orange-400">{selectedService.providerName}</p>
                      <p className="text-[10px] text-[var(--pm-text-muted)]">পরিদর্শন ও সার্ভিস রেট</p>
                    </div>
                    <span className="text-lg font-black text-[var(--pm-text)]">৳{selectedService.price}</span>
                  </div>

                  {/* Preferred Date */}
                  <div>
                    <label className="block text-xs font-bold text-[var(--pm-text)] mb-1">সার্ভিসের তারিখ নির্বাচন করুন *</label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-xl px-4 py-2.5 text-xs text-[var(--pm-text)] outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* Time Slot */}
                  <div>
                    <label className="block text-xs font-bold text-[var(--pm-text)] mb-1.5">পছন্দের সময় স্লট *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          type="button"
                          key={slot}
                          onClick={() => setBookingSlot(slot)}
                          className={`p-2 rounded-xl text-center text-[10px] font-bold border transition-all ${
                            bookingSlot === slot
                              ? "bg-orange-500 text-white border-orange-500 shadow-xs"
                              : "bg-[var(--pm-surface-hover)] text-[var(--pm-text-muted)] border-[var(--pm-border)]"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Delivery / Service Address */}
                  <div>
                    <label className="block text-xs font-bold text-[var(--pm-text)] mb-1">সার্ভিস লোকেশন / পূর্ণাঙ্গ ঠিকানা *</label>
                    <input
                      type="text"
                      required
                      placeholder="বাড়ি নং, রোড নং, ফ্ল্যাট, এলাকা (যেমন: বাসা # ১২, রোড # ৪, ধানমন্ডি)"
                      value={bookingAddress}
                      onChange={(e) => setBookingAddress(e.target.value)}
                      className="w-full bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-xl px-4 py-2.5 text-xs text-[var(--pm-text)] outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-bold text-[var(--pm-text)] mb-1">যোগাযোগের ফোন নম্বর *</label>
                    <input
                      type="tel"
                      required
                      placeholder="০১৭xxxxxxxx"
                      value={bookingPhone}
                      onChange={(e) => setBookingPhone(e.target.value)}
                      className="w-full bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-xl px-4 py-2.5 text-xs text-[var(--pm-text)] outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* Trust indicator */}
                  <p className="text-[10px] text-[var(--pm-text-muted)] flex items-center gap-1.5 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    কাজ সম্পন্ন হওয়ার পর আপনি ক্যাশ অথবা অনলাইন ওয়ালেটে পেমেন্ট করতে পারবেন।
                  </p>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedService(null)}
                      className="px-4 py-2.5 rounded-xl border border-[var(--pm-border)] text-xs font-bold text-[var(--pm-text-muted)] hover:text-[var(--pm-text)]"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
                    >
                      বুকিং নিশ্চিত করুন
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
