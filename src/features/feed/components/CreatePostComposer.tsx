import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Package, FileText, PlaySquare, Wrench, Send, Store, 
  DollarSign, Video, AlignLeft, Sparkles, Gavel, 
  Lock, CheckCircle2, ChevronRight, MapPin, Truck, Briefcase, Info, RefreshCw, ShoppingBag, Eye, HelpCircle, Navigation
} from "lucide-react";
import { useFeedStore } from "@/modules/social/store/useFeedStore";
import { useProductDataStore } from "@/modules/product/store/useProductDataStore";
import { useB2BProductDataStore } from "@/modules/b2b/store/useB2BProductDataStore";
import { useB2BRFQStore } from "@/modules/b2b/store/useB2BRFQStore";
import { useAuth } from "@/features/auth/AuthContext";
import { toast } from "sonner";
import { AppRole } from "@/config/roles.config";

// Preset images for product showcasing
const PRODUCT_PRESETS = [
  { label: "Oven Shirt (শার্ট)", url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80" },
  { label: "Eco Pack (ব্যাগ)", url: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&q=80" },
  { label: "Tech Gear (গ্যাজেট)", url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80" },
  { label: "Leather Wallet (ওয়ালেট)", url: "https://images.unsplash.com/photo-1627124793731-f7a77449369f?w=400&q=80" }
];

// Preset videos for storytelling/review
const VIDEO_PRESETS = [
  { label: "Showroom Tour (শোরুম ট্যুর)", url: "https://assets.mixkit.co/videos/preview/mixkit-holding-a-smartphone-with-a-green-screen-34204-large.mp4" },
  { label: "Garment Production (গার্মেন্টস ফ্যাক্টরি)", url: "https://assets.mixkit.co/videos/preview/mixkit-sewing-machine-working-on-a-garment-40019-large.mp4" },
  { label: "Clay Crafts Promo (মাটির তৈজসপত্র শপ)", url: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-potter-shaping-a-clay-vase-42861-large.mp4" }
];

interface CategoryOption {
  id: "demand" | "bid" | "product" | "service" | "video" | "ride" | "job";
  labelEn: string;
  labelBn: string;
  descEn: string;
  descBn: string;
  icon: React.ElementType;
  color: string;
  bannerColor: string;
  allowedRoles: AppRole[]; // empty array means unlocked for everyone
  domain: 'WHOLESALE' | 'RETAIL' | 'B2B' | 'SERVICES' | 'SOCIAL';
  type: 'PRODUCT' | 'DEMAND' | 'BID' | 'NEWS' | 'RIDE' | 'SERVICE';
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  { 
    id: "demand", 
    labelEn: "Sourcing Demand", 
    labelBn: "চাহিদা পোস্ট", 
    descEn: "Ask factories or dealers for bulk quotes", 
    descBn: "পাইকারি ক্রয়ের জন্য রিকোয়েস্ট ও বাজেট পোস্ট করুন",
    icon: FileText,
    color: "from-amber-500 to-orange-600",
    bannerColor: "text-amber-400 border-amber-500/20 bg-amber-500/5",
    allowedRoles: [], // Unlocked for everyone
    domain: "B2B",
    type: "DEMAND"
  },
  { 
    id: "bid", 
    labelEn: "Submit Bid Offer", 
    labelBn: "প্রস্তাব পেশ করুন", 
    descEn: "Price breakdown & terms bid on active demands", 
    descBn: "চলমান চাহিদায় আপনার সেরা কোটেশন সাবমিট করুন",
    icon: Gavel,
    color: "from-indigo-500 to-blue-600",
    bannerColor: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5",
    allowedRoles: [], // Unlocked for everyone
    domain: "B2B",
    type: "BID"
  },
  { 
    id: "product", 
    labelEn: "Product Showcase", 
    labelBn: "পণ্য শোকেস", 
    descEn: "Add factory-direct product details & MOQ", 
    descBn: "কারখানার স্টক এবং ন্যূনতম অর্ডারের সাথে পণ্য যোগ করুন",
    icon: Package,
    color: "from-cyan-500 to-green-600",
    bannerColor: "text-cyan-400 border-cyan-400/20 bg-cyan-400/5",
    allowedRoles: [
      "seller", "retail_seller", "wholesale_seller", "factory_seller", 
      "factory", "rural", "wholesale", "exporter", "importer", 
      "brand_seller", "b2b_seller", "grocery_seller", "food_seller",
      "rural_seller", "nearby_shop", "admin", "super_admin"
    ],
    domain: "WHOLESALE",
    type: "PRODUCT"
  },
  { 
    id: "service", 
    labelEn: "Service Offering", 
    labelBn: "সেবা ও কনসালটেন্সি", 
    descEn: "Promote machinery repairs or business services", 
    descBn: "মেশিন মেনটেইন্যান্স বা কনসালটেন্সি সেবা প্রচার করুন",
    icon: Wrench,
    color: "from-rose-500 to-pink-600",
    bannerColor: "text-rose-400 border-rose-500/20 bg-rose-500/5",
    allowedRoles: ["service_provider", "nearby_shop", "seller", "business", "admin", "super_admin"],
    domain: "SERVICES",
    type: "SERVICE"
  },
  { 
    id: "video", 
    labelEn: "Story Review Reel", 
    labelBn: "ভিডিও রিভিউ স্টোরি", 
    descEn: "Short interactive video from factory floor", 
    descBn: "কারখানা পরিদর্শনের ২ মিনিটের বাস্তব স্টোরি রিভিউ",
    icon: Video,
    color: "from-fuchsia-500 to-purple-600",
    bannerColor: "text-fuchsia-400 border-fuchsia-500/20 bg-fuchsia-500/5",
    allowedRoles: ["content_creator", "digital_seller", "seller", "brand_seller", "admin", "super_admin"],
    domain: "SOCIAL",
    type: "NEWS"
  },
  { 
    id: "ride", 
    labelEn: "Ride/Pickup Logistics", 
    labelBn: "রাইড বা পিকআপ শেয়ার", 
    descEn: "Inter-district delivery pickup and load capacity", 
    descBn: "পণ্য স্থানান্তরের জন্য ট্রাক/পিকআপ রুট বুকিং ঘোষণা",
    icon: Truck,
    color: "from-sky-500 to-cyan-600",
    bannerColor: "text-sky-400 border-sky-500/20 bg-sky-500/5",
    allowedRoles: ["rider", "service_provider", "seller", "nearby_shop", "admin", "super_admin"],
    domain: "SERVICES",
    type: "RIDE"
  },
  { 
    id: "job", 
    labelEn: "Job Hire Circular", 
    labelBn: "নিয়োগ বিজ্ঞপ্তি", 
    descEn: "Find skilled tailors, operators or delivery riders", 
    descBn: "কারখানা বা শপের জন্য দক্ষ কর্মী নিয়োগ ঘোষণা তৈরি করুন",
    icon: Briefcase,
    color: "from-teal-500 to-cyan-600",
    bannerColor: "text-teal-400 border-teal-500/20 bg-teal-500/5",
    allowedRoles: ["employer", "factory", "factory_seller", "seller", "business", "admin", "super_admin"],
    domain: "B2B",
    type: "SERVICE"
  }
];

export function CreatePostComposer({ onClose }: { onClose?: () => void } = {}) {
  const { user } = useAuth();
  const { addItem } = useFeedStore();

  // Sandbox Role Switcher - facilitates testing the diverse dynamic categories
  const [activeTestRole, setActiveTestRole] = React.useState<AppRole | "">(user?.role || "buyer");
  
  // Wizards steps states: "select-category" | "fill-details" | "success"
  const [step, setStep] = React.useState<"select" | "fill">("select");
  const [selectedCat, setSelectedCat] = React.useState<CategoryOption | null>(null);

  // Form states mapping
  const [content, setContent] = React.useState("");
  
  // Dynamic fields
  const [title, setTitle] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [comparePrice, setComparePrice] = React.useState("");
  const [subCategory, setSubCategory] = React.useState("Garments");
  const [moq, setMoq] = React.useState("fifty");
  const [mediaUrl, setMediaUrl] = React.useState("");
  
  // Ride specific
  const [origin, setOrigin] = React.useState("");
  const [destination, setDestination] = React.useState("");
  const [vehicle, setVehicle] = React.useState("pickup");

  // Job specific
  const [requirements, setRequirements] = React.useState("");

  React.useEffect(() => {
    if (user?.role) {
      setActiveTestRole(user.role);
    }
  }, [user]);

  // Determine permissions based on current preview role
  const isAllowed = (cat: CategoryOption) => {
    if (cat.allowedRoles.length === 0) return true;
    return cat.allowedRoles.includes(activeTestRole as AppRole);
  };

  const handleSelectCat = (cat: CategoryOption) => {
    if (!isAllowed(cat)) {
      toast.error(`উক্ত ক্যাটেগরি পোস্ট করতে ${cat.allowedRoles.join(", ")} রোল প্রয়োজন!`);
      return;
    }
    setSelectedCat(cat);
    setTitle("");
    setContent("");
    setPrice("");
    setComparePrice("");
    // Defaults matching
    if (cat.id === "product") {
      setMediaUrl(PRODUCT_PRESETS[0].url);
      setSubCategory("Garments");
    } else if (cat.id === "video") {
      setMediaUrl(VIDEO_PRESETS[0].url);
    }
    setStep("fill");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCat) return;

    if (!content.trim()) {
      toast.error("অনুগ্রহ করে কিছু বর্ণনা লিখুন / Please provide a description");
      return;
    }

    // Creating post mapping to UnifiedFeedItem
    const finalTitle = title.trim() || `${selectedCat.labelEn} Update`;
    let metadata: any = {};
    let finalCta = { label: "কিনুন / Buy Now", action: "ADD_TO_CART" };

    if (selectedCat.id === "product") {
      if (!title.trim() || !price) {
        toast.error("পণ্যের নাম ও পাইকারি দাম আবশ্যক!");
        return;
      }
      metadata = {
        moq: moq === "fifty" ? 50 : moq === "hundred" ? 100 : 10,
        weight: "Bulk Packaging",
        category: subCategory,
        comparePrice: comparePrice || undefined
      };
      finalCta = { label: "কিনুন / Buy Now", action: "ADD_TO_CART" };
    } else if (selectedCat.id === "demand") {
      if (!title.trim()) {
        toast.error("চাহিদার নাম আবশ্যক!");
        return;
      }
      metadata = {
        budget: price ? Number(price) : undefined,
        deadline: "Next 7 Days"
      };
      finalCta = { label: "প্রস্তাব দিন / Bid Now", action: "PLACE_BID" };
    } else if (selectedCat.id === "bid") {
      if (!title.trim() || !price) {
        toast.error("প্রস্তাবের শিরোনাম ও মূল্য আবশ্যক!");
        return;
      }
      metadata = {
        offeredAmount: Number(price),
        negotiable: true
      };
      finalCta = { label: "প্রস্তাব দিন / Bid Now", action: "PLACE_BID" };
    } else if (selectedCat.id === "service") {
      if (!title.trim()) {
        toast.error("সেবার নাম আবশ্যক!");
        return;
      }
      metadata = {
        consultationFee: price ? Number(price) : undefined
      };
      finalCta = { label: "বুক করুন / Book Now", action: "BOOK_NOW" };
    } else if (selectedCat.id === "ride") {
      if (!origin || !destination) {
        toast.error("শুরুর স্থান এবং গন্তব্য উল্লেখ করুন!");
        return;
      }
      metadata = {
        origin,
        destination,
        vehicle,
        price: price ? Number(price) : undefined
      };
      finalCta = { label: "বুক করুন / Book Now", action: "BOOK_NOW" };
    } else if (selectedCat.id === "job") {
      if (!title.trim()) {
        toast.error("পদের নাম আবশ্যক!");
        return;
      }
      metadata = {
        salary: price ? Number(price) : undefined,
        requirements,
        isJob: true
      };
      finalCta = { label: "আবেদন করুন / Apply Now", action: "BOOK_NOW" };
    }

    const newPost: any = {
      id: `custom-post-${Date.now()}`,
      type: selectedCat.type,
      domain: selectedCat.domain,
      author: {
        id: "user-current",
        name: user?.fullName || "ব্যবহারকারী টেস্ট",
        avatar: user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
        isVerified: user?.verification?.status === "verified",
        role: activeTestRole || user?.role || "buyer"
      },
      content: {
        title: finalTitle,
        description: content,
        media: mediaUrl ? [mediaUrl] : [],
        price: price ? Number(price) : undefined,
        currency: "BDT",
        location: origin ? `${origin} -> ${destination}` : user?.seller?.location || "ঢাকা মেট্রো",
        timestamp: new Date().toISOString(),
        metadata
      },
      stats: {
        likes: 0,
        comments: 0,
        shares: 0
      },
      interactions: {
        hasLiked: false,
        hasSaved: false
      },
      cta: finalCta
    };

    // Store action triggers immediate multi-destination update!
    if (selectedCat.id === "product") {
      try {
        useProductDataStore.getState().addProduct({
          id: newPost.id,
          name: finalTitle,
          price: Number(price || 0),
          comparePrice: comparePrice ? Number(comparePrice) : undefined,
          portal: ((activeTestRole as string) === 'merchant' || activeTestRole === 'seller' || activeTestRole === 'retail_seller') ? 'b2c' : 'pk-shop',
          category: subCategory || 'Fashion',
          subCategory: subCategory || 'Fashion', // ensure subCategory is set for Food integration too
          image: mediaUrl || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600',
          vendor: user?.fullName || "ব্যবহারকারী টেস্ট",
          description: content,
        });

        // Sync directly to B2B wholesale store if role is wholesale or factory
        if (activeTestRole === "wholesale_seller" || activeTestRole === "factory_seller" || moq !== "ten") {
          useB2BProductDataStore.getState().addProduct({
            id: `b2b-${newPost.id}`,
            name: finalTitle,
            category: (subCategory?.toLowerCase() === 'garments' || subCategory?.toLowerCase() === 'shoes') ? 'garments' : 'electronics',
            moq: moq === 'fifty' ? 50 : moq === 'hundred' ? 100 : 10,
            stock: 12000,
            image: mediaUrl || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
            vendorId: 'vendor-current',
            vendorName: user?.fullName || "ব্যবহারকারী টেস্ট",
            isVerified: true,
            isExport: activeTestRole === "factory_seller",
            rating: 5.0,
            description: content,
            specs: {
              'ক্যাটাগরি (Category)': subCategory || 'General',
              'মিন অর্ডার (MOQ)': moq === 'fifty' ? '50 Pcs' : '100 Pcs'
            },
            tierPrices: [
              { range: `${moq === 'fifty' ? 50 : 100}+ পিস`, price: Number(price || 0) }
            ]
          });
        }
      } catch (err) {
        console.warn("Product sync warning:", err);
      }
    } else if (selectedCat.id === "demand") {
      try {
        useB2BRFQStore.getState().addRFQ({
          id: `demand-${Date.now()}`,
          title: finalTitle,
          category: subCategory?.toLowerCase() || 'garments',
          quantity: moq === 'fifty' ? 500 : moq === 'hundred' ? 1000 : 100,
          unit: 'Pcs',
          budget: price ? `৳${price}` : 'আলোচনা সাপেক্ষে',
          deadline: '২০২৬-০৮-১৫',
          description: content,
          buyerName: user?.fullName || "ব্যবহারকারী টেস্ট",
          buyerRegion: user?.seller?.location || "ঢাকা",
          status: 'Open',
          date: 'আজকে',
          quotes: []
        });
      } catch (err) {
        console.warn("B2B demand sync warning:", err);
      }
    }

    addItem(newPost);
    toast.success("পোস্টটি সফলভাবে সোশ্যাল ফিড, আপনার ড্যাশবোর্ড ও সংশ্লিষ্ট পোর্টালে সাবমিট করা হয়েছে!");
    
    // Clear & Return
    setStep("select");
    setContent("");
    setTitle("");
    setPrice("");
    setComparePrice("");
    setOrigin("");
    setDestination("");
    setRequirements("");
    setMediaUrl("");
    onClose?.();
  };

  const currentRoleConfig = activeTestRole ? "role" : "buyer";

  return (
    <div className="bg-[#030704] border border-white/[0.04] rounded-3xl p-5 md:p-6 shadow-xl relative overflow-hidden backdrop-blur-2xl">
      {/* Dynamic Background Glow representing PaikarMart colors */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-400/5 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />

      {/* TOP HEADER: Profile Sandbox Info & Active Sandbox Regulator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.05] pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
            <img 
              src={user?.avatarUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=100"} 
              alt="Profile" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-[12px] md:text-xs text-white uppercase tracking-wider">{user?.fullName || "Paikar Test Sandbox"}</span>
              <span className="text-[7.5px] font-black tracking-widest px-2 py-0.5 rounded bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 uppercase leading-none">
                {activeTestRole}
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 mt-1 uppercase font-semibold leading-none">
              পোস্টিং পলিসি: নো-পার্সোনাল স্প্যাম (Strictly Categorized Listings)
            </p>
          </div>
        </div>

        {/* Dynamic Role Swapper to test permissions instantly */}
        <div className="flex items-center gap-2 bg-zinc-950 border border-white/5 p-1.5 rounded-xl shrink-0">
          <span className="text-[8px] text-zinc-500 font-black uppercase tracking-wider pl-1.5 flex items-center gap-1">
            <RefreshCw className="w-2.5 h-2.5 animate-spin text-zinc-600" />
            রোল টেস্ট / Switch Role:
          </span>
          <select
            value={activeTestRole}
            onChange={(e) => {
              setActiveTestRole(e.target.value as AppRole);
              setStep("select");
              setSelectedCat(null);
            }}
            className="bg-black border border-white/10 text-white text-[9px] font-black uppercase rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-cyan-400 cursor-pointer"
          >
            <option value="buyer">Buyer (ক্রেতা)</option>
            <option value="wholesale_seller">Wholesale (পাইকারি বিক্রেতা)</option>
            <option value="factory_seller">Factory (কারখানা মালিক)</option>
            <option value="service_provider">Service Pro (সেবা দাতা)</option>
            <option value="rider">Rider (ডেলিভারি রাইডার)</option>
            <option value="content_creator">Media Creator (কন্টেন্ট ক্রিয়েটর)</option>
          </select>
        </div>
      </div>

      {/* WIZARD CHASSIS */}
      <AnimatePresence mode="wait">
        {step === "select" ? (
          <motion.div
            key="category-selector-flow"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
                ধাপ ১: পোস্টের সঠিক ক্যাটেগরি নির্বাচন করুন
              </h3>
            </div>
            
            <p className="text-[10.5px] text-zinc-400 font-medium leading-relaxed">
              সুপার অ্যাপের পোস্টিং পলিসি অনুযায়ী এখানে কোনো ব্যক্তিগত ছবি বা অপ্রাসঙ্গিক বিষয় পোস্ট করা সম্পূর্ণ নিষিদ্ধ। আপনি আপনার ভেরিফাইড রোল লাইসেন্স অনুযায়ী ক্যাটেগরি নির্বাচন করে পোস্ট করতে পারবেন:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {CATEGORY_OPTIONS.map((cat) => {
                const unlocked = isAllowed(cat);
                const IconComponent = cat.icon;

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCat(cat)}
                    className={`relative p-3.5 rounded-2xl border text-left flex gap-3 transition-all duration-300 min-h-[44px] group ${
                      unlocked 
                        ? "bg-zinc-950/40 border-white/[0.04] hover:bg-zinc-950/80 hover:border-cyan-400/35 cursor-pointer" 
                        : "bg-zinc-950/10 border-white/[0.02] opacity-40 cursor-not-allowed"
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${unlocked ? cat.color : "from-zinc-800 to-zinc-900"} text-white shrink-0`}>
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-extrabold text-xs text-white group-hover:text-cyan-400 transition-colors">
                          {cat.labelBn} / <span className="text-[10px] font-bold text-zinc-300">{cat.labelEn}</span>
                        </span>
                        
                        {unlocked ? (
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-cyan-400 transition-colors" />
                        ) : (
                          <Lock className="w-3 h-3 text-rose-500" />
                        )}
                      </div>
                      
                      <p className="text-[9px] text-zinc-400 font-medium tracking-tight truncate leading-tight mt-1.5">
                        {cat.descBn}
                      </p>
                    </div>

                    {/* Unlocked / Locked Visual Badge Overlay */}
                    <div className="absolute top-2 right-3 flex items-center">
                      {!unlocked && (
                        <span className="text-[6.5px] font-black uppercase text-rose-400 bg-rose-550/10 border border-rose-550/20 px-1 py-0.5 rounded leading-none scale-90">
                          🔒 Locked
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="category-form-composer"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            {/* Form Header Context displaying path */}
            <div className="flex items-center justify-between border-b border-white/[0.03] pb-3 mb-4">
              <button
                type="button"
                onClick={() => setStep("select")}
                className="h-8 px-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/15 text-zinc-300 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
              >
                ← পেছন যান
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-widest">Active Category:</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[9.5px] font-black uppercase rounded-lg border ${selectedCat?.bannerColor}`}>
                  {selectedCat && React.createElement(selectedCat.icon, { className: "w-3 h-3 shrink-0" })}
                  <span>{selectedCat?.labelBn} ({selectedCat?.labelEn})</span>
                </span>
              </div>
            </div>

            {/* Composing Custom Category Form fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Conditional Title / Item Name */}
              {selectedCat && ["product", "demand", "bid", "service", "job"].includes(selectedCat.id) && (
                <div>
                  <label className="text-[9.5px] text-zinc-400 font-black uppercase tracking-wider block mb-1.5">
                    {selectedCat.id === "product" ? "product title / পণ্যের নাম, মডেল ও ব্র্যান্ড *" : 
                     selectedCat.id === "demand" ? "sourcing item name / চাহিদার বিবরণ বা শিরোনাম *" : 
                     selectedCat.id === "bid" ? "bid topic title / প্রস্তাবিত কাজের বিষয় *" : 
                     selectedCat.id === "service" ? "service name / প্রদানকৃত সেবার নাম *" : 
                     selectedCat.id === "job" ? "hire designation / নিয়োগকৃত পদের নাম *" : "শিরোনাম"}
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={
                      selectedCat.id === "product" ? "যেমন: প্রিমিয়াম জেন্টস কটন পাঞ্জাবি ২০২৬" :
                      selectedCat.id === "demand" ? "যেমন: কারখানার জন্য ৫০০০ গজ কটন টুইল কাপড় প্রয়োজন" :
                      selectedCat.id === "bid" ? "যেমন: ঢাকা মেট্রো ডেলিভারির জন্য স্পেশাল অফার" :
                      selectedCat.id === "service" ? "যেমন: টেক্সটাইল লুম মেশিনারি সার্ভিস ও ফিটিং" :
                      selectedCat.id === "job" ? "যেমন: বাটন হোল অপারেটর আবশ্যক (কারখানা)" : "লিখুন..."
                    }
                    className="w-full h-10 bg-zinc-950 border border-white/10 rounded-xl px-3.5 text-xs text-white uppercase placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 transition-all font-semibold"
                  />
                </div>
              )}

              {/* Grid 2 Column for Price / Budget / MOQ / Destination */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Price / Budget Field */}
                {selectedCat && ["product", "demand", "bid", "service", "ride", "job"].includes(selectedCat.id) && (
                  <div>
                    <label className="text-[9.5px] text-zinc-400 font-black uppercase tracking-wider block mb-1.5">
                      {selectedCat.id === "product" ? "wholesale price / পাইকারি ইউনিট দর (৳) *" :
                       selectedCat.id === "demand" ? "target budget / বাজেট রেঞ্জ (৳)" :
                       selectedCat.id === "bid" ? "your bid quote / আপনার রেট (৳) *" :
                       selectedCat.id === "service" ? "consultation rate / সেবা ফি (৳)" :
                       selectedCat.id === "ride" ? "rent fee / ভাড়া কমিশন (৳) *" :
                       selectedCat.id === "job" ? "salary / মাসিক বেতন (৳)" : "টাকা (৳)"}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-zinc-500 font-bold text-xs">৳</span>
                      </div>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        className="w-full h-10 bg-zinc-950 border border-white/10 rounded-xl pl-7 pr-3 text-xs text-white focus:outline-none focus:border-cyan-400 font-extrabold"
                      />
                    </div>
                  </div>
                )}

                {/* 2. Secondary Dynamic Field (MOQ for Product, Delivery Timeline, Job Location, Vehicle Type) */}
                {selectedCat && selectedCat.id === "product" && (
                  <div>
                    <label className="text-[9.5px] text-zinc-400 font-black uppercase tracking-wider block mb-1.5">
                      minimum order (moq) / সর্বনিম্ন অর্ডারের লিমিট
                    </label>
                    <select
                      value={moq}
                      onChange={(e) => setMoq(e.target.value)}
                      className="w-full h-10 bg-zinc-950 border border-white/10 text-white rounded-xl px-3 text-xs focus:outline-none focus:border-cyan-400/60 cursor-pointer font-bold"
                    >
                      <option value="fifty">৫০ জোড়া/পিস মিনিমাম (MOQ: 50)</option>
                      <option value="hundred">১০০ জোড়া/পিস মিনিমাম (MOQ: 100)</option>
                      <option value="ten">১০ জোড়া/পিস মিনিমাম (MOQ: 10)</option>
                    </select>
                  </div>
                )}

                {/* 2b. Secondary Category Filter for Products / Demand */}
                {selectedCat && ["product", "demand"].includes(selectedCat.id) && (
                  <div>
                    <label className="text-[9.5px] text-zinc-400 font-black uppercase tracking-wider block mb-1.5">
                      Product Category / মডিউল ক্যাটেগরি
                    </label>
                    <select
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                      className="w-full h-10 bg-zinc-950 border border-white/10 text-white rounded-xl px-3 text-xs focus:outline-none focus:border-cyan-400/60 cursor-pointer font-bold"
                    >
                      <option value="Garments">Garments (গার্মেন্টস তৈরি পোশাক)</option>
                      <option value="Shoes">Footwear & Shoes (জুতা ও ফুটওয়্যার)</option>
                      <option value="Food">Food & Agro (খাদ্য ও কৃষি পণ্য)</option>
                      <option value="Electronics">Electronics (ইলেকট্রনিক্স এক্সেসরিজ)</option>
                      <option value="Cosmetics">Cosmetics (কসমেটিকস ও বিউটি)</option>
                    </select>
                  </div>
                )}

                {/* 2c. Transportation specific details (Origin -> Destination) */}
                {selectedCat && selectedCat.id === "ride" && (
                  <>
                    <div>
                      <label className="text-[9.5px] text-zinc-400 font-black uppercase tracking-wider block mb-1.5">
                        pickup location / শুরুর স্থান *
                      </label>
                      <input
                        type="text"
                        required
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        placeholder="যেমন: খাতুনগঞ্জ, চট্টগ্রাম"
                        className="w-full h-10 bg-zinc-950 border border-white/10 rounded-xl px-3.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="text-[9.5px] text-zinc-400 font-black uppercase tracking-wider block mb-1.5">
                        destination / গন্তব্যস্থান *
                      </label>
                      <input
                        type="text"
                        required
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="যেমন: বগুড়া সদর"
                        className="w-full h-10 bg-zinc-950 border border-white/10 rounded-xl px-3.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="text-[9.5px] text-zinc-400 font-black uppercase tracking-wider block mb-1.5">
                        Vehicle transport / গাড়ির ধরন
                      </label>
                      <select
                        value={vehicle}
                        onChange={(e) => setVehicle(e.target.value)}
                        className="w-full h-10 bg-zinc-950 border border-white/10 text-white rounded-xl px-3 text-xs focus:outline-none cursor-pointer font-bold"
                      >
                        <option value="pickup">Pickup Truck (ছোট পিকআপ ভ্যান)</option>
                        <option value="truck">Large Truck (১০ টন বড় ট্রাক)</option>
                        <option value="covered">Covered Van (কাভার্ড ভ্যান)</option>
                        <option value="motorcycle">Motorcycle (দ্রুত পার্সেল বাইক)</option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              {/* Image / Media presets selector for Product/Video to showcase fast attachment */}
              {selectedCat && (selectedCat.id === "product" || selectedCat.id === "video") && (
                <div className="bg-zinc-950/20 border border-white/[0.04] p-3.5 rounded-2xl">
                  <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest block mb-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    মিডিয়া প্রিসেট সিলেক্টর / Select Media Attachment Preset:
                  </span>
                  
                  {selectedCat.id === "product" ? (
                    <div className="flex gap-2.5 flex-wrap">
                      {PRODUCT_PRESETS.map((p) => (
                        <button
                          key={p.label}
                          type="button"
                          onClick={() => setMediaUrl(p.url)}
                          className={`text-[9.5px] px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 font-bold cursor-pointer ${
                            mediaUrl === p.url 
                              ? "bg-cyan-400/10 text-cyan-400 border-cyan-400/30 font-black" 
                              : "bg-white/5 text-zinc-400 border-white/5 hover:text-white"
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {p.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {VIDEO_PRESETS.map((v) => (
                        <button
                          key={v.label}
                          type="button"
                          onClick={() => {
                            setMediaUrl(v.url);
                            setTitle(v.label);
                          }}
                          className={`text-[9.5px] px-3.5 py-2 rounded-xl border text-left flex items-center justify-between transition-all font-bold cursor-pointer ${
                            mediaUrl === v.url 
                              ? "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30" 
                              : "bg-white/5 text-zinc-400 border-white/5 hover:text-white"
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <PlaySquare className="w-3.5 h-3.5 text-zinc-500" />
                            {v.label}
                          </span>
                          <span className="text-[7.5px] bg-fuchsia-500/20 text-fuchsia-300 font-black uppercase px-2 py-0.5 rounded">
                            Select Story video
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 3. Description Area Textarea */}
              <div>
                <label className="text-[9.5px] text-cyan-400 font-black uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <AlignLeft className="w-3.5 h-3.5" />
                  বিবরণ লিখুন / post details description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                    selectedCat?.id === "product" ? "পণ্যটির কাপড়ের মান, গ্যারান্টি, মিনিমাম কোয়ান্টিটি এবং ডেলিভারির চার্জ ইত্যাদি সম্পর্কে বিস্তারিত লিখুন..." :
                    selectedCat?.id === "demand" ? "মালের সাইজ, কাপড়ের জিএসএম, প্যাকেজিং কোয়ালিটি এবং পেমেন্ট রিলিজ সম্পর্কে স্পষ্ট কন্ডিশন লিখুন..." :
                    selectedCat?.id === "bid" ? "আপনার সার্ভিস রেট কেন সস্তা, অভিজ্ঞতার মাত্রা ও শিপিং ক্যাপাসিটি দিয়ে ক্লায়েন্টকে রাজি করান..." :
                    selectedCat?.id === "service" ? "অভিজ্ঞতার সার্টিফিকেট, সমাধান করার দক্ষতা ও মেথড সম্পর্কে লিখুন যাতে গ্রাহক বুক করতে পারেন..." :
                    selectedCat?.id === "ride" ? "গাড়ির রুট প্ল্যানিং, লোড খালাসের টাইম স্প্যান এবং অন্যান্য নিরাপত্তা শর্তাবলী এখানে লিখুন..." :
                    selectedCat?.id === "job" ? "প্রার্থীর শিক্ষাগত যোগ্যতা, কাজের দক্ষতা, ডিউটি টাইম শিফটিং ও সুযোগ-সুবিধা এখানে লিখুন..." : "ডিটেইলস লিখুন..."
                  }
                  className="w-full resize-none bg-zinc-950 border border-white/10 rounded-2xl p-3.5 text-xs md:text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 transition-all leading-relaxed font-medium"
                />
              </div>

              {/* Submit triggers dynamic posting to feed, portal domain, and profile page */}
              <div className="flex items-center justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 h-10 rounded-2xl bg-gradient-to-r from-cyan-400 to-cyan-600 hover:from-[#00ff88] hover:to-cyan-500 text-black font-extrabold text-[11px] uppercase tracking-wider shadow-[0_0_15px_rgba(0,230,118,0.25)] transition-all flex items-center gap-2 duration-200 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>সংরক্ষণ ও প্রকাশ করুন / Publish Listing</span>
                </button>
              </div>

            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
