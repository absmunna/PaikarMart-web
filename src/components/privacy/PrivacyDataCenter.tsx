import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  Trash2, 
  Edit3, 
  Download, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  Database, 
  Building2, 
  Package, 
  Video, 
  Briefcase,
  X,
  Upload,
  RefreshCw,
  Info
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { privacyService, PrivacySettings } from "../../services/privacyService";
import { collection, query, where, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { uploadService } from "../../services/uploadService";

export const PrivacyDataCenter: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const userId = user?.id || user?.uid || "guest-user";

  const [activeTab, setActiveTab] = useState<"privacy" | "my_content" | "kyc" | "export">("privacy");
  const [settings, setSettings] = useState<PrivacySettings>({
    showPhoneNumber: true,
    showEmailAddress: false,
    allowMarketingEmails: true,
    dataProcessingConsent: true,
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // User items state for editing/deletion
  const [userProducts, setUserProducts] = useState<any[]>([]);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [userVaultFiles, setUserVaultFiles] = useState<any[]>([]);
  const [userServices, setUserServices] = useState<any[]>([]);
  const [kycDocs, setKycDocs] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Edit Item Modal State
  const [editingItem, setEditingItem] = useState<{ type: string; item: any } | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // Deletion Confirm Modal State
  const [deletingAccountId, setDeletingAccountId] = useState(false);
  const [confirmDeleteText, setConfirmDeleteText] = useState("");

  // KYC Upload state
  const [kycDocType, setKycDocType] = useState("NID");
  const [kycDocNum, setKycDocNum] = useState("");
  const [dbidNum, setDbidNum] = useState("");
  const [kycFile, setKycFile] = useState<File | null>(null);
  const [uploadingKyc, setUploadingKyc] = useState(false);

  useEffect(() => {
    if (!isOpen || !user) return;

    // Load privacy settings
    privacyService.getPrivacySettings(userId).then(setSettings);

    // Listen to products
    const qProd = query(collection(db, "products"), where("sellerId", "==", userId));
    const unsubProd = onSnapshot(qProd, (snap) => {
      setUserProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    // Listen to posts/reels
    const qPost = query(collection(db, "posts"), where("sellerId", "==", userId));
    const unsubPost = onSnapshot(qPost, (snap) => {
      setUserPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    // Listen to vault files
    const qVault = query(collection(db, "client_vault_files"), where("userId", "==", userId));
    const unsubVault = onSnapshot(qVault, (snap) => {
      setUserVaultFiles(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    // Listen to services
    const qServ = query(collection(db, "services"), where("providerId", "==", userId));
    const unsubServ = onSnapshot(qServ, (snap) => {
      setUserServices(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    // Listen to KYC docs
    const qKyc = query(collection(db, "kyc_documents"), where("userId", "==", userId));
    const unsubKyc = onSnapshot(qKyc, (snap) => {
      setKycDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoadingData(false);
    });

    return () => {
      unsubProd();
      unsubPost();
      unsubVault();
      unsubServ();
      unsubKyc();
    };
  }, [isOpen, userId, user]);

  if (!isOpen) return null;

  const handlePrivacyToggle = async (key: keyof PrivacySettings) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    setSavingSettings(true);
    await privacyService.updatePrivacySettings(userId, updated);
    setSavingSettings(false);
    setSuccessMsg("প্রাইভেসি পছন্দ সংরক্ষণ করা হয়েছে (Privacy settings updated)");
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  const handleDeleteItem = async (collectionName: string, id: string) => {
    if (confirm("আপনি কি নিশ্চিত যে আপনি এই ডাটাটি স্থায়ীভাবে মুছে ফেলতে চান?")) {
      try {
        await deleteDoc(doc(db, collectionName, id));
        setSuccessMsg("ডাটা সফলভাবে ডিলিট করা হয়েছে।");
        setTimeout(() => setSuccessMsg(""), 2500);
      } catch (err: any) {
        alert("ডিলিট করতে ব্যর্থ হয়েছে: " + err.message);
      }
    }
  };

  const handleOpenEdit = (type: string, item: any) => {
    setEditingItem({ type, item });
    setEditTitle(item.title || item.name || item.content || "");
    setEditPrice(item.price ? String(item.price).replace(/[^0-9.]/g, "") : "");
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    setSavingEdit(true);
    try {
      const { type, item } = editingItem;
      const coll = type === "product" ? "products" : type === "post" ? "posts" : type === "service" ? "services" : "client_vault_files";
      
      const updatePayload: any = {};
      if (type === "product") {
        updatePayload.title = editTitle;
        if (editPrice) updatePayload.price = parseFloat(editPrice);
      } else if (type === "post") {
        updatePayload.content = editTitle;
        if (editPrice) updatePayload.price = `৳ ${editPrice}`;
      } else if (type === "service") {
        updatePayload.title = editTitle;
        if (editPrice) updatePayload.rate = parseFloat(editPrice);
      } else {
        updatePayload.name = editTitle;
      }

      await updateDoc(doc(db, coll, item.id), updatePayload);
      setEditingItem(null);
      setSuccessMsg("তথ্য আপডেট সম্পন্ন হয়েছে!");
      setTimeout(() => setSuccessMsg(""), 2500);
    } catch (err: any) {
      alert("আপডেট করতে ব্যর্থ হয়েছে: " + err.message);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleKycUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kycFile) {
      alert("অনুগ্রহ করে ট্রেড লাইসেন্স বা NID ফাইলের স্ক্যান কপি ফাইল নির্বাচন করুন।");
      return;
    }

    setUploadingKyc(true);
    try {
      await uploadService.uploadContent(
        kycFile,
        "document",
        {
          title: `KYC_${kycDocType}_${kycDocNum || 'Doc'}`,
          description: `DBID: ${dbidNum || 'N/A'}`
        }
      );
      setKycFile(null);
      setKycDocNum("");
      setDbidNum("");
      setSuccessMsg("গোপনীয় ট্রেড লাইসেন্স / KYC ডকুমেন্ট এনক্রিপ্টেড ফায়ারবেস স্টোরেজে আপলোড করা হয়েছে!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (e: any) {
      alert("KYC আপলোড ব্যর্থ হয়েছে: " + e.message);
    } finally {
      setUploadingKyc(false);
    }
  };

  const handleExportData = async () => {
    await privacyService.exportAllUserData(userId);
    setSuccessMsg("আপনার সমস্থ ডাটা সুরক্ষিত JSON ব্যাকআপ ফাইল হিসেবে ডাউনলোড হয়েছে!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleDeleteAccountFinal = async () => {
    if (confirmDeleteText !== "DELETE") {
      alert("নিশ্চিত করতে অনুগ্রহ করে 'DELETE' কথাটি নিখুঁতভাবে লিখুন।");
      return;
    }

    try {
      await privacyService.deleteAccountAndAllData(userId);
      alert("আপনার সমস্ত ফায়ারবেস ডাটা ও একাউন্ট সফলভাবে ডিলিট করা হয়েছে।");
      window.location.reload();
    } catch (e: any) {
      alert("ডিলিট করতে সমস্যা হয়েছে: " + e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#FF7A00]/10 text-[#FF7A00]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                ডাটা প্রাইভেসি, ম্যানেজমেন্ট ও ব্যাকআপ সেন্টার
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  BD E-Commerce Law 2021 Compliant
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                ফায়ারবেস এনক্রিপ্টেড ডাটাবেস ও আন্তর্জাতিক তথ্য সুরক্ষা নীতিমালানুগ
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-white/10 bg-black/40 px-4 pt-3 gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("privacy")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
              activeTab === "privacy"
                ? "border-[#FF7A00] text-[#FF7A00] bg-white/5"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Lock className="w-4 h-4" />
            প্রাইভেসি সেটিং (Privacy Settings)
          </button>

          <button
            onClick={() => setActiveTab("my_content")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
              activeTab === "my_content"
                ? "border-[#FF7A00] text-[#FF7A00] bg-white/5"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Database className="w-4 h-4" />
            আমার কন্টেন্ট এডিট/ডিলিট ({userProducts.length + userPosts.length + userServices.length})
          </button>

          <button
            onClick={() => setActiveTab("kyc")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
              activeTab === "kyc"
                ? "border-amber-400 text-amber-400 bg-white/5"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Building2 className="w-4 h-4" />
            গোপনীয় KYC ও ট্রেড লাইসেন্স
          </button>

          <button
            onClick={() => setActiveTab("export")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
              activeTab === "export"
                ? "border-emerald-400 text-emerald-400 bg-white/5"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Download className="w-4 h-4" />
            ডাটা এক্সপোর্ট ও একাউন্ট ডিলিট
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {successMsg && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              {successMsg}
            </div>
          )}

          {/* TAB 1: PRIVACY SETTINGS */}
          {activeTab === "privacy" && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#FF7A00]" />
                  গোপনীয়তা ও তথ্য নিয়ন্ত্রণ নীতি
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  বাংলাদেশ ই-কমার্স পরিচালনা নির্দেশিকা ২০২১ এবং ভোক্তা অধিকার আইনের অধীনে আপনার ব্যক্তিগত তথ্য সম্পূর্ণ আপনার নিয়ন্ত্রণে থাকবে। আপনি যে কোনো সময় আপনার ফোন নম্বর, ইমেইল ও মারকেটিং ডাটা প্রসেসিং নিয়ন্ত্রণ করতে পারেন।
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-950 border border-white/10">
                  <div>
                    <h5 className="text-xs font-bold text-white">ফোন নম্বর সর্বসাধারণের জন্য প্রদর্শন</h5>
                    <p className="text-[11px] text-zinc-400">প্রোফাইল ও লিস্টিং এ মোবাইল নম্বর দৃশ্যমান রাখা</p>
                  </div>
                  <button
                    onClick={() => handlePrivacyToggle("showPhoneNumber")}
                    className={`p-2 rounded-xl transition-all ${
                      settings.showPhoneNumber ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    {settings.showPhoneNumber ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-950 border border-white/10">
                  <div>
                    <h5 className="text-xs font-bold text-white">ইমেইল এড্রেস গোপন রাখা</h5>
                    <p className="text-[11px] text-zinc-400">পাবলিক প্রোফাইলে ব্যক্তিগত ইমেইল হাইড করা</p>
                  </div>
                  <button
                    onClick={() => handlePrivacyToggle("showEmailAddress")}
                    className={`p-2 rounded-xl transition-all ${
                      settings.showEmailAddress ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    {settings.showEmailAddress ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-950 border border-white/10">
                  <div>
                    <h5 className="text-xs font-bold text-white">অফার ও আপডেট নোটিফিকেশন</h5>
                    <p className="text-[11px] text-zinc-400">ইকমার্স ডিসকাউন্ট এবং গুরুত্বপূর্ণ আপডেট ইমেইল গ্রহণ</p>
                  </div>
                  <button
                    onClick={() => handlePrivacyToggle("allowMarketingEmails")}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      settings.allowMarketingEmails ? "bg-[#FF7A00] text-white" : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {settings.allowMarketingEmails ? "চালু (ON)" : "বন্ধ (OFF)"}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-950 border border-white/10">
                  <div>
                    <h5 className="text-xs font-bold text-white">ডাটা প্রসেসিং ও এনক্রিপশন সম্মতি</h5>
                    <p className="text-[11px] text-zinc-400">ফায়ারবেস ক্লাউড ও সিকিউর এনক্রিপশনে ডাটা ব্যাকআপ রাখার অনুমতি</p>
                  </div>
                  <button
                    onClick={() => handlePrivacyToggle("dataProcessingConsent")}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      settings.dataProcessingConsent ? "bg-emerald-500 text-white" : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {settings.dataProcessingConsent ? "সম্মতি প্রদত্ত" : "প্রত্যাহার"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY CONTENT EDIT & DELETE */}
          {activeTab === "my_content" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  ফায়ারবেসে সংরক্ষিত আপনার পণ্য ও মিডিয়া ফাইলসমূহ
                </h4>
                <span className="text-[11px] text-zinc-500">
                  ক্লিক করে এডিট বা স্থায়ীভাবে ডিলিট করুন
                </span>
              </div>

              {/* Products Section */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-[#FF7A00] flex items-center gap-1.5">
                  <Package className="w-4 h-4" /> পণ্য লিস্টিং ({userProducts.length})
                </h5>
                {userProducts.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic">কোন প্রোডাক্ট পাওয়া যায়নি।</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {userProducts.map((p) => (
                      <div key={p.id} className="p-3.5 rounded-2xl bg-zinc-950 border border-white/10 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                          {p.images?.[0] ? (
                            <img src={p.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover bg-zinc-800" />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 text-xs">No Img</div>
                          )}
                          <div className="truncate">
                            <h6 className="text-xs font-bold text-white truncate">{p.title}</h6>
                            <p className="text-[11px] text-[#FF7A00] font-bold">৳ {p.price}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleOpenEdit("product", p)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem("products", p.id)}
                            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Feed Posts & Reels Section */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <h5 className="text-xs font-bold text-pink-400 flex items-center gap-1.5">
                  <Video className="w-4 h-4" /> ফিড পোস্ট ও ভিডিও রিলস ({userPosts.length})
                </h5>
                {userPosts.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic">কোন পোস্ট বা রিল পাওয়া যায়নি।</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {userPosts.map((post) => (
                      <div key={post.id} className="p-3.5 rounded-2xl bg-zinc-950 border border-white/10 flex items-center justify-between gap-3">
                        <div className="truncate">
                          <h6 className="text-xs font-bold text-white truncate">{post.content || "Media Reel"}</h6>
                          <p className="text-[10px] text-zinc-400">Likes: {post.likesCount || 0} • Shares: {post.sharesCount || 0}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleOpenEdit("post", post)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem("posts", post.id)}
                            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CONFIDENTIAL KYC & TRADE LICENSE */}
          {activeTab === "kyc" && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  বাণিজ্যিক ট্রেড লাইসেন্স, NID ও DBID ডকুমেন্ট
                </h4>
                <p className="text-xs text-amber-200/80 leading-relaxed">
                  বাংলাদেশ ডিজিটাল কমার্স পরিচালনা নির্দেশিকা ২০২১ অনুযায়ী অনুমোদিত সেলার বা হোলসেল পাইকারি ব্যবসার জন্য ট্রেড লাইসেন্স ও DBID জমা দেওয়া বাধ্যতামূলক। এই নথিপত্র ফায়ারবেস সিকিউর এনক্রিপ্টেড ক্লাউডে সংরক্ষিত থাকবে এবং সাধারণ ইউজাররা তা দেখতে পারবে না।
                </p>
              </div>

              {/* Upload KYC Form */}
              <form onSubmit={handleKycUploadSubmit} className="p-5 rounded-2xl bg-zinc-950 border border-white/10 space-y-4">
                <h5 className="text-xs font-bold text-white">নতুন বাণিজ্যিক নথি স্ক্যান আপলোড করুন</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">নথির ধরণ</label>
                    <select
                      value={kycDocType}
                      onChange={(e) => setKycDocType(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      <option value="TradeLicense">ট্রেড লাইসেন্স (Trade License)</option>
                      <option value="NID">জাতীয় পরিচয়পত্র (NID)</option>
                      <option value="TIN">টিআইএন সার্টিফিকেট (TIN)</option>
                      <option value="BankDoc">ব্যাংক একাউন্ট স্টেটমেন্ট</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">নথি / লাইসেন্স নম্বর</label>
                    <input
                      type="text"
                      value={kycDocNum}
                      onChange={(e) => setKycDocNum(e.target.value)}
                      placeholder="TL-9823145"
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 mb-1">DBID নম্বর (যদি থাকে)</label>
                    <input
                      type="text"
                      value={dbidNum}
                      onChange={(e) => setDbidNum(e.target.value)}
                      placeholder="DBID-2026-1029"
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1">নথির ছবি / PDF ফাইল *</label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => e.target.files?.[0] && setKycFile(e.target.files[0])}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={uploadingKyc}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {uploadingKyc ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  এনক্রিপ্টেড ক্লাউডে জমা দিন
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: DATA EXPORT & RIGHT TO BE FORGOTTEN */}
          {activeTab === "export" && (
            <div className="space-y-6">
              {/* GDPR Export */}
              <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 space-y-3">
                <div className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-sm font-bold text-white">সম্পূর্ণ ইউজার ডাটা ডাইরেক্ট এক্সপোর্ট (Download My Data)</h4>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  আন্তর্জাতিক তথ্য অধিকার ও ডাটা প্রাইভেসি আইন অনুযায়ী আপনার সমস্ত প্রোফাইল তথ্য, প্রোডাক্ট লিস্টিং, অর্ডার হিস্টোরি, ভল্ট ফাইল ও একটি স্ট্রাকচার্ড JSON ফাইলে এক ক্লিকে পিসি বা মোবাইলে ডাউনলোড করুন।
                </p>
                <button
                  onClick={handleExportData}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-md"
                >
                  <Download className="w-4 h-4" />
                  JSON ডাটা ফাইল ডাউনলোড করুন
                </button>
              </div>

              {/* Right to be Forgotten / Delete Account */}
              <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  <h4 className="text-sm font-bold text-rose-300">একাউন্ট ও সমস্ত ডাটা পারমানেন্ট ডিলিট (Right to be Forgotten)</h4>
                </div>
                <p className="text-xs text-rose-200/80 leading-relaxed">
                  আপনি চাইলে ফায়ারবেস ডাটাবেস ও স্টোরেজ থেকে আপনার সমস্ত প্রোফাইল তথ্য, কন্টেন্ট, ছবি ও ফাইল চিরতরে মুছে ফেলতে পারেন। ডিলিট করার পর এই তথ্য আর ফেরত পাওয়া যাবে না।
                </p>

                {deletingAccountId ? (
                  <div className="p-4 rounded-xl bg-black/60 border border-rose-500/40 space-y-3 animate-fadeIn">
                    <p className="text-xs font-bold text-rose-300">
                      নিশ্চিত করতে নিচে বড় হাতের অক্ষরে <span className="underline font-mono">DELETE</span> টাইপ করুন:
                    </p>
                    <input
                      type="text"
                      value={confirmDeleteText}
                      onChange={(e) => setConfirmDeleteText(e.target.value)}
                      placeholder="DELETE"
                      className="w-full bg-zinc-900 border border-rose-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono tracking-widest text-center"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setDeletingAccountId(false)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white"
                      >
                        বাতিল
                      </button>
                      <button
                        onClick={handleDeleteAccountFinal}
                        className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md"
                      >
                        স্থায়ীভাবে মুছে ফেলুন
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeletingAccountId(true)}
                    className="px-5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-xs transition-all flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    একাউন্ট ও ডাটা ডিলিট প্রসেস শুরু করুন
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Edit Modal Popup */}
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="text-sm font-bold text-white">তথ্য সম্পাদন (Edit Item)</h4>
                <button onClick={() => setEditingItem(null)} className="text-zinc-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">শিরোনাম / ক্যাপশন</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                {editingItem.type !== "file" && (
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">মূল্য (৳)</label>
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white"
                >
                  বাতিল
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={savingEdit}
                  className="px-5 py-2 rounded-xl bg-[#FF7A00] text-white font-bold text-xs flex items-center gap-1.5"
                >
                  {savingEdit && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  সেভ করুন
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
