import React, { useState } from 'react';
import { ShieldCheck, Lock, Smartphone, Laptop, Key, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function PersonalSecurityTab() {
  const [showPassword, setShowPassword] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [is2fa, setIs2fa] = useState(true);

  const activeSessions = [
    { device: 'Windows 11 (Chrome Brower)', location: 'Dhaka, Bangladesh', ip: '103.230.104.12', active: true, icon: <Laptop className="w-5 h-5 text-cyan-400" /> },
    { device: 'iPhone 15 Pro Max (Safari)', location: 'Chittagong, Bangladesh', ip: '103.88.92.15', active: false, icon: <Smartphone className="w-5 h-5 text-zinc-400" /> },
    { device: 'Linux Ubuntu (Firefox Developer Edition)', location: 'Dhanmondi, Dhaka', ip: '192.168.1.107', active: false, icon: <Laptop className="w-5 h-5 text-zinc-400" /> }
  ];

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPass || !newPass) {
      toast.error('সব তথ্য পূরণ করুন');
      return;
    }
    toast.success('পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! / Password updated!');
    setOldPass('');
    setNewPass('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 text-left">
      {/* Security Form panel */}
      <div className="space-y-6">
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-black uppercase text-white border-b border-white/5 pb-2 flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>পাসওয়ার্ড পরিবর্তন করুন / Change Password</span>
          </h3>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-zinc-500">বর্তমান পাসওয়ার্ড / Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full p-3 bg-zinc-950/40 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-700 outline-none focus:border-cyan-500/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-zinc-500">নতুন পাসওয়ার্ড / New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="নতুন পাসওয়ার্ড দিন (Min 8 Chars)"
                className="w-full p-3 bg-zinc-950/40 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-700 outline-none focus:border-cyan-500/50"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer"
            >
              নিরাপদ পাসওয়ার্ড সেট করুন / Save Changes
            </button>
          </form>
        </div>

        {/* 2 Factor authentication setup */}
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-black uppercase text-white flex items-center gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-cyan-400" />
                <span>২-ধাপ ভেরিফিকেশন (2FA)</span>
              </h3>
              <p className="text-[10px] text-zinc-500 font-semibold leading-relaxed">
                প্রতিবার লগইন করার সময় ফোনে ওটিপি (SMS OTP) কোড পাঠানো হবে।
              </p>
            </div>
            <button
              onClick={() => {
                setIs2fa(!is2fa);
                toast.success(is2fa ? '২-ধাপ ভেরিফিকেশন নিষ্ক্রিয় করা হয়েছে!' : '২-ধাপ ভেরিফিকেশন সফলভাবে সক্রিয় করা হয়েছে!');
              }}
              className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                is2fa ? 'bg-cyan-500 flex justify-end' : 'bg-zinc-800 flex justify-start'
              }`}
            >
              <span className="w-4.5 h-4.5 rounded-full bg-black shadow-md block" />
            </button>
          </div>
        </div>
      </div>

      {/* Login Sessions and Devices */}
      <div className="space-y-6">
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-black uppercase text-white border-b border-white/5 pb-2">
            অ্যাক্টিভ সেশনস / Active Login Sessions
          </h3>

          <div className="space-y-4">
            {activeSessions.map((session, i) => (
              <div key={i} className="flex gap-3 items-start p-3 bg-zinc-950/40 rounded-xl border border-white/[0.02]">
                <div className="p-2.5 bg-white/[0.04] rounded-lg border border-white/5 shrink-0">
                  {session.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-black text-white truncate">{session.device}</h4>
                    {session.active && (
                      <span className="text-[8px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded-md font-bold uppercase animate-pulse shrink-0">
                        Active Now
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-500 font-bold mt-0.5">{session.location} • IP: {session.ip}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => toast.success('অন্যান্য সকল ডিভাইস থেকে সফলভাবে লগআউট করা হয়েছে!')}
            className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all cursor-pointer"
          >
            অন্যান্য সব ডিভাইস লগআউট / Sign Out All Other
          </button>
        </div>
      </div>
    </div>
  );
}
