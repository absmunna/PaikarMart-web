import React, { useState } from 'react';
import { Shield, Check, Award, RefreshCw, Zap, Lock } from 'lucide-react';
import { useAuth } from '@/modules/auth';
import { AppRole, ROLE_HIERARCHY, getRoleGroup, ROLE_GROUP_META } from '@/config/roles.config';
import { toast } from 'sonner';

const QUICK_TEST_ROLES: { role: AppRole; labelBn: string; desc: string; icon: string }[] = [
  { role: 'buyer', labelBn: 'ক্রেতা (Buyer / Customer)', desc: 'সাধারণ কেনাকাটা, কার্ট ও ওয়ালেট ব্যবহার', icon: '🛒' },
  { role: 'seller', labelBn: 'সাধারণ বিক্রেতা (Seller)', desc: 'খুচরা ও সাধারণ শপ ম্যানেজমেন্ট', icon: '🛍️' },
  { role: 'retail_seller', labelBn: 'রিটেইল শপ ওনার (Retailer)', desc: 'লোকাল রিটেইল শপ ও ক্যাশিয়ার এক্সেস', icon: '🏪' },
  { role: 'wholesale_seller', labelBn: 'পাইকারি বিক্রেতা (Wholesale)', desc: 'বাল্ক অর্ডার ও পাইকারি ক্যাটালগ', icon: '📦' },
  { role: 'factory_seller', labelBn: 'ফ্যাক্টরি উৎপাদক (Manufacturer)', desc: 'মিল গেট প্রাইসিং ও প্রোডাকশন কোটেশন', icon: '🏭' },
  { role: 'exporter', labelBn: 'রপ্তানিকারক (Exporter)', desc: 'ইন্টারন্যাশনাল শিপমেন্ট ও এক্সপোর্ট এলসি', icon: '🌍' },
  { role: 'service_provider', labelBn: 'সার্ভিস প্রোভাইডার (Service Pro)', desc: 'সার্ভিস বুকিং ও প্রফেশনাল গিগ', icon: '🛠️' },
  { role: 'rider', labelBn: 'ডেলিভারি রাইডার (Rider)', desc: 'পার্সেল ডেলিভারি ও রুট ম্যানেজমেন্ট', icon: '🏍️' },
  { role: 'admin', labelBn: 'প্ল্যাটফর্ম এডমিন (Admin)', desc: 'সম্পূর্ণ সিস্টেম গভর্নেন্স ও কেওয়াইসি কন্ট্রোল', icon: '🛡️' }
];

export function RoleSwitcherWidget() {
  const { user, role, roleGroup, switchPersonaRole } = useAuth();
  const [isSwitching, setIsSwitching] = useState(false);

  const handleRoleChange = async (targetRole: AppRole) => {
    setIsSwitching(true);
    try {
      switchPersonaRole(targetRole);
      toast.success(`রোল সফলভাবে পরিবর্তন করা হয়েছে: ${targetRole.toUpperCase()} 🚀`);
    } catch (err) {
      toast.error("রোল পরিবর্তন করতে সমস্যা হয়েছে");
    } finally {
      setIsSwitching(false);
    }
  };

  const currentGroup = roleGroup || getRoleGroup(role);
  const groupMeta = ROLE_GROUP_META[currentGroup];

  return (
    <div className="bg-[#141624] border border-white/10 rounded-3xl p-5 shadow-xl space-y-4 text-left relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--pm-accent)]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[var(--pm-accent)]/20 text-[var(--pm-accent)]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white">রিয়েল রোল-বেসড অ্যাক্সেস কন্ট্রোল (RBAC)</h3>
            <p className="text-[11px] text-zinc-400">আপনার একাউন্টের পারমিশন ও রোল তাৎক্ষণিকভাবে পরিবর্তন করে টেস্ট করুন</p>
          </div>
        </div>
        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          সক্রিয়
        </span>
      </div>

      <div className="flex items-center justify-between bg-black/40 border border-white/5 p-3.5 rounded-2xl">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">👑</span>
          <div>
            <span className="text-[10px] uppercase font-black text-zinc-500 block">বর্তমান সিলেক্টেড রোল (Current Role)</span>
            <span className="text-sm font-black text-[var(--pm-accent)] uppercase tracking-wide">
              {role || 'buyer'} <span className="text-zinc-400 text-xs font-normal">({groupMeta?.labelBn || 'ক্রেতা'})</span>
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-black text-zinc-500 block">পারমিশন লেভেল</span>
          <span className="text-xs font-mono font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-lg">
            {user?.permissions?.length || 5} Active Scopes
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-zinc-300 block ml-1">রোল পরিবর্তন করুন (Instant Role Switcher):</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {QUICK_TEST_ROLES.map((item) => {
            const isCurrent = role === item.role;
            return (
              <button
                key={item.role}
                type="button"
                disabled={isSwitching}
                onClick={() => handleRoleChange(item.role)}
                className={`flex flex-col text-left p-3 rounded-2xl border transition-all cursor-pointer relative ${
                  isCurrent 
                    ? 'bg-[var(--pm-accent)]/15 border-[var(--pm-accent)] ring-1 ring-[var(--pm-accent)] shadow-lg shadow-[var(--pm-accent)]/10' 
                    : 'bg-black/30 border-white/5 hover:bg-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-lg">{item.icon}</span>
                  {isCurrent && (
                    <span className="w-4 h-4 rounded-full bg-[var(--pm-accent)] text-white flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                  )}
                </div>
                <span className="text-white font-bold text-xs truncate block">{item.labelBn.split(' ')[0]}</span>
                <span className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">{item.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
        <span>নোট: রোল পরিবর্তনের সাথে সাথেই আপনার ড্যাশবোর্ড ও মেনু অপশনগুলো স্বয়ংক্রিয়ভাবে আপডেট হয়ে যাবে।</span>
      </div>
    </div>
  );
}
