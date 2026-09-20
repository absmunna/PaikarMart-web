import React, { useState } from 'react';
import { User, Mail, Phone, FileText, Camera, Loader2, Save } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useLanguage } from '@/features/language/LanguageContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function PersonalSettingsTab() {
  const { user } = useAuth();
  const { isBn } = useLanguage();
  
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: "I am a dedicated member of PaikarMart community.", // Mock bio
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setBusy(false);
    toast.success(isBn ? 'আপনার প্রোফাইল সফলভাবে আপডেট করা হয়েছে!' : 'Your profile has been updated successfully!');
  };

  const jamdaniPattern = "data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 0 L20 10 L10 20 L0 10 Z' fill='%2300a859' fill-opacity='0.05'/%3E%3C/svg%3E";

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in text-left">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-400" />
            {isBn ? "প্রোফাইল সেটিংস" : "Profile Settings"}
          </h2>
          <p className="text-xs text-zinc-500 font-semibold mt-1">
            {isBn ? "আপনার ব্যক্তিগত তথ্য এবং প্রোফাইল ডিটেইলস আপডেট করুন" : "Update your personal information and profile details"}
          </p>
        </div>
      </div>

      <div className="bg-[#040e08]/50 border border-white/5 rounded-3xl p-6 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none" 
          style={{ backgroundImage: `url("${jamdaniPattern}")` }} 
        />
        
        <form onSubmit={handleUpdateProfile} className="space-y-6 relative z-10">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4 pb-4 border-b border-white/5">
            <div className="relative group">
              <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-cyan-500/30 bg-[#050D08] shadow-2xl">
                <img
                  src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button 
                type="button"
                className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-cyan-500 text-black flex items-center justify-center border-4 border-[#010804] shadow-lg hover:scale-105 transition-all cursor-pointer"
                onClick={() => toast.info(isBn ? 'ছবি আপলোড ফিচারটি শিঘ্রই আসছে!' : 'Photo upload feature coming soon!')}
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">
              {isBn ? "প্রোফাইল ছবি পরিবর্তন করুন" : "Change Profile Photo"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-zinc-500 ml-1">
                {isBn ? "পুরো নাম" : "Full Name"}
              </Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input 
                  value={form.fullName}
                  onChange={e => setForm({...form, fullName: e.target.value})}
                  className="pl-11 h-12 bg-zinc-950/40 border-white/10 rounded-xl text-xs text-white focus:border-cyan-500/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-zinc-500 ml-1">
                {isBn ? "মোবাইল নম্বর" : "Phone Number"}
              </Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input 
                  value={form.phone}
                  readOnly
                  className="pl-11 h-12 bg-zinc-950/20 border-white/5 rounded-xl text-xs text-zinc-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-[10px] font-black uppercase text-zinc-500 ml-1">
                {isBn ? "ইমেল ঠিকানা" : "Email Address"}
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input 
                  type="email"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className="pl-11 h-12 bg-zinc-950/40 border-white/10 rounded-xl text-xs text-white focus:border-cyan-500/50"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-[10px] font-black uppercase text-zinc-500 ml-1">
                {isBn ? "আপনার সম্পর্কে (Bio)" : "About You (Bio)"}
              </Label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 w-4 h-4 text-zinc-500" />
                <Textarea 
                  value={form.bio}
                  onChange={e => setForm({...form, bio: e.target.value})}
                  className="pl-11 pt-3.5 bg-zinc-950/40 border-white/10 rounded-xl text-xs text-white focus:border-cyan-500/50 min-h-[100px]"
                  placeholder={isBn ? "আপনার সম্পর্কে কিছু লিখুন..." : "Tell us something about yourself..."}
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit"
            disabled={busy}
            className="w-full h-12 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-cyan-500/10 cursor-pointer"
          >
            {busy ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                {isBn ? "আপডেট হচ্ছে..." : "Updating..."}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isBn ? "পরিবর্তন সংরক্ষণ করুন" : "Save Changes"}
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
