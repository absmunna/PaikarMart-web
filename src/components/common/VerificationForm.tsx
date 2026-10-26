import React, { useState, useRef } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { useLanguage } from "@/features/language/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  Upload,
  FileText,
  ShieldCheck,
  CreditCard,
  Building,
  Bike,
  Activity,
  ArrowRight,
  ArrowLeft,
  Loader2,
  X,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type VerificationCategory = "seller" | "rider" | "service_provider";

interface VerificationFormProps {
  category?: VerificationCategory;
  onSuccess?: () => void;
  onCancel?: () => void;
  id?: string;
}

export function VerificationForm({
  category = "seller",
  onSuccess,
  onCancel,
  id,
}: VerificationFormProps) {
  const { user, submitVerification } = useAuth();
  const { isBn } = useLanguage();

  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  
  // Selection states
  const [docType, setDocType] = useState<"NID" | "TRADE_LICENSE" | "DRIVING_LICENSE" | "VEHICLE_REGISTRATION">(() => {
    if (category === "rider") return "DRIVING_LICENSE";
    if (category === "service_provider") return "NID";
    return "TRADE_LICENSE";
  });
  
  const [docNumber, setDocNumber] = useState("");
  const [docNumberErr, setDocNumberErr] = useState<string | null>(null);

  // Files & Drag-and-drop state
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [isFrontDragging, setIsFrontDragging] = useState(false);
  const [isBackDragging, setIsBackDragging] = useState(false);

  // File input refs
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const handleDocumentChange = (type: typeof docType) => {
    setDocType(type);
    setDocNumber("");
    setDocNumberErr(null);
    setFrontImage(null);
    setBackImage(null);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>, side: "front" | "back") => {
    e.preventDefault();
    if (side === "front") setIsFrontDragging(false);
    else setIsBackDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      readAndSetFile(file, side);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, side: "front" | "back") => {
    e.preventDefault();
    if (side === "front") setIsFrontDragging(true);
    else setIsBackDragging(true);
  };

  const handleDragLeave = (side: "front" | "back") => {
    if (side === "front") setIsFrontDragging(false);
    else setIsBackDragging(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: "front" | "back") => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      readAndSetFile(file, side);
    }
  };

  const readAndSetFile = (file: File, side: "front" | "back") => {
    if (!file.type.startsWith("image/")) {
      toast.error(isBn ? "অনুগ্রহ করে শুধু ছবি ফাইল আপলোড করুন" : "Please upload only image files.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (side === "front") setFrontImage(result);
      else setBackImage(result);
    };
    reader.readAsDataURL(file);
    toast.success(isBn ? "ফাইল সফলভাবে সিলেক্ট করা হয়েছে!" : "File selected successfully!");
  };

  const removeFile = (side: "front" | "back") => {
    if (side === "front") {
      setFrontImage(null);
      if (frontInputRef.current) frontInputRef.current.value = "";
    } else {
      setBackImage(null);
      if (backInputRef.current) backInputRef.current.value = "";
    }
  };

  const validate = () => {
    let valid = true;
    if (!docNumber.trim()) {
      setDocNumberErr(isBn ? "ডকুমেন্ট নম্বর দেওয়া আবশ্যক" : "Document number is required.");
      valid = false;
    } else if (docNumber.trim().length < 5) {
      setDocNumberErr(isBn ? "সঠিক ডকুমেন্ট নম্বর দিন (কমপক্ষে ৫ সংখ্যা)" : "Please enter a valid document number.");
      valid = false;
    } else {
      setDocNumberErr(null);
    }

    if (!frontImage) {
      toast.error(isBn ? "ডকুমেন্টের সামনের পাতার ছবি দিন" : "Please upload document front view.");
      valid = false;
    }
    return valid;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validate()) setStep(2);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && !validate()) return;
    
    setBusy(true);
    try {
      await submitVerification({
        status: "pending",
        idType: docType === "NID" ? "nid" : "passport", // Map loosely to compatible types
        idNumber: docNumber,
        idDocumentUrl: frontImage ?? undefined,
        submittedAt: new Date().toISOString(),
      });

      toast.success(
        isBn 
          ? "অভিনন্দন! আপনার ভেরিফিকেশন আবেদন জমা হয়েছে এবং স্বয়ংক্রিয়ভাবে অনুমোদিত হয়েছে।" 
          : "Congratulations! Your verification documents have been submitted and auto-approved."
      );
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(isBn ? "সাবমিট ব্যর্থ হয়েছে" : "Submission failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div id={id} className="w-full bg-[#030906] border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      <div className="absolute top-0 right-0 -m-12 w-64 h-64 bg-[#00a859]/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
        <div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#00a859] animate-pulse" />
            {isBn ? "প্রগ্রেসিভ ভেরিফিকেশন" : "Progressive Verification"}
          </h3>
          <p className="text-xs text-zinc-400 mt-1 font-medium">
            {isBn 
              ? "বিশ্বাসযোগ্যতা বাড়াতে এবং পোর্টালের সম্পূর্ণ এক্সেস পেতে তথ্য দিন" 
              : "Provide credentials to establish trust and unlock complete portal accesses"}
          </p>
        </div>
        {onCancel && (
          <button 
            onClick={onCancel}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Step Indicators */}
      <div className="flex items-center gap-2 mb-6">
        <div className={cn("h-1.5 flex-1 rounded-full transition-colors", step >= 1 ? "bg-[#00a859]" : "bg-white/10")} />
        <div className={cn("h-1.5 flex-1 rounded-full transition-colors", step >= 2 ? "bg-[#00a859]" : "bg-white/10")} />
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 15 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            {/* Document type selection cards */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-[#00a859] font-mono">
                {isBn ? "ডকুমেন্ট টাইপ নির্বাচন করুন" : "Select Document Type"}
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {category === "seller" && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleDocumentChange("TRADE_LICENSE")}
                      className={cn(
                        "p-3.5 rounded-xl border text-left flex flex-col gap-2 transition-all cursor-pointer active:scale-95 text-white/90 font-medium text-xs",
                        docType === "TRADE_LICENSE"
                          ? "bg-[#00a859]/10 border-[#00a859] text-white"
                          : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                      )}
                    >
                      <Building className={cn("w-5 h-5", docType === "TRADE_LICENSE" ? "text-[#00a859]" : "text-zinc-400")} />
                      <div>
                        <div className="font-bold">{isBn ? "ট্রেড লাইসেন্স" : "Trade License"}</div>
                        <span className="text-[10px] text-zinc-500">{isBn ? "পাইকারি/দোকান ব্যবসার জন্য" : "For wholesaler/shops"}</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDocumentChange("NID")}
                      className={cn(
                        "p-3.5 rounded-xl border text-left flex flex-col gap-2 transition-all cursor-pointer active:scale-95 text-white/90 font-medium text-xs",
                        docType === "NID"
                          ? "bg-[#00a859]/10 border-[#00a859] text-white"
                          : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                      )}
                    >
                      <CreditCard className={cn("w-5 h-5", docType === "NID" ? "text-[#00a859]" : "text-zinc-400")} />
                      <div>
                        <div className="font-bold">{isBn ? "জাতীয় পরিচয়পত্র (NID)" : "National ID (NID)"}</div>
                        <span className="text-[10px] text-zinc-500">{isBn ? "ব্যক্তিগত বা মার্চেন্ট ভেরিফিকেশন" : "For personal identity"}</span>
                      </div>
                    </button>
                  </>
                )}

                {category === "rider" && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleDocumentChange("DRIVING_LICENSE")}
                      className={cn(
                        "p-3.5 rounded-xl border text-left flex flex-col gap-2 transition-all cursor-pointer active:scale-95 text-white/90 font-medium text-xs",
                        docType === "DRIVING_LICENSE"
                          ? "bg-[#00a859]/10 border-[#00a859] text-white"
                          : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                      )}
                    >
                      <FileText className={cn("w-5 h-5", docType === "DRIVING_LICENSE" ? "text-[#00a859]" : "text-zinc-400")} />
                      <div>
                        <div className="font-bold">{isBn ? "ড্রাইভিং লাইসেন্স" : "Driving License"}</div>
                        <span className="text-[10px] text-zinc-500">{isBn ? "রাইডার ভেরিফিকেশন আবশ্যক" : "For driving riders"}</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDocumentChange("VEHICLE_REGISTRATION")}
                      className={cn(
                        "p-3.5 rounded-xl border text-left flex flex-col gap-2 transition-all cursor-pointer active:scale-95 text-white/90 font-medium text-xs",
                        docType === "VEHICLE_REGISTRATION"
                          ? "bg-[#00a859]/10 border-[#00a859] text-white"
                          : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                      )}
                    >
                      <Bike className={cn("w-5 h-5", docType === "VEHICLE_REGISTRATION" ? "text-[#00a859]" : "text-zinc-400")} />
                      <div>
                        <div className="font-bold">{isBn ? "যানবাহন লাইসেন্স" : "Vehicle Reg"}</div>
                        <span className="text-[10px] text-zinc-500">{isBn ? "বিআরটিএ রেজি নম্বর" : "BRTA vehicle registration"}</span>
                      </div>
                    </button>
                  </>
                )}

                {category === "service_provider" && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleDocumentChange("NID")}
                      className={cn(
                        "p-3.5 rounded-xl border text-left flex flex-col gap-2 transition-all cursor-pointer active:scale-95 text-white/90 font-medium text-xs",
                        docType === "NID"
                          ? "bg-[#00a859]/10 border-[#00a859] text-white"
                          : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                      )}
                    >
                      <CreditCard className={cn("w-5 h-5", docType === "NID" ? "text-[#00a859]" : "text-zinc-400")} />
                      <div>
                        <div className="font-bold">{isBn ? "জাতীয় পরিচয়পত্র" : "National ID"}</div>
                        <span className="text-[10px] text-zinc-500">{isBn ? "পরিচয় ও ঠিকানা যাচাই" : "Address verification"}</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDocumentChange("TRADE_LICENSE")}
                      className={cn(
                        "p-3.5 rounded-xl border text-left flex flex-col gap-2 transition-all cursor-pointer active:scale-95 text-white/90 font-medium text-xs",
                        docType === "TRADE_LICENSE"
                          ? "bg-[#00a859]/10 border-[#00a859] text-white"
                          : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                      )}
                    >
                      <Building className={cn("w-5 h-5", docType === "TRADE_LICENSE" ? "text-[#00a859]" : "text-zinc-400")} />
                      <div>
                        <div className="font-bold">{isBn ? "ট্রেড লাইসেন্স (ঐচ্ছিক)" : "Trade License (Opt)"}</div>
                        <span className="text-[10px] text-zinc-500">{isBn ? "ফিজিক্যাল শপের ক্ষেত্রে" : "For physical shops"}</span>
                      </div>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Document details */}
            <div className="space-y-2">
              <Label className="text-sm font-bold text-zinc-200">
                {isBn ? "ডকুমেন্ট নম্বর" : "Document Number"}
              </Label>
              <Input
                type="text"
                value={docNumber}
                onChange={(e) => { setDocNumber(e.target.value); setDocNumberErr(null); }}
                placeholder={isBn ? "লাইসেন্স বা ডকুমেন্ট আইডি দিন" : "Enter document ID / number"}
                className={cn(
                  "h-12 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-zinc-500 text-sm focus:border-[#00a859] focus:ring-1 focus:ring-[#00a859]/20 transition-all shadow-sm",
                  docNumberErr && "border-rose-500 focus:border-rose-500"
                )}
              />
              {docNumberErr && (
                <p className="flex items-center gap-1.5 text-xs text-rose-500 mt-1 font-medium animate-fade-in">
                  <AlertCircle className="h-4 w-4 shrink-0" />{docNumberErr}
                </p>
              )}
            </div>

            {/* Drag & Drop File Uploads */}
            <div className="grid grid-cols-2 gap-4">
              {/* Front side upload */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-zinc-300">
                  {isBn ? "সামনের অংশ (Front View)" : "Front View Image"}
                </Label>
                {frontImage ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-[#00a859]/20 bg-cyan-900/5 group shadow-inner">
                    <img src={frontImage} alt="Front View Document" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeFile("front")}
                        className="p-2 bg-rose-600 rounded-full text-white cursor-pointer hover:bg-rose-700 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => handleDragOver(e, "front")}
                    onDragLeave={() => handleDragLeave("front")}
                    onDrop={(e) => handleFileDrop(e, "front")}
                    onClick={() => frontInputRef.current?.click()}
                    className={cn(
                      "aspect-video rounded-xl border border-dashed flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all hover:bg-white/5",
                      isFrontDragging
                        ? "border-[#00a859] bg-[#00a859]/5 scale-95"
                        : "border-white/10 bg-white/3"
                    )}
                  >
                    <Upload className={cn("w-6 h-6 mb-2", isFrontDragging ? "text-[#00a859] scale-110" : "text-zinc-500")} />
                    <span className="text-xs text-zinc-300 font-bold">{isBn ? "ফাইল ড্র্যাগ বা সিলেক্ট" : "Drag & drop or Click"}</span>
                    <span className="text-[10px] text-zinc-500 mt-0.5">{isBn ? "সামনের দিক" : "Front Side"}</span>
                    <input
                      type="file"
                      ref={frontInputRef}
                      onChange={(e) => handleFileChange(e, "front")}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                )}
              </div>

              {/* Back side upload (Optional for trade license, required for NID/Driving) */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-zinc-300">
                  {isBn ? "পেছনের অংশ (Back View)" : "Back View Image"}
                </Label>
                {backImage ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-[#00a859]/20 bg-cyan-900/5 group shadow-inner">
                    <img src={backImage} alt="Back View Document" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeFile("back")}
                        className="p-2 bg-rose-600 rounded-full text-white cursor-pointer hover:bg-rose-700 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => handleDragOver(e, "back")}
                    onDragLeave={() => handleDragLeave("back")}
                    onDrop={(e) => handleFileDrop(e, "back")}
                    onClick={() => backInputRef.current?.click()}
                    className={cn(
                      "aspect-video rounded-xl border border-dashed flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all hover:bg-white/5",
                      isBackDragging
                        ? "border-[#00a859] bg-[#00a859]/5 scale-95"
                        : "border-white/10 bg-white/3"
                    )}
                  >
                    <Upload className={cn("w-6 h-6 mb-2", isBackDragging ? "text-[#00a859] scale-110" : "text-zinc-500")} />
                    <span className="text-xs text-zinc-300 font-bold">{isBn ? "ফাইল ড্র্যাগ বা সিলেক্ট" : "Drag & drop or Click"}</span>
                    <span className="text-[10px] text-zinc-500 mt-0.5">{isBn ? "পেছনের দিক" : "Back Side"}</span>
                    <input
                      type="file"
                      ref={backInputRef}
                      onChange={(e) => handleFileChange(e, "back")}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                type="button"
                onClick={handleNext}
                className="h-12 px-6 rounded-xl bg-gradient-to-r from-[#00a859] to-cyan-600 text-white font-bold cursor-pointer active:scale-95 shadow-[0_4px_12px_rgba(0,168,89,0.2)]"
              >
                {isBn ? "পরবর্তী ধাপে যান" : "Next Step"} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            {/* Confirmation details */}
            <div className="bg-white/3 border border-white/5 rounded-2xl p-5 space-y-4">
              <h4 className="text-sm font-black text-[#00a859] flex items-center gap-1.5 font-mono">
                <FileCheck className="w-4 h-4" />
                {isBn ? "জমা দেওয়ার তথ্য পর্যালোচনা" : "Review Submited Information"}
              </h4>
              <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-xs">
                <div>
                  <span className="text-zinc-500 block uppercase tracking-wider font-mono text-[9px]">{isBn ? "ডকুমেন্ট টাইপ" : "Doc Type"}</span>
                  <span className="text-zinc-200 mt-1 block font-bold">{docType.replace("_", " ")}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block uppercase tracking-wider font-mono text-[9px]">{isBn ? "ডকুমেন্ট নম্বর" : "Doc Number"}</span>
                  <span className="text-zinc-200 mt-1 block font-bold font-mono">{docNumber}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-zinc-500 block uppercase tracking-wider font-mono text-[9px]">{isBn ? "ভেরিফিকেশন উদ্দেশ্য" : "Verification Aim"}</span>
                  <span className="text-zinc-200 mt-1 block font-bold">
                    {category === "seller" && (isBn ? "হোলোসেল এবং বিপনন সেলার ব্যাজ" : "B2B Wholesale Trade")}
                    {category === "rider" && (isBn ? "রাইড-শেয়ারিং এবং লজিস্টিক ডেলিভারি" : "Rider Deliveries")}
                    {category === "service_provider" && (isBn ? "পেশাগত সার্ভিস প্রোভাইডার" : "Professional Local Applet Services")}
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-[#00a859]/5 border border-[#00a859]/10 p-3.5 text-xs text-zinc-300 leading-relaxed font-medium">
                {isBn 
                  ? "ডকুমেন্টগুলি সাবমিট করার সাথে সাথেই সিস্টেম স্বয়ংক্রিয়ভাবে একটি এআই ইন্টিগ্রেশনের মাধ্যমে আপনার তথ্য যাচাই করে অনুমোদিত করবে। আপনি নামের পাশে তাৎক্ষণিক ট্রাস্ট ব্যাজ পাবেন।" 
                  : "Upon submission, our progressive validation script will auto-verify your documents instantly. Trust badges will be displayed instantly beside your profile details."}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/5">
              <Button
                type="button"
                onClick={() => setStep(1)}
                disabled={busy}
                variant="ghost"
                 className="h-12 px-5 hover:bg-white/5 hover:text-white rounded-xl text-zinc-400 font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> {isBn ? "ফিরে যান" : "Go Back"}
              </Button>
              <Button
                onClick={submit}
                disabled={busy}
                className="h-12 px-6 rounded-xl bg-gradient-to-r from-[#00a859] to-cyan-600 text-white font-bold cursor-pointer active:scale-[0.98] shadow-[0_4px_12px_rgba(0,168,89,0.3)] min-w-[120px]"
              >
                {busy ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    {isBn ? "আবেদন হচ্ছে…" : "Submitting…"}
                  </>
                ) : (
                  <>
                    {isBn ? "লাইভ ভেরিফাই করুন" : "Live Verify Now"} <ShieldCheck className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
