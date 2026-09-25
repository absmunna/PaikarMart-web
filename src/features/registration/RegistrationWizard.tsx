import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { useAuth } from "@/features/auth/AuthContext";
import { useKycStore } from "@/modules/admin/useKycStore";

import { RegistrationFormState, AccountType, AddressDetails } from "./types";
import { ACCOUNT_TYPES } from "./constants";
import { RoleSelectionStep } from "./components/RoleSelectionStep";
import { AccountInfoStep } from "./components/AccountInfoStep";
import { BusinessDetailsStep } from "./components/BusinessDetailsStep";
import { VerificationStep } from "./components/VerificationStep";

interface RegistrationWizardProps {
  defaultRole?: string;
}

export default function RegistrationWizard({ defaultRole }: RegistrationWizardProps = {}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { registerUser, registerSeller, registerFactory } = useAuth();
  
  // Resolve initial role from query string or prop
  const resolvedRole = useMemo<AccountType>(() => {
    const qRole = (defaultRole || searchParams.get("role") || searchParams.get("type") || "").toLowerCase();
    if (qRole === "factory" || qRole === "factory_seller") return "factory_seller";
    if (qRole === "wholesale" || qRole === "wholesale_seller") return "wholesale_seller";
    if (qRole === "rural" || qRole === "rural_seller") return "rural_seller";
    if (qRole === "seller" || qRole === "retail" || qRole === "retail_seller") return "retail_seller";
    if (qRole === "rider" || qRole === "driver") return "rider";
    if (qRole === "service" || qRole === "service_provider") return "service_provider";
    if (qRole === "exporter") return "exporter";
    if (qRole === "importer") return "importer";
    return "buyer";
  }, [searchParams]);

  const initialStep = (searchParams.get("role") || searchParams.get("type")) ? 1 : 0;

  const [step, setStep] = useState(initialStep);
  const [accountType, setAccountType] = useState<AccountType>(resolvedRole);
  
  const [form, setForm] = useState<RegistrationFormState>({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    shopName: "",
    address: "",
    addressDetails: null,
    category: "electronics",
    tradeLicenseNo: "",
    tinNumber: "",
    binNumber: "",
    factoryCategory: "Readymade Garments (RMG)",
    employees: "",
    established: "",
    productionCapacity: "",
    minOrderQty: "",
    exportCountries: ["USA", "UK", "Germany"],
    certifications: ["ISO 9001", "BSTI"],
    membershipBody: "BGMEA",
    wholesaleMarket: "ইসলামপুর (Islampur), ঢাকা",
    moq: "100",
    priceTier1Qty: "50-200 পিস",
    priceTier1Price: "",
    priceTier2Qty: "201-1000 পিস",
    priceTier2Price: "",
    sourceFactory: "",
    village: "",
    union: "",
    hatName: "",
    hatDay: "শনিবার",
    hatDay2: "মঙ্গলবার",
    ruralCategory: "কৃষি ও ফসল",
    ercNumber: "",
    ircNumber: "",
    preferredIncoterms: "FOB",
    vehicleType: "bike",
    vehiclePlate: "",
    drivingLicenseNo: "",
    serviceSpecialty: "",
    rateType: "fixed",
    rateAmount: "",
    payoutMethod: "bkash",
    payoutNumber: "",
    bankName: "",
    bankBranch: "",
    accountName: "",
    accountNo: "",
    swiftCode: "",
    routingNo: "",
    idType: "nid",
    idNumber: "",
    idFile: null
  });

  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (resolvedRole) {
      setAccountType(resolvedRole);
    }
  }, [resolvedRole]);

  const selectedTypeConfig = useMemo(() => {
    return ACCOUNT_TYPES.find(t => t.id === accountType) || ACCOUNT_TYPES[0];
  }, [accountType]);

  const handleInput = (key: keyof RegistrationFormState, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!form.fullName.trim()) {
        toast.error("অনুগ্রহ করে আপনার নাম লিখুন! / Please provide your full name!");
        return;
      }
      if (!form.phone.match(/^01[3-9]\d{8}$/)) {
        toast.error("সঠিক ১১ ডিজিটের বাংলাদেশী মোবাইল নম্বর দিন!");
        return;
      }
      if (form.password.length < 8) {
        toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে!");
        return;
      }
    }

    if (step === 2) {
      if (selectedTypeConfig.group === 'seller' && !form.shopName.trim()) {
        toast.error("প্রতিষ্ঠান বা দোকানের নাম লিখুন!");
        return;
      }
      if (accountType === "rider" && !form.vehiclePlate.trim()) {
        toast.error("গাড়ির নম্বর প্লেট প্রদান করুন!");
        return;
      }
    }

    setStep(s => s + 1);
  };

  const handleBack = () => setStep(s => Math.max(0, s - 1));

  const handleFinalSubmit = async () => {
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
        navigate("/");
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
        useKycStore.getState().submitKyc({
          vendorName: form.fullName,
          storeName: form.shopName || `${form.fullName} Manufacturing Ltd`,
          phone: form.phone,
          role: "factory_seller",
          tradeLicenseNo: form.tradeLicenseNo || "TL-PENDING",
          nidNumber: form.idNumber || "NID-PENDING",
          documentUrl: form.idFile || undefined,
        });
        toast.success("ফ্যাক্টরি মার্চেন্ট নিবন্ধন সফল হয়েছে!");
        navigate("/seller");
      } else {
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

        useKycStore.getState().submitKyc({
          vendorName: form.fullName,
          storeName: form.shopName || `${form.fullName}'s Enterprise`,
          phone: form.phone,
          role: accountType,
          tradeLicenseNo: form.tradeLicenseNo || "TL-PENDING",
          nidNumber: form.idNumber || "NID-PENDING",
          documentUrl: form.idFile || undefined,
        });

        toast.success(`${selectedTypeConfig.labelBn} হিসেবে নিবন্ধন সম্পন্ন হয়েছে!`);
        navigate("/seller");
      }
    } catch (err: any) {
      toast.error(err.message || "নিবন্ধনে সমস্যা হয়েছে! পুনরায় চেষ্টা করুন।");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-white flex items-center justify-center p-4 relative overflow-x-hidden">
      {/* Background radial atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.08)_0,transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.06)_0,transparent_50%)] pointer-events-none" />

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
                  completed ? "bg-orange-500" : active ? "bg-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.5)]" : "bg-white/10"
                )} />
                <span className={cn(
                  "text-[10px] font-bold text-center tracking-wider transition-colors",
                  active ? "text-orange-400 font-extrabold" : completed ? "text-zinc-400" : "text-zinc-600"
                )}>
                  {s.bn}
                </span>
              </div>
            );
          })}
        </div>

        {step === 0 && (
          <RoleSelectionStep 
            selectedRole={accountType} 
            onSelectRole={setAccountType} 
            onNext={handleNext} 
          />
        )}

        {step === 1 && (
          <AccountInfoStep 
            form={form} 
            onInput={handleInput} 
            onNext={handleNext} 
            onBack={handleBack} 
            selectedTypeConfig={selectedTypeConfig}
          />
        )}

        {step === 2 && (
          <BusinessDetailsStep 
            form={form} 
            onInput={handleInput} 
            onNext={handleNext} 
            onBack={handleBack} 
            accountType={accountType}
            selectedTypeConfig={selectedTypeConfig}
          />
        )}

        {step === 3 && (
          <VerificationStep 
            form={form} 
            onInput={handleInput} 
            onSubmit={handleFinalSubmit} 
            onBack={handleBack} 
            busy={busy}
            selectedTypeConfig={selectedTypeConfig}
          />
        )}
      </div>
    </div>
  );
}
