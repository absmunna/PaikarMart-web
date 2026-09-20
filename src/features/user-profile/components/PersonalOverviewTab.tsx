import React from 'react';
import { motion } from 'motion/react';
import { User, ShieldCheck, Wallet, ShoppingBag, Award, ArrowUpRight, HelpCircle, Store, MapPin, Shield } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useSeller } from '@/modules/seller';
import { RoleBadge } from '@/components/common/RoleBadge';
import { getRoleGroup, ROLE_GROUP_META } from '@/config/roles.config';
import { cn } from '@/lib/utils';

export function PersonalOverviewTab({ onNavigateTab }: { onNavigateTab?: (tab: string) => void }) {
  const { user, role, roleGroup, isCustomer, isVendor, isAdmin } = useAuth();
  const { isSeller } = useSeller();

  const currentGroup = roleGroup || getRoleGroup(role);
  const groupMeta = ROLE_GROUP_META[currentGroup];

  // 1. Profile Summary Card Data
  const profileSummary = {
    name: user?.name || user?.fullName || "Guest User",
    email: user?.email || "user@paikarmart.com.bd",
    joined: "Joined May 2026",
    level: `Role Group: ${groupMeta?.labelEn || 'Customer'}`,
    status: "Active / সক্রিয়"
  };

  // 2. Verification Status Card Data
  const verificationSummary = {
    nid: user?.verification?.status === 'verified' ? "Verified / সম্পন্ন ✅" : "Unverified / অনির্ধারিত ⏳",
    tradeLicense: user?.seller?.nidOrTradeLicense || user?.factory?.tradeLicenseNo ? "Available / যুক্ত 📄" : "Not Provided / নেই",
    phone: user?.phone ? "Verified / সংলগ্ন 📱" : "Not Linked / নেই",
    email: user?.email ? "Verified / সংলগ্ন 📧" : "Not Linked / নেই",
    documents: user?.verification?.idType ? `1 document (${user.verification.idType})` : "0 documents"
  };

  // 3. Wallet Summary Card Data
  const walletSummary = {
    cashBalance: "৳৮,৫৪০.০০",
    loyaltyCoins: "৩,২০০ কয়েন্স",
    withdrawable: "৳৫,৫০০.০০",
    bkashLinked: "Linked / সংযুক্ত  (017***56)",
    discountVal: "৳৩২০ ভাউচার লকড"
  };

  // 4. Order Summary Card Data
  const orderSummary = {
    total: 24,
    pending: 2,
    processing: 3,
    shipping: 1,
    completed: 18
  };

  // 5. Role Summary Card Data
  const roleSummary = {
    current: role || "Buyer",
    roleGroup: currentGroup,
    permissions: (user?.permissions && user.permissions.length > 0)
      ? user.permissions.slice(0, 5)
      : [
          "Buy wholesale products (পাইকারি ক্রয়)",
          "Publish buying requests (ডিমান্ড পোস্ট)",
          "Access standard checkout (চেকআউট)"
        ]
  };

  const cockpitCards = [
    {
      id: 'profile',
      titleEn: 'Profile Summary',
      titleBn: 'প্রোফাইল সামারি',
      icon: <User className="w-5 h-5 text-cyan-400" />,
      actionId: 'settings',
      actionLabel: 'Edit Profile',
      content: (
        <div className="space-y-2 pt-2 font-bold text-xs text-zinc-300">
          <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
            <span className="text-zinc-500 text-[9px] uppercase tracking-widest font-black">Profile Name / নাম:</span>
            <span className="text-white font-black">{profileSummary.name}</span>
          </div>
          <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
            <span className="text-zinc-500 text-[9px] uppercase tracking-widest font-black">Email / ইমেইল:</span>
            <span className="text-zinc-400 font-black max-w-[140px] truncate">{profileSummary.email}</span>
          </div>
          <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
            <span className="text-zinc-500 text-[9px] uppercase tracking-widest font-black">Joined / মেম্বারশিপ:</span>
            <span className="text-cyan-400 font-black">{profileSummary.joined}</span>
          </div>
          <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
            <span className="text-zinc-500 text-[9px] uppercase tracking-widest font-black">Status / লেভেল:</span>
            <span className="text-cyan-400 font-black">{profileSummary.level}</span>
          </div>
        </div>
      )
    },
    {
      id: 'verification',
      titleEn: 'Verification Status',
      titleBn: 'ভেরিফিকেশন স্ট্যাটাস',
      icon: <ShieldCheck className="w-5 h-5 text-cyan-400" />,
      actionId: 'verification',
      actionLabel: 'KYC Panel',
      content: (
        <div className="space-y-2 pt-2 font-bold text-xs text-zinc-300">
          <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
            <span className="text-zinc-500 text-[9px] uppercase tracking-widest font-black">NID Check / এনআইডি:</span>
            <span className="text-cyan-400 font-black">{verificationSummary.nid}</span>
          </div>
          <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
            <span className="text-zinc-500 text-[9px] uppercase tracking-widest font-black">License / লাইসেন্স:</span>
            <span className="text-amber-500 font-black">{verificationSummary.tradeLicense}</span>
          </div>
          <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
            <span className="text-zinc-500 text-[9px] uppercase tracking-widest font-black">Phone / ফোন:</span>
            <span className="text-cyan-400 font-black">{verificationSummary.phone}</span>
          </div>
          <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
            <span className="text-zinc-500 text-[9px] uppercase tracking-widest font-black">KYC Files / ফাইল:</span>
            <span className="text-cyan-400 font-black">{verificationSummary.documents}</span>
          </div>
        </div>
      )
    },
    {
      id: 'wallet',
      titleEn: 'Wallet Summary',
      titleBn: 'ওয়ালেট সামারি',
      icon: <Wallet className="w-5 h-5 text-cyan-400" />,
      actionId: 'wallet',
      actionLabel: 'Manage Wallet',
      content: (
        <div className="space-y-2 pt-2 font-bold text-xs text-zinc-300">
          <div className="flex justify-between items-center bg-cyan-500/10 border border-cyan-500/20 p-3 rounded-2xl">
            <span className="text-cyan-400 text-[9px] uppercase tracking-widest font-black">Balance / টাকা:</span>
            <span className="text-white font-black text-sm tabular-nums">{walletSummary.cashBalance}</span>
          </div>
          <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
            <span className="text-zinc-500 text-[9px] uppercase tracking-widest font-black">Coins / কয়েন:</span>
            <span className="text-cyan-400 font-black tabular-nums">{walletSummary.loyaltyCoins}</span>
          </div>
          <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
            <span className="text-zinc-500 text-[9px] uppercase tracking-widest font-black">Locked / ভাউচার:</span>
            <span className="text-zinc-300 font-black">{walletSummary.discountVal}</span>
          </div>
          <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
            <span className="text-zinc-500 text-[9px] uppercase tracking-widest font-black">bKash / বিকাশ:</span>
            <span className="text-[#e2136e] font-black">{walletSummary.bkashLinked}</span>
          </div>
        </div>
      )
    },
    {
      id: 'orders',
      titleEn: 'Order Summary',
      titleBn: 'অর্ডার সামারি',
      icon: <ShoppingBag className="w-5 h-5 text-cyan-400" />,
      actionId: 'orders',
      actionLabel: 'Track Orders',
      content: (
        <div className="space-y-2 pt-2 font-bold text-xs text-zinc-300">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/[0.02] border border-white/5 p-3 rounded-2xl text-center">
              <span className="text-zinc-500 text-[8px] uppercase tracking-widest font-black block mb-1">Pending</span>
              <span className="text-amber-500 font-black text-sm tabular-nums">{orderSummary.pending}</span>
            </div>
            <div className="bg-white/[0.02] border border-white/5 p-3 rounded-2xl text-center">
              <span className="text-zinc-500 text-[8px] uppercase tracking-widest font-black block mb-1">Processing</span>
              <span className="text-cyan-400 font-black text-sm tabular-nums">{orderSummary.processing}</span>
            </div>
            <div className="bg-white/[0.02] border border-white/5 p-3 rounded-2xl text-center">
              <span className="text-zinc-500 text-[8px] uppercase tracking-widest font-black block mb-1">Shipping</span>
              <span className="text-cyan-400 font-black text-sm tabular-nums">{orderSummary.shipping}</span>
            </div>
            <div className="bg-cyan-500/10 border border-cyan-500/20 p-3 rounded-2xl text-center">
              <span className="text-cyan-400 text-[8px] uppercase tracking-widest font-black block mb-1">Completed</span>
              <span className="text-white font-black text-sm tabular-nums">{orderSummary.completed}</span>
            </div>
          </div>
          <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
            <span className="text-zinc-500 text-[9px] uppercase tracking-widest font-black">Total History:</span>
            <span className="text-white font-black text-xs">{orderSummary.total} টি অর্ডার</span>
          </div>
        </div>
      )
    },
    {
      id: 'role',
      titleEn: 'Role Summary',
      titleBn: 'রোল সামারি',
      icon: <Award className="w-5 h-5 text-cyan-400" />,
      actionId: 'seller-central',
      actionLabel: 'Seller Space',
      content: (
        <div className="pt-2 space-y-2 text-[11px] font-bold text-zinc-300 text-left">
          <div className="flex justify-between items-center bg-cyan-500/10 border border-cyan-500/20 p-3 rounded-2xl mb-3">
            <span className="text-cyan-400 text-[9px] uppercase tracking-widest font-black">Current Role:</span>
            <RoleBadge role={user?.role || "buyer"} size="sm" />
          </div>
          <div className="flex justify-between items-center px-1 text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-2">
            <span>Role Group: <strong className="text-white font-black">{currentGroup.toUpperCase()}</strong></span>
            <span className="text-cyan-400 font-mono text-[9px]">{roleSummary.permissions.length} perms active</span>
          </div>
          {roleSummary.permissions.map((p, i) => (
            <div key={i} className="flex items-center gap-2.5 pl-2">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full shrink-0 shadow-glow shadow-cyan-400/50" />
              <span className="text-zinc-400 leading-snug text-[10px] font-bold uppercase tracking-tight truncate">{p}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'my-stores',
      titleEn: 'Store Management',
      titleBn: 'স্টোর ম্যানেজমেন্ট',
      icon: <Store className="w-5 h-5 text-cyan-400" />,
      actionId: 'my-stores',
      actionLabel: 'Manage Shop',
      content: (
        <div className="space-y-2 pt-2 font-bold text-xs text-zinc-300">
          <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
            <span className="text-zinc-500 text-[9px] uppercase tracking-widest font-black">Products / পণ্য:</span>
            <span className="text-white font-black tabular-nums">৪৫ টি</span>
          </div>
          <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
            <span className="text-zinc-500 text-[9px] uppercase tracking-widest font-black">Followers / ফলোয়ার:</span>
            <span className="text-cyan-400 font-black tabular-nums">১,৪২০ জন</span>
          </div>
          <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
            <span className="text-zinc-500 text-[9px] uppercase tracking-widest font-black">Rating / রেটিং:</span>
            <span className="text-amber-500 font-black text-xs">৪.৯ ★</span>
          </div>
          <div className="flex justify-between items-center bg-cyan-500/10 border border-cyan-500/20 p-3 rounded-2xl">
            <span className="text-cyan-400 text-[9px] uppercase tracking-widest font-black">Status / অবস্থা:</span>
            <span className="text-cyan-400 font-black text-[10px] tracking-widest">OPEN & VERIFIED</span>
          </div>
        </div>
      )
    },
    {
      id: 'addresses',
      titleEn: 'Address Book',
      titleBn: 'ঠিকানা বুক',
      icon: <MapPin className="w-5 h-5 text-cyan-400" />,
      actionId: 'addresses',
      actionLabel: 'Manage Addresses',
      content: (
        <div className="space-y-2 pt-2 font-bold text-xs text-zinc-300">
          <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
            <span className="text-zinc-500 text-[9px] uppercase tracking-widest font-black">Default / ডিফল্ট:</span>
            <span className="text-white font-black text-[11px] uppercase tracking-tight">Home (বাসা)</span>
          </div>
          <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
            <span className="text-zinc-500 text-[9px] uppercase tracking-widest font-black">Saved Areas / এলাকা:</span>
            <span className="text-cyan-400 font-black text-[10px] uppercase tracking-tight max-w-[140px] truncate text-right">Dhanmondi, Gulshan, Tejgaon</span>
          </div>
          <div className="flex justify-between items-center bg-cyan-500/10 border border-cyan-500/20 p-3 rounded-2xl">
            <span className="text-cyan-400 text-[9px] uppercase tracking-widest font-black">Ecosystem Role:</span>
            <span className="text-white font-black text-[10px] tracking-widest">BUYER & SELLER</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Cockpit Title header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h2 className="text-sm md:text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Award className="w-5 h-5 text-cyan-400" />
            <span>অ্যাকাউন্ট ওভারভিউ সামারি / Account Overview Cockpit</span>
          </h2>
          <p className="text-[10px] md:text-xs text-zinc-500 font-bold mt-1 uppercase tracking-tight">
            Your single unified console view for profile, wallets, orders and active verifications.
          </p>
        </div>
        <span className="hidden md:block text-[10px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-4 py-1.5 rounded-full font-black uppercase tracking-widest">
          Consolidated
        </span>
      </div>

      {/* Cockpit Dashboard Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {cockpitCards.map((card, idx) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="pm-glass-card p-5 flex flex-col justify-between min-h-[300px] group"
          >
            <div>
              {/* Card top banner */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white uppercase leading-none tracking-widest">
                      {card.titleEn}
                    </h3>
                    <span className="text-[9px] text-zinc-500 font-bold block mt-1.5 leading-none uppercase">
                      {card.titleBn}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic Body content */}
              <div>{card.content}</div>
            </div>

            {/* Click CTA to navigate to full page/tab */}
            <button
              onClick={() => onNavigateTab && onNavigateTab(card.actionId)}
              className="mt-6 w-full flex items-center justify-between px-4 py-3 bg-white/[0.03] group-hover:bg-cyan-500 text-[10px] font-black text-zinc-400 group-hover:text-black rounded-xl uppercase tracking-widest border border-white/5 group-hover:border-transparent transition-all active:scale-[0.98] cursor-pointer shadow-lg"
            >
              <span>{card.actionLabel}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </motion.div>
        ))}

        {/* Dynamic Help Center Widget to fill grid slot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="pm-glass-card p-6 flex flex-col justify-between min-h-[300px] border-cyan-500/20"
        >
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white uppercase leading-none tracking-widest">Secure Vault</h3>
                  <span className="text-[9px] text-cyan-400 font-black block mt-1.5 leading-none uppercase">শতভাগ সুরক্ষিত</span>
                </div>
              </div>
            </div>

            <p className="text-[12px] text-zinc-400 leading-relaxed font-bold uppercase tracking-tight">
              পাইকারমার্ট আপনার অ্যাকাউন্ট ডেটা, বিকাশ অ্যাকাউন্ট এবং পরিচয়পত্র শতভাগ এনক্রিপ্টেড পদ্ধতিতে সংরক্ষণ করে। সম্পূর্ণ নিয়ম মেনে লেনদেন সম্পন্ন করুন এবং যেকোনো প্রয়োজনে সাপোর্ট টিকিটে যোগাযোগ করুন।
            </p>
          </div>

          <button
            onClick={() => onNavigateTab && onNavigateTab('help-center')}
            className="w-full py-3.5 bg-cyan-500 text-black font-black text-[10px] uppercase tracking-widest rounded-2xl text-center active:scale-95 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer mt-6"
          >
            সার্ভিস গাইড / Platform FAQ
          </button>
        </motion.div>
      </div>
    </div>
  );
}
