import React from 'react';
import { MapPin, Search, ArrowRightLeft, Target } from 'lucide-react';
import { useGeolocation } from '@/modules/location/useGeolocation';
import { useLocationStore } from '@/modules/location/locationStore';

interface LogisticsSearchAreaProps {
  pickup: string;
  drop: string;
  setPickup: (val: string) => void;
  setDrop: (val: string) => void;
  isBilingual?: boolean;
}

export function LogisticsSearchArea({ pickup, drop, setPickup, setDrop, isBilingual = false }: LogisticsSearchAreaProps) {
  const t = (en: string, bn: string) => isBilingual ? bn : en;
  const { detectLocation } = useGeolocation();
  const { city, isAutoDetected } = useLocationStore();

  const handleLocate = () => {
    detectLocation();
  };

  // Sync pickup with detected city if auto-detected recently
  React.useEffect(() => {
    if (isAutoDetected && city) {
      setPickup(city);
    }
  }, [city, isAutoDetected]);

  return (
    <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-black text-white uppercase tracking-wider">{t('Where to?', 'কোথায় যাবেন?')}</h3>
        <button 
          onClick={() => {
            const temp = pickup;
            setPickup(drop);
            setDrop(temp);
          }}
          className="p-2 rounded-full hover:bg-white/5 text-slate-400"
        >
          <ArrowRightLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
        <div className="relative group">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
          <input 
            type="text"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            placeholder={t('Pickup Location', 'পিকআপ লোকেশন')}
            className="w-full h-14 pl-12 pr-14 rounded-2xl bg-black/40 border border-white/5 text-white placeholder-slate-500 text-sm font-bold focus:border-cyan-400 transition-all outline-none"
          />
          <button 
            onClick={handleLocate}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 transition-all"
            title={t('Use my current location', 'আমার বর্তমান অবস্থান ব্যবহার করুন')}
          >
            <Target className="w-4 h-4" />
          </button>
        </div>

        <div className="relative group">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-500" />
          <input 
            type="text"
            value={drop}
            onChange={(e) => setDrop(e.target.value)}
            placeholder={t('Drop Location', 'গন্তব্য স্থান')}
            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-black/40 border border-white/5 text-white placeholder-slate-500 text-sm font-bold focus:border-rose-500 transition-all outline-none"
          />
        </div>
      </div>
    </div>
  );
}
