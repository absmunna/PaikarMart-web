import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Upload, ShieldCheck, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { RegistrationFormState, AccountTypeConfig } from "../types";

interface VerificationStepProps {
  form: RegistrationFormState;
  onInput: (key: keyof RegistrationFormState, value: any) => void;
  onSubmit: () => void;
  onBack: () => void;
  busy: boolean;
  selectedTypeConfig: AccountTypeConfig;
}

export const VerificationStep: React.FC<VerificationStepProps> = ({
  form,
  onInput,
  onSubmit,
  onBack,
  busy,
  selectedTypeConfig
}) => {
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const filename = e.target.files[0].name;
      setTimeout(() => {
        setIsUploading(false);
        onInput("idFile", filename);
      }, 1000);
    }
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
        <h2 className="text-xl font-black text-white">পরিচয় ও ভেরিফিকেশন (Identity Verification)</h2>
        <p className="text-xs text-zinc-400">নিরাপদ লেনদেনের জন্য আপনার জাতীয় পরিচয়পত্র যাচাই করুন</p>
      </div>

      <div className="space-y-5">
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 flex gap-4">
          <div className="p-3 rounded-xl bg-orange-500/20 h-fit">
            <ShieldCheck className="w-5 h-5 text-orange-400" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-orange-200">কেন ভেরিফিকেশন প্রয়োজন?</p>
            <p className="text-[10px] text-zinc-400 leading-relaxed">
              পাইকারমার্ট একটি বিজনেস নেটওয়ার্ক। এখানে বড় লেনদেন ও ট্রাস্ট বজায় রাখতে ভেরিফিকেশন আবশ্যিক। {selectedTypeConfig.securityRequired ? 'আপনার রোলের জন্য এটি বাধ্যতামূলক।' : 'এটি ঐচ্ছিক, তবে ভেরিফাইড হলে ক্রেতার আস্থা বাড়বে।'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onInput("idType", "nid")}
              className={cn(
                "p-3 rounded-xl border text-[10px] font-black uppercase transition-all",
                form.idType === "nid" ? "bg-orange-500/10 border-orange-500 text-orange-400" : "bg-zinc-950 border-white/10 text-zinc-500"
              )}
            >
              NID কার্ড
            </button>
            <button
              type="button"
              onClick={() => onInput("idType", "passport")}
              className={cn(
                "p-3 rounded-xl border text-[10px] font-black uppercase transition-all",
                form.idType === "passport" ? "bg-orange-500/10 border-orange-500 text-orange-400" : "bg-zinc-950 border-white/10 text-zinc-500"
              )}
            >
              পাসপোর্ট
            </button>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-zinc-300">পরিচয়পত্র নম্বর (NID/Passport No) *</Label>
            <Input 
              value={form.idNumber} 
              onChange={(e) => onInput("idNumber", e.target.value)} 
              placeholder="যেমন: ১২৩৪৫৬৭৮৯০" 
              className="bg-zinc-950 border-white/10 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-zinc-300">ডকুমেন্ট আপলোড (Front Side) *</Label>
            <label className={cn(
              "w-full h-24 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:bg-white/[0.02] hover:border-orange-500/30",
              form.idFile && "border-emerald-500/30 bg-emerald-500/5"
            )}>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              {isUploading ? (
                <Loader2 className="w-5 h-5 text-orange-400 animate-spin" />
              ) : form.idFile ? (
                <>
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">{form.idFile}</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 text-zinc-500" />
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">Click to upload photo</span>
                </>
              )}
            </label>
          </div>
        </div>
      </div>

      <Button 
        onClick={onSubmit} 
        disabled={busy}
        className="w-full bg-orange-500 hover:bg-orange-400 text-black font-black text-xs uppercase tracking-widest min-h-[48px] rounded-2xl cursor-pointer shadow-lg shadow-orange-500/20"
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        নিবন্ধন সম্পন্ন করুন (Complete Sign-Up)
      </Button>
    </div>
  );
};
