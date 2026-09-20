import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { 
  User, 
  Store, 
  Factory, 
  ShoppingBag, 
  Loader2, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Upload, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Truck,
  Wrench,
  Check,
  Boxes,
  Plane,
  Landmark,
  MapPin,
  Building2,
  Phone,
  Sparkles,
  CreditCard,
  FileText,
  Ship,
  Layers,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
// import { useKycStore } from "@/modules/admin/useKycStore"; // Assume this might be needed later or exists
import { cn } from "@/lib/utils";
// import { AppRole } from "@/config/roles.config"; // Assume roles config is needed
import { BDAddressSelector, AddressDetails } from "@/components/common/BDAddressSelector";
import { TrustBadge } from "@/components/common/TrustBadge";

export type AccountType = any; // fallback for now

interface AccountTypeConfig {
  id: AccountType;
  labelEn: string;
  labelBn: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  securityRequired: boolean;
  expectedTrustLevel: number;
  descEn: string;
  descBn: string;
  group: 'buyer' | 'seller' | 'logistics' | 'service';
}

const ACCOUNT_TYPES: AccountTypeConfig[] = [
  { 
    id: "buyer", 
    labelEn: "Buyer (Retail & Social)", 
    labelBn: "সাধারণ ক্রেতা (খুচরা ও সামাজিক কমার্স)", 
    icon: User, 
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
    securityRequired: false,
    expectedTrustLevel: 1,
    descEn: "Browse feed, buy products, and book localized services.",
    descBn: "পণ্য ক্রয়, সামাজিক যোগাযোগ ও যেকোনো সার্ভিস বুকিং করুন।",
    group: 'buyer'
  },
  { 
    id: "retail_seller", 
    labelEn: "Retail Seller", 
    labelBn: "খুচরা বিক্রেতা / রিটেইল দোকান", 
    icon: Store, 
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    securityRequired: false,
    expectedTrustLevel: 4,
    descEn: "Sell products directly to consumers and local buyers.",
    descBn: "স্থানীয় সাধারণ ক্রেতাদের কাছে সরাসরি পণ্য বিক্রয় করুন।",
    group: 'seller'
  },
  { 
    id: "wholesale_seller", 
    labelEn: "Wholesale Dealer", 
    labelBn: "পাইকারি বিক্রেতা ও ডিলার (Wholesale)", 
    icon: Boxes, 
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
    securityRequired: true,
    expectedTrustLevel: 5,
    descEn: "Supply bulk products, tiered quantities & B2B orders.",
    descBn: "ইসলামপুর, খাতুনগঞ্জ বা পাইকারি মার্কেট থেকে বাল্ক পণ্য সরবরাহ করুন।",
    group: 'seller'
  },
  { 
    id: "factory_seller", 
    labelEn: "Manufacturer / Factory", 
    labelBn: "প্রস্তুতকারক ও শিল্প কারখানা (Factory)", 
    icon: Factory, 
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
    securityRequired: true,
    expectedTrustLevel: 6,
    descEn: "Showcase manufacturing capacity, certifications & export lines.",
    descBn: "কারখানা উৎপাদন ক্ষমতা, আরএফকিউ ও বাল্ক প্রোডাকশন পরিচালনা করুন।",
    group: 'seller'
  },
  { 
    id: "rural_seller", 
    labelEn: "Rural Merchant & Hat", 
    labelBn: "গ্রামীণ খামারি ও সাপ্তাহিক হাট ব্যবসায়ী", 
    icon: Store, 
    color: "text-teal-400",
    bgColor: "bg-teal-500/10",
    borderColor: "border-teal-500/20",
    securityRequired: false,
    expectedTrustLevel: 4,
    descEn: "Agro crops, organic farming, cottage industry & local hat bazaar.",
    descBn: "সরাসরি মাঠের ফসল, খামারজাত পণ্য ও গ্রামীণ সাপ্তাহিক হাটের দোকান।",
    group: 'seller'
  },
  { 
    id: "exporter", 
    labelEn: "Exporter", 
    labelBn: "রপ্তানিকারক প্রতিষ্ঠান (Exporter)", 
    icon: Plane, 
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/20",
    securityRequired: true,
    expectedTrustLevel: 6,
    descEn: "Sell made-in-Bangladesh products to international buyers.",
    descBn: "আন্তর্জাতিক বাজারে পণ্য রপ্তানি ও লেটার অফ ক্রেডিট পরিচালনা।",
    group: 'seller'
  },
  { 
    id: "importer", 
    labelEn: "Importer", 
    labelBn: "আমদানিকারক প্রতিষ্ঠান (Importer)", 
    icon: Landmark, 
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    securityRequired: true,
    expectedTrustLevel: 6,
    descEn: "Import commodities & goods for local wholesale distribution.",
    descBn: "বিদেশ থেকে পণ্য আমদানি ও পাইকারি বাজারে বিতরণ করুন।",
    group: 'seller'
  },
  { 
    id: "rider", 
    labelEn: "Rider & Logistics", 
    labelBn: "রাইডার ও ট্রান্সপোর্ট পার্টনার", 
    icon: Truck, 
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    securityRequired: true,
    expectedTrustLevel: 4,
    descEn: "Parcel delivery, passenger rides, and goods transport.",
    descBn: "পার্সেল ডেলিভারি, মোটরসাইকেল বা কাভার্ড ভ্যান পরিবহন সেবা দিন।",
    group: 'logistics'
  },
  { 
    id: "service_provider", 
    labelEn: "Professional Services", 
    labelBn: "পেশাদার ও কারিগরি সার্ভিস", 
    icon: Wrench, 
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    securityRequired: true,
    expectedTrustLevel: 4,
    descEn: "Offer specialized repair, installation, or technical labor.",
    descBn: "ইলেকট্রিশিয়ান, এসি টেকনিশিয়ান ও হোম সার্ভিস বুকিং সেবা দিন।",
    group: 'service'
  }
];

const WHOLESALE_HUBS = [
  "ইসলামপুর (Islampur), ঢাকা",
  "খাতুনগঞ্জ (Khatunganj), চট্টগ্রাম",
  "বঙ্গবাজার (Bangabazar), ঢাকা",
  "নিউমার্কেট এলাকা (New Market), ঢাকা",
  "মৌলভীবাজার (Moulvibazar), ঢাকা",
  "চকবাজার (Chawkbazar), ঢাকা",
  "টঙ্গী বিসিক শিল্প এলাকা (Tongi BSCIC)",
  "নারায়ণগঞ্জ হোসিয়ারি মার্কেট (Narayanganj)",
  "অন্যান্য পাইকারি মোকাম (Other)"
];

const FACTORY_CATEGORIES = [
  "Readymade Garments (RMG)",
  "Knitwear / Sweaters",
  "Leather & Leather Goods",
  "Jute & Jute Products",
  "Pharmaceuticals",
  "Ceramics & Tiles",
  "Electronics & Appliances",
  "Footwear",
  "Plastics & Packaging",
  "Agro Processing & Foods",
  "Handicrafts",
  "Furniture & Timber"
];

const FACTORY_CERTIFICATIONS = [
  "ISO 9001", "ISO 14001", "OEKO-TEX", "GOTS", "BSCI", 
  "WRAP", "SEDEX", "LEED", "Halal", "FDA", "BSTI"
];

const EXPORT_TARGET_COUNTRIES = [
  "USA", "UK", "Germany", "France", "Italy", "Spain", 
  "Canada", "Australia", "Japan", "UAE", "Saudi Arabia", "India", "Other"
];

const RURAL_HAT_DAYS = ["শনিবার", "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার"];

interface RegistrationWizardProps {
  defaultRole?: AccountType;
}

export default function RegistrationWizard({ defaultRole }: RegistrationWizardProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { registerUser, registerSeller, registerFactory } = useAuth();
  
  // Resolve role from props or query string
  const resolvedRole = useMemo<AccountType>(() => {
    if (defaultRole) return defaultRole;
    const qRole = (searchParams.get("role") || searchParams.get("type") || "").toLowerCase();
    if (qRole === "factory" || qRole === "factory_seller") return "factory_seller";
    if (qRole === "wholesale" || qRole === "wholesale_seller") return "wholesale_seller";
    if (qRole === "rural" || qRole === "rural_seller") return "rural_seller";
    if (qRole === "seller" || qRole === "retail" || qRole === "retail_seller") return "retail_seller";
    if (qRole === "rider" || qRole === "driver") return "rider";
    if (qRole === "service" || qRole === "service_provider") return "service_provider";
    if (qRole === "exporter") return "exporter";
    if (qRole === "importer") return "importer";
    return "buyer";
  }, [defaultRole, searchParams]);

  // If a specific role was passed in url or prop, start directly at step 1
  const initialStep = (defaultRole || searchParams.get("role") || searchParams.get("type")) ? 1 : 0;

  const [step, setStep] = useState(initialStep);
  const [accountType, setAccountType] = useState<AccountType>(resolvedRole);
  
  // Master unified form state
  const [form, setForm] = useState({
    // Step 1: Universal credentials
    fullName: "",
    phone: "",
    email: "",
    password: "",

    // Step 2: Role & Business information
    shopName: "",
    address: "",
    addressDetails: null as AddressDetails | null,
    category: "electronics",
    tradeLicenseNo: "",
    tinNumber: "",
    binNumber: "",
    
    // Factory details (merged from factory-register)
    factoryCategory: "Readymade Garments (RMG)",
    employees: "",
    established: "",
    productionCapacity: "",
    minOrderQty: "",
    exportCountries: ["USA", "UK", "Germany"],
    certifications: ["ISO 9001", "BSTI"],
    membershipBody: "BGMEA",
    
    // Wholesale details (merged from wholesale-register)
    wholesaleMarket: "ইসলামপুর (Islampur), ঢাকা",
    moq: "100",
    priceTier1Qty: "50-200 পিস",
    priceTier1Price: "",
    priceTier2Qty: "201-1000 পিস",
    priceTier2Price: "",
    sourceFactory: "",

    // Rural details (merged from rural-register)
    village: "",
    union: "",
    hatName: "",
    hatDay: "শনিবার",
    hatDay2: "মঙ্গলবার",
    ruralCategory: "কৃষি ও ফসল",

    // Exporter/Importer details
    ercNumber: "",
    ircNumber: "",
    preferredIncoterms: "FOB",

    // Rider details
    vehicleType: "bike" as "bike" | "bicycle" | "car" | "pickup" | "truck",
    vehiclePlate: "",
    drivingLicenseNo: "",

    // Services details
    serviceSpecialty: "",
    rateType: "fixed" as "fixed" | "hourly",
    rateAmount: "",

    // Universal Payout Settings
    payoutMethod: "bkash" as "bkash" | "nagad" | "rocket" | "bank",
    payoutNumber: "",
    bankName: "",
    bankBranch: "",
    accountName: "",
    accountNo: "",
    swiftCode: "",
    routingNo: "",

    // Step 3: Identity & Verification
    idType: "nid" as "nid" | "passport" | "trade_license",
    idNumber: "",
    idFile: null as string | null
  });

  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Update role if changed
  useEffect(() => {
    if (resolvedRole) {
      setAccountType(resolvedRole);
    }
  }, [resolvedRole]);

  const selectedTypeConfig = useMemo(() => {
    return ACCOUNT_TYPES.find(t => t.id === accountType) || ACCOUNT_TYPES[0];
  }, [accountType]);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleGroupFilter, setRoleGroupFilter] = useState<AccountTypeConfig['group'] | 'all'>('all');

  const filteredRoles = useMemo(() => {
    return ACCOUNT_TYPES.filter(type => {
      const matchesSearch = type.labelEn.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           type.labelBn.includes(searchTerm);
      const matchesGroup = roleGroupFilter === 'all' || type.group === roleGroupFilter;
      return matchesSearch && matchesGroup;
    });
  }, [searchTerm, roleGroupFilter]);

  const handleInput = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (key: 'exportCountries' | 'certifications', item: string) => {
    setForm(prev => {
      const arr = prev[key];
      const nextArr = arr.includes(item) 
        ? arr.filter(x => x !== item) 
        : [...arr, item];
      return { ...prev, [key]: nextArr };
    });
  };

  const handleAddressChange = (details: AddressDetails, isValid: boolean) => {
    const formatted = [details.area, details.upazila, details.district, details.division]
      .filter(Boolean)
      .join(', ');
    
    setForm(prev => ({
      ...prev,
      address: formatted,
      addressDetails: details
    }));
  };

  const handleNext = () => {
    // Step 1: Validation
    if (step === 1) {
      if (!form.fullName.trim()) {
        toast.error("অনুগ্রহ করে আপনার নাম লিখুন! / Please provide your full name!");
        return;
      }
      if (!form.phone.match(/^01[3-9]\d{8}$/)) {
        toast.error("সঠিক ১১ ডিজিটের বাংলাদেশী মোবাইল নম্বর দিন! (যেমন: 01712345678)");
        return;
      }
      if (form.password.length < 8) {
        toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে! / Password must be at least 8 characters!");
        return;
      }
    }

    // Step 2: Role-specific Business info Validation
    if (step === 2) {
      const isSellerGroup = selectedTypeConfig.group === 'seller';
      if (isSellerGroup && !form.shopName.trim()) {
        toast.error("প্রতিষ্ঠান বা দোকানের নাম লিখুন! / Business name is required!");
        return;
      }
      if (accountType === "exporter" && !form.ercNumber.trim()) {
        toast.error("ইআরসি (ERC) নম্বর দেওয়া আবশ্যক!");
        return;
      }
      if (accountType === "importer" && !form.ircNumber.trim()) {
        toast.error("আইআরসি (IRC) নম্বর দেওয়া আবশ্যক!");
        return;
      }
      if (accountType === "rider" && !form.vehiclePlate.trim()) {
        toast.error("গাড়ির নম্বর প্লেট প্রদান করুন (e.g. DHAKA-METRO-HA-XX-XXXX)!");
        return;
      }
    }

    setStep(s => s + 1);
  };

  const handleBack = () => setStep(s => Math.max(0, s - 1));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const filename = e.target.files[0].name;
      setTimeout(() => {
        setIsUploading(false);
        setForm(prev => ({ ...prev, idFile: filename }));
        toast.success("পরিচয়পত্র সফলভাবে স্ক্যান করা হয়েছে! / Document uploaded successfully!");
      }, 1000);
    }
  };

  const handleRegisterSubmit = async () => {
    if (selectedTypeConfig.securityRequired && !form.idFile && !form.idNumber) {
      toast.error("জাতীয় পরিচয়পত্র (NID) নম্বর বা ফাইল আপলোড করা আবশ্যক!");
      return;
    }

    setBusy(true);
    try {
      if (accountType === "buyer") {
        await registerUser({
          fullName: form.fullName,
          phone: form.phone,
          email: form.email || `${form.phone}@paikarmart.com`,
          verification: {
            status: form.idFile ? "pending" : "unverified",
            idType: form.idType,
            idNumber: form.idNumber,
            idDocumentUrl: form.idFile || undefined
          },
          password: form.password
        });
        toast.success("অভিনন্দন! ক্রেতা অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।");
        navigate("/verify-email");
      } else if (accountType === "factory_seller") {
        await registerFactory({
          fullName: form.fullName,
          phone: form.phone,
          email: form.email || `${form.phone}@paikarmart.com`,
          password: form.password,
          factory: {
            companyName: form.shopName || `${form.fullName} Manufacturing Ltd`,
            district: form.addressDetails?.district || "Dhaka",
            address: form.address,
            tradeLicenseNo: form.tradeLicenseNo,
            productCategories: [form.factoryCategory],
            exportCountries: form.exportCountries,
            certifications: form.certifications,
            employees: form.employees || "100+",
            established: form.established || "2020",
            minOrderQty: form.minOrderQty || "500",
            productionCapacity: form.productionCapacity || "50,000 pcs/month",
            membershipBody: form.membershipBody,
            verified: false,
            website: ""
          }
        });
        toast.success("ফ্যাক্টরি মার্চেন্ট নিবন্ধন সফল হয়েছে! স্বাগতম।");
        navigate("/verify-email");
      } else {
        // All other merchant, wholesale, rural, rider, services
        await registerSeller({
          fullName: form.fullName,
          phone: form.phone,
          email: form.email || `${form.phone}@paikarmart.com`,
          password: form.password,
          seller: {
            shopName: form.shopName || `${form.fullName}'s Enterprise`,
            type: accountType === "wholesale_seller" ? "wholesale" : accountType === "service_provider" ? "service" : "retail",
            subType: accountType,
            address: form.address,
            nidOrTradeLicense: form.tradeLicenseNo || form.idNumber,
            payoutMethod: {
              kind: form.payoutMethod === "bank" ? "bank" : "mobile",
              details: {
                method: form.payoutMethod,
                number: form.payoutNumber || form.phone,
                bankName: form.bankName,
                accountNo: form.accountNo
              }
            }
          },
          verification: {
            status: form.idFile ? "pending" : "unverified",
            idType: form.idType,
            idNumber: form.idNumber,
            idDocumentUrl: form.idFile || undefined,
            submittedAt: new Date().toISOString()
          }
        });

        toast.success(`${selectedTypeConfig.labelBn} হিসেবে নিবন্ধন সম্পন্ন হয়েছে!`);
        navigate("/verify-email");
      }
    } catch (err: any) {
      toast.error(err.message || "নিবন্ধনে সমস্যা হয়েছে! পুনরায় চেষ্টা করুন।");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-white flex items-center justify-center p-4 relative">
      {/* Background radial atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.08)_0,transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.06)_0,transparent_50%)] pointer-events-none" />

      <div className="w-full max-w-2xl bg-zinc-900/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative z-10 my-8">
        
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between gap-2 mb-8">
          {[
            { id: 0, label: "Role", bn: "ভূমিকা" },
            { id: 1, label: "Account", bn: "প্রোফাইল" },
            { id: 2, label: "Details", bn: "ব্যবসায়িক তথ্য" },
            { id: 3, label: "Verify", bn: "ভেরিফিকেশন" }
          ].map((s) => {
            const active = step === s.id;
            const completed = step > s.id;
            return (
              <div key={s.id} className="flex-1 flex flex-col gap-1.5">
                <div className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  completed ? "bg-cyan-500" : active ? "bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]" : "bg-white/10"
                )} />
                <span className={cn(
                  "text-[10px] font-bold text-center tracking-wider transition-colors",
                  active ? "text-cyan-400 font-extrabold" : completed ? "text-zinc-400" : "text-zinc-600"
                )}>
                  {s.bn}
                </span>
              </div>
            );
          })}
        </div>

        {/* STEP 0: SELECT ROLE */}
        {step === 0 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center space-y-1.5">
              <h1 className="text-2xl font-black text-white">পাইকারমার্ট-এ স্বাগতম</h1>
              <p className="text-xs text-zinc-400">আপনার ভূমিকা ও ব্যবসা নির্বাচন করে এগিয়ে যান (Choose your role)</p>
            </div>

            <div className="flex gap-2">
              <Input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="রোল সার্চ করুন..."
                className="bg-zinc-950 border-white/10 rounded-xl min-h-[40px] flex-1 text-sm"
              />
              <select
                value={roleGroupFilter}
                onChange={(e) => setRoleGroupFilter(e.target.value as any)}
                className="bg-zinc-950 border border-white/10 rounded-xl px-3 text-sm text-zinc-400 outline-none"
              >
                <option value="all">সব (All)</option>
                <option value="buyer">ক্রেতা (Buyer)</option>
                <option value="seller">বিক্রেতা (Seller)</option>
                <option value="logistics">লজিস্টিক (Logistics)</option>
                <option value="service">সার্ভিস (Service)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
              {filteredRoles.map((type) => {
                const Icon = type.icon;
                const isSelected = accountType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setAccountType(type.id)}
                    className={cn(
                      "flex flex-col text-left p-4 rounded-2xl transition-all border relative cursor-pointer group",
                      isSelected 
                        ? "bg-cyan-500/10 border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/50" 
                        : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/15"
                    )}
                  >
                    <div className="flex items-center justify-between w-full mb-2.5">
                      <div className={cn("p-2.5 rounded-xl shrink-0", type.bgColor, type.color)}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <TrustBadge level={type.expectedTrustLevel} interactive={false} size="sm" />
                    </div>
                    
                    <span className="text-white font-bold text-sm block mb-0.5">{type.labelBn}</span>
                    <span className="text-zinc-400 font-medium text-xs block mb-1.5">{type.labelEn}</span>
                    <p className="text-[11px] text-zinc-500 leading-snug line-clamp-2">{type.descBn}</p>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-white/10">
              <Button 
                onClick={handleNext} 
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-widest min-h-[48px] rounded-2xl transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                পরবর্তী ধাপ (Continue) <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <div className="text-center mt-4">
                <span className="text-xs text-zinc-500">ইতিমধ্যে অ্যাকাউন্ট আছে? </span>
                <Link to="/auth/login" className="text-cyan-400 hover:underline text-xs font-bold">লগইন করুন (Login)</Link>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: ACCOUNT DETAILS */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <button 
                  type="button"
                  onClick={handleBack} 
                  className="flex items-center text-xs font-bold text-zinc-400 hover:text-white mb-2 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" /> ভূমিকা পরিবর্তন করুন (Change Role)
                </button>
                <h2 className="text-xl font-black text-white">ব্যক্তিগত ও লগইন তথ্য (Account Setup)</h2>
                <p className="text-xs text-zinc-400">আপনার মোবাইল ও পাসওয়ার্ড দিয়ে অ্যাকাউন্ট সুরক্ষিত রাখুন</p>
              </div>
              <div className="text-right hidden sm:block">
                <span className="text-[10px] text-zinc-500 block uppercase font-bold">নির্বাচিত রোল</span>
                <span className="text-xs font-black text-cyan-400">{selectedTypeConfig.labelBn}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-zinc-300">পূর্ণ নাম / Full Name *</Label>
                <Input 
                  value={form.fullName} 
                  onChange={(e) => handleInput("fullName", e.target.value)} 
                  placeholder="আপনার নাম লিখুন (e.g. মোহাম্মাদ রহিম)" 
                  className="bg-zinc-950 border-white/10 rounded-xl min-h-[44px]"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-zinc-300">মোবাইল নম্বর / Mobile Number *</Label>
                <div className="relative">
                  <Input 
                    value={form.phone} 
                    onChange={(e) => handleInput("phone", e.target.value)} 
                    placeholder="017XXXXXXXX" 
                    maxLength={11}
                    className="bg-zinc-950 border-white/10 rounded-xl min-h-[44px] pl-3 text-sm font-mono tracking-wide"
                  />
                  {form.phone.match(/^01[3-9]\d{8}$/) && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                </div>
                <p className="text-[11px] text-zinc-500">১১ ডিজিটের সক্রিয় বাংলাদেশী ফোন নম্বর দিন (যাচাইকরণ কোড পাঠানো হবে)।</p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-zinc-300">ইমেইল ঠিকানা (ঐচ্ছিক) / Email Address</Label>
                <Input 
                  value={form.email} 
                  onChange={(e) => handleInput("email", e.target.value)} 
                  placeholder="name@business.com" 
                  className="bg-zinc-950 border-white/10 rounded-xl min-h-[44px]"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-zinc-300">পাসওয়ার্ড / Password *</Label>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"}
                    value={form.password} 
                    onChange={(e) => handleInput("password", e.target.value)} 
                    placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড" 
                    className="bg-zinc-950 border-white/10 rounded-xl min-h-[44px] pr-10"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleNext} 
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-widest min-h-[48px] rounded-2xl cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              পরবর্তী ধাপ (Continue) <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* STEP 2: ROLE & BUSINESS DETAILS (WITH BD ADDRESS SELECTOR) */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
            <div>
              <button 
                type="button"
                onClick={handleBack} 
                className="flex items-center text-xs font-bold text-zinc-400 hover:text-white mb-2 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> পেছনে যান (Back)
              </button>
              <h2 className="text-xl font-black text-white">
                {selectedTypeConfig.labelBn} — বিস্তারিত বিবরণ
              </h2>
              <p className="text-xs text-zinc-400">আপনার ব্যবসা বা সার্ভিসের সঠিক তথ্য ও ঠিকানা দিন</p>
            </div>

            <div className="space-y-5 max-h-[500px] overflow-y-auto pr-1">
              {/* Buyer Notice */}
              {accountType === "buyer" && (
                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-4 text-xs text-cyan-300 space-y-2">
                  <p className="font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    ক্রেতা প্রোফাইল সেটআপ
                  </p>
                  <p className="text-zinc-400 leading-relaxed">
                    আপনার প্রাথমিক ডেলিভারি ঠিকানা এখনই নির্বাচন করে রাখতে পারেন, যাতে চেকআউটের সময় অটো-ফিল হয়ে যায়।
                  </p>
                </div>
              )}

              {/* Business Name Field for Non-Buyers */}
              {selectedTypeConfig.group === 'seller' && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-zinc-300">
                    {accountType === 'factory_seller' ? 'কারখানা বা প্রস্তুতকারী কোম্পানির নাম *' : 
                     accountType === 'rural_seller' ? 'খামার বা গ্রামীণ দোকানের নাম *' : 
                     'দোকান বা ব্যবসা প্রতিষ্ঠানের নাম *'}
                  </Label>
                  <Input 
                    value={form.shopName} 
                    onChange={(e) => handleInput("shopName", e.target.value)} 
                    placeholder={accountType === 'factory_seller' ? "Ananta Garments & Textiles Ltd" : "রহমান এন্টারপ্রাইজ / স্টোর"} 
                    className="bg-zinc-950 border-white/10 rounded-xl min-h-[44px]"
                  />
                </div>
              )}

              {/* RETAIL SPECIFIC */}
              {accountType === "retail_seller" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-zinc-300">পণ্যের ক্যাটাগরি / Category</Label>
                    <select 
                      value={form.category}
                      onChange={(e) => handleInput("category", e.target.value)}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs outline-none focus:border-cyan-500"
                    >
                      <option value="electronics">ইলেকট্রনিক্স ও গ্যাজেটস</option>
                      <option value="fashion">ফ্যাশন ও তৈরি পোশাক</option>
                      <option value="grocery">মুদি ও নিত্যপ্রয়োজনীয় পণ্য</option>
                      <option value="pharmacy">ফার্মেসি ও স্বাস্থ্য সুরক্ষা</option>
                      <option value="home">হোম ও লাইফস্টাইল</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-zinc-300">ট্রেড লাইসেন্স নং (ঐচ্ছিক)</Label>
                    <Input 
                      value={form.tradeLicenseNo} 
                      onChange={(e) => handleInput("tradeLicenseNo", e.target.value)} 
                      placeholder="TR-XXXXXXXX" 
                      className="bg-zinc-950 border-white/10 rounded-xl min-h-[44px]"
                    />
                  </div>
                </div>
              )}

              {/* WHOLESALE SPECIFIC (Merged from wholesale-register) */}
              {accountType === "wholesale_seller" && (
                <div className="space-y-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
                    <Boxes className="w-4 h-4" /> পাইকারি মার্কেট ও বাল্ক মূল্য কাঠামো
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-zinc-300">পাইকারি মোকাম / পাইকারি বাজার</Label>
                      <select 
                        value={form.wholesaleMarket}
                        onChange={(e) => handleInput("wholesaleMarket", e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs outline-none focus:border-indigo-500"
                      >
                        {WHOLESALE_HUBS.map(hub => <option key={hub} value={hub}>{hub}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-zinc-300">MOQ (ন্যূনতম অর্ডার কোয়ান্টিটি)</Label>
                      <Input 
                        value={form.moq} 
                        onChange={(e) => handleInput("moq", e.target.value)} 
                        placeholder="যেমন: ৫০ পিস / ১০ ডজন" 
                        className="bg-zinc-950 border-white/10 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-zinc-400">ট্রেড লাইসেন্স নম্বর</Label>
                      <Input 
                        value={form.tradeLicenseNo} 
                        onChange={(e) => handleInput("tradeLicenseNo", e.target.value)} 
                        placeholder="TR-XXXXXX" 
                        className="bg-zinc-950 border-white/10 rounded-xl text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-zinc-400">টিআইএন নম্বর (TIN)</Label>
                      <Input 
                        value={form.tinNumber} 
                        onChange={(e) => handleInput("tinNumber", e.target.value)} 
                        placeholder="TIN-XXXXXX" 
                        className="bg-zinc-950 border-white/10 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* FACTORY SPECIFIC (Merged from factory-register) */}
              {accountType === "factory_seller" && (
                <div className="space-y-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                    <Factory className="w-4 h-4" /> কারখানা সক্ষমতা ও সার্টিফিকেশন
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-zinc-300">ইন্ডাস্ট্রি খাত / Sector</Label>
                      <select 
                        value={form.factoryCategory}
                        onChange={(e) => handleInput("factoryCategory", e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs outline-none focus:border-rose-500"
                      >
                        {FACTORY_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-zinc-300">মাসিক উৎপাদন ক্ষমতা</Label>
                      <Input 
                        value={form.productionCapacity} 
                        onChange={(e) => handleInput("productionCapacity", e.target.value)} 
                        placeholder="যেমন: ১,০০,০০০ পিস / ৫০ টন" 
                        className="bg-zinc-950 border-white/10 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Label className="text-xs font-bold text-zinc-300">আন্তর্জাতিক সার্টিফিকেশনসমূহ (ক্লিক করে নির্বাচন করুন)</Label>
                    <div className="flex flex-wrap gap-1.5">
                      {FACTORY_CERTIFICATIONS.map(cert => {
                        const active = form.certifications.includes(cert);
                        return (
                          <button
                            key={cert}
                            type="button"
                            onClick={() => toggleArrayItem('certifications', cert)}
                            className={cn(
                              "px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer",
                              active ? "bg-rose-500/20 border-rose-500/50 text-rose-300" : "bg-zinc-950 border-white/10 text-zinc-400 hover:text-white"
                            )}
                          >
                            {cert}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-zinc-400">ট্রেড লাইসেন্স নং *</Label>
                      <Input 
                        value={form.tradeLicenseNo} 
                        onChange={(e) => handleInput("tradeLicenseNo", e.target.value)} 
                        placeholder="TR-XXXXXX" 
                        className="bg-zinc-950 border-white/10 rounded-xl text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-zinc-400">বিআইএন নম্বর (BIN)</Label>
                      <Input 
                        value={form.binNumber} 
                        onChange={(e) => handleInput("binNumber", e.target.value)} 
                        placeholder="BIN-XXXXXXXX" 
                        className="bg-zinc-950 border-white/10 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* RURAL / HAT SPECIFIC (Merged from rural-register) */}
              {accountType === "rural_seller" && (
                <div className="space-y-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
                    <Store className="w-4 h-4" /> গ্রামীণ খামার ও সাপ্তাহিক হাটের তথ্য
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-zinc-300">স্থানীয় হাটের নাম</Label>
                      <Input 
                        value={form.hatName} 
                        onChange={(e) => handleInput("hatName", e.target.value)} 
                        placeholder="যেমন: শিবগঞ্জ হাট / পোড়াদহ হাট" 
                        className="bg-zinc-950 border-white/10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-zinc-300">হাটের প্রধান দিন (বার)</Label>
                      <select 
                        value={form.hatDay}
                        onChange={(e) => handleInput("hatDay", e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs outline-none focus:border-teal-500"
                      >
                        {RURAL_HAT_DAYS.map(day => <option key={day} value={day}>{day}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-zinc-300">গ্রামের নাম</Label>
                      <Input 
                        value={form.village} 
                        onChange={(e) => handleInput("village", e.target.value)} 
                        placeholder="গ্রামের নাম লিখুন" 
                        className="bg-zinc-950 border-white/10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-zinc-300">ইউনিয়ন</Label>
                      <Input 
                        value={form.union} 
                        onChange={(e) => handleInput("union", e.target.value)} 
                        placeholder="ইউনিয়নের নাম" 
                        className="bg-zinc-950 border-white/10 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* EXPORTER & IMPORTER SPECIFIC */}
              {(accountType === "exporter" || accountType === "importer") && (
                <div className="space-y-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 text-xs font-bold text-violet-400">
                    <Plane className="w-4 h-4" /> আন্তর্জাতিক বাণিজ্য ও শিপিং
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-zinc-300">
                        {accountType === 'exporter' ? 'ERC নম্বর (রপ্তানি সনদ) *' : 'IRC নম্বর (আমদানি সনদ) *'}
                      </Label>
                      <Input 
                        value={accountType === 'exporter' ? form.ercNumber : form.ircNumber} 
                        onChange={(e) => handleInput(accountType === 'exporter' ? "ercNumber" : "ircNumber", e.target.value)} 
                        placeholder={accountType === 'exporter' ? "ERC-XXXXXX" : "IRC-XXXXXX"} 
                        className="bg-zinc-950 border-white/10 rounded-xl border-violet-500/30"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-zinc-300">ইনকোটার্মস (Incoterms)</Label>
                      <select 
                        value={form.preferredIncoterms}
                        onChange={(e) => handleInput("preferredIncoterms", e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs outline-none focus:border-violet-500"
                      >
                        <option value="FOB">FOB (Free on Board - চট্টগ্রাম/মোংলা)</option>
                        <option value="CIF">CIF (Cost, Insurance & Freight)</option>
                        <option value="EXW">EXW (Ex Works)</option>
                        <option value="CFR">CFR (Cost and Freight)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* RIDER SPECIFIC */}
              {accountType === "rider" && (
                <div className="space-y-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                    <Truck className="w-4 h-4" /> যানবাহন ও ড্রাইভিং লাইসেন্স
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-zinc-300">যানবাহনের ধরন</Label>
                      <select 
                        value={form.vehicleType}
                        onChange={(e) => handleInput("vehicleType", e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs outline-none focus:border-amber-500"
                      >
                        <option value="bike">মোটরসাইকেল (Motorcycle)</option>
                        <option value="bicycle">সাইকেল (Bicycle)</option>
                        <option value="car">প্রাইভেট কার / সিডান</option>
                        <option value="pickup">পিকআপ / ছোট ট্রাক</option>
                        <option value="truck">কাভার্ড ভ্যান / বড় ট্রাক</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-zinc-300">গাড়ির নম্বর প্লেট *</Label>
                      <Input 
                        value={form.vehiclePlate} 
                        onChange={(e) => handleInput("vehiclePlate", e.target.value)} 
                        placeholder="DHAKA-METRO-HA-11-2233" 
                        className="bg-zinc-950 border-white/10 rounded-xl font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SERVICES SPECIFIC */}
              {accountType === "service_provider" && (
                <div className="space-y-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
                    <Wrench className="w-4 h-4" /> সার্ভিস দক্ষতা ও রেট কাঠামো
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-zinc-300">দক্ষতার প্রধান ক্ষেত্র</Label>
                      <Input 
                        value={form.serviceSpecialty} 
                        onChange={(e) => handleInput("serviceSpecialty", e.target.value)} 
                        placeholder="যেমন: এসি মেরামত, ইলেকট্রিশিয়ান, প্লাম্বিং" 
                        className="bg-zinc-950 border-white/10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-zinc-300">সার্ভিস ফি মডেল</Label>
                      <select 
                        value={form.rateType}
                        onChange={(e) => handleInput("rateType", e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs outline-none focus:border-purple-500"
                      >
                        <option value="fixed">ফিক্সড রেট (কাজ অনুযায়ী)</option>
                        <option value="hourly">ঘণ্টাভিত্তিক (৳/ঘণ্টা)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* UNIVERSAL BANGLADESH ADDRESS SELECTOR */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    {selectedTypeConfig.group === 'seller' ? 'ব্যবসা বা কারখানার ভৌগোলিক অবস্থান *' : 'বর্তমান ঠিকানা ও এলাকা *'}
                  </Label>
                  <span className="text-[10px] text-zinc-500">বিভাগ ➔ জেলা ➔ উপজেলা</span>
                </div>
                
                <div className="bg-zinc-950/60 p-4 rounded-2xl border border-white/10">
                  <BDAddressSelector 
                    initialValue={{
                      fullName: form.fullName,
                      phone: form.phone
                    }}
                    onChange={handleAddressChange}
                  />
                </div>
              </div>

              {/* PAYOUT ACCOUNT SETUP FOR MONETIZED ROLES */}
              {accountType !== "buyer" && (
                <div className="space-y-3 pt-2">
                  <Label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    টাকা গ্রহণের মাধ্যম (Payout Method)
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleInput("payoutMethod", "bkash")}
                      className={cn(
                        "p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer",
                        form.payoutMethod === "bkash" 
                          ? "bg-[#e2136e]/20 border-[#e2136e] text-white ring-1 ring-[#e2136e]" 
                          : "bg-zinc-950 border-white/5 text-zinc-400 hover:text-white"
                      )}
                    >
                      <span className="w-3 h-3 rounded-full bg-[#e2136e]" />
                      বিকাশ (bKash)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInput("payoutMethod", "nagad")}
                      className={cn(
                        "p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer",
                        form.payoutMethod === "nagad" 
                          ? "bg-[#f37021]/20 border-[#f37021] text-white ring-1 ring-[#f37021]" 
                          : "bg-zinc-950 border-white/5 text-zinc-400 hover:text-white"
                      )}
                    >
                      <span className="w-3 h-3 rounded-full bg-[#f37021]" />
                      নগদ (Nagad)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInput("payoutMethod", "bank")}
                      className={cn(
                        "p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer",
                        form.payoutMethod === "bank" 
                          ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400" 
                          : "bg-zinc-950 border-white/5 text-zinc-400 hover:text-white"
                      )}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      ব্যাংক অ্যাকাউন্ট
                    </button>
                  </div>

                  {form.payoutMethod === "bank" ? (
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <Input 
                        value={form.bankName} 
                        onChange={(e) => handleInput("bankName", e.target.value)} 
                        placeholder="ব্যাংকের নাম (e.g. BRAC Bank)" 
                        className="bg-zinc-950 border-white/10 rounded-xl text-xs"
                      />
                      <Input 
                        value={form.accountNo} 
                        onChange={(e) => handleInput("accountNo", e.target.value)} 
                        placeholder="হিসাব নম্বর (Account Number)" 
                        className="bg-zinc-950 border-white/10 rounded-xl text-xs font-mono"
                      />
                    </div>
                  ) : (
                    <Input 
                      value={form.payoutNumber} 
                      onChange={(e) => handleInput("payoutNumber", e.target.value)} 
                      placeholder={`${form.payoutMethod === 'bkash' ? 'বিকাশ' : 'নগদ'} পার্সোনাল/মার্চেন্ট নম্বর (01XXXXXXXXX)`} 
                      maxLength={11}
                      className="bg-zinc-950 border-white/10 rounded-xl text-xs font-mono"
                    />
                  )}
                </div>
              )}
            </div>

            <Button 
              onClick={handleNext} 
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-widest min-h-[48px] rounded-2xl cursor-pointer shadow-lg shadow-cyan-500/20 mt-4"
            >
              পরবর্তী ধাপ (Continue) <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* STEP 3: IDENTITY & SECURITY VERIFICATION */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
            <div>
              <button 
                type="button"
                onClick={handleBack} 
                className="flex items-center text-xs font-bold text-zinc-400 hover:text-white mb-2 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> পেছনে যান (Back)
              </button>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-white">পরিচয়পত্র ও সিকিউরিটি যাচাই</h2>
                  <p className="text-xs text-zinc-400">আপনার ট্রাস্ট লেভেল নিশ্চিত করতে প্রয়োজনীয় তথ্য দিন</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">প্রত্যাশিত ব্যাজ</span>
                  <TrustBadge level={selectedTypeConfig.expectedTrustLevel} size="md" />
                </div>
              </div>
            </div>

            {selectedTypeConfig.securityRequired ? (
              <div className="flex gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 items-start">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
                <p className="leading-relaxed">
                  পাইকারমার্ট প্ল্যাটফর্মে নিরাপত্তা ও আর্থিক সুরক্ষার স্বার্থে {selectedTypeConfig.labelBn} হিসেবে জাতীয় পরিচয়পত্র (NID) অথবা সংশ্লিষ্ট সনদ প্রদান করা বাধ্যতামূলক।
                </p>
              </div>
            ) : (
              <div className="flex gap-3 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 items-start">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-cyan-400" />
                <p className="leading-relaxed">
                  ক্রেতা বা রিটেইল অ্যাকাউন্টের ক্ষেত্রে এখনই NID প্রদান ঐচ্ছিক। তবে পরবর্তীতে ৫০,০০০ টাকার বেশি লেনদেনের জন্য এটি প্রয়োজন হবে।
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "nid", label: "জাতীয় পরিচয়পত্র (NID)" },
                  { id: "passport", label: "পাসপোর্ট (Passport)" },
                  { id: "trade_license", label: "ট্রেড লাইসেন্স" }
                ].map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => handleInput("idType", doc.id)}
                    className={cn(
                      "p-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer",
                      form.idType === doc.id 
                        ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400 ring-1 ring-cyan-500/30" 
                        : "bg-zinc-950 border-white/5 text-zinc-400 hover:text-white"
                    )}
                  >
                    {doc.label}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-zinc-300">সনদ বা পরিচয়পত্র নম্বর / ID Number *</Label>
                <Input 
                  value={form.idNumber} 
                  onChange={(e) => handleInput("idNumber", e.target.value)} 
                  placeholder={form.idType === "nid" ? "১০ বা ১৭ ডিজিটের এনআইডি নম্বর" : "ডকুমেন্ট আইডি নম্বর"} 
                  className="bg-zinc-950 border-white/10 rounded-xl min-h-[44px] font-mono text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-zinc-300">ডকুমেন্ট স্ক্যান বা ছবি আপলোড করুন</Label>
                <div className="border-2 border-dashed border-white/15 hover:border-cyan-500/40 rounded-2xl p-6 text-center relative cursor-pointer bg-zinc-950/40 transition-all">
                  <input 
                    type="file" 
                    onChange={handleFileUpload} 
                    accept="image/*,.pdf" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400">
                      <Upload className="w-5 h-5" />
                    </div>
                    {isUploading ? (
                      <span className="text-xs text-cyan-400 font-bold animate-pulse">ফাইল যাচাই ও আপলোড হচ্ছে...</span>
                    ) : form.idFile ? (
                      <div className="space-y-1">
                        <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 justify-center">
                          <Check className="w-4 h-4" /> {form.idFile}
                        </span>
                        <span className="text-[10px] text-zinc-500 block">অন্য ফাইল নির্বাচন করতে পুনরায় ক্লিক করুন</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <span className="text-xs text-zinc-300 font-bold block">ফাইল নির্বাচন করতে ক্লিক বা ড্রপ করুন</span>
                        <span className="text-[10px] text-zinc-500 block">JPG, PNG বা PDF ফরম্যাট (সর্বোচ্চ 10MB)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleRegisterSubmit} 
              disabled={busy}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-widest min-h-[50px] rounded-2xl cursor-pointer shadow-xl shadow-cyan-500/25 relative transition-all"
            >
              {busy ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>অ্যাকাউন্ট তৈরি হচ্ছে... অনুগ্রহ করে অপেক্ষা করুন</span>
                </div>
              ) : (
                "নিবন্ধন সম্পন্ন করুন (Complete Registration)"
              )}
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}
