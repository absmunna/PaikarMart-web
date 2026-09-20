import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import {
  Store,
  Package,
  TrendingUp,
  Users,
  DollarSign,
  Plus,
  Settings,
  BarChart3,
  AlertCircle,
  Zap,
  Truck,
  RotateCcw,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  User,
  Heart,
  Video,
  Eye,
  Wrench,
  Calendar,
  Lock,
  Smartphone,
  CreditCard,
  Check,
  HelpCircle,
  Upload,
  FileText,
  X,
  MapPin,
  LayoutGrid,
  Share2,
  List,
  Grid,
  Trash2,
  Download
} from "lucide-react";
import { ServiceAreaSettings } from "./components/ServiceAreaSettings";
import { useSeller } from "@/modules/seller";
import { useAuth } from "@/features/auth/AuthContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { StoryBar } from "@shared/StoryBar";
import { CategoryNavBar } from "@shared/CategoryNavBar";
import { UnifiedPaymentForm } from "@/components/common/UnifiedPaymentForm";
import { UnifiedDeliveryTracking } from "@/components/common/UnifiedDeliveryTracking";
import { useWalletStore } from "@/modules/wallet/useWalletStore";
import { useLocationStore } from "@/modules/location/locationStore";
import { PublicSellerStoreFront } from "@/features/user-profile/components/PublicSellerStoreFront";

// Bilingual system mapping helper
const t = (en: string, bn: string, isEnglish = false) => (isEnglish ? en : bn);

// Sub-types / Roles we support simulating
type DashboardRole = "retail_seller" | "service_provider" | "content_creator" | "rider";

export function SellerCentralPortal() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const { depositCash } = useWalletStore();
  const { updateLiveLocation } = useLocationStore();


  // Bilingual toggle state (reads app state style, defaults to English/Bangla dual labels or user choice)
  const [lang, setLang] = useState<"en" | "bn">("bn");
  const isEn = lang === "en";

  // Dynamic Simulating Active Role
  const [activeRole, setActiveRole] = useState<DashboardRole>(() => {
    if (user?.role === "rider") return "rider";
    if (user?.role === "service_provider") return "service_provider";
    return "retail_seller";
  });

  // Portal Master Navigation Tabs
  const [activeTab, setActiveTab] = useState<"overview" | "operations" | "storefront" | "deliveries" | "financials" | "verification" | "service-area">("overview");

  // Sync routing from location.pathname to activeTab
  useEffect(() => {
    const p = location.pathname.toLowerCase().replace(/\/$/, "");
    if (p.endsWith("/products") || p.endsWith("/operations")) {
      setActiveTab("operations");
    } else if (p.endsWith("/storefront")) {
      setActiveTab("storefront");
    } else if (p.endsWith("/orders") || p.endsWith("/deliveries")) {
      setActiveTab("deliveries");
    } else if (p.endsWith("/financials")) {
      setActiveTab("financials");
    } else if (p.endsWith("/verification")) {
      setActiveTab("verification");
    } else if (p.endsWith("/service-area")) {
      setActiveTab("service-area");
    } else {
      setActiveTab("overview");
    }
  }, [location.pathname]);

  // Sync state tab to routing when clicked
  const handleTabClick = (tabId: any) => {
    setActiveTab(tabId);
    if (tabId === "overview") {
      navigate("/seller");
    } else if (tabId === "operations") {
      navigate("/seller/products");
    } else if (tabId === "deliveries") {
      navigate("/seller/orders");
    } else {
      navigate(`/seller/${tabId}`);
    }
  };

  // Product Add Modal State
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [isStorefrontPreview, setIsStorefrontPreview] = useState(false);
  const [pricingInput, setPricingInput] = useState({ title: "", price: "", stock: "", category: "home" });

  // Destructure missing items from useSeller
  const { 
    products, 
    orders, 
    serviceBookings, 
    deliveryTasks, 
    returnsRequests,
    createProduct, 
    updateProduct, 
    deleteProduct, 
    setOrderStatus, 
    profile, 
    submitVerification 
  } = useSeller();

  // Content Creators stats (kept local as placeholder)
  const [creatorContents, setCreatorContents] = useState([
    { id: "vid-1", title: "bKash Integration Guide BN", views: 18400, likes: 2300, premium: true, price: 50, purchases: 120 },
    { id: "vid-2", title: "Dropship Business Bangladesh 2026", views: 42300, likes: 6200, premium: false, price: 0, purchases: 0 },
    { id: "vid-3", title: "Premium Fabric Sourcing Tutorial", views: 8200, likes: 980, premium: true, price: 150, purchases: 45 }
  ]);


  // Financial Wallet / Escrow Account Ledger
  const [walletBalance, setWalletBalance] = useState({
    onHoldEscrow: 14500,
    withdrawable: 38000,
    totalEarned: 152000,
    vatPaid: 7600, // 5% auto
    payoutPhone: "01711223344",
    payoutProvider: "bkash" as "bkash" | "nagad"
  });

  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");

  // Handler for adding dynamic services or items
  const handleAddNewItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pricingInput.title || !pricingInput.price) {
      toast.error(t("Please fill all required fields", "দয়া করে প্রয়োজনীয় ফিল্ডগুলো পূরণ করুন", isEn));
      return;
    }
    
    if (activeRole === "retail_seller") {
      createProduct({
        title: pricingInput.title,
        description: t("Beautiful handpicked piece for global standard utility.", "চমৎকার ও উচ্চমান সম্পন্ন একটি প্রডাক্ট যা দৈনিক কাজের উপযোগী।", isEn),
        price: Number(pricingInput.price),
        stock: Number(pricingInput.stock) || 10,
        categoryId: pricingInput.category,
        categoryName: pricingInput.category.toUpperCase(),
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"],
        type: "retail",
        location: "Dhaka, Bangladesh",
        tags: ["retail", pricingInput.category]
      });
      toast.success(t("Product published successfully!", "পণ্যটি সফলভাবে প্রকাশ করা হয়েছে!", isEn));
    } else if (activeRole === "service_provider") {
      setServiceBookings(prev => [
        {
          id: `B-${Math.floor(Math.random() * 9000) + 1000}`,
          customer: "Walk-in Guest",
          service: pricingInput.title,
          date: "Tomorrow (আগামীকাল)",
          time: "12:30 PM",
          status: "pending",
          phone: "01888000000",
          area: "Dhaka"
        },
        ...prev
      ]);
      toast.success(t("Service Added Successfully", "সার্ভিসটি সফলভাবে যোগ করা হয়েছে", isEn));
    } else {
      setCreatorContents(prev => [
        {
          id: `vid-${prev.length + 1}`,
          title: pricingInput.title,
          views: 0,
          likes: 0,
          premium: Number(pricingInput.price) > 0,
          price: Number(pricingInput.price),
          purchases: 0
        },
        ...prev
      ]);
      toast.success(t("Video Course published", "ভিডিও কোর্সটি প্রকাশ করা হয়েছে", isEn));
    }

    setShowAddProduct(false);
    setPricingInput({ title: "", price: "", stock: "", category: "home" });
  };

  // Withdraw Payout trigger
  const handleWithdrawTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawVal = Number(withdrawAmount);
    if (!withdrawVal || withdrawVal <= 0) {
      toast.error(t("Enter valid amount", "সঠিক পরিমাণ প্রবেশ করান", isEn));
      return;
    }
    if (withdrawVal > walletBalance.withdrawable) {
      toast.error(t("Insufficient withdrawable balance", "পর্যাপ্ত উইথড্র-যোগ্য ব্যালেন্স নেই", isEn));
      return;
    }

    setWalletBalance(prev => ({
      ...prev,
      withdrawable: prev.withdrawable - withdrawVal
    }));
    toast.success(t(`Payout of ৳${withdrawVal} requested via ${walletBalance.payoutProvider.toUpperCase()}!`, `বিকাশ/নগদের মাধ্যমে ৳${withdrawVal} উত্তোলনের অনুরোধ পাঠানো হয়েছে!`, isEn));
    setShowPayoutModal(false);
    setWithdrawAmount("");
  };

  const handleDepositCash = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(depositAmount);
    if (!amount || amount <= 0) {
      toast.error(t("Enter valid amount", "সঠিক পরিমাণ প্রবেশ করান", isEn));
      return;
    }
    
    await depositCash(amount, `DEP-${Date.now().toString(36)}`);
    toast.success(t(`৳${amount} deposited to wallet. Balance updated.`, `৳${amount} ওয়ালেটে জমা হয়েছে। ব্যালেন্স আপডেট হয়েছে।`, isEn));
    setShowDepositModal(false);
    setDepositAmount("");
  };

  // Switch orders or delivery status
  const triggerOrderChange = (id: string, status: any) => {
    setOrderStatus(id, status);
    toast.success(t(`Order updated to: ${status.toUpperCase()}`, `অর্ডারের স্ট্যাটাস পরিবর্তন হয়েছে: ${status}`, isEn));
  };

  const triggerRiderAssign = (deliveryId: string, courierName: string) => {
    setDeliveryTasks(prev => prev.map(item => {
      if (item.id === deliveryId) {
        return {
          ...item,
          courier: courierName,
          status: "dispatched",
          timeline: [...item.timeline, `Courier Assigned: ${courierName}`]
        };
      }
      return item;
    }));
    toast.success(t("Courier dispatched!", "কুরিয়ার এসাইন করা হয়েছে!", isEn));
  };

  // Process refund request
  const handleReturnDecision = (retId: string, decision: "approved" | "rejected") => {
    setReturnsRequests(prev => prev.map(item => {
      if (item.id === retId) {
        return { ...item, status: decision };
      }
      return item;
    }));
    toast.success(t(`Refund ${decision}`, `রিফান্ড অনুরোধটি ${decision === "approved" ? "অনুমোদিত" : "বাতিল"} হয়েছে`, isEn));
  };

  // Active statistics based on role definition
  const totalSalesFromOrders = useMemo(() => {
    return orders.reduce((sum, order) => sum + (order.total || 0), 0);
  }, [orders]);

  const salesPerformanceData = useMemo(() => {
    const days = isEn 
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : ["সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি", "রবি"];
    
    // Generate some trend data based on total sales if available, otherwise use defaults
    const baseValue = totalSalesFromOrders > 0 ? totalSalesFromOrders / 10 : 3500;
    
    return days.map((day, i) => ({
      name: day,
      sales: Math.floor(baseValue * (0.8 + Math.random() * 0.4)),
      orders: Math.floor(10 + Math.random() * 15)
    }));
  }, [isEn, totalSalesFromOrders]);

  const monthlyGrowthData = useMemo(() => {
    const months = isEn
      ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
      : ["জানু", "ফেব্রু", "মার্চ", "এপ্রিল", "মে", "জুন"];
    
    return months.map((month, i) => ({
      month,
      revenue: Math.floor(45000 + (Math.random() * 20000) + (i * 5000)),
      growth: Math.floor(5 + Math.random() * 15)
    }));
  }, [isEn]);

  const handleDownloadReport = () => {
    // Export salesPerformanceData as CSV
    const headers = isEn 
      ? ["Day", "Sales (BDT)", "Orders"]
      : ["দিন", "বিক্রয় (টাকা)", "অর্ডার"];
      
    const rows = salesPerformanceData.map(d => [d.name, d.sales, d.orders]);
    
    const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `sales_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(t("Report Downloaded", "রিপোর্ট ডাউনলোড করা হয়েছে", isEn));
  };

  const categoryStats = useMemo(() => {
    switch (activeRole) {
      case "service_provider":
        return {
          label: t("Active Bookings / বুকিংগুলো", "সক্রিয় বুকিং সমূহ", isEn),
          icon: Calendar,
          count: serviceBookings.filter(b => b.status !== "completed").length,
          statsGrid: [
            { label: t("Bookings Today", "আজকের বুকিং", isEn), value: "4", extra: "+1", color: "text-purple-400" },
            { label: t("Completed Services", "কাজ সম্পন্ন", isEn), value: "116", extra: `৳${(totalSalesFromOrders * 0.8).toLocaleString()}`, color: "text-emerald-400" },
            { label: t("Pending Approval", "অনুমোদনের অপেক্ষায়", isEn), value: String(serviceBookings.filter(b => b.status === "pending").length), extra: "-2", color: "text-amber-400" },
            { label: t("Total Reviews", "ইউজার রিভিউ", isEn), value: "4.9 ★", extra: "120 reviews", color: "text-amber-400" }
          ]
        };
      case "content_creator":
        return {
          label: t("Subscribers / দর্শক", "মিডিয়া সাবস্ক্রাইবার", isEn),
          icon: Video,
          count: "2.4K",
          statsGrid: [
            { label: t("Total Video Views", "ভিডিও ভিউস", isEn), value: "68.9K", extra: "+14%", color: "text-rose-400" },
            { label: t("Reels Engagement", "রিলস এনগেজমেন্ট", isEn), value: "12.4%", extra: "High", color: "text-blue-400" },
            { label: t("Premium Unlocks", "প্রিমিয়াম কোর্স আনলক", isEn), value: String(creatorContents.reduce((s, c) => s + c.purchases, 0)), extra: "মোট বিক্রি", color: "text-emerald-400" },
            { label: t("Ad Impressions", "বিজ্ঞাপন রেভিনিউ", isEn), value: "৳৫,৪০০", extra: "AdSense", color: "text-amber-400" }
          ]
        };
      case "rider":
        return {
          label: t("Active Tasks / সক্রিয় কাজ", "সক্রিয় ডেলিভারি টাস্ক", isEn),
          icon: Truck,
          count: deliveryTasks.filter(t => t.status !== "delivered").length,
          statsGrid: [
            { label: t("Today's Earnings", "আজকের আয়", isEn), value: "৳১,৮৫০", extra: "+৳৪২০ টিপস", color: "text-emerald-400" },
            { label: t("Completed Trips", "ট্রিপ সম্পন্ন", isEn), value: "১২", extra: "আজকের", color: "text-blue-400" },
            { label: t("Distance Covered", "অতিক্রান্ত দূরত্ব", isEn), value: "৪২ কিমি", extra: "বুম বুম", color: "text-sky-400" },
            { label: t("Rider Rating", "রাইডার রেটিং", isEn), value: "৪.৮ ★", extra: "১০২ রিভিউ", color: "text-amber-400" }
          ]
        };
      case "retail_seller":
      default:
        return {
          label: t("Live Stock / স্টক কাউন্ট", "লাইভ পণ্য সম্ভার", isEn),
          icon: Package,
          count: products.length,
          statsGrid: [
            { label: t("Today Orders", "আজকের অর্ডার", isEn), value: String(orders.filter(o => o.status === "pending" || o.status === "processing").length), extra: "+20%", color: "text-blue-400" },
            { label: t("Total Sales", "মোট বিক্রি", isEn), value: `৳${totalSalesFromOrders.toLocaleString()}`, extra: "+15%", color: "text-emerald-400" },
            { label: t("Products", "পণ্য সংখ্যা", isEn), value: String(products.length), extra: "ইনভেন্টরি", color: "text-sky-400" },
            { label: t("Order Returns", "ক্ষতিগ্রস্ত/রিটার্ন", isEn), value: String(returnsRequests.filter(r => r.status === "pending").length), extra: "রিফান্ড আবেদন", color: "text-red-400" }
          ]
        };
    }
  }, [activeRole, serviceBookings, creatorContents, products, orders, returnsRequests, isEn, totalSalesFromOrders]);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--pm-bg)] text-[var(--pm-text)] pb-24 md:pb-8">
      {/* ── Top Dynamic Panel Header ── */}
      <div className="relative overflow-hidden mb-6 p-3 md:p-4 bg-gradient-to-r from-emerald-950/40 via-zinc-900/80 to-zinc-950/90 border-b border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 max-w-[1360px] mx-auto">
          {/* Logo & Bilingual Toggle */}
          <div className="flex items-center justify-between sm:justify-start gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[var(--pm-accent)]/15 border border-[var(--pm-accent)]/40 flex items-center justify-center shadow-lg shadow-[var(--pm-accent)]/5">
                <Store className="w-6 h-6 text-[var(--pm-accent)]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg md:text-xl font-black tracking-tight flex items-center gap-1.5 text-white">
                    {t("Seller Central", "সেলার সেন্ট্রাল", isEn)}
                    <span className="text-xs bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded-full font-bold">
                      PRO
                    </span>
                  </h1>
                </div>
                <p className="text-[10px] md:text-xs text-white/50 font-medium">
                  {t("Dynamic Merchant & Service Hub Operations", "মাল্টি-রোল মার্চেন্ট ও সার্ভিস অপারেশনস হাব", isEn)}
                </p>
              </div>
            </div>
          </div>

          {/* Controls: Bilingual Language Selector & Simulated Role Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Language Switch */}
            <div className="flex bg-white/5 border border-white/10 rounded-xl p-0.5 text-xs font-bold text-white/70">
              <button
                onClick={() => setLang("bn")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  !isEn ? "bg-[var(--pm-accent)] text-white shadow-md shadow-[var(--pm-accent)]/10" : "hover:text-white"
                }`}
              >
                বাংলা
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  isEn ? "bg-[var(--pm-accent)] text-white shadow-md shadow-[var(--pm-accent)]/10" : "hover:text-white"
                }`}
              >
                EN
              </button>
            </div>

            {/* Role Demo Switcher (Crucial for demonstrating multi-role capabilities) */}
            <div className="flex bg-white/5 border border-white/10 rounded-xl p-0.5 text-xs font-bold text-white/70">
              <button
                onClick={() => {
                  setActiveRole("retail_seller");
                  setActiveTab("overview");
                }}
                className={`px-2 py-1.5 rounded-lg transition-all ${
                  activeRole === "retail_seller" ? "bg-emerald-500 text-white" : "hover:text-white"
                }`}
                title="🛍️ Physical Goods"
              >
                {t("Seller", "বিক্রেতা", isEn)}
              </button>
              <button
                onClick={() => {
                  setActiveRole("service_provider");
                  setActiveTab("overview");
                }}
                className={`px-2 py-1.5 rounded-lg transition-all ${
                  activeRole === "service_provider" ? "bg-purple-600 text-white" : "hover:text-white"
                }`}
                title="🔧 Handyman / Tutors / Repairers"
              >
                {t("Service Pro", "সার্ভিস", isEn)}
              </button>
              <button
                onClick={() => {
                  setActiveRole("content_creator");
                  setActiveTab("overview");
                }}
                className={`px-2 py-1.5 rounded-lg transition-all ${
                  activeRole === "content_creator" ? "bg-rose-600 text-white" : "hover:text-white"
                }`}
                title="🎬 Reels Creators & Digital Files"
              >
                {t("Creator", "ক্রিয়েটর", isEn)}
              </button>
              <button
                onClick={() => {
                  setActiveRole("rider");
                  setActiveTab("overview");
                }}
                className={`px-2 py-1.5 rounded-lg transition-all ${
                  activeRole === "rider" ? "bg-orange-500 text-white" : "hover:text-white"
                }`}
                title="🛵 Rider & Delivery Boy"
              >
                {t("Rider", "রাইডার", isEn)}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1360px] mx-auto w-full px-2 space-y-4">
        <StoryBar context="seller" />
        <CategoryNavBar context="seller" />

        {/* ── Role Identity Highlight Bar ── */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-3">
            <span className="text-xl">
              {activeRole === "retail_seller" ? "🛍️" : activeRole === "service_provider" ? "🛠️" : activeRole === "rider" ? "🛵" : "🎬"}
            </span>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
                {t("Active Portal Profile", "সক্রিয় পোর্টাল প্রোফাইল", isEn)}
              </span>
              <h2 className="text-sm font-bold text-slate-200">
                {activeRole === "retail_seller" && t("Retail & Wholesale Merchant Shop", "রিটেইল ও হোলসেল পণ্য বিক্রেতা", isEn)}
                {activeRole === "service_provider" && t("Verified Professional Services Provider", "যাচাইকৃত পেশাদার সার্ভিসেস প্রোভাইডার", isEn)}
                {activeRole === "content_creator" && t("Digital Course & Reels Video Host", "ডিজিটাল সামগ্রী ও মিডিয়া কনটেন্ট ক্রিয়েটর", isEn)}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t("Verified Vendor (level 5)", "যাচাইকৃত ভেণ্ডর (লেভেল ৫)", isEn)}</span>
          </div>
        </div>

        {/* ── Master Tabs Navigation ── */}
        <div className="flex overflow-x-auto gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl no-scrollbar">
          {[
            { id: "overview", labelEn: "Overview", labelBn: "মূল পেইজ", icon: BarChart3 },
            { id: "storefront", labelEn: "My StoreFront", labelBn: "আমার স্টোরফ্রন্ট", icon: LayoutGrid },
            { id: "operations", labelEn: activeRole === "retail_seller" ? "My Stock" : activeRole === "service_provider" ? "Services Offered" : activeRole === "rider" ? "My Trips" : "Digital Uploads", labelBn: activeRole === "retail_seller" ? "পণ্য স্টক" : activeRole === "service_provider" ? "সার্ভিসসমূহ" : activeRole === "rider" ? "আমার ট্রিপ" : "কনটেন্ট লিস্ট", icon: Package },
            { id: "deliveries", labelEn: activeRole === "service_provider" ? "Bookings Task" : activeRole === "rider" ? "Task Broadcasts" : "Logistics & Returns", labelBn: activeRole === "service_provider" ? "বুকিং টাস্ক" : activeRole === "rider" ? "টাস্ক ব্রডকাস্ট" : "ডেলিভারি ও রিটার্ন", icon: Truck },
            { id: "financials", labelEn: "Financials & Payouts", labelBn: "টাকা উত্তোলন", icon: Wallet },
            { id: "verification", labelEn: "Store Verification", labelBn: "স্টোর যাচাইকরণ", icon: ShieldCheck },
            { id: "service-area", labelEn: "Service Area", labelBn: "ডেলিভারি এরিয়া", icon: MapPin }
          ].map(tab => {
            const Icon = tab.icon;
            const act = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id as any)}
                className={`flex-1 min-w-max flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs md:text-sm font-bold transition-all ${
                  act
                    ? "bg-[var(--pm-accent)] text-white shadow-lg shadow-[var(--pm-accent)]/15"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t(tab.labelEn, tab.labelBn, isEn)}</span>
              </button>
            );
          })}
        </div>

        {/* ── TAB CONTENT: STOREFRONT ── */}
        {activeTab === "storefront" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-base font-black text-white uppercase tracking-tight">
                  {t("Storefront Management", "স্টোরফ্রন্ট ম্যানেজমেন্ট", isEn)}
                </h3>
                <p className="text-xs text-zinc-400 font-bold mt-1">
                  {t("Customize how customers see your shop and products.", "আপনার দোকান এবং পণ্যগুলো গ্রাহকরা কীভাবে দেখবে তা নিয়ন্ত্রণ করুন।", isEn)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={isStorefrontPreview ? "secondary" : "outline"}
                  onClick={() => setIsStorefrontPreview(!isStorefrontPreview)}
                  className="rounded-xl border-white/10 text-xs font-black gap-2 h-11 px-6 uppercase tracking-widest"
                >
                  {isStorefrontPreview ? <LayoutGrid className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {isStorefrontPreview ? t("Edit Mode", "এডিট মোড", isEn) : t("Live Preview", "লাইভ প্রিভিউ", isEn)}
                </Button>
                {!isStorefrontPreview && (
                  <Button 
                    className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black gap-2 h-11 px-8 uppercase tracking-widest"
                    onClick={() => toast.success('Settings Saved!')}
                  >
                    <Check className="w-4 h-4" />
                    {t("Save Changes", "পরিবর্তন সংরক্ষণ", isEn)}
                  </Button>
                )}
              </div>
            </div>

            {isStorefrontPreview ? (
              <div className="rounded-[2.5rem] overflow-hidden border border-emerald-500/20 bg-black/40 p-1">
                 <div className="bg-emerald-500/10 px-6 py-2 border-b border-emerald-500/10 text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] flex items-center justify-between">
                    <span>Interactive Preview Mode / ইন্টারঅ্যাক্টিভ প্রিভিউ</span>
                    <span className="flex items-center gap-2"><Smartphone className="w-3 h-3" /> Mobile Optimized</span>
                 </div>
                 <div className="p-3 md:p-4">
                   <PublicSellerStoreFront sellerName={user?.name || "My Pro Store"} isBilingual={!isEn} />
                 </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Store Branding & Configuration */}
              <div className="lg:col-span-2 space-y-6">
                <GlassCard className="p-6 space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                      <LayoutGrid className="w-4 h-4" />
                      {t("Visual Identity", "ভিজুয়াল আইডেন্টিটি", isEn)}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Store Name / স্টোরের নাম</label>
                        <Input 
                          defaultValue="PaikarMart Official Store"
                          className="bg-white/5 border-white/10 rounded-xl h-12 text-sm font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Accent Color / ব্র্যান্ড কালার</label>
                        <div className="flex gap-2">
                          {['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'].map(color => (
                            <button 
                              key={color}
                              className="w-8 h-8 rounded-full border-2 border-white/10 transition-all hover:scale-110"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Store Slogan / স্টোর স্লোগান</label>
                      <Textarea 
                        placeholder="Leading Wholesale Sourcing Hub in Chawkbazar..."
                        className="bg-white/5 border-white/10 rounded-xl min-h-[80px] text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                      <LayoutGrid className="w-4 h-4" />
                      {t("Store Banner & Layout", "স্টোর ব্যানার ও লেআউট", isEn)}
                    </h4>
                    
                    <div className="aspect-[3/1] rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-2 group cursor-pointer hover:bg-white/10 transition-all overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-teal-600/10 to-blue-600/20 opacity-40" />
                      <Upload className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors relative z-10" />
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest relative z-10">Upload Store Banner (1200x400)</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { id: 'grid', label: 'Grid View', icon: LayoutGrid },
                        { id: 'list', label: 'List View', icon: List },
                        { id: 'minimal', label: 'Minimal', icon: Grid },
                        { id: 'compact', label: 'Compact', icon: LayoutGrid },
                      ].map(mode => (
                        <button
                          key={mode.id}
                          className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/40 transition-all"
                        >
                          <mode.icon className="w-5 h-5 text-zinc-400" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{mode.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </GlassCard>

                {/* Store Analytics for Storefront */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <GlassCard className="p-5 flex flex-col justify-between">
                    <div>
                      <h5 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Store Page Views</h5>
                      <p className="text-2xl font-black text-white mt-1">১২,৪৫০</p>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-emerald-400 font-bold text-xs">
                      <TrendingUp className="w-4 h-4" />
                      +২৪% This Month
                    </div>
                  </GlassCard>
                  <GlassCard className="p-5 flex flex-col justify-between">
                    <div>
                      <h5 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Conversion Rate</h5>
                      <p className="text-2xl font-black text-white mt-1">৪.৮%</p>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-blue-400 font-bold text-xs">
                      <Users className="w-4 h-4" />
                      ৫৪০ New Followers
                    </div>
                  </GlassCard>
                </div>
              </div>

              {/* Sidebar: Categories & Featured */}
              <div className="space-y-6">
                <GlassCard className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest">{t("Store Categories", "স্টোর ক্যাটাগরি", isEn)}</h4>
                    <button className="text-[9px] font-black text-zinc-500 hover:text-white uppercase tracking-widest">Add New</button>
                  </div>
                  <div className="space-y-2">
                    {['Summer Collection', 'Winter Essentials', 'Daily Utility', 'Electronic Accessories'].map(cat => (
                      <div key={cat} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group">
                        <span className="text-xs font-bold text-zinc-300">{cat}</span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1 hover:text-white text-zinc-500 transition-colors"><Settings className="w-3.5 h-3.5" /></button>
                          <button className="p-1 hover:text-rose-400 text-zinc-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard className="p-5 space-y-4">
                  <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest">{t("Featured Products", "নির্বাচিত পণ্য", isEn)}</h4>
                  <div className="space-y-3">
                    {[1, 2].map(i => (
                      <div key={i} className="flex gap-3 items-center p-2 rounded-xl bg-white/5 border border-white/10">
                        <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-white/10" />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-[10px] font-bold text-white uppercase truncate">Product Name {i}</h5>
                          <p className="text-[9px] text-emerald-400 font-black">৳৪৫০.০০</p>
                        </div>
                        <button className="p-2 text-zinc-500 hover:text-white"><Plus className="w-4 h-4" /></button>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full border-dashed border-white/10 hover:bg-white/5 text-[10px] font-black uppercase rounded-xl h-10">
                      Add Featured
                    </Button>
                  </div>
                </GlassCard>

                <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
                  <h5 className="text-xs font-black text-white uppercase">Boost Your Storefront</h5>
                  <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">
                    আপনার স্টোরফ্রন্টকে হোমপেজে প্রচার করুন এবং ৫গুণ বেশি ট্রাফিক পান।
                  </p>
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black text-[10px] uppercase rounded-xl">
                    Promote Now
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
        
        {/* ── TAB CONTENT: OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Personalized Welcome Summary */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  {t(`Welcome back, ${user?.fullName?.split(' ')[0] || 'Partner'}!`, `স্বাগতম, ${user?.fullName?.split(' ')[0] || 'পার্টনার'}!`, isEn)}
                </h3>
                <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                  {t("Here is what's happening with your business today.", "আজকের ব্যবসায়িক খতিয়ান একনজরে দেখুন।", isEn)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{t("Last Payout", "সর্বশেষ উত্তোলন", isEn)}</p>
                  <p className="text-sm font-black text-white">৳১২,৫০০</p>
                </div>
                <div className="h-8 w-px bg-white/10 hidden sm:block" />
                <Button 
                  onClick={handleDownloadReport}
                  variant="outline"
                  className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl text-[10px] font-black gap-2 h-11 px-6 uppercase tracking-widest"
                >
                  <Download className="w-4 h-4" />
                  {t("Download Report", "রিপোর্ট ডাউনলোড", isEn)}
                </Button>
                <Button 
                  onClick={() => setShowAddProduct(true)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl text-[10px] font-black gap-2 h-11 px-6 uppercase tracking-widest shadow-lg shadow-emerald-500/20"
                >
                  <Plus className="w-4 h-4" />
                  {activeRole === "retail_seller" ? t("Add Product", "নতুন পণ্য", isEn) : t("Add Service", "নতুন সার্ভিস", isEn)}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Dynamic statistics overview */}
            <div className="lg:col-span-2 space-y-6">
              {/* Dynamic Role Grid */}
              <div className="grid grid-cols-2 gap-4">
                {categoryStats.statsGrid.map((stat, i) => (
                  <GlassCard key={i} className="p-4 relative overflow-hidden flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] md:text-xs uppercase font-extrabold text-slate-400">
                        {stat.label}
                      </p>
                      <p className="text-xl md:text-2xl font-black text-white mt-1">
                        {stat.value}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-3 text-[10px] md:text-xs">
                      <span className={`font-bold ${stat.color}`}>{stat.extra}</span>
                      <categoryStats.icon className="w-4 h-4 text-slate-500 opacity-40 shrink-0" />
                    </div>
                  </GlassCard>
                ))}
              </div>

              {/* Graphical Analysis Placeholder / Simulated Chart */}
              <GlassCard className="p-5">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      {t("Sales Performance", "বিক্রয় পারফরম্যান্স", isEn)}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      {t("Daily order volume and revenue trend", "দৈনিক অর্ডার এবং আয়ের ট্রেন্ড", isEn)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-[10px] text-slate-400 uppercase font-bold">{t("Sales", "বিক্রয়", isEn)}</span>
                    </div>
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-3 py-1 rounded-full">
                      {t("7 Days", "৭ দিন", isEn)}
                    </span>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={salesPerformanceData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #ffffff10', 
                          borderRadius: '12px',
                          fontSize: '12px',
                          color: '#fff'
                        }}
                        itemStyle={{ color: '#10b981' }}
                        cursor={{ stroke: '#ffffff10', strokeWidth: 2 }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorSales)" 
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-4 mt-2 border-t border-white/5 font-medium">
                  <div className="flex items-center gap-4">
                    <span>{t("Avg. Daily: ৳৪,২০০", "গড় দৈনিক: ৳৪,২০০", isEn)}</span>
                    <span className="text-emerald-400">↑ ১২%</span>
                  </div>
                  <span>{t("Platform Status: Stable", "সার্ভার স্ট্যাটাস: স্থিতিশীল", isEn)}</span>
                </div>
              </GlassCard>

              {/* Monthly Revenue Growth Chart */}
              <GlassCard className="p-5">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      {t("Monthly Revenue Growth", "মাসিক আয় বৃদ্ধি", isEn)}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      {t("6-month financial performance trend", "৬ মাসের আর্থিক পারফরম্যান্স ট্রেন্ড", isEn)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-black text-emerald-400">+২৪.৫%</span>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyGrowthData}
                      margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                        tickFormatter={(value) => `৳${(value / 1000)}k`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #ffffff10', 
                          borderRadius: '12px',
                          fontSize: '12px',
                          color: '#fff'
                        }}
                        cursor={{ fill: '#ffffff05' }}
                        formatter={(value: any) => [`৳${value.toLocaleString()}`, t("Revenue", "আয়", isEn)]}
                      />
                      <Bar 
                        dataKey="revenue" 
                        radius={[6, 6, 0, 0]}
                        animationDuration={1500}
                      >
                        {monthlyGrowthData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={index === monthlyGrowthData.length - 1 ? '#10b981' : '#334155'} 
                            fillOpacity={index === monthlyGrowthData.length - 1 ? 1 : 0.5}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 mt-2 border-t border-white/5">
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{t("Total Revenue", "মোট আয়", isEn)}</p>
                    <p className="text-xs font-black text-white">৳৩,৮৪,০০০</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{t("Projected", "প্রক্ষেপিত", isEn)}</p>
                    <p className="text-xs font-black text-white">৳৪,৫০,০০০</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{t("Target", "লক্ষ্যমাত্রা", isEn)}</p>
                    <p className="text-xs font-black text-emerald-400">৮৫%</p>
                  </div>
                </div>
              </GlassCard>

              {/* Payouts Overview Widget */}
              <GlassCard className="p-5">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      {t("Payouts Overview", "পেমেন্ট ওভারভিউ", isEn)}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      {t("Current earnings and payout status", "বর্তমান আয় এবং পেমেন্ট স্ট্যাটাস", isEn)}
                    </p>
                  </div>
                  <Wallet className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black text-zinc-500 uppercase">{t("Pending", "পেন্ডিং", isEn)}</p>
                    <p className="text-sm font-black text-amber-400">৳১৫,৪০০</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black text-zinc-500 uppercase">{t("Processed", "প্রসেসড", isEn)}</p>
                    <p className="text-sm font-black text-emerald-400">৳১,০৯,৬০০</p>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black text-zinc-500 uppercase">{t("Total Earnings", "মোট আয়", isEn)}</p>
                    <p className="text-lg font-black text-white">৳১,২৫,০০০</p>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <p className="text-[10px] font-bold text-emerald-400">
                      {t("Account Verified", "অ্যাকাউন্ট ভেরিফাইড", isEn)}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Quick Actions & Escrow Overview */}
            <div className="space-y-6">
              {/* Escrow Status Summary Card */}
              <GlassCard className="p-4 border-l-4 border-l-emerald-500 relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider">
                      {t("Escrow Payout Secure", "এসক্রো পেমেন্ট সিকিউর", isEn)}
                    </span>
                    <h3 className="text-lg font-black text-white mt-1">
                      ৳{walletBalance.withdrawable.toLocaleString()}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      {t("Withdrawable Balance (উত্তোলনযোগ্য)", "তাত্ক্ষণিক উত্তোলনযোগ্য ব্যালেন্স", isEn)}
                    </p>
                  </div>
                  <Wallet className="w-8 h-8 text-emerald-400/80 shrink-0" />
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[11px]">
                  <div>
                    <span className="text-slate-400">{t("Held in Escrow: ", "ঝুলে আছে (লেনদেন): ", isEn)}</span>
                    <span className="font-bold text-amber-400">৳{walletBalance.onHoldEscrow.toLocaleString()}</span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-[var(--pm-accent)] text-white hover:bg-[var(--pm-accent)]/80 text-[10px] rounded-lg h-7 px-3"
                    onClick={() => setShowPayoutModal(true)}
                  >
                    Withdraw
                  </Button>
                </div>
              </GlassCard>

              {/* Interactive Help & Warnings */}
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <h4 className="text-[11px] font-bold text-amber-300">
                    {t("Trade License Alert / সতর্কতা", "ট্রেড লাইসেন্স নোটিস", isEn)}
                  </h4>
                  <p className="text-[10px] text-amber-200/80 leading-snug mt-0.5">
                    {t("Trade License is expiring in 15 days. Please update in your dashboard profile.", "আপনার ট্রেড লাইসেন্সটির মেয়াদ সংক্ষীপ্ত হয়ে আসছে। অনুগ্রহ করে সেটি রিনিউ করুন।", isEn)}
                  </p>
                </div>
              </div>

              {/* Dynamic quick help guide depending on role */}
              <GlassCard className="p-4">
                <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[var(--pm-accent)]" />
                  {t("Dynamic Merchant Helper", "ভেণ্ডর সাহায্য নির্দেশিকা", isEn)}
                </h4>
                <p className="text-[10px] text-slate-300 leading-relaxed-snug balance">
                  {activeRole === "retail_seller" && t("Stock your retail items regularly. Unprocessed retail orders will auto-cancel in 48 hours according to rule 3.", "আপনার পণ্যগুলোর স্টক নিয়মিত মনিটর করুন। গ্রাহকের অর্ডার পাওয়ার ৪৮ ঘণ্টার মাঝে ডেলিভারি এসাইন করুন অন্যথায় সেটি বাতিল হবে।", isEn)}
                  {activeRole === "service_provider" && t("Accept customer service bookings immediately. Assign service specialists to the area ZIP correctly to save traveling time.", "গ্রাহকের সেবা বুকিং তাৎক্ষণিক রিসিভ করুন। লোকাল এরিয়ার প্লাম্বিং/এসি ক্লিনিং কাজগুলো এরিয়া ZIP দেখে ভাগ করে দিন।", isEn)}
                  {activeRole === "content_creator" && t("Link your media lessons to the core video unlocker! Unlocked premium classes earn ৳50 - ৳150 with a low commission.", "আপনার প্রিমিয়াম রিলস ও ভিডিওগুলো আনলকিং ফিচারে যুক্ত করুন। প্রতি সাবস্ক্রিপশনে ৫% প্লাটফর্ম কমিশন চার্জ প্রযোজ্য থাকবে।", isEn)}
                </p>
              </GlassCard>
            </div>
          </div>
        </div>
      )}

        {/* ── TAB CONTENT: OPERATIONS ── */}
        {activeTab === "operations" && (
          <div className="space-y-6">
            {/* Context Heading with button to add item */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  {activeRole === "retail_seller" && t("Manage Retail Inventory / পণ্য তালিকা", "রিমুভ ও পণ্য তালিকা নিয়ন্ত্রণ", isEn)}
                  {activeRole === "service_provider" && t("Service Categories Offered / সেবা সমূহ", "যাচাইকৃত সেবাপদ্ধতিসমূহ", isEn)}
                  {activeRole === "content_creator" && t("Digital Premium Course Materials / ভিডিও ও রিলস", "ডিজিটাল সামগ্রী ও কোর্স লিস্ট", isEn)}
                  {activeRole === "rider" && t("Active Trips & Route History / ট্রিপ লিস্ট", "সক্রিয় ট্রিপ ও রুটের ইতিহাস", isEn)}
                </h3>
                <p className="text-xs text-slate-400">
                  {t("Instantly add, remove or control stock of objects", "তাত্ক্ষণিক তালিকা এডিট বা নতুন সেবা অন্তর্ভুক্ত করুন", isEn)}
                </p>
              </div>

              <Button
                onClick={() => setShowAddProduct(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs gap-2"
              >
                <Plus className="w-4 h-4" />
                {activeRole === "retail_seller" && t("New Product", "নতুন প্রডাক্ট", isEn)}
                {activeRole === "service_provider" && t("New Service", "নতুন সার্ভিস", isEn)}
                {activeRole === "content_creator" && t("New Media Lesson", "নতুন লেসন", isEn)}
                {activeRole === "rider" && t("New Trip Log", "নতুন ট্রিপ লগ", isEn)}
              </Button>
            </div>

            {/* Dynamic Operations render based on role */}
            {activeRole === "retail_seller" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.length === 0 ? (
                  <p className="text-xs text-slate-400 py-8 text-center bg-white/[0.01] rounded-2xl border border-dashed border-white/5">
                    No products live yet.
                  </p>
                ) : (
                  products.map((p: any) => (
                    <GlassCard key={p.id} className="p-4 flex gap-4">
                      <img
                        src={p.images?.[0] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200"}
                        alt={p.title}
                        className="w-20 h-20 rounded-xl object-cover border border-white/5"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-bold text-white truncate">{p.title}</h4>
                            <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-full capitalize shrink-0">
                              {p.categoryId}
                            </span>
                          </div>
                          <p className="text-xs text-emerald-400 font-extrabold mt-1">৳{p.price}</p>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>
                            {t("Stock: ", "স্টক: ", isEn)}
                            <span className={p.stock > 0 ? "text-emerald-400 font-bold" : "text-rose-400 font-extrabold"}>
                              {p.stock > 0 ? `${p.stock} units` : "Out of stock"}
                            </span>
                          </span>
                          <button
                            onClick={() => {
                              deleteProduct(p.id);
                              toast.error(t("Product archived", "পণ্যটি তালিকা থেকে সরানো হয়েছে", isEn));
                            }}
                            className="text-red-400 hover:text-red-300 font-bold text-[10px]"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </GlassCard>
                  ))
                )}
              </div>
            ) : activeRole === "service_provider" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {serviceBookings.map((b: any) => (
                  <GlassCard key={b.id} className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-mono text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-md">
                          {b.id}
                        </span>
                        <h4 className="font-bold text-white text-sm mt-1">{b.service}</h4>
                        <p className="text-xs text-slate-300 mt-1">
                          👤 {b.customer} · {b.area}
                        </p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        b.status === "completed"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : b.status === "assigned"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {b.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-white/5">
                      <span>📅 {b.date} &bull; {b.time}</span>
                      <div className="flex gap-2">
                        {b.status === "pending" && (
                          <Button
                            size="sm"
                            className="bg-indigo-600 hover:bg-indigo-500 h-7 text-[10px] rounded-lg"
                            onClick={() => {
                              setServiceBookings(prev => prev.map(item => item.id === b.id ? { ...item, status: "assigned" } : item));
                              toast.success("Service Accepted & Technician assigned!");
                            }}
                          >
                            Accept Booking
                          </Button>
                        )}
                        {b.status === "assigned" && (
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-500 h-7 text-[10px] rounded-lg"
                            onClick={() => {
                              setServiceBookings(prev => prev.map(item => item.id === b.id ? { ...item, status: "completed" } : item));
                              toast.success("Job Completed & funds released from Escrow!");
                            }}
                          >
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            ) : activeRole === "rider" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deliveryTasks.filter(t => t.status !== "pending").map((task: any) => (
                  <GlassCard key={task.id} className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                          {task.type === "ride" ? <Smartphone className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{task.route}</h4>
                          <span className="text-[10px] text-slate-400">
                            {task.type === "ride" ? "Ride Share" : task.type === "parcel" ? "Parcel Delivery" : "Food Delivery"}
                          </span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        task.status === "delivered" ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-white/5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        Live tracking active
                      </span>
                      {task.status !== "delivered" && (
                        <Button 
                          size="sm" 
                          className="bg-emerald-600 h-7 text-[10px] rounded-lg"
                          onClick={() => {
                            setDeliveryTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: "delivered", timeline: [...t.timeline, "Delivered successfully!"] } : t));
                            toast.success("Task completed! Payment added to wallet.");
                          }}
                        >
                          Finish Task
                        </Button>
                      )}
                    </div>
                  </GlassCard>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {creatorContents.map((c: any) => (
                  <GlassCard key={c.id} className="p-4 flex flex-col justify-between gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                          <Video className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-white truncate">{c.title}</h4>
                          <span className="text-[10px] text-slate-400">
                            {c.premium ? `Premium (৳${c.price})` : "Free Course Reel"}
                          </span>
                        </div>
                      </div>
                      {c.premium && (
                        <span className="text-xs bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                          ৳{c.price * c.purchases} earned
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-white/5">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {c.views.toLocaleString()} views
                      </span>
                      {c.premium ? (
                        <span className="text-indigo-400 font-bold text-[11px] bg-indigo-500/5 px-2.5 py-1 rounded-lg">
                          🔒 {c.purchases} Lesson unlocks
                        </span>
                      ) : (
                        <span className="text-rose-400 font-medium text-[11px]">
                          📱 TikTok/Reels Stream
                        </span>
                      )}
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB CONTENT: DELIVERIES & RETURNS ── */}
        {activeTab === "deliveries" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Deliveries Dispatch & Transit section */}
              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  {activeRole === "service_provider" ? t("Service Appointments & Dispatch", "সার্ভিস কাজের শিডিউল ও অ্যাসাইনমেন্ট", isEn) : t("Courier Logistics / কুরিয়ার ও শিপমেন্ট", "শিপিং এবং কুরিয়ার এসাইনমেন্ট", isEn)}
                </h3>
                <p className="text-xs text-slate-400">
                  {activeRole === "service_provider" ? t("Dispatch specialists with location tools", "প্রয়োজনীয় এরিয়া ZIP অনুসারে কাস্টমার শিডিউল", isEn) : t("Assign third-party riders (Pathao, RedX, Self) or track parcels", "দেশীয় কুরিয়ার (পাঠাও, রেড-এক্স, নিজস্ব লোক) এসাইন ও ট্র্যাক করুন", isEn)}
                </p>
              </div>

              {activeRole === "service_provider" ? (
                <GlassCard className="p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h4 className="text-xs font-extrabold uppercase text-indigo-400 shrink-0">
                      Service Specialist Maps
                    </h4>
                    <span className="text-[10px] text-slate-400">Division &bull; Area Zip filter</span>
                  </div>
                  <div className="space-y-3">
                    {deliveryTasks.map((t: any) => (
                      <div key={t.id} className="p-3.5 bg-white/5 border border-white/10 rounded-xl relative">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-[10px] text-slate-400">Client: {t.id}</span>
                            <h5 className="font-bold text-white text-xs mt-0.5">Route: {t.route}</h5>
                          </div>
                          <span className="text-[10px] bg-indigo-400/10 text-indigo-400 border border-indigo-400/20 px-2 py-0.5 rounded-full font-bold uppercase">
                            assigned
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              ) : activeRole === "rider" ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold uppercase text-orange-400">{t("New Task Broadcasts", "নতুন টাস্ক ব্রডকাস্ট", isEn)}</h4>
                    <span className="text-[10px] text-slate-500 animate-pulse">● Searching for nearby tasks...</span>
                  </div>
                  {deliveryTasks.filter(t => t.status === "pending").map((task: any) => (
                    <GlassCard key={task.id} className="p-4 flex flex-col gap-3 border-l-4 border-l-orange-500">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-orange-400 font-extrabold uppercase bg-orange-500/15 px-2 py-0.5 rounded-md">
                              {task.id}
                            </span>
                            <span className="text-[10px] text-slate-300 font-bold">৳১৪০ + ৳২০ টিপস</span>
                          </div>
                          <h4 className="font-bold text-white text-sm mt-2">{task.route}</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">Pick up: 1.2km away · Deliver: 4.5km</p>
                        </div>
                        <Button 
                          className="bg-orange-500 hover:bg-orange-400 text-white font-bold h-9 px-4 rounded-xl text-xs"
                          onClick={() => {
                            setDeliveryTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: "picked_up", timeline: ["Task Accepted", "Moving to pickup point"] } : t));
                            toast.success("Task accepted! Navigate to pickup point.");
                          }}
                        >
                          Accept
                        </Button>
                      </div>
                    </GlassCard>
                  ))}
                  {deliveryTasks.filter(t => t.status === "pending").length === 0 && (
                    <div className="py-12 text-center text-slate-500 text-xs italic">
                      No new tasks available in your current zone.
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {deliveryTasks.map((task: any) => (
                    <GlassCard key={task.id} className="p-4 flex flex-col gap-4">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="text-[10px] font-mono text-indigo-400 font-extrabold uppercase bg-indigo-500/15 px-2 py-0.5 rounded-md">
                            {task.id}
                          </span>
                          <h4 className="font-bold text-white text-xs mt-2">
                            {t("Route: ", "রুট: ", isEn)} {task.route}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Order Ref: {task.orderId} · Courier: <span className="text-emerald-400 font-bold">{task.courier}</span>
                          </p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          task.status === "pending"
                            ? "bg-amber-400/10 text-amber-400 border border-amber-400/20"
                            : "bg-blue-400/10 text-blue-400 border border-blue-400/20"
                        }`}>
                          {task.status.replace("_", " ")}
                        </span>
                      </div>

                      {/* Timeline status update log */}
                      <div className="bg-black/20 p-2.5 rounded-xl text-[10px] font-mono text-slate-400 space-y-1">
                        <span className="text-white/40 font-bold uppercase block text-[9px]">Transit Logs &bull; ট্র্যাকিং লগ:</span>
                        {task.timeline.map((log: string, lIdx: number) => (
                          <div key={lIdx} className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span>{log}</span>
                          </div>
                        ))}
                      </div>

                      {/* Courier Selection Actions if Pending */}
                      {task.status === "pending" ? (
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                          <span className="text-[10px] text-slate-400 font-bold">{t("Dispatch: ", "পাঠান: ", isEn)}</span>
                          <Button
                            size="sm"
                            className="bg-rose-600 hover:bg-rose-500 text-white font-bold h-7 text-[10px] rounded-lg"
                            onClick={() => triggerRiderAssign(task.id, "Pathao Fast (পাঠাও)")}
                          >
                            Pathao (৳৬০)
                          </Button>
                          <Button
                            size="sm"
                            className="bg-amber-600 hover:bg-amber-500 text-white font-bold h-7 text-[10px] rounded-lg"
                            onClick={() => triggerRiderAssign(task.id, "RedX Direct (রেডেক্স)")}
                          >
                            RedX (৳৫০)
                          </Button>
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-7 text-[10px] rounded-lg"
                            onClick={() => triggerRiderAssign(task.id, "Self Delivery (নিজস্ব লোক)")}
                          >
                            Self (৳০)
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                          <Button
                            size="sm"
                            className="bg-emerald-700 hover:bg-emerald-600 text-white h-7 text-[10px] rounded-lg"
                            onClick={() => {
                              setDeliveryTasks(prev => prev.map(item => item.id === task.id ? { ...item, status: "delivered", timeline: [...item.timeline, "Delivered Successfully"] } : item));
                              toast.success("Marked as Delivered & escrow funds released!");
                            }}
                          >
                            Mark Delivered
                          </Button>
                        </div>
                      )}
                    </GlassCard>
                  ))}
                </div>
              )}
            </div>

            {/* Returns and Disputes Manager */}
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  {t("Returns & Refunds / রিটার্ন", "রিটার্ন এবং রিফান্ড", isEn)}
                </h3>
                <p className="text-xs text-slate-400">
                  {t("Approve customer complaints fairly", "রিফান্ড বা প্রডাক্ট ফেরত অনুরোধগুলো নিষ্পত্তি করুন", isEn)}
                </p>
              </div>

              {returnsRequests.length === 0 ? (
                <GlassCard className="p-4 text-center py-8">
                  <p className="text-xs text-slate-400">No return requests found.</p>
                </GlassCard>
              ) : (
                returnsRequests.map((ret: any) => (
                  <GlassCard key={ret.id} className="p-4 flex flex-col gap-3 relative border border-dashed border-red-500/20">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <span className="text-[10px] font-mono bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-md font-bold text-slate-200">
                          {ret.id}
                        </span>
                        <h4 className="font-bold text-sm text-white mt-1.5">{ret.item}</h4>
                        <p className="text-xs text-slate-400">Ref Order: {ret.orderId} &bull; {ret.date}</p>
                      </div>
                      <span className={`text-[10px] capitalize font-bold px-2 py-0.5 rounded-full ${
                        ret.status === "pending" ? "bg-amber-500/10 text-amber-400" : ret.status === "approved" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                      }`}>
                        {ret.status}
                      </span>
                    </div>

                    <div className="bg-red-500/5 p-3 rounded-xl">
                      <p className="text-[10px] text-red-200 leading-snug">
                        <strong>Reason: </strong> {ret.reason}
                      </p>
                    </div>

                    {ret.status === "pending" && (
                      <div className="flex gap-2 pt-2 border-t border-white/5 justify-end">
                        <Button
                          size="sm"
                          className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-[10px] h-7 px-3 rounded-lg"
                          onClick={() => handleReturnDecision(ret.id, "rejected")}
                        >
                          Reject Return
                        </Button>
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] h-7 px-3 rounded-lg"
                          onClick={() => handleReturnDecision(ret.id, "approved")}
                        >
                          Approve Refund (৳{ret.refundAmount})
                        </Button>
                      </div>
                    )}
                  </GlassCard>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── TAB CONTENT: FINANCIALS & PAYOUTS ── */}
        {activeTab === "financials" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Dynamic Ledger & Fee Estimator */}
              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  {t("Ledger & Revenue Settlement / স্টেটমেন্ট", "লেনদেন ও ব্যালেন্স সেটেলমেন্ট", isEn)}
                </h3>
                <p className="text-xs text-slate-400">
                  {t("Transparent financial statistics and deduction fees tracker", "৫% চার্জ ও ৫% ভ্যাট কর্তনের পর ব্যাংক/বিকাশ স্টেটমেন্ট ট্র্যাকার", isEn)}
                </p>
              </div>

              {/* Fee and Commission Calculator Widget */}
              <GlassCard className="p-5 space-y-4">
                <h4 className="text-xs uppercase font-extrabold text-indigo-400">
                  {t("Deduction Estimator & Government VAT / ভ্যাট ও কমিশন", "চার্জ হিসাব রক্ষক ক্যালকুলেটর", isEn)}
                </h4>
                <div className="grid grid-cols-3 gap-4 border-b border-white/5 pb-4">
                  <div className="bg-white/5 p-3 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">{t("Sells Value", "বিক্রি মূল্য", isEn)}</span>
                    <span className="text-sm font-bold text-white">৳১০,০০০</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">{t("VAT (5% Government)", "ভ্যাট ৫% (সরকারি)", isEn)}</span>
                    <span className="text-sm font-bold text-red-400">-৳৫০০</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">{t("Payout settlement", "উত্তোলনযোগ্য নেট", isEn)}</span>
                    <span className="text-sm font-bold text-emerald-400">৳৯,৫০০</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                    {t("Payout target configuration / উত্তোলন মাধ্যম", "অর্থ উত্তোলনের অ্যাকাউন্ট কনফিগারেশন", isEn)}
                  </h5>
                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <div className="flex-1 flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.01]">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${walletBalance.payoutProvider === "bkash" ? "border-pink-500" : "border-slate-500"}`}>
                          {walletBalance.payoutProvider === "bkash" && <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">bKash (বিকাশ)</span>
                          <span className="text-[10px] text-slate-400">{walletBalance.payoutPhone}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-pink-500">Selected</span>
                    </div>

                    <div className="flex-1 flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.01]">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${walletBalance.payoutProvider === "nagad" ? "border-orange-500" : "border-slate-500"}`}>
                          {walletBalance.payoutProvider === "nagad" && <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">Nagad (নগদ)</span>
                          <span className="text-[10px] text-slate-400">Not configured</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setWalletBalance(prev => ({ ...prev, payoutProvider: "nagad" }));
                          toast.success("Nagad Selected as primary payout");
                        }}
                        className="text-[10px] font-bold text-indigo-400 hover:underline"
                      >
                        Set Primary
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Quick cashout panel */}
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  {t("Instant Withdraw / প্রত্যাহার", "তাত্ক্ষণিক উইথড্র", isEn)}
                </h3>
                <p className="text-xs text-slate-400">
                  {t("Instant bKash details transfer settled in minutes", "বিকাশ/নগদে ব্যালেন্স উইথড্র প্রক্রিয়া", isEn)}
                </p>
              </div>

              <GlassCard className="p-4 space-y-4">
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Available Now</span>
                    <span className="text-base font-black text-white">৳{walletBalance.withdrawable.toLocaleString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-500 hover:opacity-90 h-8 rounded-lg text-xs text-white"
                      onClick={() => setShowPayoutModal(true)}
                    >
                      {t("Cash Out (৳)", "টাকা উত্তোলন", isEn)}
                    </Button>
                    {activeRole === "rider" && (
                      <Button
                        size="sm"
                        className="bg-orange-600 hover:bg-orange-500 hover:opacity-90 h-8 rounded-lg text-xs text-white"
                        onClick={() => setShowDepositModal(true)}
                      >
                        {t("Deposit Cash", "টাকা জমা দিন", isEn)}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 leading-normal-relaxed space-y-1 bg-black/10 p-3 rounded-xl">
                  <span className="text-white/30 font-bold block">Terms:</span>
                  <p>&bull; Maximum cashout value per turn is ৳২৫,০০০.</p>
                  <p>&bull; 5% VAT automatically computed according to rule VAT_RATE = 0.05.</p>
                </div>
              </GlassCard>
            </div>
          </div>
        )}

        {/* ── TAB CONTENT: VERIFICATION ── */}
        {activeTab === "verification" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">
                  {t("Merchant Identity & Verification / ভেরিফিকেশন", "মার্চেন্ট পরিচয় ও গুণগত মান যাচাইকরণ", isEn)}
                </h3>
                <p className="text-xs text-slate-400">
                  {t("Complete verification to unlock premium bidding, higher bounds and trusted store badge.", "ভেরিফিকেশন সম্পন্ন করে বিডিং, সর্বোচ্চ পেমেন্ট লিমিট এবং ট্রাস্ট ব্যাজ আনলক করুন।", isEn)}
                </p>
              </div>

              {/* Status Banner */}
              <GlassCard className="p-5 flex items-start gap-4">
                <div className={`p-3 rounded-2xl ${
                  profile.verificationStatus === "approved"
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : profile.verificationStatus === "pending"
                    ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                    : "bg-white/5 text-white/50 border border-white/10"
                }`}>
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <div className="font-extrabold text-sm text-white">
                    {profile.verificationStatus === "approved" && t("Identity Status: Verified (Level 5)", "আইডেন্টিটি স্ট্যাটাস: ভেরিফাইড (লেভেল ৫)", isEn)}
                    {profile.verificationStatus === "pending" && t("Identity Status: Processing Review", "আইডেন্টিটি স্ট্যাটাস: রিভিউধীন রয়েছে", isEn)}
                    {profile.verificationStatus === "unsubmitted" && t("Identity Status: Unverified", "আইডেন্টিটি স্ট্যাটাস: যাচাই সম্পন্ন নয়", isEn)}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed-snug">
                    {profile.verificationStatus === "approved" && t("Your merchant account is fully verified per Bangladesh e-CAB and trade policy requirements. Customer badge active.", "আপনার মার্চেন্ট একাউন্টটি বাংলাদেশের ই-ক্যাব নিয়মানুযায়ী ভেরিফাইড। গ্রাহকগণ এখন আপনার আস্থা ব্যাজ দেখতে পাবেন।", isEn)}
                    {profile.verificationStatus === "pending" && t("We have received your uploaded files. Our team typically takes 24 hours to clear manual review.", "আপনার আপলোড করা ফাইলগুলো আমরা পেয়েছি। অ্যাডমিন প্যানেল সাধারণত আগামী ২৪ ঘণ্টার মাঝে ফাইলগুলো রিভিউ করবে।", isEn)}
                    {profile.verificationStatus === "unsubmitted" && t("Please submit your valid National ID copy, trade license, or passport to establish platform credentials.", "অনুগ্রহ করে আপনার সচিত্র জাতীয় পরিচয়পত্র, ট্রেড লাইসেন্স বা পাসপোর্ট কপি আপলোড করে রিভিউতে পাঠান।", isEn)}
                  </p>
                </div>
              </GlassCard>

              {/* Interactive Form */}
              {profile.verificationStatus !== "approved" && (
                <GlassCard className="p-6 space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-400 block">{t("Primary Sourcing Category", "প্রধান সোর্সিং ক্যাটাগরি", isEn)}</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {["Fashion", "Kitchen", "Grocery", "Electronics", "Services", "Real Estate"].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => submitVerification(profile.documents, profile.type, cat)}
                          className={`px-3 py-3 rounded-xl border text-xs font-bold transition-all ${
                            profile.category === cat
                              ? "border-[var(--pm-accent)] bg-[var(--pm-accent)]/15 text-[var(--pm-accent)]"
                              : "border-white/5 bg-white/[0.02] text-slate-400 hover:text-white"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Document Uploader Card */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase text-slate-400 block">{t("Required Identifications", "প্রয়োজনীয় আইডেন্টিফিকেশন কপি", isEn)}</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { id: "nid", label: "National ID (জাতীয় পরিচয়পত্র)", icon: FileText },
                        { id: "trade", label: "Trade License (ট্রেড লাইসেন্স)", icon: Store },
                        { id: "passport", label: "Passport Doc (পাসপোর্ট কপি)", icon: ShieldCheck }
                      ].map((docType) => {
                        const Icon = docType.icon;
                        const uploaded = profile.documents.some(d => d.kind === docType.id || (docType.id === "trade" && d.kind === "business"));
                        return (
                          <div
                            key={docType.id}
                            onClick={() => {
                              if (uploaded) return;
                              const mockId = `doc_${Math.random().toString(36).slice(2, 8)}`;
                              const nextDocs = [
                                ...profile.documents,
                                { id: mockId, name: `${docType.id.toUpperCase()}_v5_attachment.pdf`, kind: (docType.id === "trade" ? "business" : docType.id) as any }
                              ];
                              submitVerification(nextDocs, profile.type, profile.category);
                              toast.success(t(`${docType.id.toUpperCase()} mockup document uploaded!`, `${docType.label} মক ফাইল সফলভাবে আপলোড হয়েছে!`, isEn));
                            }}
                            className={`p-4 rounded-xl border border-dashed transition-all cursor-pointer text-center flex flex-col items-center gap-2 ${
                              uploaded
                                ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400"
                                : "border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                            }`}
                          >
                            {uploaded ? <Check className="w-5 h-5 text-emerald-400 animate-bounce" /> : <Upload className="w-5 h-5" />}
                            <span className="text-[11px] font-bold leading-tight">{docType.label}</span>
                            <span className="text-[9px] text-slate-500 block">
                              {uploaded ? t("Uploaded Successfully", "আপলোড সম্পন্ন", isEn) : t("Tap to choose file", "ফাইল সিলেক্ট করতে ট্যাপ করুন", isEn)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Upload list */}
                  {profile.documents.length > 0 && (
                    <div className="space-y-2 bg-black/15 p-4 rounded-xl border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        {t("Selected Attachments list / তালিকা", "আপলোডকৃত ফাইল সমুহ", isEn)}
                      </span>
                      <div className="space-y-2 mt-2">
                        {profile.documents.map((d: any) => (
                          <div key={d.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-xs text-white">
                            <div className="flex items-center gap-2 min-w-0">
                              <FileText className="w-3.5 h-3.5 text-[var(--pm-accent)] shrink-0" />
                              <span className="truncate">{d.name}</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const nextDocs = profile.documents.filter(item => item.id !== d.id);
                                submitVerification(nextDocs, profile.type, profile.category);
                                toast.error(t("Document attachment removed", "ফাইলটি বাতিল করা হয়েছে", isEn));
                              }}
                              className="text-red-400 hover:text-red-300 p-1 rounded-md hover:bg-red-500/10"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={() => {
                        if (profile.documents.length === 0) {
                          toast.error(t("Please attach at least one document copy", "অনুগ্রহ করে কমপক্ষে একটি ফাইল সংযুক্ত করুন", isEn));
                          return;
                        }
                        submitVerification(profile.documents, profile.type, profile.category);
                        toast.success(t("Verification documents submitted for approval!", "আপনার আবেদনটি অ্যাডমিন প্যানেলে সাবমিট করা হয়েছে!", isEn));
                      }}
                      className="bg-[var(--pm-accent)] hover:opacity-95 text-white font-bold rounded-xl text-xs px-6 py-2"
                    >
                      {t("Submit Documents / সাবমিট", "আবেদন সাবমিট করুন", isEn)}
                    </Button>
                  </div>
                </GlassCard>
              )}
            </div>

            {/* Side Helper */}
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  {t("Sourcing Guidelines / ই-ক্যাব নিয়মাবলী", "ই-ক্যাব মার্চেন্ট গাইডলাইন", isEn)}
                </h3>
              </div>
              <GlassCard className="p-4 space-y-4">
                <div className="text-xs text-slate-300 leading-relaxed space-y-2.5">
                  <p>&bull; <strong>e-CAB Compliance:</strong> Every seller or digital content creator must maintain clean identity records per national e-commerce policies.</p>
                  <p>&bull; <strong>Badge Benefits:</strong> Complete level 5 verification to clear instant cashouts up to ৳১,৫০,০০০ and get Priority support routing.</p>
                </div>
              </GlassCard>
            </div>
          </div>
        )}

        {activeTab === "service-area" && (
          <ServiceAreaSettings />
        )}
      </div>

      {/* ── MODAL: WIDGET ADD PRODUCT ── */}
      <AnimatePresence>
        {showAddProduct && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-5 shadow-2xl relative"
            >
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                <Plus className="w-5 h-5 text-emerald-400" />
                {activeRole === "retail_seller" && t("Publish New Retail Product", "নতুন খুচরা পণ্য প্রকাশ করুন", isEn)}
                {activeRole === "service_provider" && t("List Professional Service Offered", "নতুন পেশাদার সেবা তালিকা করুন", isEn)}
                {activeRole === "content_creator" && t("Upload Premium Digital Content Lesson", "নতুন ডিজিটাল ভিডিও সামগ্রী প্রকাশ", isEn)}
              </h3>

              <form onSubmit={handleAddNewItemSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-bold uppercase">
                    {activeRole === "retail_seller" && t("Product Name / পণ্যের নাম", "পণ্যের নাম (EN / BN)", isEn)}
                    {activeRole === "service_provider" && t("Service Title / সেবার নাম", "লেসন বা সেবার নাম (EN / BN)", isEn)}
                    {activeRole === "content_creator" && t("Content / Lesson Title", "ভিডিও বা কোর্সের নাম (EN / BN)", isEn)}
                  </label>
                  <Input
                    required
                    value={pricingInput.title}
                    onChange={e => setPricingInput({ ...pricingInput, title: e.target.value })}
                    placeholder={activeRole === "retail_seller" ? "Cotton Throw" : "AC deep master cleanup"}
                    className="bg-black/20 border-white/10 text-white placeholder-slate-500 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 font-bold uppercase">
                      {t("Price (৳ / BDT)", "বিক্রি মূল্য (৳)", isEn)}
                    </label>
                    <Input
                      required
                      type="number"
                      value={pricingInput.price}
                      onChange={e => setPricingInput({ ...pricingInput, price: e.target.value })}
                      placeholder="e.g. 50"
                      className="bg-black/20 border-white/10 text-white placeholder-slate-500 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1.5 font-bold uppercase">
                      {activeRole === "retail_seller" ? t("Stock count", "স্টক পরিমাণ", isEn) : t("Available Spots", "সীমিত স্পট", isEn)}
                    </label>
                    <Input
                      type="number"
                      value={pricingInput.stock}
                      onChange={e => setPricingInput({ ...pricingInput, stock: e.target.value })}
                      placeholder="e.g. 24"
                      className="bg-black/20 border-white/10 text-white placeholder-slate-500 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-bold uppercase">
                    {t("Description / বিবরণ", "সংক্ষিপ্ত বিবরণ", isEn)}
                  </label>
                  <Textarea
                    placeholder={t("Details about specifications", "প্রডাক্ট বা সেবার বিস্তারিত বিবরণ এখানে লিখুন...", isEn)}
                    className="bg-black/20 border-white/10 text-white placeholder-slate-500 rounded-xl text-xs"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-2 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowAddProduct(false)}
                    className="text-slate-400 hover:text-white text-xs h-10 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 h-10 rounded-xl"
                  >
                    Publish live
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL: DEPOSIT CASH (RIDER) ── */}
      <AnimatePresence>
        {showDepositModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-orange-400" />
                  {t("Deposit Collected Cash", "সংগৃহীত টাকা জমা দিন", isEn)}
                </h3>
                <button onClick={() => setShowDepositModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleDepositCash} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-bold uppercase">
                    {t("Amount to Deposit", "জমার পরিমাণ (৳)", isEn)}
                  </label>
                  <Input
                    required
                    type="number"
                    value={depositAmount}
                    onChange={e => setDepositAmount(e.target.value)}
                    placeholder="e.g. 500"
                    className="bg-black/20 border-white/10 text-white placeholder-slate-500 rounded-xl"
                  />
                </div>
                <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[10px] text-orange-200">
                  <p>{t("Riders must deposit collected cash within 24 hours of delivery. System tracks individual zone collections.", "ডেলিভারি সম্পন্ন করার ২৪ ঘণ্টার মাঝে সংগৃহীত ক্যাশ জমা দিতে হবে। সিস্টেম আপনার জোনের কালেকশন ট্রাক করছে।", isEn)}</p>
                </div>
                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold h-12 rounded-xl">
                  {t("Confirm Deposit", "জমা নিশ্চিত করুন", isEn)}
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL: ACCORDION WITHDRAW CASHOUT ── */}
      <AnimatePresence>
        {showPayoutModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-2xl p-5 shadow-2xl relative"
            >
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
                <Wallet className="w-5 h-5 text-emerald-400" />
                {t("Secure Cash Out Transfer", "নিরাপদ ফান্ড সেটেলমেন্ট উত্তোলন", isEn)}
              </h3>
              <p className="text-[11px] text-slate-400 leading-snug mb-4">
                {t("Funds will transfer directly to the configured bKash number with transparent government VAT mapping.", "নির্ধারিত বিকাশ ওয়ালেটে তাৎক্ষণিক ফান্ড পাঠানো হবে। ৫% সরকারি ভ্যাট ও ৫% প্ল্যাটফর্ম চার্জ স্বয়ংক্রিয়ভাবে কর্তনযোগ্য থাকবে।", isEn)}
              </p>

              <form onSubmit={handleWithdrawTrigger} className="space-y-4">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    {t("Primary Route: ", "প্রথম মাধ্যম: ", isEn)} {walletBalance.payoutProvider.toUpperCase()} ({walletBalance.payoutPhone})
                  </span>
                  <div className="mt-2">
                    <label className="block text-xs text-slate-300 font-semibold mb-1.5">
                      {t("Withdraw Amount (৳ BDT)", "উত্তোলনযোগ্য পরিমাণ (৳)", isEn)}
                    </label>
                    <Input
                      required
                      type="number"
                      value={withdrawAmount}
                      onChange={e => setWithdrawAmount(e.target.value)}
                      placeholder={t("Max editable ৳", `সর্বোচ্চ ৳${walletBalance.withdrawable}`, isEn)}
                      className="bg-black/20 border-white/10 text-white placeholder-slate-500 rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowPayoutModal(false)}
                    className="text-slate-400 hover:text-white text-xs h-10 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[var(--pm-accent)] hover:bg-[var(--pm-accent)]/90 text-white font-bold text-xs px-5 h-10 rounded-xl"
                  >
                    Confirm Settlement
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
