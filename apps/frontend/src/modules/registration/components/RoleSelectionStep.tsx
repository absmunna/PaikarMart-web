import React from 'react';
import { cn } from "@/lib/utils";
import { TrustBadge } from "@/components/common/TrustBadge";
import { ACCOUNT_TYPES } from "../constants";
import { AccountType } from "../types";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface RoleSelectionStepProps {
  selectedRole: AccountType;
  onSelectRole: (role: AccountType) => void;
  onNext: () => void;
}

export const RoleSelectionStep: React.FC<RoleSelectionStepProps> = ({
  selectedRole,
  onSelectRole,
  onNext,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl font-black text-white">পাইকারমার্ট-এ স্বাগতম</h1>
        <p className="text-xs text-zinc-400">আপনার ভূমিকা ও ব্যবসা নির্বাচন করে এগিয়ে যান (Choose your role)</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[440px] overflow-y-auto pr-1 no-scrollbar">
        {ACCOUNT_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedRole === type.id;
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onSelectRole(type.id)}
              className={cn(
                "flex flex-col text-left p-4 rounded-2xl transition-all border relative cursor-pointer group",
                isSelected 
                  ? "bg-orange-500/10 border-orange-500/60 shadow-[0_0_20px_rgba(249,115,22,0.15)] ring-1 ring-orange-500/50" 
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
          onClick={onNext} 
          className="w-full bg-orange-500 hover:bg-orange-400 text-black font-black text-xs uppercase tracking-widest min-h-[48px] rounded-2xl transition-all cursor-pointer shadow-lg shadow-orange-500/20"
        >
          পরবর্তী ধাপ (Continue) <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <div className="text-center mt-4">
          <span className="text-xs text-zinc-500">ইতিমধ্যে অ্যাকাউন্ট আছে? </span>
          <Link to="/auth/login" className="text-orange-400 hover:underline text-xs font-bold">লগইন করুন (Login)</Link>
        </div>
      </div>
    </div>
  );
};
