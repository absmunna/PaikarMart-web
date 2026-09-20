/// <reference types="google.maps" />
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MapPin, Search, ArrowLeft, Loader2, Store, Clock, 
  Sparkles, Filter, X, ChevronRight, ShieldCheck, 
  Phone, Navigation, Info, MessageSquare, ShoppingCart,
  Package, Map, Grid, Plus, Minus, UserCheck, ThumbsUp, 
  Trash2, Check, AlertCircle, Send, Star, User, 
  DollarSign, Wallet, CreditCard, Award, Eye, Truck, Heart,
  ShoppingBag, Settings, RefreshCw, Layers
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { StoryBar } from "@shared/StoryBar";
import { CategoryNavBar } from "@shared/CategoryNavBar";
import { PortalIconBar } from "@shared/PortalIconBar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/AuthContext";
import { VerificationBadge } from "@/components/common/VerificationBadge";
import { TrustBadge } from "@/components/common/TrustBadge";
import { ProgressiveVerificationPrompt } from "@/components/common/ProgressiveVerificationPrompt";
import { BDAddressSelector, AddressDetails } from "@/components/common/BDAddressSelector";
import { useLanguage } from "@/features/language/LanguageContext";
import { APIProvider, Map as GoogleMap, AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';

const API_KEY =
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

/* ═══════════════════════════════════════════════
   Localized Local (Nearby) Mock Dataset (Shops & On-Demand Services)
   ═══════════════════════════════════════════════ */
const INITIAL_NEARBY_SHOPS_MOCK = [
  {
    id: "nb-1",
    name: "রহিম জেনারেল স্টোর (Rahim General Store)",
    category: "grocery",
    categoryLocal: "মুদিখানা",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600",
    rating: 4.8,
    reviews: 156,
    location: "মিরপুর ২, ঢাকা (Mirpur 2, Dhaka)",
    distance: "0.8 km",
    isOpen: true,
    isVerified: true,
    hasTradeLicense: true,
    phone: "01700000001",
    type: "shop",
    trustLevel: 7,
    trustScore: 98,
    queueStatus: "fast",
    prepTime: "5-10 Mins",
    yearsInBusiness: 6,
    owner: "মো: আব্দুর রহিম",
    lat: 23.8041,
    lng: 90.3601,
    deliverySpeed: 4.9,
    responseRate: 100,
    csat: 98,
    repeatBuyers: 142,
    catalog: [
      { id: "p1", name: "Fresh Milk (১ লিটার)", price: 90, image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100", stockStatus: "in-stock", qtyLeft: 24 },
      { id: "p2", name: "Premium Miniket Rice (৫ কেজি)", price: 340, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100", stockStatus: "low-stock", qtyLeft: 3 },
      { id: "p3", name: "Organic Mustard Oil (১ লিটার)", price: 280, image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=100", stockStatus: "out-of-stock", qtyLeft: 0 }
    ]
  },
  {
    id: "nb-2",
    name: "লাজ ফার্মা - মিরপুর শাখা (Lazz Pharma)",
    category: "pharmacy",
    categoryLocal: "ফার্মেসি",
    image: "https://images.unsplash.com/photo-1586015555751-6397455d8b2d?w=600",
    rating: 4.9,
    reviews: 420,
    location: "মিরপুর ১০, ঢাকা (Mirpur 10, Dhaka)",
    distance: "1.2 km",
    isOpen: true,
    isVerified: true,
    hasTradeLicense: true,
    phone: "01700000002",
    type: "shop",
    trustLevel: 7,
    trustScore: 99,
    queueStatus: "normal",
    prepTime: "10-15 Mins",
    yearsInBusiness: 12,
    owner: "ফার্মাসিস্ট সুহেল রানা",
    lat: 23.8223,
    lng: 90.3654,
    deliverySpeed: 4.8,
    responseRate: 99,
    csat: 99,
    repeatBuyers: 380,
    catalog: [
      { id: "p4", name: "Napa Extend (১২ টি)", price: 30, image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=100", stockStatus: "in-stock", qtyLeft: 120 },
      { id: "p5", name: "Antiseptic Liquid (২০০ মিলি)", price: 120, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100", stockStatus: "low-stock", qtyLeft: 2 },
      { id: "p6", name: "Surgical Mask Box (৫০ টি)", price: 150, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=100", stockStatus: "in-stock", qtyLeft: 45 }
    ]
  },
  {
    id: "nb-3",
    name: "সিলভান রেস্টুরেন্ট ও ক্যাফে (Sultan Dine Local)",
    category: "restaurant",
    categoryLocal: "রেস্টুরেন্ট",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
    rating: 4.6,
    reviews: 210,
    location: "মিরপুর ১০, ঢাকা (Mirpur 10, Dhaka)",
    distance: "1.4 km",
    isOpen: true,
    isVerified: true,
    hasTradeLicense: true,
    phone: "01700000010",
    type: "shop",
    trustLevel: 6,
    trustScore: 92,
    queueStatus: "busy",
    prepTime: "25-30 Mins",
    yearsInBusiness: 4,
    owner: "ম্যানেজার হাসিবুল ইসলাম",
    lat: 23.8211,
    lng: 90.3644,
    deliverySpeed: 4.4,
    responseRate: 90,
    csat: 94,
    repeatBuyers: 120,
    catalog: [
      { id: "p7", name: "Kacchi Biryani Local (হাফ)", price: 220, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=100", stockStatus: "in-stock", qtyLeft: 30 },
      { id: "p8", name: "Chicken Jhal Fry", price: 140, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=100", stockStatus: "low-stock", qtyLeft: 5 },
      { id: "p9", name: "Special Borhani (২৫০ মিলি)", price: 60, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100", stockStatus: "in-stock", qtyLeft: 50 }
    ]
  },
  {
    id: "nb-4",
    name: "মিরপুর ইলেকট্রিক ও রিপেয়ার (Expert Electrician)",
    category: "services",
    categoryLocal: "সেবাসমূহ",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600",
    rating: 4.7,
    reviews: 84,
    location: "মিরপুর ১৪, ঢাকা (Mirpur 14, Dhaka)",
    distance: "1.5 km",
    isOpen: true,
    isVerified: true,
    hasTradeLicense: false,
    phone: "01700000003",
    type: "service",
    trustLevel: 5,
    trustScore: 89,
    queueStatus: "normal",
    prepTime: "20 Mins Dispatch",
    yearsInBusiness: 8,
    owner: "আব্দুল করিম",
    lat: 23.8123,
    lng: 90.3789,
    deliverySpeed: 4.7,
    responseRate: 95,
    csat: 93,
    repeatBuyers: 32,
    catalog: [
      { id: "s1", name: "Ceiling Fan Repairing (ফ্যান মেরামত)", price: 200, image: "https://images.unsplash.com/photo-1565608414364-7936a798cb3d?w=100", stockStatus: "in-stock", qtyLeft: 10 },
      { id: "s2", name: "Short Circuit Troubleshooting", price: 500, image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=100", stockStatus: "in-stock", qtyLeft: 10 },
      { id: "s3", name: "Home AC Service & Diagnostic", price: 1200, image: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=100", stockStatus: "low-stock", qtyLeft: 1 }
    ]
  },
  {
    id: "nb-5",
    name: "সালমা বুটিকস ও টেইলার্স (Salma Boutique)",
    category: "homemade",
    categoryLocal: "হোমমেড ও বুটিকস",
    image: "https://images.unsplash.com/photo-1556905200-279565513a2d?w=600",
    rating: 4.6,
    reviews: 32,
    location: "মিরপুর ১২, ঢাকা (Mirpur 12, Dhaka)",
    distance: "1.9 km",
    isOpen: true,
    isVerified: true,
    hasTradeLicense: false,
    phone: "01700000004",
    type: "service",
    trustLevel: 4,
    trustScore: 85,
    queueStatus: "fast",
    prepTime: "2 Hours",
    yearsInBusiness: 3,
    owner: "সালমা সুলতানা",
    lat: 23.8345,
    lng: 90.3592,
    deliverySpeed: 4.5,
    responseRate: 92,
    csat: 90,
    repeatBuyers: 15,
    catalog: [
      { id: "s4", name: "Ladies Three-piece Stitching", price: 450, image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=100", stockStatus: "in-stock", qtyLeft: 5 },
      { id: "s5", name: "Exclusive Cotton Sharee Crafting", price: 1500, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100", stockStatus: "low-stock", qtyLeft: 2 }
    ]
  },
  {
    id: "nb-6",
    name: "ঢাকা ফার্নিচার মার্ট (Dhaka Furniture Mart)",
    category: "furniture",
    categoryLocal: "আসবাবপত্র",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600",
    rating: 4.7,
    reviews: 58,
    location: "মিরপুর ১০, ঢাকা (Mirpur 10, Dhaka)",
    distance: "2.3 km",
    isOpen: true,
    isVerified: true,
    hasTradeLicense: true,
    phone: "01700000015",
    type: "shop",
    trustLevel: 6,
    trustScore: 94,
    queueStatus: "normal",
    prepTime: "Same Day Dispatch",
    yearsInBusiness: 15,
    owner: "আলহাজ্ব শফিকুল ইসলাম",
    lat: 23.8189,
    lng: 90.3622,
    deliverySpeed: 4.6,
    responseRate: 94,
    csat: 96,
    repeatBuyers: 45,
    catalog: [
      { id: "f1", name: "Premium Wooden Bedside Table", price: 3500, image: "https://images.unsplash.com/photo-1532372320978-9b4d8a3a8245?w=100", stockStatus: "in-stock", qtyLeft: 8 },
      { id: "f2", name: "Ergonomic Mesh Office Chair", price: 4800, image: "https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=100", stockStatus: "low-stock", qtyLeft: 3 }
    ]
  }
];

const NEARBY_CATEGORIES = [
  { id: "all", labelEn: "All Services", labelBn: "সবগুলা", emoji: "📍" },
  { id: "grocery", labelEn: "Groceries", labelBn: "মুদিখানা", emoji: "🍎" },
  { id: "pharmacy", labelEn: "Pharmacy", labelBn: "ফার্মেসি", emoji: "💊" },
  { id: "restaurant", labelEn: "Restaurant", labelBn: "রেস্টুরেন্ট", emoji: "🍗" },
  { id: "services", labelEn: "Home Services", labelBn: "সেবাসমূহ", emoji: "🔧" },
  { id: "homemade", labelEn: "Boutiques", labelBn: "হোমমেড ও বুটিকস", emoji: "🧵" },
  { id: "furniture", labelEn: "Furniture & Decor", labelBn: "আসবাবপত্র", emoji: "🛋️" }
];

// Helper to calculate distance
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export default function NearbyHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isBn } = useLanguage();
  
  // Custom translator helper
  const t = (en: string, bn: string) => isBn ? bn : en;

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [isSameDayOnly, setIsSameDayOnly] = useState(false);

  // Address Selector States
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressDetails, setAddressDetails] = useState<AddressDetails | null>(null);
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [activeArea, setActiveArea] = useState("Mirpur 10, Dhaka");
  const [location, setLocation] = useState<{lat: number, lng: number} | null>({ lat: 23.8223, lng: 90.3654 }); // default Mirpur 10
  const [isLocating, setIsLocating] = useState(false);

  // Shop Data State (Support adding new local shops in Merchant Mode)
  const [shopsList, setShopsList] = useState(INITIAL_NEARBY_SHOPS_MOCK);

  // Storefront Drawer State
  const [selectedShop, setSelectedShop] = useState<any | null>(null);
  const [drawerTab, setDrawerTab] = useState<"catalog" | "chat" | "checkout">("catalog");

  // Local Shop Cart State (key: shopId, val: array of { id, name, price, qty })
  const [localCart, setLocalCart] = useState<{ [key: string]: any[] }>({});

  // Live Chat Threads State with simulated responses
  const [chatThreads, setChatThreads] = useState<{ [key: string]: { sender: 'buyer' | 'seller', text: string, time: string }[] }>({
    "nb-1": [
      { sender: 'seller', text: "আসসালামু আলাইকুম! কোনো পণ্য লাগবে কি ভাই?", time: "11:30 AM" }
    ],
    "nb-2": [
      { sender: 'seller', text: "হ্যালো! লাজ ফার্মা মিরপুর শাখা থেকে বলছি। আপনার কোনো প্রেসক্রিপশন আছে?", time: "11:45 AM" }
    ]
  });
  const [chatInput, setChatInput] = useState("");

  // Simulated Rider Assignment / Live Delivery States
  const [isRiderRequesting, setIsRiderRequesting] = useState(false);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [assignedRider, setAssignedRider] = useState<{ name: string, phone: string, progress: number } | null>(null);

  // Merchant Mode States
  const [isMerchantMode, setIsMerchantMode] = useState(false);
  const [newShopName, setNewShopName] = useState("");
  const [newShopCategory, setNewShopCategory] = useState("grocery");
  const [newShopType, setNewShopType] = useState<"shop" | "service">("shop");
  const [newShopPhone, setNewShopPhone] = useState("");
  const [newShopOwner, setNewShopOwner] = useState("");
  const [newShopLocation, setNewShopLocation] = useState("");
  
  // NID & Trade License & live Trust Badge states
  const [nidNumber, setNidNumber] = useState("");
  const [nidFileName, setNidFileName] = useState("");
  const [isNidUploading, setIsNidUploading] = useState(false);
  const [tradeLicenseNumber, setTradeLicenseNumber] = useState("");
  const [tradeLicenseFileName, setTradeLicenseFileName] = useState("");
  const [isLicenseUploading, setIsLicenseUploading] = useState(false);

  const liveTrustLevel = useMemo(() => {
    let lvl = 1; // Base level: phone number provided/verified
    if (newShopName.trim().length > 3 && newShopOwner.trim().length > 3 && newShopLocation.trim().length > 5) {
      lvl += 1; // Level 2: Business Profile Completed
    }
    if (nidNumber.trim().length >= 10) {
      lvl += 1; // Level 3: NID Provided
      if (nidFileName) {
        lvl += 1; // Level 4: NID Verified / Document attached
      }
    }
    if (tradeLicenseNumber.trim().length >= 5) {
      lvl += 1; // Level 5: License Provided
      if (tradeLicenseFileName) {
        lvl += 1; // Level 6: License Verified / Document attached
      }
    }
    if (lvl === 6 && nidFileName && tradeLicenseFileName) {
      lvl += 1; // Level 7: Golden Trust Partner
    }
    return lvl;
  }, [newShopName, newShopOwner, newShopLocation, nidNumber, nidFileName, tradeLicenseNumber, tradeLicenseFileName]);
  
  // Wallet / Balance State
  const [walletBalance, setWalletBalance] = useState(2500);

  // Merchant received orders simulation state
  const [receivedOrders, setReceivedOrders] = useState([
    {
      id: "ord-881",
      buyerName: "Karim Uddin",
      buyerPhone: "01712345678",
      buyerAddress: "Block D, Road 4, Mirpur 10",
      items: "Premium Miniket Rice (৫ কেজি)",
      totalAmount: 340,
      paymentMethod: "Logistics Wallet",
      status: "Pending Dispatch",
      carrierTicket: ""
    }
  ]);

  // ═══════════════════════════════════════════════
  // HYPERLOCAL ECOSYSTEM CORE STATES (20 USP FEATURES)
  // ═══════════════════════════════════════════════
  const [activeSubTab, setActiveSubTab] = useState<"shops" | "delivery" | "community" | "saved" | "business">("shops");
  const [radius, setRadius] = useState<"500m" | "1 KM" | "3 KM" | "5 KM" | "10 KM" | "Entire City">("3 KM");
  const [favoriteShops, setFavoriteShops] = useState<string[]>(["nb-1"]);
  const [subscribedShops, setSubscribedShops] = useState<string[]>(["nb-1", "nb-2"]);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [isNearbyMembershipJoined, setIsNearbyMembershipJoined] = useState(false);
  
  // Universal Checkout & Recipient Layers
  const [selectedRecipient, setSelectedRecipient] = useState<"self" | "father" | "mother" | "custom">("self");
  const [customRecipientName, setCustomRecipientName] = useState("");
  const [customRecipientPhone, setCustomRecipientPhone] = useState("");
  const [deliveryMergedWithNeighbors, setDeliveryMergedWithNeighbors] = useState(false);
  const [clickAndCollectMode, setClickAndCollectMode] = useState(false);
  const [generatedPickupOTP, setGeneratedPickupOTP] = useState("");
  const [generatedPickupQR, setGeneratedPickupQR] = useState("");

  // Local Community Commerce Demands state
  const [demands, setDemands] = useState([
    { 
      id: "dem-1", 
      user: "Farhan Ahmed (ফরহান আহমেদ)", 
      text: "Need 5 liters of fresh raw cow milk in Mirpur 12 urgently.", 
      timestamp: "10 mins ago", 
      bids: [
        { id: "bid-1", merchant: "Rahim General Store", offer: "I have premium milk in stock. Can deliver in 15 mins. ৳450 total.", status: "pending" }
      ] 
    },
    { 
      id: "dem-2", 
      user: "Jahanara Begum (জাহানারা বেগম)", 
      text: "Urgent: Need an expert AC repair technician for noise troubleshooting in Mirpur 2.", 
      timestamp: "30 mins ago", 
      bids: [] 
    }
  ]);
  const [demandInput, setDemandInput] = useState("");

  // Historical completed orders with warranty & installation scheduling
  const [orderHistory, setOrderHistory] = useState([
    {
      id: "ord-201",
      shopName: "Rahim General Store",
      items: "Premium Miniket Rice (৫ কেজি)",
      amount: 340,
      date: "2026-06-24",
      deliveryMethod: "Home Delivery",
      invoiceUrl: "#",
      warrantyCode: "W-RHM-5512",
      installationStatus: "Not Needed"
    },
    {
      id: "ord-202",
      shopName: "Dhaka Furniture Mart",
      items: "Ergonomic Mesh Office Chair",
      amount: 4800,
      date: "2026-06-23",
      deliveryMethod: "Home Delivery",
      invoiceUrl: "#",
      warrantyCode: "W-DFM-9910",
      installationStatus: "Scheduled for Tomorrow (10:00 AM)"
    }
  ]);

  // Seller OTP Click & Collect check state
  const [otpVerificationInput, setOtpVerificationInput] = useState("");

  // Request high-precision location
  const requestLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLocating(false);
        setActiveArea("Precise Geolocation Address");
        toast.success(t("পিকআপ লোকেশন জিপিএস দিয়ে আপডেট করা হয়েছে!", "GPS Pick-up Location Activated!"));
      },
      (err) => {
        console.error(err);
        setIsLocating(false);
        toast.error(t("GPS অ্যাক্সেস পাওয়া যায়নি। ম্যানুয়ালি ঠিকানা নির্বাচন করুন।", "GPS access failed. Please select address manually."));
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Sort and filter shop dataset based on selection, search, and category
  const filteredShops = useMemo(() => {
    return shopsList.filter(shop => {
      // Emergency Mode filter
      if (emergencyMode) {
        const isEmergencyCategory = ["pharmacy", "services", "grocery"].includes(shop.category);
        if (!isEmergencyCategory) return false;
      }

      const matchesSearch = !search || 
        shop.name.toLowerCase().includes(search.toLowerCase()) || 
        shop.location.toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || shop.category === selectedCategory;
      const matchesSameDay = !isSameDayOnly || shop.isOpen;

      return matchesSearch && matchesCategory && matchesSameDay;
    });
  }, [shopsList, search, selectedCategory, isSameDayOnly, emergencyMode]);

  // Dynamic distance updates when location coordinates shift & filter by user radius
  const distanceSortedShops = useMemo(() => {
    if (!location) return filteredShops;
    
    // Get max distance in km for filtering
    let maxDist = Infinity;
    if (radius === "500m") maxDist = 0.5;
    else if (radius === "1 KM") maxDist = 1.0;
    else if (radius === "3 KM") maxDist = 3.0;
    else if (radius === "5 KM") maxDist = 5.0;
    else if (radius === "10 KM") maxDist = 10.0;

    return [...filteredShops]
      .map(shop => {
        const dist = calculateDistance(location.lat, location.lng, shop.lat, shop.lng);
        return { 
          ...shop, 
          calculatedDist: dist,
          distance: `${dist.toFixed(1)} km`
        };
      })
      .filter(shop => shop.calculatedDist <= maxDist)
      .sort((a, b) => a.calculatedDist - b.calculatedDist);
  }, [location, filteredShops, radius]);

  // Helper to map district & upazila to precise lat/lng coordinates
  const getCoordinatesForAddress = (district: string, upazila: string): { lat: number; lng: number } => {
    const d = district.toLowerCase();
    const u = upazila.toLowerCase();

    // Dhaka District
    if (d.includes("dhaka") || d.includes("ঢাকা")) {
      if (u.includes("mirpur") || u.includes("মিরপুর")) return { lat: 23.8041, lng: 90.3601 };
      if (u.includes("gulshan") || u.includes("গুলশান")) return { lat: 23.7925, lng: 90.4078 };
      if (u.includes("dhanmondi") || u.includes("ধানমন্ডি")) return { lat: 23.7461, lng: 90.3742 };
      if (u.includes("banani") || u.includes("বনানী")) return { lat: 23.7937, lng: 90.4033 };
      if (u.includes("uttara") || u.includes("উত্তরা")) return { lat: 23.8759, lng: 90.3795 };
      if (u.includes("motijheel") || u.includes("মতিঝিল")) return { lat: 23.7330, lng: 90.4172 };
      if (u.includes("tejgaon") || u.includes("তেজগাঁও")) return { lat: 23.7536, lng: 90.3933 };
      if (u.includes("savar") || u.includes("সাভার")) return { lat: 23.8583, lng: 90.2667 };
      if (u.includes("keraniganj") || u.includes("কেরানীগঞ্জ")) return { lat: 23.6844, lng: 90.3223 };
      return { lat: 23.8103, lng: 90.4125 };
    }
    // Gazipur District
    if (d.includes("gazipur") || d.includes("গাজীপুর")) {
      return { lat: 23.9999, lng: 90.4203 };
    }
    // Narayanganj District
    if (d.includes("narayanganj") || d.includes("নারায়ণগঞ্জ")) {
      return { lat: 23.6238, lng: 90.5000 };
    }
    // Mymensingh District
    if (d.includes("mymensingh") || d.includes("ময়মনসিংহ")) {
      return { lat: 24.7471, lng: 90.4203 };
    }
    // Chattogram District
    if (d.includes("chattogram") || d.includes("চট্টগ্রাম")) {
      if (u.includes("halishahar") || u.includes("হালিশহর")) return { lat: 22.3330, lng: 91.7830 };
      if (u.includes("panchlaish") || u.includes("পাঁচলাইশ")) return { lat: 22.3667, lng: 91.8333 };
      return { lat: 22.3569, lng: 91.7832 };
    }
    // Cox's Bazar District
    if (d.includes("cox") || d.includes("কক্সবাজার")) {
      return { lat: 21.4272, lng: 91.9702 };
    }
    // Cumilla District
    if (d.includes("cumilla") || d.includes("comilla") || d.includes("কুমিল্লা")) {
      return { lat: 23.4682, lng: 91.1785 };
    }
    // Rajshahi District
    if (d.includes("rajshahi") || d.includes("রাজশাহী")) {
      return { lat: 24.3636, lng: 88.6241 };
    }
    // Bogura District
    if (d.includes("bogura") || d.includes("bogra") || d.includes("বগুড়া")) {
      return { lat: 24.8481, lng: 89.3730 };
    }
    // Khulna District
    if (d.includes("khulna") || d.includes("খুলনা")) {
      return { lat: 22.8456, lng: 89.5403 };
    }
    // Jashore District
    if (d.includes("jashore") || d.includes("যশোর")) {
      return { lat: 23.1664, lng: 89.2124 };
    }
    // Sylhet District
    if (d.includes("sylhet") || d.includes("সিলেট")) {
      return { lat: 24.8949, lng: 91.8687 };
    }
    // Moulvibazar District
    if (d.includes("moulvibazar") || d.includes("মৌলভীবাজার")) {
      return { lat: 24.4829, lng: 91.7705 };
    }
    // Barishal District
    if (d.includes("barishal") || d.includes("বরিশাল")) {
      return { lat: 22.7010, lng: 90.3535 };
    }
    // Rangpur District
    if (d.includes("rangpur") || d.includes("রংপুর")) {
      return { lat: 25.7500, lng: 89.2500 };
    }

    // Default Dhaka Centroid
    return { lat: 23.8103, lng: 90.4125 };
  };

  // Handle address update from BDAddressSelector
  const handleAddressSubmit = () => {
    if (addressDetails && isAddressValid) {
      const areaText = addressDetails.area ? `${addressDetails.area}, ` : "";
      setActiveArea(`${areaText}${addressDetails.upazila}, ${addressDetails.district}`);
      setIsAddressModalOpen(false);
      
      // Determine precise lat/lng based on cascading geography
      const newCoords = getCoordinatesForAddress(addressDetails.district, addressDetails.upazila);
      const newLat = newCoords.lat;
      const newLng = newCoords.lng;
      setLocation({ lat: newLat, lng: newLng });

      // Dynamically relocate mockup shops around the newly updated user center
      const offsets = [
        { latOff: -0.005, lngOff: -0.004 }, // Rahim General Store
        { latOff: 0.003, lngOff: 0.005 },  // Lazz Pharma
        { latOff: -0.002, lngOff: 0.003 }, // Karim Electrician
        { latOff: 0.004, lngOff: -0.003 }  // Salma Boutique
      ];

      const updatedShops = INITIAL_NEARBY_SHOPS_MOCK.map((shop, index) => {
        const offset = offsets[index] || { latOff: 0.001, lngOff: -0.001 };
        const updatedLocation = `${addressDetails.area || addressDetails.upazila}, ${addressDetails.district}`;
        return {
          ...shop,
          lat: newLat + offset.latOff,
          lng: newLng + offset.lngOff,
          location: updatedLocation
        };
      });

      setShopsList(updatedShops);
      toast.success(t("ঠিকানা সফলভাবে সেট করা হয়েছে এবং নিকটবর্তী স্টোরগুলো লোড হয়েছে!", "Address updated & nearby listings re-centered successfully!"));
    } else {
      toast.error(t("অনুগ্রহ করে ঠিকানা ফর্মের সব তথ্য সঠিকভাবে পূরণ করুন।", "Please complete all fields in the address selector."));
    }
  };

  // Cart operations
  const addToCart = (shopId: string, item: any) => {
    const shopCart = localCart[shopId] || [];
    const existing = shopCart.find(i => i.id === item.id);
    let newCart;
    if (existing) {
      newCart = shopCart.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
    } else {
      newCart = [...shopCart, { ...item, qty: 1 }];
    }
    setLocalCart({ ...localCart, [shopId]: newCart });
    toast.success(`${item.name} ` + t("কার্টে যোগ করা হয়েছে", "added to local cart"));
  };

  const updateQty = (shopId: string, itemId: string, change: number) => {
    const shopCart = localCart[shopId] || [];
    const newCart = shopCart.map(item => {
      if (item.id === itemId) {
        const target = item.qty + change;
        return target > 0 ? { ...item, qty: target } : null;
      }
      return item;
    }).filter(Boolean);
    
    setLocalCart({ ...localCart, [shopId]: newCart as any[] });
  };

  // Direct workspace chat submit
  const sendChatMessage = (shopId: string) => {
    if (!chatInput.trim()) return;
    const currentMsg = chatInput;
    const newMsg = { sender: 'buyer' as const, text: currentMsg, time: "Just Now" };
    const currentThread = chatThreads[shopId] || [];
    setChatThreads({
      ...chatThreads,
      [shopId]: [...currentThread, newMsg]
    });
    setChatInput("");

    // Simulate merchant automated replies after 2 seconds
    setTimeout(() => {
      const responses = [
        "জ্বী ভাই, অর্ডারটি দিন। আমরা এক্ষুনি ডেলিভারি রাইডার অ্যাসাইন করছি!",
        "আপনার দেওয়া ঠিকানায় আমাদের লোক আসতে ২০ মিনিট সময় লাগবে। ধন্যবাদ!",
        "পণ্যটি স্টকে আছে। আপনি পেমেন্ট কমপ্লিট করলেই পার্সেল পাঠানো হবে।"
      ];
      const reply = responses[Math.floor(Math.random() * responses.length)];
      const updatedThread = chatThreads[shopId] || [];
      setChatThreads(prev => ({
        ...prev,
        [shopId]: [...(prev[shopId] || []), newMsg, { sender: 'seller', text: reply, time: "Just Now" }]
      }));
      toast.info(t("দোকানদার থেকে নতুন মেসেজ এসেছে!", "New message received from merchant!"));
    }, 2000);
  };

  // Complete local checkout transaction
  const handleLocalCheckout = (shop: any, paymentMethod: string) => {
    const shopCart = localCart[shop.id] || [];
    const itemTotal = shopCart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
    const vat = Math.round(itemTotal * 0.05); // 5% VAT
    const deliveryCharge = 50;
    const grandTotal = itemTotal + vat + deliveryCharge;

    if (paymentMethod === "wallet") {
      if (walletBalance < grandTotal) {
        toast.error(t("আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই!", "Insufficient wallet balance!"));
        return;
      }
      setWalletBalance(prev => prev - grandTotal);
    }

    // Success state
    setLocalCart({ ...localCart, [shop.id]: [] });
    setSelectedShop(null);
    setActiveOrder(shop);
    setIsRiderRequesting(true);

    // Dynamic delivery rider simulation state
    setAssignedRider(null);

    setTimeout(() => {
      setIsRiderRequesting(false);
      setAssignedRider({
        name: "কামাল হোসেন (Kamal Hossain)",
        phone: "01755123456",
        progress: 10
      });
      toast.success(t("অর্ডার সফল! রাইডার বরাদ্দ করা হয়েছে।", "Order Placed! Delivery Agent Assigned."), {
        description: `${shop.name} ➔ ${activeArea}`,
        duration: 6000
      });
    }, 4500);
  };

  // Simulate rider progressing towards destination on active order
  useEffect(() => {
    if (assignedRider && assignedRider.progress < 100) {
      const interval = setInterval(() => {
        setAssignedRider(prev => {
          if (!prev) return null;
          const nextProg = prev.progress + 20;
          if (nextProg >= 100) {
            clearInterval(interval);
            toast.success(t("ডেলিভারি সফলভাবে সম্পন্ন হয়েছে!", "Your local order has been delivered successfully!"), {
              description: `Rider: ${prev.name}`
            });
            setTimeout(() => {
              setAssignedRider(null);
              setActiveOrder(null);
            }, 5000);
            return { ...prev, progress: 100 };
          }
          return { ...prev, progress: nextProg };
        });
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [assignedRider]);

  // Merchant register new physical shop or on-demand service
  const handleRegisterMerchant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShopName || !newShopPhone || !newShopOwner || !newShopLocation) {
      toast.error(t("সব তথ্য সঠিকভাবে পূরণ করুন", "Please fill in all details"));
      return;
    }

    const newShop = {
      id: `nb-${Date.now()}`,
      name: newShopName,
      category: newShopCategory,
      categoryLocal: NEARBY_CATEGORIES.find(c => c.id === newShopCategory)?.labelBn || "অন্যান্য",
      image: newShopCategory === "pharmacy" 
        ? "https://images.unsplash.com/photo-1586015555751-6397455d8b2d?w=600"
        : newShopCategory === "services"
        ? "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600"
        : newShopCategory === "homemade"
        ? "https://images.unsplash.com/photo-1556905200-279565513a2d?w=600"
        : "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600",
      rating: 5.0,
      reviews: 1,
      location: newShopLocation,
      distance: "0.1 km",
      isOpen: true,
      isVerified: liveTrustLevel >= 4,
      hasTradeLicense: Boolean(tradeLicenseNumber),
      phone: newShopPhone,
      type: newShopType,
      trustLevel: liveTrustLevel,
      trustScore: liveTrustLevel * 12 + 15 > 100 ? 100 : liveTrustLevel * 12 + 15,
      queueStatus: "fast" as const,
      prepTime: "5-10 Mins",
      yearsInBusiness: 1,
      owner: newShopOwner,
      lat: location?.lat || 23.8223,
      lng: location?.lng || 90.3654,
      deliverySpeed: 5.0,
      responseRate: 100,
      csat: 100,
      repeatBuyers: 0,
      catalog: newShopType === "shop" ? [
        { id: "p-custom-1", name: "Daily Need Grocery Item 1", price: 120, image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=100", stockStatus: "in-stock", qtyLeft: 10 },
        { id: "p-custom-2", name: "Premium Quality Item 2", price: 250, image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100", stockStatus: "low-stock", qtyLeft: 1 }
      ] : [
        { id: "s-custom-1", name: "Standard Home Service Callout", price: 300, image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=100", stockStatus: "in-stock", qtyLeft: 5 },
        { id: "s-custom-2", name: "Premium Full Hour Troubleshooting", price: 750, image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=100", stockStatus: "in-stock", qtyLeft: 5 }
      ]
    };

    setShopsList([newShop, ...shopsList]);
    setNewShopName("");
    setNewShopPhone("");
    setNewShopOwner("");
    setNewShopLocation("");
    setNidNumber("");
    setNidFileName("");
    setTradeLicenseNumber("");
    setTradeLicenseFileName("");
    toast.success(t(`অভিনন্দন! আপনার লোকাল শপ রেজিস্টার হয়েছে। (ট্রাস্ট লেভেল: Lvl ${liveTrustLevel})`, `Congratulations! Your local business is live. (Trust Level: Lvl ${liveTrustLevel})`));
  };

  // Merchant shipping order fulfillment via Logistics partners (Pathao/RedX)
  const handleRequestLogisticsRider = (orderId: string, carrier: string) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2500)),
      {
        loading: t(`লজিস্টিকস পার্টনার ${carrier}-এর সাথে যোগাযোগ করা হচ্ছে...`, `Contacting logistics carrier ${carrier}...`),
        success: () => {
          setReceivedOrders(prev => prev.map(o => {
            if (o.id === orderId) {
              return { 
                ...o, 
                status: "Dispatched", 
                carrierTicket: `${carrier.toUpperCase().substring(0,3)}-${Math.floor(Math.random() * 900000 + 100000)}` 
              };
            }
            return o;
          }));
          return t(`রাইডার বুকিং সফল! ট্র্যাকিং আইডি জেনারেট হয়েছে।`, `Logistics rider booked! Shipment tracking ticket generated.`);
        },
        error: t("রাইডার বুকিং ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।", "Rider booking failed. Please try again.")
      }
    );
  };

  return (
    <div className="pb-32 w-full max-w-7xl mx-auto min-h-screen pt-4 px-4 flex flex-col gap-6">
      
      {/* 1. MANDATORY PORTAL HOMEPAGE DECORATORS */}
      <section className="pt-2 flex flex-col gap-3">
        <StoryBar context="nearby" />
        <PortalIconBar context="nearby" />
      </section>

      {/* 2. STICKY PORTAL CONTROL BAR */}
      <div className="md:sticky top-16 z-40 bg-zinc-950/95 backdrop-blur-lg border-b border-white/5 py-3 px-1 mt-1 flex flex-wrap gap-4 justify-between items-center rounded-2xl">
        <CategoryNavBar context="local" />
        
        <div className="flex items-center gap-3">
          {/* Emergency Mode Toggle (Essential USP feature 16) */}
          <button
            onClick={() => {
              setEmergencyMode(!emergencyMode);
              if (!emergencyMode) {
                toast.error(t("জরুরী মোড সক্রিয়! শুধু ফার্মেসি, অক্সিজেন ও সেবাসমূহ দেখানো হচ্ছে।", "Emergency Mode Active! Filtering essential pharmacies & services only."), {
                  icon: "🚨",
                  duration: 5000
                });
              } else {
                toast.success(t("স্বাভাবিক মোড ফিরে এসেছে।", "Normal browsing mode restored."));
              }
            }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer animate-pulse",
              emergencyMode
                ? "bg-rose-600 text-white border-rose-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                : "bg-red-500/10 text-rose-500 border-rose-500/20 hover:bg-red-500/20"
            )}
          >
            <span>🚨</span>
            <span>{emergencyMode ? t("জরুরী ফিল্টার সক্রিয়", "Emergency Filter Active") : t("জরুরী সার্ভিস", "Emergency SOS")}</span>
          </button>

          {/* Active Local Wallet Balance Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-white/5 rounded-xl">
            <Wallet className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] font-mono text-slate-400">Logistics Wallet:</span>
            <span className="text-xs font-mono font-black text-cyan-400">৳{walletBalance}</span>
          </div>
        </div>
      </div>

      {/* 3. HERO LOCAL HEADER WITH ADDRESS DROPDOWN */}
      <div className="p-6 rounded-[2.5rem] bg-gradient-to-br from-cyan-500/10 via-zinc-900 to-black border border-white/5 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <MapPin className="w-20 h-20 text-cyan-500 rotate-12 animate-pulse" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              {t("হাইপার-লোকাল কমার্স ও সার্ভিস", "Hyper-Local Commerce & On-Demand Services")}
            </span>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2 uppercase">
              NearBy Local Hub
              {isLocating && <Loader2 className="w-4 h-4 text-cyan-500 animate-spin" />}
            </h1>
            
            {/* Clickable BD Address Selector Ribbon */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button 
                onClick={() => setIsAddressModalOpen(true)}
                className="flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-black px-4 py-2 rounded-2xl border border-cyan-500/20 transition-all text-xs cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 fill-cyan-500/20" />
                <span>{activeArea}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button 
                onClick={requestLocation}
                className="text-[11px] font-bold text-slate-400 hover:text-white underline cursor-pointer"
              >
                {t("জিপিএস দিয়ে খুঁজুন", "Use Precise GPS")}
              </button>
            </div>
            
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {t("আপনার এলাকায় একই দিনে দ্রুততম ডেলিভারি ও গৃহস্থালী সেবা", "Instant doorstep delivery & on-demand technician calls in your area")}
            </p>
          </div>
          
          {/* Pro Membership / Quick Stats Info (USP Feature 15) */}
          <div className="flex flex-col items-start md:items-end gap-3">
            <button
              onClick={() => {
                setIsNearbyMembershipJoined(!isNearbyMembershipJoined);
                if (!isNearbyMembershipJoined) {
                  toast.success(t("স্বাগতম! আপনি এখন পাইকারমার্ট লোকাল প্রো সদস্য।", "Welcome! You are now a PaikarMart Local PRO member!"), {
                    description: t("সব অর্ডারে ফ্রি ডেলিভারি ও ডাবল ক্যাশব্যাক সক্রিয়!", "Free delivery & double cashback active on all local shops!"),
                    icon: "👑"
                  });
                } else {
                  toast.info(t("প্রো সদস্যপদ স্থগিত করা হয়েছে।", "PRO membership deactivated."));
                }
              }}
              className={cn(
                "h-11 px-5 rounded-2xl font-black text-xs gap-2 shadow-lg transition-all cursor-pointer flex items-center border",
                isNearbyMembershipJoined
                  ? "bg-amber-500 text-black border-amber-400 shadow-amber-500/10"
                  : "bg-white/[0.03] text-white hover:bg-white/10 border-white/10"
              )}
            >
              <span>👑</span>
              <span>{isNearbyMembershipJoined ? t("লোকাল প্রো মেম্বার (সক্রিয়)", "Local PRO Member (Active)") : t("লোকাল প্রো মেম্বার হোন (৳১৯৯/মাস)", "Join Local PRO (৳199/mo)")}</span>
            </button>
            
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping inline-block" />
              <span>{shopsList.length} {t("টি স্টোর আপনার পাশে সক্রিয়", "Active stores nearby")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. FIVE-WAY HIGHLY INTERACTIVE TAB HUB PORTAL (USP Core Navigation) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 bg-zinc-900/40 p-1.5 border border-white/5 rounded-[2rem]">
        {([
          { id: "shops", labelEn: "Local Shops & Services", labelBn: "দোকান ও সেবাসমূহ", icon: Store },
          { id: "delivery", labelEn: "Delivery & Warranty", labelBn: "ডেলিভারি ট্র্যাকার", icon: Truck },
          { id: "community", labelEn: "Local Community Board", labelBn: "কমিউনিটি বোর্ড", icon: MessageSquare },
          { id: "saved", labelEn: "Favorites & Suggestions", labelBn: "প্রিয় ও পরামর্শ", icon: Heart },
          { id: "business", labelEn: "Merchant Business Center", labelBn: "মার্চেন্ট সেন্টার", icon: Settings }
        ] as const).map(tab => {
          const active = activeSubTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id);
                setIsMerchantMode(tab.id === "business");
              }}
              className={cn(
                "py-3.5 rounded-2xl flex flex-col items-center justify-center gap-2.5 transition-all text-center cursor-pointer relative overflow-hidden",
                active 
                  ? "bg-cyan-500 text-black font-black shadow-lg scale-102"
                  : "bg-transparent text-slate-400 hover:text-white hover:bg-white/[0.02]"
              )}
            >
              <Icon className={cn("w-5 h-5", active ? "text-black scale-110 animate-bounce" : "text-slate-500")} />
              <div className="leading-tight">
                <p className="text-[10px] font-black">{isBn ? tab.labelBn : tab.labelEn}</p>
                <p className={cn("text-[7px] uppercase font-bold tracking-widest opacity-40", active ? "text-black" : "text-slate-600")}>{tab.id}</p>
              </div>
            </button>
          );
        })}
      </div>

      {!isMerchantMode ? (
        <>
          {/* Subtab Conditional Rendering */}
          {activeSubTab === "shops" && (
            <>
              {/* SEARCH, FILTERS & RADIUS SELECTOR */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 h-12 bg-zinc-900 rounded-2xl border border-white/5 px-4 flex items-center gap-3 focus-within:border-cyan-500/40 transition-all">
                    <Search className="w-4 h-4 text-cyan-500 animate-pulse" />
                    <input 
                      type="text" 
                      placeholder={t("আশেপাশের দোকান বা সার্ভিস সার্চ করুন...", "Search nearby shops or services...")}
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="flex-1 bg-transparent text-[13px] text-white placeholder-slate-600 outline-none font-semibold" 
                    />
                    {search && <button onClick={() => setSearch("")}><X className="w-4 h-4 text-zinc-500" /></button>}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {/* Hyperlocal Radius Dropdown (USP Feature 1) */}
                    <div className="flex items-center gap-1.5 bg-zinc-900 border border-white/5 rounded-2xl px-3 h-12">
                      <Filter className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{t("ব্যাসার্ধ:", "Radius:")}</span>
                      <select
                        value={radius}
                        onChange={(e: any) => {
                          setRadius(e.target.value);
                          toast.success(t(`অনুসন্ধান ব্যাসার্ধ পরিবর্তন করে ${e.target.value} করা হয়েছে।`, `Search radius updated to ${e.target.value}.`), {
                            description: t("সেই অনুযায়ী কুরিয়ার খরচ ও ডেলিভারি সময় আপডেট হবে।", "Delivery fee & times have been re-calculated in real-time."),
                            icon: "📍"
                          });
                        }}
                        className="bg-transparent text-xs text-cyan-400 font-extrabold outline-none cursor-pointer pr-1"
                      >
                        <option value="500m" className="bg-zinc-950 text-white">500m (Strict Local)</option>
                        <option value="1 KM" className="bg-zinc-950 text-white">1 KM (Walking)</option>
                        <option value="3 KM" className="bg-zinc-950 text-white">3 KM (Express Cycle)</option>
                        <option value="5 KM" className="bg-zinc-950 text-white">5 KM (Motorcycle)</option>
                        <option value="10 KM" className="bg-zinc-950 text-white">10 KM (Wider Area)</option>
                        <option value="Entire City" className="bg-zinc-950 text-white">Entire City</option>
                      </select>
                    </div>

                    {/* Same Day Open Status Toggle */}
                    <button 
                      onClick={() => setIsSameDayOnly(!isSameDayOnly)}
                      className={`px-4 h-12 rounded-2xl border flex items-center gap-2 transition-all cursor-pointer ${
                        isSameDayOnly 
                          ? 'bg-cyan-500 border-cyan-400 text-black font-black' 
                          : 'bg-zinc-900 border-white/5 text-slate-400 hover:text-white font-bold'
                      }`}
                    >
                      <Clock className={`w-4 h-4 ${isSameDayOnly ? 'animate-pulse' : ''}`} />
                      <span className="text-[11px] uppercase tracking-wider">{t("খোলা আছে", "Open Now")}</span>
                    </button>

                    {/* Grid / Map View Switcher */}
                    <div className="flex items-center gap-1 bg-zinc-900 border border-white/5 rounded-2xl p-1">
                      <button 
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-500' : 'text-slate-500 hover:text-white'}`}
                        onClick={() => setViewMode('grid')}
                      >
                        <Grid className="w-4 h-4" />
                      </button>
                      <button 
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${viewMode === 'map' ? 'bg-cyan-500/20 text-cyan-500' : 'text-slate-500 hover:text-white'}`}
                        onClick={() => setViewMode('map')}
                      >
                        <Map className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Local Category Chips */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 items-center">
                  {NEARBY_CATEGORIES.map((cat) => {
                    const active = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                          active
                            ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400 font-black"
                            : "bg-white/[0.02] border-white/5 text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <span>{cat.emoji}</span>
                        <span>{isBn ? cat.labelBn : cat.labelEn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* DYNAMIC MAP OR LIST OF LOCAL SHOPS */}
              {viewMode === 'grid' ? (
                <div className="space-y-6">
                  {/* Main Feed Header */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-500" />
                      <span>{t("আপনার নিকটবর্তী দোকান ও সেবা তালিকা", "Verified Local Retailers & Service Hubs")}</span>
                    </h3>
                    <span className="text-[10px] font-mono text-cyan-400">{distanceSortedShops.length} {t("টি ফলাফল পাওয়া গেছে", "results found")}</span>
                  </div>

                  {distanceSortedShops.length === 0 ? (
                    <div className="p-16 text-center rounded-[2.5rem] bg-zinc-900/50 border border-white/5 backdrop-blur-xl">
                      <ShoppingBag className="w-12 h-12 text-zinc-700 mx-auto mb-4 animate-bounce" />
                      <h4 className="font-extrabold text-white text-base">{t("কোনো দোকান বা সার্ভিস পাওয়া হয়নি", "No matching shops or services found")}</h4>
                      <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto">
                        {t("আপনার নির্বাচিত এরিয়াতে এই ক্যাটাগরির কোনো স্টোর রেজিস্টার্ড নেই। দয়া করে ক্যাটাগরি পরিবর্তন করুন।", "No listings are currently registered for this category in the chosen area. Try another Category.")}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {distanceSortedShops.map(shop => {
                        const shopCart = localCart[shop.id] || [];
                        const cartCount = shopCart.reduce((sum, item) => sum + item.qty, 0);
                        const isFav = favoriteShops.includes(shop.id);
                        const isSubbed = subscribedShops.includes(shop.id);

                        return (
                          <div 
                            key={shop.id} 
                            onClick={() => {
                              setSelectedShop(shop);
                              setDrawerTab("catalog");
                            }}
                            className="p-5 bg-zinc-900/40 border border-white/5 hover:border-white/10 rounded-3xl flex flex-col justify-between gap-4 transition-all hover:shadow-lg cursor-pointer group relative overflow-hidden"
                          >
                            {/* Overlay subtle color accent */}
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-500 opacity-0 group-hover:opacity-100 transition-all" />
                            
                            <div className="flex gap-4">
                              <img src={shop.image} alt={shop.name} className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-white/5" />
                              <div className="flex-1 min-w-0 space-y-1.5">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="text-[9px] font-extrabold text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-2 py-0.5 rounded">
                                    {shop.categoryLocal}
                                  </span>
                                  {shop.isVerified && <VerificationBadge badgeType="trusted_merchant" size="xs" />}
                                  <TrustBadge level={shop.trustLevel} />
                                  
                                  {/* Composite Trust Score Indicator (USP Feature 20) */}
                                  <div className="flex items-center gap-1 bg-indigo-500/10 text-indigo-400 text-[8px] font-black uppercase px-2 py-0.5 rounded">
                                    <span>🛡️ Score: {shop.trustScore}%</span>
                                  </div>
                                </div>
                                
                                <h4 className="font-black text-sm text-white group-hover:text-cyan-400 transition-colors truncate">{shop.name}</h4>
                                
                                <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-cyan-500" /> 
                                    {shop.location}
                                  </span>
                                  <span className="text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-full text-[9px] font-mono">
                                    📍 {shop.distance}
                                  </span>

                                  {/* Shop Queue Status (USP Feature 3) */}
                                  <span className={cn(
                                    "text-[9px] font-bold px-2 py-0.5 rounded-full font-mono uppercase tracking-wider",
                                    shop.queueStatus === "fast" ? "bg-cyan-500/10 text-cyan-400" :
                                    shop.queueStatus === "normal" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"
                                  )}>
                                    ⚡ {shop.queueStatus === "fast" ? t("দ্রুত ডেলিভারি", "Fast Queue") : shop.queueStatus === "normal" ? t("স্বাভাবিক", "Normal Queue") : t("ব্যস্ত শপ", "Busy Queue")}
                                  </span>
                                </div>

                                {/* Smart Availability & Commitment Badges (USP Feature 2 & 10) */}
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                  <span className="text-[8px] font-black tracking-wide bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded-md uppercase">
                                    ⏱️ {shop.prepTime}
                                  </span>
                                  <span className="text-[8px] font-black tracking-wide bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded-md uppercase">
                                    ✔ {shop.type === "shop" ? t("হোম ডেলিভারি", "Doorstep") : t("অন সাইট সার্ভিস", "Onsite Repair")}
                                  </span>
                                  <span className="text-[8px] font-black tracking-wide bg-teal-500/10 text-teal-400 px-1.5 py-0.5 rounded-md uppercase">
                                    💼 {shop.yearsInBusiness} {t("বছর অভিজ্ঞতা", "Yrs Business")}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Footer details */}
                            <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-1">
                              <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-400 text-[10px] px-2.5 py-1 rounded-lg font-bold">
                                <Star className="w-3 h-3 fill-yellow-400" />
                                <span>{shop.rating} ({shop.reviews})</span>
                              </div>

                              <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                {/* Favorite Store Follow Toggle (USP Feature 11 & 12) */}
                                <button
                                  onClick={() => {
                                    if (isFav) {
                                      setFavoriteShops(prev => prev.filter(id => id !== shop.id));
                                      setSubscribedShops(prev => prev.filter(id => id !== shop.id));
                                      toast.info(t("প্রিয় তালিকা থেকে সরানো হয়েছে", "Removed store from favorites list."));
                                    } else {
                                      setFavoriteShops(prev => [...prev, shop.id]);
                                      setSubscribedShops(prev => [...prev, shop.id]);
                                      toast.success(t("প্রিয় ও সাবস্ক্রাইব তালিকায় যোগ হয়েছে!", "Store saved! Followed for alerts."), {
                                        description: t("এখন থেকে এই স্টোরের ডিসকাউন্ট ও প্রোডাক্ট আপডেট নোটিফিকেশন পাবেন।", "You'll now receive discount & product broadcast alerts!"),
                                        icon: "💖"
                                      });
                                    }
                                  }}
                                  className={cn(
                                    "w-8 h-8 rounded-xl flex items-center justify-center border transition-all cursor-pointer",
                                    isFav ? "bg-rose-500/20 text-rose-500 border-rose-500/30" : "bg-white/[0.02] border-white/5 text-slate-500 hover:text-white"
                                  )}
                                >
                                  <Heart className={cn("w-3.5 h-3.5", isFav ? "fill-rose-500 text-rose-500 animate-pulse" : "")} />
                                </button>

                                <button 
                                  onClick={() => {
                                    setSelectedShop(shop);
                                    setDrawerTab("catalog");
                                  }}
                                  className="h-8 px-3.5 rounded-xl text-[10px] font-black bg-cyan-500 text-black uppercase tracking-wider cursor-pointer flex items-center gap-1"
                                >
                                  {shop.type === "shop" ? t("স্টোর ভিজিট", "Visit Store") : t("সেবা বুক করুন", "Book Service")}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-[60vh] w-full rounded-3xl overflow-hidden border border-white/5 relative">
                  {!hasValidKey ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-center p-6">
                      <Map className="w-12 h-12 text-zinc-500 mb-4 animate-pulse" />
                      <h3 className="font-bold text-slate-300 mb-2">{t("Google Maps এপিআই কী প্রয়োজন", "Google Maps API Key Required")}</h3>
                      <p className="text-xs text-slate-500 max-w-sm mb-4">
                        {t("ম্যাপ ভিউ চালু করার জন্য .env ফাইলে VITE_GOOGLE_MAPS_PLATFORM_KEY যোগ করতে হবে।", "To view the interactive maps layout, add VITE_GOOGLE_MAPS_PLATFORM_KEY in your environment setup.")}
                      </p>
                    </div>
                  ) : (
                    <APIProvider apiKey={API_KEY} version="weekly">
                      <GoogleMap
                        defaultCenter={location || { lat: 23.8223, lng: 90.3654 }}
                        defaultZoom={14}
                        mapId="NEARBY_SHOPS_MAP"
                        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                        style={{ width: '100%', height: '100%' }}
                        gestureHandling="greedy"
                      >
                        {/* User Pin */}
                        {location && (
                          <AdvancedMarker position={location} title="You Are Here">
                            <Pin background="#3b82f6" glyphColor="#fff" borderColor="#1d4ed8" />
                          </AdvancedMarker>
                        )}
                        
                        {/* Verified Local Shops */}
                        {distanceSortedShops.map((shop) => (
                          <MarkerWithInfoWindow 
                            key={shop.id} 
                            position={{ lat: shop.lat, lng: shop.lng }} 
                            title={shop.name}
                            shop={shop}
                          />
                        ))}
                      </GoogleMap>
                    </APIProvider>
                  )}
                </div>
              )}
            </>
          )}

          {/* Tab 2: DELIVERY TRACKER & WARRANTY ASSEMBLY HUB */}
          {activeSubTab === "delivery" && (
            <div className="space-y-6 animate-fadeIn text-left">
              {/* Main Tracker Block */}
              <div className="p-6 rounded-3xl bg-zinc-900 border border-white/5 space-y-5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-cyan-400 animate-pulse" />
                      {t("সরাসরি হাইপারলোকাল ডেলিভারি অপ্টিমাইজেশন", "AI-optimized Delivery & Assembly Terminal")}
                    </span>
                    <h3 className="text-lg font-black text-white mt-1">
                      {t("সক্রিয় ডেলিভারি রুট ও ট্র্যাকার", "Active Route Visualization & Order Handover")}
                    </h3>
                  </div>

                  {/* Shared delivery merged state (USP Feature 17) */}
                  <div className="flex items-center gap-2.5 px-3 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                    <input
                      type="checkbox"
                      id="neighbor_merge"
                      checked={deliveryMergedWithNeighbors}
                      onChange={(e) => {
                        setDeliveryMergedWithNeighbors(e.target.checked);
                        if (e.target.checked) {
                          toast.success(t("ডেলিভারি প্রতিবেশী ফ্যামিলির সাথে মার্জ করা হয়েছে!", "Delivery merged with neighbors!"), {
                            description: t("কার্বন ফুটপ্রিন্ট কমায় এবং আপনার চার্জ ৳১৫ কমেছে।", "Saves delivery charge! Shared discount applied.")
                          });
                        }
                      }}
                      className="accent-cyan-400 cursor-pointer w-4 h-4"
                    />
                    <label htmlFor="neighbor_merge" className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wide cursor-pointer">
                      👥 {t("প্রতিবেশীদের সাথে কার্বন ফ্রেন্ডলি মার্জ করুন", "Merge Delivery with Neighbors")}
                    </label>
                  </div>
                </div>

                {/* Comitted delivery guarantee message (USP Feature 10) */}
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3 text-xs text-amber-300">
                  <span className="text-xl">🛡️</span>
                  <div>
                    <span className="font-extrabold block uppercase text-[9px] tracking-widest">{t("ডেলিভারি টাইমিং গ্যারান্টি", "Committed Delivery Timing Guarantee")}</span>
                    <p className="opacity-90 leading-tight">
                      {t("৩০ মিনিটের মধ্যে পণ্য না পৌঁছালে সব ডেলিভারি চার্জ ফেরত এবং ওয়ালেটে ৳১০ ক্রেডিট যোগ হবে!", "If delivery takes over 30 mins, shipping is free + ৳10 is refunded to your wallet instantly.")}
                    </p>
                  </div>
                </div>

                {/* Family Address Preset Linkage (USP Feature 18) */}
                <div className="p-4 bg-zinc-950 rounded-2xl border border-white/5 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                  <div>
                    <h4 className="text-xs font-black text-white">{t("পরিবারের সদস্যের সাথে অর্ডার লিংক করুন", "Recipient Family Address Linkage")}</h4>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      {t("অর্ডারটি বাবা, মা অথবা বন্ধুর ঠিকানায় পাঠানোর জন্য সিলেক্ট করুন। জিপিএস স্বয়ংক্রিয়ভাবে আপডেট হবে।", "Select a family recipient profile to auto-redirect the local rider.")}
                    </p>
                  </div>
                  <select
                    value={selectedRecipient}
                    onChange={(e: any) => {
                      setSelectedRecipient(e.target.value);
                      toast.success(t(`প্রাপক পরিবর্তন করে "${e.target.value}" করা হয়েছে!`, `Recipient shifted to "${e.target.value}"!`), {
                        icon: "👤"
                      });
                    }}
                    className="bg-zinc-900 text-xs text-white font-bold py-2 px-3 rounded-xl border border-white/5 outline-none cursor-pointer"
                  >
                    <option value="self">🏠 {t("আমার ঠিকানা (Self)", "My Address (Self)")}</option>
                    <option value="father">👴 {t("বাবার বাসা (Father - 01700122100)", "Father's Home")}</option>
                    <option value="mother">👵 {t("মায়ের বাসা (Mother - 01922334411)", "Mother's Home")}</option>
                    <option value="custom">⚙️ {t("অন্য কোনো কাস্টম প্রাপক", "Add Custom Recipient")}</option>
                  </select>
                </div>

                {/* Multi-Shop Optimization visualization (USP Feature 5) */}
                <div className="p-4 bg-zinc-950 border border-white/5 rounded-2xl space-y-3">
                  <span className="text-[9px] font-mono text-indigo-400 font-extrabold uppercase tracking-widest block">
                    🌐 AI Multi-Shop Route Optimization Layout:
                  </span>
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span className="flex items-center gap-1.5"><Store className="w-3.5 h-3.5 text-cyan-500" /> Rahim General Store</span>
                    <span>➔</span>
                    <span className="flex items-center gap-1.5"><Store className="w-3.5 h-3.5 text-cyan-500" /> Rupa Pharmacy</span>
                    <span>➔</span>
                    <span className="text-cyan-400 font-black flex items-center gap-1.5">👤 {t("আপনার বাসা (You)", "Your Doorstep")}</span>
                  </div>
                  <div className="text-[9px] text-slate-500 italic">
                    {t("*একাধিক দোকান থেকে কার্ট চেকআউট করলে রাইডার একটি ট্রিপে সব কটি পণ্য নিয়ে আসবে। কুরিয়ার চার্জ কমে যাবে!", "*Rider will batch collect your split multi-shop orders in a single consolidated route to save delivery fees.")}
                  </div>
                </div>

                {/* Click & Collect OTP / QR handover terminal (USP Feature 7) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-950/80 border border-white/5 rounded-2xl space-y-3">
                    <h4 className="text-xs font-black text-white">📦 {t("ক্লিক অ্যান্ড কালেক্ট হ্যান্ডওভার কোড", "Click & Collect Verification OTP")}</h4>
                    <p className="text-[10px] text-slate-500">
                      {t("আপনি যদি স্বয়ংক্রিয়ভাবে নিজে শপে গিয়ে পণ্য রিসিভ করতে চান, এই ওটিপি কোডটি ব্যবহার করুন।", "If you prefer picking up the parcel yourself to save shipping, hand over this secure OTP.")}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="px-4 py-2 bg-zinc-900 border border-white/5 text-base font-extrabold text-cyan-400 tracking-widest rounded-xl font-mono">
                        {generatedPickupOTP || "4829"}
                      </div>
                      <button
                        onClick={() => {
                          const otp = Math.floor(1000 + Math.random() * 9000).toString();
                          setGeneratedPickupOTP(otp);
                          setGeneratedPickupQR(`qr-collect-${otp}`);
                          toast.success(t("নতুন হ্যান্ডওভার ওটিপি ও কিউআর কোড জেনারেট হয়েছে!", "New Click & Collect QR Code and OTP generated successfully!"));
                        }}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-slate-300 text-[10px] font-bold cursor-pointer flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>{t("নতুন কোড", "Regen Code")}</span>
                      </button>
                    </div>

                    {/* Show QR code visualization */}
                    <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center gap-3">
                      <div className="w-10 h-10 bg-white flex items-center justify-center rounded-lg p-1">
                        <div className="w-full h-full bg-zinc-950 flex flex-wrap gap-1 p-0.5">
                          {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="w-2.5 h-2.5 bg-cyan-500 rounded" />
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-slate-300 font-extrabold block">QR-COLLECT-{generatedPickupOTP || "4829"}</span>
                        <span className="text-[8px] text-slate-500 uppercase tracking-widest">{t("বিক্রেতা স্ক্যান করলেই ভেরিফাইড হবে", "Scan at Counter to Complete Delivery")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Click & Collect Mock Merchant input to simulate pickup success */}
                  <div className="p-4 bg-zinc-950/80 border border-white/5 rounded-2xl space-y-3">
                    <h4 className="text-xs font-black text-white">🏪 {t("মার্চেন্ট হ্যান্ডওভার টেস্ট টার্মিনাল", "Merchant Collect Verification Simulator")}</h4>
                    <p className="text-[10px] text-slate-500">
                      {t("লোকাল দোকানদার আপনার ওটিপি মিলিয়ে হ্যান্ডওভার সফল করার অংশটি টেস্ট করুন।", "Enter the customer pickup OTP code to simulate physical hand-off validation at the counter.")}
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. 4829"
                        value={otpVerificationInput}
                        onChange={(e) => setOtpVerificationInput(e.target.value)}
                        className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-3 text-xs text-white outline-none focus:border-cyan-500"
                      />
                      <button
                        onClick={() => {
                          const target = generatedPickupOTP || "4829";
                          if (otpVerificationInput === target) {
                            toast.success(t("ওটিপি সফলভাবে ভেরিফাইড! অর্ডারটি সফল হ্যান্ডওভার করা হয়েছে।", "OTP Verified Successfully! Handover completed."), {
                              description: t("আপনার একাউন্টে ক্যাশব্যাক ও প্রোমো সুবিধা যোগ হচ্ছে।", "Loyalty cashbacks and warranty active."),
                              icon: "✅"
                            });
                            setOtpVerificationInput("");
                          } else {
                            toast.error(t("ভুল কোড! দয়া করে ওটিপি মিলিয়ে আবার চেষ্টা করুন।", "Incorrect OTP code. Please check code on left."));
                          }
                        }}
                        className="px-4 py-2 bg-cyan-500 hover:opacity-90 text-black text-xs font-black rounded-xl cursor-pointer shrink-0"
                      >
                        {t("ভেরিফাই করুন", "Verify OTP")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Invoices, Warranty Cards, Assembly Schedule list (USP Feature 19) */}
              <div className="p-6 rounded-3xl bg-zinc-900 border border-white/5 space-y-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>{t("আমার ক্রয়ের রশিদ, ওয়ারেন্টি ও ইনস্টলেশন শিডিউল", "Local Auto Invoice, Warranty & Setup Desk")}</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {orderHistory.map(ord => (
                    <div key={ord.id} className="p-4 bg-zinc-950 border border-white/5 rounded-2xl flex flex-col justify-between gap-3 relative">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] font-mono font-bold text-slate-500">Invoice: #{ord.id}</span>
                          <span className="text-[9px] bg-cyan-500/10 text-cyan-400 font-bold px-2 py-0.5 rounded font-mono">৳{ord.amount}</span>
                        </div>
                        <h4 className="text-xs font-black text-white">{ord.items}</h4>
                        <p className="text-[10px] text-slate-400">{ord.shopName} | Delivery: {ord.date}</p>
                        
                        {/* Digital warranty identifier */}
                        <div className="flex items-center gap-1.5 text-[9px] font-mono text-indigo-400 pt-1">
                          <span>🛡️ Digital Warranty Code:</span>
                          <span className="font-bold underline">{ord.warrantyCode}</span>
                        </div>

                        {/* Installation scheduled info */}
                        <div className="flex items-center gap-1.5 text-[9px] font-mono text-amber-400">
                          <span>🔧 Assembly Status:</span>
                          <span className="font-bold">{ord.installationStatus}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                        {/* Interactive invoice downloader */}
                        <button
                          onClick={() => {
                            toast.success(t(`চালান রশিদ #${ord.id} ডাউনলোড সম্পন্ন হয়েছে!`, `Invoice PDF for #${ord.id} generated!`), {
                              description: t("আপনার ইমেইল ও লোকাল ডিভাইসে চালান সেভ করা হয়েছে।", "Auto generated PDF invoice downloaded successfully.")
                            });
                          }}
                          className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-lg text-[9px] font-bold text-slate-300 cursor-pointer flex items-center gap-1"
                        >
                          <Info className="w-3 h-3 text-cyan-400" />
                          <span>PDF Invoice</span>
                        </button>

                        {/* Schedule dynamic assembly installer */}
                        {ord.installationStatus !== "Not Needed" && (
                          <button
                            onClick={() => {
                              toast.info(t("ইনস্টলেশন শিডিউল এডিটর সক্রিয়!", "Assembly service re-scheduler launched!"), {
                                description: t("আমাদের লজিস্টিকস টেকনিশিয়ান নির্দিষ্ট সময়ে আপনার ঠিকানায় উপস্থিত হবেন।", "Technician will reach home as scheduled.")
                              });
                            }}
                            className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-lg text-[9px] font-bold text-amber-400 cursor-pointer flex items-center gap-1"
                          >
                            <Settings className="w-3 h-3" />
                            <span>Reschedule Setup</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: LOCAL COMMUNITY DEMAND BOARD & LIVE OFFERS */}
          {activeSubTab === "community" && (
            <div className="space-y-6 animate-fadeIn text-left">
              {/* Live Offers Carousel/slider mockup (USP Feature 8) */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/20 via-indigo-950/20 to-zinc-900 border border-cyan-500/10 space-y-3">
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  {t("আজকের লাইভ লোকাল ডিল ও ডিসকাউন্ট", "Today's Live Local Offers & Broadcasts")}
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-950/50 border border-amber-500/20 rounded-2xl">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-mono bg-red-500 text-white px-1.5 py-0.5 rounded font-black uppercase">LIVE DISCOUNT</span>
                      <span className="text-[10px] text-slate-500 font-mono">Ends 10:00 PM</span>
                    </div>
                    <h4 className="text-xs font-black text-white mt-1.5">{t("রহিম জেনারেল স্টোর: সরিষার তেলে ২০% ডিসকাউন্ট!", "Rahim General Store: 20% OFF Organic Mustard Oil!")}</h4>
                    <p className="text-[10px] text-slate-400 mt-1">{t("১ লিটার বোতল এখন মাত্র ৳২২৪ (আগে ছিল ৳২৮০)", "1 Liter now only ৳224 instead of ৳280")}</p>
                  </div>

                  <div className="p-4 bg-zinc-950/50 border border-cyan-500/20 rounded-2xl">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-mono bg-cyan-500 text-black px-1.5 py-0.5 rounded font-black uppercase">FREE DELIVERY</span>
                      <span className="text-[10px] text-slate-500 font-mono">Today Only</span>
                    </div>
                    <h4 className="text-xs font-black text-white mt-1.5">{t("সুপার ফার্মা: যেকোনো জরুরী জীবনরক্ষাকারী ওষুধে ফ্রি ডেলিভারি", "Super Pharma: Free instant delivery on all emergency medicines")}</h4>
                    <p className="text-[10px] text-slate-400 mt-1">{t("পড়ালেখা এলাকা ও ১০ কিমি ব্যাসার্ধের মধ্যে যেকোনো অর্ডারে প্রযোজ্য।", "Valid on prescription medicines inside local radius limits.")}</p>
                  </div>
                </div>
              </div>

              {/* Community Commerce Demand Board (USP Feature 9) */}
              <div className="p-6 rounded-3xl bg-zinc-900 border border-white/5 space-y-5">
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-cyan-500" />
                    <span>{t("স্থানীয় চাহিদা ও বিডিং বোর্ড", "Local Demand & Merchant Bidding Board")}</span>
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {t("আপনার প্রয়োজনীয় কোনো কিছু ক্যাটালগে না থাকলে এখানে দাবি পোস্ট করুন। আশেপাশের বিক্রেতারা আপনাকে সরাসরি অফার পাঠাবেন।", "Can't find an item or service? Post your dynamic demand. Local merchants will pitch and place bids instantly!")}
                  </p>
                </div>

                {/* Broadcast Demand Form */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!demandInput.trim()) return;
                    const newDemand = {
                      id: `dem-${Date.now()}`,
                      user: "Your Account (আপনি)",
                      text: demandInput,
                      timestamp: "Just Now",
                      bids: []
                    };
                    setDemands([newDemand, ...demands]);
                    setDemandInput("");
                    toast.success(t("আপনার চাহিদা লোকাল বোর্ডে ব্রডকাস্ট করা হয়েছে!", "Your demand broadcasted to nearby merchants!"), {
                      description: t("দোকানদাররা অফার শুরু করলেই লাইভ নোটিফিকেশন পাবেন।", "We're notifying local shops. Sit back as bids come in.")
                    });

                    // Simulate automated merchant bid after 4 seconds
                    setTimeout(() => {
                      setDemands(prevDemands => {
                        return prevDemands.map(d => {
                          if (d.id === newDemand.id) {
                            return {
                              ...d,
                              bids: [
                                {
                                  id: `bid-${Date.now()}`,
                                  merchant: "Rahim General Store",
                                  offer: "We can arrange this within 20 mins for ৳380 total. Premium quality assurance.",
                                  status: "pending"
                                }
                              ]
                            };
                          }
                          return d;
                        });
                      });
                      toast.info(t("আপনার চাহিদার বিপরীতে নতুন মার্চেন্ট অফার এসেছে!", "New merchant bid submitted on your demand!"), {
                        icon: "🔔"
                      });
                    }, 4000);
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    placeholder={t("যেমন: 'মিরপুর ১২ তে এখনই ২ কেজি তাজা দেশি টমেটো লাগবে...' (উর্দু/ইংরেজি/বাংলা)", "Post demand, e.g. 'Urgent: need 2kg fresh farm tomatoes delivered at Mirpur...'")}
                    value={demandInput}
                    onChange={(e) => setDemandInput(e.target.value)}
                    className="flex-1 h-12 bg-zinc-950 border border-white/5 rounded-2xl px-4 text-xs text-white outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    className="h-12 px-5 bg-cyan-500 hover:opacity-95 text-black font-black text-xs rounded-2xl cursor-pointer"
                  >
                    {t("ব্রডকাস্ট করুন", "Broadcast Demand")}
                  </button>
                </form>

                {/* Active demands and bids stream list */}
                <div className="space-y-4 pt-2">
                  {demands.map(dem => (
                    <div key={dem.id} className="p-4 bg-zinc-950 rounded-2xl border border-white/5 space-y-3.5">
                      <div className="flex justify-between items-start text-[10px]">
                        <span className="font-extrabold text-slate-300">👤 {dem.user}</span>
                        <span className="text-slate-500 font-mono">{dem.timestamp}</span>
                      </div>
                      <p className="text-xs text-white leading-normal font-semibold bg-white/[0.01] p-3 rounded-xl border border-white/[0.03]">
                        {dem.text}
                      </p>

                      {/* Active merchant bids */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-mono text-cyan-400 font-extrabold uppercase tracking-widest block">
                          📢 Active Retailer Bids ({dem.bids.length}):
                        </span>

                        {dem.bids.length === 0 ? (
                          <div className="text-[10px] text-slate-500 italic px-2 py-1">
                            ⏳ {t("আশেপাশের বিক্রেতাদের রেসপন্সের জন্য অপেক্ষা করা হচ্ছে...", "Awaiting responses from local shops...")}
                          </div>
                        ) : (
                          dem.bids.map(bid => (
                            <div key={bid.id} className="p-3 bg-cyan-500/5 border border-cyan-500/15 rounded-xl flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center">
                              <div>
                                <span className="text-[10px] font-black text-cyan-400 block">🏪 {bid.merchant}</span>
                                <p className="text-[11px] text-slate-300 leading-tight mt-0.5">{bid.offer}</p>
                              </div>
                              <div className="flex gap-1.5 shrink-0">
                                <button
                                  onClick={() => {
                                    toast.success(t("অফারটি সফলভাবে গ্রহণ করা হয়েছে!", "Merchant offer accepted!"), {
                                      description: t("অর্ডার প্লেস করা হয়েছে। রাইডার শিগগিরই পৌঁছাবে।", "Check delivery status in delivery tab."),
                                      icon: "💖"
                                    });
                                    // Remove this demand or mark bid as accepted
                                    setDemands(prev => prev.filter(d => d.id !== dem.id));
                                  }}
                                  className="px-3 py-1.5 bg-cyan-500 hover:opacity-90 text-black text-[10px] font-black rounded-lg cursor-pointer"
                                >
                                  {t("গ্রহণ করুন", "Accept Offer")}
                                </button>
                                <button
                                  onClick={() => {
                                    setDemands(prev => prev.map(d => {
                                      if (d.id === dem.id) {
                                        return { ...d, bids: d.bids.filter(b => b.id !== bid.id) };
                                      }
                                      return d;
                                    }));
                                    toast.info(t("অফার বাতিল করা হয়েছে।", "Offer declined."));
                                  }}
                                  className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-slate-400 text-[10px] rounded-lg cursor-pointer"
                                >
                                  {t("বাতিল", "Decline")}
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: FAVORITES, STORE NOTIFICATIONS & AI SMART REORDERS */}
          {activeSubTab === "saved" && (
            <div className="space-y-6 animate-fadeIn text-left">
              {/* Intelligent AI reorder suggestion cards (USP Feature 13) */}

       


              {/* Subscribed Shop feeds (USP Feature 12) */}
              <div className="p-6 rounded-3xl bg-zinc-900 border border-white/5 space-y-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>{t("আমার সাবস্ক্রাইব করা স্টোর ব্রডকাস্ট", "My Store Subscriptions & Broadcasters")}</span>
                </h3>

                <div className="space-y-3.5">
                  {subscribedShops.length === 0 ? (
                    <p className="text-xs text-slate-500 py-3 italic">{t("আপনি এখনো কোনো স্টোর ফলো করেননি।", "You aren't following any local stores yet.")}</p>
                  ) : (
                    shopsList.filter(s => subscribedShops.includes(s.id)).map(shop => (
                      <div key={shop.id} className="p-4 bg-zinc-950 border border-white/5 rounded-2xl flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                        <div className="flex items-center gap-3">
                          <img src={shop.image} className="w-10 h-10 rounded-xl object-cover" />
                          <div>
                            <span className="text-[10px] font-mono text-cyan-400 font-extrabold block">🏪 {shop.name}</span>
                            <p className="text-xs text-white leading-tight mt-1">
                              {shop.id === "nb-1" 
                                ? t("📢 'আজকে আমাদের খামারের একদম তাজা দুধ স্টক করা হয়েছে! দ্রুত অর্ডার দিন।'", "📢 'Fresh raw morning milk is fully stocked today! Quick doorstep delivery.'")
                                : t("📢 'আমাদের এখানে ফাস্ট-এইড ও ওটিসি পণ্য ১০০% স্টক রিনিউ করা হয়েছে।'", "📢 'OTC and First-aid boxes are completely renewed. Verified stock available.'")
                              }
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedShop(shop);
                            setDrawerTab("catalog");
                          }}
                          className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] font-black rounded-xl cursor-pointer border border-white/5 shrink-0"
                        >
                          {t("স্টোরে ঢুকুন", "Enter Store")}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Favorite local stores list (USP Feature 11) */}
              <div className="p-6 rounded-3xl bg-zinc-900 border border-white/5 space-y-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span>{t("আমার প্রিয় লোকাল দোকানসমূহ", "My Saved Local Stores")}</span>
                </h3>

                {favoriteShops.length === 0 ? (
                  <p className="text-xs text-slate-500 py-3 italic">{t("আপনার প্রিয় তালিকায় কোনো দোকান সংরক্ষিত নেই।", "No stores added to favorites yet. Click the heart button on shop cards.")}</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {shopsList.filter(s => favoriteShops.includes(s.id)).map(shop => (
                      <div
                        key={shop.id}
                        onClick={() => {
                          setSelectedShop(shop);
                          setDrawerTab("catalog");
                        }}
                        className="p-4 bg-zinc-950 hover:bg-zinc-900/50 border border-white/5 rounded-2xl flex gap-3 cursor-pointer transition-all"
                      >
                        <img src={shop.image} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                        <div className="text-left">
                          <h4 className="font-extrabold text-xs text-white">{shop.name}</h4>
                          <span className="text-[10px] text-slate-400 block mt-1">📍 {shop.location} | Rating: ⭐{shop.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        /* ═══════════════════════════════════════════════
           MERCHANT / SERVICE PROVIDER HUB
           ═══════════════════════════════════════════════ */
        <div className="space-y-6 animate-fadeIn">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                <Store className="w-4 h-4 text-cyan-400 animate-pulse" />
                {t("লোকাল মার্চেন্ট এবং সার্ভিস প্যানেল", "Local Merchant & Service Studio")}
              </span>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                {t("আমার শপ ও বুকিং সেন্টার", "My Shop & Service Control Hub")}
              </h2>
            </div>
            
            <div className="flex gap-3 text-xs font-mono bg-zinc-900 border border-white/5 p-3 rounded-2xl">
              <div className="text-center px-2">
                <span className="text-slate-400 block text-[9px] uppercase">{t("ওয়ালেট ব্যালেন্স", "Logistics Wallet")}</span>
                <span className="text-cyan-400 font-black">৳{walletBalance}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Form to Register Shop/Service */}
            <div className="p-6 rounded-3xl bg-zinc-900 border border-white/5 space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>{t("নতুন শপ বা সার্ভিস রেজিস্টার করুন", "Register Shop / Home Service")}</span>
              </h3>
              
              <form onSubmit={handleRegisterMerchant} className="space-y-4">
                <div>
                  <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-wide mb-1.5">
                    {t("দোকান বা সার্ভিস এর নাম", "Business / Service Name")}
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. করিম ইলেকট্রিক্যাল সলিউশনস"
                    value={newShopName}
                    onChange={e => setNewShopName(e.target.value)}
                    className="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-3 text-xs text-white outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-wide mb-1.5">
                      {t("ক্যাটাগরি", "Category")}
                    </label>
                    <select
                      value={newShopCategory}
                      onChange={e => setNewShopCategory(e.target.value)}
                      className="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-2 text-xs text-slate-300 outline-none focus:border-cyan-500/50"
                    >
                      <option value="grocery">মুদিখানা (Grocery)</option>
                      <option value="pharmacy">ফার্মেসি (Pharmacy)</option>
                      <option value="services">সেবাসমূহ (Services)</option>
                      <option value="homemade">হোমমেড ও বুটিকস (Boutique)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-wide mb-1.5">
                      {t("ব্যবসায়িক টাইপ", "Business Type")}
                    </label>
                    <select
                      value={newShopType}
                      onChange={e => setNewShopType(e.target.value as any)}
                      className="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-2 text-xs text-slate-300 outline-none focus:border-cyan-500/50"
                    >
                      <option value="shop">পণ্য বিক্রয় (Product Shop)</option>
                      <option value="service">সেবা প্রদান (On-Demand Service)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-wide mb-1.5">
                      {t("মালিকের নাম", "Owner Full Name")}
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. মো: করিম আলী"
                      value={newShopOwner}
                      onChange={e => setNewShopOwner(e.target.value)}
                      className="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-3 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-wide mb-1.5">
                      {t("মোবাইল নম্বর", "Mobile Number")}
                    </label>
                    <input 
                      type="tel"
                      required
                      placeholder="01XXXXXXXXX"
                      value={newShopPhone}
                      onChange={e => setNewShopPhone(e.target.value)}
                      className="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-3 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-wide mb-1.5">
                    {t("এরিয়া ঠিকানা", "Full Physical Address / Service Area")}
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. রোড ৭, মিরপুর ১০, ঢাকা"
                    value={newShopLocation}
                    onChange={e => setNewShopLocation(e.target.value)}
                    className="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-3 text-xs text-white outline-none focus:border-cyan-500/50"
                  />
                </div>

                {/* --- SMART MERCHANT VERIFICATION (NID & TRADE LICENSE) --- */}
                <div className="border-t border-white/5 pt-4 space-y-4">
                  <h4 className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest">
                    🛡️ {t("স্মার্ট মার্চেন্ট ভেরিফিকেশন (NID & License)", "Smart Merchant Verification")}
                  </h4>

                  {/* NID Input & Upload Group */}
                  <div className="space-y-2">
                    <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-wide">
                      {t("জাতীয় পরিচয়পত্র নম্বর (NID)", "National Identity Number (NID)")}
                    </label>
                    <input 
                      type="text"
                      maxLength={17}
                      placeholder="e.g. 19932692015000123"
                      value={nidNumber}
                      onChange={e => setNidNumber(e.target.value.replace(/\D/g, ''))}
                      className="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-3 text-xs text-white outline-none focus:border-cyan-500/50"
                    />

                    {/* Drag and drop simulated file uploader */}
                    <div 
                      onClick={() => {
                        if (isNidUploading) return;
                        setIsNidUploading(true);
                        setTimeout(() => {
                          setIsNidUploading(false);
                          setNidFileName("NID_Verification_Document_FrontBack.jpg");
                          toast.success(t("এনআইডি ডকুমেন্ট সফলভাবে আপলোড হয়েছে!", "NID Document uploaded successfully!"));
                        }, 1200);
                      }}
                      className={cn(
                        "border border-dashed rounded-xl p-3 text-center cursor-pointer transition-all duration-300",
                        nidFileName 
                          ? "border-cyan-500/30 bg-cyan-500/5" 
                          : "border-white/10 bg-black/20 hover:border-cyan-500/25"
                      )}
                    >
                      {isNidUploading ? (
                        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold font-mono">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                          <span>{t("ফাইল আপলোড হচ্ছে...", "Uploading NID Doc...")}</span>
                        </div>
                      ) : nidFileName ? (
                        <div className="flex items-center justify-between text-[10px] text-cyan-400 font-extrabold">
                          <span className="truncate max-w-[180px]">📄 {nidFileName}</span>
                          <span className="text-[8px] bg-cyan-500 text-black px-1.5 py-0.5 rounded uppercase font-mono">Uploaded</span>
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-400 space-y-1">
                          <p className="font-bold">{t("📁 এনআইডি ডকুমেন্ট আপলোড করুন", "📁 Upload NID Document")}</p>
                          <p className="text-[8px] text-slate-600 font-medium">JPEG, PNG or PDF (Max 5MB)</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Trade License Input & Upload Group */}
                  <div className="space-y-2">
                    <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-wide">
                      {t("ট্রেড লাইসেন্স নম্বর (Trade License)", "Trade License Number")}
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. TR-2026-9912"
                      value={tradeLicenseNumber}
                      onChange={e => setTradeLicenseNumber(e.target.value)}
                      className="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-3 text-xs text-white outline-none focus:border-cyan-500/50"
                    />

                    {/* Drag and drop simulated Trade license file uploader */}
                    <div 
                      onClick={() => {
                        if (isLicenseUploading) return;
                        setIsLicenseUploading(true);
                        setTimeout(() => {
                          setIsLicenseUploading(false);
                          setTradeLicenseFileName("Trade_License_Registries_Copy.pdf");
                          toast.success(t("ট্রেড লাইসেন্স ডকুমেন্ট সফলভাবে আপলোড হয়েছে!", "Trade License document uploaded successfully!"));
                        }, 1200);
                      }}
                      className={cn(
                        "border border-dashed rounded-xl p-3 text-center cursor-pointer transition-all duration-300",
                        tradeLicenseFileName 
                          ? "border-cyan-500/30 bg-cyan-500/5" 
                          : "border-white/10 bg-black/20 hover:border-cyan-500/25"
                      )}
                    >
                      {isLicenseUploading ? (
                        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold font-mono">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                          <span>{t("ফাইল আপলোড হচ্ছে...", "Uploading License...")}</span>
                        </div>
                      ) : tradeLicenseFileName ? (
                        <div className="flex items-center justify-between text-[10px] text-cyan-400 font-extrabold">
                          <span className="truncate max-w-[180px]">📄 {tradeLicenseFileName}</span>
                          <span className="text-[8px] bg-cyan-500 text-black px-1.5 py-0.5 rounded uppercase font-mono">Uploaded</span>
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-400 space-y-1">
                          <p className="font-bold">{t("📁 ট্রেড লাইসেন্স ফাইল আপলোড করুন", "📁 Upload Trade License Copy")}</p>
                          <p className="text-[8px] text-slate-600 font-medium">JPEG, PNG or PDF (Max 5MB)</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* --- LIVE TRUST BADGE LEVEL CALCULATOR & CHECKLIST --- */}
                <div className="border-t border-white/5 pt-4 bg-black/20 p-4 rounded-2xl space-y-3 border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {t("লাইভ ট্রাস্ট ক্যালকুলেটর", "Live Trust Calculator")}
                    </span>
                    <TrustBadge level={liveTrustLevel} interactive={false} />
                  </div>

                  <div className="space-y-1.5 text-[9px] font-mono text-slate-400">
                    <div className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-cyan-500 font-black" />
                      <span className="text-slate-300">Lvl 1: Phone Verified (Active)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {liveTrustLevel >= 2 ? (
                        <Check className="w-3 h-3 text-cyan-500 font-black" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-white/20" />
                      )}
                      <span className={liveTrustLevel >= 2 ? "text-slate-300" : "text-slate-600"}>
                        Lvl 2: Business Profile Completed
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {nidNumber.trim().length >= 10 ? (
                        <Check className="w-3 h-3 text-cyan-500 font-black" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-white/20" />
                      )}
                      <span className={nidNumber.trim().length >= 10 ? "text-slate-300" : "text-slate-600"}>
                        Lvl 3: NID Number Provided
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {nidFileName ? (
                        <Check className="w-3 h-3 text-cyan-500 font-black" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-white/20" />
                      )}
                      <span className={nidFileName ? "text-slate-300" : "text-slate-600"}>
                        Lvl 4: NID Document Uploaded
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {tradeLicenseNumber.trim().length >= 5 ? (
                        <Check className="w-3 h-3 text-cyan-500 font-black" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-white/20" />
                      )}
                      <span className={tradeLicenseNumber.trim().length >= 5 ? "text-slate-300" : "text-slate-600"}>
                        Lvl 5: Trade License Provided
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {tradeLicenseFileName ? (
                        <Check className="w-3 h-3 text-cyan-500 font-black" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-white/20" />
                      )}
                      <span className={tradeLicenseFileName ? "text-slate-300" : "text-slate-600"}>
                        Lvl 6: License Document Uploaded
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {liveTrustLevel >= 7 ? (
                        <Check className="w-3 h-3 text-cyan-500 font-black" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-white/20" />
                      )}
                      <span className={liveTrustLevel >= 7 ? "text-slate-300" : "text-slate-600"}>
                        Lvl 7: Golden Trust Partner Status
                      </span>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 bg-cyan-500 hover:opacity-95 text-black font-black text-xs rounded-xl cursor-pointer"
                >
                  🚀 {t("ব্যবসায়িক কার্যক্রম শুরু করুন", "Initialize Local Storefront")}
                </Button>
              </form>
            </div>

            {/* Merchant Dashboard: Received Orders & Logistics Request */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-zinc-900 border border-white/5 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Package className="w-4 h-4 text-cyan-400" />
                  <span>{t("চলতি অর্ডার ও সেবা বুকিং রিকোয়েস্টসমূহ", "Received Orders & On-Demand Bookings")}</span>
                </h3>
                <span className="text-[10px] bg-cyan-500/15 text-cyan-400 px-2 py-0.5 rounded font-bold">
                  {receivedOrders.filter(o => o.status !== "Delivered").length} Live Jobs
                </span>
              </div>

              <div className="space-y-3">
                {receivedOrders.map(order => (
                  <div key={order.id} className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] text-slate-400">Order ID: #{order.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        order.status === "Pending Dispatch" ? "bg-amber-500/10 text-amber-400" : "bg-cyan-500/10 text-cyan-400"
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-b border-white/5 py-3 text-slate-300">
                      <div>
                        <p className="text-slate-500 text-[10px] uppercase font-bold">{t("গ্রাহক তথ্য", "Buyer Details")}</p>
                        <p className="font-extrabold text-white mt-1">{order.buyerName}</p>
                        <p className="text-[11px] mt-0.5">📞 {order.buyerPhone}</p>
                        <p className="text-[11px] text-slate-400 mt-1">📍 {order.buyerAddress}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-[10px] uppercase font-bold">{t("পণ্য/সেবা বিবরণী", "Items / Requested Services")}</p>
                        <p className="font-extrabold text-white mt-1">{order.items}</p>
                        <p className="text-[11px] font-mono mt-1 text-cyan-400">COD: ৳{order.totalAmount}</p>
                        {order.carrierTicket && (
                          <div className="mt-2 bg-blue-500/10 border border-blue-500/20 p-2 rounded-xl text-[10px] text-blue-400">
                            🚚 Carrier Ticket: <strong>{order.carrierTicket}</strong>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Integrated Logistics Hub Action */}
                    {order.status === "Pending Dispatch" && (
                      <div className="flex flex-wrap gap-2 pt-1.5 justify-end">
                        <button
                          onClick={() => handleRequestLogisticsRider(order.id, "Pathao")}
                          className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] text-white font-bold hover:bg-white/10 transition-all cursor-pointer"
                        >
                          ⚡ Request Pathao
                        </button>
                        <button
                          onClick={() => handleRequestLogisticsRider(order.id, "RedX")}
                          className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[10px] text-cyan-400 font-black hover:bg-cyan-500/20 transition-all cursor-pointer"
                        >
                          🚛 Request RedX
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
         INTERACTIVE STOREFRONT / SERVICE PROFILE DRAWER
         ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedShop && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end justify-center"
          >
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={() => setSelectedShop(null)} />

            <motion.div 
              initial={{ y: 200 }}
              animate={{ y: 0 }}
              exit={{ y: 200 }}
              className="relative w-full max-w-2xl bg-zinc-950 border-t border-white/10 rounded-t-[2.5rem] p-6 space-y-6 z-10 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              {/* Drawer Top Header info */}
              <div className="flex justify-between items-start border-b border-white/5 pb-4">
                <div className="flex gap-4">
                  <img src={selectedShop.image} className="w-14 h-14 rounded-2xl object-cover border border-white/5 shrink-0" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-black uppercase text-cyan-400 tracking-widest bg-cyan-500/10 px-2 py-0.5 rounded">
                        {selectedShop.categoryLocal}
                      </span>
                      {selectedShop.isVerified && <VerificationBadge badgeType="trusted_merchant" size="xs" />}
                      <TrustBadge level={selectedShop.trustLevel} />
                    </div>
                    <h3 className="text-base font-black text-white mt-1">{selectedShop.name}</h3>
                    <p className="text-[11px] text-slate-400">Owner: {selectedShop.owner} | Phone: {selectedShop.phone}</p>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedShop(null)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Slider Tab Navigation */}
              <div className="flex border-b border-white/5 pb-1 gap-2">
                <button
                  onClick={() => setDrawerTab("catalog")}
                  className={`px-4 py-2 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    drawerTab === "catalog" ? "bg-cyan-500 text-black" : "bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>{selectedShop.type === "shop" ? t("পণ্য ক্যাটালগ", "Products") : t("সেবাসমূহ ও রেট", "Services")}</span>
                </button>

                <button
                  onClick={() => setDrawerTab("chat")}
                  className={`px-4 py-2 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    drawerTab === "chat" ? "bg-cyan-500 text-black" : "bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{t("সরাসরি চ্যাট", "Live Chat")}</span>
                </button>

                <button
                  onClick={() => setDrawerTab("checkout")}
                  className={`px-4 py-2 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    drawerTab === "checkout" ? "bg-cyan-500 text-black" : "bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{t("অর্ডার রিভিউ", "Checkout")}</span>
                </button>
              </div>

              {/* DRAWER CONTENT CONDITIONAL */}
              <div className="min-h-[250px]">
                
                {/* 1. PRODUCT OR SERVICE CATALOG */}
                {drawerTab === "catalog" && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-400 leading-normal">
                      {selectedShop.type === "shop" 
                        ? t("আপনার প্রয়োজনীয় পণ্যগুলো কার্টে যুক্ত করুন। একই দিনে দ্রুততম ডেলিভারি দেওয়া হবে।", "Add necessary local grocery items below to your hyper-local shopping cart.")
                        : t("আপনার কাঙ্ক্ষিত গৃহস্থালী সেবাটি বুক করুন। আমাদের টেকনিশিয়ান ২০ মিনিটে পৌছে যাবেন।", "Choose and request standard home-service diagnostics or expert troubleshooting below.")
                      }
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedShop.catalog.map((item: any) => (
                        <div key={item.id} className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex justify-between items-center gap-3">
                          <div className="flex items-center gap-3">
                            <img src={item.image} className="w-11 h-11 rounded-xl object-cover shrink-0" />
                            <div className="text-left">
                              <h5 className="font-extrabold text-xs text-white truncate max-w-[150px]">{item.name}</h5>
                              <span className="text-[10px] font-mono text-cyan-400 font-bold block mt-0.5">৳{item.price}</span>
                            </div>
                          </div>

                          <Button
                            size="sm"
                            onClick={() => addToCart(selectedShop.id, item)}
                            className="bg-cyan-500 hover:opacity-95 text-black font-black h-8 rounded-lg text-[10px] cursor-pointer"
                          >
                            + {t("যোগ করুন", "Add")}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. LIVE DIRECT CHAT WORKSPACE */}
                {drawerTab === "chat" && (
                  <div className="space-y-4 flex flex-col justify-between min-h-[280px]">
                    <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                      {(chatThreads[selectedShop.id] || []).map((msg, idx) => {
                        const isMe = msg.sender === 'buyer';
                        return (
                          <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 max-w-xs rounded-2xl text-xs leading-normal ${
                              isMe ? 'bg-cyan-500 text-black font-semibold rounded-tr-none' : 'bg-zinc-900 text-white rounded-tl-none border border-white/5'
                            }`}>
                              <p>{msg.text}</p>
                              <span className="text-[8px] opacity-70 block text-right mt-1 font-mono">{msg.time}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Chat Input interface */}
                    <div className="flex gap-2 pt-2 border-t border-white/5">
                      <input 
                        type="text"
                        placeholder={t("দোকানদারকে মেসেজ দিন...", "Type message to shop owner...")}
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendChatMessage(selectedShop.id)}
                        className="flex-1 h-11 bg-zinc-900 border border-white/10 rounded-xl px-4 text-xs text-white outline-none focus:border-cyan-500"
                      />
                      <button
                        onClick={() => sendChatMessage(selectedShop.id)}
                        className="w-11 h-11 rounded-xl bg-cyan-500 hover:opacity-95 text-black flex items-center justify-center cursor-pointer shrink-0"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. UNIVERSAL CHECKOUT & PAYMENT INTEGRATION */}
                {drawerTab === "checkout" && (
                  <div className="space-y-4">
                    {/* Cart item listing */}
                    <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                      {(localCart[selectedShop.id] || []).length === 0 ? (
                        <div className="text-center py-6 text-slate-500 text-xs uppercase font-mono">
                          {t("কোনো পণ্য যোগ করা হয়নি", "Cart is empty")}
                        </div>
                      ) : (
                        (localCart[selectedShop.id] || []).map(item => (
                          <div key={item.id} className="p-3 bg-white/[0.01] border border-white/5 rounded-xl flex justify-between items-center text-xs">
                            <div>
                              <p className="font-extrabold text-white">{item.name}</p>
                              <span className="text-[10px] text-slate-500 font-mono">৳{item.price} x {item.qty}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => updateQty(selectedShop.id, item.id, -1)}
                                className="w-6 h-6 rounded bg-white/5 text-slate-300 flex items-center justify-center font-bold hover:bg-white/10 cursor-pointer"
                              >
                                -
                              </button>
                              <span className="font-bold text-white font-mono">{item.qty}</span>
                              <button 
                                onClick={() => updateQty(selectedShop.id, item.id, 1)}
                                className="w-6 h-6 rounded bg-white/5 text-slate-300 flex items-center justify-center font-bold hover:bg-white/10 cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Financial Calculations */}
                    {(localCart[selectedShop.id] || []).length > 0 && (
                      <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5 space-y-2 text-xs font-mono">
                        <div className="flex justify-between text-slate-400">
                          <span>Subtotal:</span>
                          <span>৳{(localCart[selectedShop.id] || []).reduce((acc, curr) => acc + (curr.price * curr.qty), 0)}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Auto VAT (5%):</span>
                          <span>৳{Math.round((localCart[selectedShop.id] || []).reduce((acc, curr) => acc + (curr.price * curr.qty), 0) * 0.05)}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Doorstep Shipping:</span>
                          <span>৳50</span>
                        </div>
                        <div className="flex justify-between text-white font-black border-t border-white/5 pt-2 text-sm">
                          <span>Total Pay:</span>
                          <span className="text-cyan-400">
                            ৳{
                              (localCart[selectedShop.id] || []).reduce((acc, curr) => acc + (curr.price * curr.qty), 0) + 
                              Math.round((localCart[selectedShop.id] || []).reduce((acc, curr) => acc + (curr.price * curr.qty), 0) * 0.05) + 
                              50
                            }
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Integrated Multi-method Checkout Pay buttons */}
                    {(localCart[selectedShop.id] || []).length > 0 && (
                      <div className="space-y-2.5 pt-1">
                        <label className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">{t("পেমেন্ট পদ্ধতি নির্বাচন করুন", "Select Payment Gateway")}</label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => handleLocalCheckout(selectedShop, "bkash")}
                            className="h-10 rounded-xl bg-[#e2136e] hover:opacity-90 text-white text-[11px] font-black cursor-pointer"
                          >
                            bKash
                          </button>
                          <button
                            onClick={() => handleLocalCheckout(selectedShop, "nagad")}
                            className="h-10 rounded-xl bg-[#f37021] hover:opacity-90 text-white text-[11px] font-black cursor-pointer"
                          >
                            Nagad
                          </button>
                          <button
                            onClick={() => handleLocalCheckout(selectedShop, "wallet")}
                            className="h-10 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-black font-black border border-cyan-500/20 text-[11px] cursor-pointer"
                          >
                            Wallet (৳{walletBalance})
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════
         BD ADDRESS SELECTOR MODAL / DRAWER
         ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {isAddressModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center px-4"
          >
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={() => setIsAddressModalOpen(false)} />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-[2.5rem] p-6 space-y-5 z-10 max-h-[85vh] overflow-y-auto no-scrollbar shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">{t("পিকআপ বা ডেলিভারি এরিয়া সেট করুন", "Select Pickup / Delivery Address")}</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">{t("বাংলাদেশ বিভাগ ভিত্তিক ক্যাসকেডিং জিওগ্রাফি সিলেকশন", "Cascading divisions to ZIP code registry validation")}</p>
                </div>
                <button 
                  onClick={() => setIsAddressModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Cascade selector widget */}
              <div className="bg-black/40 border border-[#1e3425] rounded-3xl p-5 space-y-4">
                <BDAddressSelector 
                  onChange={(addr, isValid) => {
                    setAddressDetails(addr);
                    setIsAddressValid(isValid);
                  }}
                />
              </div>

              {/* Set Destination trigger */}
              <div className="pt-2">
                <Button
                  onClick={handleAddressSubmit}
                  className="w-full bg-cyan-500 hover:opacity-95 text-black font-black text-xs h-11 rounded-xl cursor-pointer"
                >
                  Confirm Address Area ➔
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RIDER REQUEST OVERLAY */}
      <AnimatePresence>
        {isRiderRequesting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md px-4"
          >
            <div className="bg-zinc-900 border border-cyan-500/30 p-8 rounded-[40px] max-w-sm w-full text-center space-y-6 shadow-[0_0_50px_rgba(16,185,129,0.25)]">
              <div className="relative mx-auto w-24 h-24">
                <motion.div 
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-cyan-500/20 rounded-full"
                />
                <div className="relative z-10 w-24 h-24 bg-cyan-500 rounded-full flex items-center justify-center border-4 border-black">
                  <Navigation className="w-10 h-10 text-black animate-bounce" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-black text-white">{t("রাইডার খোঁজা হচ্ছে...", "Assigning Local Delivery Rider...")}</h3>
                <p className="text-xs text-slate-400 mt-2">{t("নিকটবর্তী সব রাইডারদের রিকোয়েস্ট পাঠানো হয়েছে। অনুগ্রহ করে ২০ সেকেন্ড অপেক্ষা করুন।", "Pinging nearest delivery agents for swift door-step dispatch.")}</p>
              </div>
              <div className="bg-cyan-500/10 p-4 rounded-3xl border border-cyan-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 bg-zinc-800 rounded-xl overflow-hidden border border-white/10 shrink-0">
                    <img src={activeOrder?.image} className="w-full h-full object-cover" />
                  </div>
                  <div className="leading-none">
                    <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Store / শপ</p>
                    <p className="text-xs font-black text-white truncate w-28">{activeOrder?.name}</p>
                  </div>
                </div>
                <div className="text-right leading-none">
                  <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">To Area</p>
                  <p className="text-xs font-black text-cyan-400">{activeArea.split(',')[0] || "Destination"}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                className="w-full text-rose-500 font-black text-xs"
                onClick={() => setIsRiderRequesting(false)}
              >
                {t("আদেশ বাতিল করুন", "Cancel Dispatch")}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

function MarkerWithInfoWindow({ position, title, shop }: {
  position: google.maps.LatLngLiteral;
  title: string;
  shop: any;
}) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [open, setOpen] = useState(false);

  return (
    <>
      <AdvancedMarker ref={markerRef} position={position} title={title} onClick={() => setOpen(true)}>
        <Pin background="#10b981" glyphColor="#fff" borderColor="#047857" />
      </AdvancedMarker>
      {open && (
        <InfoWindow anchor={marker} onCloseClick={() => setOpen(false)}>
          <div className="p-2.5 max-w-[180px] text-black">
            <span className="text-[8px] uppercase tracking-wider text-cyan-600 font-extrabold block mb-0.5">{shop.categoryLocal}</span>
            <h4 className="font-extrabold text-xs text-zinc-900 truncate">{title}</h4>
            <p className="text-[10px] text-zinc-500 mt-0.5">{shop.location}</p>
            <p className="text-[10px] font-black text-cyan-500 mt-1.5 flex items-center gap-1">📍 {shop.distance}</p>
          </div>
        </InfoWindow>
      )}
    </>
  );
}
