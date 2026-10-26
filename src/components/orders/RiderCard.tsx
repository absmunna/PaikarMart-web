import React from 'react';
import { Phone, MessageSquare, ShieldCheck, Bike, Award } from 'lucide-react';
import { useLanguage } from '@/features/language/LanguageContext';

export interface RiderCardProps {
  name: string;
  photo?: string;
  vehicleType?: string;
  licensePlate: string; // format: DHAKA-METRO-XXXX
  phone: string;
  rating?: number;
}

export const RiderCard: React.FC<RiderCardProps> = ({
  name,
  photo,
  vehicleType = 'Bike',
  licensePlate,
  phone,
  rating = 4.9
}) => {
  const { isBn } = useLanguage();
  const avatarUrl = photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=10b981&color=fff`;

  return (
    <div className="bg-[#030604] rounded-3xl border border-white/[0.04] p-5 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-3xl rounded-full -mr-12 -mt-12" />
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-[8px] font-black text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-lg uppercase tracking-widest flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          {isBn ? "ভেরিফাইড ডেলিভারি রাইডার" : "Verified Delivery Rider"}
        </span>
        <div className="flex items-center gap-1">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] font-black text-zinc-300">{rating}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden">
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white leading-tight mb-1">{name}</h4>
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1">
                <Bike className="w-3 h-3 text-cyan-400" /> {vehicleType} · {isBn ? "পাইকারফোর্স হিরো" : "PaikarForce Hero"}
              </span>
              <span className="text-[10px] text-cyan-400 font-black font-mono tracking-wider mt-0.5 bg-zinc-950 px-2 py-0.5 rounded border border-white/5 w-fit">
                {licensePlate}
              </span>
            </div>
          </div>
        </div>

        {/* Action button triggers call with min 44px target */}
        <div className="flex gap-2">
          <a 
            href={`tel:${phone}`}
            className="w-11 h-11 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg shadow-cyan-500/15 min-h-[44px] min-w-[44px]"
          >
            <Phone className="w-4.5 h-4.5" />
          </a>
          <button 
            onClick={() => window.location.href = `/messages`}
            className="w-11 h-11 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white flex items-center justify-center transition-all duration-300 cursor-pointer min-h-[44px] min-w-[44px]"
          >
            <MessageSquare className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
