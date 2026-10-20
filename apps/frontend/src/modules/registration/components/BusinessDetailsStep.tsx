import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Sparkles, Boxes, Factory, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { RegistrationFormState, AccountTypeConfig, AccountType } from "../types";
import { BDAddressSelector, AddressDetails } from "@/components/common/BDAddressSelector";
import { WHOLESALE_HUBS, FACTORY_CATEGORIES, FACTORY_CERTIFICATIONS, RURAL_HAT_DAYS } from "../constants";

interface BusinessDetailsStepProps {
  form: RegistrationFormState;
  onInput: (key: keyof RegistrationFormState, value: any) => void;
  onNext: () => void;
  onBack: () => void;
  accountType: AccountType;
  selectedTypeConfig: AccountTypeConfig;
}

export const BusinessDetailsStep: React.FC<BusinessDetailsStepProps> = ({
  form,
  onInput,
  onNext,
  onBack,
  accountType,
  selectedTypeConfig
}) => {
  const handleAddressChange = (details: AddressDetails, isValid: boolean) => {
    const formatted = [details.area, details.upazila, details.district, details.division]
      .filter(Boolean)
      .join(', ');
    
    onInput("address", formatted);
    onInput("addressDetails", details);
  };

  const toggleArrayItem = (key: 'exportCountries' | 'certifications', item: string) => {
    const arr = form[key];
    const nextArr = arr.includes(item) 
      ? arr.filter(x => x !== item) 
      : [...arr, item];
    onInput(key, nextArr);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
      <div>
        <button 
          type="button"
          onClick={onBack} 
          className="flex items-center text-xs font-bold text-zinc-400 hover:text-white mb-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> পেছনে যান (Back)
        </button>
        <h2 className="text-xl font-black text-white">
          {selectedTypeConfig.labelBn} — বিস্তারিত বিবরণ
        </h2>
        <p className="text-xs text-zinc-400">আপনার ব্যবসা বা সার্ভিসের সঠিক তথ্য ও ঠিকানা দিন</p>
      </div>

      <div className="space-y-5 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
        {/* Buyer Notice */}
        {accountType === "buyer" && (
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 text-xs text-orange-300 space-y-2">
            <p className="font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-400" />
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
              onChange={(e) => onInput("shopName", e.target.value)} 
              placeholder={accountType === 'factory_seller' ? "Ananta Garments & Textiles Ltd" : "রহমান এন্টারপ্রাইজ / স্টোর"} 
              className="bg-zinc-950 border-white/10 rounded-xl min-h-[44px]"
            />
          </div>
        )}

        {/* BD Address Selector */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-zinc-300">
            {accountType === 'rider' ? 'ডেলিভারি এরিয়া / সার্ভিস জোন *' : 'ব্যবসায়িক ঠিকানা / লোকেশন *'}
          </Label>
          <BDAddressSelector 
            onAddressChange={handleAddressChange} 
          />
        </div>

        {/* RETAIL SPECIFIC */}
        {accountType === "retail_seller" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-zinc-300">পণ্যের ক্যাটাগরি / Category</Label>
              <select 
                value={form.category}
                onChange={(e) => onInput("category", e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs outline-none focus:border-orange-500"
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
                onChange={(e) => onInput("tradeLicenseNo", e.target.value)} 
                placeholder="TR-XXXXXXXX" 
                className="bg-zinc-950 border-white/10 rounded-xl min-h-[44px]"
              />
            </div>
          </div>
        )}

        {/* WHOLESALE SPECIFIC */}
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
                  onChange={(e) => onInput("wholesaleMarket", e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs outline-none focus:border-indigo-500"
                >
                  {WHOLESALE_HUBS.map(hub => <option key={hub} value={hub}>{hub}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-zinc-300">MOQ (ন্যূনতম অর্ডার কোয়ান্টিটি)</Label>
                <Input 
                  value={form.moq} 
                  onChange={(e) => onInput("moq", e.target.value)} 
                  placeholder="যেমন: ৫০ পিস / ১০ ডজন" 
                  className="bg-zinc-950 border-white/10 rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* FACTORY SPECIFIC */}
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
                  onChange={(e) => onInput("factoryCategory", e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs outline-none focus:border-rose-500"
                >
                  {FACTORY_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-zinc-300">মাসিক উৎপাদন ক্ষমতা</Label>
                <Input 
                  value={form.productionCapacity} 
                  onChange={(e) => onInput("productionCapacity", e.target.value)} 
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
          </div>
        )}

        {/* RIDER / LOGISTICS SPECIFIC */}
        {accountType === "rider" && (
          <div className="space-y-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-zinc-300">গাড়ির ধরন / Vehicle Type *</Label>
              <div className="grid grid-cols-3 gap-2">
                {['bike', 'bicycle', 'pickup', 'truck'].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => onInput("vehicleType", v)}
                    className={cn(
                      "p-2 rounded-xl border text-[10px] font-bold uppercase transition-all",
                      form.vehicleType === v ? "bg-orange-500 text-black border-orange-500" : "bg-zinc-950 border-white/10 text-zinc-400"
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-zinc-300">গাড়ির প্লেট নম্বর / Plate Number *</Label>
              <Input 
                value={form.vehiclePlate} 
                onChange={(e) => onInput("vehiclePlate", e.target.value)} 
                placeholder="DHAKA-METRO-HA-XX-XXXX" 
                className="bg-zinc-950 border-white/10 rounded-xl"
              />
            </div>
          </div>
        )}
      </div>

      <Button 
        onClick={onNext} 
        className="w-full bg-orange-500 hover:bg-orange-400 text-black font-black text-xs uppercase tracking-widest min-h-[48px] rounded-2xl cursor-pointer shadow-lg shadow-orange-500/20"
      >
        পরবর্তী ধাপ (Continue) <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};
