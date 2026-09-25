import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { RegistrationFormState, AccountTypeConfig } from "../types";

interface AccountInfoStepProps {
  form: RegistrationFormState;
  onInput: (key: keyof RegistrationFormState, value: any) => void;
  onNext: () => void;
  onBack: () => void;
  selectedTypeConfig: AccountTypeConfig;
}

export const AccountInfoStep: React.FC<AccountInfoStepProps> = ({
  form,
  onInput,
  onNext,
  onBack,
  selectedTypeConfig
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
      <div className="flex items-center justify-between">
        <div>
          <button 
            type="button"
            onClick={onBack} 
            className="flex items-center text-xs font-bold text-zinc-400 hover:text-white mb-2 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> ভূমিকা পরিবর্তন করুন (Change Role)
          </button>
          <h2 className="text-xl font-black text-white">ব্যক্তিগত ও লগইন তথ্য (Account Setup)</h2>
          <p className="text-xs text-zinc-400">আপনার মোবাইল ও পাসওয়ার্ড দিয়ে অ্যাকাউন্ট সুরক্ষিত রাখুন</p>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-[10px] text-zinc-500 block uppercase font-bold">নির্বাচিত রোল</span>
          <span className="text-xs font-black text-orange-400">{selectedTypeConfig.labelBn}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-zinc-300">পূর্ণ নাম / Full Name *</Label>
          <Input 
            value={form.fullName} 
            onChange={(e) => onInput("fullName", e.target.value)} 
            placeholder="আপনার নাম লিখুন (e.g. মোহাম্মাদ রহিম)" 
            className="bg-zinc-950 border-white/10 rounded-xl min-h-[44px]"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-zinc-300">মোবাইল নম্বর / Mobile Number *</Label>
          <div className="relative">
            <Input 
              value={form.phone} 
              onChange={(e) => onInput("phone", e.target.value)} 
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
            onChange={(e) => onInput("email", e.target.value)} 
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
              onChange={(e) => onInput("password", e.target.value)} 
              placeholder="কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড" 
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
        onClick={onNext} 
        className="w-full bg-orange-500 hover:bg-orange-400 text-black font-black text-xs uppercase tracking-widest min-h-[48px] rounded-2xl cursor-pointer shadow-lg shadow-orange-500/20"
      >
        পরবর্তী ধাপ (Continue) <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};
