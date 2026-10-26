import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, ShieldCheck } from 'lucide-react';
import { useAppStore } from '@/modules/app/appStore';

export default function ContactPage() {
  const { lang } = useAppStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !msg) return;
    setSubmitted(true);
    setName('');
    setEmail('');
    setMsg('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500/15 via-orange-600/5 to-transparent border border-white/5 rounded-3xl p-6 md:p-8 mb-8 shadow-xl">
        <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">Contact support</h1>
        <p className="text-xs md:text-sm text-zinc-400 max-w-lg leading-relaxed mt-2">
          {lang === 'EN' ? 'Any issues with wholesale shipping, Escrow balance release or shop listings? Drop us a prompt ticket!' : 'পাইকারি শিপিং, এসক্রো ওয়ালেট ব্যালেন্স উইথড্র বা শপ লিস্টিং নিয়ে যেকোনো সমস্যায় আমাদের টিকেট পাঠান।'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Core physical hubs info */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-6 rounded-2xl bg-zinc-900 border border-white/5 space-y-4 shadow-sm">
            <h3 className="text-sm font-black text-white uppercase tracking-widest text-orange-500">আমাদের মূল পয়েন্টসমূহ</h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-white">চকবাজার পাইকারি হাব (হকার্স মার্কেট)</h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">ঢাকা-১২১১, বাংলাদেশ</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-white">কেরানীগঞ্জ গার্মেন্টস কমপ্লেক্স</h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">মালিপাড়া, কেরানীগঞ্জ, ঢাকা</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-white">গ্রাহক হেল্পলাইন (সকাল ৯ - রাত ৮)</h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">+৮৮০ ০৯৬১২-৩৪৫৬৭৮</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-white">ইমেইল ঠিকানা</h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">support@paikarmart.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-orange-500/5 border border-orange-500/15 flex items-start gap-3.5">
            <ShieldCheck className="w-6 h-6 text-orange-500 shrink-0" />
            <div className="text-[11px] leading-relaxed text-zinc-400">
              <strong className="text-white">নিরাপদ এসক্রো এগ্রিমেন্ট:</strong> পাইকার মার্টে লেনদেনকৃত প্রতিটি টাকা ডেলিভারি নিশ্চিত হওয়ার আগ পর্যন্ত নিরাপদ ওয়ালেটে সংরক্ষিত থাকে।
            </div>
          </div>
        </div>

        {/* Drop ticket form */}
        <div className="lg:col-span-2 rounded-2xl bg-zinc-900 border border-white/10 p-6 md:p-8 shadow-lg relative">
          <h2 className="text-lg font-black text-white mb-2 uppercase">সরাসরি মেসেজ দিন</h2>
          <p className="text-xs text-zinc-400 mb-6">টিকেট খোলার সাথে সাথে আমাদের কাস্টমার কেয়ার টিম ২৪ ঘণ্টার মধ্যে যোগাযোগ করবে।</p>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-center text-xs text-cyan-400 font-bold">
              🎉 টিকেটটি সফলভাবে পাঠানো হয়েছে! আমাদের প্রতিনিধি শিগগিরই আপনার ইমেইলে যোগাযোগ করবেন।
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">আপনার নাম</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="উদা: মুনিম রহমান"
                    className="p-3 bg-black/30 border border-white/10 rounded-xl text-xs text-white focus:border-orange-500 outline-none"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">ইমেইল ঠিকানা</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="উদা: munim@gmail.com"
                    className="p-3 bg-black/30 border border-white/10 rounded-xl text-xs text-white focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">বিস্তারিত বিবরণ</label>
                <textarea
                  required
                  rows={5}
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="আপনার সমস্যা বা জিজ্ঞাসার বিশদ বিবরণ এখানে লিখুন..."
                  className="p-3 bg-black/30 border border-white/10 rounded-xl text-xs text-white focus:border-orange-500 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl text-xs font-black shadow-lg cursor-pointer hover:brightness-110"
              >
                <Send className="w-3.5 h-3.5" />
                মেসেজ পাঠান
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
