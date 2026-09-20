import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Compass, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/features/language/LanguageContext';
import { Button } from '@/components/ui/button';

export default function PortalComingSoon() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isBn } = useLanguage();

  const getPortalName = () => {
    const path = location.pathname;
    if (path.includes('video') || path.includes('reels')) return isBn ? 'ভিডিও ও রিলস পোর্টাল' : 'Video & Reels Portal';
    if (path.includes('hotel')) return isBn ? 'হোটেল বুকিং পোর্টাল' : 'Hotel Booking Portal';
    if (path.includes('jobs')) return isBn ? 'চাকরি পোর্টাল' : 'Jobs & Careers Portal';
    if (path.includes('agriculture')) return isBn ? 'কৃষি বাজার পোর্টাল' : 'Agriculture Hub Portal';
    if (path.includes('real-estate')) return isBn ? 'রিয়েল এস্টেট পোর্টাল' : 'Real Estate Portal';
    if (path.includes('healthcare')) return isBn ? 'হেলথকেয়ার পোর্টাল' : 'Healthcare Hub';
    if (path.includes('education')) return isBn ? 'এডুকেশন পোর্টাল' : 'Education Hub';
    if (path.includes('finance')) return isBn ? 'ফিন্যান্স পোর্টাল' : 'Finance Portal';
    if (path.includes('events')) return isBn ? 'ইভেন্টস পোর্টাল' : 'Events Portal';
    if (path.includes('auto')) return isBn ? 'অটোমোবাইল পোর্টাল' : 'Automobile Portal';
    if (path.includes('electronics')) return isBn ? 'ইলেকট্রনিক্স পোর্টাল' : 'Electronics Portal';
    if (path.includes('fashion')) return isBn ? 'ফ্যাশন পোর্টাল' : 'Fashion Portal';
    if (path.includes('telecom')) return isBn ? 'টেলিকম পোর্টাল' : 'Telecom Portal';
    if (path.includes('workspace')) return isBn ? 'ওয়ার্কস্পেস পোর্টাল' : 'Workspace Portal';
    if (path.includes('dropship')) return isBn ? 'ড্রপশিপিং হাব' : 'Dropshipping Hub';
    if (path.includes('pk-store')) return isBn ? 'পিকে স্টোর' : 'PK Store';
    if (path.includes('news')) return isBn ? 'খবর ও সংবাদ' : 'News & Media';
    if (path.includes('factory')) return isBn ? 'ফ্যাক্টরি পোর্টাল' : 'Factory Portal';
    return isBn ? 'পাইকারমার্ট সুপার অ্যাপ সার্ভিস' : 'PaikarMart Super App Service';
  };

  return (
    <div className="min-h-screen bg-[#020604] pb-28 pt-20 px-6 flex flex-col items-center justify-center text-center select-none text-white max-w-[480px] mx-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 25 }}
        className="space-y-8"
      >
        {/* Floating animated icon */}
        <div className="relative mx-auto w-24 h-24 bg-zinc-950 border border-white/5 rounded-[2rem] flex items-center justify-center shadow-2xl">
          <div className="absolute inset-0 bg-cyan-500/10 blur-xl rounded-full animate-pulse" />
          <Compass className="w-10 h-10 text-cyan-400 animate-spin" style={{ animationDuration: '20s' }} />
        </div>

        <div className="space-y-3">
          <span className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-black text-[9px] uppercase tracking-[0.2em]">
            {isBn ? "প্রক্রিয়াধীন" : "UNDER DEVELOPMENT"}
          </span>
          <h1 className="text-xl font-black text-white tracking-tight leading-snug">
            {getPortalName()}
          </h1>
          <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest max-w-[300px] mx-auto leading-relaxed">
            {isBn 
              ? "এই পোর্টালটি বর্তমানে ডেভেলপমেন্ট পর্যায়ে রয়েছে। খুব শীঘ্রই এটি লাইভ হবে!" 
              : "This specialized portal is currently being integrated into our Bangladesh Super App ecosystem. Coming soon!"}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button 
            onClick={() => navigate(-1)} 
            className="h-12 w-full max-w-[200px] mx-auto rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white border border-white/5 font-black text-xs uppercase tracking-widest gap-2.5"
          >
            <ArrowLeft size={14} />
            {isBn ? "ফিরে যান" : "Go Back"}
          </Button>

          <Button 
            onClick={() => navigate('/')} 
            className="h-12 w-full max-w-[200px] mx-auto rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs uppercase tracking-widest gap-2.5"
          >
            {isBn ? "হোম পেজ" : "Main Feed"}
          </Button>
        </div>

        {/* Brand validation */}
        <div className="pt-8 border-t border-white/[0.04] flex items-center justify-center gap-2 text-[9px] font-black text-zinc-600 uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4 text-cyan-500/50" />
          <span>PaikarMart Trust Ledger Verified</span>
        </div>
      </motion.div>
    </div>
  );
}
