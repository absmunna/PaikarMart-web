import React from 'react';
import { ShieldCheck, Calendar, MapPin, Camera } from 'lucide-react';
import { UserProfile, UserRole } from '@/modules/profile/profileStore';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ProfileHeaderCardProps {
  profile: UserProfile;
  onOpenBehavior?: () => void;
}

const ROLE_CONFIG: Partial<Record<UserRole, { label: string; bg: string; text: string }>> = {
  buyer: { label: 'Member', bg: 'bg-white/[0.04]', text: 'text-zinc-400' },
  user: { label: 'Member', bg: 'bg-white/[0.04]', text: 'text-zinc-400' },
  seller: { label: 'Verified Seller', bg: 'bg-cyan-400/10', text: 'text-cyan-400' },
  retail_seller: { label: 'Retail Seller', bg: 'bg-blue-400/10', text: 'text-blue-400' },
  wholesale_seller: { label: 'Wholesale Expert', bg: 'bg-indigo-400/10', text: 'text-indigo-400' },
  business: { label: 'Enterprise', bg: 'bg-amber-400/10', text: 'text-amber-400' },
  admin: { label: 'System Admin', bg: 'bg-rose-500/10', text: 'text-rose-400' },
  service_provider: { label: 'Service Hub', bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
};

export const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({ profile, onOpenBehavior }) => {
  const role = ROLE_CONFIG[profile.role] || { label: 'Member', bg: 'bg-white/[0.04]', text: 'text-zinc-400' };

  return (
    <div className="relative py-8 flex flex-col items-center gap-4">
      <div className="flex flex-col items-center gap-3 w-full">
         <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden border border-white/10 shadow-xl relative z-10 bg-zinc-950">
               <img src={"avatarUrl" in profile ? (profile as any).avatarUrl : profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            </div>
            <button className="absolute bottom-0 right-0 z-20 p-2 rounded-full bg-zinc-800 border border-white/10 text-white hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer">
               <Camera className="w-4 h-4" />
            </button>
         </div>

         <div className="flex flex-col items-center text-center">
            <div className="flex flex-col items-center gap-2 mb-2">
               <h1 className="text-2xl font-black text-white uppercase tracking-tight">
                  {profile.name}
               </h1>
               <div className="flex items-center gap-2">
                 <button 
                    onClick={onOpenBehavior}
                    className={cn(
                       "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer bg-white/5 border border-white/10 hover:bg-white/10 transition-all",
                       role.text
                    )}
                 >
                    <span>{role.label}</span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase">Switch</span>
                 </button>
               </div>
            </div>

            <div className="flex items-center gap-3 text-zinc-400 text-[11px] font-bold uppercase tracking-wider mt-1">
               <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Since {format(new Date(profile.joinDate), 'MMM yyyy')}</span>
               </div>
               <span className="text-zinc-800">•</span>
               <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Dhaka, BD</span>
               </div>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
               {profile.verificationStatus === 'verified' && (
                 <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-black uppercase text-cyan-400 tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified</span>
                 </div>
               )}
               {profile.verificationLevels?.map((v: string) => (
                  <div key={v} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/5 text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                     <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
                     <span>{v}</span>
                  </div>
               ))}
            </div>
         </div>
      </div>
      
      <div className="flex flex-col items-center gap-2 mt-2">
         <button onClick={() => window.location.href = '/settings'} className="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-[11px] font-black text-white uppercase tracking-widest transition-all cursor-pointer">
             Edit Profile
         </button>
         <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">ID: {profile.id}</span>
      </div>
    </div>
  );
};
